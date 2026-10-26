// Milestones Tab UI (UPGRADE_BRIEF.md Section 4H, Section 7B)
import { buildIcsCalendarFile, buildGoogleCalendarUrl } from './milestones.js';
import { trackEvent } from './share.js';

export function downloadIcsFile(milestone, siteUrl = 'https://wrench-wise.com') {
  const icsContent = buildIcsCalendarFile(milestone, siteUrl);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'nerd-birthday.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function handleCalendarAction(milestone, siteUrl = 'https://wrench-wise.com') {
  trackEvent('calendar_add');
  const isAndroid = /Android/i.test(navigator.userAgent);
  if (isAndroid) {
    const url = buildGoogleCalendarUrl(milestone, siteUrl);
    window.open(url, '_blank');
  } else {
    downloadIcsFile(milestone, siteUrl);
  }
}

function createCheckSvg() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.setAttribute('fill', 'currentColor');
  svg.setAttribute('class', 'check-icon');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('fill-rule', 'evenodd');
  path.setAttribute('d', 'M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z');
  path.setAttribute('clip-rule', 'evenodd');
  svg.appendChild(path);
  return svg;
}

function createCalendarSvg() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 20 20');
  svg.setAttribute('fill', 'currentColor');
  svg.setAttribute('class', 'milestone-cal-icon');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('fill-rule', 'evenodd');
  path.setAttribute('d', 'M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z');
  path.setAttribute('clip-rule', 'evenodd');
  svg.appendChild(path);
  return svg;
}

export function createMilestonesPanel(containerEl, options = {}) {
  const {
    milestonesData = { milestones: [], nextUp: null },
    onMilestoneSelect = null,
    siteUrl = 'https://wrench-wise.com'
  } = options;

  containerEl.textContent = '';

  const inner = document.createElement('div');
  inner.className = 'milestones-panel-inner';

  // 1. Next Up Card
  const nextUp = milestonesData.nextUp;
  if (nextUp) {
    const card = document.createElement('div');
    card.className = 'next-up-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Next milestone: ${nextUp.label}`);

    const eyebrow = document.createElement('div');
    eyebrow.className = 'next-up-eyebrow';
    eyebrow.textContent = 'Next up';
    card.appendChild(eyebrow);

    const label = document.createElement('div');
    label.className = 'next-up-label';
    label.textContent = nextUp.label;
    card.appendChild(label);

    const metaRow = document.createElement('div');
    metaRow.className = 'next-up-meta-row';

    const dateSpan = document.createElement('span');
    dateSpan.className = 'next-up-date';
    dateSpan.textContent = nextUp.formattedNextUp;
    metaRow.appendChild(dateSpan);

    if (nextUp.inAbout) {
      const sep = document.createElement('span');
      sep.className = 'next-up-dot-sep';
      sep.textContent = '•';
      metaRow.appendChild(sep);

      const inAboutSpan = document.createElement('span');
      inAboutSpan.className = 'next-up-inabout';
      inAboutSpan.textContent = nextUp.inAbout;
      metaRow.appendChild(inAboutSpan);
    }
    card.appendChild(metaRow);

    const ageDiv = document.createElement('div');
    ageDiv.className = 'next-up-age';
    ageDiv.textContent = `You will be ${nextUp.age}`;
    card.appendChild(ageDiv);

    const actions = document.createElement('div');
    actions.className = 'next-up-actions';

    const calBtn = document.createElement('button');
    calBtn.type = 'button';
    calBtn.className = 'milestone-cal-btn';
    calBtn.appendChild(createCalendarSvg());
    const calBtnText = document.createTextNode('Add to calendar');
    calBtn.appendChild(calBtnText);

    calBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleCalendarAction(nextUp, siteUrl);
    });

    actions.appendChild(calBtn);
    card.appendChild(actions);

    const triggerSelect = () => {
      if (typeof onMilestoneSelect === 'function' && nextUp.hasMarker && nextUp.dotIndex >= 0) {
        onMilestoneSelect(nextUp);
      }
    };

    card.addEventListener('click', triggerSelect);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerSelect();
      }
    });

    inner.appendChild(card);
  }

  // 2. Chronological Milestones List
  const shownMilestones = (milestonesData.milestones || []).filter(m => m.status !== 'hidden');
  const listEl = document.createElement('div');
  listEl.className = 'milestones-list';
  listEl.setAttribute('role', 'list');

  shownMilestones.forEach(m => {
    const item = document.createElement('div');
    const isInteractive = m.hasMarker && m.dotIndex >= 0;
    item.className = `milestone-item milestone-${m.status}${isInteractive ? ' interactive' : ''}`;
    item.setAttribute('role', 'listitem');
    if (isInteractive) {
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-label', `${m.label}, ${m.formattedDate}`);
    }

    const info = document.createElement('div');
    info.className = 'milestone-info';

    // Title row with label + status badge
    const titleRow = document.createElement('div');
    titleRow.className = 'milestone-title-row';

    const labelSpan = document.createElement('span');
    labelSpan.className = 'milestone-label';
    labelSpan.textContent = m.label;
    titleRow.appendChild(labelSpan);

    if (m.status === 'done') {
      const badge = document.createElement('span');
      badge.className = 'milestone-badge badge-done';
      badge.appendChild(createCheckSvg());
      const doneText = document.createTextNode('Done');
      badge.appendChild(doneText);
      titleRow.appendChild(badge);
    } else if (m.status === 'today') {
      const badge = document.createElement('span');
      badge.className = 'milestone-badge badge-today';
      badge.textContent = 'Today!';
      titleRow.appendChild(badge);
    }

    info.appendChild(titleRow);

    // Meta row (date, age, inAbout)
    const metaRow = document.createElement('div');
    metaRow.className = 'milestone-meta-row';

    const dateSpan = document.createElement('span');
    dateSpan.className = 'milestone-date';
    dateSpan.textContent = m.formattedDate;
    metaRow.appendChild(dateSpan);

    const sep1 = document.createElement('span');
    sep1.className = 'milestone-meta-sep';
    sep1.textContent = '•';
    metaRow.appendChild(sep1);

    const ageSpan = document.createElement('span');
    ageSpan.className = 'milestone-age';
    ageSpan.textContent = `at ${m.age}`;
    metaRow.appendChild(ageSpan);

    if (m.status === 'ahead' && m.inAbout) {
      const sep2 = document.createElement('span');
      sep2.className = 'milestone-meta-sep';
      sep2.textContent = '•';
      metaRow.appendChild(sep2);

      const inAboutSpan = document.createElement('span');
      inAboutSpan.className = 'milestone-inabout';
      inAboutSpan.textContent = m.inAbout;
      metaRow.appendChild(inAboutSpan);
    }

    info.appendChild(metaRow);
    item.appendChild(info);

    // Small "Add to calendar" button for ahead and today items
    if (m.status === 'ahead' || m.status === 'today') {
      const action = document.createElement('div');
      action.className = 'milestone-action';

      const calBtn = document.createElement('button');
      calBtn.type = 'button';
      calBtn.className = 'milestone-list-cal-btn';
      calBtn.textContent = 'Add to calendar';
      calBtn.setAttribute('aria-label', `Add ${m.label} to calendar`);

      calBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleCalendarAction(m, siteUrl);
      });

      action.appendChild(calBtn);
      item.appendChild(action);
    }

    if (isInteractive) {
      const triggerSelect = () => {
        if (typeof onMilestoneSelect === 'function') {
          onMilestoneSelect(m);
        }
      };

      item.addEventListener('click', triggerSelect);
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerSelect();
        }
      });
    }

    listEl.appendChild(item);
  });

  inner.appendChild(listEl);

  // 3. Footnotes (UPGRADE_BRIEF.md Section 4H)
  const footnotes = document.createElement('div');
  footnotes.className = 'milestones-footnotes';

  const fn1 = document.createElement('p');
  fn1.className = 'milestone-footnote';
  fn1.textContent = 'Billion-second days depend on the time you were born, so they can be a day off.';

  const fn2 = document.createElement('p');
  fn2.className = 'milestone-footnote';
  fn2.textContent = 'Mars birthdays use a Mars year of 686.98 Earth days.';

  const fn3 = document.createElement('p');
  fn3.className = 'milestone-footnote';
  fn3.textContent = 'Full moons use the average moon cycle.';

  footnotes.append(fn1, fn2, fn3);
  inner.appendChild(footnotes);

  containerEl.appendChild(inner);

  return {
    inner,
    nextUp
  };
}
