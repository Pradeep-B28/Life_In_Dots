// Main application orchestrator for Your Life in Dots
import { runSelfTest, TEST_TODAY_STR } from './selftest.js';
import { renderSelfTestUI } from './selftest-ui.js';
import { getToday } from './dates.js';
import { calculateLifeStats } from './stats.js';
import { createGridComponent } from './grid.js';
import { createHomeCard, createStatCards, createClosingCard } from './ui.js';
import { startReveal } from './reveal.js';
import { startDemoMode } from './demo.js';

let lastSubmittedValues = {
  dob: { year: 2004, month: 6, day: 12 },
  lifePicked: 80
};

export function runUserFlow(container, initialValues = null, options = {}) {
  container.textContent = '';
  const { seekTime = null, autoStart = false, customToday = null } = options;

  const homeWrapper = document.createElement('div');
  homeWrapper.className = 'home-wrapper';

  const resultSection = document.createElement('div');
  resultSection.className = 'result-section';
  resultSection.style.display = 'none';

  const revealContainer = document.createElement('div');
  revealContainer.className = 'reveal-container';

  const leftCol = document.createElement('div');
  leftCol.className = 'reveal-left';

  const rightCol = document.createElement('div');
  rightCol.className = 'reveal-right';

  const headerBox = document.createElement('div');
  headerBox.className = 'reveal-header';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'reveal-eyebrow';
  eyebrow.textContent = 'One dot = one week';

  const headline = document.createElement('h2');
  headline.className = 'reveal-headline';
  headline.textContent = '0 weeks lived';

  const subline = document.createElement('p');
  subline.className = 'reveal-subline';

  headerBox.appendChild(eyebrow);
  headerBox.appendChild(headline);
  headerBox.appendChild(subline);

  const statCardsContainer = document.createElement('div');
  const closingContainer = document.createElement('div');

  rightCol.appendChild(headerBox);
  rightCol.appendChild(statCardsContainer);
  rightCol.appendChild(closingContainer);

  revealContainer.appendChild(leftCol);
  revealContainer.appendChild(rightCol);
  resultSection.appendChild(revealContainer);

  container.appendChild(homeWrapper);
  container.appendChild(resultSection);

  let currentRevealController = null;
  let currentGrid = null;
  let currentStats = null;

  function showMyLife({ dob, lifePicked }) {
    lastSubmittedValues = { dob, lifePicked };

    const todayDayNum = getToday(customToday);
    currentStats = calculateLifeStats(dob, lifePicked, todayDayNum);

    function onTryAnother() {
      if (currentRevealController) currentRevealController.cancel();
      resultSection.style.display = 'none';
      homeWrapper.style.display = 'block';
      homeWrapper.style.opacity = '1';
      homeWrapper.style.transform = 'none';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function onWatchAgain() {
      if (currentRevealController) currentRevealController.cancel();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      playRevealSequence();
    }

    function playRevealSequence() {
      statCardsContainer.textContent = '';
      closingContainer.textContent = '';
      leftCol.textContent = '';

      currentGrid = createGridComponent(leftCol, currentStats);
      window.__currentGrid = currentGrid;

      const cardsUI = createStatCards(statCardsContainer, currentStats);
      const closeUI = createClosingCard(closingContainer, currentStats, onTryAnother, onWatchAgain);

      currentRevealController = startReveal({
        stats: currentStats,
        gridComponent: currentGrid,
        homeCard: homeWrapper,
        resultSection,
        headlineEl: headline,
        sublineEl: subline,
        statCardsUI: cardsUI,
        closingCard: closeUI,
        seekTime
      });

      window.__lastReveal = currentRevealController;
    }

    playRevealSequence();
  }

  const formHandle = createHomeCard(homeWrapper, showMyLife, initialValues || lastSubmittedValues);

  if (autoStart) {
    showMyLife(initialValues || lastSubmittedValues);
  }

  return { formHandle, showMyLife };
}

function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme, save = true) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#0F172A');
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (metaThemeColor) metaThemeColor.setAttribute('content', '#FFFFFF');
    }
    if (save) {
      try {
        localStorage.setItem('lid-theme', theme);
      } catch (err) {}
    }
    if (window.__currentGrid && window.__currentGrid.redraw) {
      window.__currentGrid.redraw();
    }
  }

  let savedTheme = null;
  const paramTheme = new URLSearchParams(window.location.search).get('theme');
  if (paramTheme === 'dark' || paramTheme === 'light') {
    savedTheme = paramTheme;
  } else {
    try {
      savedTheme = localStorage.getItem('lid-theme');
    } catch (err) {}
  }

  if (savedTheme === 'dark' || savedTheme === 'light') {
    applyTheme(savedTheme, false);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark', false);
  } else {
    applyTheme('light', false);
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      applyTheme(isDark ? 'light' : 'dark', true);
    });
  }
}

function init() {
  initTheme();

  const params = new URLSearchParams(window.location.search);
  const isTest = params.get('test') === '1';
  const isDemo = params.get('demo') === '1';

  if (isTest) {
    const testToday = params.get('today') || TEST_TODAY_STR;
    const results = runSelfTest(testToday);
    const container = document.getElementById('test-output');
    renderSelfTestUI(results, container);
  } else if (isDemo) {
    startDemoMode(document.getElementById('app-content'), { runUserFlow });
  } else {
    runUserFlow(document.getElementById('app-content'), lastSubmittedValues);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
