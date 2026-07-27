(() => {
  'use strict';

  let currentAccount = null;
  let currentUserPage = 1;
  let currentLogView = 'audit';
  let selectedUser = null;
  let plans = [];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function csrfToken() {
    return decodeURIComponent(document.cookie.split(';').map((item) => item.trim()).find((item) => item.startsWith('morain_csrf='))?.slice(12) || '');
  }

  async function api(path, options = {}) {
    const method = options.method || 'GET';
    const headers = { accept: 'application/json', ...(options.headers || {}) };
    if (options.body !== undefined) headers['content-type'] = 'application/json';
    if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) headers['x-csrf-token'] = csrfToken();
    const response = await fetch(`/api${path}`, {
      method,
      credentials: 'same-origin',
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(payload.error || '请求失败');
      error.status = response.status;
      throw error;
    }
    return payload.data;
  }

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>'"]/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
    }[char]));
  }

  function formatNumber(value) {
    return Number(value || 0).toLocaleString('zh-CN');
  }

  function formatDate(value, includeTime = false) {
    if (!value) return '暂无';
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return '暂无';
    return new Intl.DateTimeFormat('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {}),
    }).format(date);
  }

  function toast(message, type = 'success') {
    const region = $('#adminToastRegion');
    if (!region) return;
    const item = document.createElement('div');
    item.className = `admin-toast ${type === 'error' ? 'error' : ''}`;
    item.textContent = message;
    region.appendChild(item);
    setTimeout(() => item.remove(), 3600);
  }

  function setLoginMessage(message = '') {
    $('#adminLoginMessage').textContent = message;
  }

  function setLoggedIn(account) {
    currentAccount = account;
    $('#adminGate').hidden = true;
    $('#adminApp').hidden = false;
    $('#adminCurrentUser').textContent = `${account.user.displayName} · ${account.user.role}`;
    loadPlans();
    loadOverview();
    checkHealth();
  }

  async function checkHealth() {
    const health = $('#apiHealth');
    try {
      await api('/health');
      health.className = 'api-health is-ok';
      health.innerHTML = '<i></i> API 正常';
    } catch {
      health.className = 'api-health is-error';
      health.innerHTML = '<i></i> API 异常';
    }
  }

  async function login(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const button = $('button[type="submit"]', form);
    setLoginMessage('');
    button.disabled = true;
    try {
      const data = await api('/auth/login', {
        method: 'POST',
        body: { email: form.elements.email.value, password: form.elements.password.value },
      });
      if (!['operator', 'admin'].includes(data.user.role)) {
        setLoginMessage('该账户没有运营后台权限');
        return;
      }
      setLoggedIn(data);
    } catch (error) {
      setLoginMessage(error.message);
    } finally {
      button.disabled = false;
    }
  }

  async function restoreSession() {
    try {
      const data = await api('/auth/session');
      if (data.authenticated && ['operator', 'admin'].includes(data.user.role)) {
        setLoggedIn(data);
      }
    } catch {
      // The gate remains visible until a valid session is available.
    }
  }

  async function logout() {
    try {
      await api('/auth/logout', { method: 'POST', body: {} });
    } catch {
      // Clear the local view even if the session has expired.
    }
    currentAccount = null;
    $('#adminApp').hidden = true;
    $('#adminGate').hidden = false;
  }

  function renderMetrics(totals) {
    const items = [
      ['总用户', totals.total_users, '账户总量', 'mint'],
      ['近 7 天新增', totals.new_users_7d, '新注册账户', 'cyan'],
      ['近 7 天活跃', totals.active_users_7d, '有登录关联事件', 'mint'],
      ['付费订阅', totals.paid_subscribers, '当前有效权益', 'yellow'],
      ['已验证邮箱', totals.verified_users, '信任基础', 'pink'],
      ['今日事件', totals.events_today, '埋点接收量', 'cyan'],
    ];
    $('#overviewMetrics').innerHTML = items.map(([label, value, meta, accent]) => `
      <article class="metric-card metric-accent-${accent}">
        <span class="metric-label">${label}</span>
        <strong class="metric-value">${formatNumber(value)}</strong>
        <span class="metric-meta">${meta}</span>
      </article>
    `).join('');
  }

  function renderOverviewTrend(rows) {
    const max = Math.max(1, ...rows.map((row) => Number(row.events || 0)));
    $('#overviewTrend').innerHTML = rows.map((row) => `
      <div class="trend-column" title="${row.date}">
        <div class="trend-bars">
          <i class="trend-bar" style="height:${Math.max(2, Number(row.events || 0) / max * 100)}%"></i>
          <i class="trend-bar visitors" style="height:${Math.max(2, Number(row.visitors || 0) / max * 100)}%"></i>
        </div>
        <span class="trend-date">${String(row.date).slice(5)}</span>
      </div>
    `).join('');
  }

  function renderSubscriptionMix(rows) {
    const max = Math.max(1, ...rows.map((row) => Number(row.users || 0)));
    $('#subscriptionMix').innerHTML = rows.map((row) => `
      <div class="mix-row">
        <div class="mix-info">
          <strong>${escapeHTML(row.name)}</strong>
          <div class="mix-track"><i style="width:${Number(row.users || 0) / max * 100}%"></i></div>
        </div>
        <strong class="mix-value">${formatNumber(row.users)}</strong>
      </div>
    `).join('') || '<span class="panel-caption">暂无订阅数据</span>';
  }

  function renderTopEvents(rows) {
    $('#topEvents').innerHTML = rows.map((row) => `
      <div class="signal-row">
        <div class="signal-info"><strong>${escapeHTML(row.event_name)}</strong><span>近 7 天</span></div>
        <strong class="signal-value">${formatNumber(row.count)}</strong>
      </div>
    `).join('') || '<span class="panel-caption">还没有事件</span>';
  }

  async function loadOverview() {
    try {
      const data = await api('/admin/overview');
      renderMetrics(data.totals);
      renderOverviewTrend(data.eventTrend);
      renderSubscriptionMix(data.subscriptionMix);
      renderTopEvents(data.topEvents);
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  async function loadPlans() {
    try {
      const data = await api('/admin/subscription-plans');
      plans = data.plans;
      const select = $('#userPlanFilter');
      if (select) {
        select.innerHTML = '<option value="">全部套餐</option>' + plans.map((plan) => `<option value="${escapeHTML(plan.code)}">${escapeHTML(plan.name)}</option>`).join('');
      }
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  function renderUsers(data) {
    $('#usersTotal').textContent = `共 ${formatNumber(data.total)} 位用户`;
    $('#usersTableBody').innerHTML = data.users.map((user) => `
      <tr>
        <td><div class="user-cell"><strong>${escapeHTML(user.displayName)}</strong><span>${escapeHTML(user.email)}</span></div></td>
        <td><span class="badge-role ${user.role === 'admin' ? 'admin' : ''}">${escapeHTML(user.role)}</span></td>
        <td><span class="badge-status ${escapeHTML(user.status)}">${user.status === 'active' ? '正常' : '已冻结'}</span></td>
        <td>${user.subscription ? `<span class="badge-plan">${escapeHTML(user.subscription.planName)}</span>` : '暂无'}</td>
        <td>${formatNumber(user.events30d)}</td>
        <td>${formatDate(user.createdAt)}</td>
        <td><button class="row-action" type="button" data-user-id="${user.id}">查看详情</button></td>
      </tr>
    `).join('') || '<tr><td colspan="7">暂无用户</td></tr>';
    const totalPages = Math.max(1, Math.ceil(data.total / data.limit));
    const start = Math.max(1, Math.min(data.page - 3, totalPages - 6));
    const end = Math.min(totalPages, start + 6);
    $('#usersPagination').innerHTML = Array.from({ length: end - start + 1 }, (_, index) => start + index).map((page) => `
      <button class="${page === data.page ? 'active' : ''}" type="button" data-user-page="${page}">${page}</button>
    `).join('');
  }

  async function loadUsers(page = currentUserPage) {
    currentUserPage = page;
    const form = $('#userFilterForm');
    const params = new URLSearchParams({
      page,
      limit: 25,
      search: form.elements.search.value,
      status: form.elements.status.value,
      plan: form.elements.plan.value,
    });
    try {
      renderUsers(await api(`/admin/users?${params.toString()}`));
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  function renderUserDrawer(data) {
    selectedUser = data;
    const user = data.user;
    const canEdit = currentAccount.user.role === 'admin';
    $('#userDrawerContent').innerHTML = `
      <section class="drawer-block drawer-profile">
        <h3>${escapeHTML(user.displayName)}</h3>
        ${[
          ['邮箱', user.email],
          ['角色', user.role],
          ['状态', user.status === 'active' ? '正常' : '已冻结'],
          ['邮箱验证', user.emailVerified ? '已验证' : '未验证'],
          ['注册时间', formatDate(user.createdAt, true)],
          ['最后登录', formatDate(user.lastLoginAt, true)],
        ].map(([label, value]) => `<div class="drawer-profile-row"><span>${label}</span><span>${escapeHTML(value)}</span></div>`).join('')}
      </section>
      <section class="drawer-block">
        <h3>运营操作</h3>
        ${canEdit ? `
          <div class="drawer-controls">
            <label>账户状态<select id="drawerStatus"><option value="active" ${user.status === 'active' ? 'selected' : ''}>正常</option><option value="suspended" ${user.status === 'suspended' ? 'selected' : ''}>冻结</option></select></label>
            <label>账户角色<select id="drawerRole"><option value="user" ${user.role === 'user' ? 'selected' : ''}>user</option><option value="operator" ${user.role === 'operator' ? 'selected' : ''}>operator</option><option value="admin" ${user.role === 'admin' ? 'selected' : ''}>admin</option></select></label>
            <label>订阅套餐<select id="drawerPlan">${plans.map((plan) => `<option value="${escapeHTML(plan.code)}" ${data.subscription?.planCode === plan.code ? 'selected' : ''}>${escapeHTML(plan.name)}</option>`).join('')}</select></label>
            <label>订阅到期时间<input id="drawerPeriodEnd" type="datetime-local" value="${data.subscription?.currentPeriodEnd ? new Date(data.subscription.currentPeriodEnd).toISOString().slice(0, 16) : ''}" /></label>
            <button type="button" id="saveUserOperations">保存变更</button>
          </div>
        ` : '<p class="panel-caption">当前角色仅可查看，账户变更需要管理员权限。</p>'}
      </section>
      <section class="drawer-block">
        <h3>最近行为</h3>
        <div class="drawer-events">${(data.recentEvents || []).map((event) => `<div class="drawer-event"><strong>${escapeHTML(event.event_name)}</strong><span>${formatDate(event.occurred_at, true)}</span></div>`).join('') || '<span class="panel-caption">暂无行为</span>'}</div>
      </section>
    `;
    $('#userDrawerBackdrop').hidden = false;
    $('#userDrawer').hidden = false;
    $('#saveUserOperations')?.addEventListener('click', saveUserOperations);
  }

  async function openUser(id) {
    try {
      renderUserDrawer(await api(`/admin/users/${id}`));
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  function closeUserDrawer() {
    $('#userDrawerBackdrop').hidden = true;
    $('#userDrawer').hidden = true;
    selectedUser = null;
  }

  async function saveUserOperations() {
    if (!selectedUser) return;
    const id = selectedUser.user.id;
    try {
      const nextStatus = $('#drawerStatus').value;
      const nextRole = $('#drawerRole').value;
      const nextPlan = $('#drawerPlan').value;
      const nextPeriodEnd = $('#drawerPeriodEnd').value
        ? new Date($('#drawerPeriodEnd').value).toISOString()
        : null;
      const currentPeriodEnd = selectedUser.subscription?.currentPeriodEnd
        ? new Date(selectedUser.subscription.currentPeriodEnd).toISOString()
        : null;
      const operations = [];
      if (nextStatus !== selectedUser.user.status) {
        operations.push(api(`/admin/users/${id}/status`, {
          method: 'PATCH',
          body: { status: nextStatus },
        }));
      }
      if (nextRole !== selectedUser.user.role) {
        operations.push(api(`/admin/users/${id}/role`, {
          method: 'PATCH',
          body: { role: nextRole },
        }));
      }
      if (nextPlan !== selectedUser.subscription?.planCode || nextPeriodEnd !== currentPeriodEnd) {
        operations.push(api(`/admin/users/${id}/subscription`, {
          method: 'PUT',
          body: {
            planCode: nextPlan,
            status: 'active',
            currentPeriodEnd: nextPeriodEnd,
          },
        }));
      }
      if (!operations.length) {
        toast('没有需要保存的变更');
        return;
      }
      await Promise.all(operations);
      toast('用户运营状态已更新');
      await loadUsers(currentUserPage);
      await openUser(id);
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  function renderAnalytics(data) {
    const lookup = Object.fromEntries(data.funnel.map((row) => [row.event_name, row]));
    const items = [
      ['page_view', '访问页面'],
      ['auth_modal_opened', '打开账户入口'],
      ['registration_completed', '完成注册'],
      ['login_completed', '完成登录'],
    ];
    $('#analyticsFunnel').innerHTML = items.map(([key, label]) => `
      <div class="funnel-card">
        <span>${label}</span>
        <strong>${formatNumber(lookup[key]?.actors || 0)}</strong>
        <small>${formatNumber(lookup[key]?.events || 0)} 次事件</small>
      </div>
    `).join('');
    $('#analyticsTimeline').innerHTML = data.timeline.slice(-60).reverse().map((row) => `
      <div class="timeline-row"><span>${String(row.date).slice(5)}</span><span>${escapeHTML(row.event_name)}</span><strong>${formatNumber(row.count)}</strong></div>
    `).join('') || '<span class="panel-caption">暂无事件</span>';
    $('#analyticsPages').innerHTML = data.pages.map((row) => `
      <div class="page-row"><div class="page-info"><strong>${escapeHTML(row.page_url || '/')}</strong><span>${formatNumber(row.visitors)} 位访客</span></div><strong class="page-value">${formatNumber(row.views)}</strong></div>
    `).join('') || '<span class="panel-caption">暂无页面数据</span>';
  }

  async function loadAnalytics() {
    try {
      renderAnalytics(await api(`/admin/analytics?days=${$('#analyticsDays').value}`));
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  function renderLogs(data) {
    if (currentLogView === 'audit') {
      $('#logsTableHead').innerHTML = '<tr><th>时间</th><th>操作者</th><th>动作</th><th>对象</th><th>结果</th><th>请求 ID</th></tr>';
      $('#logsTableBody').innerHTML = data.logs.map((log) => `<tr><td>${formatDate(log.created_at, true)}</td><td>${escapeHTML(log.actor_name || '系统')}</td><td>${escapeHTML(log.action)}</td><td>${escapeHTML(log.target_type || '')} ${escapeHTML(log.target_id || '')}</td><td>${escapeHTML(log.result)}</td><td>${escapeHTML(log.request_id || '')}</td></tr>`).join('');
      return;
    }
    $('#logsTableHead').innerHTML = '<tr><th>时间</th><th>级别</th><th>模块</th><th>消息</th><th>请求 ID</th></tr>';
    $('#logsTableBody').innerHTML = data.logs.map((log) => `<tr><td>${formatDate(log.created_at, true)}</td><td><span class="badge-status ${log.level === 'error' ? 'suspended' : 'active'}">${escapeHTML(log.level)}</span></td><td>${escapeHTML(log.module)}</td><td class="log-message" title="${escapeHTML(log.message)}">${escapeHTML(log.message)}</td><td>${escapeHTML(log.request_id || '')}</td></tr>`).join('');
  }

  async function loadLogs() {
    try {
      renderLogs(await api(currentLogView === 'audit' ? '/admin/audit-logs' : '/admin/application-logs'));
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  function switchView(view) {
    $$('.admin-nav button').forEach((button) => button.classList.toggle('active', button.dataset.adminView === view));
    $$('.admin-view').forEach((panel) => {
      const active = panel.dataset.adminPanel === view;
      panel.hidden = !active;
      panel.classList.toggle('active', active);
    });
    if (view === 'users') loadUsers();
    if (view === 'analytics') loadAnalytics();
    if (view === 'logs') loadLogs();
  }

  function bindUI() {
    $('#adminLoginForm').addEventListener('submit', login);
    $('#adminLogoutBtn').addEventListener('click', logout);
    $$('.admin-nav button').forEach((button) => button.addEventListener('click', () => switchView(button.dataset.adminView)));
    $('[data-refresh="overview"]')?.addEventListener('click', loadOverview);
    $('[data-refresh="users"]')?.addEventListener('click', () => loadUsers());
    $('[data-refresh="logs"]')?.addEventListener('click', loadLogs);
    $('#userFilterForm').addEventListener('submit', (event) => {
      event.preventDefault();
      loadUsers(1);
    });
    $('#usersTableBody').addEventListener('click', (event) => {
      const button = event.target.closest('[data-user-id]');
      if (button) openUser(button.dataset.userId);
    });
    $('#usersPagination').addEventListener('click', (event) => {
      const button = event.target.closest('[data-user-page]');
      if (button) loadUsers(Number(button.dataset.userPage));
    });
    $('#analyticsDays').addEventListener('change', loadAnalytics);
    $$('.log-tabs button').forEach((button) => button.addEventListener('click', () => {
      currentLogView = button.dataset.logView;
      $$('.log-tabs button').forEach((item) => item.classList.toggle('active', item === button));
      loadLogs();
    }));
    $('#closeUserDrawer').addEventListener('click', closeUserDrawer);
    $('#userDrawerBackdrop').addEventListener('click', closeUserDrawer);
  }

  document.addEventListener('DOMContentLoaded', () => {
    bindUI();
    restoreSession();
  });
})();
