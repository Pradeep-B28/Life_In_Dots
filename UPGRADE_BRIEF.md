# Your Life in Dots: Upgrade Brief (v2)

You are upgrading the Your Life in Dots app in this folder. Read this whole file before writing any code. Then read PROJECT_BRIEF.md for background. **Where the two files differ, this file wins.** Follow the phases in Section 9 in order, and stop at the end of each phase.

---

## 1. What we are adding

Version 1 shows a life as dots and counts the Sundays ahead. Version 2 turns it into a short story with a past, a present and a future, then gives people four tools to play with.

**The new reveal (about 16 seconds):**
1. **Cinematic intro.** The camera starts on one single dot: "This is one week." It pulls back to one row: "52 weeks make one year." Then to the whole grid: "This is a life of 80 years."
2. **The fill.** Lived weeks fill in, with soft ticking sounds. "You are here" pulses, with a chime.
3. **Flashback.** Three gold dots light up, one at a time: "You were 6 when India won the Cricket World Cup for the second time."
4. **The future.** "You have about 3,008 Sundays ahead."

**Four new tools**, each in its own tab:
- **History:** moments from Indian and world history, pinned to the week you lived them.
- **Chapters:** colour your lived dots by life chapter, like School, College and First job.
- **Time:** sliders for sleep, work, phone and learning. The weeks ahead recolour to show where they go. One tap swaps an hour of phone for learning.
- **Milestones:** "nerd birthdays" like your 10,000th day and 1 billionth second, with an add-to-calendar button.

**Also new:** sound, a light and dark theme switch, share images for WhatsApp Status, and a longer demo mode for reels.

When there is a trade-off, follow this order:
1. The intro, fill and flashback look stunning.
2. Every number is exactly right (Section 7).
3. It runs smoothly on a mid-range Android phone.
4. Sharing works in one tap.
5. Everything else.

---

## 2. Rules

All hard rules in PROJECT_BRIEF.md Section 2 still apply. These are added or changed:

1. **Branch first.** Do all work on a git branch called `upgrade-v2`. The live site must not change until I reply "Ship it".
2. **Privacy, extended.** The date of birth, chapter names, chapter dates and slider values never go into the URL, `localStorage`, `sessionStorage`, analytics or any network request. Keep them in memory only.
   - **One exception:** on Android, when someone taps "Add to calendar", the calendar link carries that one milestone date and its label (Section 4H). Nothing else.
3. **Allowed storage.** `localStorage` may hold only two keys: `lid-theme` and `lid-muted`. Wrap every read and write in try and catch.
4. **Tone, extended.** The banned words in PROJECT_BRIEF.md Rule 4 still apply. Also never use "left" about life or weeks ("weeks left", "time left"). The Time tab must never shame anyone about sleep or phone use.
5. **History data is fixed.** All event text and dates come from `js/history-data.js` (I provide it). Do not add, remove or reword events. Do not invent facts anywhere else in the app.
6. **No company names in the UI.** The Android calendar link uses a Google address (Section 4H), but no button or text may show a company name other than Wrench Wise.

---

## 3. Files

New and changed files. Everything else stays as it is.

```
life-in-dots/
  UPGRADE_BRIEF.md   this file
  PROJECT_BRIEF.md   the original brief, kept for background
  js/
    history-data.js  I provide it. Copy as is.
    history.js       lived events, flashback picks, History tab
    chapters.js      chapter list, validation, dot ranges, Chapters tab
    timebudget.js    sliders, week split, Time tab
    milestones.js    milestone dates, calendar files, Milestones tab
    camera.js        zoom and pan for the cinematic intro
    audio.js         Web Audio sounds and mute
    tabs.js          tab bar, bottom sheet, laptop tabs
    layers.js        which colour each dot gets in each tab
    theme.js         light and dark switch
    dates.js         add the new functions in Section 6
    reveal.js        new timeline (Section 4A)
    grid.js          camera support, layers, markers
    shareImage.js    view-based images and Status size
    demo.js          tab tour
    selftest.js      new tests from Section 7
```

Keep each file under about 400 lines. Split further if needed.

---

## 4. Features

### A. The new reveal timeline

This replaces PROJECT_BRIEF.md Section 4C. Keep the timeline in `reveal.js` as one list of steps with times, so it is easy to tune.

| Time | Step |
|---|---|
| 0.0 to 0.5 s | Home card exits (same as v1). The result section appears. |
| 0.5 to 3.5 s | Cinematic intro (below) |
| 3.5 to 7.1 s | The fill (same rules as v1, 3.6 s, or 1.2 s if under 150 lived dots) |
| 7.1 s | You are here (same as v1), plus the chime |
| 7.8 to 13.8 s | Flashback, 2.0 s per pick (below) |
| 13.8 s | The turn: "You have about N Sundays ahead." (same as v1), plus the warm chord |
| 15.2 s | Cards slide in (same as v1). Then the tab bar appears. |

If there are fewer than 3 flashback picks, the later steps move earlier. If there are none, skip the flashback.

**Cinematic intro (`camera.js`)**
- The camera has a scale and an x, y offset. Scale 1 is the normal grid layout.
- **0.5 to 1.3 s.** The camera is centred on the very first dot (row 0, week 0), zoomed so that dot is about 40% of the grid card width. The dot grows from 0 to full size. Caption: "This is one week."
- **1.3 to 2.3 s.** The camera eases out until row 0 fills the card width. The other 51 dots in row 0 pop in, left to right. Caption: "52 weeks make one year."
- **2.3 to 3.5 s.** The camera eases out to scale 1. Rows appear in a wave as they come into view. Caption: "This is a life of 80 years." Use the real life length. In bonus mode: "This is your life so far."
- Use `--ease` for the camera moves.
- **Captions:** centred near the top of the grid card, weight 800, 22px on phone and 28px on laptop, on a soft `--surface` pill so they stay readable. Fade in and out over 200 ms. Hide them when the fill starts.
- **Drawing:** while the camera moves, redraw every frame, but only the dots inside the visible area. When the scale is above 3, draw dots with `arc()`, because only a few are visible. Below that, use pre-drawn dot images (one small offscreen canvas per colour) with `drawImage`. After the intro, go back to v1's "draw only what changes" approach.
- Dot details (tap and hover) are switched off until the reveal ends.

**Flashback**
- Uses the picks from Section 6E, in date order.
- For each pick, 2.0 s:
  - The event's dot turns `--history`, grows to 2 times its size and back, and one gold ring pulses outward (on the overlay canvas).
  - A caption card appears in the same place as the intro captions (same style, but text weight 600 and 18px on phone, 22px on laptop). For example: "You were 6 when India won the Cricket World Cup for the second time." Under it, small and muted: "2 Apr 2011".
  - The pop sound plays.
- After the last pick, the gold dots fade back to their normal colour over 300 ms.

**Skip.** A small "Skip" text button shows at the top right of the grid card from 0.5 s until the turn. It jumps straight to the final state with everything shown. "Watch again" still replays the whole reveal.

**Reduced motion.** No camera moves, no fill, no growing dots. Show the final grid at once. Show the three flashback lines as a plain list under the headline. No captions. Sound still plays the chime only.

### B. Sound (`audio.js`)

All sounds are made in code with Web Audio. No audio files.
- **Start:** create the AudioContext on the "Show my life" tap. In demo mode, on the first tap. Never play sound before a tap.
- **Intro swell (0.5 to 3.5 s):** soft filtered noise, low pass rising from 400 to 1,600 Hz, peak gain 0.03, fading out at the end.
- **Fill ticks:** one tick per filled row. A sine blip of 40 ms, starting at 1,100 Hz and 60 Hz higher for each decade, gain 0.04, quick fade. At most 20 ticks per second. Skip any tick that comes too soon.
- **You are here chime:** two sine notes, 660 Hz and 990 Hz, 80 ms apart, gain 0.08, fading over 900 ms.
- **Flashback pop:** a triangle wave gliding from 520 to 780 Hz over 120 ms, gain 0.06.
- **The turn chord:** three sine notes at 392, 494 and 587 Hz, gain 0.05 each, fading over 1.4 s.
- **Master:** everything goes through a compressor and a master gain of 0.8.
- **Mute:** a speaker button in the header, drawn as inline SVG. Sound is on by default. Save the choice in `lid-muted`.

### C. Light and dark theme (now a must have)

- A sun and moon toggle in the header, drawn as inline SVG.
- First visit follows the device setting (`prefers-color-scheme`). After the person picks, save it in `lid-theme`.
- Set `data-theme` on `<html>` with a tiny inline script in `<head>`, before the CSS loads, so the page never flashes the wrong theme.
- All colours, including every dot and the share image, come from the tokens in Section 5. Switching themes redraws the grid instantly. Animate other colours for 200 ms when switching, not on first load.
- Two `theme-color` meta tags: `#FFFFFF` for light and `#0F172A` for dark, using the `media` attribute.
- **Logo in dark theme:** place it on a small white rounded chip (8px radius, 4px 8px padding).

### D. Tabs, sheets and layers (`tabs.js`, `layers.js`)

After the reveal ends, the tools appear.

**Phone (under 900px wide)**
- A tab bar fixed to the bottom: 64px tall plus `env(safe-area-inset-bottom)`, `--surface` background, top border. Four tabs, each with a small inline SVG icon and a label: History, Chapters, Time, Milestones.
- Tapping a tab opens a bottom sheet just above the bar:
  - Height: the smaller of 52% of the screen height and 460px.
  - 16px rounded top corners, `--shadow-lg`, a small handle at the top and a "Done" button.
  - The sheet scrolls inside itself.
- Tapping the active tab again, or "Done", closes the sheet. Only one sheet is open at a time.
- While a sheet is open, add bottom padding to the page equal to the bar plus the sheet, so every row of the grid can still be scrolled into view.
- When a sheet opens, smoothly scroll the page so the rows that tab changes sit above the sheet:
  - History: the row of the latest lived event
  - Chapters: row 0
  - Time: the current row, about 20% down from the top of the visible area
  - Milestones: the row of the next-up milestone
- The v1 reel frame rule still holds: at 390 x 844, the headline, the whole grid and the legend fit on one screen before the tab bar appears.

**Laptop (900px and wider)**
- Under the headline in the right column, a segmented control: Overview, History, Chapters, Time, Milestones.
- Overview shows the v1 stat cards, "How we count" and the closing card. The other tabs show their panels in the same place.
- The grid column stays visible with `position: sticky`, just below the header.

**Layers.** Each tab colours the grid differently. Keep these rules in `layers.js` as one function that returns the colour and opacity for any dot index.

| View | Lived dots | Current dot | Ahead dots | Markers |
|---|---|---|---|---|
| Overview (sheet closed) | Chapter colours if any chapter exists, otherwise the v1 gradient | Ring | `--dot-future` | None |
| History | Normal colour at 30% opacity | Ring | `--dot-future` at 30% | Event dots in `--history`, full opacity |
| Chapters | Chapter colour, or `--dot-unassigned` | Ring | `--dot-future` | None |
| Time | Normal colour at 30% opacity | Ring | The next H dots in time colours (Section 4G), the rest `--dot-future` | None |
| Milestones | Normal colour at 30% opacity | Ring | `--dot-future` at 30% | Milestone dots at full opacity with a 2px `--milestone` ring. Filled ring if done, hollow if ahead. |

- Switching layers: redraw the grid, then fade the canvas from opacity 0.6 to 1 over 150 ms.
- The legend under the grid changes with the layer. Chapter names in the legend use `textContent`.

### E. History tab (`history.js`)

- **Title:** "Your life in history". **Subtitle:** "Moments you lived through, pinned to your dots."
- **Filter chips** from `HISTORY_FILTERS`: All, Cricket, Space, Tamil Nadu, More. On the grid, only events that match the filter turn gold.
- **List**, oldest first. Each row: the date (for example "2 Apr 2011"), the title, and a chip "You were 6" ("You were a baby" for age 0).
- **Tapping a row:** that dot pulses gold, the dot details card opens for it, and on phone the page scrolls so its row sits above the sheet.
- **"Before your first dot":** a collapsible section at the end. "11 moments happened before you were born." When opened, it lists their titles and years.
- **Footnote:** "Dates as reported in India. One dot can hold more than one moment."
- **No lived events** (born very recently): "Your first moments in history are still ahead."

### F. Chapters tab (`chapters.js`)

- **Title:** "Paint your chapters". **Subtitle:** "Colour the dots you have lived. Chapters stay on this page only, so share or save the picture to keep them."
- **Preset chips** that add a chapter: School, College, First job, New city, Custom.
  - School: start June of (birth year + 5), end March of (birth year + 17).
  - College: start July of (birth year + 17), end May of (birth year + 21).
  - First job and New city: start empty, "Still going" ticked.
  - Custom: empty name, empty dates.
  - If a suggested date is after today's month, leave that field empty instead.
- **Each chapter row:**
  - A colour swatch (the next unused colour from `--ch-1` to `--ch-8`). Tapping it cycles through the colours.
  - A name input, up to 20 characters
  - Start: Month and Year dropdowns
  - End: Month and Year dropdowns, or a "Still going" checkbox that disables them
  - A delete button (an X icon with `aria-label="Delete chapter"`)
- At most 8 chapters. Year dropdowns run from the birth year to this year.
- **Validation** (plain error text under that row, in `--error`):
  - "Please give this chapter a name."
  - "Names can use letters, numbers and spaces." Allowed: letters in any language (`\p{L}` and `\p{M}`), digits, spaces, and `.` `'` `-` `&`.
  - "Please keep it under 20 letters." (Count graphemes, same as v1.)
  - The start month is fully before the birth month: "That is before you were born."
  - The start month is after this month: "That is in the future."
  - The end month is after this month: "That is in the future. Tick Still going instead."
  - The end is before the start: "The end is before the start."
- **Dates to dots:**
  - Start date = the later of the date of birth and the 1st of the start month.
  - End date = the earlier of today and the last day of the end month. If "Still going", today.
  - The chapter covers `dotIndexForDate(start date)` to `dotIndexForDate(end date)`, both included (Section 6A).
- **Overlaps are allowed.** The chapter lower in the list wins. Show this note under the list: "Where chapters overlap, the one lower in the list shows."
- The grid updates as they edit (debounce 150 ms). Invalid rows are skipped until fixed.
- Once any chapter exists, the Overview view and the share image use chapter colours too.

### G. Time tab (`timebudget.js`)

- **Title:** "Where your weeks go". **Subtitle:** "If every day looked like today, this is how your weeks ahead would add up."
- **Range pills:** "Next year", "Next 10 years" (default), "All weeks ahead".
- **Sliders**, in steps of 0.5 hours, each showing its value like "8 h":

| Slider | Range | Default | Colour |
|---|---|---|---|
| Sleep | 4 to 12 | 8 | `--t-sleep` |
| Work or study | 0 to 16 | 8 | `--t-work` |
| Travel | 0 to 6 | 1 | `--t-travel` |
| Phone and screens | 0 to 12 | 3 | `--t-phone` |
| Learning | 0 to 8 | 1 | `--t-learn` |
| Free time | 24 minus the others (read only) | 3 | `--t-free` |

- If the five sliders add up to more than 24: "That adds up to more than 24 hours. Lower one of them." The grid keeps the last valid split.
- **Stacked bar:** full width, 12px tall, rounded, showing the six shares in the order above.
- **Results list:** each row has the colour swatch, the name and "173 weeks". When the range is 10 years or more, add "(3.3 years)".
- **Two highlight lines** above the list:
  - "Your phone gets about 65 weeks of your next 10 years."
  - "Learning gets about 22 weeks. That is about 3,640 hours."
  - Match the wording to the range: "of the next year", "of your next 10 years" or "of your weeks ahead".
- **Swap button:** "Swap 1 hour of phone for learning". It moves 1 hour from Phone to Learning. Disable it if Phone is under 1 hour or Learning is at its maximum.
  - The dots that change colour flip with a quick scale pop (300 ms).
  - A chip shows the change in learning weeks for 2 seconds, for example "+21 weeks of learning".
- Under the list, small and muted: "Not good or bad. Just worth knowing."
- **Call to action:** "Want to put those hours to work? See what you can learn at Wrench Wise", linking to `https://wrench-wise.com/?utm_source=life-in-dots&utm_medium=web-app&utm_campaign=life-in-dots-2026&utm_content=time-budget`
- **Grid:** the H dots right after the current dot are coloured in blocks, in the slider order: Sleep, Work or study, Travel, Phone and screens, Learning, Free time (Section 6C).
- **While a slider is being dragged,** redraw only the ahead dots in the range. Keep it smooth.
- **Bonus mode:** no sliders. Show "Every week from here is a bonus. Spend them your way."

### H. Milestones tab (`milestones.js`)

- **Title:** "Nerd birthdays". **Subtitle:** "Days worth celebrating that most people never notice."
- **Next up card:**
  - The label, for example "10,000 days old", in weight 800
  - The date with the weekday, for example "Wed, 29 Oct 2031"
  - "in about 5 years" (Section 6D)
  - "You will be 27"
  - An "Add to calendar" button
- **List:** every shown milestone in date order.
  - Done: a check icon, "Done", the date and "at 19".
  - Today: highlighted in `--brand-soft` with "Today!".
  - Ahead: the date, "at 27", the "in about" text, and a small "Add to calendar" text button.
- **Footnotes:**
  - "Billion-second days depend on the time you were born, so they can be a day off."
  - "Mars birthdays use a Mars year of 686.98 Earth days."
  - "Full moons use the average moon cycle."
- **Grid markers** as in Section 4D. A milestone past the last row of the grid gets no marker.

**Add to calendar**
- On Android (`/Android/i.test(navigator.userAgent)`), open this link in a new tab:
  `https://calendar.google.com/calendar/render?action=TEMPLATE&text=TITLE&dates=YYYYMMDD/YYYYMMDD&details=DETAILS`
  The second date is the day after. Encode every value with `encodeURIComponent`.
- Everywhere else, download `nerd-birthday.ics`:

```
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Wrench Wise//Life in Dots//EN
BEGIN:VEVENT
UID:RANDOM@life-in-dots
DTSTAMP:NOW_IN_UTC (YYYYMMDDTHHMMSSZ)
DTSTART;VALUE=DATE:20311029
DTEND;VALUE=DATE:20311030
SUMMARY:I turn 10,000 days old
DESCRIPTION:Found with Your Life in Dots by Wrench Wise. SITE
END:VEVENT
END:VCALENDAR
```

- Use `\r\n` line endings. TITLE is "I turn " plus the label, for example "I turn 10,000 days old". For Mars: "I turn 12 on Mars".

### I. Dot details, updated

Add these lines to the dot details card when they apply:
- The chapter name (Chapters and Overview views)
- Event titles, at most 2, then "and 1 more" (History view)
- The milestone label (Milestones view)
- The time bucket name, for example "Learning" (Time view)

### J. Sharing, updated (`shareImage.js`)

- **Size toggle** next to every share button: "Post" (1080 x 1350) and "Status" (1080 x 1920, the default, for WhatsApp Status and Instagram Stories).
- **Status layout:** keep 160px clear at the top and 200px at the bottom, because Status screens put buttons there. Title near the top, grid in the middle, the line under it, footer at the bottom.
- **"Share my dots" draws the current view**, with the line under the grid:
  - Overview: "1,163 weeks lived. About 3,008 Sundays ahead." (v1 line, with the chapter legend if chapters exist)
  - History: the latest flashback line, for example "I was 19 when India became the first country to land near the Moon's south pole."
  - Chapters: title "My life in chapters" and the chapter legend
  - Time: the stacked bar, then "My next 10 years: about 22 weeks of learning."
  - Milestones: "My next nerd birthday: 10,000 days old, in about 5 years."
- **Never show a date of birth or an exact milestone date on an image.** An exact milestone date lets anyone work out the birth date.
- A share button sits at the bottom of every sheet and every laptop panel. It shares that view.

### K. Demo mode, updated (`demo.js`)

Same as v1 (default 12 Jun 2004, 80 years, `dob`, `life` and `today` URL values), but the loop continues after the reveal with a tab tour. A visible tap dot shows every tap.
1. **History, 4 s:** open it and tap the 2011 World Cup row. Its dot pulses.
2. **Chapters, 6 s:** tap the School, College and First job chips, 1.5 s apart.
3. **Time, 6 s:** open it on "Next 10 years". After 2 s, tap "Swap 1 hour of phone for learning".
4. **Milestones, 4 s:** open it. The next-up card is in view.
5. Close the sheet, scroll to the top, and restart the loop. Clear the demo chapters before restarting.

It must look clean in both vertical (9:16 phone) and horizontal (16:9 laptop).

### L. Analytics, updated

Only if GA4 was set up in v1. Add these events: `tab_open` (with `tab`), `flashback_skip`, `swap_hour`, `calendar_add`, and `share_image` (with `view` and `size`). Never send names, dates, ages or any calculated number.

---

## 5. New colour tokens

This is the full token list. It includes the v1 tokens from PROJECT_BRIEF.md Section 5, so replace that list with this one. Every colour in the app must come from a token.

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#FFFFFF` | `#0F172A` |
| `--bg-grad` | `linear-gradient(135deg, #ECFDF5 0%, #FFFFFF 45%, #ECFEFF 100%)` | `linear-gradient(135deg, #0F172A 0%, #1E293B 100%)` |
| `--surface` | `#FFFFFF` | `#1E293B` |
| `--surface-2` | `#F3F4F6` | `#334155` |
| `--border` | `#E5E7EB` | `#334155` |
| `--text` | `#111827` | `#F1F5F9` |
| `--text-2` | `#374151` | `#CBD5E1` |
| `--muted` | `#6B7280` | `#94A3B8` |
| `--brand` | `#059669` | `#10B981` |
| `--brand-strong` | `#047857` | `#34D399` |
| `--brand-soft` | `#D1FAE5` | `rgba(16,185,129,0.15)` |
| `--accent` | `#0891B2` | `#22D3EE` |
| `--error` | `#E11D48` | `#FB7185` |
| `--dot-future` | `#D1D5DB` | `#334155` |
| `--dot-lived-from` | `#059669` | `#10B981` |
| `--dot-lived-mid` | `#0D9488` | `#14B8A6` |
| `--dot-lived-to` | `#06B6D4` | `#22D3EE` |
| `--dot-now` | `#047857` | `#34D399` |
| `--dot-unassigned` | `#A7F3D0` | `#134E4A` |
| `--history` | `#D97706` | `#FBBF24` |
| `--milestone` | `#0891B2` | `#22D3EE` |
| `--ch-1` | `#059669` | `#34D399` |
| `--ch-2` | `#0891B2` | `#22D3EE` |
| `--ch-3` | `#6366F1` | `#818CF8` |
| `--ch-4` | `#D97706` | `#FBBF24` |
| `--ch-5` | `#DB2777` | `#F472B6` |
| `--ch-6` | `#65A30D` | `#A3E635` |
| `--ch-7` | `#7C3AED` | `#A78BFA` |
| `--ch-8` | `#0F766E` | `#5EEAD4` |
| `--t-sleep` | `#6366F1` | `#818CF8` |
| `--t-work` | `#0891B2` | `#22D3EE` |
| `--t-travel` | `#D97706` | `#FBBF24` |
| `--t-phone` | `#E11D48` | `#FB7185` |
| `--t-learn` | `#059669` | `#34D399` |
| `--t-free` | `#5EEAD4` | `#0D9488` |

Light values go on `:root, [data-theme="light"]`. Dark values go on `[data-theme="dark"]`. Shadows, shapes, font and motion rules stay as in PROJECT_BRIEF.md Section 5.

**Contrast:** all text must reach at least 4.5 to 1 against its background in both themes.

---

## 6. New maths (`dates.js` and friends)

Use the day numbers, `addYears` and age rules from PROJECT_BRIEF.md Section 6. Today is fixed at 2026-10-23 in the self-test.

### A. Date to dot
`dotIndexForDate(dob, date)`, for a date on or after the date of birth:
- `age` = age in whole years on that date
- `week` = the smaller of 51 and `floor((date - addYears(dob, age)) / 7)`
- index = `age x 52 + week`

This is the same rule as the current dot. Use it for events, chapters and milestones. An index of `totalDots` or more is past the grid and gets no marker.

### B. Ahead dots
`aheadDots = totalDots - livedDots - 1` (the dots after the current dot). None in bonus mode.

### C. Time split
1. `H` = 52 for "Next year", 520 for "Next 10 years", `aheadDots` for "All weeks ahead". Then cap `H` at `aheadDots`.
2. Work in half hours so there are no rounding errors: `hh` = hours x 2 for the five sliders, and Free time `hh` = 48 minus their total. If the five total more than 48, reject.
3. For each of the six buckets: `exact = H x hh`, `weeks = floor(exact / 48)`, `rest = exact % 48`.
4. Some weeks are still unassigned. Give one extra week each to the buckets with the biggest `rest`. On a tie, the bucket earlier in the slider order goes first.
5. The six week counts always add up to exactly `H`.
6. Learning hours = `H x 7 x learning hours`.
7. Years = weeks / 52, rounded to 1 decimal.
8. Colour the dots: starting right after the current dot, the first `weeks[0]` dots are Sleep, the next `weeks[1]` are Work or study, and so on.

### D. Milestones
Each milestone is the date of birth plus a number of days:

| Label | Days |
|---|---|
| 1,000 weeks old | 7,000 |
| 10,000 days old | 10,000 |
| 1 billion seconds old | 11,574 |
| 2,000 weeks old | 14,000 |
| 20,000 days old | 20,000 |
| 3,000 weeks old | 21,000 |
| 2 billion seconds old | 23,148 |
| 25,000 days old | 25,000 |
| 4,000 weeks old | 28,000 |
| 30,000 days old | 30,000 |

Plus two special ones:
- **1,000th full moon:** list the full moon days (PROJECT_BRIEF.md Section 6) that fall on or after the date of birth. The 1,000th one in that list. Find the first one with `k = ceil((dob - REF) / P) - 2`, then step k up until `floor(REF + k x P)` is on or after the date of birth. The 1,000th is at `k + 999`.
- **Next Mars birthday:** the smallest whole number n of 1 or more where `dob + floor(n x 686.98)` is after today. Label "You turn n on Mars".

**Status of each milestone:**
- Before today: done. Equal to today: today.
- After today, normal mode: shown only if it is before the end date. Otherwise hidden.
- After today, bonus mode: only the earliest one is shown. The rest are hidden.

**"In about" text,** where d is the number of days from today:
- d under 60: "in d days"
- d under 730: "in about M months", M = `Math.round(d / 30.44)`
- otherwise: "in about Y years", Y = `Math.round(d / 365.25)`

**Age at a milestone:** age in whole years on that date.

### E. Flashback picks
1. Lived events: events with a date from the date of birth up to today, both included.
2. Candidates: lived events where the age at the event is 5 or more. If that gives fewer than 3, use all lived events instead.
3. Sort candidates by `rank` (lowest first).
4. Take events in that order until you have 3. Skip a cricket event if you already have 2 cricket events.
5. Show the picks in date order.
6. Sentence: "You were {age} when {when}." For age 0: "You were a baby when {when}." In share images, "I was" instead of "You were".

### F. Short date format
"2 Apr 2011" for lists. "Wed, 29 Oct 2031" for the next-up card. English month and weekday names, written out in code (do not depend on the browser's language).

---

## 7. Self-test additions (must pass)

Add these to `selftest.js`. Today is fixed at **2026-10-23**. Every v1 test must still pass. Every number below must match exactly. I worked these out twice, in two different programming languages, and both agree.

### A. History and flashback

| Case | Date of birth | Lived events | Before birth | Flashback picks (id, age, dot index) |
|---|---|---|---|---|
| A | 2004-06-12 | 20 | 11 | wc-2011, 6, 354 / mars, 10, 534 / chandrayaan-3, 19, 998 |
| B | 1998-03-15 | 21 | 10 | t20-2007, 9, 495 / wc-2011, 13, 678 / chandrayaan-3, 25, 1323 |
| C | 2000-02-29 | 20 | 11 | t20-2007, 7, 393 / wc-2011, 11, 576 / chandrayaan-3, 23, 1221 |
| D | 2026-10-23 | 0 | 31 | none |
| E | 1950-06-01 | 29 | 2 | moon-walk, 19, 995 / wc-2011, 60, 3163 / chandrayaan-3, 73, 3807 |
| F | 2010-12-31 | 18 | 13 | chandrayaan-3, 12, 657 / t20-2024, 13, 701 / women-wc, 14, 771 |
| G | 1926-01-01 | 31 | 0 | moon-walk, 43, 2264 / wc-2011, 85, 4433 / chandrayaan-3, 97, 5077 |

Exact sentences to check:
- A: "You were 6 when India won the Cricket World Cup for the second time."
- F: "You were 14 when India's women won their first Cricket World Cup."
- E: "You were 19 when humans first walked on the Moon."

### B. Milestones

**Case A** (2004-06-12, life 80, end 2084-06-12):

| Label | Date | Age | Status | Dot index | In about |
|---|---|---|---|---|---|
| 1,000 weeks old | 2023-08-12 | 19 | done | 996 | |
| You turn 12 on Mars | 2027-01-06 | 22 | ahead | 1173 | in about 2 months |
| 10,000 days old | 2031-10-29 | 27 | ahead | 1423 | in about 5 years |
| 1 billion seconds old | 2036-02-19 | 31 | ahead | 1648 | in about 9 years |
| 2,000 weeks old | 2042-10-11 | 38 | ahead | 1993 | in about 16 years |
| 20,000 days old | 2059-03-16 | 54 | ahead | 2847 | in about 32 years |
| 3,000 weeks old | 2061-12-10 | 57 | ahead | 2989 | in about 35 years |
| 2 billion seconds old | 2067-10-28 | 63 | ahead | 3295 | in about 41 years |
| 25,000 days old | 2072-11-22 | 68 | ahead | 3559 | in about 46 years |
| 4,000 weeks old | 2081-02-08 | 76 | ahead | 3986 | in about 54 years |
| 1,000th full moon | 2085-04-09 | 80 | hidden | | |
| 30,000 days old | 2086-08-01 | 82 | hidden | | |

Next up for A: "You turn 12 on Mars".

**Case B** (1998-03-15): 10,000 days old is 2025-07-31, done. Next up is "You turn 16 on Mars", 2028-04-17, age 30, dot 1564, "in about 18 months". 1 billion seconds old is 2029-11-21, dot 1647, "in about 3 years". 1,000th full moon is 2079-01-17, hidden.

**Case E** (1950-06-01, life moved up to 80): 25,000 days old is 2018-11-11, done. Next up is "4,000 weeks old", 2027-01-28, age 76, dot 3986, "in about 3 months". Then "You turn 41 on Mars", 2027-07-13, dot 4010, "in about 9 months". 1,000th full moon is 2031-04-06, hidden.

**Case G** (1926-01-01, bonus): 1,000th full moon is 2006-11-05, done, dot 4204. 30,000 days old is 2008-02-20, done, dot 4271. Next up is "You turn 54 on Mars", 2027-07-26, age 101, "in about 9 months", with no grid marker.

**Calendar file:** for A's "10,000 days old", the file contains `DTSTART;VALUE=DATE:20311029`, `DTEND;VALUE=DATE:20311030` and `SUMMARY:I turn 10,000 days old`.

### C. Time split

Default sliders are Sleep 8, Work or study 8, Travel 1, Phone 3, Learning 1 (Free time 3). Week counts are in slider order: Sleep, Work or study, Travel, Phone, Learning, Free time.

| Case | Range | H | Weeks | Learning hours |
|---|---|---|---|---|
| A | Next year | 52 | 17, 17, 2, 7, 2, 7 | 364 |
| A | Next 10 years | 520 | 173, 173, 22, 65, 22, 65 | 3640 |
| A | All weeks ahead | 2996 | 999, 999, 125, 374, 125, 374 | 20972 |
| A | Next 10 years, after one swap (Phone 2, Learning 2) | 520 | 174, 173, 22, 43, 43, 65 | 7280 |
| A | Next 10 years, sliders 7.5, 9, 1.5, 2.5, 0.5 | 520 | 163, 195, 32, 54, 11, 65 | 1820 |
| B | All weeks ahead | 2672 | 891, 891, 111, 334, 111, 334 | 18704 |
| E | Next 10 years (capped) | 187 | 62, 62, 8, 24, 8, 23 | 1309 |
| E | Next 10 years, after one swap | 187 | 62, 62, 8, 16, 16, 23 | 2618 |

Also: Sleep 12 and Work 12 with Travel 1 is rejected (more than 24 hours). The swap chip for A, Next 10 years, shows "+21 weeks of learning".

### D. Chapters

For case A (2004-06-12):
- School preset, Jun 2009 to Mar 2021: dots 258 to 873
- College preset, Jul 2021 to May 2025: dots 886 to 1090
- First job, Jul 2025, Still going: dots 1094 to 1163
- A chapter starting in the birth month (Jun 2004) starts at dot 0
- Rejected: start Jan 2004 ("That is before you were born."), end Dec 2026 ("That is in the future. Tick Still going instead."), end before start, an empty name, a 21-letter name, and a name with `<`.

### E. Other checks
1. **Privacy.** After using every tab (except the Android calendar link), `location.href`, `localStorage` and `sessionStorage` contain no part of the birth date, no chapter name and no slider value. `localStorage` holds only `lid-theme` and `lid-muted`. With analytics off, the Network panel shows no requests at all after the page loads.
2. **Speed.** In Chrome DevTools at 390 x 844 with CPU throttling at 4x: the full reveal, including the intro, averages above 45 fps. Dragging a Time slider stays above 45 fps. Switching tabs takes under 100 ms. Report the numbers.
3. **Layout.** Screenshots of every tab at 360 x 740, 390 x 844 and 1440 x 900, in light and dark. No horizontal scroll. No text cut off.
4. **Brand match.** Open wrench-wise.com and the app side by side in light theme and screenshot both. Fix anything that does not look like the same company. Search the code for colour values and confirm every one comes from a token.
5. **Tone.** Search all user-facing text for the banned words (PROJECT_BRIEF.md Rule 4, plus "left" about life or weeks). There must be none.
6. **Safety.** Search the code for `innerHTML`. It must never be used with changing values. Chapter names only ever go in with `textContent` or on canvas.
7. **History data.** Confirm `js/history-data.js` is byte for byte the file I provided.

---

## 8. Phase Report format

Same as PROJECT_BRIEF.md Section 10:
- **What I built** (3 to 5 bullets)
- **How to check it** (click steps)
- **Screenshots** (phone and laptop, where relevant)
- **Not working or parked,** explained in plain words
- **Time used** against the target

---

## 9. Phases

### Phase 0: Safety and check-up (target 20 min)
1. Tell me in plain words what each step does before running it.
2. Make sure all current work is committed. Then create the branch `upgrade-v2` and switch to it.
3. Also copy the whole folder to `life-in-dots-v1-backup` next to it, as a second safety net.
4. Copy `history-data.js` (which I put in this folder) into `js/`.
5. Run `?test=1` on the current version and report the results.
6. Compare the current app against PROJECT_BRIEF.md and list which v1 phases are fully done.
7. **If v1 is not finished,** do not start Phase 1 below. Finish the missing v1 phases first, one at a time, each with its own Phase Report. Then continue here.

### Phase 1: New maths and self-test (target 60 min)
- **Build:** the functions in Section 6, `history.js` data logic (no UI yet), `milestones.js` date logic and calendar file text, `timebudget.js` split logic, `chapters.js` validation and dot ranges, and every test in Section 7A to 7D.
- **Report:** the full self-test table. Every number must match. Do not continue with a mismatch. Explain it in plain words instead.

### Phase 2: Layout, tabs, layers and dark theme (target 75 min)
- **Build:** `tabs.js` (phone bar and sheet, laptop tabs), `layers.js` with all five views and legends, the updated dot details, `theme.js` and the dark tokens. Panels can be empty placeholders for now.
- **Report:** screenshots of each empty tab on phone and laptop, in light and dark. The tab switching time.

### Phase 3: Cinematic intro, flashback and sound (target 75 min)
- **Build:** `camera.js`, the new `reveal.js` timeline, the flashback, Skip, `audio.js` with mute, and the reduced motion version.
- **Report:**
  - Screenshots at 0.8, 1.8, 3.0, 5.0, 8.5 and 14.5 seconds on phone
  - The fps at 390 x 844 with 4x throttling
  - Click steps for me to watch and listen to it in Chrome

### Phase 4: History tab (target 45 min)
- **Build:** the full History tab from Section 4E, with filters, list, row taps and "Before your first dot".
- **Report:** screenshots for cases A, E and D on phone.

### Phase 5: Chapters tab (target 60 min)
- **Build:** the full Chapters tab from Section 4F, with presets, validation, overlaps and live grid updates.
- **Report:** screenshots of case A with the three presets added, and of each error message.

### Phase 6: Time tab (target 60 min)
- **Build:** the full Time tab from Section 4G, with sliders, the stacked bar, the swap button and its animation, the call to action, and bonus mode.
- **Report:** screenshots of case A for each range, before and after one swap, and the fps while dragging a slider.

### Phase 7: Milestones tab (target 45 min)
- **Build:** the full Milestones tab from Section 4H, with the next-up card, list, grid markers and both calendar paths.
- **Report:** screenshots for cases A, E and G, and the downloaded `.ics` file content. I will test the Android calendar button on my phone once the preview link from Phase 9 is ready.

### Phase 8: Sharing, demo tour and checks (target 60 min)
- **Build:** the view-based share images in both sizes, the share button in every panel, the updated demo mode, and the analytics events (only if GA4 exists).
- **Then run** every check in Section 7E and fix what fails.
- **Report:** all five share images in Status size for case A (light and dark), the check results, and confirmation that demo mode loops cleanly in 9:16 and 16:9.

### Phase 9: Docs, preview and ship (target 40 min)
1. **Preview:** push the `upgrade-v2` branch to GitHub. Vercel makes a preview link for it automatically. Give me that link so I can test on my phone. The live site does not change.
2. **README.md:** add a "What's new in v2" section, and add 4 points to "How it works": the camera zoom, splitting weeks with whole-number maths, how milestone dates are found, and why chapter names never leave the phone.
3. **REEL_SCRIPT.md:** add three new vertical scripts, 30 seconds each, matched to demo mode timing:
   - "You were 6 when..." (the flashback)
   - "Swap one hour" (the Time tab swap)
   - "Your 10,000th day" (Milestones)
   - Each has a hook as on-screen text in the first 2 seconds, a shot list, captions, optional voiceover lines and a closing line with Wrench Wise. No emojis, no em dashes, none of the banned words.
4. **Stop here and wait.** When I reply "Ship it":
   - Merge `upgrade-v2` into the main branch and push. Vercel updates the live site.
   - Confirm the live site works on a phone-sized screen and that `?test=1` passes live.
   - Give me the live link and the demo link.

---

## 10. If something keeps breaking

- If the same bug survives two fix attempts, stop. Explain it in plain words and give me options. Do not keep looping.
- If I say "Park it", move that feature to a "Parked" list in the Phase Report and continue with the next phase.
- If I want to ship sooner, park in this order: the Status size option, the Mars birthday, the swap animation (keep the button), the intro swell sound, the History filter chips.

**Never park:**
- The cinematic intro, the fill and the flashback
- The four tabs
- The self-test and every number in Section 7
- The privacy, tone and history data rules
- Light and dark theme
- Demo mode
- Reduced motion rules
