// Web Audio synthesizer for Your Life in Dots (Section 4B)

const STORAGE_KEY = 'lid-muted';

let audioCtx = null;
let masterGain = null;
let compressor = null;
let isMutedState = false;
let activeIntroSource = null;
let lastTickTime = 0;

export function getAudioContext() {
  if (!audioCtx && typeof window !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();

      compressor = audioCtx.createDynamicsCompressor();
      compressor.threshold.value = -24;
      compressor.knee.value = 30;
      compressor.ratio.value = 12;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.25;

      masterGain = audioCtx.createGain();
      masterGain.gain.value = isMutedState ? 0 : 0.8;

      compressor.connect(masterGain);
      masterGain.connect(audioCtx.destination);
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isMuted() {
  return isMutedState;
}

export function setMuted(muted) {
  isMutedState = muted;
  try {
    localStorage.setItem(STORAGE_KEY, muted ? '1' : '0');
  } catch (err) {}

  if (masterGain && audioCtx) {
    masterGain.gain.setTargetAtTime(muted ? 0 : 0.8, audioCtx.currentTime, 0.02);
  }
  updateMuteButtonUI();
}

export function toggleMute() {
  setMuted(!isMutedState);
  return isMutedState;
}

// 1. Intro Swell (0.5 to 3.5 s): soft filtered noise, low pass 400 -> 1600 Hz, peak gain 0.03
export function playIntroSwell(duration = 3.0) {
  const ctx = getAudioContext();
  if (!ctx || isMutedState) return;

  stopIntroSwell();

  const bufferSize = Math.floor(ctx.sampleRate * 2.0);
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  const whiteNoise = ctx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;
  whiteNoise.loop = true;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(400, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + duration);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.03, ctx.currentTime + duration * 0.7);
  gain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + duration);

  whiteNoise.connect(filter);
  filter.connect(gain);
  gain.connect(compressor);

  whiteNoise.start();
  whiteNoise.stop(ctx.currentTime + duration);
  activeIntroSource = whiteNoise;
}

export function stopIntroSwell() {
  if (activeIntroSource) {
    try {
      activeIntroSource.stop();
      activeIntroSource.disconnect();
    } catch (e) {}
    activeIntroSource = null;
  }
}

// 2. Fill Ticks: 40 ms sine blip, 1100 + decade*60 Hz, gain 0.04, max 20 ticks/sec
export function playRowTick(row) {
  const ctx = getAudioContext();
  if (!ctx || isMutedState) return;

  const now = performance.now();
  if (now - lastTickTime < 50) return; // Rate limit to max 20 per second
  lastTickTime = now;

  const decade = Math.floor(row / 10);
  const freq = 1100 + decade * 60;
  const duration = 0.04;

  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, ctx.currentTime);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.04, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  osc.connect(gain);
  gain.connect(compressor);

  osc.start();
  osc.stop(ctx.currentTime + duration);
}

// 3. You are here chime: 660 Hz and 990 Hz, 80 ms apart, gain 0.08, fading over 900 ms
export function playYouAreHereChime() {
  const ctx = getAudioContext();
  if (!ctx || isMutedState) return;

  const notes = [
    { freq: 660, delay: 0 },
    { freq: 990, delay: 0.08 }
  ];

  notes.forEach(({ freq, delay }) => {
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);

    osc.connect(gain);
    gain.connect(compressor);

    osc.start(t);
    osc.stop(t + 0.9);
  });
}

// 4. Flashback pop: triangle wave gliding 520 -> 780 Hz over 120 ms, gain 0.06
export function playFlashbackPop() {
  const ctx = getAudioContext();
  if (!ctx || isMutedState) return;

  const t = ctx.currentTime;
  const duration = 0.12;

  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(520, t);
  osc.frequency.linearRampToValueAtTime(780, t + duration);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.06, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

  osc.connect(gain);
  gain.connect(compressor);

  osc.start(t);
  osc.stop(t + duration);
}

// 5. The Turn Chord: 392, 494, 587 Hz, gain 0.05 each, fading over 1.4 s
export function playTurnChord() {
  const ctx = getAudioContext();
  if (!ctx || isMutedState) return;

  const freqs = [392, 494, 587];
  const t = ctx.currentTime;
  const duration = 1.4;

  freqs.forEach(freq => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.05, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    osc.connect(gain);
    gain.connect(compressor);

    osc.start(t);
    osc.stop(t + duration);
  });
}

export function stopAllSounds() {
  stopIntroSwell();
}

const SPEAKER_ON_SVG = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>';
const SPEAKER_MUTED_SVG = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>';

function updateMuteButtonUI() {
  const btn = document.getElementById('audio-toggle');
  if (!btn) return;
  btn.setAttribute('aria-label', isMutedState ? 'Unmute sound' : 'Mute sound');
  btn.setAttribute('title', isMutedState ? 'Unmute sound' : 'Mute sound');
  btn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${isMutedState ? SPEAKER_MUTED_SVG : SPEAKER_ON_SVG}</svg>`;
}

export function initAudio() {
  try {
    isMutedState = localStorage.getItem(STORAGE_KEY) === '1';
  } catch (err) {
    isMutedState = false;
  }

  const btn = document.getElementById('audio-toggle');
  if (btn) {
    updateMuteButtonUI();
    btn.addEventListener('click', () => {
      getAudioContext();
      toggleMute();
    });
  }
}
