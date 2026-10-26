// Self-test runner for Your Life in Dots (checked with ?test=1)
import { dayNumber, isSunday, validateDate } from './dates.js';
import { calculateLifeStats } from './stats.js';
import { computeGridLayout, getDotCenter, hitTestDot } from './grid.js';

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

function formatDate(d) {
  const y = String(d.year).padStart(4, '0');
  const m = String(d.month).padStart(2, '0');
  const day = String(d.day).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function runSelfTest(todayStr = TEST_TODAY_STR) {
  const [tY, tM, tD] = todayStr.split('-').map(Number);
  const todayDayNum = dayNumber(tY, tM, tD);

  let allPassed = true;
  const soFarResults = [];
  const aheadResults = [];
  const otherResults = [];

  // 1. So far table
  for (const exp of SO_FAR_EXPECTED) {
    const stats = calculateLifeStats(exp.dob, exp.lifePicked, todayDayNum);

    let actualLifeUsedStr = String(stats.lifeUsed);
    if (stats.movedUp) actualLifeUsedStr = `${stats.lifeUsed} (moved up)`;
    if (stats.isBonus) actualLifeUsedStr = 'bonus';

    const matchLifeUsed = actualLifeUsedStr === exp.lifeUsedStr;
    const matchDays = stats.daysLived === exp.daysLived;
    const matchWeeks = stats.weeksLived === exp.weeksLived;
    const matchAge = stats.age === exp.age;
    const matchWeekIdx = stats.weekIndex === exp.weekIndex;
    const matchLivedDots = stats.livedDots === exp.livedDots;
    const matchTotalDots = stats.totalDots === exp.totalDots;
    const matchMoons = stats.soFar.fullMoonsSeen === exp.fullMoonsSeen;
    const matchHb = stats.soFar.heartbeatsText === exp.heartbeatsText;

    const pass = matchLifeUsed && matchDays && matchWeeks && matchAge &&
      matchWeekIdx && matchLivedDots && matchTotalDots && matchMoons && matchHb;

    if (!pass) allPassed = false;

    soFarResults.push({
      Case: exp.caseId,
      DOB: exp.dobStr,
      LifePicked: exp.lifePicked,
      LifeUsed: actualLifeUsedStr,
      DaysLived: stats.daysLived,
      WeeksLived: stats.weeksLived,
      Age: stats.age,
      WeekIdx: stats.weekIndex,
      LivedDots: stats.livedDots,
      TotalDots: stats.totalDots,
      MoonsSeen: stats.soFar.fullMoonsSeen,
      Heartbeats: stats.soFar.heartbeatsText,
      Status: pass ? 'PASS' : 'FAIL'
    });
  }

  // 2. Ahead table
  for (const exp of AHEAD_EXPECTED) {
    const caseInput = SO_FAR_EXPECTED.find(c => c.caseId === exp.caseId);
    const stats = calculateLifeStats(caseInput.dob, caseInput.lifePicked, todayDayNum);

    const actualEndStr = stats.ahead ? formatDate(stats.ahead.endDate) : 'none';
    const matchEnd = actualEndStr === exp.endDateStr;
    const matchSundays = stats.ahead ? stats.ahead.sundays === exp.sundays : false;
    const matchPongal = stats.ahead ? stats.ahead.pongals === exp.pongals : false;
    const matchWc = stats.ahead ? stats.ahead.worldCups === exp.worldCups : false;
    const matchMoons = stats.ahead ? stats.ahead.fullMoonsAhead === exp.fullMoonsAhead : false;

    const pass = matchEnd && matchSundays && matchPongal && matchWc && matchMoons;
    if (!pass) allPassed = false;

    aheadResults.push({
      Case: exp.caseId,
      EndDate: actualEndStr,
      Sundays: stats.ahead ? stats.ahead.sundays : 0,
      Pongal: stats.ahead ? stats.ahead.pongals : 0,
      WorldCups: stats.ahead ? stats.ahead.worldCups : 0,
      FullMoons: stats.ahead ? stats.ahead.fullMoonsAhead : 0,
      Status: pass ? 'PASS' : 'FAIL'
    });
  }

  // 3. Validation tests
  const v1 = validateDate(2001, 2, 31, todayDayNum);
  const p1 = !v1.valid && v1.error === 'That date does not exist. Please check the day.';
  otherResults.push({ Test: 'Validation: 31 Feb 2001 rejected', Status: p1 ? 'PASS' : 'FAIL' });

  const v2 = validateDate(2001, 2, 29, todayDayNum);
  const p2 = !v2.valid && v2.error === 'That date does not exist. Please check the day.';
  otherResults.push({ Test: 'Validation: 29 Feb 2001 rejected', Status: p2 ? 'PASS' : 'FAIL' });

  const v3 = validateDate(2000, 2, 29, todayDayNum);
  const p3 = v3.valid === true;
  otherResults.push({ Test: 'Validation: 29 Feb 2000 accepted', Status: p3 ? 'PASS' : 'FAIL' });

  const tomorrowDayNum = todayDayNum + 1;
  const tomorrowParts = { year: 2026, month: 10, day: 24 };
  const v4 = validateDate(tomorrowParts.year, tomorrowParts.month, tomorrowParts.day, todayDayNum);
  const p4 = !v4.valid && v4.error === 'That date is in the future.';
  otherResults.push({ Test: 'Validation: Tomorrow rejected', Status: p4 ? 'PASS' : 'FAIL' });

  const v5 = validateDate(2026, 10, 23, todayDayNum);
  const p5 = v5.valid === true;
  otherResults.push({ Test: 'Validation: Today accepted', Status: p5 ? 'PASS' : 'FAIL' });

  const v6 = validateDate('', 6, 12, todayDayNum);
  const p6 = !v6.valid && v6.error === 'Please pick your full date of birth.';
  otherResults.push({ Test: 'Validation: Missing year rejected', Status: p6 ? 'PASS' : 'FAIL' });

  const v7 = validateDate(2004, '', 12, todayDayNum);
  const p7 = !v7.valid && v7.error === 'Please pick your full date of birth.';
  otherResults.push({ Test: 'Validation: Missing month rejected', Status: p7 ? 'PASS' : 'FAIL' });

  const v8 = validateDate(2004, 6, '', todayDayNum);
  const p8 = !v8.valid && v8.error === 'Please pick your full date of birth.';
  otherResults.push({ Test: 'Validation: Missing day rejected', Status: p8 ? 'PASS' : 'FAIL' });

  // 4. Sunday rule tests
  const sunTest1 = isSunday(dayNumber(2026, 10, 25)) === true;
  otherResults.push({ Test: 'Sunday rule: 25 Oct 2026 is Sunday', Status: sunTest1 ? 'PASS' : 'FAIL' });

  const sunTest2 = isSunday(dayNumber(2026, 10, 23)) === false;
  otherResults.push({ Test: 'Sunday rule: 23 Oct 2026 is not Sunday', Status: sunTest2 ? 'PASS' : 'FAIL' });

  // 5. Hit testing tests
  const hitConfigs = [
    { label: '390x844 (80 rows)', rows: 80, w: 342, h: 550, isLaptop: false },
    { label: '390x844 (101 rows)', rows: 101, w: 342, h: 550, isLaptop: false },
    { label: '1440x900 (80 rows)', rows: 80, w: 600, h: 700, isLaptop: true },
    { label: '1440x900 (101 rows)', rows: 101, w: 600, h: 700, isLaptop: true }
  ];

  for (const cfg of hitConfigs) {
    const layout = computeGridLayout(cfg.rows, cfg.w, cfg.h, cfg.isLaptop);
    let cfgPass = true;

    // 50 random dots
    for (let i = 0; i < 50; i++) {
      const r = Math.floor(Math.random() * cfg.rows);
      const c = Math.floor(Math.random() * 52);
      const { cx, cy } = getDotCenter(r, c, layout);
      const hit = hitTestDot(cx, cy, layout);
      if (!hit || hit.row !== r || hit.col !== c) {
        cfgPass = false;
        break;
      }
    }

    // Points inside decade gaps
    const maxDecade = Math.floor((cfg.rows - 1) / 10);
    for (let d = 0; d < maxDecade; d++) {
      const gapX = layout.gutterWidth + 10 * layout.s;
      const gapY = d * 10.8 * layout.s + 10 * layout.s + 0.4 * layout.s;
      const hitGap = hitTestDot(gapX, gapY, layout);
      if (hitGap !== null) {
        cfgPass = false;
        break;
      }
    }

    otherResults.push({
      Test: `Hit testing: ${cfg.label} 50 dots and decade gaps`,
      Status: cfgPass ? 'PASS' : 'FAIL'
    });
  }

  // 6. Privacy test
  let privacyPass = true;
  if (typeof window !== 'undefined') {
    const testDobSample = '2004-06-12';
    const locSearch = window.location.search;
    const urlHasDob = locSearch.includes('dob=') && !locSearch.includes('test=1') && !locSearch.includes('demo=1');
    let storageHasDob = false;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (localStorage.getItem(key).includes(testDobSample)) storageHasDob = true;
      }
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (sessionStorage.getItem(key).includes(testDobSample)) storageHasDob = true;
      }
    } catch {
      // storage unavailable or blocked
    }
    privacyPass = !urlHasDob && !storageHasDob;
  }
  otherResults.push({ Test: 'Privacy: DOB never in URL or storage', Status: privacyPass ? 'PASS' : 'FAIL' });

  for (const r of otherResults) {
    if (r.Status !== 'PASS') allPassed = false;
  }

  // Console output
  console.log(`\n======================================================`);
  console.log(`YOUR LIFE IN DOTS - SELF-TEST REPORT (Fixed Today: ${todayStr})`);
  console.log(`======================================================\n`);

  console.log('1. SO FAR CHECK:');
  console.table(soFarResults);

  console.log('\n2. AHEAD CHECK:');
  console.table(aheadResults);

  console.log('\n3. VALIDATION, SUNDAY & PRIVACY CHECKS:');
  console.table(otherResults);

  console.log(`\nOVERALL RESULT: ${allPassed ? 'ALL TESTS PASSED' : 'TESTS FAILED'}\n`);

  return {
    allPassed,
    todayStr,
    soFarResults,
    aheadResults,
    otherResults
  };
}
