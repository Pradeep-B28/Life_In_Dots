// Chapters panel UI builder and interaction management (Section 4F)
import { fromDayNumber } from './dates.js';
import {
  CHAPTER_COLORS,
  validateChapter,
  getPresetChapter
} from './chapters.js';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export function createChaptersPanel(containerEl, options = {}) {
  const {
    dob,
    todayDayNum,
    initialChapters = [],
    onChaptersChange
  } = options;

  const dobParts = typeof dob === 'number' ? fromDayNumber(dob) : dob;
  const todayParts = fromDayNumber(todayDayNum);
  const birthYear = dobParts.year;
  const currentYear = todayParts.year;

  const chapters = [...initialChapters];
  let debounceTimer = null;

  containerEl.textContent = '';
  const root = document.createElement('div');
  root.className = 'chapters-panel-inner';

  // 1. Preset Chips Bar
  const presetsWrap = document.createElement('div');
  presetsWrap.className = 'chapters-presets';
  presetsWrap.setAttribute('role', 'group');
  presetsWrap.setAttribute('aria-label', 'Add chapter presets');

  const labelSpan = document.createElement('span');
  labelSpan.className = 'presets-label';
  labelSpan.textContent = 'Add:';
  presetsWrap.appendChild(labelSpan);

  const PRESETS = [
    { type: 'school', label: '+ School' },
    { type: 'college', label: '+ College' },
    { type: 'first-job', label: '+ First job' },
    { type: 'new-city', label: '+ New city' },
    { type: 'custom', label: '+ Custom' }
  ];

  const presetButtons = [];
  PRESETS.forEach(p => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'preset-chip';
    btn.textContent = p.label;
    btn.dataset.preset = p.type;
    presetsWrap.appendChild(btn);
    presetButtons.push(btn);
  });
  root.appendChild(presetsWrap);

  // 2. Chapters List Container
  const listContainer = document.createElement('div');
  listContainer.className = 'chapters-list';
  root.appendChild(listContainer);

  // 3. Overlap Note
  const overlapNote = document.createElement('p');
  overlapNote.className = 'chapters-overlap-note';
  overlapNote.textContent = 'Where chapters overlap, the one lower in the list shows.';
  root.appendChild(overlapNote);

  containerEl.appendChild(root);

  function getNextUnusedColor() {
    const usedColors = new Set(chapters.map(c => c.color));
    for (const color of CHAPTER_COLORS) {
      if (!usedColors.has(color)) return color;
    }
    return CHAPTER_COLORS[chapters.length % CHAPTER_COLORS.length];
  }

  function updatePresetButtonsState() {
    const isFull = chapters.length >= 8;
    presetButtons.forEach(btn => {
      btn.disabled = isFull;
      if (isFull) {
        btn.title = 'Maximum 8 chapters reached';
      } else {
        btn.removeAttribute('title');
      }
    });
  }

  function triggerChange() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      if (typeof onChaptersChange === 'function') {
        onChaptersChange(chapters);
      }
    }, 150);
  }

  function renderList() {
    listContainer.textContent = '';
    updatePresetButtonsState();

    if (chapters.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'chapters-empty';
      empty.textContent = 'No chapters yet. Tap a preset above to colour your life.';
      listContainer.appendChild(empty);
      return;
    }

    chapters.forEach((ch, idx) => {
      const card = document.createElement('div');
      card.className = 'chapter-card';
      card.dataset.index = String(idx);

      // --- Row Header ---
      const header = document.createElement('div');
      header.className = 'chapter-row-header';

      // Color Swatch Button
      const colorBtn = document.createElement('button');
      colorBtn.type = 'button';
      colorBtn.className = 'chapter-color-btn';
      colorBtn.style.backgroundColor = `var(${ch.color})`;
      colorBtn.setAttribute('aria-label', `Change chapter colour. Currently ${ch.color}`);
      colorBtn.addEventListener('click', () => {
        const cIdx = CHAPTER_COLORS.indexOf(ch.color);
        const nextColor = CHAPTER_COLORS[(cIdx + 1) % CHAPTER_COLORS.length];
        ch.color = nextColor;
        colorBtn.style.backgroundColor = `var(${nextColor})`;
        colorBtn.setAttribute('aria-label', `Change chapter colour. Currently ${nextColor}`);
        triggerChange();
      });

      // Name Input
      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.className = 'chapter-name-input';
      nameInput.maxLength = 20;
      nameInput.placeholder = 'Chapter name';
      nameInput.value = ch.name || '';
      nameInput.setAttribute('aria-label', 'Chapter name');

      nameInput.addEventListener('input', () => {
        ch.name = nameInput.value;
        validateRow();
        triggerChange();
      });

      // Delete Button
      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'chapter-delete-btn';
      deleteBtn.setAttribute('aria-label', 'Delete chapter');
      deleteBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
      deleteBtn.addEventListener('click', () => {
        chapters.splice(idx, 1);
        renderList();
        triggerChange();
      });

      header.append(colorBtn, nameInput, deleteBtn);
      card.appendChild(header);

      // --- Row Dates ---
      const datesRow = document.createElement('div');
      datesRow.className = 'chapter-row-dates';

      // Start Group
      const startGroup = document.createElement('div');
      startGroup.className = 'date-group';

      const startLabel = document.createElement('label');
      startLabel.className = 'date-group-label';
      startLabel.textContent = 'Start';

      const startSelects = document.createElement('div');
      startSelects.className = 'date-selects';

      const startMonth = document.createElement('select');
      startMonth.className = 'chapter-select chapter-start-month';
      startMonth.setAttribute('aria-label', 'Start month');
      const sMDef = document.createElement('option');
      sMDef.value = '';
      sMDef.textContent = 'Month';
      startMonth.appendChild(sMDef);
      MONTH_NAMES.forEach((mName, mIdx) => {
        const opt = document.createElement('option');
        opt.value = String(mIdx + 1);
        opt.textContent = mName;
        if (ch.start && Number(ch.start.month) === (mIdx + 1)) opt.selected = true;
        startMonth.appendChild(opt);
      });

      const startYear = document.createElement('select');
      startYear.className = 'chapter-select chapter-start-year';
      startYear.setAttribute('aria-label', 'Start year');
      const sYDef = document.createElement('option');
      sYDef.value = '';
      sYDef.textContent = 'Year';
      startYear.appendChild(sYDef);
      for (let y = birthYear; y <= currentYear; y++) {
        const opt = document.createElement('option');
        opt.value = String(y);
        opt.textContent = String(y);
        if (ch.start && Number(ch.start.year) === y) opt.selected = true;
        startYear.appendChild(opt);
      }

      startMonth.addEventListener('change', () => {
        if (!ch.start) ch.start = {};
        ch.start.month = startMonth.value ? Number(startMonth.value) : '';
        validateRow();
        triggerChange();
      });

      startYear.addEventListener('change', () => {
        if (!ch.start) ch.start = {};
        ch.start.year = startYear.value ? Number(startYear.value) : '';
        validateRow();
        triggerChange();
      });

      startSelects.append(startMonth, startYear);
      startGroup.append(startLabel, startSelects);
      datesRow.appendChild(startGroup);

      // End Group
      const endGroup = document.createElement('div');
      endGroup.className = 'date-group';

      const endLabelRow = document.createElement('div');
      endLabelRow.className = 'end-label-row';

      const endLabel = document.createElement('label');
      endLabel.className = 'date-group-label';
      endLabel.textContent = 'End';

      const stillGoingLabel = document.createElement('label');
      stillGoingLabel.className = 'still-going-label';

      const stillGoingCheck = document.createElement('input');
      stillGoingCheck.type = 'checkbox';
      stillGoingCheck.className = 'chapter-still-going';
      stillGoingCheck.checked = !!ch.stillGoing;

      const stillGoingText = document.createElement('span');
      stillGoingText.textContent = 'Still going';

      stillGoingLabel.append(stillGoingCheck, stillGoingText);
      endLabelRow.append(endLabel, stillGoingLabel);

      const endSelects = document.createElement('div');
      endSelects.className = 'date-selects';

      const endMonth = document.createElement('select');
      endMonth.className = 'chapter-select chapter-end-month';
      endMonth.setAttribute('aria-label', 'End month');
      endMonth.disabled = !!ch.stillGoing;
      const eMDef = document.createElement('option');
      eMDef.value = '';
      eMDef.textContent = 'Month';
      endMonth.appendChild(eMDef);
      MONTH_NAMES.forEach((mName, mIdx) => {
        const opt = document.createElement('option');
        opt.value = String(mIdx + 1);
        opt.textContent = mName;
        if (ch.end && Number(ch.end.month) === (mIdx + 1)) opt.selected = true;
        endMonth.appendChild(opt);
      });

      const endYear = document.createElement('select');
      endYear.className = 'chapter-select chapter-end-year';
      endYear.setAttribute('aria-label', 'End year');
      endYear.disabled = !!ch.stillGoing;
      const eYDef = document.createElement('option');
      eYDef.value = '';
      eYDef.textContent = 'Year';
      endYear.appendChild(eYDef);
      for (let y = birthYear; y <= currentYear; y++) {
        const opt = document.createElement('option');
        opt.value = String(y);
        opt.textContent = String(y);
        if (ch.end && Number(ch.end.year) === y) opt.selected = true;
        endYear.appendChild(opt);
      }

      stillGoingCheck.addEventListener('change', () => {
        ch.stillGoing = stillGoingCheck.checked;
        endMonth.disabled = ch.stillGoing;
        endYear.disabled = ch.stillGoing;
        validateRow();
        triggerChange();
      });

      endMonth.addEventListener('change', () => {
        if (!ch.end) ch.end = {};
        ch.end.month = endMonth.value ? Number(endMonth.value) : '';
        validateRow();
        triggerChange();
      });

      endYear.addEventListener('change', () => {
        if (!ch.end) ch.end = {};
        ch.end.year = endYear.value ? Number(endYear.value) : '';
        validateRow();
        triggerChange();
      });

      endSelects.append(endMonth, endYear);
      endGroup.append(endLabelRow, endSelects);
      datesRow.appendChild(endGroup);

      card.appendChild(datesRow);

      // Error Message
      const errorDiv = document.createElement('div');
      errorDiv.className = 'chapter-error';
      card.appendChild(errorDiv);

      function validateRow() {
        const res = validateChapter(ch, dob, todayDayNum);
        if (!res.valid) {
          card.classList.add('has-error');
          errorDiv.textContent = res.error;
          errorDiv.style.display = 'block';
        } else {
          card.classList.remove('has-error');
          errorDiv.textContent = '';
          errorDiv.style.display = 'none';
        }
      }

      validateRow();
      listContainer.appendChild(card);
    });
  }

  // Preset button clicks
  presetsWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.preset-chip');
    if (!btn || btn.disabled) return;
    const pType = btn.dataset.preset;
    if (!pType) return;

    if (chapters.length >= 8) return;

    const nextColor = getNextUnusedColor();
    const newCh = getPresetChapter(pType, dob, todayDayNum, nextColor);
    chapters.push(newCh);
    renderList();
    triggerChange();
  });

  renderList();

  return {
    getChapters: () => chapters,
    addChapter: (ch) => {
      if (chapters.length < 8) {
        chapters.push(ch);
        renderList();
        triggerChange();
      }
    },
    setChapters: (newChapters) => {
      chapters.length = 0;
      chapters.push(...newChapters);
      renderList();
      triggerChange();
    }
  };
}
