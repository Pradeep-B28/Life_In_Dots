// Grid layer styling and dynamic legend management (Section 4D, 4I)
import { TIME_BUCKETS } from './timebudget.js';

export const VIEWS = {
  OVERVIEW: 'overview',
  HISTORY: 'history',
  CHAPTERS: 'chapters',
  TIME: 'time',
  MILESTONES: 'milestones'
};

export function getDotLayerStyle(dotIndex, view, context) {
  const {
    livedDots,
    currentDotIndex,
    isBonus,
    normalLivedColors = [],
    dotChapterMap = [],
    hasAnyChapters = false,
    historyEvents = [],
    activeFilter = 'all',
    timeSplit = null,
    milestones = []
  } = context;

  const isCurrent = (dotIndex === currentDotIndex);
  const isLived = (dotIndex < livedDots);
  const isAhead = (dotIndex > currentDotIndex && !isBonus);

  // Normal lived color for this row
  const row = Math.floor(dotIndex / 52);
  const baseLivedColor = normalLivedColors[row] || 'var(--brand)';

  // 1. Overview View
  if (view === VIEWS.OVERVIEW) {
    if (isCurrent) {
      return { color: 'var(--dot-now)', opacity: 1, isCurrent: true };
    }
    if (isLived) {
      if (hasAnyChapters) {
        const ch = dotChapterMap[dotIndex];
        return {
          color: ch ? `var(${ch.color})` : 'var(--dot-unassigned)',
          opacity: 1
        };
      }
      return { color: baseLivedColor, opacity: 1 };
    }
    return { color: 'var(--dot-future)', opacity: 1 };
  }

  // 2. History View
  if (view === VIEWS.HISTORY) {
    // Check if an event matches this dot
    const matchingEvents = historyEvents.filter(ev => {
      if (ev.dotIndex !== dotIndex) return false;
      if (!activeFilter || activeFilter === 'all') return true;
      if (activeFilter === 'more') {
        return ['india', 'tech', 'sport', 'world'].includes(ev.cat);
      }
      return ev.cat === activeFilter;
    });

    if (matchingEvents.length > 0) {
      return {
        color: 'var(--history)',
        opacity: 1,
        isEvent: true,
        events: matchingEvents
      };
    }

    if (isCurrent) {
      return { color: 'var(--dot-now)', opacity: 1, isCurrent: true };
    }
    if (isLived) {
      return { color: baseLivedColor, opacity: 0.3 };
    }
    return { color: 'var(--dot-future)', opacity: 0.3 };
  }

  // 3. Chapters View
  if (view === VIEWS.CHAPTERS) {
    if (isCurrent) {
      return { color: 'var(--dot-now)', opacity: 1, isCurrent: true };
    }
    if (isLived) {
      const ch = dotChapterMap[dotIndex];
      return {
        color: ch ? `var(${ch.color})` : 'var(--dot-unassigned)',
        opacity: 1,
        chapter: ch || null
      };
    }
    return { color: 'var(--dot-future)', opacity: 1 };
  }

  // 4. Time View
  if (view === VIEWS.TIME) {
    if (isCurrent) {
      return { color: 'var(--dot-now)', opacity: 1, isCurrent: true };
    }
    if (isLived) {
      return { color: baseLivedColor, opacity: 0.3 };
    }

    if (timeSplit && timeSplit.valid && timeSplit.H > 0) {
      const offset = dotIndex - (currentDotIndex + 1);
      if (offset >= 0 && offset < timeSplit.H) {
        let cumulative = 0;
        for (let b = 0; b < 6; b++) {
          cumulative += (timeSplit.weeks[b] || 0);
          if (offset < cumulative) {
            const bucket = TIME_BUCKETS[b];
            return {
              color: `var(${bucket.colorVar})`,
              opacity: 1,
              timeBucket: bucket
            };
          }
        }
      }
    }

    return { color: 'var(--dot-future)', opacity: 1 };
  }

  // 5. Milestones View
  if (view === VIEWS.MILESTONES) {
    const list = Array.isArray(milestones) ? milestones : (milestones && milestones.milestones ? milestones.milestones : []);
    const milestone = list.find(m => m.hasMarker && m.dotIndex === dotIndex);

    if (milestone) {
      return {
        color: isLived ? baseLivedColor : 'var(--dot-future)',
        opacity: 1,
        marker: {
          color: 'var(--milestone)',
          filled: (milestone.status === 'done' || milestone.status === 'today'),
          hollow: (milestone.status === 'ahead')
        },
        milestone
      };
    }

    if (isCurrent) {
      return { color: 'var(--dot-now)', opacity: 1, isCurrent: true };
    }
    if (isLived) {
      return { color: baseLivedColor, opacity: 0.3 };
    }
    return { color: 'var(--dot-future)', opacity: 0.3 };
  }

  return { color: 'var(--dot-future)', opacity: 1 };
}

export function renderLegend(container, view, context) {
  if (!container) return;
  container.textContent = '';

  const { chapters = [], hasAnyChapters = false } = context;

  function createLegendItem(colorStyle, labelText, isRing = false, isHollowRing = false) {
    const item = document.createElement('div');
    item.className = 'legend-item';

    const dot = document.createElement('span');
    dot.className = 'legend-dot';

    if (isRing) {
      dot.style.background = 'var(--milestone)';
      dot.style.boxShadow = '0 0 0 1.5px var(--surface), 0 0 0 3px var(--milestone)';
    } else if (isHollowRing) {
      dot.style.background = 'transparent';
      dot.style.border = '2px solid var(--milestone)';
    } else if (typeof colorStyle === 'string') {
      if (colorStyle.startsWith('var(') || colorStyle.startsWith('#')) {
        dot.style.background = colorStyle;
      } else {
        dot.className += ` ${colorStyle}`;
      }
    }

    const span = document.createElement('span');
    span.textContent = labelText;

    item.appendChild(dot);
    item.appendChild(span);
    return item;
  }

  if (view === VIEWS.OVERVIEW) {
    if (hasAnyChapters && chapters.length > 0) {
      for (const ch of chapters) {
        if (!ch.name) continue;
        container.appendChild(createLegendItem(`var(${ch.color})`, ch.name));
      }
    } else {
      container.appendChild(createLegendItem('lived', 'Lived'));
    }
    container.appendChild(createLegendItem('now', 'This week'));
    container.appendChild(createLegendItem('ahead', 'Ahead'));
    return;
  }

  if (view === VIEWS.HISTORY) {
    const dimDot = createLegendItem('var(--brand)', 'Normal');
    dimDot.querySelector('.legend-dot').style.opacity = '0.3';
    container.appendChild(dimDot);
    container.appendChild(createLegendItem('var(--history)', 'Event'));
    container.appendChild(createLegendItem('now', 'This week'));
    container.appendChild(createLegendItem('ahead', 'Ahead'));
    return;
  }

  if (view === VIEWS.CHAPTERS) {
    for (const ch of chapters) {
      if (!ch.name) continue;
      container.appendChild(createLegendItem(`var(${ch.color})`, ch.name));
    }
    container.appendChild(createLegendItem('var(--dot-unassigned)', 'Unassigned'));
    container.appendChild(createLegendItem('now', 'This week'));
    container.appendChild(createLegendItem('ahead', 'Ahead'));
    return;
  }

  if (view === VIEWS.TIME) {
    TIME_BUCKETS.forEach(b => {
      container.appendChild(createLegendItem(`var(${b.colorVar})`, b.label));
    });
    container.appendChild(createLegendItem('ahead', 'Ahead'));
    return;
  }

  if (view === VIEWS.MILESTONES) {
    const dimDot = createLegendItem('var(--brand)', 'Normal');
    dimDot.querySelector('.legend-dot').style.opacity = '0.3';
    container.appendChild(dimDot);
    container.appendChild(createLegendItem(null, 'Done milestone', true, false));
    container.appendChild(createLegendItem(null, 'Ahead milestone', false, true));
    container.appendChild(createLegendItem('now', 'This week'));
  }
}

export function getDotTooltipDetails(dotIndex, view, context) {
  const lines = [];
  const { dotChapterMap = [], historyEvents = [], milestones = [], timeSplit = null, currentDotIndex } = context;

  if (view === VIEWS.OVERVIEW || view === VIEWS.CHAPTERS) {
    const ch = dotChapterMap[dotIndex];
    if (ch && ch.name) {
      lines.push({ text: ch.name, color: `var(${ch.color})`, isStrong: true });
    }
  }

  if (view === VIEWS.HISTORY) {
    const eventsOnDot = historyEvents.filter(ev => ev.dotIndex === dotIndex);
    if (eventsOnDot.length > 0) {
      const titles = eventsOnDot.map(e => e.title);
      if (titles.length <= 2) {
        titles.forEach(t => lines.push({ text: t, color: 'var(--history)', isStrong: true }));
      } else {
        lines.push({ text: titles[0], color: 'var(--history)', isStrong: true });
        lines.push({ text: titles[1], color: 'var(--history)', isStrong: true });
        lines.push({ text: `and ${titles.length - 2} more`, color: 'var(--muted)' });
      }
    }
  }

  if (view === VIEWS.MILESTONES) {
    const list = Array.isArray(milestones) ? milestones : (milestones && milestones.milestones ? milestones.milestones : []);
    const ms = list.find(m => m.dotIndex === dotIndex && m.status !== 'hidden');
    if (ms) {
      lines.push({ text: ms.label, color: 'var(--milestone)', isStrong: true });
    }
  }

  if (view === VIEWS.TIME) {
    if (timeSplit && timeSplit.valid && timeSplit.H > 0) {
      const offset = dotIndex - (currentDotIndex + 1);
      if (offset >= 0 && offset < timeSplit.H) {
        let cumulative = 0;
        for (let b = 0; b < 6; b++) {
          cumulative += (timeSplit.weeks[b] || 0);
          if (offset < cumulative) {
            const bucket = TIME_BUCKETS[b];
            lines.push({ text: bucket.label, color: `var(${bucket.colorVar})`, isStrong: true });
            break;
          }
        }
      }
    }
  }

  return lines;
}
