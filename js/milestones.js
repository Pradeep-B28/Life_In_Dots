// Milestones and calendar generation logic for Your Life in Dots
import {
  dayNumber,
  fromDayNumber,
  getAge,
  dotIndexForDate,
  formatShortDate,
  formatNextUpDate,
  getInAboutText,
  find1000thFullMoon,
  findNextMarsBirthday
} from './dates.js';

export { createMilestonesPanel, handleCalendarAction, downloadIcsFile } from './milestones-ui.js';

export const FIXED_DAY_MILESTONES = [
  { label: '1,000 weeks old', days: 7000 },
  { label: '10,000 days old', days: 10000 },
  { label: '1 billion seconds old', days: 11574 },
  { label: '2,000 weeks old', days: 14000 },
  { label: '20,000 days old', days: 20000 },
  { label: '3,000 weeks old', days: 21000 },
  { label: '2 billion seconds old', days: 23148 },
  { label: '25,000 days old', days: 25000 },
  { label: '4,000 weeks old', days: 28000 },
  { label: '30,000 days old', days: 30000 }
];

function formatYmd(d) {
  const y = String(d.year).padStart(4, '0');
  const m = String(d.month).padStart(2, '0');
  const day = String(d.day).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function formatYmdCompact(d) {
  const y = String(d.year).padStart(4, '0');
  const m = String(d.month).padStart(2, '0');
  const day = String(d.day).padStart(2, '0');
  return `${y}${m}${day}`;
}

export function getMilestoneCalendarTitle(label) {
  if (label.startsWith('You turn ')) {
    return 'I turn ' + label.slice(9);
  }
  return 'I turn ' + label;
}

export function calculateMilestones(dob, todayDayNum, endDateDayNum = null, isBonus = false, totalDots = 4160) {
  const dobParts = typeof dob === 'number' ? fromDayNumber(dob) : dob;
  const dobDayNum = typeof dob === 'number' ? dob : dayNumber(dob.year, dob.month, dob.day);

  const rawMilestones = [];

  // 1. Fixed day milestones
  for (const item of FIXED_DAY_MILESTONES) {
    const targetDay = dobDayNum + item.days;
    rawMilestones.push({
      label: item.label,
      dayNumber: targetDay,
      type: 'fixed'
    });
  }

  // 2. 1,000th full moon
  const moon1000Day = find1000thFullMoon(dobDayNum);
  rawMilestones.push({
    label: '1,000th full moon',
    dayNumber: moon1000Day,
    type: 'moon'
  });

  // 3. Next Mars birthday
  const marsInfo = findNextMarsBirthday(dobDayNum, todayDayNum);
  rawMilestones.push({
    label: `You turn ${marsInfo.n} on Mars`,
    dayNumber: marsInfo.targetDay,
    type: 'mars'
  });

  // Sort all milestones chronologically
  rawMilestones.sort((a, b) => a.dayNumber - b.dayNumber);

  // Find the earliest milestone strictly after today for bonus mode
  let earliestFutureDay = null;
  if (isBonus) {
    for (const m of rawMilestones) {
      if (m.dayNumber > todayDayNum) {
        earliestFutureDay = m.dayNumber;
        break;
      }
    }
  }

  const milestones = rawMilestones.map(m => {
    const parts = fromDayNumber(m.dayNumber);
    const dateStr = formatYmd(parts);
    const formattedDate = formatShortDate(parts);
    const formattedNextUp = formatNextUpDate(m.dayNumber);
    const age = getAge(dobParts, m.dayNumber);
    const dotIndex = dotIndexForDate(dobParts, m.dayNumber);

    let status;
    if (m.dayNumber < todayDayNum) {
      status = 'done';
    } else if (m.dayNumber === todayDayNum) {
      status = 'today';
    } else {
      if (isBonus) {
        status = (m.dayNumber === earliestFutureDay) ? 'ahead' : 'hidden';
      } else {
        status = (endDateDayNum !== null && m.dayNumber < endDateDayNum) ? 'ahead' : 'hidden';
      }
    }

    const inAbout = (status === 'ahead') ? getInAboutText(m.dayNumber - todayDayNum) : '';
    const hasMarker = (status !== 'hidden') && (dotIndex < totalDots);

    return {
      ...m,
      date: parts,
      dateStr,
      formattedDate,
      formattedNextUp,
      age,
      dotIndex,
      status,
      inAbout,
      hasMarker
    };
  });

  const nextUp = milestones.find(m => m.status === 'ahead') || null;

  return {
    milestones,
    nextUp
  };
}

export function buildIcsCalendarFile(milestone, siteUrl = 'https://wrench-wise.com') {
  const parts = milestone.date || fromDayNumber(milestone.dayNumber);
  const nextDayParts = fromDayNumber(milestone.dayNumber + 1);

  const dtstart = formatYmdCompact(parts);
  const dtend = formatYmdCompact(nextDayParts);
  const summary = getMilestoneCalendarTitle(milestone.label);
  const description = `Found with Your Life in Dots by Wrench Wise. ${siteUrl}`;

  const now = new Date();
  const dtstamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const uid = Math.random().toString(36).substring(2, 10) + '@life-in-dots';

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wrench Wise//Life in Dots//EN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;VALUE=DATE:${dtstart}`,
    `DTEND;VALUE=DATE:${dtend}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ];

  return lines.join('\r\n') + '\r\n';
}

export function buildGoogleCalendarUrl(milestone, siteUrl = 'https://wrench-wise.com') {
  const parts = milestone.date || fromDayNumber(milestone.dayNumber);
  const nextDayParts = fromDayNumber(milestone.dayNumber + 1);

  const dtstart = formatYmdCompact(parts);
  const dtend = formatYmdCompact(nextDayParts);
  const title = getMilestoneCalendarTitle(milestone.label);
  const description = `Found with Your Life in Dots by Wrench Wise. ${siteUrl}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${dtstart}/${dtend}&details=${encodeURIComponent(description)}`;
}
