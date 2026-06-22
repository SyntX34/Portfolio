const PAGE_THEMES = ['default', 'cyberpunk', 'ocean', 'forest', 'sunset'];
const ALL_PAGE_CLASSES = PAGE_THEMES.map(t => `page-${t}`);

let isDark = true;
let currentPageTheme = 'default';

function applyDarkLight(dark) {
  document.body.classList.remove('theme-dark', 'theme-light');
  document.body.classList.add(dark ? 'theme-dark' : 'theme-light');

  const icon = document.querySelector('.toggle-icon');
  const label = document.querySelector('.toggle-label');
  if (icon) icon.textContent = dark ? '☀' : '☾';
  if (label) label.textContent = dark ? 'Light' : 'Dark';
}

function applyPageTheme(theme) {
  document.body.classList.remove(...ALL_PAGE_CLASSES);
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

function updateMobileNav() {
  const links = document.querySelectorAll('.mobile-nav a');
  const sections = ['about', 'skills', 'projects', 'connect'].map(id =>
    document.getElementById(id)
  ).filter(Boolean);

  const scrollY = window.scrollY + window.innerHeight / 3;
  let active = '';

  sections.forEach(section => {
    if (section.offsetTop <= scrollY) {
      active = section.id;
    }
  });

  links.forEach(link => {
    const href = link.getAttribute('href').slice(1);
    link.classList.toggle('active', href === active);
  });
}

function initReveal() {
  const targets = document.querySelectorAll('.project-card, .skill-card, .social-card');
  if (!window.IntersectionObserver) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const savedDark = localStorage.getItem('dn-dark');
  const savedTheme = localStorage.getItem('dn-page-theme');

  isDark = savedDark !== null ? savedDark === 'true' : true;
  currentPageTheme = (savedTheme && PAGE_THEMES.includes(savedTheme)) ? savedTheme : 'default';

  applyDarkLight(isDark);
  applyPageTheme(currentPageTheme);
  const selector = document.querySelector('.page-theme-selector');
  if (selector) {
    selector.value = currentPageTheme;
    selector.addEventListener('change', e => handleThemeSelect(e.target.value));
  }
  const toggle = document.querySelector('.theme-toggle');
  if (toggle) toggle.addEventListener('click', toggleDarkLight);
  window.addEventListener('scroll', updateMobileNav, { passive: true });
  updateMobileNav();
  initReveal();
});