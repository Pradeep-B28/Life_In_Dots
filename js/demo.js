// Demo mode loop for recording reels (?demo=1) - Section 4K
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

  function getTabButton(viewName) {
    const isLaptop = window.innerWidth >= 900;
    if (isLaptop) {
      return document.querySelector(`.laptop-tab-btn[data-view="${viewName}"]`);
    }
    return document.querySelector(`.bottom-tab-bar .tab-btn[data-view="${viewName}"]`);
  }

  async function runDemoCycle() {
    while (isRunning) {
      window.scrollTo({ top: 0, behavior: 'instant' });

      // 1. Show home card
      const { dob, life, customToday } = parseDemoParams(new URLSearchParams(window.location.search));
      userFlowOptions.runUserFlow(container, { dob: { year: '', month: '', day: '' }, lifePicked: 80 }, {
        customToday
      });

      await wait(600);
      if (!isRunning) break;

      const daySelect = container.querySelector('.day-select');
      const monthSelect = container.querySelector('.month-select');
      const yearSelect = container.querySelector('.year-select');
      const submitBtn = container.querySelector('.home-card .primary-btn');

      // 2. Form entry
      if (daySelect) {
        await moveAndTap(daySelect, () => {
          daySelect.value = String(dob.day);
          daySelect.dispatchEvent(new Event('change', { bubbles: true }));
        });
      }
      await wait(450);
      if (!isRunning) break;

      if (monthSelect) {
        await moveAndTap(monthSelect, () => {
          monthSelect.value = String(dob.month);
          monthSelect.dispatchEvent(new Event('change', { bubbles: true }));
        });
      }
      await wait(450);
      if (!isRunning) break;

      if (yearSelect) {
        await moveAndTap(yearSelect, () => {
          yearSelect.value = String(dob.year);
          yearSelect.dispatchEvent(new Event('change', { bubbles: true }));
        });
      }
      await wait(450);
      if (!isRunning) break;

      // Tap chosen life pill button
      const lifeBtns = Array.from(container.querySelectorAll('.life-pill-btn'));
      const targetLifeBtn = lifeBtns.find(b => b.textContent.includes(String(life))) || lifeBtns[1];
      if (targetLifeBtn) {
        await moveAndTap(targetLifeBtn, () => {
          targetLifeBtn.click();
        });
      }
      await wait(450);
      if (!isRunning) break;

      // Tap "Show my life"
      if (submitBtn) {
        await moveAndTap(submitBtn, () => {
          submitBtn.click();
        });
      }
      await wait(300);
      tapDot.style.opacity = '0';

      // 3. Full reveal animation (~8.5s) + hold (1.5s)
      await wait(10000);
      if (!isRunning) break;

      // 4. Tab Tour (UPGRADE_BRIEF.md Section 4K)
      // Step 1: History, 4 s -> tap 2011 World Cup row
      const histBtn = getTabButton('history');
      if (histBtn) {
        await moveAndTap(histBtn, () => histBtn.click());
      }
      await wait(600);
      if (!isRunning) break;

      const wcRow = Array.from(document.querySelectorAll('.history-item')).find(it =>
        it.textContent.includes('2011') || it.textContent.includes('Cricket World Cup')
      );
      if (wcRow) {
        await moveAndTap(wcRow, () => wcRow.click());
      }
      await wait(2800);
      if (!isRunning) break;

      // Step 2: Chapters, 6 s -> tap School, College and First job chips (1.5 s apart)
      const chapBtn = getTabButton('chapters');
      if (chapBtn) {
        await moveAndTap(chapBtn, () => chapBtn.click());
      }
      await wait(800);
      if (!isRunning) break;

      const schoolChip = document.querySelector('.ch-preset-chip[data-preset="school"]');
      if (schoolChip) {
        await moveAndTap(schoolChip, () => schoolChip.click());
      }
      await wait(1500);
      if (!isRunning) break;

      const collegeChip = document.querySelector('.ch-preset-chip[data-preset="college"]');
      if (collegeChip) {
        await moveAndTap(collegeChip, () => collegeChip.click());
      }
      await wait(1500);
      if (!isRunning) break;

      const jobChip = document.querySelector('.ch-preset-chip[data-preset="first-job"]');
      if (jobChip) {
        await moveAndTap(jobChip, () => jobChip.click());
      }
      await wait(1500);
      if (!isRunning) break;

      // Step 3: Time, 6 s -> open on "Next 10 years", after 2 s tap "Swap 1 hour of phone for learning"
      const timeBtn = getTabButton('time');
      if (timeBtn) {
        await moveAndTap(timeBtn, () => timeBtn.click());
      }
      await wait(600);
      if (!isRunning) break;

      const tenYrPill = document.querySelector('.time-range-pill[data-range="10years"]');
      if (tenYrPill && !tenYrPill.classList.contains('active')) {
        await moveAndTap(tenYrPill, () => tenYrPill.click());
      }
      await wait(2000);
      if (!isRunning) break;

      const swapBtn = document.querySelector('.time-swap-btn');
      if (swapBtn && !swapBtn.disabled) {
        await moveAndTap(swapBtn, () => swapBtn.click());
      }
      await wait(3400);
      if (!isRunning) break;

      // Step 4: Milestones, 4 s -> open it, next-up card in view
      const msBtn = getTabButton('milestones');
      if (msBtn) {
        await moveAndTap(msBtn, () => msBtn.click());
      }
      await wait(4000);
      if (!isRunning) break;

      // Step 5: Close sheet, scroll to top, clear demo chapters, restart loop
      tapDot.style.opacity = '0';
      if (window.__currentTabs) {
        window.__currentTabs.closeSheet();
      }
      document.querySelectorAll('.ch-delete-btn').forEach(btn => btn.click());
      window.scrollTo({ top: 0, behavior: 'instant' });
      await wait(1000);
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
