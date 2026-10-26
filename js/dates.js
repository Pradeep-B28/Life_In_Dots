// Date mathematics for Your Life in Dots
// All calculations use integer day numbers since 1 Jan 1970 UTC.
// No Date("YYYY-MM-DD") or local-time arithmetic to avoid off-by-one errors.

const SECONDS_IN_DAY = 86400000;
const FULL_MOON_PERIOD = 29.530588853; // Average lunar synodic period in days

export function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

export function daysInMonth(year, month) {
  if (month < 1 || month > 12) return 0;
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  }
  if (month === 4 || month === 6 || month === 9 || month === 11) {
    return 30;
  }
  return 31;
}

export function dayNumber(year, month, day) {
  return Date.UTC(year, month - 1, day) / SECONDS_IN_DAY;
}

export const FULL_MOON_REF = dayNumber(2025, 1, 13) + 1347 / 1440;

export function fromDayNumber(dayNum) {
  const d = new Date(dayNum * SECONDS_IN_DAY);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate()
  };
}

export function getToday(overrideStr = null) {
  if (overrideStr) {
    const parts = overrideStr.split('-').map(Number);
    if (parts.length === 3 && !parts.some(isNaN)) {
      return dayNumber(parts[0], parts[1], parts[2]);
    }
  }
  const now = new Date();
  return dayNumber(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

export function addYears(date, n) {
  const newYear = date.year + n;
  let newDay = date.day;
  if (date.month === 2 && date.day === 29 && !isLeapYear(newYear)) {
    newDay = 28;
  }
  return {
    year: newYear,
    month: date.month,
    day: newDay
  };
}

export function getAge(dob, todayDayNum) {
  const todayParts = fromDayNumber(todayDayNum);
  let age = Math.max(0, todayParts.year - dob.year - 1);
  while (true) {
    const nextBirthday = addYears(dob, age + 1);
    const nextBdayDay = dayNumber(nextBirthday.year, nextBirthday.month, nextBirthday.day);
    if (nextBdayDay <= todayDayNum) {
      age++;
    } else {
      break;
    }
  }
  return age;
}

export function resolveLife(age, lifePicked) {
  let lifeUsed = lifePicked;
  let movedUp = false;
  let isBonus = false;

  if (age >= lifeUsed) {
    const options = [70, 80, 90, 100];
    const bigger = options.filter(opt => opt > age);
    if (bigger.length > 0) {
      lifeUsed = bigger[0];
      movedUp = true;
    } else {
      isBonus = true;
      lifeUsed = null;
    }
  }

  const rows = isBonus ? (age + 1) : lifeUsed;
  return { lifeUsed, movedUp, isBonus, rows };
}

export function getGridPosition(dob, age, rows, todayDayNum) {
  const bdayThisAge = addYears(dob, age);
  const bdayThisAgeDay = dayNumber(bdayThisAge.year, bdayThisAge.month, bdayThisAge.day);
  const daysSinceBirthday = todayDayNum - bdayThisAgeDay;
  const weekIndex = Math.min(51, Math.floor(daysSinceBirthday / 7));
  const livedDots = age * 52 + weekIndex;
  const totalDots = rows * 52;

  return {
    currentRow: age,
    weekIndex,
    livedDots,
    totalDots
  };
}

export function isSunday(dayNum) {
  return ((dayNum % 7) + 7) % 7 === 3;
}

export function countSundays(startDay, endDay) {
  if (startDay > endDay) return 0;
  const length = endDay - startDay + 1;
  const rem = ((startDay % 7) + 7) % 7;
  const distance = (3 - rem + 7) % 7;
  if (distance >= length) return 0;
  return 1 + Math.floor((length - 1 - distance) / 7);
}

export function countPongals(todayDay, endDay, startYear, endYear) {
  let count = 0;
  for (let y = startYear; y <= endYear + 1; y++) {
    const pDay = dayNumber(y, 1, 14);
    if (pDay > todayDay && pDay <= endDay) {
      count++;
    }
  }
  return count;
}

export function countWorldCups(todayDay, endDay, endYear) {
  let count = 0;
  for (let y = 2027; y <= endYear + 4; y += 4) {
    const wcDay = dayNumber(y, 10, 1);
    if (wcDay > todayDay && wcDay <= endDay) {
      count++;
    }
  }
  return count;
}

export function countFullMoons(startDay, endDay) {
  if (startDay > endDay) return 0;
  const kMin = Math.ceil((startDay - FULL_MOON_REF) / FULL_MOON_PERIOD);
  const kMax = Math.ceil((endDay + 1 - FULL_MOON_REF) / FULL_MOON_PERIOD) - 1;
  if (kMin > kMax) return 0;
  return kMax - kMin + 1;
}

export function validateDate(year, month, day, todayDayNum) {
  if (year === null || year === undefined || year === '' ||
      month === null || month === undefined || month === '' ||
      day === null || day === undefined || day === '') {
    return { valid: false, error: 'Please pick your full date of birth.' };
  }

  const y = Number(year);
  const m = Number(month);
  const d = Number(day);

  if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d) || m < 1 || m > 12) {
    return { valid: false, error: 'Please pick your full date of birth.' };
  }

  const maxDays = daysInMonth(y, m);
  if (d < 1 || d > maxDays) {
    return { valid: false, error: 'That date does not exist. Please check the day.' };
  }

  const enteredDayNum = dayNumber(y, m, d);
  if (enteredDayNum > todayDayNum) {
    return { valid: false, error: 'That date is in the future.' };
  }

  return {
    valid: true,
    error: null,
    date: { year: y, month: m, day: d },
    dayNumber: enteredDayNum
  };
}

export function dotIndexForDate(dob, dateInput) {
  const dobParts = typeof dob === 'number' ? fromDayNumber(dob) : dob;
  const dobDay = typeof dob === 'number' ? dob : dayNumber(dob.year, dob.month, dob.day);

  let targetDay;
  if (typeof dateInput === 'number') {
    targetDay = dateInput;
  } else if (typeof dateInput === 'string') {
    const [y, m, d] = dateInput.split('-').map(Number);
    targetDay = dayNumber(y, m, d);
  } else {
    targetDay = dayNumber(dateInput.year, dateInput.month, dateInput.day);
  }

  if (targetDay < dobDay) return 0;

  const age = getAge(dobParts, targetDay);
  const bdayThisAge = addYears(dobParts, age);
  const bdayDay = dayNumber(bdayThisAge.year, bdayThisAge.month, bdayThisAge.day);
  const daysSinceBday = targetDay - bdayDay;
  const week = Math.min(51, Math.floor(daysSinceBday / 7));
  return age * 52 + week;
}

export function getAheadDots(totalDots, livedDots, isBonus = false) {
  if (isBonus) return 0;
  return Math.max(0, totalDots - livedDots - 1);
}

const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const SHORT_WEEKDAYS = ['Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed']; // 1 Jan 1970 was Thursday

export function formatShortDate(dateInput) {
  let parts;
  if (typeof dateInput === 'number') {
    parts = fromDayNumber(dateInput);
  } else if (typeof dateInput === 'string') {
    const [y, m, d] = dateInput.split('-').map(Number);
    parts = { year: y, month: m, day: d };
  } else {
    parts = dateInput;
  }
  const monthStr = SHORT_MONTHS[parts.month - 1];
  return `${parts.day} ${monthStr} ${parts.year}`;
}

export function formatNextUpDate(dateInput) {
  let dayNum;
  let parts;
  if (typeof dateInput === 'number') {
    dayNum = dateInput;
    parts = fromDayNumber(dayNum);
  } else if (typeof dateInput === 'string') {
    const [y, m, d] = dateInput.split('-').map(Number);
    parts = { year: y, month: m, day: d };
    dayNum = dayNumber(y, m, d);
  } else {
    parts = dateInput;
    dayNum = dayNumber(parts.year, parts.month, parts.day);
  }
  const weekdayIndex = ((dayNum % 7) + 7) % 7;
  const weekdayStr = SHORT_WEEKDAYS[weekdayIndex];
  const monthStr = SHORT_MONTHS[parts.month - 1];
  return `${weekdayStr}, ${parts.day} ${monthStr} ${parts.year}`;
}

export function getInAboutText(daysAhead) {
  if (daysAhead < 60) {
    return `in ${daysAhead} days`;
  }
  if (daysAhead < 730) {
    const m = Math.round(daysAhead / 30.44);
    return `in about ${m} months`;
  }
  const y = Math.round(daysAhead / 365.25);
  return `in about ${y} years`;
}

export function find1000thFullMoon(dobDayNum) {
  let k = Math.ceil((dobDayNum - FULL_MOON_REF) / FULL_MOON_PERIOD) - 2;
  while (Math.floor(FULL_MOON_REF + k * FULL_MOON_PERIOD) < dobDayNum) {
    k++;
  }
  const targetK = k + 999;
  return Math.floor(FULL_MOON_REF + targetK * FULL_MOON_PERIOD);
}

export function findNextMarsBirthday(dobDayNum, todayDayNum) {
  let n = 1;
  while (dobDayNum + Math.floor(n * 686.98) <= todayDayNum) {
    n++;
  }
  const targetDay = dobDayNum + Math.floor(n * 686.98);
  return { n, targetDay };
}

