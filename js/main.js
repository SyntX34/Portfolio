const themes = ['cyberpunk', 'ocean', 'forest', 'sunset'];
const themeKeys = ['theme-dark', 'theme-light'];

let currentThemeIndex = 0;
let isDark = true;

document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.querySelector('.theme-toggle');
  const themeSelector = document.querySelector('.page-theme-selector');
  
  setTheme(0);
  
  themeToggle.addEventListener('click', toggleDarkLight);
  themeSelector.addEventListener('change', (e) => {
    applyTheme(e.target.value);
  });
});

function toggleDarkLight() {
  isDark = !isDark;
  const themeKey = isDark ? 'theme-dark' : 'theme-light';
  document.documentElement.className = themeKey;
  document.documentElement.style.setProperty('--current-theme', themes[currentThemeIndex]);
  localStorage.setItem('darkMode', isDark);
}

function applyTheme(themeName) {
  const themeKey = isDark ? 'theme-dark' : 'theme-light';
  document.documentElement.className = themeKey;
  const selectedTheme = themes.indexOf(themeName);
  if (selectedTheme !== -1) {
    currentThemeIndex = selectedTheme;
  }
  const cssVars = getThemeVariables(themeName);
  for (const [key, value] of Object.entries(cssVars)) {
    document.documentElement.style.setProperty(key, value);
  }
  localStorage.setItem('pageTheme', themeName);
}

function setTheme(index) {
  const themeName = themes[index];
  applyTheme(themeName);
}

function getThemeVariables(themeName) {
  const variables = {
    cyberpunk: {
      '--accent': '#00ffff',
      '--accent-hover': '#00dddd',
      '--gradient': 'linear-gradient(90deg, #ff00ff, #00ffff)'
    },
    ocean: {
      '--accent': '#00b4d8',
      '--accent-hover': '#0090b3',
      '--gradient': 'linear-gradient(90deg, #00b4d8, #90e0ef)'
    },
    forest: {
      '--accent': '#40916c',
      '--accent-hover': '#357a5a',
      '--gradient': 'linear-gradient(90deg, #40916c, #a8e6a3)'
    },
    sunset: {
      '--accent': '#ff9e00',
      '--accent-hover': '#e68a00',
      '--gradient': 'linear-gradient(90deg, #ff9e00, #ff6b6b)'
    }
  };
  return variables[themeName] || {};
}