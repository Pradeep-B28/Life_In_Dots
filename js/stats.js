// Generates life statistics and numbers for stat cards
import {
  dayNumber,
  fromDayNumber,
  addYears,
  getAge,
  resolveLife,
  getGridPosition,
  countSundays,
  countPongals,
  countWorldCups,
  countFullMoons
} from './dates.js';

export function formatNumber(n) {
  if (typeof n !== 'number' || isNaN(n)) return '0';
  return n.toLocaleString('en-IN');
}

export function formatHeartbeats(daysLived) {
  const heartbeats = daysLived * 1440 * 72;
  if (heartbeats >= 1e9) {
    return 'about ' + (heartbeats / 1e9).toFixed(2) + ' billion';
  }
  if (heartbeats >= 1e6) {
    return 'about ' + Math.round(heartbeats / 1e6) + ' million';
  }
  return String(heartbeats);
}

export function calculateLifeStats(dob, lifePicked, todayDayNum) {
  const dobDayNum = dayNumber(dob.year, dob.month, dob.day);
  const todayParts = fromDayNumber(todayDayNum);
  const daysLived = todayDayNum - dobDayNum;
  const weeksLived = Math.floor(daysLived / 7);
  const age = getAge(dob, todayDayNum);

  const lifeResolution = resolveLife(age, lifePicked);
  const grid = getGridPosition(dob, age, lifeResolution.rows, todayDayNum);

  const fullMoonsSeen = countFullMoons(dobDayNum, todayDayNum);
  const heartbeats = daysLived * 1440 * 72;
  const heartbeatsText = formatHeartbeats(daysLived);

  const soFar = {
    daysLived,
    weeksLived,
    fullMoonsSeen,
    heartbeats,
    heartbeatsText
  };

  let ahead = null;
  if (!lifeResolution.isBonus) {
    const endDate = addYears(dob, lifeResolution.lifeUsed);
    const endDayNum = dayNumber(endDate.year, endDate.month, endDate.day);
    const sundays = countSundays(todayDayNum + 1, endDayNum);
    const pongals = countPongals(todayDayNum, endDayNum, todayParts.year, endDate.year);
    const worldCups = countWorldCups(todayDayNum, endDayNum, endDate.year);
    const fullMoonsAhead = countFullMoons(todayDayNum + 1, endDayNum);

    ahead = {
      endDate,
      endDayNum,
      sundays,
      pongals,
      worldCups,
      fullMoonsAhead
    };
  }

  return {
    dob,
    dobDayNum,
    todayDayNum,
    daysLived,
    weeksLived,
    age,
    lifePicked,
    lifeUsed: lifeResolution.lifeUsed,
    movedUp: lifeResolution.movedUp,
    isBonus: lifeResolution.isBonus,
    rows: lifeResolution.rows,
    currentRow: grid.currentRow,
    weekIndex: grid.weekIndex,
    livedDots: grid.livedDots,
    totalDots: grid.totalDots,
    soFar,
    ahead
  };
}
