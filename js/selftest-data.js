// Test fixtures and expected values for Your Life in Dots self-test suite
// Section 8 of PROJECT_BRIEF.md and Section 7 of UPGRADE_BRIEF.md

export const TEST_TODAY_STR = '2026-10-23';

export const SO_FAR_EXPECTED = [
  {
    caseId: 'A',
    dob: { year: 2004, month: 6, day: 12 },
    dobStr: '2004-06-12',
    lifePicked: 80,
    lifeUsedStr: '80',
    daysLived: 8168,
    weeksLived: 1166,
    age: 22,
    weekIndex: 19,
    livedDots: 1163,
    totalDots: 4160,
    fullMoonsSeen: 276,
    heartbeatsText: 'about 847 million'
  },
  {
    caseId: 'B',
    dob: { year: 1998, month: 3, day: 15 },
    dobStr: '1998-03-15',
    lifePicked: 80,
    lifeUsedStr: '80',
    daysLived: 10449,
    weeksLived: 1492,
    age: 28,
    weekIndex: 31,
    livedDots: 1487,
    totalDots: 4160,
    fullMoonsSeen: 353,
    heartbeatsText: 'about 1.08 billion'
  },
  {
    caseId: 'C',
    dob: { year: 2000, month: 2, day: 29 },
    dobStr: '2000-02-29',
    lifePicked: 80,
    lifeUsedStr: '80',
    daysLived: 9733,
    weeksLived: 1390,
    age: 26,
    weekIndex: 33,
    livedDots: 1385,
    totalDots: 4160,
    fullMoonsSeen: 329,
    heartbeatsText: 'about 1.01 billion'
  },
  {
    caseId: 'D',
    dob: { year: 2026, month: 10, day: 23 },
    dobStr: '2026-10-23',
    lifePicked: 80,
    lifeUsedStr: '80',
    daysLived: 0,
    weeksLived: 0,
    age: 0,
    weekIndex: 0,
    livedDots: 0,
    totalDots: 4160,
    fullMoonsSeen: 0,
    heartbeatsText: '0'
  },
  {
    caseId: 'E',
    dob: { year: 1950, month: 6, day: 1 },
    dobStr: '1950-06-01',
    lifePicked: 70,
    lifeUsedStr: '80 (moved up)',
    daysLived: 27903,
    weeksLived: 3986,
    age: 76,
    weekIndex: 20,
    livedDots: 3972,
    totalDots: 4160,
    fullMoonsSeen: 944,
    heartbeatsText: 'about 2.89 billion'
  },
  {
    caseId: 'F',
    dob: { year: 2010, month: 12, day: 31 },
    dobStr: '2010-12-31',
    lifePicked: 90,
    lifeUsedStr: '90',
    daysLived: 5775,
    weeksLived: 825,
    age: 15,
    weekIndex: 42,
    livedDots: 822,
    totalDots: 4680,
    fullMoonsSeen: 195,
    heartbeatsText: 'about 599 million'
  },
  {
    caseId: 'G',
    dob: { year: 1926, month: 1, day: 1 },
    dobStr: '1926-01-01',
    lifePicked: 80,
    lifeUsedStr: 'bonus',
    daysLived: 36820,
    weeksLived: 5260,
    age: 100,
    weekIndex: 42,
    livedDots: 5242,
    totalDots: 5252,
    fullMoonsSeen: 1246,
    heartbeatsText: 'about 3.82 billion'
  }
];

export const AHEAD_EXPECTED = [
  {
    caseId: 'A',
    endDateStr: '2084-06-12',
    sundays: 3008,
    pongals: 58,
    worldCups: 15,
    fullMoonsAhead: 713
  },
  {
    caseId: 'B',
    endDateStr: '2078-03-15',
    sundays: 2682,
    pongals: 52,
    worldCups: 13,
    fullMoonsAhead: 636
  },
  {
    caseId: 'C',
    endDateStr: '2080-02-29',
    sundays: 2784,
    pongals: 54,
    worldCups: 14,
    fullMoonsAhead: 660
  },
  {
    caseId: 'D',
    endDateStr: '2106-10-23',
    sundays: 4174,
    pongals: 80,
    worldCups: 20,
    fullMoonsAhead: 990
  },
  {
    caseId: 'E',
    endDateStr: '2030-06-01',
    sundays: 188,
    pongals: 4,
    worldCups: 1,
    fullMoonsAhead: 45
  },
  {
    caseId: 'F',
    endDateStr: '2100-12-31',
    sundays: 3871,
    pongals: 74,
    worldCups: 19,
    fullMoonsAhead: 918
  }
];

export const HISTORY_EXPECTED = [
  {
    caseId: 'A',
    dob: { year: 2004, month: 6, day: 12 },
    livedCount: 20,
    beforeCount: 11,
    picksStr: 'wc-2011, 6, 354 / mars, 10, 534 / chandrayaan-3, 19, 998'
  },
  {
    caseId: 'B',
    dob: { year: 1998, month: 3, day: 15 },
    livedCount: 21,
    beforeCount: 10,
    picksStr: 't20-2007, 9, 495 / wc-2011, 13, 678 / chandrayaan-3, 25, 1323'
  },
  {
    caseId: 'C',
    dob: { year: 2000, month: 2, day: 29 },
    livedCount: 20,
    beforeCount: 11,
    picksStr: 't20-2007, 7, 393 / wc-2011, 11, 576 / chandrayaan-3, 23, 1221'
  },
  {
    caseId: 'D',
    dob: { year: 2026, month: 10, day: 23 },
    livedCount: 0,
    beforeCount: 31,
    picksStr: 'none'
  },
  {
    caseId: 'E',
    dob: { year: 1950, month: 6, day: 1 },
    livedCount: 29,
    beforeCount: 2,
    picksStr: 'moon-walk, 19, 995 / wc-2011, 60, 3163 / chandrayaan-3, 73, 3807'
  },
  {
    caseId: 'F',
    dob: { year: 2010, month: 12, day: 31 },
    livedCount: 18,
    beforeCount: 13,
    picksStr: 'chandrayaan-3, 12, 657 / t20-2024, 13, 701 / women-wc, 14, 771'
  },
  {
    caseId: 'G',
    dob: { year: 1926, month: 1, day: 1 },
    livedCount: 31,
    beforeCount: 0,
    picksStr: 'moon-walk, 43, 2264 / wc-2011, 85, 4433 / chandrayaan-3, 97, 5077'
  }
];

export const MILESTONES_EXPECTED_A = [
  { label: '1,000 weeks old',       dateStr: '2023-08-12', age: 19, status: 'done',   dotIndex: 996,  inAbout: '' },
  { label: 'You turn 12 on Mars',   dateStr: '2027-01-06', age: 22, status: 'ahead',  dotIndex: 1173, inAbout: 'in about 2 months' },
  { label: '10,000 days old',       dateStr: '2031-10-29', age: 27, status: 'ahead',  dotIndex: 1423, inAbout: 'in about 5 years' },
  { label: '1 billion seconds old', dateStr: '2036-02-19', age: 31, status: 'ahead',  dotIndex: 1648, inAbout: 'in about 9 years' },
  { label: '2,000 weeks old',       dateStr: '2042-10-11', age: 38, status: 'ahead',  dotIndex: 1993, inAbout: 'in about 16 years' },
  { label: '20,000 days old',       dateStr: '2059-03-16', age: 54, status: 'ahead',  dotIndex: 2847, inAbout: 'in about 32 years' },
  { label: '3,000 weeks old',       dateStr: '2061-12-10', age: 57, status: 'ahead',  dotIndex: 2989, inAbout: 'in about 35 years' },
  { label: '2 billion seconds old', dateStr: '2067-10-28', age: 63, status: 'ahead',  dotIndex: 3295, inAbout: 'in about 41 years' },
  { label: '25,000 days old',       dateStr: '2072-11-22', age: 68, status: 'ahead',  dotIndex: 3559, inAbout: 'in about 46 years' },
  { label: '4,000 weeks old',       dateStr: '2081-02-08', age: 76, status: 'ahead',  dotIndex: 3986, inAbout: 'in about 54 years' },
  { label: '1,000th full moon',     dateStr: '2085-04-09', age: 80, status: 'hidden', dotIndex: 4203, inAbout: '' },
  { label: '30,000 days old',       dateStr: '2086-08-01', age: 82, status: 'hidden', dotIndex: 4271, inAbout: '' }
];

export const TIME_SPLIT_EXPECTED = [
  {
    caseId: 'A',
    range: 'year',
    aheadDots: 2996,
    sliders: { sleep: 8, work: 8, travel: 1, phone: 3, learn: 1 },
    expH: 52,
    expWeeks: [17, 17, 2, 7, 2, 7],
    expLearningHours: 364
  },
  {
    caseId: 'A',
    range: '10years',
    aheadDots: 2996,
    sliders: { sleep: 8, work: 8, travel: 1, phone: 3, learn: 1 },
    expH: 520,
    expWeeks: [173, 173, 22, 65, 22, 65],
    expLearningHours: 3640
  },
  {
    caseId: 'A',
    range: 'ahead',
    aheadDots: 2996,
    sliders: { sleep: 8, work: 8, travel: 1, phone: 3, learn: 1 },
    expH: 2996,
    expWeeks: [999, 999, 125, 374, 125, 374],
    expLearningHours: 20972
  },
  {
    caseId: 'A (swapped)',
    range: '10years',
    aheadDots: 2996,
    sliders: { sleep: 8, work: 8, travel: 1, phone: 2, learn: 2 },
    expH: 520,
    expWeeks: [174, 173, 22, 43, 43, 65],
    expLearningHours: 7280
  },
  {
    caseId: 'A (custom)',
    range: '10years',
    aheadDots: 2996,
    sliders: { sleep: 7.5, work: 9, travel: 1.5, phone: 2.5, learn: 0.5 },
    expH: 520,
    expWeeks: [163, 195, 32, 54, 11, 65],
    expLearningHours: 1820
  },
  {
    caseId: 'B',
    range: 'ahead',
    aheadDots: 2672,
    sliders: { sleep: 8, work: 8, travel: 1, phone: 3, learn: 1 },
    expH: 2672,
    expWeeks: [891, 891, 111, 334, 111, 334],
    expLearningHours: 18704
  },
  {
    caseId: 'E (capped)',
    range: '10years',
    aheadDots: 187,
    sliders: { sleep: 8, work: 8, travel: 1, phone: 3, learn: 1 },
    expH: 187,
    expWeeks: [62, 62, 8, 24, 8, 23],
    expLearningHours: 1309
  },
  {
    caseId: 'E (swapped)',
    range: '10years',
    aheadDots: 187,
    sliders: { sleep: 8, work: 8, travel: 1, phone: 2, learn: 2 },
    expH: 187,
    expWeeks: [62, 62, 8, 16, 16, 23],
    expLearningHours: 2618
  }
];
