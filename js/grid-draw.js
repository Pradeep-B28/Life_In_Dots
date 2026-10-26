// Pure canvas drawing routines for Your Life in Dots (Section 4B, 4D, 4I)
import { getRowColor, resolveCssVar } from './colors.js';
import { getDotCenter } from './grid.js';
import { getDotLayerStyle, VIEWS } from './layers.js';

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

  if (pulseAlpha > 0) {
    ctx.beginPath(); ctx.arc(cx, cy, layout.dotRadius * pulseScale * 1.9, 0, Math.PI * 2);
    ctx.lineWidth = 2; ctx.strokeStyle = `rgba(4, 120, 87, ${pulseAlpha})`; ctx.stroke();
  }

  ctx.beginPath(); ctx.arc(cx, cy, r * 2.2, 0, Math.PI * 2); ctx.fillStyle = colors.brandSoft; ctx.fill();
  ctx.beginPath(); ctx.arc(cx, cy, r * 1.9, 0, Math.PI * 2); ctx.lineWidth = 2; ctx.strokeStyle = colors.now; ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fillStyle = colors.now; ctx.fill();

  if (showLabel) {
    const isTop = row < 4;
    const lineLen = 14;
    const labelY = isTop ? cy + r * 1.9 + lineLen : cy - r * 1.9 - lineLen;
    ctx.beginPath(); ctx.moveTo(cx, isTop ? cy + r * 1.9 : cy - r * 1.9); ctx.lineTo(cx, labelY);
    ctx.strokeStyle = colors.now; ctx.lineWidth = 1.5; ctx.stroke();

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

    ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(text, cx, boxY + boxH / 2);
  }
}

export function drawGrid(ctx, layout, stats, colors, view = VIEWS.OVERVIEW, layerContext = null) {
  drawEmptyGrid(ctx, layout, colors);
  const isCustomView = view !== VIEWS.OVERVIEW || (layerContext && layerContext.hasAnyChapters);

  if (!isCustomView) {
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
    return;
  }

  const total = layout.rows * 52;
  const ctxLayer = layerContext || {};
  for (let idx = 0; idx < total; idx++) {
    const r = Math.floor(idx / 52);
    const c = idx % 52;
    if (r >= layout.rows) break;
    const { cx, cy } = getDotCenter(r, c, layout);
    const style = getDotLayerStyle(idx, view, ctxLayer);

    ctx.save();
    ctx.globalAlpha = style.opacity ?? 1;
    ctx.fillStyle = resolveCssVar(style.color, colors.future);
    ctx.beginPath();
    ctx.arc(cx, cy, layout.dotRadius, 0, Math.PI * 2);
    ctx.fill();

    if (style.marker) {
      const ringColor = resolveCssVar(style.marker.color, '#0891B2');
      ctx.beginPath();
      ctx.arc(cx, cy, layout.dotRadius * 1.6, 0, Math.PI * 2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = ringColor;
      if (style.marker.filled) { ctx.fillStyle = ringColor; ctx.fill(); }
      ctx.stroke();
    }
    ctx.restore();
  }
}
