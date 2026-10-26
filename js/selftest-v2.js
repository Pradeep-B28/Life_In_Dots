// Upgrade v2 tests for Your Life in Dots (Section 7 of UPGRADE_BRIEF.md)

import { dayNumber } from './dates.js';
import { getHistoryData, getFlashbackPicks } from './history.js';
import { calculateMilestones, buildIcsCalendarFile } from './milestones.js';
import { calculateTimeSplit, DEFAULT_SLIDERS, swapPhoneForLearning } from './timebudget.js';
import { validateChapter, getChapterDotRange } from './chapters.js';
import {
  HISTORY_EXPECTED,
  MILESTONES_EXPECTED_A,
  TIME_SPLIT_EXPECTED
} from './selftest-data.js';

export function runV2Tests(todayDayNum) {
  let allPassed = true;
  const historyResults = [];
  const milestoneResults = [];
  const timeSplitResults = [];
  const chapterResults = [];

  // ------------------------------------------
  // 1. History and Flashback (Section 7A)
  // ------------------------------------------
  for (const exp of HISTORY_EXPECTED) {
    const hData = getHistoryData(exp.dob, todayDayNum);
    const picks = getFlashbackPicks(exp.dob, todayDayNum);
    const actualPicksStr = picks.map(p => `${p.id}, ${p.age}, ${p.dotIndex}`).join(' / ') || 'none';

    const matchLived = hData.livedCount === exp.livedCount;
    const matchBefore = hData.beforeBirthCount === exp.beforeCount;
    const matchPicks = actualPicksStr === exp.picksStr;
    const pass = matchLived && matchBefore && matchPicks;
    if (!pass) allPassed = false;

    historyResults.push({
      Case: exp.caseId,
      Lived: `${hData.livedCount} (exp ${exp.livedCount})`,
      Before: `${hData.beforeBirthCount} (exp ${exp.beforeCount})`,
      Picks: actualPicksStr,
      Status: pass ? 'PASS' : 'FAIL'
    });
  }

  // Exact sentences checks
  const pA = getFlashbackPicks({ year: 2004, month: 6, day: 12 }, todayDayNum);
  const pF = getFlashbackPicks({ year: 2010, month: 12, day: 31 }, todayDayNum);
  const pE = getFlashbackPicks({ year: 1950, month: 6, day: 1 }, todayDayNum);

  const expSentenceA = 'You were 6 when India won the Cricket World Cup for the second time.';
  const expSentenceF = "You were 14 when India's women won their first Cricket World Cup.";
  const expSentenceE = 'You were 19 when humans first walked on the Moon.';

  const passSentenceA = pA[0] && pA[0].sentence === expSentenceA;
  const passSentenceF = pF[2] && pF[2].sentence === expSentenceF;
  const passSentenceE = pE[0] && pE[0].sentence === expSentenceE;

  if (!passSentenceA || !passSentenceF || !passSentenceE) allPassed = false;

  historyResults.push({ Case: 'Sentence A', Lived: 'N/A', Before: 'N/A', Picks: pA[0] ? pA[0].sentence : 'missing', Status: passSentenceA ? 'PASS' : 'FAIL' });
  historyResults.push({ Case: 'Sentence F', Lived: 'N/A', Before: 'N/A', Picks: pF[2] ? pF[2].sentence : 'missing', Status: passSentenceF ? 'PASS' : 'FAIL' });
  historyResults.push({ Case: 'Sentence E', Lived: 'N/A', Before: 'N/A', Picks: pE[0] ? pE[0].sentence : 'missing', Status: passSentenceE ? 'PASS' : 'FAIL' });

  // ------------------------------------------
  // 2. Milestones (Section 7B)
  // ------------------------------------------
  const dobA = { year: 2004, month: 6, day: 12 };
  const endA = dayNumber(2084, 6, 12);
  const resA = calculateMilestones(dobA, todayDayNum, endA, false, 4160);

  for (const exp of MILESTONES_EXPECTED_A) {
    const actual = resA.milestones.find(m => m.label === exp.label);
    const pass = actual &&
      actual.dateStr === exp.dateStr &&
      actual.age === exp.age &&
      actual.status === exp.status &&
      (exp.status === 'hidden' || actual.dotIndex === exp.dotIndex) &&
      actual.inAbout === exp.inAbout;

    if (!pass) allPassed = false;

    milestoneResults.push({
      Label: exp.label,
      Date: actual ? actual.dateStr : 'missing',
      Age: actual ? actual.age : 0,
      Status: actual ? actual.status : 'missing',
      Dot: actual ? actual.dotIndex : -1,
      InAbout: actual ? actual.inAbout : '',
      Result: pass ? 'PASS' : 'FAIL'
    });
  }

  const matchNextUpA = resA.nextUp && resA.nextUp.label === 'You turn 12 on Mars';
  if (!matchNextUpA) allPassed = false;
  milestoneResults.push({
    Label: 'Case A nextUp check',
    Date: '2027-01-06',
    Age: 22,
    Status: 'ahead',
    Dot: 1173,
    InAbout: resA.nextUp ? resA.nextUp.label : 'missing',
    Result: matchNextUpA ? 'PASS' : 'FAIL'
  });

  // Case B
  const dobB = { year: 1998, month: 3, day: 15 };
  const endB = dayNumber(2078, 3, 15);
  const resB = calculateMilestones(dobB, todayDayNum, endB, false, 4160);
  const m10kB = resB.milestones.find(m => m.label === '10,000 days old');
  const mMarsB = resB.nextUp;
  const m1bB = resB.milestones.find(m => m.label === '1 billion seconds old');
  const mMoonB = resB.milestones.find(m => m.label === '1,000th full moon');

  const passB = m10kB && m10kB.dateStr === '2025-07-31' && m10kB.status === 'done' &&
    mMarsB && mMarsB.label === 'You turn 16 on Mars' && mMarsB.dateStr === '2028-04-17' && mMarsB.age === 30 && mMarsB.dotIndex === 1564 && mMarsB.inAbout === 'in about 18 months' &&
    m1bB && m1bB.dateStr === '2029-11-21' && m1bB.dotIndex === 1647 && m1bB.inAbout === 'in about 3 years' &&
    mMoonB && mMoonB.dateStr === '2079-01-17' && mMoonB.status === 'hidden';

  if (!passB) allPassed = false;
  milestoneResults.push({
    Label: 'Case B milestone bundle',
    Date: '2028-04-17',
    Age: 30,
    Status: 'ahead',
    Dot: 1564,
    InAbout: mMarsB ? mMarsB.inAbout : '',
    Result: passB ? 'PASS' : 'FAIL'
  });

  // Case E
  const dobE = { year: 1950, month: 6, day: 1 };
  const endE = dayNumber(2030, 6, 1);
  const resE = calculateMilestones(dobE, todayDayNum, endE, false, 4160);
  const m25kE = resE.milestones.find(m => m.label === '25,000 days old');
  const m4kWkE = resE.nextUp;
  const mMarsE = resE.milestones.find(m => m.label === 'You turn 41 on Mars');
  const mMoonE = resE.milestones.find(m => m.label === '1,000th full moon');

  const passE = m25kE && m25kE.dateStr === '2018-11-11' && m25kE.status === 'done' &&
    m4kWkE && m4kWkE.label === '4,000 weeks old' && m4kWkE.dateStr === '2027-01-28' && m4kWkE.age === 76 && m4kWkE.dotIndex === 3986 && m4kWkE.inAbout === 'in about 3 months' &&
    mMarsE && mMarsE.dateStr === '2027-07-13' && mMarsE.dotIndex === 4010 && mMarsE.inAbout === 'in about 9 months' &&
    mMoonE && mMoonE.dateStr === '2031-04-06' && mMoonE.status === 'hidden';

  if (!passE) allPassed = false;
  milestoneResults.push({
    Label: 'Case E milestone bundle',
    Date: '2027-01-28',
    Age: 76,
    Status: 'ahead',
    Dot: 3986,
    InAbout: m4kWkE ? m4kWkE.inAbout : '',
    Result: passE ? 'PASS' : 'FAIL'
  });

  // Case G
  const dobG = { year: 1926, month: 1, day: 1 };
  const resG = calculateMilestones(dobG, todayDayNum, null, true, 5252);
  const mMoonG = resG.milestones.find(m => m.label === '1,000th full moon');
  const m30kG = resG.milestones.find(m => m.label === '30,000 days old');
  const mMarsG = resG.nextUp;

  const passG = mMoonG && mMoonG.dateStr === '2006-11-05' && mMoonG.status === 'done' && mMoonG.dotIndex === 4204 &&
    m30kG && m30kG.dateStr === '2008-02-20' && m30kG.status === 'done' && m30kG.dotIndex === 4271 &&
    mMarsG && mMarsG.label === 'You turn 54 on Mars' && mMarsG.dateStr === '2027-07-26' && mMarsG.age === 101 && mMarsG.inAbout === 'in about 9 months' && mMarsG.hasMarker === false;

  if (!passG) allPassed = false;
  milestoneResults.push({
    Label: 'Case G milestone bundle',
    Date: '2027-07-26',
    Age: 101,
    Status: 'ahead (no marker)',
    Dot: mMarsG ? mMarsG.dotIndex : -1,
    InAbout: mMarsG ? mMarsG.inAbout : '',
    Result: passG ? 'PASS' : 'FAIL'
  });

  // Calendar file check
  const m10kA = resA.milestones.find(m => m.label === '10,000 days old');
  const icsA = buildIcsCalendarFile(m10kA);
  const matchIcs = icsA.includes('DTSTART;VALUE=DATE:20311029') &&
    icsA.includes('DTEND;VALUE=DATE:20311030') &&
    icsA.includes('SUMMARY:I turn 10,000 days old');

  if (!matchIcs) allPassed = false;
  milestoneResults.push({
    Label: 'Calendar file (Case A 10,000 days)',
    Date: '2031-10-29',
    Age: 27,
    Status: 'ics content',
    Dot: 1423,
    InAbout: 'SUMMARY/DTSTART/DTEND',
    Result: matchIcs ? 'PASS' : 'FAIL'
  });

  // ------------------------------------------
  // 3. Time Split (Section 7C)
  // ------------------------------------------
  for (const exp of TIME_SPLIT_EXPECTED) {
    const split = calculateTimeSplit(exp.sliders, exp.range, exp.aheadDots);
    const pass = split.valid &&
      split.H === exp.expH &&
      JSON.stringify(split.weeks) === JSON.stringify(exp.expWeeks) &&
      split.learningHours === exp.expLearningHours;

    if (!pass) allPassed = false;

    timeSplitResults.push({
      Case: `${exp.caseId} (${exp.range})`,
      H: `${split.H} (exp ${exp.expH})`,
      Weeks: JSON.stringify(split.weeks),
      LearningHours: split.learningHours,
      Status: pass ? 'PASS' : 'FAIL'
    });
  }

  const rejSplit = calculateTimeSplit({ sleep: 12, work: 12, travel: 1, phone: 0, learn: 0 }, '10years', 520);
  const passRej = !rejSplit.valid && rejSplit.error === 'That adds up to more than 24 hours. Lower one of them.';
  if (!passRej) allPassed = false;
  timeSplitResults.push({
    Case: 'Rejection: Sleep 12 + Work 12 + Travel 1',
    H: '0',
    Weeks: 'rejected',
    LearningHours: 0,
    Status: passRej ? 'PASS' : 'FAIL'
  });

  const splitBefore = calculateTimeSplit(DEFAULT_SLIDERS, '10years', 2996);
  const splitAfter = calculateTimeSplit(swapPhoneForLearning(DEFAULT_SLIDERS), '10years', 2996);
  const swapDiff = splitAfter.weeks[4] - splitBefore.weeks[4];
  const swapChipText = `+${swapDiff} weeks of learning`;
  const passSwapChip = swapChipText === '+21 weeks of learning';
  if (!passSwapChip) allPassed = false;
  timeSplitResults.push({
    Case: 'Swap chip text check',
    H: '520',
    Weeks: swapChipText,
    LearningHours: splitAfter.learningHours,
    Status: passSwapChip ? 'PASS' : 'FAIL'
  });

  // ------------------------------------------
  // 4. Chapters (Section 7D)
  // ------------------------------------------
  const dobChapA = { year: 2004, month: 6, day: 12 };

  const chSchool = { name: 'School', start: { month: 6, year: 2009 }, end: { month: 3, year: 2021 }, stillGoing: false };
  const rSchool = getChapterDotRange(chSchool, dobChapA, todayDayNum);
  const passSchool = (rSchool.startDot === 258 && rSchool.endDot === 873);
  if (!passSchool) allPassed = false;
  chapterResults.push({ Check: 'School preset (Jun 2009 to Mar 2021)', Dots: `${rSchool.startDot} to ${rSchool.endDot}`, Status: passSchool ? 'PASS' : 'FAIL' });

  const chCollege = { name: 'College', start: { month: 7, year: 2021 }, end: { month: 5, year: 2025 }, stillGoing: false };
  const rCollege = getChapterDotRange(chCollege, dobChapA, todayDayNum);
  const passCollege = (rCollege.startDot === 886 && rCollege.endDot === 1090);
  if (!passCollege) allPassed = false;
  chapterResults.push({ Check: 'College preset (Jul 2021 to May 2025)', Dots: `${rCollege.startDot} to ${rCollege.endDot}`, Status: passCollege ? 'PASS' : 'FAIL' });

  const chJob = { name: 'First job', start: { month: 7, year: 2025 }, stillGoing: true };
  const rJob = getChapterDotRange(chJob, dobChapA, todayDayNum);
  const passJob = (rJob.startDot === 1094 && rJob.endDot === 1163);
  if (!passJob) allPassed = false;
  chapterResults.push({ Check: 'First job (Jul 2025, Still going)', Dots: `${rJob.startDot} to ${rJob.endDot}`, Status: passJob ? 'PASS' : 'FAIL' });

  const chBirth = { name: 'Early childhood', start: { month: 6, year: 2004 }, end: { month: 12, year: 2004 }, stillGoing: false };
  const rBirth = getChapterDotRange(chBirth, dobChapA, todayDayNum);
  const passBirth = (rBirth.startDot === 0);
  if (!passBirth) allPassed = false;
  chapterResults.push({ Check: 'Birth month chapter starts at dot 0', Dots: `start dot ${rBirth.startDot}`, Status: passBirth ? 'PASS' : 'FAIL' });

  const rej1 = validateChapter({ name: 'Ch', start: { month: 1, year: 2004 }, end: { month: 5, year: 2004 }, stillGoing: false }, dobChapA, todayDayNum);
  const passRej1 = !rej1.valid && rej1.error === 'That is before you were born.';
  if (!passRej1) allPassed = false;
  chapterResults.push({ Check: 'Rejection: Start Jan 2004 before birth', Dots: rej1.error, Status: passRej1 ? 'PASS' : 'FAIL' });

  const rej2 = validateChapter({ name: 'Ch', start: { month: 6, year: 2020 }, end: { month: 12, year: 2026 }, stillGoing: false }, dobChapA, todayDayNum);
  const passRej2 = !rej2.valid && rej2.error === 'That is in the future. Tick Still going instead.';
  if (!passRej2) allPassed = false;
  chapterResults.push({ Check: 'Rejection: End Dec 2026 in future', Dots: rej2.error, Status: passRej2 ? 'PASS' : 'FAIL' });

  const rej3 = validateChapter({ name: 'Ch', start: { month: 6, year: 2020 }, end: { month: 5, year: 2019 }, stillGoing: false }, dobChapA, todayDayNum);
  const passRej3 = !rej3.valid && rej3.error === 'The end is before the start.';
  if (!passRej3) allPassed = false;
  chapterResults.push({ Check: 'Rejection: End before start', Dots: rej3.error, Status: passRej3 ? 'PASS' : 'FAIL' });

  const rej4 = validateChapter({ name: '', start: { month: 6, year: 2020 }, stillGoing: true }, dobChapA, todayDayNum);
  const passRej4 = !rej4.valid && rej4.error === 'Please give this chapter a name.';
  if (!passRej4) allPassed = false;
  chapterResults.push({ Check: 'Rejection: Empty name', Dots: rej4.error, Status: passRej4 ? 'PASS' : 'FAIL' });

  const rej5 = validateChapter({ name: '123456789012345678901', start: { month: 6, year: 2020 }, stillGoing: true }, dobChapA, todayDayNum);
  const passRej5 = !rej5.valid && rej5.error === 'Please keep it under 20 letters.';
  if (!passRej5) allPassed = false;
  chapterResults.push({ Check: 'Rejection: 21-letter name', Dots: rej5.error, Status: passRej5 ? 'PASS' : 'FAIL' });

  const rej6 = validateChapter({ name: 'Hello<World>', start: { month: 6, year: 2020 }, stillGoing: true }, dobChapA, todayDayNum);
  const passRej6 = !rej6.valid && rej6.error === 'Names can use letters, numbers and spaces.';
  if (!passRej6) allPassed = false;
  chapterResults.push({ Check: 'Rejection: Name with <', Dots: rej6.error, Status: passRej6 ? 'PASS' : 'FAIL' });

  return {
    allPassed,
    historyResults,
    milestoneResults,
    timeSplitResults,
    chapterResults
  };
}
