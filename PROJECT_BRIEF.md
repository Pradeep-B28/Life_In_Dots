# Your Life in Dots: Project Brief

You are building a small web app in this folder. Read this whole file before writing any code. Follow the phases in Section 9 in order, and stop at the end of each phase.

---

## 1. What we are building

Your Life in Dots shows a whole life on one screen, one dot for every week.

Someone picks their date of birth and taps "Show my life". A grid of grey dots appears: 52 dots in a row, one row for every year. Then the weeks they have already lived fill in one by one in the Wrench Wise emerald-to-cyan gradient, while a counter races up. The dot for this week lands and starts to pulse: "You are here". Then the headline changes to "You have about 3,008 Sundays ahead." Cards count up the full moons, Pongal festivals and cricket World Cups still ahead.

The headline moment is the fill: a whole life filling in, then one small pulsing dot. Spend the most care here.

**Tone.** Hopeful, never gloomy. The message is "look how much time you still have", not "time is running out".

**It must look like it belongs to wrench-wise.com.** Same colours, font, button shapes and white cards as the site (Section 5). Someone who knows the Wrench Wise site should recognise the brand from a single screenshot.

Who it is for:
- **Instagram and WhatsApp viewers with no tech background.** They must understand it within 3 seconds and need only one tap.
- **Reel viewers.** It must look great in screen recordings, both vertical and horizontal.
- **Students and parents.** Every screen carries quiet Wrench Wise branding, and the end card invites them to learn how it was built.

When there is a trade-off, follow this order:
1. The fill and the pulsing dot look stunning.
2. Every number is exactly right (Section 8).
3. It runs smoothly on a mid-range Android phone.
4. Sharing works in one tap.
5. Everything else.

---

## 2. Hard rules

1. **Code.** Use plain HTML, CSS and JavaScript only. No frameworks, libraries, CDNs, npm packages, web fonts or image files inside the app. The only images allowed are the logo and the link preview image (Section 7). Draw everything else in code: dots, icons and the share image.
2. **Front-end only.** No backend, database, API keys, AI calls or accounts.
3. **Privacy.** The date of birth never leaves the device. Never put it in the URL, `localStorage`, `sessionStorage`, analytics or any network request. Keep it in memory only.
4. **Tone.** Never use these words anywhere a user can see them: death, die, dead, dying, "time left to live", "remaining life", countdown, "running out", expire. Say "ahead", not "left".
5. **Writing style.** All UI text and docs are in plain English with short sentences. No emojis. No em dashes (the long dash).
6. **Dates.** All date maths lives in `dates.js` and uses whole day numbers (Section 6). Never use `new Date("YYYY-MM-DD")` or local-time arithmetic for calculations. Those cause off-by-one-day bugs.
7. **File size.** Keep each file focused, under about 400 lines.
8. **Phases.** At the end of every phase, stop and give a Phase Report (Section 10). Do not start the next phase until I say so.
9. **Stubborn bugs.** If the same bug survives two fix attempts, stop. Explain the problem in plain words and give me options. Do not keep looping.
10. **My actions.** I am not from a tech background. When you need me to do something (click, log in, approve), give numbered click-by-click steps.
11. **Commands.** Before running a terminal command, tell me in one line what it does.
12. **Branding.** Wrench Wise only. No other company names, logos or brand colours. No real celebrity names in the demo or docs.

---

## 3. Tech setup

- Run locally with a simple static server: `npx serve .`
  - If that fails, use `python -m http.server 8000`.
  - Test in the browser at the address it prints.
- Use ES modules (`<script type="module">`).
- Folder structure:

```
life-in-dots/
  index.html
  styles.css
  manifest.json
  assets/          logo.png (I provide), og-image.png, app icons
  tools/
    og.html        draws the link preview image (Section 7)
  js/
    main.js        starts the app, reads URL flags
    dates.js       all date maths, pure functions, no DOM
    stats.js       builds the numbers for the stat cards
    grid.js        grid layout, canvas drawing, hit testing
    reveal.js      the reveal timeline (Section 4C)
    counter.js     count-up numbers
    ui.js          form, validation messages, cards, tooltip
    share.js       share sheet, WhatsApp, copy link
    shareImage.js  draws the 1080 x 1350 share image
    demo.js        demo mode
    selftest.js    runs with ?test=1
  README.md
  REEL_SCRIPT.md
```

- **Grid canvas.** One canvas for the dots, plus one small overlay canvas on top for the pulsing current dot.
- **Draw only what changes.** Draw the empty grid once. During the fill, draw only the dots that became lived since the last frame. Never redraw every dot every frame. This is what keeps phones smooth.
- **One loop.** A single `requestAnimationFrame` loop drives all animation. Use delta time (seconds since the last frame, capped at 0.05) so speed is the same on 60Hz and 120Hz screens.
- **Sharp on every screen.** Size canvases to their CSS size times `devicePixelRatio`, capped at 2.
- **Resize and rotation.** Debounce by 150 ms, recompute the layout and redraw the current state instantly. Do not replay the reveal.
- **Hidden tab.** Pause the loop when the tab is hidden (`visibilitychange`).

---

## 4. Features

### Must have

**A. Home screen**
- Background: `--bg-grad`. A faint field of `--dot-future` dots behind the card, slowly fading in and out in small random groups (ambient, very subtle).
- A white card (on phone it fills the width; on laptop at most 440px, centred). Contents in this order:
  - Eyebrow chip: "One dot = one week"
  - Title: "Your Life in Dots"
  - Subtitle: "See every week of your life on one screen."
  - Label "Your date of birth", then three dropdowns side by side: Day (1 to 31), Month (Jan to Dec), Year (this year down to 100 years ago). Use dropdowns, not a date picker, because picking a birth year in phone date pickers is slow.
  - Label "Picture a life of", then four pill buttons: "70 years", "80 years" (selected by default), "90 years", "100 years".
  - Small hint: "This is a picture, not a prediction."
  - Primary button: "Show my life"
  - Small privacy line: "Your date of birth stays on this device. Nothing is sent or saved."
- **Validation** (plain error text under the dropdowns, in `--error`):
  - Any dropdown empty: "Please pick your full date of birth."
  - The date does not exist, for example 31 Feb: "That date does not exist. Please check the day."
  - The date is after today: "That date is in the future."
  - Today is allowed.

**B. The grid**
- **Columns:** 52. **Rows:** the life length used, in years (Section 6). In bonus mode, age + 1 rows.
- **Cell size `s`:** the largest whole number of CSS pixels that lets the grid fit the grid card's inner width, and on laptop also its height. Minimum 5px. Each dot is a circle of diameter `0.72 x s`, centred in its cell.
- **Decade gap:** after every 10 rows, add an extra gap of `0.8 x s`. This makes decades easy to read.
- **Age labels:** a left gutter (24px laptop, 20px phone) shows 0, 10, 20 and so on at the first row of each decade. 11px, `--muted`, tabular numbers.
- **Colours:**
  - Lived dots are coloured by row along the brand gradient. Row 0 is `--dot-lived-from`, the current row is `--dot-lived-to`, and rows in between blend through `--dot-lived-mid`. So the lived block always shows the full gradient, at any age.
  - The current week dot is `--dot-now`, with a 2px ring in `--dot-now` at 1.9 times the dot size and a soft `--brand-soft` glow.
  - Ahead dots are `--dot-future`.
- **Legend** under the grid: a lived dot "Lived", the ringed dot "This week", a grey dot "Ahead".
- **Note** under the legend: "One row is one year of your age, with 52 dots."
- **Accessibility:** the canvas has `role="img"` and an `aria-label` like "Grid of 4,160 dots. 1,163 lived. This week is week 20 of age 22."

**C. The reveal (the hero feature)**

Keep the timeline in `reveal.js` as a simple list of steps with times, so it is easy to tune.

1. **0.0 to 0.5 s.** The home card fades out and moves up 12px. The result section appears: the grid card goes from scale 0.98 and opacity 0 to normal.
2. **0.5 to 1.3 s.** Empty grid wave. Grey dots appear row by row from the top. Each row fades in over 150 ms. Fit the whole wave inside 0.8 s, whatever the row count.
3. **1.3 to 4.9 s. The fill.** Lived dots fill in reading order, row by row, left to right.
   - Use ease-in-out cubic over 3.6 s, so it starts slow, races through the middle and settles at the end.
   - If fewer than 150 dots are lived, use 1.2 s instead.
   - The headline shows "X weeks lived", counting from 0 up to the exact weeks lived (Section 6), in step with the fill.
4. **4.9 s. You are here.** The current week dot grows to 1.8 times its size and back once (300 ms). Then a ring pulses every 2 seconds: it grows from 1 to 2.4 times and fades out over 1.2 s. A small label "You are here", with a thin line to the dot, shows for 3 seconds. Draw all of this on the overlay canvas.
5. **5.5 s. The turn.** "X weeks lived" shrinks into the subline. The new headline is "You have about N Sundays ahead." N counts up over 1.2 s. Under it, small text: "In a life of 80 years. Every grey dot is a week still ahead of you."
6. **6.9 s onwards.** The "Ahead of you" cards slide in 80 ms apart, each number counting up over 800 ms. Then the "So far" cards. Then the closing card.

**Moved up note.** If the life length was moved up (Section 6), show a small chip above the grid: "You have already lived past 70, so this shows 80 years." (Use the real numbers.)

**Bonus mode** (age 100 or more): skip step 5 and the "Ahead of you" cards. The headline becomes "You have lived over 100 years. Every week from here is a bonus."

**Watch again:** a small text button that replays the reveal with the same date.

**D. Stat cards**

Two groups of four cards. On phone each group is a 2 x 2 grid. Each card has a simple inline SVG line icon (24px, stroke 2, `--brand`), a big number (weight 800, tabular numbers) and a label. Some have a small footnote in `--muted`.

"Ahead of you":
1. Sundays: number, label "Sundays"
2. Full moons: number, label "full moons"
3. Pongal: number, label "Pongal festivals"
4. World Cups: number, label "cricket World Cups", footnote "If they stay every 4 years"

"So far":
1. Weeks lived: label "weeks lived"
2. Days lived: label "days lived"
3. Full moons seen: label "full moons seen"
4. Heartbeats: for example "about 1.08 billion", label "heartbeats", footnote "At about 72 beats a minute"

Under the cards, a collapsible "How we count" section (`<details>`), in plain words:
- Each row is one year of your age. A year is 52 weeks plus a day or two, so the dot count can differ from your exact week count by a few.
- Full moons use the average moon cycle of 29.53 days, so any single date can be a day off.
- Pongal is counted on 14 January each year.
- World Cups: the next men's 50-over Cricket World Cup is in October and November 2027. We assume one every 4 years after that.
- Heartbeats use an average of 72 beats a minute.

**E. Dot details**
- Laptop: hovering a dot shows a small card. Phone: tapping a dot shows it, and tapping elsewhere hides it.
- Text: "Age 12, week 31" and "Around Oct 2010". For the current dot: "This week". Week numbers shown to people start at 1.
- The date is the birthday at that age plus (week index x 7) days, shown as short month and year.
- Find the dot with arithmetic from the pointer position (Section 4B layout), not by looping over all dots. Taps in a gap return nothing.

**F. Closing card and sharing**
- Title: "That is a lot of Sundays." In bonus mode: "Every week is a bonus."
- Body: "Spend a few of them learning something new."
- Buttons:
  - "Share my dots" (primary). Makes the share image (Section 4G) and opens the phone share sheet with the image file when `navigator.canShare({ files })` is true. Otherwise it downloads the image as a PNG.
  - "Send link on WhatsApp": opens `https://wa.me/?text=` plus the encoded message.
  - "Copy link": changes to "Copied" for 2 seconds. Use `navigator.clipboard.writeText` with a hidden textarea fallback.
  - "Try another date" (text button): scrolls to the top and shows the home card again, with the old values still selected.
- **Shared message:** "This is my life in dots. One dot is one week. See yours: LINK". LINK is `location.origin`. Never add the date of birth to the link.
- If the person cancels the share sheet, ignore the error quietly.

**G. Share image (`shareImage.js`)**
- 1080 x 1350 PNG (Instagram portrait size), drawn on a hidden canvas.
- Background `--bg-grad`. A 6px brand gradient bar at the top.
- Title "My life in dots" (weight 800), then the full grid in its final state with the current dot ringed.
- Line under it: "1,163 weeks lived. About 3,008 Sundays ahead." In bonus mode: "5,260 weeks lived. Every week is a bonus."
- Footer: the logo on the left, and "Make yours at" plus the site address on the right.
- No birth date anywhere on the image.

**H. Branding**
- **Header:** the logo (`assets/logo.png`, 28px tall), a thin divider, then "Your Life in Dots" in weight 800. A 3px brand gradient bar runs under the header.
- If the logo file is missing, use a clean text wordmark "Wrench Wise".
- **Footer**, small and quiet: "Built with code by Wrench Wise" and a link "Learn to build apps like this", opening in a new tab: `https://wrench-wise.com/?utm_source=life-in-dots&utm_medium=web-app&utm_campaign=life-in-dots-2026`

**I. Layout**
- **Phone portrait first.** Header, then the headline, the grid card, the legend, the stat cards, the closing card and the footer, stacked. The page scrolls.
- **At 390 x 844, the headline, the full 80-year grid and the legend must fit on one screen without scrolling.** This is the reel frame.
- **Laptop (900px and wider).** Two columns, max content width 1200px. Left: the grid card, sized to fit the viewport height. Right: the headline, stat cards and closing card.
- **General:**
  - Use `100dvh` so mobile browser bars do not cut the layout.
  - Respect notches and the home bar with `env(safe-area-inset-*)`.
  - Touch targets at least 44px.
  - No horizontal scrolling at any width from 360px up.

**J. Demo mode (for recording reels)**
- Opens with `?demo=1`. The default is 12 Jun 2004 and 80 years.
- In demo mode only, also accept `&dob=YYYY-MM-DD`, `&life=70|80|90|100` and `&today=YYYY-MM-DD`. Validate them with the same rules.
- It loops:
  1. The home card shows.
  2. A visible tap dot (a 28px translucent circle) lands on Day and the value changes to 12. Then Month to Jun, then Year to 2004, 500 ms apart. Set the values directly with a short highlight. Do not open the native pickers.
  3. The tap dot presses "80 years", then "Show my life".
  4. The full reveal plays.
  5. Hold for 4 seconds. On phone, smooth scroll to the stat cards and hold 4 seconds, then to the closing card and hold 3 seconds.
  6. Scroll back to the top and restart.
- It must look clean in both vertical (9:16 phone) and horizontal (16:9 laptop).

### Nice to have (only if time allows, in this order)
1. **GA4 events.** Only if I give you a GA4 Measurement ID.
   - Events: `dots_shown` (with one parameter, `life_years`: 70, 80, 90 or 100), `share_image`, `share_whatsapp`, `copy_link`, `cta_click`.
   - Never send the date of birth, the age or any calculated number. Set `page_location` to the page address without the query.
   - This is the only external script allowed, and only in this case.
2. **Dark theme switch.** A sun and moon toggle in the header, using the dark tokens in Section 5. First visit follows the device setting. Save the choice in `localStorage` under `lid-theme`, wrapped in try and catch. This is the only thing ever saved.
3. **Weeks, Months, Years toggle.** The same life shown as 52, 12 or 1 dot per row. Dots glide to their new places over 500 ms.
4. **Installable app.** `manifest.json` with app icons, so it can be added to the home screen.

---

## 5. Visual style: matched to wrench-wise.com

These values were measured from the live wrench-wise.com site. It uses emerald as the main brand colour, teal and cyan as accents, gray text, white cards and soft emerald-to-cyan gradients.

**Colours.** Put every colour in CSS variables in one place. JavaScript reads them with `getComputedStyle`, so there is one source of truth.

| Token | Light (default) | Dark (nice to have) |
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

**Brand gradient:** `--brand-grad: linear-gradient(90deg, #059669, #0D9488, #06B6D4)`. Use it for the primary button, the 3px bar under the header and the bar on the share image.

**Font:** the same system font stack the site uses: `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`. Headings weight 800 with letter spacing -0.01em. Body weight 400 to 500. All numbers use `font-variant-numeric: tabular-nums` so they do not jump while counting.

**Shapes:** buttons and pills fully rounded (999px). Cards 16px. Dropdowns 12px. Small chips 8px.

**Shadows (light theme)**
- `--shadow-sm: 0 1px 3px rgba(0,0,0,0.10), 0 1px 2px -1px rgba(0,0,0,0.10)`
- `--shadow-md: 0 4px 6px -1px rgba(0,0,0,0.10), 0 2px 4px -2px rgba(0,0,0,0.10)`
- `--shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -4px rgba(0,0,0,0.10)`
- In dark theme use the same shapes with `rgba(0,0,0,0.40)`.

**Meta:** a `theme-color` meta tag `#FFFFFF`. In `manifest.json`: `theme_color` `#059669`, `background_color` `#FFFFFF`.

**Contrast:** all text must reach at least 4.5 to 1 against its background. Check with DevTools.

**Motion rules**
- UI elements animate only `transform` and `opacity`. Never animate width, height, top, left or margins.
- Easing: `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)` and `--ease: cubic-bezier(0.4, 0, 0.2, 1)` (the site's own curve). Durations 150, 200, 300 and 500 ms.
- Professional and calm. Small distances. Nothing bounces more than once.
- **Reduced motion:** if `prefers-reduced-motion: reduce` is set, skip the wave and the fill (draw the final grid at once), show a still ring instead of the pulse, show numbers without counting, and fade cards in under 150 ms.

---

## 6. Date maths (`dates.js`)

Follow these definitions exactly. The self-test in Section 8 checks them.

**Day numbers.** `dayNumber(y, m, d) = Date.UTC(y, m - 1, d) / 86400000`. This gives whole days since 1 Jan 1970. Every calculation uses day numbers.

**Today.** The device's local calendar date (`getFullYear`, `getMonth`, `getDate`), converted to a day number. With `?test=1` or `?demo=1`, a `today=YYYY-MM-DD` URL value overrides it. Never otherwise.

**Adding years.** `addYears(date, n)` keeps the month and day. If that is 29 Feb in a year that is not a leap year, use 28 Feb.

**Age.** Whole years: the largest `n` where `addYears(dob, n)` is on or before today.

**Life used.**
- Start with the life the person picked (70, 80, 90 or 100).
- If their age is the same or more, move up to the smallest option bigger than their age, and show the "moved up" chip.
- If no option is bigger (age 100 or more), use bonus mode: no end date, rows = age + 1, no "Ahead" numbers.

**End date.** `addYears(dob, lifeUsed)`.

**Grid position.**
- Current row = age.
- Current week index (0 to 51) = the smaller of 51 and `floor((today - addYears(dob, age)) / 7)`.
- Lived dots = `age x 52 + weekIndex`. These are the dots before the current dot.
- Total dots = rows x 52.

**So far**
- Days lived = today minus date of birth.
- Weeks lived = `floor(days lived / 7)`. This is the number the counter shows.
- Full moons seen = full moon days from the date of birth to today, both included.
- Heartbeats = days lived x 1440 x 72.

**Ahead** (each counts dates after today, up to and including the end date)
- Sundays: 1 Jan 1970 was a Thursday, so a day number is a Sunday when `((n % 7) + 7) % 7 === 3`.
- Pongal: every 14 January.
- Cricket World Cups: 1 October of 2027, 2031, 2035 and every 4 years after.
- Full moons ahead: full moon days from tomorrow to the end date, both included.

**Full moon days.** `REF = dayNumber(2025, 1, 13) + 1347 / 1440` (the full moon at 22:27 UTC on 13 Jan 2025). `P = 29.530588853`. The k-th full moon falls on day `floor(REF + k x P)`, for any whole number k, positive or negative. To count them in a range, work out the first and last k with division, do not loop day by day.

**Number display.**
- Normal numbers: `toLocaleString("en-IN")`, for example 3,008.
- Heartbeats of 1 billion or more: "about X.XX billion" (two decimals). From 1 million: "about X million" (rounded to a whole number). Below that, the plain number.

---

## 7. Link preview (the WhatsApp card)

- **In `index.html`:**
  - Title: "Your Life in Dots by Wrench Wise"
  - Description: "One dot for every week of your life. See yours in 10 seconds."
  - Open Graph tags: `og:title`, `og:description`, `og:image`, `og:url`, `og:type` (website), plus `twitter:card` set to `summary_large_image`.
- **`og:image` and `og:url`** must be full addresses. Use a placeholder until Phase 5, then set the real live address.
- **The preview image:**
  - If I have put my own `assets/og-image.png` in the folder, use it.
  - Otherwise, build `tools/og.html` at 1200 x 630: `--bg-grad` background, a section of the dot grid with the lived part in the brand gradient, the words "Your life in dots" in weight 800, and the logo.
  - Open it in Chrome at exactly that size, save a screenshot as `assets/og-image.png`, and keep it under 300 KB.

---

## 8. Correctness checks (must pass)

### 1. Self-test

When the URL has `?test=1`, run `selftest.js` with today fixed at **2026-10-23** and log a clear PASS or FAIL table to the console. Every number below must match exactly. These were worked out twice, in two different programming languages, and both agree.

**So far**

| Case | Date of birth | Life picked | Life used | Days lived | Weeks lived | Age | Week index | Lived dots | Total dots | Full moons seen | Heartbeats text |
|---|---|---|---|---|---|---|---|---|---|---|---|
| A | 2004-06-12 | 80 | 80 | 8168 | 1166 | 22 | 19 | 1163 | 4160 | 276 | about 847 million |
| B | 1998-03-15 | 80 | 80 | 10449 | 1492 | 28 | 31 | 1487 | 4160 | 353 | about 1.08 billion |
| C | 2000-02-29 | 80 | 80 | 9733 | 1390 | 26 | 33 | 1385 | 4160 | 329 | about 1.01 billion |
| D | 2026-10-23 | 80 | 80 | 0 | 0 | 0 | 0 | 0 | 4160 | 0 | 0 |
| E | 1950-06-01 | 70 | 80 (moved up) | 27903 | 3986 | 76 | 20 | 3972 | 4160 | 944 | about 2.89 billion |
| F | 2010-12-31 | 90 | 90 | 5775 | 825 | 15 | 42 | 822 | 4680 | 195 | about 599 million |
| G | 1926-01-01 | 80 | bonus | 36820 | 5260 | 100 | 42 | 5242 | 5252 | 1246 | about 3.82 billion |

**Ahead** (case G is bonus mode and has none)

| Case | End date | Sundays | Pongal | World Cups | Full moons |
|---|---|---|---|---|---|
| A | 2084-06-12 | 3008 | 58 | 15 | 713 |
| B | 2078-03-15 | 2682 | 52 | 13 | 636 |
| C | 2080-02-29 | 2784 | 54 | 14 | 660 |
| D | 2106-10-23 | 4174 | 80 | 20 | 990 |
| E | 2030-06-01 | 188 | 4 | 1 | 45 |
| F | 2100-12-31 | 3871 | 74 | 19 | 918 |

**Also test:**
- **Validation.** 31 Feb 2001 and 29 Feb 2001 are rejected. 29 Feb 2000 is accepted. Tomorrow is rejected. Today is accepted. A missing field is rejected.
- **Sunday rule.** 25 Oct 2026 is a Sunday. 23 Oct 2026 is not.
- **Hit testing.** At 390 x 844 and 1440 x 900, for 80 rows and for 101 rows: the centre of 50 random dots maps back to the same row and week. Points inside decade gaps return nothing.
- **Privacy.** After a full run, `location.href`, `localStorage` and `sessionStorage` contain no part of the birth date.

### 2. Other checks
1. **Console.** No console errors on any screen.
2. **Speed.** In Chrome DevTools at 390 x 844 with CPU throttling set to 4x, the reveal averages above 45 fps. Report the number.
3. **Layout.** Screenshots at 360 x 740, 390 x 844, 768 x 1024 and 1440 x 900. No horizontal scroll. At 390 x 844 the headline, the whole 80-year grid and the legend fit on one screen.
4. **Brand match.** Open wrench-wise.com and the app side by side and screenshot both. Fix anything that does not look like the same company. Search the code for colour values and confirm every one comes from Section 5.
5. **Tone.** Search all user-facing text for the banned words in Rule 4. There must be none.
6. **Safety.** Search the code for `innerHTML`. It must never be used with changing values.
7. **Contrast.** All text at least 4.5 to 1.

---

## 9. Phases

### Phase 1: Date maths and self-test (target 45 min)
- **Build:** `index.html` shell, `styles.css` with every token from Section 5, `dates.js`, `stats.js`, and `selftest.js` (the date, validation, Sunday and privacy parts).
- **Report:** the full self-test table. Every number must match Section 8. Do not continue with a mismatch. Explain it in plain words instead.

### Phase 2: The grid (target 60 min)
- **Build:** `grid.js` with layout, drawing, decade gaps and labels, the legend, hit testing, the dot details card, and resize handling. Add a temporary `?preview=A` view (A to G) that draws that case's final grid instantly. Add the hit testing part of the self-test.
- **Report:**
  - Screenshots at 390 x 844 and 1440 x 900 for cases A, F and G
  - The hit testing results

### Phase 3: Home, reveal and stats (target 60 min)
- **Build:** the home card with validation, `reveal.js` with the full timeline, `counter.js`, the stat cards, "How we count", the moved up chip, bonus mode, the closing card (share buttons can be placeholders), "Watch again" and the reduced motion version.
- **Report:**
  - Screenshots of the reveal at 0.5, 2, 4, 5.5 and 8 seconds, on phone and laptop
  - fps at 390 x 844 with 4x CPU throttling
  - Click steps for me to try it in Chrome

### Phase 4: Sharing, branding and demo (target 45 min)
- **Build:**
  - `shareImage.js` and `share.js` with all three share buttons
  - Header logo, footer and UTM link
  - Link preview tags and `og-image.png`
  - Demo mode
  - Remove the temporary `?preview` view
- **Then,** only if time allows, the Nice to Have items in order.
- **Report:** the share image for cases A and G, phone and laptop screenshots, the brand match screenshots, and confirmation that demo mode loops cleanly.

### Phase 5: Docs and deploy (target 30 min)

- **README.md:**
  - What the app is and the live link
  - How to use it in 3 steps
  - How to run it locally
  - "How it works" in 5 short points: day numbers, the grid as row and column arithmetic, drawing only what changes, the full moon cycle maths, and why the date of birth never leaves the phone
  - "Built by Wrench Wise"
- **REEL_SCRIPT.md:** Two versions, one vertical (30 seconds) and one horizontal (60 seconds). Each has:
  - A hook as on-screen text in the first 2 seconds
  - A shot list matched to demo mode timing
  - On-screen captions
  - Optional voiceover lines
  - A closing line with Wrench Wise
  - No emojis, no em dashes, and none of the banned words in Rule 4
- **Deploy:**
  1. Help me push the folder to GitHub. I will give you my empty repository URL.
  2. Deploy it on Vercel as a static site.
  3. Set `og:url` and `og:image` to the live address, then redeploy.
  4. Give click-by-click steps for anything I must do myself.
  5. Confirm the live link works on a phone-sized screen, and that `?test=1` passes on the live site.
  6. Give me the final live link and the demo link.

---

## 10. Phase Report format

- **What I built** (3 to 5 bullets)
- **How to check it** (click steps)
- **Screenshots** (phone and laptop, where relevant)
- **Not working or cut,** explained in plain words
- **Time used** against the target

---

## 11. If we are running late

If I say "We're behind, apply the cut list", drop these in order:
1. Nice to Have items
2. The "So far" cards. Keep "Ahead of you".
3. The date line in the dot details card. Keep "Age 12, week 31".
4. The empty grid wave. The grid simply fades in.

Never cut:
- The fill and the pulsing current dot
- The Sundays headline
- The self-test and every number in Section 8
- The privacy rule and the tone rule
- The share image
- Demo mode
- Reduced motion rules
- Deployment
