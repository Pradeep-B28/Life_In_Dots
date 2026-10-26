// Demo mode loop for recording reels (?demo=1)
import { validateDate, getToday } from './dates.js';

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function parseDemoParams(searchParams) {
  let dob = { year: 2004, month: 6, day: 12 };
  let life = 80;
  let customToday = null;

  const todayStr = searchParams.get('today');
  if (todayStr) {
    const parts = todayStr.split('-').map(Number);
    if (parts.length === 3 && !parts.some(isNaN)) {
      const valid = validateDate(parts[0], parts[1], parts[2]);
      if (valid.valid) customToday = todayStr;
    }
  }

  const dobStr = searchParams.get('dob');
  if (dobStr) {
    const parts = dobStr.split('-').map(Number);
    if (parts.length === 3 && !parts.some(isNaN)) {
      const todayDayNum = getToday(customToday);
      const valid = validateDate(parts[0], parts[1], parts[2], todayDayNum);
      if (valid.valid) {
        dob = { year: parts[0], month: parts[1], day: parts[2] };
      }
    }
  }

  const lifeStr = searchParams.get('life');
  if (lifeStr) {
    const l = Number(lifeStr);
    if ([70, 80, 90, 100].includes(l)) life = l;
  }

  return { dob, life, customToday };
}

export function startDemoMode(container, userFlowOptions) {
  let isRunning = true;

  // Create tap dot
  let tapDot = document.querySelector('.demo-tap-dot');
  if (!tapDot) {
    tapDot = document.createElement('div');
    tapDot.className = 'demo-tap-dot';
    document.body.appendChild(tapDot);
  }

  async function moveAndTap(element, actionCallback = null) {
    if (!isRunning || !element) return;
    const rect = element.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    tapDot.style.left = `${cx}px`;
    tapDot.style.top = `${cy}px`;
    tapDot.style.opacity = '1';

    await wait(300);
    if (!isRunning) return;

    tapDot.classList.add('pressed');
    element.classList.add('demo-highlight');

    if (actionCallback) actionCallback();

    await wait(200);
    tapDot.classList.remove('pressed');
    await wait(150);
    element.classList.remove('demo-highlight');
  }

  async function runDemoCycle() {
    while (isRunning) {
      window.scrollTo({ top: 0, behavior: 'instant' });

      // 1. Show home card
      const { dob, life, customToday } = parseDemoParams(new URLSearchParams(window.location.search));
      const flow = userFlowOptions.runUserFlow(container, { dob: { year: '', month: '', day: '' }, lifePicked: 80 }, {
        customToday
      });

      await wait(600);
      if (!isRunning) break;

      const daySelect = container.querySelector('.day-select');
      const monthSelect = container.querySelector('.month-select');
      const yearSelect = container.querySelector('.year-select');
      const submitBtn = container.querySelector('.home-card .primary-btn');

      // 2. Tap Day -> value changes to dob.day
      if (daySelect) {
        await moveAndTap(daySelect, () => {
          daySelect.value = String(dob.day);
          daySelect.dispatchEvent(new Event('change', { bubbles: true }));
        });
      }
      await wait(500);
      if (!isRunning) break;

      // Tap Month -> value changes to dob.month
      if (monthSelect) {
        await moveAndTap(monthSelect, () => {
          monthSelect.value = String(dob.month);
          monthSelect.dispatchEvent(new Event('change', { bubbles: true }));
        });
      }
      await wait(500);
      if (!isRunning) break;

      // Tap Year -> value changes to dob.year
      if (yearSelect) {
        await moveAndTap(yearSelect, () => {
          yearSelect.value = String(dob.year);
          yearSelect.dispatchEvent(new Event('change', { bubbles: true }));
        });
      }
      await wait(500);
      if (!isRunning) break;

      // 3. Tap chosen life pill button
      const lifeBtns = Array.from(container.querySelectorAll('.life-pill-btn'));
      const targetLifeBtn = lifeBtns.find(b => b.textContent.includes(String(life))) || lifeBtns[1];
      if (targetLifeBtn) {
        await moveAndTap(targetLifeBtn, () => {
          targetLifeBtn.click();
        });
      }
      await wait(500);
      if (!isRunning) break;

      // Tap "Show my life"
      if (submitBtn) {
        await moveAndTap(submitBtn, () => {
          submitBtn.click();
        });
      }
      await wait(300);
      tapDot.style.opacity = '0';

      // 4. Wait for the full reveal sequence to play (~8.5 seconds)
      await wait(8600);
      if (!isRunning) break;

      // 5. Hold for 4 seconds
      await wait(4000);
      if (!isRunning) break;

      // On phone, scroll down to stat cards and hold 4 seconds
      const statCards = container.querySelector('.stat-cards-wrap');
      if (statCards && window.innerWidth < 900) {
        statCards.scrollIntoView({ behavior: 'smooth', block: 'start' });
        await wait(4000);
        if (!isRunning) break;
      } else {
        await wait(2000);
        if (!isRunning) break;
      }

      // Then scroll down to closing card and hold 3 seconds
      const closingCard = container.querySelector('.closing-card');
      if (closingCard) {
        closingCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await wait(3000);
        if (!isRunning) break;
      }

      // 6. Scroll back to top and restart
      window.scrollTo({ top: 0, behavior: 'smooth' });
      await wait(1200);
    }
  }

  runDemoCycle();

  return {
    stop: () => {
      isRunning = false;
      if (tapDot && tapDot.parentNode) tapDot.parentNode.removeChild(tapDot);
    }
  };
}
