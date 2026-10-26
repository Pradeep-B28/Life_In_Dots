// UI helpers for reveal animation, cards triggering, reduced motion, and skip
import { easeOutCubic } from './counter.js';
import { formatNumber } from './stats.js';
import { stopAllSounds } from './audio.js';
import { fromDayNumber, formatShortDate } from './dates.js';

export function animateCount(el, from, to, duration) {
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min(1, (ts - start) / duration);
    const val = Math.round(from + easeOutCubic(progress) * (to - from));
    el.textContent = formatNumber(val);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = formatNumber(to);
  }
  requestAnimationFrame(step);
}

export function triggerCardsSequence(cardsUI, closing) {
  if (!cardsUI) return;
  let delay = 0;

  if (cardsUI.aheadCardsList) {
    cardsUI.aheadCardsList.forEach(c => {
      setTimeout(() => {
        c.card.classList.add('visible');
        animateCount(c.numEl, 0, c.targetValue, 800);
      }, delay);
      delay += 80;
    });
  }

  if (cardsUI.soFarCardsList) {
    cardsUI.soFarCardsList.forEach(c => {
      setTimeout(() => {
        c.card.classList.add('visible');
        if (c.textVal) {
          c.numEl.textContent = c.textVal;
        } else {
          animateCount(c.numEl, 0, c.targetValue, 800);
        }
      }, delay);
      delay += 80;
    });
  }

  if (closing) {
    setTimeout(() => {
      closing.classList.add('visible');
    }, delay + 100);
  }
}

export function renderReducedMotion({
  stats,
  gridComponent,
  homeCard,
  resultSection,
  headlineEl,
  sublineEl,
  statCardsUI,
  closingCard,
  flashbackPicks = [],
  onComplete
}) {
  if (homeCard) homeCard.style.display = 'none';
  if (resultSection) {
    resultSection.style.display = 'block';
    resultSection.style.opacity = '1';
    resultSection.style.transform = 'none';
  }
  gridComponent.redraw();

  if (stats.isBonus) {
    headlineEl.textContent = 'You have lived over 100 years. Every week from here is a bonus.';
    sublineEl.textContent = `${formatNumber(stats.weeksLived)} weeks lived.`;
  } else {
    headlineEl.textContent = `You have about ${formatNumber(stats.ahead.sundays)} Sundays ahead.`;
    sublineEl.textContent = `In a life of ${stats.lifeUsed} years. Every grey dot is a week still ahead of you.`;
  }

  if (flashbackPicks && flashbackPicks.length > 0) {
    const listEl = document.createElement('div');
    listEl.className = 'reduced-flashback-list';
    flashbackPicks.forEach(p => {
      const item = document.createElement('div');
      item.className = 'reduced-flashback-item';
      item.textContent = p.sentence;
      listEl.appendChild(item);
    });
    headlineEl.parentNode.insertBefore(listEl, headlineEl.nextSibling);
  }

  if (statCardsUI) {
    if (statCardsUI.aheadCardsList) {
      statCardsUI.aheadCardsList.forEach(c => {
        c.numEl.textContent = formatNumber(c.targetValue);
        c.card.classList.add('visible');
      });
    }
    if (statCardsUI.soFarCardsList) {
      statCardsUI.soFarCardsList.forEach(c => {
        c.numEl.textContent = c.textVal ? c.textVal : formatNumber(c.targetValue);
        c.card.classList.add('visible');
      });
    }
  }

  if (closingCard) closingCard.classList.add('visible');
  if (onComplete) onComplete();
}

export function performSkipToFinal({
  homeCard,
  resultSection,
  captionWrap,
  skipBtn,
  gridComponent,
  stats,
  headlineEl,
  sublineEl,
  statCardsUI,
  closingCard,
  onComplete
}) {
  stopAllSounds();

  if (homeCard) homeCard.style.display = 'none';
  if (resultSection) {
    resultSection.style.display = 'block';
    resultSection.style.opacity = '1';
    resultSection.style.transform = 'none';
  }

  if (captionWrap) captionWrap.remove();
  if (skipBtn) skipBtn.remove();
  if (gridComponent.setRevealing) gridComponent.setRevealing(false);
  if (gridComponent.enableOverlay) gridComponent.enableOverlay(true);
  if (gridComponent.enableTooltip) gridComponent.enableTooltip(true);
  gridComponent.redraw();

  if (stats.isBonus) {
    headlineEl.textContent = 'You have lived over 100 years. Every week from here is a bonus.';
    sublineEl.textContent = `${formatNumber(stats.weeksLived)} weeks lived.`;
  } else {
    headlineEl.textContent = `You have about ${formatNumber(stats.ahead.sundays)} Sundays ahead.`;
    sublineEl.textContent = `In a life of ${stats.lifeUsed} years. Every grey dot is a week still ahead of you.`;
  }

  if (statCardsUI) {
    if (statCardsUI.aheadCardsList) {
      statCardsUI.aheadCardsList.forEach(c => {
        c.numEl.textContent = formatNumber(c.targetValue);
        c.card.classList.add('visible');
      });
    }
    if (statCardsUI.soFarCardsList) {
      statCardsUI.soFarCardsList.forEach(c => {
        c.numEl.textContent = c.textVal ? c.textVal : formatNumber(c.targetValue);
        c.card.classList.add('visible');
      });
    }
  }

  if (closingCard) closingCard.classList.add('visible');
  if (onComplete) onComplete();
}

export function drawFlashbackPick(oCtx, pick, pickTime, layout, colors, captionEl) {
  let capOpacity = 1;
  if (pickTime < 0.2) capOpacity = pickTime / 0.2;
  else if (pickTime > 1.8) capOpacity = (2.0 - pickTime) / 0.2;

  captionEl.className = 'reveal-caption flashback';
  const dateParts = fromDayNumber(pick.dayNumber);
  const formattedDate = formatShortDate(dateParts);
  captionEl.textContent = '';
  const sTitle = document.createElement('span'); sTitle.textContent = pick.sentence;
  const sSub = document.createElement('span'); sSub.className = 'flashback-sub'; sSub.textContent = formattedDate;
  captionEl.append(sTitle, sSub);
  captionEl.style.opacity = String(Math.max(0, Math.min(1, capOpacity)));

  const pickRow = Math.floor(pick.dotIndex / 52);
  const pickCol = pick.dotIndex % 52;
  const dotCenter = {
    cx: layout.gutterWidth + pickCol * layout.s + layout.s / 2,
    cy: pickRow * layout.s + Math.floor(pickRow / 10) * (0.8 * layout.s) + layout.s / 2
  };

  const pPick = pickTime / 2.0;
  const popScale = 1 + Math.sin(Math.min(1, pPick * 2) * Math.PI) * 0.8;
  const ringScale = 1 + pPick * 2.4;
  const ringAlpha = Math.max(0, 1 - pPick * 1.5);

  oCtx.save();
  oCtx.beginPath();
  oCtx.arc(dotCenter.cx, dotCenter.cy, layout.dotRadius * popScale, 0, Math.PI * 2);
  oCtx.fillStyle = colors.history;
  oCtx.fill();

  if (ringAlpha > 0) {
    oCtx.beginPath();
    oCtx.arc(dotCenter.cx, dotCenter.cy, layout.dotRadius * ringScale, 0, Math.PI * 2);
    oCtx.lineWidth = 2;
    oCtx.strokeStyle = `rgba(217, 119, 6, ${ringAlpha})`;
    oCtx.stroke();
  }
  oCtx.restore();
}
