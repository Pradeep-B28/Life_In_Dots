// Theme management for Your Life in Dots (Section 4C)

const STORAGE_KEY = 'lid-theme';

export function getSavedTheme() {
  if (typeof window !== 'undefined' && window.location && window.location.search) {
    const urlTheme = new URLSearchParams(window.location.search).get('theme');
    if (urlTheme === 'dark' || urlTheme === 'light') return urlTheme;
  }
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (err) {
    return null;
  }
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (err) {}
}

export function getSystemTheme() {
  if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
}

export function getCurrentTheme() {
  if (typeof document !== 'undefined') {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }
  return 'light';
}

export function applyTheme(theme, save = true, animate = true) {
  if (typeof document === 'undefined') return;

  if (animate) {
    document.documentElement.classList.add('theme-transition');
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 200);
  }

  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  const metaLight = document.querySelector('meta[name="theme-color"]:not([media])');
  if (metaLight) {
    metaLight.setAttribute('content', theme === 'dark' ? '#0F172A' : '#FFFFFF');
  }

  if (save) {
    saveTheme(theme);
  }

  if (typeof window !== 'undefined' && window.__currentGrid && typeof window.__currentGrid.redraw === 'function') {
    window.__currentGrid.redraw();
  }
}

export function initTheme(onThemeChange = null) {
  const saved = getSavedTheme();
  const initialTheme = saved || getSystemTheme();
  applyTheme(initialTheme, false, false);

  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const nextTheme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme, true, true);
      if (typeof onThemeChange === 'function') {
        onThemeChange(nextTheme);
      }
    });
  }

  // Listen for system theme changes if user hasn't chosen manually
  if (typeof window !== 'undefined' && window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!getSavedTheme()) {
        const sysTheme = e.matches ? 'dark' : 'light';
        applyTheme(sysTheme, false, true);
        if (typeof onThemeChange === 'function') {
          onThemeChange(sysTheme);
        }
      }
    });
  }
}
