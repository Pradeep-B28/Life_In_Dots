// Grid layout, canvas drawing, hit testing and tooltip handling
import { dayNumber, fromDayNumber, addYears } from './dates.js';

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

  const gridWidth = gutterWidth + 52 * s;
  const gridHeight = rows * s + numGaps * (0.8 * s);
  const dotDiameter = 0.72 * s;

  return {
    rows,
    cols: 52,
    gutterWidth,
    s,
    dotDiameter,
    dotRadius: dotDiameter / 2,
    numGaps,
    width: gridWidth,
    height: gridHeight,
    isLaptop
  };
}

export function getDotCenter(row, col, layout) {
  const { gutterWidth, s } = layout;
  const gapCount = Math.floor(row / 10);
  const cx = gutterWidth + col * s + s / 2;
  const cy = row * s + gapCount * (0.8 * s) + s / 2;
  return { cx, cy };
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

  const rowInDecade = Math.floor(offsetInDecade / s);
  const row = decadeIndex * 10 + rowInDecade;
  if (row >= rows) return null;
  return { row, col };
}

export function getThemeColors() {
  if (typeof window === 'undefined') {
    return {
      future: '#D1D5DB',
      livedFrom: '#059669',
      livedMid: '#0D9488',
      livedTo: '#06B6D4',
      now: '#047857',
      muted: '#6B7280',
      brandSoft: 'rgba(5, 150, 105, 0.15)'
    };
  }
  const style = getComputedStyle(document.documentElement);
  return {
    future: style.getPropertyValue('--dot-future').trim() || '#D1D5DB',
    livedFrom: style.getPropertyValue('--dot-lived-from').trim() || '#059669',
    livedMid: style.getPropertyValue('--dot-lived-mid').trim() || '#0D9488',
    livedTo: style.getPropertyValue('--dot-lived-to').trim() || '#06B6D4',
    now: style.getPropertyValue('--dot-now').trim() || '#047857',
    muted: style.getPropertyValue('--muted').trim() || '#6B7280',
    brandSoft: style.getPropertyValue('--brand-soft').trim() || 'rgba(5, 150, 105, 0.15)'
  };
}

export function parseColor(c) {
  if (!c) return [5, 150, 105];
  if (c.startsWith('#')) {
    let hex = c.slice(1);
    if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
    const num = parseInt(hex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }
  const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : [5, 150, 105];
}

export function interpolateColor(c1, c2, factor) {
  const f = Math.max(0, Math.min(1, factor));
  return `rgb(${Math.round(c1[0] + f * (c2[0] - c1[0]))}, ${Math.round(c1[1] + f * (c2[1] - c1[1]))}, ${Math.round(c1[2] + f * (c2[2] - c1[2]))})`;
}

export function getRowColor(row, currentRow, colors) {
  if (currentRow <= 0) return colors.livedFrom;
  const t = Math.max(0, Math.min(1, row / currentRow));
  const [cF, cM, cT] = [parseColor(colors.livedFrom), parseColor(colors.livedMid), parseColor(colors.livedTo)];
  return t <= 0.5 ? interpolateColor(cF, cM, t / 0.5) : interpolateColor(cM, cT, (t - 0.5) / 0.5);
}

export function drawAgeGutter(ctx, layout, colors) {
  ctx.font = '11px ui-sans-serif, system-ui, -apple-system, sans-serif';
  ctx.fillStyle = colors.muted;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  const maxDecade = Math.floor((layout.rows - 1) / 10);
  for (let d = 0; d <= maxDecade; d++) {
    const row = d * 10;
    const { cy } = getDotCenter(row, 0, layout);
    ctx.fillText(String(row), layout.gutterWidth - 5, cy);
  }
}

export function drawEmptyGrid(ctx, layout, colors, alpha = 1) {
  ctx.clearRect(0, 0, layout.width, layout.height);
  drawAgeGutter(ctx, layout, colors);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = colors.future;
  ctx.beginPath();
  for (let r = 0; r < layout.rows; r++) {
    for (let col = 0; col < 52; col++) {
      const { cx, cy } = getDotCenter(r, col, layout);
      ctx.moveTo(cx + layout.dotRadius, cy);
      ctx.arc(cx, cy, layout.dotRadius, 0, Math.PI * 2);
    }
  }
  ctx.fill();
  ctx.restore();
}

export function drawLivedDot(ctx, row, col, layout, colors, currentRow) {
  const { cx, cy } = getDotCenter(row, col, layout);
  ctx.fillStyle = getRowColor(row, currentRow, colors);
  ctx.beginPath();
  ctx.arc(cx, cy, layout.dotRadius, 0, Math.PI * 2);
  ctx.fill();
}

export function drawOverlayCurrentDot(ctx, layout, colors, options = {}) {
  const { row, col, scale = 1, pulseScale = 1, pulseAlpha = 0, showLabel = false } = options;
  ctx.clearRect(0, 0, layout.width, layout.height);
  const { cx, cy } = getDotCenter(row, col, layout);
  const r = layout.dotRadius * scale;

  // Pulsing ring
  if (pulseAlpha > 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, layout.dotRadius * pulseScale * 1.9, 0, Math.PI * 2);
    ctx.lineWidth = 2;
    ctx.strokeStyle = `rgba(4, 120, 87, ${pulseAlpha})`;
    ctx.stroke();
  }

  // Soft glow
  ctx.beginPath();
  ctx.arc(cx, cy, r * 2.2, 0, Math.PI * 2);
  ctx.fillStyle = colors.brandSoft;
  ctx.fill();

  // Static 2px ring
  ctx.beginPath();
  ctx.arc(cx, cy, r * 1.9, 0, Math.PI * 2);
  ctx.lineWidth = 2;
  ctx.strokeStyle = colors.now;
  ctx.stroke();

  // Center dot
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fillStyle = colors.now;
  ctx.fill();

  // "You are here" label with pointer line
  if (showLabel) {
    const isTop = row < 4;
    const lineLen = 14;
    const labelY = isTop ? cy + r * 1.9 + lineLen : cy - r * 1.9 - lineLen;
    ctx.beginPath();
    ctx.moveTo(cx, isTop ? cy + r * 1.9 : cy - r * 1.9);
    ctx.lineTo(cx, labelY);
    ctx.strokeStyle = colors.now;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const text = 'You are here';
    ctx.font = '700 11px ui-sans-serif, system-ui, -apple-system, sans-serif';
    const boxW = ctx.measureText(text).width + 12;
    const boxH = 18;
    const [boxX, boxY] = [cx - boxW / 2, isTop ? labelY : labelY - boxH];

    ctx.fillStyle = colors.now;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(boxX, boxY, boxW, boxH, 4);
    else ctx.rect(boxX, boxY, boxW, boxH);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, cx, boxY + boxH / 2);
  }
}

export function drawGrid(ctx, layout, stats, colors) {
  drawEmptyGrid(ctx, layout, colors);
  for (let r = 0; r < Math.min(layout.rows, stats.currentRow); r++) {
    ctx.fillStyle = getRowColor(r, stats.currentRow, colors);
    ctx.beginPath();
    for (let c = 0; c < 52; c++) {
      const { cx, cy } = getDotCenter(r, c, layout);
      ctx.moveTo(cx + layout.dotRadius, cy);
      ctx.arc(cx, cy, layout.dotRadius, 0, Math.PI * 2);
    }
    ctx.fill();
  }
  if (stats.currentRow < layout.rows && stats.weekIndex > 0) {
    ctx.fillStyle = getRowColor(stats.currentRow, stats.currentRow, colors);
    ctx.beginPath();
    for (let c = 0; c < stats.weekIndex; c++) {
      const { cx, cy } = getDotCenter(stats.currentRow, c, layout);
      ctx.moveTo(cx + layout.dotRadius, cy);
      ctx.arc(cx, cy, layout.dotRadius, 0, Math.PI * 2);
    }
    ctx.fill();
  }
}

export function createGridComponent(containerEl, stats) {
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

  // Overlay canvas for animations
  const overlayCanvas = document.createElement('canvas');
  overlayCanvas.className = 'grid-overlay-canvas';
  overlayCanvas.style.position = 'absolute';
  overlayCanvas.style.left = '0.5rem';
  overlayCanvas.style.top = '0.5rem';
  overlayCanvas.style.pointerEvents = 'none';
  card.appendChild(overlayCanvas);

  const tooltip = document.createElement('div');
  tooltip.className = 'dot-tooltip';
  tooltip.style.display = 'none';
  card.appendChild(tooltip);
  gridWrapper.appendChild(card);

  // Legend
  const legend = document.createElement('div');
  legend.className = 'grid-legend';
  [['lived', 'Lived'], ['now', 'This week'], ['ahead', 'Ahead']].forEach(([cls, txt]) => {
    const item = document.createElement('div');
    item.className = 'legend-item';
    const dot = document.createElement('span');
    dot.className = `legend-dot ${cls}`;
    const span = document.createElement('span');
    span.textContent = txt;
    item.appendChild(dot);
    item.appendChild(span);
    legend.appendChild(item);
  });
  gridWrapper.appendChild(legend);

  const note = document.createElement('p');
  note.className = 'grid-note';
  note.textContent = 'One row is one year of your age, with 52 dots.';
  gridWrapper.appendChild(note);

  containerEl.appendChild(gridWrapper);

  let currentLayout = null;
  const ctx = canvas.getContext('2d');
  const overlayCtx = overlayCanvas.getContext('2d');

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

  function renderInstant() {
    resizeCanvases();
    const colors = getThemeColors();
    drawGrid(ctx, currentLayout, stats, colors);
    if (stats.currentRow < stats.rows && stats.weekIndex >= 0) {
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

  // Tooltip interaction
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function showTooltip(row, col) {
    if (!currentLayout) return;
    const { cx, cy } = getDotCenter(row, col, currentLayout);
    const isCurrent = (row === stats.currentRow && col === stats.weekIndex);
    const bday = addYears(stats.dob, row);
    const dotDayNum = dayNumber(bday.year, bday.month, bday.day) + col * 7;
    const dotDate = fromDayNumber(dotDayNum);

    tooltip.textContent = '';
    const line1 = document.createElement('div');
    line1.style.fontWeight = '700';
    line1.textContent = `Age ${row}, week ${col + 1}`;
    const line2 = document.createElement('div');
    line2.style.fontSize = '0.75rem';
    line2.style.color = 'var(--muted)';
    line2.textContent = isCurrent ? 'This week' : `Around ${MONTHS[dotDate.month - 1]} ${dotDate.year}`;
    tooltip.append(line1, line2);
    tooltip.style.display = 'block';
    tooltip.style.left = `${cx + 8}px`;
    tooltip.style.top = `${cy + 8 - 12}px`;
  }

  function handlePointer(e) {
    if (!currentLayout) return;
    const rect = canvas.getBoundingClientRect();
    const hit = hitTestDot(e.clientX - rect.left, e.clientY - rect.top, currentLayout);
    if (hit) showTooltip(hit.row, hit.col);
    else tooltip.style.display = 'none';
  }

  canvas.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') handlePointer(e); });
  canvas.addEventListener('pointerleave', () => { tooltip.style.display = 'none'; });
  canvas.addEventListener('pointerdown', (e) => { e.stopPropagation(); handlePointer(e); });
  document.addEventListener('pointerdown', (e) => { if (!card.contains(e.target)) tooltip.style.display = 'none'; });

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
    drawEmpty: (alpha = 1) => drawEmptyGrid(ctx, currentLayout, getThemeColors(), alpha),
    drawLived: (row, col) => drawLivedDot(ctx, row, col, currentLayout, getThemeColors(), stats.currentRow),
    drawOverlay: (opts) => drawOverlayCurrentDot(overlayCtx, currentLayout, getThemeColors(), { row: stats.currentRow, col: stats.weekIndex, ...opts }),
    clearOverlay: () => overlayCtx.clearRect(0, 0, currentLayout.width, currentLayout.height)
  };
}
