// Time tab UI builder, slider management, stacked bar and swap interactions (Section 4G)
import {
  TIME_BUCKETS,
  DEFAULT_SLIDERS,
  calculateTimeSplit,
  canSwapPhoneForLearning,
  swapPhoneForLearning
} from './timebudget.js';

export function createTimePanel(containerEl, options = {}) {
  const {
    isBonus = false,
    aheadDots = 0,
    initialSliders = DEFAULT_SLIDERS,
    initialRange = '10years',
    onTimeSplitChange,
    onSwapAnimation
  } = options;

  containerEl.textContent = '';
  const root = document.createElement('div');
  root.className = 'time-panel-inner';

  if (isBonus || aheadDots <= 0) {
    const bonusCard = document.createElement('div');
    bonusCard.className = 'time-bonus-card';
    bonusCard.textContent = 'Every week from here is a bonus. Spend them your way.';
    root.appendChild(bonusCard);

    const cta = document.createElement('a');
    cta.className = 'time-cta';
    cta.href = 'https://wrench-wise.com/?utm_source=life-in-dots&utm_medium=web-app&utm_campaign=life-in-dots-2026&utm_content=time-budget';
    cta.target = '_blank';
    cta.rel = 'noopener noreferrer';
    cta.textContent = 'Want to put those hours to work? See what you can learn at Wrench Wise';
    root.appendChild(cta);

    containerEl.appendChild(root);
    return {
      getSliders: () => ({ ...initialSliders }),
      getRange: () => initialRange
    };
  }

  let sliders = { ...initialSliders };
  let currentRange = initialRange;
  let lastValidSplit = calculateTimeSplit(sliders, currentRange, aheadDots);

  // 1. Range Pills
  const pillsWrap = document.createElement('div');
  pillsWrap.className = 'time-range-pills';
  pillsWrap.setAttribute('role', 'group');
  pillsWrap.setAttribute('aria-label', 'Pick future range');

  const RANGES = [
    { id: 'year', label: 'Next year' },
    { id: '10years', label: 'Next 10 years' },
    { id: 'ahead', label: 'All weeks ahead' }
  ];

  const pillButtons = {};
  RANGES.forEach(r => {
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = `time-range-pill${r.id === currentRange ? ' active' : ''}`;
    pill.textContent = r.label;
    pill.dataset.range = r.id;
    pill.setAttribute('aria-pressed', r.id === currentRange ? 'true' : 'false');
    pillsWrap.appendChild(pill);
    pillButtons[r.id] = pill;
  });
  root.appendChild(pillsWrap);

  // 2. Highlights Box
  const highlightsBox = document.createElement('div');
  highlightsBox.className = 'time-highlights';

  const line1 = document.createElement('div');
  line1.className = 'time-highlight-line';
  const line2 = document.createElement('div');
  line2.className = 'time-highlight-line learning';
  highlightsBox.append(line1, line2);
  root.appendChild(highlightsBox);

  // 3. Stacked Bar
  const barWrap = document.createElement('div');
  barWrap.className = 'time-stacked-bar-wrap';

  const bar = document.createElement('div');
  bar.className = 'time-stacked-bar';
  bar.setAttribute('role', 'progressbar');
  bar.setAttribute('aria-label', 'Weekly time share');

  const barSegments = TIME_BUCKETS.map(b => {
    const seg = document.createElement('div');
    seg.className = 'time-bar-segment';
    seg.style.backgroundColor = `var(${b.colorVar})`;
    bar.appendChild(seg);
    return seg;
  });
  barWrap.appendChild(bar);
  root.appendChild(barWrap);

  // 4. Swap Button & Animated Chip
  const swapWrap = document.createElement('div');
  swapWrap.className = 'time-swap-wrap';

  const swapBtn = document.createElement('button');
  swapBtn.type = 'button';
  swapBtn.className = 'time-swap-btn';
  swapBtn.textContent = 'Swap 1 hour of phone for learning';

  const swapChip = document.createElement('span');
  swapChip.className = 'time-swap-chip';

  swapWrap.append(swapBtn, swapChip);
  root.appendChild(swapWrap);

  // 5. Results List
  const resultsList = document.createElement('div');
  resultsList.className = 'time-results-list';

  const resultRows = TIME_BUCKETS.map(b => {
    const row = document.createElement('div');
    row.className = 'time-result-row';

    const left = document.createElement('div');
    left.className = 'time-result-left';

    const swatch = document.createElement('span');
    swatch.className = 'time-swatch';
    swatch.style.backgroundColor = `var(${b.colorVar})`;

    const name = document.createElement('span');
    name.className = 'time-result-name';
    name.textContent = b.label;

    left.append(swatch, name);

    const right = document.createElement('div');
    right.className = 'time-result-right';

    const weeks = document.createElement('span');
    weeks.className = 'time-result-weeks';

    const years = document.createElement('span');
    years.className = 'time-result-years';

    right.append(weeks, years);
    row.append(left, right);
    resultsList.appendChild(row);

    return { weeks, years };
  });
  root.appendChild(resultsList);

  // 6. Sliders Group
  const slidersSection = document.createElement('div');
  slidersSection.className = 'time-sliders-section';

  const slidersTitle = document.createElement('div');
  slidersTitle.className = 'time-sliders-title';
  slidersTitle.textContent = 'Daily Hours';
  slidersSection.appendChild(slidersTitle);

  const sliderInputs = {};
  const sliderValEls = {};

  TIME_BUCKETS.forEach(b => {
    if (b.readOnly) {
      // Free time read-only row
      const freeRow = document.createElement('div');
      freeRow.className = 'time-slider-row time-free-row';

      const fHeader = document.createElement('div');
      fHeader.className = 'time-slider-header';

      const fName = document.createElement('span');
      fName.className = 'time-slider-name';
      const fSwatch = document.createElement('span');
      fSwatch.className = 'time-swatch';
      fSwatch.style.backgroundColor = `var(${b.colorVar})`;
      const fText = document.createElement('span');
      fText.textContent = `${b.label} (remaining)`;
      fName.append(fSwatch, fText);

      const fVal = document.createElement('span');
      fVal.className = 'time-slider-val';
      sliderValEls.free = fVal;

      fHeader.append(fName, fVal);
      freeRow.appendChild(fHeader);
      slidersSection.appendChild(freeRow);
      return;
    }

    const row = document.createElement('div');
    row.className = 'time-slider-row';

    const header = document.createElement('div');
    header.className = 'time-slider-header';

    const name = document.createElement('label');
    name.className = 'time-slider-name';
    name.htmlFor = `slider-${b.id}`;
    const swatch = document.createElement('span');
    swatch.className = 'time-swatch';
    swatch.style.backgroundColor = `var(${b.colorVar})`;
    const labelText = document.createElement('span');
    labelText.textContent = b.label;
    name.append(swatch, labelText);

    const val = document.createElement('span');
    val.className = 'time-slider-val';
    val.id = `val-${b.id}`;
    sliderValEls[b.id] = val;

    header.append(name, val);

    const input = document.createElement('input');
    input.type = 'range';
    input.className = 'time-slider-input';
    input.id = `slider-${b.id}`;
    input.min = String(b.min);
    input.max = String(b.max);
    input.step = '0.5';
    input.value = String(sliders[b.id] ?? b.default);
    input.setAttribute('aria-label', b.label);

    sliderInputs[b.id] = input;
    row.append(header, input);
    slidersSection.appendChild(row);
  });

  const errorDiv = document.createElement('div');
  errorDiv.className = 'time-error';
  errorDiv.style.display = 'none';
  slidersSection.appendChild(errorDiv);
  root.appendChild(slidersSection);

  // 7. Muted Note & CTA
  const note = document.createElement('p');
  note.className = 'time-note';
  note.textContent = 'Not good or bad. Just worth knowing.';
  root.appendChild(note);

  const cta = document.createElement('a');
  cta.className = 'time-cta';
  cta.href = 'https://wrench-wise.com/?utm_source=life-in-dots&utm_medium=web-app&utm_campaign=life-in-dots-2026&utm_content=time-budget';
  cta.target = '_blank';
  cta.rel = 'noopener noreferrer';
  cta.textContent = 'Want to put those hours to work? See what you can learn at Wrench Wise';
  root.appendChild(cta);

  containerEl.appendChild(root);

  function updateDisplay(split) {
    line1.textContent = split.highlightLine1;
    line2.textContent = split.highlightLine2;

    TIME_BUCKETS.forEach((b, idx) => {
      const w = split.weeks[idx];
      const pct = (w / split.H) * 100;
      barSegments[idx].style.width = `${pct}%`;

      resultRows[idx].weeks.textContent = `${w} weeks`;
      if (currentRange === '10years' || currentRange === 'ahead' || split.H >= 520) {
        resultRows[idx].years.textContent = ` (${split.years[idx]} years)`;
        resultRows[idx].years.style.display = 'inline';
      } else {
        resultRows[idx].years.style.display = 'none';
      }
    });

    Object.keys(sliderInputs).forEach(k => {
      sliderInputs[k].value = String(sliders[k]);
      sliderValEls[k].textContent = `${sliders[k]} h`;
    });
    sliderValEls.free.textContent = `${split.freeHours} h`;

    swapBtn.disabled = !canSwapPhoneForLearning(sliders);
  }

  function handleSliderInput() {
    const newSliders = {
      sleep: Number(sliderInputs.sleep.value),
      work: Number(sliderInputs.work.value),
      travel: Number(sliderInputs.travel.value),
      phone: Number(sliderInputs.phone.value),
      learn: Number(sliderInputs.learn.value)
    };

    const split = calculateTimeSplit(newSliders, currentRange, aheadDots);
    if (!split.valid) {
      errorDiv.textContent = split.error;
      errorDiv.style.display = 'block';
      Object.keys(newSliders).forEach(k => {
        sliderValEls[k].textContent = `${newSliders[k]} h`;
      });
      const totalH = Object.values(newSliders).reduce((a, b) => a + b, 0);
      sliderValEls.free.textContent = `${Math.max(0, 24 - totalH)} h`;
      return;
    }

    errorDiv.style.display = 'none';
    sliders = newSliders;
    lastValidSplit = split;
    updateDisplay(split);

    if (typeof onTimeSplitChange === 'function') {
      const isDragging = (e && e.type === 'input');
      onTimeSplitChange(split, isDragging);
    }
  }

  Object.values(sliderInputs).forEach(input => {
    input.addEventListener('input', handleSliderInput);
    input.addEventListener('change', () => {
      if (typeof onTimeSplitChange === 'function') {
        onTimeSplitChange(lastValidSplit, false);
      }
    });
  });

  // Range pill clicks
  pillsWrap.addEventListener('click', e => {
    const btn = e.target.closest('.time-range-pill');
    if (!btn) return;
    const rId = btn.dataset.range;
    if (rId === currentRange) return;

    currentRange = rId;
    Object.keys(pillButtons).forEach(id => {
      const active = (id === currentRange);
      pillButtons[id].classList.toggle('active', active);
      pillButtons[id].setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    const split = calculateTimeSplit(sliders, currentRange, aheadDots);
    lastValidSplit = split;
    updateDisplay(split);

    if (typeof onTimeSplitChange === 'function') {
      onTimeSplitChange(split);
    }
  });

  // Swap button click
  let chipTimeout = null;
  swapBtn.addEventListener('click', () => {
    if (!canSwapPhoneForLearning(sliders)) return;

    const prevSplit = lastValidSplit;
    sliders = swapPhoneForLearning(sliders);
    const newSplit = calculateTimeSplit(sliders, currentRange, aheadDots);
    const addedWeeks = newSplit.weeks[4] - prevSplit.weeks[4];

    lastValidSplit = newSplit;
    updateDisplay(newSplit);

    swapChip.textContent = `+${addedWeeks} weeks of learning`;
    swapChip.classList.add('visible');
    clearTimeout(chipTimeout);
    chipTimeout = setTimeout(() => {
      swapChip.classList.remove('visible');
    }, 2000);

    if (typeof onSwapAnimation === 'function') {
      onSwapAnimation(prevSplit, newSplit);
    }

    if (typeof onTimeSplitChange === 'function') {
      onTimeSplitChange(newSplit);
    }
  });

  updateDisplay(lastValidSplit);

  return {
    getSliders: () => ({ ...sliders }),
    getRange: () => currentRange,
    getSplit: () => lastValidSplit
  };
}
