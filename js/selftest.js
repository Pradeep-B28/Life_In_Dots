// Self-test runner for Your Life in Dots (checked with ?test=1)
// Covers PROJECT_BRIEF.md Section 8 and UPGRADE_BRIEF.md Section 7

import { dayNumber, isSunday, validateDate } from './dates.js';
import { calculateLifeStats } from './stats.js';
import { computeGridLayout, getDotCenter, hitTestDot } from './grid.js';
import { runV2Tests } from './selftest-v2.js';
import {
  TEST_TODAY_STR,
  SO_FAR_EXPECTED,
  AHEAD_EXPECTED
} from './selftest-data.js';

export { TEST_TODAY_STR, SO_FAR_EXPECTED, AHEAD_EXPECTED };

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

  // 1. So Far Table (v1)
  for (const exp of SO_FAR_EXPECTED) {
    const stats = calculateLifeStats(exp.dob, exp.lifePicked, todayDayNum);

    let actualLifeUsedStr = String(stats.lifeUsed);
    if (stats.movedUp) actualLifeUsedStr = `${stats.lifeUsed} (moved up)`;
    if (stats.isBonus) actualLifeUsedStr = 'bonus';

    const pass = (actualLifeUsedStr === exp.lifeUsedStr) &&
      (stats.daysLived === exp.daysLived) &&
      (stats.weeksLived === exp.weeksLived) &&
      (stats.age === exp.age) &&
      (stats.weekIndex === exp.weekIndex) &&
      (stats.livedDots === exp.livedDots) &&
      (stats.totalDots === exp.totalDots) &&
      (stats.soFar.fullMoonsSeen === exp.fullMoonsSeen) &&
      (stats.soFar.heartbeatsText === exp.heartbeatsText);

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

  // 2. Ahead Table (v1)
  for (const exp of AHEAD_EXPECTED) {
    const caseInput = SO_FAR_EXPECTED.find(c => c.caseId === exp.caseId);
    const stats = calculateLifeStats(caseInput.dob, caseInput.lifePicked, todayDayNum);

    const actualEndStr = stats.ahead ? formatDate(stats.ahead.endDate) : 'none';
    const pass = (actualEndStr === exp.endDateStr) &&
      (stats.ahead && stats.ahead.sundays === exp.sundays) &&
      (stats.ahead && stats.ahead.pongals === exp.pongals) &&
      (stats.ahead && stats.ahead.worldCups === exp.worldCups) &&
      (stats.ahead && stats.ahead.fullMoonsAhead === exp.fullMoonsAhead);

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

  // 3. Validation, Sunday, Hit Testing, Privacy (v1)
  const v1 = validateDate(2001, 2, 31, todayDayNum);
  otherResults.push({ Test: 'Validation: 31 Feb 2001 rejected', Status: (!v1.valid && v1.error === 'That date does not exist. Please check the day.') ? 'PASS' : 'FAIL' });

  const v2 = validateDate(2001, 2, 29, todayDayNum);
  otherResults.push({ Test: 'Validation: 29 Feb 2001 rejected', Status: (!v2.valid && v2.error === 'That date does not exist. Please check the day.') ? 'PASS' : 'FAIL' });

  const v3 = validateDate(2000, 2, 29, todayDayNum);
  otherResults.push({ Test: 'Validation: 29 Feb 2000 accepted', Status: (v3.valid === true) ? 'PASS' : 'FAIL' });

  const tomorrowParts = { year: 2026, month: 10, day: 24 };
  const v4 = validateDate(tomorrowParts.year, tomorrowParts.month, tomorrowParts.day, todayDayNum);
  otherResults.push({ Test: 'Validation: Tomorrow rejected', Status: (!v4.valid && v4.error === 'That date is in the future.') ? 'PASS' : 'FAIL' });

  const v5 = validateDate(2026, 10, 23, todayDayNum);
  otherResults.push({ Test: 'Validation: Today accepted', Status: (v5.valid === true) ? 'PASS' : 'FAIL' });

  const v6 = validateDate('', 6, 12, todayDayNum);
  otherResults.push({ Test: 'Validation: Missing year rejected', Status: (!v6.valid && v6.error === 'Please pick your full date of birth.') ? 'PASS' : 'FAIL' });

  const v7 = validateDate(2004, '', 12, todayDayNum);
  otherResults.push({ Test: 'Validation: Missing month rejected', Status: (!v7.valid && v7.error === 'Please pick your full date of birth.') ? 'PASS' : 'FAIL' });

  const v8 = validateDate(2004, 6, '', todayDayNum);
  otherResults.push({ Test: 'Validation: Missing day rejected', Status: (!v8.valid && v8.error === 'Please pick your full date of birth.') ? 'PASS' : 'FAIL' });

  otherResults.push({ Test: 'Sunday rule: 25 Oct 2026 is Sunday', Status: (isSunday(dayNumber(2026, 10, 25)) === true) ? 'PASS' : 'FAIL' });
  otherResults.push({ Test: 'Sunday rule: 23 Oct 2026 is not Sunday', Status: (isSunday(dayNumber(2026, 10, 23)) === false) ? 'PASS' : 'FAIL' });

  const hitConfigs = [
    { label: '390x844 (80 rows)', rows: 80, w: 342, h: 550, isLaptop: false },
    { label: '390x844 (101 rows)', rows: 101, w: 342, h: 550, isLaptop: false },
    { label: '1440x900 (80 rows)', rows: 80, w: 600, h: 700, isLaptop: true },
    { label: '1440x900 (101 rows)', rows: 101, w: 600, h: 700, isLaptop: true }
  ];

  for (const cfg of hitConfigs) {
    const layout = computeGridLayout(cfg.rows, cfg.w, cfg.h, cfg.isLaptop);
    let cfgPass = true;

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
    } catch {}
    privacyPass = !urlHasDob && !storageHasDob;
  }
  otherResults.push({ Test: 'Privacy: DOB never in URL or storage', Status: privacyPass ? 'PASS' : 'FAIL' });

  for (const r of otherResults) {
    if (r.Status !== 'PASS') allPassed = false;
  }

  // Run v2 checks from helper
  const v2Results = runV2Tests(todayDayNum);
  if (!v2Results.allPassed) allPassed = false;

  // Console output
  console.log(`\n======================================================`);
  console.log(`YOUR LIFE IN DOTS - FULL SELF-TEST REPORT (Fixed Today: ${todayStr})`);
  console.log(`======================================================\n`);

  console.log('1. SO FAR CHECK (v1):');
  console.table(soFarResults);

  console.log('\n2. AHEAD CHECK (v1):');
  console.table(aheadResults);

  console.log('\n3. VALIDATION, SUNDAY & PRIVACY CHECKS (v1):');
  console.table(otherResults);

  console.log('\n4. HISTORY & FLASHBACK CHECK (v2 Section 7A):');
  console.table(v2Results.historyResults);

  console.log('\n5. MILESTONES CHECK (v2 Section 7B):');
  console.table(v2Results.milestoneResults);

  console.log('\n6. TIME SPLIT CHECK (v2 Section 7C):');
  console.table(v2Results.timeSplitResults);

  console.log('\n7. CHAPTERS CHECK (v2 Section 7D):');
  console.table(v2Results.chapterResults);

  console.log(`\nOVERALL RESULT: ${allPassed ? 'ALL TESTS PASSED' : 'TESTS FAILED'}\n`);

  return {
    allPassed,
    todayStr,
    soFarResults,
    aheadResults,
    otherResults,
    historyResults: v2Results.historyResults,
    milestoneResults: v2Results.milestoneResults,
    timeSplitResults: v2Results.timeSplitResults,
    chapterResults: v2Results.chapterResults
  };
}
