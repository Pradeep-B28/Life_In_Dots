// Time budget and week split logic for Your Life in Dots
// Section 4G and Section 6C

export const TIME_BUCKETS = [
  { id: 'sleep',  label: 'Sleep',             colorVar: '--t-sleep',  min: 4, max: 12, default: 8 },
  { id: 'work',   label: 'Work or study',     colorVar: '--t-work',   min: 0, max: 16, default: 8 },
  { id: 'travel', label: 'Travel',            colorVar: '--t-travel', min: 0, max: 6,  default: 1 },
  { id: 'phone',  label: 'Phone and screens', colorVar: '--t-phone',  min: 0, max: 12, default: 3 },
  { id: 'learn',  label: 'Learning',          colorVar: '--t-learn',  min: 0, max: 8,  default: 1 },
  { id: 'free',   label: 'Free time',         colorVar: '--t-free',   readOnly: true }
];

export const DEFAULT_SLIDERS = {
  sleep: 8,
  work: 8,
  travel: 1,
  phone: 3,
  learn: 1
};

export function canSwapPhoneForLearning(sliders) {
  return sliders.phone >= 1 && sliders.learn < 8;
}

export function swapPhoneForLearning(sliders) {
  if (!canSwapPhoneForLearning(sliders)) {
    return { ...sliders };
  }
  return {
    ...sliders,
    phone: sliders.phone - 1,
    learn: sliders.learn + 1
  };
}

export function calculateTimeSplit(sliders, rangeType, aheadDots) {
  if (aheadDots <= 0) {
    return {
      isBonus: true,
      valid: true,
      H: 0,
      weeks: [0, 0, 0, 0, 0, 0],
      learningHours: 0,
      bonusMessage: 'Every week from here is a bonus. Spend them your way.'
    };
  }

  let requestedH;
  if (rangeType === 'year') {
    requestedH = 52;
  } else if (rangeType === '10years') {
    requestedH = 520;
  } else {
    requestedH = aheadDots;
  }

  const H = Math.min(requestedH, aheadDots);
  if (H <= 0) {
    return {
      isBonus: true,
      valid: true,
      H: 0,
      weeks: [0, 0, 0, 0, 0, 0],
      learningHours: 0
    };
  }

  // Work in half hours (hh)
  const hhSleep = Math.round(sliders.sleep * 2);
  const hhWork = Math.round(sliders.work * 2);
  const hhTravel = Math.round(sliders.travel * 2);
  const hhPhone = Math.round(sliders.phone * 2);
  const hhLearn = Math.round(sliders.learn * 2);

  const totalActiveHh = hhSleep + hhWork + hhTravel + hhPhone + hhLearn;
  if (totalActiveHh > 48) {
    return {
      valid: false,
      error: 'That adds up to more than 24 hours. Lower one of them.'
    };
  }

  const hhFree = 48 - totalActiveHh;
  const allHh = [hhSleep, hhWork, hhTravel, hhPhone, hhLearn, hhFree];

  // exact = H * hh, weeks = floor(exact / 48), rest = exact % 48
  const exact = allHh.map(hh => H * hh);
  const weeks = exact.map(e => Math.floor(e / 48));
  const rest = exact.map(e => e % 48);

  const assignedWeeks = weeks.reduce((sum, w) => sum + w, 0);
  const unassigned = H - assignedWeeks;

  // Distribute unassigned weeks to buckets with the largest rest.
  // On a tie, earlier bucket in slider order goes first.
  const indices = [0, 1, 2, 3, 4, 5];
  indices.sort((a, b) => {
    if (rest[b] !== rest[a]) {
      return rest[b] - rest[a];
    }
    return a - b;
  });

  for (let i = 0; i < unassigned; i++) {
    const bucketIndex = indices[i];
    weeks[bucketIndex] += 1;
  }

  const learningHours = H * 7 * sliders.learn;
  const years = weeks.map(w => (w / 52).toFixed(1));

  let rangePhrase = 'of your next 10 years';
  if (rangeType === 'year') {
    rangePhrase = 'of the next year';
  } else if (rangeType === 'ahead') {
    rangePhrase = 'of your weeks ahead';
  }

  const phoneWeeks = weeks[3];
  const learnWeeks = weeks[4];
  const highlightLine1 = `Your phone gets about ${phoneWeeks} weeks ${rangePhrase}.`;
  const highlightLine2 = `Learning gets about ${learnWeeks} weeks. That is about ${learningHours.toLocaleString('en-IN')} hours.`;

  return {
    valid: true,
    isBonus: false,
    H,
    weeks,
    years,
    learningHours,
    freeHours: (hhFree / 2),
    highlightLine1,
    highlightLine2,
    rangePhrase
  };
}
