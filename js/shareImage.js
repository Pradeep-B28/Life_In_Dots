// Draws the 1080 x 1350 share image (Instagram portrait size)
import { computeGridLayout, getDotCenter, getRowColor, getThemeColors, drawAgeGutter } from './grid.js';
import { formatNumber } from './stats.js';

function loadLogo() {
  return new Promise((resolve) => {
    if (typeof Image === 'undefined') return resolve(null);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = 'assets/logo.png';
  });
}

export function createShareCanvas(stats, logoImg = null) {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  const colors = getThemeColors();

  // 1. Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1350);
  bgGrad.addColorStop(0, '#ECFDF5');
  bgGrad.addColorStop(0.45, '#FFFFFF');
  bgGrad.addColorStop(1, '#ECFEFF');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1080, 1350);

  // 2. Top 6px brand gradient bar
  const topGrad = ctx.createLinearGradient(0, 0, 1080, 0);
  topGrad.addColorStop(0, '#059669');
  topGrad.addColorStop(0.5, '#0D9488');
  topGrad.addColorStop(1, '#06B6D4');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, 1080, 6);

  // 3. Header title: "My life in dots"
  ctx.font = '800 52px ui-sans-serif, system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#111827';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('My life in dots', 540, 60);

  // 4. White card for grid
  const cardW = 960;
  const cardH = 920;
  const cardX = (1080 - cardW) / 2;
  const cardY = 145;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(cardX, cardY, cardW, cardH, 20);
  } else {
    ctx.rect(cardX, cardY, cardW, cardH);
  }
  ctx.fill();
  ctx.restore();

  // Card border
  ctx.strokeStyle = '#E5E7EB';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(cardX, cardY, cardW, cardH, 20);
  } else {
    ctx.rect(cardX, cardY, cardW, cardH);
  }
  ctx.stroke();

  // 5. Draw the grid inside card
  const gridAvailW = cardW - 60;
  const gridAvailH = cardH - 60;
  const layout = computeGridLayout(stats.rows, gridAvailW, gridAvailH, true);

  const offsetX = cardX + (cardW - layout.width) / 2;
  const offsetY = cardY + (cardH - layout.height) / 2;

  ctx.save();
  ctx.translate(offsetX, offsetY);

  drawAgeGutter(ctx, layout, colors);

  // Ahead dots
  ctx.fillStyle = colors.future;
  ctx.beginPath();
  if (stats.currentRow < stats.rows) {
    for (let col = stats.weekIndex + 1; col < 52; col++) {
      const { cx, cy } = getDotCenter(stats.currentRow, col, layout);
      ctx.moveTo(cx + layout.dotRadius, cy);
      ctx.arc(cx, cy, layout.dotRadius, 0, Math.PI * 2);
    }
  }
  for (let r = stats.currentRow + 1; r < stats.rows; r++) {
    for (let col = 0; col < 52; col++) {
      const { cx, cy } = getDotCenter(r, col, layout);
      ctx.moveTo(cx + layout.dotRadius, cy);
      ctx.arc(cx, cy, layout.dotRadius, 0, Math.PI * 2);
    }
  }
  ctx.fill();

  // Lived dots
  for (let r = 0; r < Math.min(stats.rows, stats.currentRow); r++) {
    ctx.fillStyle = getRowColor(r, stats.currentRow, colors);
    ctx.beginPath();
    for (let c = 0; c < 52; c++) {
      const { cx, cy } = getDotCenter(r, c, layout);
      ctx.moveTo(cx + layout.dotRadius, cy);
      ctx.arc(cx, cy, layout.dotRadius, 0, Math.PI * 2);
    }
    ctx.fill();
  }

  // Lived dots on currentRow
  if (stats.currentRow < stats.rows && stats.weekIndex > 0) {
    ctx.fillStyle = getRowColor(stats.currentRow, stats.currentRow, colors);
    ctx.beginPath();
    for (let c = 0; c < stats.weekIndex; c++) {
      const { cx, cy } = getDotCenter(stats.currentRow, c, layout);
      ctx.moveTo(cx + layout.dotRadius, cy);
      ctx.arc(cx, cy, layout.dotRadius, 0, Math.PI * 2);
    }
    ctx.fill();
  }

  // Current week ringed dot
  if (stats.currentRow < stats.rows && stats.weekIndex >= 0) {
    const { cx, cy } = getDotCenter(stats.currentRow, stats.weekIndex, layout);
    const r = layout.dotRadius;

    ctx.beginPath();
    ctx.arc(cx, cy, r * 2.2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(5, 150, 105, 0.2)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.9, 0, Math.PI * 2);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = colors.now;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = colors.now;
    ctx.fill();
  }

  ctx.restore();

  // 6. Text line under grid
  let lineText = '';
  if (stats.isBonus) {
    lineText = `${formatNumber(stats.weeksLived)} weeks lived. Every week is a bonus.`;
  } else {
    lineText = `${formatNumber(stats.weeksLived)} weeks lived. About ${formatNumber(stats.ahead.sundays)} Sundays ahead.`;
  }

  ctx.font = '600 28px ui-sans-serif, system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#1F2937';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(lineText, 540, 1105);

  // 7. Footer: Logo on left, site link on right
  const footerY = 1240;

  if (logoImg && logoImg.naturalWidth > 0) {
    const targetH = 34;
    const aspect = logoImg.naturalWidth / logoImg.naturalHeight;
    const targetW = targetH * aspect;
    ctx.drawImage(logoImg, 60, footerY - targetH / 2, targetW, targetH);
  } else {
    ctx.font = '800 28px ui-sans-serif, system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#059669';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('Wrench Wise', 60, footerY);
  }

  ctx.font = '500 22px ui-sans-serif, system-ui, -apple-system, sans-serif';
  ctx.fillStyle = '#6B7280';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText('Make yours at wrench-wise.com', 1020, footerY);

  return canvas;
}

export async function generateShareBlob(stats) {
  const logo = await loadLogo();
  const canvas = createShareCanvas(stats, logo);
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/png');
  });
}
