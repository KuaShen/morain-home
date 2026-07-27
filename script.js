// =========================================
// Morain Lab — 想法孵化器
// Interactive Experience
// =========================================

// ---- DATA ----

const FEED_ITEMS = [
  { icon: '🎉', title: '<span>跨时代对话</span> 正式上线', meta: '来自 @Alice 的创意 · 3 个月前', status: '已上线', statusClass: 'feed-status-launched' },
  { icon: '🚀', title: '<span>AI 宠物成长日记</span> 进入内测', meta: '来自 @Bob 的创意 · 2 周前', status: '内测中', statusClass: 'feed-status-beta' },
  { icon: '🎯', title: '<span>一句话生成 H5</span> 突破 1 万用户', meta: '来自 @Carol 的创意 · 上周', status: '里程碑', statusClass: 'feed-status-milestone' },
  { icon: '✅', title: '<span>AI 简历优化器</span> 完成开发', meta: '来自 @Dave 的创意 · 3 天前', status: '已上线', statusClass: 'feed-status-launched' },
  { icon: '💡', title: '<span>情绪识别闹钟</span> 进入可行性分析', meta: '来自 @Eve 的创意 · 昨天', status: '分析中', statusClass: 'feed-status-beta' },
  { icon: '🔥', title: '<span>AI 法律助手</span> 获得 500 个点赞', meta: '来自 @Frank 的创意 · 2 天前', status: '热门', statusClass: 'feed-status-milestone' },
  { icon: '🎉', title: '<span>跨时代对话</span> 正式上线', meta: '来自 @Alice 的创意 · 3 个月前', status: '已上线', statusClass: 'feed-status-launched' },
  { icon: '🚀', title: '<span>AI 宠物成长日记</span> 进入内测', meta: '来自 @Bob 的创意 · 2 周前', status: '内测中', statusClass: 'feed-status-beta' },
  { icon: '🎯', title: '<span>一句话生成 H5</span> 突破 1 万用户', meta: '来自 @Carol 的创意 · 上周', status: '里程碑', statusClass: 'feed-status-milestone' },
  { icon: '✅', title: '<span>AI 简历优化器</span> 完成开发', meta: '来自 @Dave 的创意 · 3 天前', status: '已上线', statusClass: 'feed-status-launched' },
  { icon: '💡', title: '<span>情绪识别闹钟</span> 进入可行性分析', meta: '来自 @Eve 的创意 · 昨天', status: '分析中', statusClass: 'feed-status-beta' },
  { icon: '🔥', title: '<span>AI 法律助手</span> 获得 500 个点赞', meta: '来自 @Frank 的创意 · 2 天前', status: '热门', statusClass: 'feed-status-milestone' },
];

const IDEAS = [
  {
    emoji: '🐾', category: 'ai', badge: 'AI 产品', badgeClass: 'idea-badge-ai',
    title: 'AI 宠物情感翻译器',
    desc: '通过分析宠物叫声和面部表情，实时翻译成人类语言，让你知道毛孩子在想什么。',
    author: 'Alice', time: '2026', likes: 129, favs: 88, comments: 26,
    status: '正在开发', statusClass: 'idea-status-building',
    progress: 72, accent: '#8B5CF6'
  },
  {
    emoji: '😴', category: 'life', badge: '生活', badgeClass: 'idea-badge-life',
    title: '梦境识别手机',
    desc: '通过脑电波监测和AI分析，记录并可视化你的梦境内容，甚至可以重放关键片段。',
    author: 'Bob', time: '2026', likes: 98, favs: 45, comments: 31,
    status: '设计中', statusClass: 'idea-status-designing',
    progress: 35, accent: '#10B981'
  },
  {
    emoji: '💼', category: 'tech', badge: '科技', badgeClass: 'idea-badge-tech',
    title: 'AI 法律助手',
    desc: '输入你的法律问题，AI自动分析并提供相关法条、判例参考，让法律不再高不可攀。',
    author: 'Carol', time: '2026', likes: 256, favs: 134, comments: 52,
    status: '设计中', statusClass: 'idea-status-designing',
    progress: 28, accent: '#06B6D4'
  },
  {
    emoji: '🎮', category: 'game', badge: '游戏', badgeClass: 'idea-badge-game',
    title: 'AI 生成 H5 小游戏',
    desc: '输入一句话描述，AI 自动生成一个可玩的 H5 小游戏，无需任何编程知识。',
    author: 'Dave', time: '2026', likes: 312, favs: 198, comments: 67,
    status: '已上线', statusClass: 'idea-status-launched',
    progress: 100, accent: '#F472B6'
  },
  {
    emoji: '🌈', category: 'design', badge: '设计', badgeClass: 'idea-badge-design',
    title: '情绪可视化壁纸',
    desc: '根据你的每日心情和天气数据，AI 动态生成独一无二的手机壁纸。',
    author: 'Eve', time: '2026', likes: 87, favs: 52, comments: 18,
    status: '想法', statusClass: 'idea-status-idea',
    progress: 0, accent: '#FBBF24'
  },
  {
    emoji: '📖', category: 'ai', badge: 'AI 产品', badgeClass: 'idea-badge-ai',
    title: 'AI 个人传记生成器',
    desc: '通过对话式采访，AI 帮你整理人生故事，自动生成图文并茂的个人传记。',
    author: 'Frank', time: '2026', likes: 145, favs: 92, comments: 33,
    status: '开发中', statusClass: 'idea-status-building',
    progress: 55, accent: '#8B5CF6'
  },
  {
    emoji: '🏠', category: 'life', badge: '生活', badgeClass: 'idea-badge-life',
    title: '智能家居情感灯',
    desc: '根据你的情绪状态、音乐和室内光线，自动调节灯光颜色和亮度，营造氛围。',
    author: 'Grace', time: '2026', likes: 76, favs: 41, comments: 15,
    status: '想法', statusClass: 'idea-status-idea',
    progress: 0, accent: '#10B981'
  },
  {
    emoji: '🎵', category: 'tech', badge: '科技', badgeClass: 'idea-badge-tech',
    title: 'AI 音乐情绪治疗仪',
    desc: '通过脑波检测和AI分析，实时生成最适合当前情绪状态的治疗音乐。',
    author: 'Henry', time: '2026', likes: 203, favs: 117, comments: 44,
    status: '设计中', statusClass: 'idea-status-designing',
    progress: 42, accent: '#06B6D4'
  },
  {
    emoji: '📸', category: 'ai', badge: 'AI 产品', badgeClass: 'idea-badge-ai',
    title: 'AI 老照片修复动画',
    desc: '不仅修复老照片清晰度，还能让它动起来——微笑、眨眼、转头，让回忆重获生命。',
    author: 'Iris', time: '2026', likes: 178, favs: 103, comments: 39,
    status: '已上线', statusClass: 'idea-status-launched',
    progress: 100, accent: '#8B5CF6'
  },
];

const LEADERBOARDS = {
  hot: [
    { rank: 1, title: 'AI 生成 H5 小游戏', meta: '312 点赞 · @Dave', score: 98 },
    { rank: 2, title: 'AI 法律助手', meta: '256 点赞 · @Carol', score: 92 },
    { rank: 3, title: 'AI 音乐情绪治疗仪', meta: '203 点赞 · @Henry', score: 87 },
    { rank: 4, title: 'AI 老照片修复动画', meta: '178 点赞 · @Iris', score: 83 },
    { rank: 5, title: 'AI 个人传记生成器', meta: '145 点赞 · @Frank', score: 79 },
    { rank: 6, title: 'AI 宠物情感翻译器', meta: '129 点赞 · @Alice', score: 74 },
    { rank: 7, title: '梦境识别手机', meta: '98 点赞 · @Bob', score: 68 },
    { rank: 8, title: '情绪可视化壁纸', meta: '87 点赞 · @Eve', score: 62 },
  ],
  value: [
    { rank: 1, title: 'AI 法律助手', meta: '商业价值评估: ★★★★★', score: 96 },
    { rank: 2, title: 'AI 简历优化器', meta: '商业价值评估: ★★★★★', score: 94 },
    { rank: 3, title: 'AI 生成 H5 小游戏', meta: '商业价值评估: ★★★★☆', score: 88 },
    { rank: 4, title: 'AI 个人传记生成器', meta: '商业价值评估: ★★★★☆', score: 85 },
    { rank: 5, title: 'AI 老照片修复动画', meta: '商业价值评估: ★★★★☆', score: 82 },
    { rank: 6, title: 'AI 音乐情绪治疗仪', meta: '商业价值评估: ★★★☆☆', score: 76 },
    { rank: 7, title: 'AI 宠物情感翻译器', meta: '商业价值评估: ★★★☆☆', score: 72 },
    { rank: 8, title: '智能家居情感灯', meta: '商业价值评估: ★★★☆☆', score: 65 },
  ],
  wild: [
    { rank: 1, title: '梦境电影院', meta: '把别人的梦拍成电影卖给他', score: 99 },
    { rank: 2, title: 'AI 虚拟分身相亲', meta: '让AI替你去相亲，你只负责约会', score: 95 },
    { rank: 3, title: '宠物 CEO', meta: '让宠物当公司的名义CEO', score: 91 },
    { rank: 4, title: '时间银行', meta: '存储多余时间，兑换别人的时间', score: 87 },
    { rank: 5, title: 'AI 替你吵架', meta: '不想吵架？AI帮你文明怼人', score: 84 },
    { rank: 6, title: '和梵高一起画画', meta: 'AI复现已故艺术家的创作风格', score: 80 },
    { rank: 7, title: '气味下载器', meta: '下载数字气味，通过设备释放', score: 76 },
    { rank: 8, title: '宇宙快递', meta: '太空无人机配送——正在研究中', score: 71 },
  ],
  easy: [
    { rank: 1, title: '情绪可视化壁纸', meta: '预计 2 周 · 单人可完成', score: 97 },
    { rank: 2, title: 'AI 每日运势生成器', meta: '预计 3 天 · 调用API即可', score: 94 },
    { rank: 3, title: '智能家居情感灯', meta: '预计 1 个月 · 有开源方案', score: 89 },
    { rank: 4, title: '一句话生成打卡页面', meta: '预计 1 周 · 模板化开发', score: 85 },
    { rank: 5, title: 'AI 微信群聊总结', meta: '预计 2 周 · 调用LLM API', score: 82 },
    { rank: 6, title: '个人图书馆小程序', meta: '预计 3 周 · 渐进式开发', score: 78 },
    { rank: 7, title: '每日AI绘画挑战', meta: '预计 1 周 · 套壳开发', score: 74 },
    { rank: 8, title: 'AI 口播稿生成器', meta: '预计 5 天 · 模板+AI', score: 70 },
  ],
};

const LAB_PRODUCTS = [
  { tag: '已上线', tagClass: 'launched', title: '跨时代对话', desc: '与不同年代的人聊同一个世界。AI 时代人格模拟平台，体验跨越时空的对话。', link: '/chronotalk' },
  { tag: '已上线', tagClass: 'launched', title: '游戏攻略大全', desc: '覆盖热门端游、手游、桌游的完整攻略库，从入门到精通。', link: 'https://game.morain.xin' },
  { tag: '已上线', tagClass: 'launched', title: '美妆安利', desc: '真实美妆产品评测、妆教教程与成分分析，帮你找到最适合的产品。', link: 'https://beauty.morain.xin' },
  { tag: '已上线', tagClass: 'launched', title: 'AI 模板市场', desc: '精选 AI 提示词模板、工作流与自动化方案，提升你的生产效率。', link: 'https://templates.morain.xin' },
  { tag: '已上线', tagClass: 'launched', title: '桌宠下载', desc: '各式桌面宠物下载，为你的电脑增添活力与趣味。', link: 'https://pets.morain.xin' },
  { tag: '开发中', tagClass: 'building', title: 'AI 宠物成长日记', desc: '记录宠物的成长轨迹，AI自动生成每日成长报告和回忆视频。', link: '#' },
  { tag: '设计中', tagClass: 'designing', title: 'AI 法律助手', desc: '让每个人都能享受便捷的法律咨询服务，降低法律门槛。', link: '#' },
  { tag: '设计中', tagClass: 'designing', title: '情绪识别闹钟', desc: '根据你的睡眠周期和情绪状态，在最合适的时间唤醒你。', link: '#' },
];

// ---- AURORA CANVAS ----

class AuroraCanvas {
  constructor() {
    this.canvas = document.getElementById('auroraCanvas');
    this.ctx = this.canvas?.getContext('2d');
    this.particles = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!this.canvas || !this.ctx || this.reducedMotion) return;
    this.resize();
    this.createParticles();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  createParticles() {
    const count = Math.min(96, Math.floor(this.width * this.height / 10500));
    this.particles = Array.from({ length: count }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28 - 0.08,
      size: Math.random() * 1.8 + 0.7,
      alpha: Math.random() * 0.36 + 0.08,
      hue: [155, 184, 198, 326, 48][Math.floor(Math.random() * 5)],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.025 + 0.006,
    }));
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createParticles();
    }, { passive: true });
    window.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX / this.width - 0.5) * 2;
      this.mouseY = (e.clientY / this.height - 0.5) * 2;
    }, { passive: true });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.particles.forEach(p => {
      p.x += p.vx + this.mouseX * 0.08;
      p.y += p.vy + this.mouseY * 0.04;
      p.pulse += p.pulseSpeed;

      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      const alpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `hsla(${p.hue}, 82%, 78%, ${alpha})`;
      this.ctx.fill();
    });

    // Draw connections
    this.particles.forEach((a, i) => {
      for (let j = i + 1; j < this.particles.length; j++) {
        const b = this.particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 138) {
          const alpha = (1 - dist / 138) * 0.075;
          this.ctx.beginPath();
          this.ctx.moveTo(a.x, a.y);
          this.ctx.lineTo(b.x, b.y);
          this.ctx.strokeStyle = `hsla(${(a.hue + b.hue) / 2}, 70%, 74%, ${alpha})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    });

    requestAnimationFrame(() => this.animate());
  }
}

// ---- PURE CSS STARS (hero background) ----

function createHeroStars() {
  const container = document.getElementById('heroStars');
  if (!container) return;
  const count = window.innerWidth < 640 ? 38 : 72;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const isCross = i % 11 === 0;
    Object.assign(star.style, {
      width: size + 'px',
      height: size + 'px',
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      color: `hsl(${[155, 184, 326, 48][Math.floor(Math.random() * 4)]} 95% 84%)`,
      animation: `twinkle ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 3}s infinite`,
    });
    star.className = `hero-star${isCross ? ' cross' : ''}`;
    container.appendChild(star);
  }
}

// Inject twinkle keyframes
const twinkleStyle = document.createElement('style');
twinkleStyle.textContent = `
@keyframes twinkle {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.3); }
}
`;
document.head.appendChild(twinkleStyle);

// ---- FEED TICKER ----

function renderFeed() {
  const track = document.getElementById('feedTrack');
  if (!track) return;

  // Duplicate items for smooth infinite scroll
  const allItems = [...FEED_ITEMS, ...FEED_ITEMS];
  track.innerHTML = allItems.map(item => `
    <div class="feed-item">
      <div class="feed-item-icon">${item.icon}</div>
      <div class="feed-item-content">
        <div class="feed-item-title">${item.title}</div>
        <div class="feed-item-meta">${item.meta}</div>
      </div>
      <span class="feed-item-status ${item.statusClass}">${item.status}</span>
    </div>
  `).join('');
}

// ---- IDEAS GRID ----

function renderIdeas(filter = 'all') {
  const grid = document.getElementById('ideasGrid');
  if (!grid) return;

  const filtered = filter === 'all' ? IDEAS : IDEAS.filter(idea => idea.category === filter);

  grid.innerHTML = filtered.map((idea, i) => {
    const heartIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
    const starIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    const msgIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;

    const progressHtml = idea.status !== '想法' ? `
      <div class="idea-card-progress">
        <div class="idea-card-progress-bar">
          <div class="idea-card-progress-fill" style="width:${idea.progress}%; --card-accent:${idea.accent}"></div>
        </div>
        <div class="idea-card-progress-text">${idea.progress}%</div>
      </div>
    ` : '';

    return `
      <div class="idea-card card-reveal" style="transition-delay:${i * 0.06}s; --card-accent:${idea.accent}">
        <div class="idea-card-header">
          <div class="idea-card-emoji">${idea.emoji}</div>
          <div class="idea-card-badges">
            <span class="idea-card-badge ${idea.badgeClass}">${idea.badge}</span>
          </div>
        </div>
        <h3 class="idea-card-title">${idea.title}</h3>
        <p class="idea-card-desc">${idea.desc}</p>
        <div class="idea-card-meta">
          <span>👤 ${idea.author}</span>
          <span>📅 ${idea.time}</span>
        </div>
        <div class="idea-card-status ${idea.statusClass}">
          ${idea.status === '正在开发' ? '🔧' : idea.status === '已上线' ? '🟢' : idea.status === '设计中' ? '🟡' : '💡'}
          ${idea.status}
        </div>
        ${progressHtml}
        <div class="idea-card-footer">
          <div class="idea-card-actions">
            <button class="idea-card-action idea-like-btn" type="button" data-idea-title="${idea.title}" aria-label="点赞 ${idea.title}">
              ${heartIcon} ${idea.likes}
            </button>
            <span class="idea-card-action">
              ${starIcon} ${idea.favs}
            </span>
            <span class="idea-card-action">
              ${msgIcon} ${idea.comments}
            </span>
          </div>
          <button class="idea-card-claim" type="button" data-idea-title="${idea.title}">
            🚀 我要开发
          </button>
        </div>
      </div>
    `;
  }).join('');

  // Re-observe new cards
  observeCards();
}

// ---- LEADERBOARD ----

function renderLeaderboard(tab = 'hot') {
  const grid = document.getElementById('leaderboardGrid');
  if (!grid) return;

  const items = LEADERBOARDS[tab] || LEADERBOARDS.hot;
  grid.innerHTML = items.map(item => {
    const rankClass = item.rank <= 3 ? `lb-rank-${item.rank}` : 'lb-rank-other';
    return `
      <div class="lb-card card-reveal">
        <div class="lb-rank ${rankClass}">${item.rank <= 3 ? ['🥇','🥈','🥉'][item.rank - 1] : item.rank}</div>
        <div class="lb-content">
          <div class="lb-title">${item.title}</div>
          <div class="lb-meta">${item.meta}</div>
        </div>
        <div class="lb-score">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" opacity="0.6"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          ${item.score}
        </div>
      </div>
    `;
  }).join('');

  observeCards();
}

// ---- AI SCORING ----

function simulateAIAnalysis(idea) {
  const scores = {
    innovation: Math.floor(Math.random() * 2) + 3,
    difficulty: Math.floor(Math.random() * 2) + 2,
    potential: Math.floor(Math.random() * 2) + 4,
    competition: Math.floor(Math.random() * 2) + 2,
    value: Math.floor(Math.random() * 2) + 3,
  };
  const cost = Math.floor(Math.random() * 15000) + 2000;
  const timeline = Math.floor(Math.random() * 4) + 1;

  return {
    name: idea,
    productPosition: ['个人工具', '社交平台', 'SaaS 服务', '硬件产品', '内容平台'][Math.floor(Math.random() * 5)],
    targetUser: ['Z 世代用户', '职场人群', '学生群体', '创作者', '中小企业'][Math.floor(Math.random() * 5)],
    businessModel: ['免费 + 增值订阅', '一次性购买', '广告变现', '企业授权', '交易抽成'][Math.floor(Math.random() * 5)],
    techStack: ['LLM + 前端应用', 'AI 模型微调 + App', 'Web App + 云函数', '嵌入式 AI + 硬件', 'API 聚合工具'][Math.floor(Math.random() * 5)],
    mvp: ['2-4 周 MVP', '1-2 周原型验证', '1 个月最小可行产品', '3 个月完整产品', '2 周核心功能'][Math.floor(Math.random() * 5)],
    innovation: scores.innovation,
    difficulty: scores.difficulty,
    potential: scores.potential,
    competition: scores.competition,
    value: scores.value,
    cost: cost.toLocaleString(),
    timeline: `${timeline} ${['周', '个月', '个月', '个月'][Math.min(timeline - 1, 3)]}`,
  };
}

function renderStars(count, max = 5) {
  return Array.from({ length: max }, (_, i) =>
    `<span class="${i < count ? '' : 'empty'}">★</span>`
  ).join('');
}

function escapeHTML(value) {
  return String(value).replace(/[&<>'"]/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[character]);
}

function showAIResult(result) {
  const container = document.getElementById('aiResult');
  if (!container) return;
  const safeName = escapeHTML(result.name);
  container.innerHTML = `
    <div class="ai-result-content">
      <div class="ai-result-item full" style="border:none; background:transparent; padding:0 0 8px 0;">
        <div class="ai-result-value" style="font-size:18px;">「${safeName}」</div>
      </div>
      <div class="ai-result-item">
        <div class="ai-result-label">产品定位</div>
        <div class="ai-result-value">${result.productPosition}</div>
      </div>
      <div class="ai-result-item">
        <div class="ai-result-label">目标用户</div>
        <div class="ai-result-value">${result.targetUser}</div>
      </div>
      <div class="ai-result-item">
        <div class="ai-result-label">商业模式</div>
        <div class="ai-result-value">${result.businessModel}</div>
      </div>
      <div class="ai-result-item">
        <div class="ai-result-label">技术路线</div>
        <div class="ai-result-value">${result.techStack}</div>
      </div>
      <div class="ai-result-item">
        <div class="ai-result-label">MVP 周期</div>
        <div class="ai-result-value">${result.mvp}</div>
      </div>
      <div class="ai-result-item">
        <div class="ai-result-label">创新度</div>
        <div class="ai-result-stars">${renderStars(result.innovation)}</div>
      </div>
      <div class="ai-result-item">
        <div class="ai-result-label">实现难度</div>
        <div class="ai-result-stars">${renderStars(result.difficulty)}</div>
      </div>
      <div class="ai-result-item">
        <div class="ai-result-label">市场潜力</div>
        <div class="ai-result-stars">${renderStars(result.potential)}</div>
      </div>
      <div class="ai-result-item">
        <div class="ai-result-label">竞争程度</div>
        <div class="ai-result-stars">${renderStars(result.competition)}</div>
      </div>
      <div class="ai-result-item">
        <div class="ai-result-label">商业价值</div>
        <div class="ai-result-stars">${renderStars(result.value)}</div>
      </div>
      <div class="ai-result-item">
        <div class="ai-result-label">预计成本</div>
        <div class="ai-result-value" style="color:var(--aurora-2)">¥${result.cost}</div>
      </div>
      <div class="ai-result-item">
        <div class="ai-result-label">预计周期</div>
        <div class="ai-result-value" style="color:var(--aurora-1)">${result.timeline}</div>
      </div>
    </div>
  `;
}

// ---- LAB PRODUCTS ----

function renderLabProducts() {
  const grid = document.getElementById('labProductsGrid');
  if (!grid) return;

  grid.innerHTML = LAB_PRODUCTS.map((p, i) => `
    <a href="${p.link}" target="${p.link.startsWith('http') ? '_blank' : '_self'}"${p.link.startsWith('http') ? ' rel="noopener"' : ''} class="lab-product-card card-reveal" style="transition-delay:${i * 0.06}s">
      <span class="lab-product-tag ${p.tagClass}">${p.tag}</span>
      <h4 class="lab-product-title">${p.title}</h4>
      <p class="lab-product-desc">${p.desc}</p>
      <span class="lab-product-link">查看详情 →</span>
    </a>
  `).join('');

  observeCards();
}

// ---- SCROLL REVEAL ----

function observeSections() {
  const sections = document.querySelectorAll('.feed-section, .ideas-section, .lifecycle-section, .leaderboard-section, .ai-scoring-section, .lab-section, .sites-section');
  sections.forEach(s => s.classList.add('section-reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  sections.forEach(s => observer.observe(s));
}

function observeCards() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.card-reveal:not(.visible)').forEach(el => observer.observe(el));
}

// ---- HERO COUNTER ----

function animateCounters() {
  const counters = document.querySelectorAll('.hero-stat-num');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target);
    const duration = 2000;
    const step = Math.max(1, Math.floor(target / 60));
    let current = 0;

    const update = () => {
      current += step;
      if (current >= target) {
        counter.textContent = target.toLocaleString();
        return;
      }
      counter.textContent = current.toLocaleString();
      requestAnimationFrame(update);
    };

    // Start when visible
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        update();
        observer.unobserve(counter);
      }
    }, { threshold: 0.5 });

    observer.observe(counter);
  });
}

// ---- SITE CARD MOUSE GLOW ----

function initSiteCardGlow() {
  document.querySelectorAll('.site-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });
}

// ---- FILTERS / TABS ----

function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      renderIdeas(btn.dataset.filter);
      window.Morain?.track('idea_filter_changed', { filter: btn.dataset.filter });
    });
  });
}

function initLeaderboardTabs() {
  const tabs = document.querySelectorAll('.lb-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-pressed', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-pressed', 'true');
      renderLeaderboard(tab.dataset.lb);
    });
  });
}

// ---- AI INPUT ----

function initAIInput() {
  const input = document.getElementById('ideaInput');
  const btn = document.getElementById('analyzeBtn');
  if (!input || !btn) return;

  const analyze = () => {
    const text = input.value.trim();
    if (!text) {
      input.style.borderColor = 'rgba(244,63,94,0.4)';
      input.focus();
      return;
    }
    input.style.borderColor = '';
    window.Morain?.track('ai_analysis_requested', { length: text.length });
    const result = simulateAIAnalysis(text);
    showAIResult(result);
  };

  btn.addEventListener('click', analyze);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') analyze();
  });
}

// ---- HEADER SCROLL ----

function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        header.classList.toggle('scrolled', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ---- MOBILE MENU ----

function initMobileMenu() {
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  if (!menuBtn || !nav) return;

  const setMenuState = (isOpen) => {
    nav.classList.toggle('nav-open', isOpen);
    menuBtn.setAttribute('aria-expanded', String(isOpen));
    menuBtn.setAttribute('aria-label', isOpen ? '关闭导航菜单' : '打开导航菜单');
  };

  menuBtn.addEventListener('click', () => {
    setMenuState(!nav.classList.contains('nav-open'));
  });

  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      setMenuState(false);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('nav-open')) {
      setMenuState(false);
      menuBtn.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) setMenuState(false);
  }, { passive: true });
}

// ---- DREAM SCENE INTERACTION ----

function initWonderScene() {
  const scene = document.getElementById('wonderScene');
  const hero = document.getElementById('hero');
  const sparkBtn = document.getElementById('sparkBtn');
  const planet = document.getElementById('dreamPlanet');
  if (!scene || !hero || !sparkBtn || !planet) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      scene.style.setProperty('--scene-x', `${x * 18}px`);
      scene.style.setProperty('--scene-y', `${y * 12}px`);
    }, { passive: true });

    hero.addEventListener('pointerleave', () => {
      scene.style.setProperty('--scene-x', '0px');
      scene.style.setProperty('--scene-y', '0px');
    }, { passive: true });
  }

  sparkBtn.addEventListener('click', () => {
    window.Morain?.track('hero_cta_clicked', { cta: 'spark_idea' });
    const colors = ['#72f2c5', '#65d9ff', '#ff89c2', '#ffe36e'];
    const planetRect = planet.getBoundingClientRect();
    const originX = planetRect.left + planetRect.width * 0.5;
    const originY = planetRect.top + planetRect.height * 0.5;
    const amount = window.innerWidth < 640 ? 7 : 12;

    hero.classList.remove('sparked');
    requestAnimationFrame(() => {
      hero.classList.add('sparked');
      window.setTimeout(() => hero.classList.remove('sparked'), 900);
    });

    for (let i = 0; i < amount; i += 1) {
      const spark = document.createElement('span');
      const angle = (Math.PI * 2 * i) / amount + Math.random() * 0.3;
      const distance = 70 + Math.random() * 130;
      spark.className = 'spark-burst';
      spark.style.setProperty('--spark-x', `${originX}px`);
      spark.style.setProperty('--spark-y', `${originY}px`);
      spark.style.setProperty('--spark-dx', `${Math.cos(angle) * distance}px`);
      spark.style.setProperty('--spark-dy', `${Math.sin(angle) * distance}px`);
      spark.style.setProperty('--spark-color', colors[i % colors.length]);
      document.body.appendChild(spark);
      spark.addEventListener('animationend', () => spark.remove(), { once: true });
    }

    sparkBtn.blur();
  });
}

function initIdeaActions() {
  const ideasGrid = document.getElementById('ideasGrid');
  if (!ideasGrid) return;

  ideasGrid.addEventListener('click', (event) => {
    const likeButton = event.target.closest('.idea-like-btn');
    if (likeButton) {
      likeButton.classList.toggle('active');
      likeButton.setAttribute('aria-pressed', String(likeButton.classList.contains('active')));
      window.Morain?.track('idea_liked', { idea: likeButton.dataset.ideaTitle });
      return;
    }

    const claimButton = event.target.closest('.idea-card-claim');
    if (!claimButton) return;
    if (!window.Morain?.account) {
      window.Morain?.openAuth('register');
      return;
    }
    window.Morain?.track('idea_claimed', {
      idea: claimButton.dataset.ideaTitle,
    });
    window.Morain?.notify(`已记录「${claimButton.dataset.ideaTitle}」的开发意向`);
  });
}

// ---- INIT ----

document.addEventListener('DOMContentLoaded', () => {
  new AuroraCanvas();
  createHeroStars();
  renderFeed();
  renderIdeas('all');
  renderLeaderboard('hot');
  renderLabProducts();
  observeSections();
  animateCounters();
  initSiteCardGlow();
  initFilters();
  initLeaderboardTabs();
  initAIInput();
  initHeaderScroll();
  initMobileMenu();
  initWonderScene();
  initIdeaActions();

  console.log('✦ Morain Lab — Idea Incubator loaded');
});
