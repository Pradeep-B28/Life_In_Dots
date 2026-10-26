// Grid layout, canvas drawing, hit testing, tooltip and layer rendering (Section 4B, 4D, 4I)
import { dayNumber, fromDayNumber, addYears } from './dates.js';
import { getThemeColors, resolveCssVar, getRowColor } from './colors.js';
import { getDotLayerStyle, renderLegend, getDotTooltipDetails, VIEWS } from './layers.js';
import { TIME_BUCKETS } from './timebudget.js';

import {
  drawAgeGutter,
  drawEmptyGrid,
  drawLivedDot,
  drawOverlayCurrentDot,
  drawGrid
} from './grid-draw.js';

export {
  getThemeColors,
  resolveCssVar,
  getRowColor,
  drawAgeGutter,
  drawEmptyGrid,
  drawLivedDot,
  drawOverlayCurrentDot,
  drawGrid
};

export function computeGridLayout(rows, availWidth, availHeight = null, isLaptop = false) {
  const gutterWidth = isLaptop ? 24 : 20;
  const numGaps = Math.max(0, Math.floor((rows - 1) / 10));
  const widthForCols = Math.max(0, availWidth - gutterWidth);
  const s_w = Math.floor(widthForCols / 52);
  let s = Math.max(5, s_w);

  if (isLaptop && availHeight && availHeight > 0) {
    const totalRowUnits = rows + numGaps * 0.8;
    const s_h = Math.floor(availHeight / totalRowUnits);
    s = Math.max(5, Math.min(s_w, s_h));
  }

  return {
    rows,
    cols: 52,
    gutterWidth,
    s,
    dotDiameter: 0.72 * s,
    dotRadius: 0.36 * s,
    numGaps,
    width: gutterWidth + 52 * s,
    height: rows * s + numGaps * (0.8 * s),
    isLaptop
  };
}

export function getDotCenter(row, col, layout) {
  const { gutterWidth, s } = layout;
  const gapCount = Math.floor(row / 10);
  return {
    cx: gutterWidth + col * s + s / 2,
    cy: row * s + gapCount * (0.8 * s) + s / 2
  };
}

export function hitTestDot(x, y, layout) {
  const { gutterWidth, s, rows, width, height } = layout;
  if (x < gutterWidth || x >= width || y < 0 || y >= height) return null;
  const col = Math.floor((x - gutterWidth) / s);
  if (col < 0 || col >= 52) return null;

  const decadeBlockHeight = 10.8 * s;
  const decadeIndex = Math.floor(y / decadeBlockHeight);
  const offsetInDecade = y - decadeIndex * decadeBlockHeight;
  if (offsetInDecade >= 10 * s) return null;

  const row = decadeIndex * 10 + Math.floor(offsetInDecade / s);
  return (row < rows) ? { row, col } : null;
}

export function createGridComponent(containerEl, stats, initialView = VIEWS.OVERVIEW, initialContext = null) {
  containerEl.textContent = '';
  const gridWrapper = document.createElement('div');
  gridWrapper.className = 'grid-card-wrap';

  if (stats.movedUp) {
    const chip = document.createElement('div');
    chip.className = 'moved-up-chip';
    chip.textContent = `You have already lived past ${stats.lifePicked}, so this shows ${stats.lifeUsed} years.`;
    gridWrapper.appendChild(chip);
  }

  const card = document.createElement('div');
  card.className = 'grid-card';
  card.style.position = 'relative';

  const canvas = document.createElement('canvas');
  canvas.className = 'grid-canvas';
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', `Grid of ${stats.totalDots.toLocaleString('en-IN')} dots. ${stats.livedDots.toLocaleString('en-IN')} lived. This week is week ${stats.weekIndex + 1} of age ${stats.age}.`);
  card.appendChild(canvas);

  const overlayCanvas = document.createElement('canvas');
  overlayCanvas.className = 'grid-overlay-canvas';
  overlayCanvas.style.cssText = 'position:absolute;left:0.5rem;top:0.5rem;pointer-events:none;';
  card.appendChild(overlayCanvas);

  const tooltip = document.createElement('div');
  tooltip.className = 'dot-tooltip';
  tooltip.style.display = 'none';
  card.appendChild(tooltip);
  gridWrapper.appendChild(card);

  const legend = document.createElement('div');
  legend.className = 'grid-legend';
  gridWrapper.appendChild(legend);

  const note = document.createElement('p');
  note.className = 'grid-note';
  note.textContent = 'One row is one year of your age, with 52 dots.';
  gridWrapper.appendChild(note);
  containerEl.appendChild(gridWrapper);

  let currentLayout = null;
  const ctx = canvas.getContext('2d');
  const overlayCtx = overlayCanvas.getContext('2d');

  let activeView = initialView || VIEWS.OVERVIEW;
  let activeLayerContext = {
    livedDots: stats.livedDots,
    currentDotIndex: stats.currentRow * 52 + stats.weekIndex,
    totalDots: stats.totalDots,
    isBonus: stats.isBonus,
    normalLivedColors: Array.from({ length: stats.rows }, (_, r) => getRowColor(r, stats.currentRow, getThemeColors())),
    chapters: [],
    dotChapterMap: [],
    hasAnyChapters: false,
    historyEvents: [],
    activeFilter: 'all',
    timeSplit: null,
    milestones: [],
    ...(initialContext || {})
  };

  function resizeCanvases() {
    const isLaptop = window.innerWidth >= 900;
    const cardRect = card.getBoundingClientRect();
    const availWidth = cardRect.width > 0 ? cardRect.width - 16 : (isLaptop ? 500 : 340);
    const availHeight = isLaptop ? window.innerHeight - 180 : null;

    currentLayout = computeGridLayout(stats.rows, availWidth, availHeight, isLaptop);
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    [canvas, overlayCanvas].forEach((cv) => {
      cv.width = Math.round(currentLayout.width * dpr);
      cv.height = Math.round(currentLayout.height * dpr);
      cv.style.width = `${currentLayout.width}px`;
      cv.style.height = `${currentLayout.height}px`;
    });

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    overlayCtx.setTransform(1, 0, 0, 1, 0, 0);
    overlayCtx.scale(dpr, dpr);
  }

  let showOverlay = false;
  let tooltipEnabled = false;
  let isRevealing = false;

  function renderInstant() {
    if (isRevealing) return;
    resizeCanvases();
    const colors = getThemeColors();
    activeLayerContext.normalLivedColors = Array.from({ length: stats.rows }, (_, r) => getRowColor(r, stats.currentRow, colors));
    drawGrid(ctx, currentLayout, stats, colors, activeView, activeLayerContext);
    renderLegend(legend, activeView, activeLayerContext);

    if (showOverlay && stats.currentRow < stats.rows && stats.weekIndex >= 0) {
      drawOverlayCurrentDot(overlayCtx, currentLayout, colors, {
        row: stats.currentRow,
        col: stats.weekIndex,
        scale: 1,
        pulseScale: 1.9,
        pulseAlpha: 0.5,
        showLabel: true
      });
    }
  }

  function setLayer(view, layerContextUpdate = null) {
    activeView = view;
    if (layerContextUpdate) {
      activeLayerContext = { ...activeLayerContext, ...layerContextUpdate };
    }
    renderInstant();
    canvas.classList.remove('layer-fade-anim');
    requestAnimationFrame(() => {
      canvas.classList.add('layer-fade-anim');
    });
  }

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function showTooltip(row, col) {
    if (!currentLayout) return;
    const { cx, cy } = getDotCenter(row, col, currentLayout);
    const isCurrent = (row === stats.currentRow && col === stats.weekIndex);
    const bday = addYears(stats.dob, row);
    const dotDayNum = dayNumber(bday.year, bday.month, bday.day) + col * 7;
    const dotDate = fromDayNumber(dotDayNum);
    const dotIdx = row * 52 + col;

    tooltip.textContent = '';
    const l1 = document.createElement('div'); l1.style.fontWeight = '700'; l1.textContent = `Age ${row}, week ${col + 1}`;
    const l2 = document.createElement('div'); l2.style.fontSize = '0.75rem'; l2.style.color = 'var(--muted)';
    l2.textContent = isCurrent ? 'This week' : `Around ${MONTHS[dotDate.month - 1]} ${dotDate.year}`;
    tooltip.append(l1, l2);

    const extraLines = getDotTooltipDetails(dotIdx, activeView, activeLayerContext);
    extraLines.forEach(item => {
      const el = document.createElement('div');
      el.style.fontSize = '0.75rem';
      el.style.color = item.color || 'var(--text)';
      if (item.isStrong) el.style.fontWeight = '700';
      el.textContent = item.text;
      tooltip.appendChild(el);
    });

    tooltip.style.display = 'block';
    const leftPos = (cx + 180 > currentLayout.width) ? Math.max(8, cx - 170) : cx + 8;
    tooltip.style.left = `${leftPos}px`;
    tooltip.style.top = `${cy + 8 - 12}px`;
  }

  function showDotDetails(dotIndex) {
    if (!currentLayout) return;
    const r = Math.floor(dotIndex / 52);
    const c = dotIndex % 52;
    showTooltip(r, c);
  }

  function pulseDot(dotIndex) {
    if (!currentLayout) return;
    const r = Math.floor(dotIndex / 52);
    const c = dotIndex % 52;
    const { cx, cy } = getDotCenter(r, c, currentLayout);
    let start = null;
    const dur = 600;
    function frame(t) {
      if (!start) start = t;
      const progress = Math.min(1, (t - start) / dur);
      const ease = 1 - Math.pow(1 - progress, 2);
      const radius = currentLayout.dotRadius * (1 + ease * 3);
      const alpha = (1 - ease) * 0.9;
      overlayCtx.clearRect(0, 0, currentLayout.width, currentLayout.height);
      if (showOverlay) {
        drawOverlayCurrentDot(overlayCtx, currentLayout, getThemeColors(), {
          row: stats.currentRow, col: stats.weekIndex, scale: 1, pulseAlpha: 0, showLabel: false
        });
      }
      overlayCtx.beginPath();
      overlayCtx.arc(cx, cy, radius, 0, Math.PI * 2);
      overlayCtx.lineWidth = 2.5;
      overlayCtx.strokeStyle = `rgba(217, 119, 6, ${alpha})`;
      overlayCtx.stroke();
      if (progress < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function redrawTimeRange(timeSplit) {
    if (!currentLayout || !timeSplit || !timeSplit.valid || timeSplit.H <= 0) return;
    const colors = getThemeColors();
    const currentDotIdx = stats.currentRow * 52 + stats.weekIndex;
    const startIdx = currentDotIdx + 1;
    const H = timeSplit.H;

    let offset = 0;
    for (let b = 0; b < 6; b++) {
      const bucketWeeks = timeSplit.weeks[b] || 0;
      if (bucketWeeks <= 0) continue;
      const bucket = TIME_BUCKETS[b];
      const color = resolveCssVar(`var(${bucket.colorVar})`, colors.brand);
      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < bucketWeeks; i++) {
        const dotIdx = startIdx + offset;
        offset++;
        if (offset > H) break;
        const r = Math.floor(dotIdx / 52);
        const c = dotIdx % 52;
        if (r >= currentLayout.rows) break;
        const { cx, cy } = getDotCenter(r, c, currentLayout);
        ctx.moveTo(cx + currentLayout.dotRadius, cy);
        ctx.arc(cx, cy, currentLayout.dotRadius, 0, Math.PI * 2);
      }
      ctx.fill();
    }
  }

  function animateSwapDots(dotIndices, colorVar = '--t-learn') {
    if (!currentLayout || !dotIndices || dotIndices.length === 0) return;
    const colors = getThemeColors();
    const targetColor = resolveCssVar(`var(${colorVar})`, colors.brand);
    let start = null;
    const dur = 300;
    function step(t) {
      if (!start) start = t;
      const progress = Math.min(1, (t - start) / dur);
      const popScale = 1.0 + Math.sin(progress * Math.PI) * 0.7;

      overlayCtx.clearRect(0, 0, currentLayout.width, currentLayout.height);
      if (showOverlay) {
        drawOverlayCurrentDot(overlayCtx, currentLayout, colors, {
          row: stats.currentRow, col: stats.weekIndex, scale: 1, pulseAlpha: 0, showLabel: false
        });
      }

      overlayCtx.save();
      overlayCtx.fillStyle = targetColor;
      for (const idx of dotIndices) {
        const r = Math.floor(idx / 52);
        const c = idx % 52;
        if (r >= currentLayout.rows) continue;
        const { cx, cy } = getDotCenter(r, c, currentLayout);
        overlayCtx.beginPath();
        overlayCtx.arc(cx, cy, currentLayout.dotRadius * popScale, 0, Math.PI * 2);
        overlayCtx.fill();
      }
      overlayCtx.restore();

      if (progress < 1) {
        requestAnimationFrame(step);
      } else if (showOverlay) {
        drawOverlayCurrentDot(overlayCtx, currentLayout, colors, {
          row: stats.currentRow, col: stats.weekIndex, scale: 1, pulseAlpha: 0, showLabel: false
        });
      }
    }
    requestAnimationFrame(step);
  }

  function handlePointer(e) {
    if (!tooltipEnabled || !currentLayout) return;
    const rect = canvas.getBoundingClientRect();
    const hit = hitTestDot(e.clientX - rect.left, e.clientY - rect.top, currentLayout);
    if (hit) showTooltip(hit.row, hit.col);
    else tooltip.style.display = 'none';
  }

  canvas.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') handlePointer(e); });
  canvas.addEventListener('pointerleave', () => { tooltip.style.display = 'none'; });
  canvas.addEventListener('pointerdown', (e) => { e.stopPropagation(); handlePointer(e); });
  document.addEventListener('pointerdown', (e) => {
    if (!card.contains(e.target) && !e.target.closest('[data-dot-index]')) tooltip.style.display = 'none';
  });

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { renderInstant(); }, 150);
  });

  renderInstant();

  return {
    card,
    canvas,
    overlayCanvas,
    ctx,
    overlayCtx,
    getLayout: () => currentLayout,
    resizeCanvases,
    redraw: renderInstant,
    enableOverlay: (on = true) => { showOverlay = on; },
    enableTooltip: (on = true) => { tooltipEnabled = on; },
    setRevealing: (on = true) => { isRevealing = on; },
    setLayer,
    getView: () => activeView,
    showDotDetails,
    pulseDot,
    redrawTimeRange,
    animateSwapDots,
    drawEmpty: (alpha = 1) => drawEmptyGrid(ctx, currentLayout, getThemeColors(), alpha),
    drawLived: (row, col) => drawLivedDot(ctx, row, col, currentLayout, getThemeColors(), stats.currentRow),
    drawOverlay: (opts) => drawOverlayCurrentDot(overlayCtx, currentLayout, getThemeColors(), { row: stats.currentRow, col: stats.weekIndex, ...opts }),
    clearOverlay: () => overlayCtx.clearRect(0, 0, currentLayout.width, currentLayout.height)
  };
}
