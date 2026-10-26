// Tabs, bottom sheet and segmented control management (Section 4D)
import { VIEWS } from './layers.js';

const TAB_ICONS = {
  history: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/>',
  chapters: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  time: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  milestones: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>'
};

const TAB_CONFIGS = [
  { id: VIEWS.HISTORY, label: 'History', title: 'Your life in history', subtitle: 'Moments you lived through, pinned to your dots.' },
  { id: VIEWS.CHAPTERS, label: 'Chapters', title: 'Paint your chapters', subtitle: 'Colour the dots you have lived. Chapters stay on this page only.' },
  { id: VIEWS.TIME, label: 'Time', title: 'Where your weeks go', subtitle: 'If every day looked like today, this is how your weeks ahead would add up.' },
  { id: VIEWS.MILESTONES, label: 'Milestones', title: 'Nerd birthdays', subtitle: 'Days worth celebrating that most people never notice.' }
];

export function createTabsComponent(options = {}) {
  const {
    onViewChange,
    onScrollToRow,
    stats,
    historyEvents = [],
    milestones = [],
    overviewWrapper = null
  } = options;

  let currentView = VIEWS.OVERVIEW;
  let isSheetOpen = false;

  // Phone Bottom Bar
  const bottomBar = document.createElement('nav');
  bottomBar.className = 'bottom-tab-bar visible';
  bottomBar.setAttribute('aria-label', 'Life tools');

  // Bottom Sheet Backdrop & Sheet
  const backdrop = document.createElement('div');
  backdrop.className = 'bottom-sheet-backdrop';

  const sheet = document.createElement('aside');
  sheet.className = 'bottom-sheet';
  sheet.setAttribute('role', 'dialog');
  sheet.setAttribute('aria-modal', 'true');
  sheet.setAttribute('aria-label', 'Tool sheet');

  sheet.innerHTML = `
    <div class="sheet-handle-bar"><div class="sheet-handle"></div></div>
    <div class="sheet-header">
      <div class="sheet-title-wrap">
        <h2 class="sheet-title" id="sheet-title">History</h2>
        <p class="sheet-subtitle" id="sheet-subtitle"></p>
      </div>
      <button type="button" class="sheet-done-btn" id="sheet-done-btn" aria-label="Close sheet">Done</button>
    </div>
    <div class="sheet-body" id="sheet-body"></div>
  `;

  // Laptop Segmented Control
  const laptopTabs = document.createElement('div');
  laptopTabs.className = 'laptop-tabs visible';
  laptopTabs.setAttribute('role', 'tablist');

  const overviewBtn = document.createElement('button');
  overviewBtn.type = 'button';
  overviewBtn.className = 'laptop-tab-btn active';
  overviewBtn.textContent = 'Overview';
  overviewBtn.setAttribute('role', 'tab');
  overviewBtn.setAttribute('aria-selected', 'true');
  overviewBtn.dataset.view = VIEWS.OVERVIEW;
  laptopTabs.appendChild(overviewBtn);

  // Panels Container (for laptop & phone sheet mounting)
  const panelsContainer = document.createElement('div');
  panelsContainer.className = 'panels-container';

  const phoneTabButtons = {};
  const laptopTabButtons = { [VIEWS.OVERVIEW]: overviewBtn };

  // Create Panels
  const panels = {};
  TAB_CONFIGS.forEach(cfg => {
    // Phone tab button
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tab-btn';
    btn.dataset.view = cfg.id;
    btn.setAttribute('aria-label', cfg.label);
    btn.innerHTML = `<svg viewBox="0 0 24 24">${TAB_ICONS[cfg.id]}</svg><span>${cfg.label}</span>`;
    bottomBar.appendChild(btn);
    phoneTabButtons[cfg.id] = btn;

    // Laptop tab button
    const lBtn = document.createElement('button');
    lBtn.type = 'button';
    lBtn.className = 'laptop-tab-btn';
    lBtn.textContent = cfg.label;
    lBtn.setAttribute('role', 'tab');
    lBtn.setAttribute('aria-selected', 'false');
    lBtn.dataset.view = cfg.id;
    laptopTabs.appendChild(lBtn);
    laptopTabButtons[cfg.id] = lBtn;

    // Panel
    const panel = document.createElement('div');
    panel.className = 'tool-panel';
    panel.dataset.panel = cfg.id;
    panel.innerHTML = `
      <div class="panel-header">
        <h2 class="panel-title">${cfg.title}</h2>
        <p class="panel-subtitle">${cfg.subtitle}</p>
      </div>
      <div class="panel-content" id="panel-content-${cfg.id}">
        <div class="panel-placeholder">
          <p>${cfg.label} panel content</p>
        </div>
      </div>
      <div class="panel-share-wrap">
        <button type="button" class="primary-btn panel-share-btn" data-share-view="${cfg.id}">Share my dots</button>
      </div>
    `;
    panels[cfg.id] = panel;
    panelsContainer.appendChild(panel);
  });

  const sheetBody = sheet.querySelector('#sheet-body');
  const sheetTitle = sheet.querySelector('#sheet-title');
  const sheetSubtitle = sheet.querySelector('#sheet-subtitle');
  const sheetDoneBtn = sheet.querySelector('#sheet-done-btn');

  function updateActiveState(view) {
    const isLaptop = window.innerWidth >= 900;
    currentView = view;

    // Update laptop buttons
    Object.keys(laptopTabButtons).forEach(k => {
      const active = (k === view);
      laptopTabButtons[k].classList.toggle('active', active);
      laptopTabButtons[k].setAttribute('aria-selected', active ? 'true' : 'false');
    });

    // Update phone tab buttons
    Object.keys(phoneTabButtons).forEach(k => {
      const active = (k === view && isSheetOpen);
      phoneTabButtons[k].classList.toggle('active', active);
    });

    // Mount panel into appropriate container
    if (isLaptop) {
      isSheetOpen = false;
      sheet.classList.remove('open');
      backdrop.classList.remove('open');
      document.body.style.paddingBottom = '';

      Object.keys(panels).forEach(k => {
        if (!panelsContainer.contains(panels[k])) {
          panelsContainer.appendChild(panels[k]);
        }
        panels[k].classList.toggle('active', k === view);
      });
      if (overviewWrapper) {
        overviewWrapper.style.display = (view === VIEWS.OVERVIEW) ? 'block' : 'none';
      }
      panelsContainer.style.display = (view === VIEWS.OVERVIEW) ? 'none' : 'block';
    } else {
      if (overviewWrapper) {
        overviewWrapper.style.display = 'block';
      }
      if (view === VIEWS.OVERVIEW || !isSheetOpen) {
        sheet.classList.remove('open');
        backdrop.classList.remove('open');
        document.body.style.paddingBottom = 'calc(64px + env(safe-area-inset-bottom, 0px))';
        Object.keys(panels).forEach(k => {
          if (!panelsContainer.contains(panels[k])) {
            panelsContainer.appendChild(panels[k]);
          }
          panels[k].classList.remove('active');
        });
      } else {
        const cfg = TAB_CONFIGS.find(c => c.id === view);
        if (cfg) {
          sheetTitle.textContent = cfg.title;
          sheetSubtitle.textContent = cfg.subtitle;
        }
        sheetBody.textContent = '';
        if (panels[view]) {
          sheetBody.appendChild(panels[view]);
          panels[view].classList.add('active');
        }
        sheet.classList.add('open');
        backdrop.classList.add('open');
        const sheetH = Math.min(window.innerHeight * 0.52, 460);
        document.body.style.paddingBottom = `calc(64px + ${sheetH}px + env(safe-area-inset-bottom, 0px))`;
      }
    }

    if (typeof onViewChange === 'function') {
      const startTime = performance.now();
      onViewChange(view);
      const elapsed = performance.now() - startTime;
      window.__lastTabSwitchMs = Math.round(elapsed);
    }
  }

  function scrollToTabTarget(view) {
    if (typeof onScrollToRow !== 'function' || !stats) return;
    if (view === VIEWS.HISTORY) {
      if (historyEvents && historyEvents.length > 0) {
        const latestEvent = historyEvents[historyEvents.length - 1];
        const row = Math.floor(latestEvent.dotIndex / 52);
        onScrollToRow(row, 'top');
      }
    } else if (view === VIEWS.CHAPTERS) {
      onScrollToRow(0, 'top');
    } else if (view === VIEWS.TIME) {
      onScrollToRow(stats.currentRow, 'center20');
    } else if (view === VIEWS.MILESTONES) {
      const list = Array.isArray(milestones) ? milestones : (milestones && milestones.milestones ? milestones.milestones : []);
      const nextUp = (milestones && milestones.nextUp) || list.find(m => m.status === 'ahead');
      if (nextUp && nextUp.dotIndex >= 0) {
        const row = Math.floor(nextUp.dotIndex / 52);
        onScrollToRow(row, 'top');
      }
    }
  }

  function handleTabSelect(view) {
    const isLaptop = window.innerWidth >= 900;
    if (isLaptop) {
      updateActiveState(view);
      return;
    }

    if (isSheetOpen && currentView === view) {
      // Tapping active tab closes sheet
      closeSheet();
    } else {
      isSheetOpen = true;
      updateActiveState(view);
      setTimeout(() => scrollToTabTarget(view), 100);
    }
  }

  function closeSheet() {
    isSheetOpen = false;
    updateActiveState(VIEWS.OVERVIEW);
  }

  // Event Listeners
  bottomBar.addEventListener('click', e => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    const v = btn.dataset.view;
    if (v) handleTabSelect(v);
  });

  laptopTabs.addEventListener('click', e => {
    const btn = e.target.closest('.laptop-tab-btn');
    if (!btn) return;
    const v = btn.dataset.view;
    if (v) handleTabSelect(v);
  });

  sheetDoneBtn.addEventListener('click', closeSheet);
  backdrop.addEventListener('click', closeSheet);

  window.addEventListener('resize', () => {
    updateActiveState(currentView);
  });

  return {
    bottomBar,
    backdrop,
    sheet,
    laptopTabs,
    panelsContainer,
    panels,
    getView: () => currentView,
    setView: (v) => handleTabSelect(v),
    show: () => {
      bottomBar.classList.add('visible');
      laptopTabs.classList.add('visible');
    },
    hide: () => {
      bottomBar.classList.remove('visible');
      laptopTabs.classList.remove('visible');
    },
    closeSheet
  };
}
