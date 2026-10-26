// Cinematic camera controller and renderer for the reveal intro (Section 4A)
import { easeInOutCubic } from './counter.js';

export function createDotSprites(colors, dotRadius) {
  if (typeof document === 'undefined') return null;
  const d = Math.max(4, Math.ceil(dotRadius * 2));
  const pad = 2;
  const size = d + pad * 2;

  function makeSprite(color) {
    const cv = document.createElement('canvas');
    cv.width = size;
    cv.height = size;
    const c = cv.getContext('2d');
    c.fillStyle = color;
    c.beginPath();
    c.arc(size / 2, size / 2, dotRadius, 0, Math.PI * 2);
    c.fill();
    return cv;
  }

  return {
    future: makeSprite(colors.future),
    brand: makeSprite(colors.brand),
    now: makeSprite(colors.now),
    size,
    pad
  };
}

export function computeCameraAtTime(animTime, layout, viewportW, viewportH, stats) {
  const { s, dotRadius, gutterWidth, rows } = layout;
  const dot0 = {
    cx: gutterWidth + s / 2,
    cy: s / 2
  };

  const lifeYears = stats.lifeUsed || 80;
  const caption3 = stats.isBonus ? 'This is your life so far.' : `This is a life of ${lifeYears} years.`;

  // Scale 0: Dot 0 is ~40% of grid card width
  const dotDiameter = dotRadius * 2;
  const targetDiameter = Math.min(viewportW * 0.40, 220);
  const S0 = Math.max(6, targetDiameter / dotDiameter);

  // Scale 1: Row 0 fills card width (~94% of viewport width)
  const row0W = 52 * s;
  const S1 = Math.max(1.1, (viewportW * 0.94) / row0W);

  // Centering offsets
  const targetCenterY = Math.min(viewportH * 0.42, 280);

  // 1. Phase 1 (0.5 to 1.3 s): Single dot grows, zoomed in
  if (animTime < 1.3) {
    const p = Math.max(0, Math.min(1, (animTime - 0.5) / 0.8));
    const dot0Scale = easeInOutCubic(p);

    // Caption fade
    let capOpacity = 1;
    if (animTime < 0.7) capOpacity = (animTime - 0.5) / 0.2;
    else if (animTime > 1.1) capOpacity = (1.3 - animTime) / 0.2;

    return {
      scale: S0,
      tx: viewportW / 2 - S0 * dot0.cx,
      ty: targetCenterY - S0 * dot0.cy,
      dot0Scale,
      row0Count: 1,
      waveRows: 1,
      caption: 'This is one week.',
      captionOpacity: Math.max(0, Math.min(1, capOpacity))
    };
  }

  // 2. Phase 2 (1.3 to 2.3 s): Zoom out to Row 0, 51 dots pop in left-to-right
  if (animTime < 2.3) {
    const p = Math.max(0, Math.min(1, (animTime - 1.3) / 1.0));
    const easedP = easeInOutCubic(p);

    const scale = S0 + (S1 - S0) * easedP;

    const row0CenterX = gutterWidth + (row0W / 2);
    const targetTx = viewportW / 2 - S1 * row0CenterX;
    const initialTx = viewportW / 2 - S0 * dot0.cx;
    const tx = initialTx + (targetTx - initialTx) * easedP;

    const targetTy = targetCenterY - S1 * dot0.cy;
    const initialTy = targetCenterY - S0 * dot0.cy;
    const ty = initialTy + (targetTy - initialTy) * easedP;

    // Pop in 51 dots from col 1 to 51
    const popDots = Math.min(52, 1 + Math.floor(p * 51));

    let capOpacity = 1;
    if (animTime < 1.5) capOpacity = (animTime - 1.3) / 0.2;
    else if (animTime > 2.1) capOpacity = (2.3 - animTime) / 0.2;

    return {
      scale,
      tx,
      ty,
      dot0Scale: 1,
      row0Count: popDots,
      waveRows: 1,
      caption: '52 weeks make one year.',
      captionOpacity: Math.max(0, Math.min(1, capOpacity))
    };
  }

  // 3. Phase 3 (2.3 to 3.5 s): Zoom out to scale 1.0, rows appear in wave
  const p = Math.max(0, Math.min(1, (animTime - 2.3) / 1.2));
  const easedP = easeInOutCubic(p);

  const scale = S1 + (1.0 - S1) * easedP;

  const row0CenterX = gutterWidth + (row0W / 2);
  const initialTx = viewportW / 2 - S1 * row0CenterX;
  const tx = initialTx * (1 - easedP);

  const initialTy = targetCenterY - S1 * dot0.cy;
  const ty = initialTy * (1 - easedP);

  const waveRows = Math.min(rows, 1 + Math.floor(easedP * rows));

  let capOpacity = 1;
  if (animTime < 2.5) capOpacity = (animTime - 2.3) / 0.2;
  else if (animTime > 3.3) capOpacity = (3.5 - animTime) / 0.2;

  return {
    scale,
    tx,
    ty,
    dot0Scale: 1,
    row0Count: 52,
    waveRows,
    caption: caption3,
    captionOpacity: Math.max(0, Math.min(1, capOpacity))
  };
}

export function drawCameraIntro(ctx, layout, colors, cameraState, sprites) {
  const { scale, tx, ty, dot0Scale, row0Count, waveRows } = cameraState;
  const { s, dotRadius, gutterWidth, rows, width, height } = layout;

  const dpr = Math.min(2, (typeof window !== 'undefined' && window.devicePixelRatio) || 1);
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.scale(dpr, dpr);

  ctx.translate(tx, ty);
  ctx.scale(scale, scale);

  const useArcs = scale >= 3;
  ctx.fillStyle = colors.future;

  // Row 0
  for (let c = 0; c < row0Count; c++) {
    const cx = gutterWidth + c * s + s / 2;
    const cy = s / 2;

    let r = dotRadius;
    if (c === 0) r = dotRadius * dot0Scale;
    if (r <= 0.05) continue;

    if (useArcs || c === 0) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    } else if (sprites && sprites.future) {
      ctx.drawImage(sprites.future, cx - sprites.size / 2, cy - sprites.size / 2);
    } else {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Wave rows from row 1 to waveRows
  if (waveRows > 1) {
    for (let r = 1; r < waveRows; r++) {
      const gapCount = Math.floor(r / 10);
      const cy = r * s + gapCount * (0.8 * s) + s / 2;

      for (let c = 0; c < 52; c++) {
        const cx = gutterWidth + c * s + s / 2;
        if (sprites && sprites.future && !useArcs) {
          ctx.drawImage(sprites.future, cx - sprites.size / 2, cy - sprites.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(cx, cy, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  ctx.restore();
}
