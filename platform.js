(() => {
  'use strict';

  const API_BASE = '/api';
  const ANONYMOUS_KEY = 'morain_anonymous_id';
  const EVENT_QUEUE_LIMIT = 20;
  let account = null;
  let resetToken = '';
  let eventQueue = [];
  let flushTimer = null;

  function cookieValue(name) {
    return document.cookie
      .split(';')
      .map((item) => item.trim())
      .find((item) => item.startsWith(`${name}=`))
      ?.slice(name.length + 1);
  }

  async function api(path, options = {}) {
    const method = options.method || 'GET';
    const headers = { accept: 'application/json', ...(options.headers || {}) };
    if (options.body !== undefined && !(options.body instanceof FormData)) {
      headers['content-type'] = 'application/json';
    }
    if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      const csrf = cookieValue('morain_csrf');
      if (csrf) headers['x-csrf-token'] = decodeURIComponent(csrf);
    }

    const response = await fetch(`${API_BASE}${path}`, {
      method,
      credentials: 'same-origin',
      headers,
      body: options.body === undefined
        ? undefined
        : options.body instanceof FormData
          ? options.body
          : JSON.stringify(options.body),
      keepalive: options.keepalive === true,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(payload.error || '请求失败，请稍后再试');
      error.status = response.status;
      error.requestId = payload.requestId;
      throw error;
    }
    return payload.data;
  }

  function getAnonymousId() {
    let value = localStorage.getItem(ANONYMOUS_KEY);
    if (!value) {
      value = crypto.randomUUID?.() || `anon_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(ANONYMOUS_KEY, value);
    }
    return value;
  }

  function track(name, properties = {}) {
    eventQueue.push({
      name,
      properties,
      pageUrl: `${location.pathname}${location.search}`,
      pageTitle: document.title,
      referrer: document.referrer,
      occurredAt: new Date().toISOString(),
    });
    if (eventQueue.length >= EVENT_QUEUE_LIMIT) flushEvents();
    else if (!flushTimer) flushTimer = window.setTimeout(flushEvents, 4000);
  }

  async function flushEvents() {
    window.clearTimeout(flushTimer);
    flushTimer = null;
    if (!eventQueue.length) return;
    const events = eventQueue.splice(0, EVENT_QUEUE_LIMIT);
    try {
      await api('/events/batch', {
        method: 'POST',
        body: { anonymousId: getAnonymousId(), events },
        keepalive: true,
      });
    } catch {
      eventQueue = [...events, ...eventQueue].slice(0, 60);
    }
  }

  function toast(message, type = 'success') {
    const region = document.getElementById('toastRegion');
    if (!region) return;
    const item = document.createElement('div');
    item.className = `toast toast-${type}`;
    item.textContent = message;
    region.appendChild(item);
    window.setTimeout(() => item.remove(), 3800);
  }

  function initials(name) {
    return String(name || 'M').trim().slice(0, 1).toUpperCase();
  }

  function formMessage(form, message = '', type = 'error') {
    const target = form?.querySelector('[data-form-message]');
    if (!target) return;
    target.textContent = message;
    target.dataset.type = message ? type : '';
  }

  function setBusy(form, busy) {
    const submit = form?.querySelector('[type="submit"]');
    if (!submit) return;
    submit.disabled = busy;
    submit.classList.toggle('is-loading', busy);
  }

  function setView(view) {
    document.querySelectorAll('[data-auth-view]').forEach((panel) => {
      panel.hidden = panel.dataset.authView !== view;
    });
    document.querySelectorAll('[data-auth-switch]').forEach((button) => {
      const active = button.dataset.authSwitch === view;
      button.classList.toggle('active', active);
      if (button.getAttribute('role') === 'tab') {
        button.setAttribute('aria-selected', String(active));
      }
    });
    if (view === 'account') populateAccount();
  }

  function openAuth(view = account ? 'account' : 'login') {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    setView(view);
    modal.hidden = false;
    document.body.classList.add('modal-open');
    const focusTarget = modal.querySelector(`[data-auth-view="${view}"] input`);
    window.setTimeout(() => focusTarget?.focus(), 50);
    track(view === 'account' ? 'account_opened' : 'auth_modal_opened', { view });
  }

  function closeAuth() {
    const modal = document.getElementById('authModal');
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove('modal-open');
  }

  function closeUserMenu() {
    const menu = document.getElementById('userMenu');
    const button = document.getElementById('userMenuBtn');
    if (menu) menu.hidden = true;
    button?.setAttribute('aria-expanded', 'false');
  }

  function renderAccountState() {
    const authButton = document.getElementById('authOpenBtn');
    const wrap = document.getElementById('userMenuWrap');
    const adminLink = document.getElementById('adminMenuLink');
    if (!authButton || !wrap) return;

    if (!account?.user) {
      authButton.hidden = false;
      wrap.hidden = true;
      return;
    }
    authButton.hidden = true;
    wrap.hidden = false;
    document.getElementById('userName').textContent = account.user.displayName;
    document.getElementById('userAvatar').textContent = initials(account.user.displayName);
    if (adminLink) {
      adminLink.hidden = !['operator', 'admin'].includes(account.user.role);
    }
  }

  function populateAccount() {
    if (!account?.user) return;
    const user = account.user;
    const form = document.getElementById('accountForm');
    document.getElementById('accountAvatar').textContent = initials(user.displayName);
    document.getElementById('accountName').textContent = user.displayName;
    document.getElementById('accountEmail').textContent = `${user.email}${user.emailVerified ? ' · 已验证' : ' · 待验证'}`;
    document.getElementById('accountPlan').textContent = account.subscription?.planName || '星尘访客';
    document.getElementById('accountPlanStatus').textContent = {
      active: '使用中',
      trialing: '试用中',
      past_due: '待续费',
      cancelled: '已取消',
      expired: '已到期',
    }[account.subscription?.status] || '使用中';
    if (!form) return;
    form.elements.displayName.value = user.displayName || '';
    form.elements.phone.value = user.phone || '';
    form.elements.locale.value = user.locale || 'zh-CN';
    form.elements.timezone.value = user.timezone || 'Asia/Shanghai';
    form.elements.marketingConsent.checked = Boolean(user.marketingConsent);
  }

  async function restoreSession() {
    try {
      const data = await api('/auth/session');
      account = data.authenticated ? { user: data.user, subscription: data.subscription } : null;
    } catch {
      account = null;
    }
    window.Morain.account = account;
    renderAccountState();
  }

  async function handleLogin(event) {
    event.preventDefault();
    const form = event.currentTarget;
    formMessage(form);
    setBusy(form, true);
    try {
      account = await api('/auth/login', {
        method: 'POST',
        body: {
          email: form.elements.email.value,
          password: form.elements.password.value,
        },
      });
      window.Morain.account = account;
      renderAccountState();
      closeAuth();
      toast(`欢迎回来，${account.user.displayName}`);
      track('login_completed');
      form.reset();
    } catch (error) {
      formMessage(form, error.message);
    } finally {
      setBusy(form, false);
    }
  }

  async function handleRegister(event) {
    event.preventDefault();
    const form = event.currentTarget;
    formMessage(form);
    setBusy(form, true);
    try {
      account = await api('/auth/register', {
        method: 'POST',
        body: {
          displayName: form.elements.displayName.value,
          email: form.elements.email.value,
          password: form.elements.password.value,
          termsAccepted: form.elements.termsAccepted.checked,
          marketingConsent: form.elements.marketingConsent.checked,
        },
      });
      window.Morain.account = account;
      renderAccountState();
      setView('account');
      toast('账户已创建，欢迎加入 Morain Lab');
      track('registration_completed');
      form.reset();
    } catch (error) {
      formMessage(form, error.message);
    } finally {
      setBusy(form, false);
    }
  }

  async function handleForgot(event) {
    event.preventDefault();
    const form = event.currentTarget;
    formMessage(form);
    setBusy(form, true);
    try {
      await api('/auth/forgot-password', {
        method: 'POST',
        body: { email: form.elements.email.value },
      });
      formMessage(form, '如果该邮箱已注册，重置邮件会很快送达。', 'success');
    } catch (error) {
      formMessage(form, error.message);
    } finally {
      setBusy(form, false);
    }
  }

  async function handleReset(event) {
    event.preventDefault();
    const form = event.currentTarget;
    formMessage(form);
    setBusy(form, true);
    try {
      await api('/auth/reset-password', {
        method: 'POST',
        body: { token: resetToken, password: form.elements.password.value },
      });
      history.replaceState({}, '', location.pathname);
      account = null;
      window.Morain.account = null;
      renderAccountState();
      setView('login');
      formMessage(document.getElementById('loginForm'), '密码已更新，请重新登录。', 'success');
    } catch (error) {
      formMessage(form, error.message);
    } finally {
      setBusy(form, false);
    }
  }

  async function handleAccountUpdate(event) {
    event.preventDefault();
    const form = event.currentTarget;
    formMessage(form);
    setBusy(form, true);
    try {
      account = await api('/account', {
        method: 'PATCH',
        body: {
          displayName: form.elements.displayName.value,
          phone: form.elements.phone.value,
          locale: form.elements.locale.value,
          timezone: form.elements.timezone.value,
          marketingConsent: form.elements.marketingConsent.checked,
        },
      });
      window.Morain.account = account;
      renderAccountState();
      populateAccount();
      formMessage(form, '账户信息已保存。', 'success');
    } catch (error) {
      formMessage(form, error.message);
    } finally {
      setBusy(form, false);
    }
  }

  async function logout() {
    try {
      await api('/auth/logout', { method: 'POST', body: {} });
    } catch {
      // Local state still clears if the server session already expired.
    }
    account = null;
    window.Morain.account = null;
    renderAccountState();
    closeUserMenu();
    toast('已安全退出');
  }

  async function handleEmailVerification(token) {
    try {
      await api('/auth/verify-email', { method: 'POST', body: { token } });
      history.replaceState({}, '', location.pathname);
      await restoreSession();
      toast('邮箱验证成功');
    } catch (error) {
      toast(error.message, 'error');
    }
  }

  function bindUI() {
    document.getElementById('authOpenBtn')?.addEventListener('click', () => openAuth('login'));
    document.querySelectorAll('[data-auth-close]').forEach((item) => item.addEventListener('click', closeAuth));
    document.querySelectorAll('[data-auth-switch]').forEach((item) => {
      item.addEventListener('click', () => setView(item.dataset.authSwitch));
    });
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('registerForm')?.addEventListener('submit', handleRegister);
    document.getElementById('forgotForm')?.addEventListener('submit', handleForgot);
    document.getElementById('resetForm')?.addEventListener('submit', handleReset);
    document.getElementById('accountForm')?.addEventListener('submit', handleAccountUpdate);

    document.getElementById('userMenuBtn')?.addEventListener('click', () => {
      const menu = document.getElementById('userMenu');
      const button = document.getElementById('userMenuBtn');
      const open = menu.hidden;
      menu.hidden = !open;
      button.setAttribute('aria-expanded', String(open));
    });
    document.querySelector('[data-account-action="profile"]')?.addEventListener('click', () => {
      closeUserMenu();
      openAuth('account');
    });
    document.querySelector('[data-account-action="logout"]')?.addEventListener('click', logout);
    document.addEventListener('click', (event) => {
      if (!event.target.closest('#userMenuWrap')) closeUserMenu();
      const tracked = event.target.closest('[data-track-event]');
      if (tracked) {
        track(tracked.dataset.trackEvent, {
          cta: tracked.dataset.trackCta || '',
          href: tracked.getAttribute('href') || '',
        });
      }
      const product = event.target.closest('.site-card, .lab-product-card a');
      if (product) {
        track('product_opened', {
          href: product.getAttribute('href') || '',
          label: product.querySelector('h3')?.textContent?.trim() || product.textContent.trim().slice(0, 80),
        });
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeAuth();
        closeUserMenu();
      }
    });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flushEvents();
    });
  }

  window.Morain = {
    account,
    api,
    notify: toast,
    openAuth,
    track,
  };

  document.addEventListener('DOMContentLoaded', async () => {
    bindUI();
    await restoreSession();
    track('page_view');

    const params = new URLSearchParams(location.search);
    const verificationToken = params.get('verify_email');
    resetToken = params.get('reset_password') || '';
    if (verificationToken) handleEmailVerification(verificationToken);
    else if (resetToken) openAuth('reset');
  });
})();
