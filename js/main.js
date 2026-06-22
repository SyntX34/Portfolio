const PAGE_THEMES = ['default', 'cyberpunk', 'ocean', 'forest', 'sunset'];
const PAGE_THEME_CLASSES = PAGE_THEMES.map(t => `page-${t}`);

let isDark = true;
let currentPageTheme = 'default';

function applyDarkLight(dark) {
  document.body.classList.remove('theme-dark', 'theme-light');
  document.body.classList.add(dark ? 'theme-dark' : 'theme-light');
  const label = document.querySelector('.toggle-label');
  if (label) label.textContent = dark ? 'Light' : 'Dark';
}

function applyPageTheme(theme) {
  document.body.classList.remove(...PAGE_THEME_CLASSES);
  if (theme && theme !== 'default') {
    document.body.classList.add(`page-${theme}`);
  }
}

function toggleDarkLight() {
  isDark = !isDark;
  applyDarkLight(isDark);
  localStorage.setItem('dn-dark', isDark);
}

function handleThemeSelect(theme) {
  currentPageTheme = theme;
  applyPageTheme(theme);
  localStorage.setItem('dn-page-theme', theme);
}

function updateScrollProgress() {
  const scrollBar = document.getElementById('scrollBar');
  const scrollPct = document.getElementById('scrollPct');
  if (!scrollBar || !scrollPct) return;

  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;

  scrollBar.style.width = pct + '%';
  scrollPct.textContent = pct + '%';
  if (scrollTop > 20) {
    document.body.classList.add('scrolled');
  } else {
    document.body.classList.remove('scrolled');
  }
}

function updateMobileNav() {
  const links = document.querySelectorAll('.mobile-nav a');
  const sectionIds = ['about', 'skills', 'projects', 'connect'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  const scrollY = window.scrollY + window.innerHeight / 3;
  let active = 'about';

  sections.forEach(section => {
    if (section.offsetTop <= scrollY) active = section.id;
  });

  links.forEach(link => {
    const target = link.getAttribute('href').slice(1);
    link.classList.toggle('active', target === active);
  });
}

function initReveal() {
  if (!window.IntersectionObserver) return;
  const targets = document.querySelectorAll('.project-card, .skill-card, .social-card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  targets.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const savedDark  = localStorage.getItem('dn-dark');
  const savedTheme = localStorage.getItem('dn-page-theme');

  isDark = savedDark !== null ? savedDark === 'true' : true;
  currentPageTheme = (savedTheme && PAGE_THEMES.includes(savedTheme)) ? savedTheme : 'default';

  applyDarkLight(isDark);
  applyPageTheme(currentPageTheme);

  const selector = document.getElementById('themeSelector');
  if (selector) {
    selector.value = currentPageTheme;
    selector.addEventListener('change', e => handleThemeSelect(e.target.value));
  }

  const toggle = document.getElementById('themeToggle');
  if (toggle) toggle.addEventListener('click', toggleDarkLight);

  window.addEventListener('scroll', () => {
    updateScrollProgress();
    updateMobileNav();
  }, { passive: true });

  updateScrollProgress();
  updateMobileNav();

  initReveal();
});