// Main application orchestrator for Your Life in Dots
import { runSelfTest, TEST_TODAY_STR } from './selftest.js';
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

function createCell(text, className = '') {
  const td = document.createElement('td');
  td.textContent = text;
  if (className) td.className = className;
  return td;
}

function renderSelfTestUI(results, container) {
  if (!container) return;
  container.textContent = '';

  const suite = document.createElement('div');
  suite.className = 'test-suite';

  const header = document.createElement('div');
  header.className = 'test-header';

  const titleWrap = document.createElement('div');
  const h2 = document.createElement('h2');
  h2.textContent = 'Self-Test Report';
  const subtitle = document.createElement('p');
  subtitle.style.fontSize = '0.8125rem';
  subtitle.style.color = 'var(--muted)';
  subtitle.textContent = `Fixed today date: ${results.todayStr}`;
  titleWrap.appendChild(h2);
  titleWrap.appendChild(subtitle);

  const badgeWrap = document.createElement('div');
  const badge = document.createElement('span');
  badge.className = `test-badge ${results.allPassed ? 'pass' : 'fail'}`;
  badge.textContent = results.allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED';
  badgeWrap.appendChild(badge);

  header.appendChild(titleWrap);
  header.appendChild(badgeWrap);
  suite.appendChild(header);

  // 1. So Far Table
  const h3SoFar = document.createElement('h3');
  h3SoFar.textContent = '1. So Far Verification (Cases A to G)';
  suite.appendChild(h3SoFar);

  const wrapSoFar = document.createElement('div');
  wrapSoFar.className = 'test-table-wrapper';
  const tableSoFar = document.createElement('table');
  tableSoFar.className = 'test-table';
  const theadSoFar = document.createElement('thead');
  const trHSoFar = document.createElement('tr');
  const headersSoFar = ['Case', 'DOB', 'Life Picked', 'Life Used', 'Days', 'Weeks', 'Age', 'Week Idx', 'Lived Dots', 'Total Dots', 'Moons', 'Heartbeats', 'Status'];
  headersSoFar.forEach(h => {
    const th = document.createElement('th');
    th.textContent = h;
    trHSoFar.appendChild(th);
  });
  theadSoFar.appendChild(trHSoFar);
  tableSoFar.appendChild(theadSoFar);

  const tbodySoFar = document.createElement('tbody');
  results.soFarResults.forEach(r => {
    const tr = document.createElement('tr');
    tr.appendChild(createCell(r.Case));
    tr.appendChild(createCell(r.DOB));
    tr.appendChild(createCell(String(r.LifePicked)));
    tr.appendChild(createCell(r.LifeUsed));
    tr.appendChild(createCell(String(r.DaysLived)));
    tr.appendChild(createCell(String(r.WeeksLived)));
    tr.appendChild(createCell(String(r.Age)));
    tr.appendChild(createCell(String(r.WeekIdx)));
    tr.appendChild(createCell(String(r.LivedDots)));
    tr.appendChild(createCell(String(r.TotalDots)));
    tr.appendChild(createCell(String(r.MoonsSeen)));
    tr.appendChild(createCell(r.Heartbeats));
    tr.appendChild(createCell(r.Status, r.Status.toLowerCase()));
    tbodySoFar.appendChild(tr);
  });
  tableSoFar.appendChild(tbodySoFar);
  wrapSoFar.appendChild(tableSoFar);
  suite.appendChild(wrapSoFar);

  // 2. Ahead Table
  const h3Ahead = document.createElement('h3');
  h3Ahead.textContent = '2. Ahead Verification (Cases A to F)';
  suite.appendChild(h3Ahead);

  const wrapAhead = document.createElement('div');
  wrapAhead.className = 'test-table-wrapper';
  const tableAhead = document.createElement('table');
  tableAhead.className = 'test-table';
  const theadAhead = document.createElement('thead');
  const trHAhead = document.createElement('tr');
  ['Case', 'End Date', 'Sundays', 'Pongal', 'World Cups', 'Full Moons', 'Status'].forEach(h => {
    const th = document.createElement('th');
    th.textContent = h;
    trHAhead.appendChild(th);
  });
  theadAhead.appendChild(trHAhead);
  tableAhead.appendChild(theadAhead);

  const tbodyAhead = document.createElement('tbody');
  results.aheadResults.forEach(r => {
    const tr = document.createElement('tr');
    tr.appendChild(createCell(r.Case));
    tr.appendChild(createCell(r.EndDate));
    tr.appendChild(createCell(String(r.Sundays)));
    tr.appendChild(createCell(String(r.Pongal)));
    tr.appendChild(createCell(String(r.WorldCups)));
    tr.appendChild(createCell(String(r.FullMoons)));
    tr.appendChild(createCell(r.Status, r.Status.toLowerCase()));
    tbodyAhead.appendChild(tr);
  });
  tableAhead.appendChild(tbodyAhead);
  wrapAhead.appendChild(tableAhead);
  suite.appendChild(wrapAhead);

  // 3. Other Checks
  const h3Other = document.createElement('h3');
  h3Other.textContent = '3. Validation, Sunday, Hit Testing and Privacy Checks';
  suite.appendChild(h3Other);

  const wrapOther = document.createElement('div');
  wrapOther.className = 'test-table-wrapper';
  const tableOther = document.createElement('table');
  tableOther.className = 'test-table';
  const theadOther = document.createElement('thead');
  const trHOther = document.createElement('tr');
  ['Test Description', 'Status'].forEach(h => {
    const th = document.createElement('th');
    th.textContent = h;
    trHOther.appendChild(th);
  });
  theadOther.appendChild(trHOther);
  tableOther.appendChild(theadOther);

  const tbodyOther = document.createElement('tbody');
  results.otherResults.forEach(r => {
    const tr = document.createElement('tr');
    tr.appendChild(createCell(r.Test));
    tr.appendChild(createCell(r.Status, r.Status.toLowerCase()));
    tbodyOther.appendChild(tr);
  });
  tableOther.appendChild(tbodyOther);
  wrapOther.appendChild(tableOther);
  suite.appendChild(wrapOther);

  container.appendChild(suite);
}

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
