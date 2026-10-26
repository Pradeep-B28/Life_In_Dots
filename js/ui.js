// UI components: Home form, validation, stat cards, details and closing card
import { validateDate } from './dates.js';
import { handleShareDots, handleShareWhatsApp, handleCopyLink, setShareSize, getShareSize } from './share.js';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const SVG_PATHS = {
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
  pongal: '<path d="M5 11h14M7 11c0 6 2 9 5 9s5-3 5-9M9 11c0-2 1-4 3-5 2 1 3 3 3 5M12 2v4"/>',
  cup: '<path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2M4 5h16v4a8 8 0 0 1-8 8 8 8 0 0 1-8-8V5zM12 17v4M8 21h8"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  heart: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>'
};

export function createSvgIcon(name) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '24');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '2');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.style.color = 'var(--brand)';
  svg.innerHTML = SVG_PATHS[name] || '<circle cx="12" cy="12" r="9"/>';
  return svg;
}

function addSelectOption(sel, val, text) {
  const opt = document.createElement('option');
  opt.value = val;
  opt.textContent = text;
  sel.appendChild(opt);
}

export function createHomeCard(container, onSubmit, initialValues = null) {
  container.textContent = '';
  const card = document.createElement('div');
  card.className = 'home-card';

  card.innerHTML = `
    <div class="eyebrow-chip">One dot = one week</div>
    <h1 class="home-title">Your Life in Dots</h1>
    <p class="home-subtitle">See every week of your life on one screen.</p>
  `;

  const form = document.createElement('form');
  form.className = 'home-form';
  form.setAttribute('novalidate', '');

  const dobLabel = document.createElement('label');
  dobLabel.className = 'form-label';
  dobLabel.textContent = 'Your date of birth';
  form.appendChild(dobLabel);

  const dropdownsWrap = document.createElement('div');
  dropdownsWrap.className = 'dropdowns-row';

  const daySelect = document.createElement('select');
  daySelect.className = 'dob-select day-select';
  daySelect.setAttribute('aria-label', 'Birth day');
  addSelectOption(daySelect, '', 'Day');
  for (let d = 1; d <= 31; d++) addSelectOption(daySelect, String(d), String(d));

  const monthSelect = document.createElement('select');
  monthSelect.className = 'dob-select month-select';
  monthSelect.setAttribute('aria-label', 'Birth month');
  addSelectOption(monthSelect, '', 'Month');
  MONTH_NAMES.forEach((m, idx) => addSelectOption(monthSelect, String(idx + 1), m));

  const currentYear = new Date().getFullYear();
  const yearSelect = document.createElement('select');
  yearSelect.className = 'dob-select year-select';
  yearSelect.setAttribute('aria-label', 'Birth year');
  addSelectOption(yearSelect, '', 'Year');
  for (let y = currentYear; y >= currentYear - 100; y--) addSelectOption(yearSelect, String(y), String(y));

  dropdownsWrap.appendChild(daySelect);
  dropdownsWrap.appendChild(monthSelect);
  dropdownsWrap.appendChild(yearSelect);
  form.appendChild(dropdownsWrap);

  const errorBox = document.createElement('div');
  errorBox.className = 'form-error';
  errorBox.style.display = 'none';
  form.appendChild(errorBox);

  const lifeLabel = document.createElement('label');
  lifeLabel.className = 'form-label';
  lifeLabel.textContent = 'Picture a life of';
  form.appendChild(lifeLabel);

  const pillsWrap = document.createElement('div');
  pillsWrap.className = 'life-pills-row';
  let selectedLife = 80;
  const pillOptions = [70, 80, 90, 100];
  const pillButtons = [];

  pillOptions.forEach((lifeYears) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `life-pill-btn ${lifeYears === 80 ? 'active' : ''}`;
    btn.textContent = `${lifeYears} years`;
    btn.addEventListener('click', () => {
      selectedLife = lifeYears;
      pillButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
    pillButtons.push(btn);
    pillsWrap.appendChild(btn);
  });
  form.appendChild(pillsWrap);

  const hint = document.createElement('p');
  hint.className = 'form-hint';
  hint.textContent = 'This is a picture, not a prediction.';
  form.appendChild(hint);

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'primary-btn';
  submitBtn.textContent = 'Show my life';
  form.appendChild(submitBtn);

  const privacy = document.createElement('p');
  privacy.className = 'privacy-note';
  privacy.textContent = 'Your date of birth stays on this device. Nothing is sent or saved.';
  form.appendChild(privacy);

  if (initialValues && initialValues.dob) {
    daySelect.value = String(initialValues.dob.day);
    monthSelect.value = String(initialValues.dob.month);
    yearSelect.value = String(initialValues.dob.year);
    if (initialValues.lifePicked) {
      selectedLife = initialValues.lifePicked;
      pillButtons.forEach((btn, idx) => {
        btn.classList.toggle('active', pillOptions[idx] === selectedLife);
      });
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    errorBox.style.display = 'none';
    errorBox.textContent = '';

    const todayDate = new Date();
    const todayDayNum = Math.floor(Date.UTC(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate()) / 86400000);
    const validation = validateDate(yearSelect.value, monthSelect.value, daySelect.value, todayDayNum);

    if (!validation.valid) {
      errorBox.textContent = validation.error;
      errorBox.style.display = 'block';
      return;
    }
    if (onSubmit) {
      onSubmit({ dob: validation.date, lifePicked: selectedLife });
    }
  });

  card.appendChild(form);
  container.appendChild(card);

  return {
    card,
    setValues(dob, life) {
      if (dob) {
        daySelect.value = String(dob.day);
        monthSelect.value = String(dob.month);
        yearSelect.value = String(dob.year);
      }
      if (life) {
        selectedLife = life;
        pillButtons.forEach((btn, idx) => {
          btn.classList.toggle('active', pillOptions[idx] === life);
        });
      }
    }
  };
}

export function createStatCards(container, stats) {
  container.textContent = '';
  const wrap = document.createElement('div');
  wrap.className = 'stat-cards-wrapper';

  let aheadGroup = null;
  const aheadCardsList = [];
  if (!stats.isBonus && stats.ahead) {
    const aheadSection = document.createElement('div');
    aheadSection.className = 'stat-group';
    const aheadTitle = document.createElement('h3');
    aheadTitle.className = 'stat-group-title';
    aheadTitle.textContent = 'Ahead of you';
    aheadSection.appendChild(aheadTitle);

    const aheadGrid = document.createElement('div');
    aheadGrid.className = 'stat-cards-grid';

    const aheadItems = [
      { id: 'sundays', icon: 'sun', label: 'Sundays', value: stats.ahead.sundays, note: null },
      { id: 'moons', icon: 'moon', label: 'full moons', value: stats.ahead.fullMoonsAhead, note: null },
      { id: 'pongal', icon: 'pongal', label: 'Pongal festivals', value: stats.ahead.pongals, note: null },
      { id: 'worldcups', icon: 'cup', label: 'cricket World Cups', value: stats.ahead.worldCups, note: 'If they stay every 4 years' }
    ];

    aheadItems.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'stat-card';
      const iconWrap = document.createElement('div');
      iconWrap.className = 'stat-card-icon';
      iconWrap.appendChild(createSvgIcon(item.icon));

      const num = document.createElement('div');
      num.className = 'stat-card-num tabular';
      num.textContent = '0';

      const label = document.createElement('div');
      label.className = 'stat-card-label';
      label.textContent = item.label;

      card.appendChild(iconWrap);
      card.appendChild(num);
      card.appendChild(label);

      if (item.note) {
        const foot = document.createElement('div');
        foot.className = 'stat-card-note';
        foot.textContent = item.note;
        card.appendChild(foot);
      }
      aheadGrid.appendChild(card);
      aheadCardsList.push({ card, numEl: num, targetValue: item.value });
    });

    aheadSection.appendChild(aheadGrid);
    wrap.appendChild(aheadSection);
    aheadGroup = aheadSection;
  }

  // So far section
  const soFarSection = document.createElement('div');
  soFarSection.className = 'stat-group';
  const soFarTitle = document.createElement('h3');
  soFarTitle.className = 'stat-group-title';
  soFarTitle.textContent = 'So far';
  soFarSection.appendChild(soFarTitle);

  const soFarGrid = document.createElement('div');
  soFarGrid.className = 'stat-cards-grid';
  const soFarCardsList = [];

  const soFarItems = [
    { id: 'weeks', icon: 'calendar', label: 'weeks lived', value: stats.soFar.weeksLived, textVal: null },
    { id: 'days', icon: 'clock', label: 'days lived', value: stats.soFar.daysLived, textVal: null },
    { id: 'moonsSeen', icon: 'moon', label: 'full moons seen', value: stats.soFar.fullMoonsSeen, textVal: null },
    { id: 'heartbeats', icon: 'heart', label: 'heartbeats', value: null, textVal: stats.soFar.heartbeatsText, note: 'At about 72 beats a minute' }
  ];

  soFarItems.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'stat-card';
    const iconWrap = document.createElement('div');
    iconWrap.className = 'stat-card-icon';
    iconWrap.appendChild(createSvgIcon(item.icon));

    const num = document.createElement('div');
    num.className = 'stat-card-num tabular';
    num.textContent = '0';

    const label = document.createElement('div');
    label.className = 'stat-card-label';
    label.textContent = item.label;

    card.appendChild(iconWrap);
    card.appendChild(num);
    card.appendChild(label);

    if (item.note) {
      const foot = document.createElement('div');
      foot.className = 'stat-card-note';
      foot.textContent = item.note;
      card.appendChild(foot);
    }
    soFarGrid.appendChild(card);
    soFarCardsList.push({ card, numEl: num, targetValue: item.value, textVal: item.textVal });
  });

  soFarSection.appendChild(soFarGrid);
  wrap.appendChild(soFarSection);

  // Collapsible How we count
  const details = document.createElement('details');
  details.className = 'how-we-count';
  details.innerHTML = `
    <summary>How we count</summary>
    <div class="how-we-count-content">
      <p>Each row is one year of your age. A year is 52 weeks plus a day or two, so the dot count can differ from your exact week count by a few.</p>
      <p>Full moons use the average moon cycle of 29.53 days, so any single date can be a day off.</p>
      <p>Pongal is counted on 14 January each year.</p>
      <p>World Cups: the next men's 50-over Cricket World Cup is in October and November 2027. We assume one every 4 years after that.</p>
      <p>Heartbeats use an average of 72 beats a minute.</p>
    </div>
  `;
  wrap.appendChild(details);
  container.appendChild(wrap);

  return { wrap, aheadGroup, soFarGroup: soFarSection, aheadCardsList, soFarCardsList };
}

export function createClosingCard(container, stats, onTryAnother, onWatchAgain) {
  const card = document.createElement('div');
  card.className = 'closing-card';

  const title = document.createElement('h3');
  title.className = 'closing-title';
  title.textContent = stats.isBonus ? 'Every week is a bonus.' : 'That is a lot of Sundays.';
  card.appendChild(title);

  const body = document.createElement('p');
  body.className = 'closing-body';
  body.textContent = 'Spend a few of them learning something new.';
  card.appendChild(body);

  const btnGroup = document.createElement('div');
  btnGroup.className = 'closing-btn-group';

  const shareRow = document.createElement('div');
  shareRow.className = 'closing-share-row';
  shareRow.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:8px;';

  const sizeToggle = document.createElement('div');
  sizeToggle.className = 'share-size-toggle';
  sizeToggle.setAttribute('role', 'radiogroup');
  sizeToggle.setAttribute('aria-label', 'Share format');

  const postBtn = document.createElement('button');
  postBtn.type = 'button';
  postBtn.className = 'share-size-btn' + (getShareSize() === 'post' ? ' active' : '');
  postBtn.dataset.size = 'post';
  postBtn.textContent = 'Post';
  postBtn.onclick = () => setShareSize('post');

  const statusBtn = document.createElement('button');
  statusBtn.type = 'button';
  statusBtn.className = 'share-size-btn' + (getShareSize() === 'status' ? ' active' : '');
  statusBtn.dataset.size = 'status';
  statusBtn.textContent = 'Status';
  statusBtn.setAttribute('aria-checked', getShareSize() === 'status' ? 'true' : 'false');
  statusBtn.onclick = () => setShareSize('status');
  sizeToggle.append(postBtn, statusBtn);

  const shareBtn = document.createElement('button');
  shareBtn.type = 'button';
  shareBtn.className = 'primary-btn share-primary-btn';
  shareBtn.textContent = 'Share my dots';
  shareBtn.onclick = () => handleShareDots(stats, shareBtn, { view: 'overview' });

  shareRow.append(sizeToggle, shareBtn);
  btnGroup.appendChild(shareRow);

  const waBtn = document.createElement('button');
  waBtn.type = 'button';
  waBtn.className = 'secondary-btn wa-btn';
  waBtn.textContent = 'Send link on WhatsApp';
  waBtn.addEventListener('click', handleShareWhatsApp);
  btnGroup.appendChild(waBtn);

  const copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.className = 'secondary-btn copy-btn';
  copyBtn.textContent = 'Copy link';
  copyBtn.addEventListener('click', () => handleCopyLink(copyBtn));
  btnGroup.appendChild(copyBtn);

  const tryAnotherBtn = document.createElement('button');
  tryAnotherBtn.type = 'button';
  tryAnotherBtn.className = 'text-link-btn';
  tryAnotherBtn.textContent = 'Try another date';
  if (onTryAnother) tryAnotherBtn.addEventListener('click', onTryAnother);
  btnGroup.appendChild(tryAnotherBtn);

  const watchAgainBtn = document.createElement('button');
  watchAgainBtn.type = 'button';
  watchAgainBtn.className = 'text-link-btn';
  watchAgainBtn.textContent = 'Watch again';
  if (onWatchAgain) watchAgainBtn.addEventListener('click', onWatchAgain);
  btnGroup.appendChild(watchAgainBtn);

  card.appendChild(btnGroup);
  container.appendChild(card);
  return card;
}
