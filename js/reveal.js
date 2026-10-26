// The reveal timeline controller
import { easeInOutCubic, easeOutCubic } from './counter.js';
import { formatNumber } from './stats.js';

export function startReveal({
  stats,
  gridComponent,
  homeCard,
  resultSection,
  headlineEl,
  sublineEl,
  statCardsUI,
  closingCard,
  seekTime = null,
  onComplete
}) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reduced motion branch
  if (prefersReduced) {
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

    if (statCardsUI) {
      if (statCardsUI.aheadCardsList) {
        statCardsUI.aheadCardsList.forEach((c) => {
          c.numEl.textContent = formatNumber(c.targetValue);
          c.card.classList.add('visible');
        });
      }
      if (statCardsUI.soFarCardsList) {
        statCardsUI.soFarCardsList.forEach((c) => {
          c.numEl.textContent = c.textVal ? c.textVal : formatNumber(c.targetValue);
          c.card.classList.add('visible');
        });
      }
    }

    if (closingCard) closingCard.classList.add('visible');
    if (onComplete) onComplete();
    return { cancel: () => {} };
  }

  // Animation timeline configuration
  const fillDuration = stats.livedDots < 150 ? 1.2 : 3.6;
  const T_FADE_HOME_END = 0.5;
  const T_WAVE_START = 0.5;
  const T_WAVE_END = 1.3;
  const T_FILL_START = 1.3;
  const T_FILL_END = T_FILL_START + fillDuration;
  const T_TURN = T_FILL_END + 0.6;
  const T_CARDS = T_TURN + 1.4;

  let animTime = 0;
  let lastTimestamp = null;
  let rafId = null;
  let isCancelled = false;

  let lastDrawnLivedIndex = 0;
  let emptyGridDrawn = false;
  let cardsTriggered = false;

  const fpsMetrics = {
    frameCount: 0,
    totalTime: 0,
    fpsHistory: []
  };

  // Initial DOM states
  if (resultSection) {
    resultSection.style.display = 'block';
    resultSection.style.opacity = '0';
    resultSection.style.transform = 'scale(0.98)';
  }
  headlineEl.textContent = '0 weeks lived';
  sublineEl.textContent = ' ';

  function update(dt) {
    animTime += dt;

    // 1. Home card fade out (0.0 to 0.5s)
    if (animTime <= T_FADE_HOME_END) {
      const p = Math.min(1, animTime / T_FADE_HOME_END);
      if (homeCard) {
        homeCard.style.opacity = String(1 - p);
        homeCard.style.transform = `translateY(${-12 * p}px)`;
      }
      if (resultSection) {
        resultSection.style.opacity = String(p);
        resultSection.style.transform = `scale(${0.98 + 0.02 * p})`;
      }
    } else {
      if (homeCard) homeCard.style.display = 'none';
      if (resultSection) {
        resultSection.style.opacity = '1';
        resultSection.style.transform = 'scale(1)';
      }
    }

    // 2. Empty grid wave (0.5 to 1.3s)
    if (animTime >= T_WAVE_START) {
      if (!emptyGridDrawn || animTime <= T_WAVE_END) {
        const pWave = Math.min(1, (animTime - T_WAVE_START) / (T_WAVE_END - T_WAVE_START));
        gridComponent.drawEmpty(pWave);
        if (pWave >= 1) emptyGridDrawn = true;
      }
    }

    // 3. The Fill (1.3s to T_FILL_END)
    if (animTime >= T_FILL_START && animTime <= T_FILL_END) {
      const pFill = (animTime - T_FILL_START) / fillDuration;
      const eased = easeInOutCubic(Math.min(1, Math.max(0, pFill)));
      const targetLived = Math.min(stats.livedDots, Math.floor(eased * stats.livedDots));

      for (let i = lastDrawnLivedIndex; i < targetLived; i++) {
        gridComponent.drawLived(Math.floor(i / 52), i % 52);
      }
      lastDrawnLivedIndex = targetLived;

      const currentWeeks = Math.round(eased * stats.weeksLived);
      headlineEl.textContent = `${formatNumber(currentWeeks)} weeks lived`;
    }

    // Fill completion check
    if (animTime > T_FILL_END) {
      if (lastDrawnLivedIndex < stats.livedDots) {
        for (let i = lastDrawnLivedIndex; i < stats.livedDots; i++) {
          gridComponent.drawLived(Math.floor(i / 52), i % 52);
        }
        lastDrawnLivedIndex = stats.livedDots;
      }
      if (animTime < T_TURN) {
        headlineEl.textContent = `${formatNumber(stats.weeksLived)} weeks lived`;
      }
    }

    // 4. You Are Here overlay pulse (from T_FILL_END onwards)
    if (animTime >= T_FILL_END && stats.currentRow < stats.rows && stats.weekIndex >= 0) {
      const timeSinceLand = animTime - T_FILL_END;

      let popScale = 1;
      if (timeSinceLand <= 0.3) {
        popScale = 1 + 0.8 * Math.sin((timeSinceLand / 0.3) * Math.PI);
      }

      const cycleTime = timeSinceLand % 2.0;
      let pulseScale = 1;
      let pulseAlpha = 0;
      if (cycleTime <= 1.2) {
        const pPulse = cycleTime / 1.2;
        pulseScale = 1 + 1.4 * pPulse;
        pulseAlpha = 1 - pPulse;
      }

      const showLabel = timeSinceLand <= 3.0;

      gridComponent.drawOverlay({
        scale: popScale,
        pulseScale,
        pulseAlpha,
        showLabel
      });
    }

    // 5. The Turn (T_TURN to T_CARDS)
    if (animTime >= T_TURN) {
      if (stats.isBonus) {
        headlineEl.textContent = 'You have lived over 100 years. Every week from here is a bonus.';
        sublineEl.textContent = `${formatNumber(stats.weeksLived)} weeks lived.`;
      } else {
        const turnProgress = Math.min(1, (animTime - T_TURN) / 1.2);
        const easedSundays = easeOutCubic(turnProgress);
        const curSundays = Math.round(easedSundays * stats.ahead.sundays);
        headlineEl.textContent = `You have about ${formatNumber(curSundays)} Sundays ahead.`;
        sublineEl.textContent = `In a life of ${stats.lifeUsed} years. Every grey dot is a week still ahead of you.`;
      }
    }

    // 6. Stat cards & closing card (T_CARDS onwards)
    if (animTime >= T_CARDS && !cardsTriggered) {
      cardsTriggered = true;
      triggerCardsSequence(statCardsUI, closingCard);
      const avgFps = fpsMetrics.fpsHistory.length > 0
        ? Math.round(fpsMetrics.fpsHistory.reduce((a, b) => a + b, 0) / fpsMetrics.fpsHistory.length)
        : 60;
      console.log(`[PERF] Reveal completed. Average FPS: ${avgFps} (frames: ${fpsMetrics.frameCount})`);
      if (typeof document !== 'undefined') {
        document.body.dataset.avgFps = String(avgFps);
      }
      if (onComplete) onComplete({ ...fpsMetrics, avgFps });
    }
  }

  function triggerCardsSequence(cardsUI, closing) {
    if (!cardsUI) return;
    let delay = 0;

    if (cardsUI.aheadCardsList) {
      cardsUI.aheadCardsList.forEach((c) => {
        setTimeout(() => {
          c.card.classList.add('visible');
          animateCount(c.numEl, 0, c.targetValue, 800);
        }, delay);
        delay += 80;
      });
    }

    if (cardsUI.soFarCardsList) {
      cardsUI.soFarCardsList.forEach((c) => {
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

  function animateCount(el, from, to, duration) {
    const start = performance.now();
    function step(now) {
      const p = Math.min(1, (now - start) / duration);
      const val = Math.round(from + easeOutCubic(p) * (to - from));
      el.textContent = formatNumber(val);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // If a fixed seekTime is provided (for frame-accurate screenshots), jump directly to that time
  if (seekTime !== null && typeof seekTime === 'number') {
    // Step forward in small increments to ensure canvas state matches
    const stepSize = 0.05;
    for (let t = 0; t < seekTime; t += stepSize) {
      update(stepSize);
    }
    update(seekTime - animTime);
    return {
      cancel: () => {},
      metrics: fpsMetrics
    };
  }

  function loop(timestamp) {
    if (isCancelled) return;
    if (!lastTimestamp) lastTimestamp = timestamp;
    const dt = Math.min(0.05, (timestamp - lastTimestamp) / 1000);
    lastTimestamp = timestamp;

    fpsMetrics.frameCount++;
    fpsMetrics.totalTime += dt;
    if (dt > 0) fpsMetrics.fpsHistory.push(1 / dt);

    update(dt);
    rafId = requestAnimationFrame(loop);
  }

  function onVisibility() {
    if (document.hidden) {
      lastTimestamp = null;
    }
  }
  document.addEventListener('visibilitychange', onVisibility);

  rafId = requestAnimationFrame(loop);

  return {
    cancel() {
      isCancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', onVisibility);
    },
    getMetrics() {
      const avgFps = fpsMetrics.fpsHistory.length > 0
        ? fpsMetrics.fpsHistory.reduce((a, b) => a + b, 0) / fpsMetrics.fpsHistory.length
        : 60;
      return {
        frameCount: fpsMetrics.frameCount,
        totalTime: fpsMetrics.totalTime,
        avgFps: Math.round(avgFps)
      };
    }
  };
}
