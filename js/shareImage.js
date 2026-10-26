// Share image generator (UPGRADE_BRIEF.md Section 4J, Section 7E)
// Supports Post (1080 x 1350) and Status (1080 x 1920, default)
import { computeGridLayout, getDotCenter, drawAgeGutter } from './grid.js';
import { getDotLayerStyle, VIEWS } from './layers.js';
import { TIME_BUCKETS } from './timebudget.js';
import { getRowColor, getThemeColors } from './colors.js';
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

function resolveVar(val, isDark) {
  if (!val || typeof val !== 'string') return val;
  if (!val.startsWith('var(')) return val;
  const name = val.replace(/var\(|\)/g, '').trim();
  const mapLight = {
    '--bg': '#FFFFFF',
    '--surface': '#FFFFFF',
    '--border': '#E5E7EB',
    '--text': '#111827',
    '--muted': '#6B7280',
    '--brand': '#059669',
    '--brand-soft': '#D1FAE5',
    '--accent': '#0891B2',
    '--history': '#D97706',
    '--milestone': '#0891B2',
    '--dot-future': '#D1D5DB',
    '--dot-unassigned': '#A7F3D0',
    '--ch-1': '#059669', '--ch-2': '#0891B2', '--ch-3': '#6366F1', '--ch-4': '#D97706',
    '--ch-5': '#DB2777', '--ch-6': '#65A30D', '--ch-7': '#7C3AED', '--ch-8': '#0F766E',
    '--t-sleep': '#6366F1', '--t-work': '#0891B2', '--t-travel': '#D97706',
    '--t-phone': '#E11D48', '--t-learn': '#059669', '--t-free': '#5EEAD4'
  };
  const mapDark = {
    '--bg': '#0F172A',
    '--surface': '#1E293B',
    '--border': '#334155',
    '--text': '#F1F5F9',
    '--muted': '#94A3B8',
    '--brand': '#10B981',
    '--brand-soft': 'rgba(16,185,129,0.15)',
    '--accent': '#22D3EE',
    '--history': '#FBBF24',
    '--milestone': '#22D3EE',
    '--dot-future': '#334155',
    '--dot-unassigned': '#134E4A',
    '--ch-1': '#34D399', '--ch-2': '#22D3EE', '--ch-3': '#818CF8', '--ch-4': '#FBBF24',
    '--ch-5': '#F472B6', '--ch-6': '#A3E635', '--ch-7': '#A78BFA', '--ch-8': '#5EEAD4',
    '--t-sleep': '#818CF8', '--t-work': '#22D3EE', '--t-travel': '#FBBF24',
    '--t-phone': '#FB7185', '--t-learn': '#34D399', '--t-free': '#0D9488'
  };
  return (isDark ? mapDark[name] : mapLight[name]) || (isDark ? '#CBD5E1' : '#374151');
}

export function createShareCanvas(stats, options = {}, logoImg = null) {
  const {
    view = VIEWS.OVERVIEW,
    size = 'status',
    theme = (document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'),
    layerContext = {},
    flashbackPicks = [],
    nextUp = null
  } = options;

  const isStatus = size === 'status';
  const isDark = theme === 'dark';
  const width = 1080;
  const height = isStatus ? 1920 : 1350;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Background
  if (isDark) {
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#0F172A');
    bgGrad.addColorStop(1, '#1E293B');
    ctx.fillStyle = bgGrad;
  } else {
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#ECFDF5');
    bgGrad.addColorStop(0.45, '#FFFFFF');
    bgGrad.addColorStop(1, '#ECFEFF');
    ctx.fillStyle = bgGrad;
  }
  ctx.fillRect(0, 0, width, height);

  // Top 6px brand gradient bar
  const topGrad = ctx.createLinearGradient(0, 0, width, 0);
  topGrad.addColorStop(0, isDark ? '#10B981' : '#059669');
  topGrad.addColorStop(0.5, isDark ? '#14B8A6' : '#0D9488');
  topGrad.addColorStop(1, isDark ? '#22D3EE' : '#06B6D4');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, width, 6);

  // Title
  let titleText = 'My life in dots';
  if (view === VIEWS.CHAPTERS) titleText = 'My life in chapters';

  const titleY = isStatus ? 205 : 55;
  ctx.font = '800 52px ui-sans-serif, system-ui, -apple-system, sans-serif';
  ctx.fillStyle = isDark ? '#F1F5F9' : '#111827';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(titleText, width / 2, titleY);

  // Card
  const cardW = 960;
  const cardH = isStatus ? 1140 : 890;
  const cardX = (width - cardW) / 2;
  const cardY = isStatus ? 275 : 125;

  ctx.save();
  ctx.shadowColor = isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(0, 0, 0, 0.08)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = isDark ? '#1E293B' : '#FFFFFF';
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(cardX, cardY, cardW, cardH, 20);
  else ctx.rect(cardX, cardY, cardW, cardH);
  ctx.fill();
  ctx.restore();

  ctx.strokeStyle = isDark ? '#334155' : '#E5E7EB';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(cardX, cardY, cardW, cardH, 20);
  else ctx.rect(cardX, cardY, cardW, cardH);
  ctx.stroke();

  // Grid
  const gridAvailW = cardW - 60;
  const gridAvailH = cardH - 60;
  const layout = computeGridLayout(stats.rows, gridAvailW, gridAvailH, true);
  const offsetX = cardX + (cardW - layout.width) / 2;
  const offsetY = cardY + (cardH - layout.height) / 2;

  ctx.save();
  ctx.translate(offsetX, offsetY);

  const colors = getThemeColors();
  drawAgeGutter(ctx, layout, colors);

  const totalDots = stats.rows * 52;
  const baseLivedColors = Array.from({ length: stats.rows }, (_, r) => getRowColor(r, stats.currentRow, colors));
  const fullLayerContext = {
    ...layerContext,
    normalLivedColors: baseLivedColors,
    livedDots: stats.livedDots,
    currentDotIndex: stats.currentRow * 52 + stats.weekIndex,
    totalDots,
    isBonus: stats.isBonus
  };

  for (let idx = 0; idx < totalDots; idx++) {
    const r = Math.floor(idx / 52);
    const c = idx % 52;
    if (r >= stats.rows) break;

    const { cx, cy } = getDotCenter(r, c, layout);
    const style = getDotLayerStyle(idx, view, fullLayerContext);

    ctx.save();
    ctx.globalAlpha = style.opacity ?? 1;
    ctx.fillStyle = resolveVar(style.color, isDark);
    ctx.beginPath();
    ctx.arc(cx, cy, layout.dotRadius, 0, Math.PI * 2);
    ctx.fill();

    if (style.marker) {
      const ringColor = resolveVar(style.marker.color, isDark);
      ctx.beginPath();
      ctx.arc(cx, cy, layout.dotRadius * 1.6, 0, Math.PI * 2);
      ctx.lineWidth = 2;
      ctx.strokeStyle = ringColor;
      if (style.marker.filled) {
        ctx.fillStyle = ringColor;
        ctx.fill();
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  // Current dot overlay ring
  if (stats.currentRow < stats.rows && stats.weekIndex >= 0) {
    const { cx, cy } = getDotCenter(stats.currentRow, stats.weekIndex, layout);
    const r = layout.dotRadius;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 2.2, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? 'rgba(16, 185, 129, 0.25)' : 'rgba(5, 150, 105, 0.2)';
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

  // Content under grid
  let lineY = isStatus ? 1465 : 1055;

  if (view === VIEWS.TIME) {
    const timeSplit = fullLayerContext.timeSplit;
    if (timeSplit && timeSplit.valid && timeSplit.H > 0) {
      const barW = 840;
      const barH = isStatus ? 18 : 14;
      const barX = (width - barW) / 2;
      const barY = isStatus ? 1445 : 1030;
      let curX = barX;

      ctx.save();
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(barX, barY, barW, barH, barH / 2);
      else ctx.rect(barX, barY, barW, barH);
      ctx.clip();

      for (let b = 0; b < 6; b++) {
        const segW = (timeSplit.weeks[b] / timeSplit.H) * barW;
        if (segW > 0) {
          ctx.fillStyle = resolveVar(TIME_BUCKETS[b].colorVar, isDark);
          ctx.fillRect(curX, barY, segW, barH);
          curX += segW;
        }
      }
      ctx.restore();
      lineY = isStatus ? 1500 : 1075;
    }
  } else if (view === VIEWS.CHAPTERS) {
    const chapters = fullLayerContext.chapters || [];
    if (chapters.length > 0) {
      const legendY = isStatus ? 1445 : 1030;
      ctx.font = '600 22px ui-sans-serif, system-ui, -apple-system, sans-serif';
      const visibleChips = chapters.slice(0, 4);
      let totalItemsW = 0;
      const measured = visibleChips.map(ch => {
        const w = ctx.measureText(ch.name).width + 30;
        totalItemsW += w + 20;
        return { ch, w };
      });
      totalItemsW -= 20;

      let startX = (width - totalItemsW) / 2;
      measured.forEach(item => {
        ctx.fillStyle = resolveVar(item.ch.color, isDark);
        ctx.beginPath();
        ctx.arc(startX + 8, legendY + 11, 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isDark ? '#CBD5E1' : '#374151';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.ch.name, startX + 22, legendY + 11);
        startX += item.w + 20;
      });
      lineY = isStatus ? 1500 : 1075;
    }
  }

  // View-specific line under grid
  let lineText = '';
  if (view === VIEWS.OVERVIEW) {
    if (stats.isBonus) {
      lineText = `${formatNumber(stats.weeksLived)} weeks lived. Every week is a bonus.`;
    } else {
      lineText = `${formatNumber(stats.weeksLived)} weeks lived. About ${formatNumber(stats.ahead.sundays)} Sundays ahead.`;
    }
  } else if (view === VIEWS.HISTORY) {
    if (flashbackPicks && flashbackPicks.length > 0) {
      const topPick = flashbackPicks[0];
      lineText = topPick.sentence.replace(/^You were /i, 'I was ');
    } else {
      lineText = 'Moments in history, pinned to my dots.';
    }
  } else if (view === VIEWS.CHAPTERS) {
    lineText = 'My life in chapters.';
  } else if (view === VIEWS.TIME) {
    const timeSplit = fullLayerContext.timeSplit;
    const learnWeeks = (timeSplit && timeSplit.weeks) ? timeSplit.weeks[4] : 22;
    const range = (timeSplit && timeSplit.range) ? timeSplit.range : '10years';
    if (range === 'year') {
      lineText = `My next year: about ${learnWeeks} weeks of learning.`;
    } else if (range === 'ahead') {
      lineText = `My weeks ahead: about ${learnWeeks} weeks of learning.`;
    } else {
      lineText = `My next 10 years: about ${learnWeeks} weeks of learning.`;
    }
  } else if (view === VIEWS.MILESTONES) {
    const msNext = nextUp || (fullLayerContext.milestones && fullLayerContext.milestones.find(m => m.status === 'ahead'));
    if (msNext) {
      let label = msNext.label;
      if (label.startsWith('You turn ')) label = 'I turn ' + label.slice(9);
      lineText = `My next nerd birthday: ${label}, ${msNext.inAbout}.`;
    } else {
      lineText = 'Days worth celebrating that most people never notice.';
    }
  }

  ctx.font = '600 28px ui-sans-serif, system-ui, -apple-system, sans-serif';
  ctx.fillStyle = isDark ? '#E2E8F0' : '#1F2937';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(lineText, width / 2, lineY);

  // Footer (Safe margins: status footer at y=1750, post footer at y=1260)
  const footerY = isStatus ? 1750 : 1260;

  if (logoImg && logoImg.naturalWidth > 0) {
    const targetH = 34;
    const aspect = logoImg.naturalWidth / logoImg.naturalHeight;
    const targetW = targetH * aspect;
    ctx.drawImage(logoImg, 60, footerY - targetH / 2, targetW, targetH);
  } else {
    ctx.font = '800 28px ui-sans-serif, system-ui, -apple-system, sans-serif';
    ctx.fillStyle = isDark ? '#10B981' : '#059669';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('Wrench Wise', 60, footerY);
  }

  ctx.font = '500 22px ui-sans-serif, system-ui, -apple-system, sans-serif';
  ctx.fillStyle = isDark ? '#94A3B8' : '#6B7280';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText('Make yours at wrench-wise.com', 1020, footerY);

  return canvas;
}

export async function generateShareBlob(stats, options = {}) {
  const logo = await loadLogo();
  const canvas = createShareCanvas(stats, options, logo);
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/png');
  });
}
