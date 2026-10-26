// The cinematic reveal timeline controller for Your Life in Dots (Section 4A)
import { easeInOutCubic, easeOutCubic } from './counter.js';
import { formatNumber } from './stats.js';
import { computeCameraAtTime, drawCameraIntro, createDotSprites } from './camera.js';
import {
  playIntroSwell,
  playRowTick,
  playYouAreHereChime,
  playFlashbackPop,
  playTurnChord,
  stopAllSounds
} from './audio.js';
import { getThemeColors } from './colors.js';
import {
  renderReducedMotion,
  triggerCardsSequence,
  performSkipToFinal,
  drawFlashbackPick
} from './reveal-helpers.js';

export function startReveal(options = {}) {
  const {
    stats,
    gridComponent,
    homeCard,
    resultSection,
    headlineEl,
    sublineEl,
    statCardsUI,
    closingCard,
    seekTime = null,
    flashbackPicks = [],
    onComplete
  } = options;

  const prefersReduced = (typeof window !== 'undefined' && window.matchMedia)
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  if (prefersReduced) {
    renderReducedMotion({
      stats,
      gridComponent,
      homeCard,
      resultSection,
      headlineEl,
      sublineEl,
      statCardsUI,
      closingCard,
      flashbackPicks,
      onComplete
    });
    playYouAreHereChime();
    return { cancel: () => {} };
  }

  const K = (flashbackPicks && flashbackPicks.length) ? flashbackPicks.length : 0;
  const fillDuration = stats.livedDots < 150 ? 1.2 : 3.6;

  const T_FADE_HOME_END = 0.5;
  const T_INTRO_START = 0.5;
  const T_INTRO_END = 3.5;
  const T_FILL_START = 3.5;
  const T_FILL_END = T_FILL_START + fillDuration;
  const T_YOU_ARE_HERE = T_FILL_END;
  const T_FLASHBACK_START = T_YOU_ARE_HERE + 0.7;
  const T_FLASHBACK_END = T_FLASHBACK_START + (K * 2.0);
  const T_TURN = T_FLASHBACK_END;
  const T_CARDS = T_TURN + 1.4;

  let animTime = 0;
  let lastTimestamp = null;
  let rafId = null;
  let isCancelled = false;
  let isSkipped = false;

  let lastDrawnLivedIndex = 0;
  let lastFilledRow = -1;
  let emptyGridDrawnAt35 = false;
  let introAudioStarted = false;
  let chimePlayed = false;
  let turnChordPlayed = false;
  let cardsTriggered = false;
  const playedFlashbackIndices = new Set();

  const fpsMetrics = {
    frameCount: 0,
    totalTime: 0,
    fpsHistory: []
  };

  const cardEl = gridComponent.card;
  const captionWrap = document.createElement('div');
  captionWrap.className = 'reveal-caption-wrap';

  const captionEl = document.createElement('div');
  captionEl.className = 'reveal-caption';
  captionWrap.appendChild(captionEl);
  cardEl.appendChild(captionWrap);

  const skipBtn = document.createElement('button');
  skipBtn.type = 'button';
  skipBtn.className = 'reveal-skip-btn';
  skipBtn.textContent = 'Skip';
  skipBtn.setAttribute('aria-label', 'Skip reveal');
  skipBtn.style.display = 'none';
  cardEl.appendChild(skipBtn);

  skipBtn.addEventListener('click', () => skipToFinal());

  let dotSprites = createDotSprites(getThemeColors(), gridComponent.getLayout() ? gridComponent.getLayout().dotRadius : 3);

  if (resultSection) {
    resultSection.style.display = 'block';
    resultSection.style.opacity = '0';
    resultSection.style.transform = 'scale(0.98)';
  }
  headlineEl.textContent = '0 weeks lived';
  sublineEl.textContent = ' ';

  function update(dt) {
    if (isCancelled || isSkipped) return;
    animTime += dt;

    const layout = gridComponent.getLayout();
    const colors = getThemeColors();

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
        resultSection.style.transform = 'none';
      }
    }

    if (animTime >= 0.5 && animTime < T_TURN) {
      skipBtn.style.display = 'flex';
    } else {
      skipBtn.style.display = 'none';
    }

    // 2. Cinematic Intro (0.5 to 3.5s)
    if (animTime >= T_INTRO_START && animTime < T_INTRO_END) {
      if (!introAudioStarted) {
        playIntroSwell(3.0);
        introAudioStarted = true;
      }

      const rect = cardEl.getBoundingClientRect();
      const viewportW = rect.width > 0 ? rect.width : (layout ? layout.width : 340);
      const viewportH = rect.height > 0 ? rect.height : (layout ? layout.height : 600);

      const cameraState = computeCameraAtTime(animTime, layout, viewportW, viewportH, stats);
      drawCameraIntro(gridComponent.ctx, layout, colors, cameraState, dotSprites);

      if (cameraState.caption) {
        captionEl.className = 'reveal-caption';
        captionEl.textContent = cameraState.caption;
        captionEl.style.opacity = String(cameraState.captionOpacity);
      } else {
        captionEl.style.opacity = '0';
      }
    }

    // 3. The Fill (3.5 to T_FILL_END)
    if (animTime >= T_FILL_START && animTime <= T_FILL_END) {
      captionEl.style.opacity = '0';

      if (!emptyGridDrawnAt35) {
        gridComponent.drawEmpty(1);
        emptyGridDrawnAt35 = true;
      }

      const pFill = (animTime - T_FILL_START) / fillDuration;
      const eased = easeInOutCubic(Math.min(1, Math.max(0, pFill)));
      const targetLived = Math.min(stats.livedDots, Math.floor(eased * stats.livedDots));

      for (let i = lastDrawnLivedIndex; i < targetLived; i++) {
        const row = Math.floor(i / 52);
        const col = i % 52;
        gridComponent.drawLived(row, col);

        if (row !== lastFilledRow) {
          playRowTick(row);
          lastFilledRow = row;
        }
      }
      lastDrawnLivedIndex = targetLived;

      const currentWeeks = Math.round(eased * stats.weeksLived);
      headlineEl.textContent = `${formatNumber(currentWeeks)} weeks lived`;
    }

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

    // 4. You Are Here Overlay Pulse
    if (animTime >= T_YOU_ARE_HERE && stats.currentRow < stats.rows && stats.weekIndex >= 0) {
      if (!chimePlayed) {
        playYouAreHereChime();
        chimePlayed = true;
      }

      const timeSinceLand = animTime - T_YOU_ARE_HERE;
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

      const showLabel = timeSinceLand <= 3.0 && animTime < T_FLASHBACK_START;

      gridComponent.drawOverlay({
        scale: popScale,
        pulseScale,
        pulseAlpha,
        showLabel
      });
    }

    // 5. Flashback
    if (K > 0 && animTime >= T_FLASHBACK_START && animTime < T_FLASHBACK_END) {
      const fbElapsed = animTime - T_FLASHBACK_START;
      const pickIdx = Math.min(K - 1, Math.floor(fbElapsed / 2.0));
      const pick = flashbackPicks[pickIdx];

      if (pick) {
        if (!playedFlashbackIndices.has(pickIdx)) {
          playFlashbackPop();
          playedFlashbackIndices.add(pickIdx);
        }

        const pickTime = fbElapsed - pickIdx * 2.0;
        drawFlashbackPick(gridComponent.overlayCtx, pick, pickTime, layout, colors, captionEl);
      }
    } else if (animTime >= T_FLASHBACK_END && animTime < T_FLASHBACK_END + 0.3) {
      captionEl.style.opacity = '0';
      gridComponent.clearOverlay();
    }

    // 6. The Turn
    if (animTime >= T_TURN) {
      captionEl.style.opacity = '0';
      skipBtn.style.display = 'none';

      if (!turnChordPlayed) {
        playTurnChord();
        turnChordPlayed = true;
      }

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

    // 7. Stat Cards & Finish
    if (animTime >= T_CARDS && !cardsTriggered) {
      cardsTriggered = true;
      triggerCardsSequence(statCardsUI, closingCard);
      captionWrap.remove();
      skipBtn.remove();

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

  function skipToFinal() {
    isSkipped = true;
    if (rafId) cancelAnimationFrame(rafId);
    performSkipToFinal({
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
    });
  }

  function loop(timestamp) {
    if (isCancelled || isSkipped) return;
    if (!lastTimestamp) lastTimestamp = timestamp;
    const dt = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;

    if (dt > 0 && dt < 0.2) {
      fpsMetrics.frameCount++;
      fpsMetrics.totalTime += dt;
      fpsMetrics.fpsHistory.push(1 / dt);
    }

    update(dt);

    if (animTime < T_CARDS + 0.1) {
      rafId = requestAnimationFrame(loop);
    }
  }

  if (seekTime !== null) {
    if (seekTime >= T_CARDS) {
      skipToFinal();
      return { cancel: () => {} };
    }
    update(seekTime);
  } else {
    rafId = requestAnimationFrame(loop);
  }

  return {
    cancel: () => {
      isCancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      stopAllSounds();
      captionWrap.remove();
      skipBtn.remove();
    },
    skip: skipToFinal
  };
}
