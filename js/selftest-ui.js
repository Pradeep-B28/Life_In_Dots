// DOM Renderer for Self-Test report UI (?test=1)

function createCell(text, className = '') {
  const td = document.createElement('td');
  td.textContent = text;
  if (className) td.className = className;
  return td;
}

function renderSectionTable(suite, title, headers, rowData) {
  const h3 = document.createElement('h3');
  h3.textContent = title;
  suite.appendChild(h3);

  const wrap = document.createElement('div');
  wrap.className = 'test-table-wrapper';
  const table = document.createElement('table');
  table.className = 'test-table';

  const thead = document.createElement('thead');
  const trH = document.createElement('tr');
  headers.forEach(h => {
    const th = document.createElement('th');
    th.textContent = h;
    trH.appendChild(th);
  });
  thead.appendChild(trH);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  rowData.forEach(r => {
    const tr = document.createElement('tr');
    r.cells.forEach(c => tr.appendChild(createCell(c.text, c.className || '')));
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  wrap.appendChild(table);
  suite.appendChild(wrap);
}

export function renderSelfTestUI(results, container) {
  if (!container) return;
  container.textContent = '';

  const suite = document.createElement('div');
  suite.className = 'test-suite';

  const header = document.createElement('div');
  header.className = 'test-header';

  const titleWrap = document.createElement('div');
  const h2 = document.createElement('h2');
  h2.textContent = 'Self-Test Report (v2)';
  const subtitle = document.createElement('p');
  subtitle.style.fontSize = '0.8125rem';
  subtitle.style.color = 'var(--muted)';
  subtitle.textContent = `Fixed today date: ${results.todayStr}`;
  titleWrap.appendChild(h2);
  titleWrap.appendChild(subtitle);

  const badgeWrap = document.createElement('div');
  const badge = document.createElement('span');
  badge.className = `test-badge ${results.allPassed ? 'pass' : 'fail'}`;
  badge.textContent = results.allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED';
  badgeWrap.appendChild(badge);

  header.appendChild(titleWrap);
  header.appendChild(badgeWrap);
  suite.appendChild(header);

  // 1. So Far Table (v1)
  const soFarRows = results.soFarResults.map(r => ({
    cells: [
      { text: r.Case },
      { text: r.DOB },
      { text: String(r.LifePicked) },
      { text: r.LifeUsed },
      { text: String(r.DaysLived) },
      { text: String(r.WeeksLived) },
      { text: String(r.Age) },
      { text: String(r.WeekIdx) },
      { text: String(r.LivedDots) },
      { text: String(r.TotalDots) },
      { text: String(r.MoonsSeen) },
      { text: r.Heartbeats },
      { text: r.Status, className: r.Status.toLowerCase() }
    ]
  }));
  renderSectionTable(suite, '1. So Far Verification (Cases A to G)',
    ['Case', 'DOB', 'Life Picked', 'Life Used', 'Days', 'Weeks', 'Age', 'Week Idx', 'Lived Dots', 'Total Dots', 'Moons', 'Heartbeats', 'Status'],
    soFarRows
  );

  // 2. Ahead Table (v1)
  const aheadRows = results.aheadResults.map(r => ({
    cells: [
      { text: r.Case },
      { text: r.EndDate },
      { text: String(r.Sundays) },
      { text: String(r.Pongal) },
      { text: String(r.WorldCups) },
      { text: String(r.FullMoons) },
      { text: r.Status, className: r.Status.toLowerCase() }
    ]
  }));
  renderSectionTable(suite, '2. Ahead Verification (Cases A to F)',
    ['Case', 'End Date', 'Sundays', 'Pongal', 'World Cups', 'Full Moons', 'Status'],
    aheadRows
  );

  // 3. Validation, Sunday, Hit Testing & Privacy (v1)
  const otherRows = results.otherResults.map(r => ({
    cells: [
      { text: r.Test },
      { text: r.Status, className: r.Status.toLowerCase() }
    ]
  }));
  renderSectionTable(suite, '3. Validation, Sunday, Hit Testing & Privacy Checks',
    ['Test Description', 'Status'],
    otherRows
  );

  // 4. History & Flashback (v2 Section 7A)
  if (results.historyResults) {
    const histRows = results.historyResults.map(r => ({
      cells: [
        { text: r.Case },
        { text: r.Lived },
        { text: r.Before },
        { text: r.Picks },
        { text: r.Status, className: r.Status.toLowerCase() }
      ]
    }));
    renderSectionTable(suite, '4. History & Flashback Checks (v2 Section 7A)',
      ['Case', 'Lived Events', 'Before Birth', 'Flashback Picks / Sentence', 'Status'],
      histRows
    );
  }

  // 5. Milestones (v2 Section 7B)
  if (results.milestoneResults) {
    const mileRows = results.milestoneResults.map(r => ({
      cells: [
        { text: r.Label },
        { text: r.Date },
        { text: String(r.Age) },
        { text: r.Status },
        { text: r.Dot >= 0 ? String(r.Dot) : '-' },
        { text: r.InAbout },
        { text: r.Result, className: r.Result.toLowerCase() }
      ]
    }));
    renderSectionTable(suite, '5. Milestones Checks (v2 Section 7B)',
      ['Label', 'Date', 'Age', 'Status', 'Dot Index', 'In About', 'Status'],
      mileRows
    );
  }

  // 6. Time Split (v2 Section 7C)
  if (results.timeSplitResults) {
    const timeRows = results.timeSplitResults.map(r => ({
      cells: [
        { text: r.Case },
        { text: r.H },
        { text: r.Weeks },
        { text: String(r.LearningHours) },
        { text: r.Status, className: r.Status.toLowerCase() }
      ]
    }));
    renderSectionTable(suite, '6. Time Split Checks (v2 Section 7C)',
      ['Case', 'H (Weeks)', 'Weeks Split', 'Learning Hours', 'Status'],
      timeRows
    );
  }

  // 7. Chapters (v2 Section 7D)
  if (results.chapterResults) {
    const chapRows = results.chapterResults.map(r => ({
      cells: [
        { text: r.Check },
        { text: r.Dots },
        { text: r.Status, className: r.Status.toLowerCase() }
      ]
    }));
    renderSectionTable(suite, '7. Chapters Checks (v2 Section 7D)',
      ['Check / Preset / Validation', 'Dot Range / Error Text', 'Status'],
      chapRows
    );
  }

  container.appendChild(suite);
}
