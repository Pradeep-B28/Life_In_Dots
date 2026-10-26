// Color math and CSS token resolution for Your Life in Dots (Section 5)

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

export function resolveCssVar(varStr, fallback = '#059669') {
  if (!varStr) return fallback;
  if (!varStr.startsWith('var(')) return varStr;
  const prop = varStr.slice(4, -1).trim();
  if (typeof document === 'undefined') return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(prop).trim() || fallback;
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
