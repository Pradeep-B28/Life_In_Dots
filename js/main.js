// Main application orchestrator for Your Life in Dots
import { runSelfTest, TEST_TODAY_STR } from './selftest.js';
import { renderSelfTestUI } from './selftest-ui.js';
import { getToday } from './dates.js';
import { calculateLifeStats } from './stats.js';
import { createGridComponent } from './grid.js';
import { createHomeCard, createStatCards, createClosingCard } from './ui.js';
import { startReveal } from './reveal.js';
import { startDemoMode } from './demo.js';
import { initTheme } from './theme.js';
import { createTabsComponent } from './tabs.js';
import { VIEWS } from './layers.js';
import { getHistoryData, getFlashbackPicks, createHistoryPanel } from './history.js';
import { createChaptersPanel, resolveDotChapters, validateChapter } from './chapters.js';
import { calculateMilestones, createMilestonesPanel } from './milestones.js';
import { calculateTimeSplit, createTimePanel, DEFAULT_SLIDERS } from './timebudget.js';
import { initAudio, getAudioContext } from './audio.js';

let lastSubmittedValues = {
  dob: { year: 2004, month: 6, day: 12 },
  lifePicked: 80
};

export function runUserFlow(container, initialValues = null, options = {}) {
  container.textContent = '';
  const { seekTime = null, autoStart = false, customToday = null, initialTab = null } = options;

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

  const overviewWrapper = document.createElement('div');
  overviewWrapper.className = 'overview-wrapper';

  const statCardsContainer = document.createElement('div');
  const closingContainer = document.createElement('div');
  overviewWrapper.appendChild(statCardsContainer);
  overviewWrapper.appendChild(closingContainer);

  rightCol.appendChild(headerBox);
  rightCol.appendChild(overviewWrapper);

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
    getAudioContext();

    const todayDayNum = getToday(customToday);
    currentStats = calculateLifeStats(dob, lifePicked, todayDayNum);

    function onTryAnother() {
      if (currentRevealController) currentRevealController.cancel();
      if (window.__currentTabs) {
        window.__currentTabs.hide();
        window.__currentTabs.closeSheet();
      }
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

      const historyData = getHistoryData(currentStats.dob, todayDayNum);
      const flashbackPicks = getFlashbackPicks(currentStats.dob, todayDayNum);
      const endDateDayNum = currentStats.ahead ? currentStats.ahead.endDayNum : null;
      const milestonesData = calculateMilestones(
        currentStats.dob,
        todayDayNum,
        endDateDayNum,
        currentStats.isBonus,
        currentStats.totalDots
      );
      const currentDotIdx = currentStats.currentRow * 52 + currentStats.weekIndex;
      const aheadDots = currentStats.isBonus ? 0 : Math.max(0, currentStats.totalDots - currentDotIdx - 1);
      const timeSplitData = calculateTimeSplit(DEFAULT_SLIDERS, '10years', aheadDots);

      const layerContext = {
        livedDots: currentStats.livedDots,
        currentDotIndex: currentDotIdx,
        totalDots: currentStats.totalDots,
        isBonus: currentStats.isBonus,
        historyEvents: historyData.livedEvents,
        activeFilter: 'all',
        timeSplit: timeSplitData,
        milestones: milestonesData.milestones || [],
        chapters: [],
        dotChapterMap: [],
        hasAnyChapters: false
      };

      currentGrid = createGridComponent(leftCol, currentStats, VIEWS.OVERVIEW, layerContext);
      currentGrid.setRevealing(true);
      window.__currentGrid = currentGrid;

      const cardsUI = createStatCards(statCardsContainer, currentStats);
      const closeUI = createClosingCard(closingContainer, currentStats, onTryAnother, onWatchAgain);

      function scrollToRow(row, mode = 'top') {
        if (!currentGrid || !currentGrid.getLayout()) return;
        const layout = currentGrid.getLayout();
        const canvasEl = currentGrid.canvas;
        const rect = canvasEl.getBoundingClientRect();
        const canvasTop = rect.top + window.scrollY;
        const s = layout.s;
        const gapCount = Math.floor(row / 10);
        const rowY = row * s + gapCount * (0.8 * s);
        let targetY = canvasTop + rowY;
        if (mode === 'center20') {
          targetY = targetY - (window.innerHeight * 0.20);
        } else {
          targetY = targetY - 60;
        }
        window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
      }

      if (window.__currentTabs) {
        window.__currentTabs.bottomBar.remove();
        window.__currentTabs.backdrop.remove();
        window.__currentTabs.sheet.remove();
        window.__currentTabs.laptopTabs.remove();
        window.__currentTabs.panelsContainer.remove();
      }

      const tabs = createTabsComponent({
        onViewChange: (view) => {
          currentGrid.setLayer(view, layerContext);
        },
        onScrollToRow: scrollToRow,
        stats: currentStats,
        historyEvents: historyData.livedEvents,
        milestones: milestonesData,
        overviewWrapper
      });
      window.__currentTabs = tabs;

      const historyContent = tabs.panels[VIEWS.HISTORY]?.querySelector('#panel-content-history');
      if (historyContent) {
        createHistoryPanel(historyContent, {
          historyData,
          initialFilter: 'all',
          onFilterChange: (filterId) => {
            layerContext.activeFilter = filterId;
            currentGrid.setLayer(VIEWS.HISTORY, layerContext);
          },
          onSelectEvent: (ev) => {
            currentGrid.pulseDot(ev.dotIndex);
            currentGrid.showDotDetails(ev.dotIndex);
            const row = Math.floor(ev.dotIndex / 52);
            scrollToRow(row, 'top');
          }
        });
      }

      const chaptersContent = tabs.panels[VIEWS.CHAPTERS]?.querySelector('#panel-content-chapters');
      if (chaptersContent) {
        createChaptersPanel(chaptersContent, {
          dob: currentStats.dob,
          todayDayNum,
          initialChapters: layerContext.chapters || [],
          onChaptersChange: (updatedChapters) => {
            const validChapters = updatedChapters.filter(ch => validateChapter(ch, currentStats.dob, todayDayNum).valid);
            const dotMap = resolveDotChapters(updatedChapters, currentStats.totalDots, currentStats.dob, todayDayNum);
            layerContext.chapters = validChapters;
            layerContext.dotChapterMap = dotMap;
            layerContext.hasAnyChapters = validChapters.length > 0;
            currentGrid.setLayer(currentGrid.getView(), layerContext);
          }
        });
      }

      const timeContent = tabs.panels[VIEWS.TIME]?.querySelector('#panel-content-time');
      if (timeContent) {
        createTimePanel(timeContent, {
          isBonus: currentStats.isBonus,
          aheadDots,
          initialSliders: DEFAULT_SLIDERS,
          initialRange: '10years',
          onTimeSplitChange: (newSplit, isDragging = false) => {
            layerContext.timeSplit = newSplit;
            if (currentGrid.getView() === VIEWS.TIME) {
              if (isDragging) {
                currentGrid.redrawTimeRange(newSplit);
              } else {
                currentGrid.setLayer(VIEWS.TIME, layerContext);
              }
            }
          },
          onSwapAnimation: (prevSplit, newSplit) => {
            const currentDotIdx = currentStats.currentRow * 52 + currentStats.weekIndex;
            const startIdx = currentDotIdx + 1;
            const H = newSplit.H;
            const changedDots = [];
            let prevSum = 0;
            const prevBounds = prevSplit.weeks.map(w => { prevSum += w; return prevSum; });
            let newSum = 0;
            const newBounds = newSplit.weeks.map(w => { newSum += w; return newSum; });

            for (let offset = 0; offset < H; offset++) {
              let oldB = 0;
              while (offset >= prevBounds[oldB] && oldB < 5) oldB++;
              let newB = 0;
              while (offset >= newBounds[newB] && newB < 5) newB++;
              if (oldB === 3 && newB === 4) changedDots.push(startIdx + offset);
            }
            currentGrid.animateSwapDots(changedDots, '--t-learn');
          }
        });
      }

      const milestonesContent = tabs.panels[VIEWS.MILESTONES]?.querySelector('#panel-content-milestones');
      if (milestonesContent) {
        createMilestonesPanel(milestonesContent, {
          milestonesData,
          onMilestoneSelect: (m) => {
            if (m.hasMarker && m.dotIndex >= 0) {
              currentGrid.pulseDot(m.dotIndex);
              currentGrid.showDotDetails(m.dotIndex);
              const row = Math.floor(m.dotIndex / 52);
              scrollToRow(row, 'top');
            }
          }
        });
      }

      rightCol.insertBefore(tabs.laptopTabs, overviewWrapper);
      rightCol.appendChild(tabs.panelsContainer);

      document.body.appendChild(tabs.bottomBar);
      document.body.appendChild(tabs.backdrop);
      document.body.appendChild(tabs.sheet);

      if (seekTime !== null && seekTime >= 15.0) {
        tabs.show();
      } else {
        tabs.hide();
      }

      if (initialTab) {
        tabs.setView(initialTab);
      }

      currentRevealController = startReveal({
        stats: currentStats,
        gridComponent: currentGrid,
        homeCard: homeWrapper,
        resultSection,
        headlineEl: headline,
        sublineEl: subline,
        statCardsUI: cardsUI,
        closingCard: closeUI,
        seekTime,
        flashbackPicks,
        onComplete: () => {
          currentGrid.setRevealing(false);
          currentGrid.enableOverlay(true);
          currentGrid.enableTooltip(true);
          tabs.show();
        }
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

function init() {
  initTheme();
  initAudio();

  const params = new URLSearchParams(window.location.search);
  const isTest = params.get('test') === '1';
  const isDemo = params.get('demo') === '1';
  const paramTab = params.get('tab') || params.get('view');
  const paramSeek = params.get('seek');
  const paramDob = params.get('dob');
  const paramLife = params.get('life');

  let initVals = lastSubmittedValues;
  if (paramDob) {
    const [y, m, d] = paramDob.split('-').map(Number);
    initVals = { dob: { year: y, month: m, day: d }, lifePicked: paramLife ? Number(paramLife) : 80 };
  }

  if (isTest) {
    const testToday = params.get('today') || TEST_TODAY_STR;
    const results = runSelfTest(testToday);
    const container = document.getElementById('test-output');
    renderSelfTestUI(results, container);
  } else if (isDemo) {
    startDemoMode(document.getElementById('app-content'), { runUserFlow });
  } else {
    runUserFlow(document.getElementById('app-content'), initVals, {
      autoStart: !!paramTab || paramSeek !== null,
      seekTime: paramSeek !== null ? parseFloat(paramSeek) : (paramTab ? 99 : null),
      initialTab: paramTab
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
