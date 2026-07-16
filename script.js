// Blog data
const blogArticles = [
  { tag: 'AI工具', tagColor: '#60a5fa', title: '2026 最值得尝试的 10 款免费 AI 写作工具', desc: '从 ChatGPT 到 Claude，从国内到海外，帮你找到最适合自己的 AI 写作伙伴。' },
  { tag: '游戏攻略', tagColor: '#e94560', title: '《艾尔登法环》DLC 全 Boss 逃课打法指南', desc: '手残党福音！不用硬刚，合理利用机制也能通关。' },
  { tag: '美妆推荐', tagColor: '#f472b6', title: '油皮夏季底妆攻略：实测 8 款持妆粉底液', desc: '高温不脱妆、控油不拔干，选出最适合油皮的夏季粉底。' },
  { tag: 'AI模板', tagColor: '#818cf8', title: '一键生成小红书爆款文案的 AI 提示词模板', desc: '直接用这些模板，让 AI 帮你写出高互动率的种草文案。' },
  { tag: '桌宠', tagColor: '#fb923c', title: '2026 最火桌面宠物排行榜，你的桌面还缺一只', desc: '从二次元萌宠到像素风格，总有一款适合你的桌面环境。' },
  { tag: '效率工具', tagColor: '#4ade80', title: '5 个提升编程效率的 Chrome 插件推荐', desc: '这些免费插件能让你的开发效率翻倍，每个程序员都该装上。' },
];

// Render blog articles
const blogGrid = document.getElementById('blogGrid');
if (blogGrid) {
  blogArticles.forEach((article, i) => {
    const card = document.createElement('div');
    card.className = 'blog-card';
    card.style.transitionDelay = `${i * 0.08}s`;
    card.innerHTML = `
      <span class="blog-tag" style="background:${article.tagColor}">${article.tag}</span>
      <h3>${article.title}</h3>
      <p>${article.desc}</p>
    `;
    blogGrid.appendChild(card);
  });
}

// Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    nav.classList.toggle('nav-open');
  });
  // Close menu on nav link click
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('nav-open'));
  });
}

// Scroll animations (Intersection Observer)
const observeElements = (selector, options = {}) => {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  const defaults = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  const config = { ...defaults, ...options };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, config);

  elements.forEach(el => observer.observe(el));
};

// Observe sections, cards, and blog cards
observeElements('.section');
observeElements('.site-card', { threshold: 0.05 });
observeElements('.feature-card', { threshold: 0.05 });
observeElements('.blog-card', { threshold: 0.05 });

// Header scroll effect
const header = document.getElementById('header');
if (header) {
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 80) {
      header.style.borderBottomColor = 'rgba(255,255,255,0.1)';
      header.style.background = 'rgba(10,10,26,0.95)';
    } else {
      header.style.borderBottomColor = 'var(--border-color)';
      header.style.background = 'rgba(10,10,26,0.85)';
    }
    lastScroll = currentScroll;
  }, { passive: true });
}

console.log('🎯 Morain portal loaded');
