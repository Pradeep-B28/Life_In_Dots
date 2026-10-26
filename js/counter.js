// Numeric animations and easing curves for counters
import { formatNumber } from './stats.js';

export function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export function easeInOutCubic(t) {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function animateValue({
  from = 0,
  to = 0,
  duration = 800,
  easing = easeOutCubic,
  onUpdate,
  onComplete
}) {
  if (duration <= 0 || from === to) {
    if (onUpdate) onUpdate(to);
    if (onComplete) onComplete();
    return { cancel: () => {} };
  }

  let startTime = null;
  let rafId = null;
  let isCancelled = false;

  function step(timestamp) {
    if (isCancelled) return;
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(1, elapsed / duration);
    const eased = easing(progress);
    const current = Math.round(from + eased * (to - from));

    if (onUpdate) onUpdate(current);

    if (progress < 1) {
      rafId = requestAnimationFrame(step);
    } else {
      if (onUpdate) onUpdate(to);
      if (onComplete) onComplete();
    }
  }

  rafId = requestAnimationFrame(step);

  return {
    cancel() {
      isCancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
    }
  };
}

export function animateTextNumber(element, toValue, duration = 800, formatter = formatNumber) {
  if (!element) return { cancel: () => {} };
  return animateValue({
    from: 0,
    to: toValue,
    duration,
    onUpdate: (val) => {
      element.textContent = formatter(val);
    }
  });
}
