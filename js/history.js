// History and flashback data logic for Your Life in Dots
import { HISTORY_EVENTS, HISTORY_FILTERS } from './history-data.js';
import { dayNumber, fromDayNumber, getAge, dotIndexForDate, formatShortDate } from './dates.js';

export { HISTORY_EVENTS, HISTORY_FILTERS };

export function parseYmdToDayNumber(ymdStr) {
  const [y, m, d] = ymdStr.split('-').map(Number);
  return dayNumber(y, m, d);
}

export function getFlashbackSentence(event, age, forShare = false) {
  const prefix = forShare
    ? (age === 0 ? 'I was a baby' : `I was ${age}`)
    : (age === 0 ? 'You were a baby' : `You were ${age}`);
  return `${prefix} when ${event.when}.`;
}

export function getHistoryData(dob, todayDayNum) {
  const dobParts = typeof dob === 'number' ? fromDayNumber(dob) : dob;
  const dobDayNum = typeof dob === 'number' ? dob : dayNumber(dob.year, dob.month, dob.day);

  const livedEvents = [];
  const beforeBirthEvents = [];

  for (const ev of HISTORY_EVENTS) {
    const evDayNum = parseYmdToDayNumber(ev.date);
    if (evDayNum < dobDayNum) {
      beforeBirthEvents.push({
        ...ev,
        dayNumber: evDayNum
      });
    } else if (evDayNum <= todayDayNum) {
      const age = getAge(dobParts, evDayNum);
      const dotIndex = dotIndexForDate(dobParts, evDayNum);
      const sentence = getFlashbackSentence(ev, age, false);
      livedEvents.push({
        ...ev,
        dayNumber: evDayNum,
        age,
        dotIndex,
        sentence
      });
    }
  }

  // Sort lived events and before-birth events in chronological order (oldest first)
  livedEvents.sort((a, b) => a.dayNumber - b.dayNumber);
  beforeBirthEvents.sort((a, b) => a.dayNumber - b.dayNumber);

  return {
    livedEvents,
    beforeBirthEvents,
    livedCount: livedEvents.length,
    beforeBirthCount: beforeBirthEvents.length
  };
}

export function getFlashbackPicks(dob, todayDayNum) {
  const { livedEvents } = getHistoryData(dob, todayDayNum);
  if (livedEvents.length === 0) {
    return [];
  }

  // Candidates: age >= 5. If fewer than 3, fallback to all lived events
  const age5Plus = livedEvents.filter(ev => ev.age >= 5);
  const candidates = age5Plus.length >= 3 ? age5Plus : [...livedEvents];

  // Sort by rank (lowest rank number first)
  const sortedByRank = [...candidates].sort((a, b) => a.rank - b.rank);

  // Pick up to 3 events, skipping cricket if we already have 2 cricket events
  const picks = [];
  let cricketCount = 0;

  for (const ev of sortedByRank) {
    if (picks.length >= 3) break;
    const isCricket = ev.cat === 'cricket';
    if (isCricket && cricketCount >= 2) {
      continue;
    }
    picks.push(ev);
    if (isCricket) cricketCount++;
  }

  // Return picks in date order (oldest first)
  picks.sort((a, b) => a.dayNumber - b.dayNumber);
  return picks;
}

export function createHistoryPanel(containerEl, options = {}) {
  const {
    historyData,
    initialFilter = 'all',
    onFilterChange,
    onSelectEvent
  } = options;

  containerEl.textContent = '';
  const root = document.createElement('div');
  root.className = 'history-panel-inner';

  let currentFilter = initialFilter;

  // 1. Filter Chips
  const filterBar = document.createElement('div');
  filterBar.className = 'history-filters';
  filterBar.setAttribute('role', 'group');
  filterBar.setAttribute('aria-label', 'Filter moments');

  const chipButtons = {};
  HISTORY_FILTERS.forEach(f => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = `history-chip${f.id === currentFilter ? ' active' : ''}`;
    chip.textContent = f.label;
    chip.dataset.filter = f.id;
    chip.setAttribute('aria-pressed', f.id === currentFilter ? 'true' : 'false');
    filterBar.appendChild(chip);
    chipButtons[f.id] = chip;
  });
  root.appendChild(filterBar);

  // 2. Events List Container
  const listContainer = document.createElement('div');
  listContainer.className = 'history-list';
  listContainer.setAttribute('role', 'list');
  root.appendChild(listContainer);

  function matchesFilter(ev, filterId) {
    if (!filterId || filterId === 'all') return true;
    if (filterId === 'more') {
      return ['india', 'tech', 'sport', 'world'].includes(ev.cat);
    }
    return ev.cat === filterId;
  }

  function renderList() {
    listContainer.textContent = '';

    if (!historyData || historyData.livedCount === 0) {
      const empty = document.createElement('p');
      empty.className = 'history-empty';
      empty.textContent = 'Your first moments in history are still ahead.';
      listContainer.appendChild(empty);
      return;
    }

    const matchingEvents = historyData.livedEvents.filter(ev => matchesFilter(ev, currentFilter));

    if (matchingEvents.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'history-empty';
      empty.textContent = 'No moments in this category for your lived years.';
      listContainer.appendChild(empty);
      return;
    }

    matchingEvents.forEach(ev => {
      const row = document.createElement('div');
      row.className = 'history-item';
      row.setAttribute('role', 'button');
      row.setAttribute('tabindex', '0');
      row.dataset.dotIndex = ev.dotIndex;

      const dateStr = formatShortDate(fromDayNumber(ev.dayNumber));
      const ageText = ev.age === 0 ? 'You were a baby' : `You were ${ev.age}`;
      row.setAttribute('aria-label', `${ev.title}, ${dateStr}, ${ageText}`);

      const left = document.createElement('div');
      left.className = 'history-item-main';

      const dateEl = document.createElement('span');
      dateEl.className = 'history-item-date';
      dateEl.textContent = dateStr;

      const titleEl = document.createElement('span');
      titleEl.className = 'history-item-title';
      titleEl.textContent = ev.title;

      left.append(dateEl, titleEl);

      const ageChip = document.createElement('span');
      ageChip.className = 'history-age-chip';
      ageChip.textContent = ageText;

      row.append(left, ageChip);

      function triggerSelect() {
        if (typeof onSelectEvent === 'function') {
          onSelectEvent(ev);
        }
      }

      row.addEventListener('click', triggerSelect);
      row.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerSelect();
        }
      });

      listContainer.appendChild(row);
    });
  }

  // Handle filter clicks
  filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.history-chip');
    if (!btn) return;
    const filterId = btn.dataset.filter;
    if (filterId === currentFilter) return;

    currentFilter = filterId;
    Object.keys(chipButtons).forEach(id => {
      const active = (id === currentFilter);
      chipButtons[id].classList.toggle('active', active);
      chipButtons[id].setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    renderList();

    if (typeof onFilterChange === 'function') {
      onFilterChange(currentFilter);
    }
  });

  renderList();

  // 3. "Before your first dot" collapsible
  if (historyData && historyData.beforeBirthCount > 0) {
    const details = document.createElement('details');
    details.className = 'history-before';

    const summary = document.createElement('summary');
    summary.className = 'history-before-summary';
    summary.textContent = `${historyData.beforeBirthCount} moments happened before you were born.`;
    details.appendChild(summary);

    const bList = document.createElement('div');
    bList.className = 'history-before-list';

    historyData.beforeBirthEvents.forEach(ev => {
      const bRow = document.createElement('div');
      bRow.className = 'history-before-row';

      const bTitle = document.createElement('span');
      bTitle.className = 'history-before-title';
      bTitle.textContent = ev.title;

      const bYear = document.createElement('span');
      bYear.className = 'history-before-year';
      const parts = fromDayNumber(ev.dayNumber);
      bYear.textContent = parts.year;

      bRow.append(bTitle, bYear);
      bList.appendChild(bRow);
    });

    details.appendChild(bList);
    root.appendChild(details);
  }

  // 4. Footnote
  const footnote = document.createElement('p');
  footnote.className = 'history-footnote';
  footnote.textContent = 'Dates as reported in India. One dot can hold more than one moment.';
  root.appendChild(footnote);

  containerEl.appendChild(root);

  return {
    setFilter: (filterId) => {
      if (chipButtons[filterId]) {
        chipButtons[filterId].click();
      }
    },
    getFilter: () => currentFilter
  };
}
