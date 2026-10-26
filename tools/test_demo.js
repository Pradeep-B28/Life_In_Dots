// Verification test for Demo Mode (?demo=1)
import http from 'http';
import { spawn } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = process.env.TEMP + '\\chrome_demo_test';
const port = 9333;

const chromeProc = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=' + port,
  '--user-data-dir=' + userDataDir,
  '--disable-gpu',
  '--window-size=390,844',
  'http://localhost:8000/?demo=1'
]);

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  await wait(2000);
  const targets = await fetchJSON(`http://127.0.0.1:${port}/json`);
  const page = targets.find(t => t.type === 'page');
  if (!page) {
    console.error('No page target found');
    chromeProc.kill();
    process.exit(1);
  }

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));

  let msgId = 1;
  const sendCDP = (method, params = {}) => {
    return new Promise((resolve) => {
      const curId = msgId++;
      const onMsg = (event) => {
        try {
          const res = JSON.parse(event.data);
          if (res.id === curId) {
            ws.removeEventListener('message', onMsg);
            resolve(res.result);
          }
        } catch (e) {}
      };
      ws.addEventListener('message', onMsg);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  };

  const evalExpr = async (expr) => {
    const res = await sendCDP('Runtime.evaluate', { expression: expr, returnByValue: true });
    return res && res.result ? res.result.value : null;
  };

  console.log('Monitoring Demo Mode loop...');

  // 1. Initial state
  let dayVal = await evalExpr('document.querySelector(".day-select") ? document.querySelector(".day-select").value : null');
  console.log('Initial day select value:', dayVal);

  // Wait 3s for tap dot to fill Day, Month, Year, Life, and submit
  await wait(3500);
  const filledDay = await evalExpr('document.querySelector(".day-select") ? document.querySelector(".day-select").value : null');
  const filledMonth = await evalExpr('document.querySelector(".month-select") ? document.querySelector(".month-select").value : null');
  const filledYear = await evalExpr('document.querySelector(".year-select") ? document.querySelector(".year-select").value : null');
  console.log(`Filled values - Day: ${filledDay}, Month: ${filledMonth}, Year: ${filledYear}`);

  // Wait for reveal
  await wait(5000);
  const resultDisplay = await evalExpr('document.querySelector(".result-section") ? document.querySelector(".result-section").style.display : null');
  const headlineText = await evalExpr('document.querySelector(".reveal-headline") ? document.querySelector(".reveal-headline").textContent : null');
  console.log('Result section display:', resultDisplay, '| Headline:', headlineText);

  // Wait for reveal sequence to finish and cards to show
  await wait(6000);
  const statCardsCount = await evalExpr('document.querySelectorAll(".stat-card").length');
  console.log('Stat cards visible count:', statCardsCount);

  // Wait for hold and loop reset (demo holds 4s on stats, 3s on closing, then resets to top)
  console.log('Waiting for demo cycle loop reset...');
  await wait(11000);
  const homeCardDisplay = await evalExpr('document.querySelector(".home-card") ? document.querySelector(".home-card").style.display : null');
  console.log('Home card visible after loop reset:', homeCardDisplay !== 'none');

  const success = (filledDay === '12' && filledMonth === '6' && filledYear === '2004' && statCardsCount === 8 && homeCardDisplay !== 'none');
  console.log('Demo mode verification result:', success ? 'PASS' : 'FAIL');

  ws.close();
  chromeProc.kill();
  process.exit(success ? 0 : 1);
}

run().catch((err) => {
  console.error(err);
  chromeProc.kill();
  process.exit(1);
});
