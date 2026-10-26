// Chapters data, validation and dot range logic for Your Life in Dots
// Section 4F and Section 7D

import { dayNumber, fromDayNumber, daysInMonth, dotIndexForDate } from './dates.js';

export { createChaptersPanel } from './chapters-ui.js';

export const CHAPTER_COLORS = [
  '--ch-1',
  '--ch-2',
  '--ch-3',
  '--ch-4',
  '--ch-5',
  '--ch-6',
  '--ch-7',
  '--ch-8'
];

export function countGraphemes(str) {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
    return [...segmenter.segment(str)].length;
  }
  return [...str].length;
}

export function validateChapter(chapter, dob, todayDayNum) {
  const name = (chapter.name || '').trim();
  if (!name) {
    return { valid: false, error: 'Please give this chapter a name.' };
  }

  // Allowed: letters in any language (\p{L} and \p{M}), digits, spaces, and . ' - &
  const allowedPattern = /^[\p{L}\p{M}0-9\s.'\-&]+$/u;
  if (!allowedPattern.test(name)) {
    return { valid: false, error: 'Names can use letters, numbers and spaces.' };
  }

  if (countGraphemes(name) > 20) {
    return { valid: false, error: 'Please keep it under 20 letters.' };
  }

  const dobParts = typeof dob === 'number' ? fromDayNumber(dob) : dob;
  const todayParts = fromDayNumber(todayDayNum);

  const start = chapter.start;
  if (!start || !start.year || !start.month) {
    return { valid: false, error: 'Please pick a start month and year.' };
  }

  const startY = Number(start.year);
  const startM = Number(start.month);

  // The start month is fully before the birth month: "That is before you were born."
  if (startY < dobParts.year || (startY === dobParts.year && startM < dobParts.month)) {
    return { valid: false, error: 'That is before you were born.' };
  }

  // The start month is after this month: "That is in the future."
  if (startY > todayParts.year || (startY === todayParts.year && startM > todayParts.month)) {
    return { valid: false, error: 'That is in the future.' };
  }

  if (!chapter.stillGoing) {
    const end = chapter.end;
    if (!end || !end.year || !end.month) {
      return { valid: false, error: 'Please pick an end month and year.' };
    }

    const endY = Number(end.year);
    const endM = Number(end.month);

    // The end month is after this month: "That is in the future. Tick Still going instead."
    if (endY > todayParts.year || (endY === todayParts.year && endM > todayParts.month)) {
      return { valid: false, error: 'That is in the future. Tick Still going instead.' };
    }

    // The end is before the start: "The end is before the start."
    if (endY < startY || (endY === startY && endM < startM)) {
      return { valid: false, error: 'The end is before the start.' };
    }
  }

  return { valid: true, error: null };
}

export function getChapterDotRange(chapter, dob, todayDayNum) {
  const dobParts = typeof dob === 'number' ? fromDayNumber(dob) : dob;
  const dobDayNum = typeof dob === 'number' ? dob : dayNumber(dob.year, dob.month, dob.day);

  const startY = Number(chapter.start.year);
  const startM = Number(chapter.start.month);

  // Start date = the later of date of birth and the 1st of the start month
  const firstOfStartMonth = dayNumber(startY, startM, 1);
  const startDayNum = Math.max(dobDayNum, firstOfStartMonth);

  // End date = the earlier of today and the last day of the end month. If "Still going", today.
  let endDayNum;
  if (chapter.stillGoing) {
    endDayNum = todayDayNum;
  } else {
    const endY = Number(chapter.end.year);
    const endM = Number(chapter.end.month);
    const maxDays = daysInMonth(endY, endM);
    const lastOfEndMonth = dayNumber(endY, endM, maxDays);
    endDayNum = Math.min(todayDayNum, lastOfEndMonth);
  }

  const startDot = dotIndexForDate(dobParts, startDayNum);
  const endDot = dotIndexForDate(dobParts, endDayNum);

  return {
    startDot,
    endDot,
    startDayNum,
    endDayNum
  };
}

export function getPresetChapter(presetType, dob, todayDayNum, nextColor = '--ch-1') {
  const dobParts = typeof dob === 'number' ? fromDayNumber(dob) : dob;
  const todayParts = fromDayNumber(todayDayNum);

  function isAfterThisMonth(year, month) {
    return year > todayParts.year || (year === todayParts.year && month > todayParts.month);
  }

  if (presetType === 'school') {
    const sYear = dobParts.year + 5;
    const sMonth = 6;
    const eYear = dobParts.year + 17;
    const eMonth = 3;

    return {
      name: 'School',
      color: nextColor,
      start: isAfterThisMonth(sYear, sMonth) ? { month: '', year: '' } : { month: sMonth, year: sYear },
      end: isAfterThisMonth(eYear, eMonth) ? { month: '', year: '' } : { month: eMonth, year: eYear },
      stillGoing: false
    };
  }

  if (presetType === 'college') {
    const sYear = dobParts.year + 17;
    const sMonth = 7;
    const eYear = dobParts.year + 21;
    const eMonth = 5;

    return {
      name: 'College',
      color: nextColor,
      start: isAfterThisMonth(sYear, sMonth) ? { month: '', year: '' } : { month: sMonth, year: sYear },
      end: isAfterThisMonth(eYear, eMonth) ? { month: '', year: '' } : { month: eMonth, year: eYear },
      stillGoing: false
    };
  }

  if (presetType === 'first-job') {
    return {
      name: 'First job',
      color: nextColor,
      start: { month: '', year: '' },
      end: { month: '', year: '' },
      stillGoing: true
    };
  }

  if (presetType === 'new-city') {
    return {
      name: 'New city',
      color: nextColor,
      start: { month: '', year: '' },
      end: { month: '', year: '' },
      stillGoing: true
    };
  }

  return {
    name: '',
    color: nextColor,
    start: { month: '', year: '' },
    end: { month: '', year: '' },
    stillGoing: false
  };
}

export function resolveDotChapters(chapters, totalDots, dob, todayDayNum) {
  const dotMap = new Array(totalDots).fill(null);

  // Where chapters overlap, the one lower in the list shows.
  for (const ch of chapters) {
    const validation = validateChapter(ch, dob, todayDayNum);
    if (!validation.valid) continue;

    const { startDot, endDot } = getChapterDotRange(ch, dob, todayDayNum);
    const fromIdx = Math.max(0, startDot);
    const toIdx = Math.min(totalDots - 1, endDot);

    for (let i = fromIdx; i <= toIdx; i++) {
      dotMap[i] = ch;
    }
  }

  return dotMap;
}
