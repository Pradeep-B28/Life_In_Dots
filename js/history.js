// History and flashback data logic for Your Life in Dots
import { HISTORY_EVENTS, HISTORY_FILTERS } from './history-data.js';
import { dayNumber, fromDayNumber, getAge, dotIndexForDate } from './dates.js';

export { HISTORY_EVENTS, HISTORY_FILTERS };

export function parseYmdToDayNumber(ymdStr) {
  const [y, m, d] = ymdStr.split('-').map(Number);
  return dayNumber(y, m, d);
}

export function getFlashbackSentence(event, age, forShare = false) {
  const prefix = forShare
    ? (age === 0 ? 'I was a baby' : `I was ${age}`)
    : (age === 0 ? 'You were a baby' : `You were ${age}`);
  return `${prefix} when ${event.when}.`;
}

export function getHistoryData(dob, todayDayNum) {
  const dobParts = typeof dob === 'number' ? fromDayNumber(dob) : dob;
  const dobDayNum = typeof dob === 'number' ? dob : dayNumber(dob.year, dob.month, dob.day);

  const livedEvents = [];
  const beforeBirthEvents = [];

  for (const ev of HISTORY_EVENTS) {
    const evDayNum = parseYmdToDayNumber(ev.date);
    if (evDayNum < dobDayNum) {
      beforeBirthEvents.push({
        ...ev,
        dayNumber: evDayNum
      });
    } else if (evDayNum <= todayDayNum) {
      const age = getAge(dobParts, evDayNum);
      const dotIndex = dotIndexForDate(dobParts, evDayNum);
      const sentence = getFlashbackSentence(ev, age, false);
      livedEvents.push({
        ...ev,
        dayNumber: evDayNum,
        age,
        dotIndex,
        sentence
      });
    }
  }

  // Sort lived events and before-birth events in chronological order (oldest first)
  livedEvents.sort((a, b) => a.dayNumber - b.dayNumber);
  beforeBirthEvents.sort((a, b) => a.dayNumber - b.dayNumber);

  return {
    livedEvents,
    beforeBirthEvents,
    livedCount: livedEvents.length,
    beforeBirthCount: beforeBirthEvents.length
  };
}

export function getFlashbackPicks(dob, todayDayNum) {
  const { livedEvents } = getHistoryData(dob, todayDayNum);
  if (livedEvents.length === 0) {
    return [];
  }

  // Candidates: age >= 5. If fewer than 3, fallback to all lived events
  const age5Plus = livedEvents.filter(ev => ev.age >= 5);
  const candidates = age5Plus.length >= 3 ? age5Plus : [...livedEvents];

  // Sort by rank (lowest rank number first)
  const sortedByRank = [...candidates].sort((a, b) => a.rank - b.rank);

  // Pick up to 3 events, skipping cricket if we already have 2 cricket events
  const picks = [];
  let cricketCount = 0;

  for (const ev of sortedByRank) {
    if (picks.length >= 3) break;
    const isCricket = ev.cat === 'cricket';
    if (isCricket && cricketCount >= 2) {
      continue;
    }
    picks.push(ev);
    if (isCricket) cricketCount++;
  }

  // Return picks in date order (oldest first)
  picks.sort((a, b) => a.dayNumber - b.dayNumber);
  return picks;
}
