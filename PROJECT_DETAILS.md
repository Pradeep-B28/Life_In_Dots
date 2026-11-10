# PROJECT DETAILS: YOUR LIFE IN DOTS

## 1. Quick Summary

Your Life in Dots is a web application that draws a person's entire life on a single screen using one small dot for every week. After a person chooses their birth date, the app plays an animation where past weeks fill with color, pulses on the current week, shows how many Sundays remain ahead, and provides four interactive tools to explore history, life chapters, time use, and milestones.

### Project Fact Table

| Fact | Value | Location in Code or Project |
| :--- | :--- | :--- |
| Project Name | Your Life in Dots | index.html line 8, manifest.json line 2 |
| Short Name | Life in Dots | manifest.json line 3 |
| Repository Name | Life_In_Dots | git remote origin url |
| Current Branch | main | git status |
| Last Update Date | 2 November 2026 | git log commit f8c143e |
| Last Commit Message | fix: resolve dateInput runtime error, fix CSS syntax issues, and enhance mobile responsiveness | git log commit f8c143e |
| Author | B Pradeep (Pradeep-B28) and Wrench Wise | LICENSE line 3, README.md line 6 |
| License | MIT License | LICENSE lines 1 to 21 |
| Live Web Link | https://lifeindots.vercel.app | index.html line 15, README.md line 3 |
| Hosting Service | Vercel (static site hosting) | README.md line 3, UPGRADE_BRIEF.md Section 9 |
| Total Files in Project Folder | 51 original files (plus 8 screenshots in docs/screenshots) | project directory |
| Total Lines of Text and Code | 8,647 lines | all text files combined |
| Number of JavaScript Files | 30 files in js folder (plus history-data.js in root) | js/ |
| Number of CSS Style Files | 7 files | root directory |
| Number of HTML Files | 4 files (index.html plus 3 tool helper pages) | root and tools/ |
| External Libraries or Frameworks | 0 (pure vanilla HTML5, CSS3, and JavaScript) | README.md line 14 |
| Total Historical Events in Data | 31 events | js/history-data.js lines 12 to 44 |
| Historical Category Filters | 5 filters (All, Cricket, Space, Tamil Nadu, More) | js/history-data.js lines 47 to 53 |
| Fixed Day Milestones | 10 fixed milestones | js/milestones.js lines 16 to 27 |
| Astronomical and Planetary Milestones | 2 dynamic milestones (1,000th Full Moon, Next Mars Birthday) | js/milestones.js lines 66 to 80 |
| Time Budget Categories | 6 categories (Sleep, Work, Travel, Phone, Learn, Free time) | js/timebudget.js lines 6 to 13 |
| Default Life Span Options | 4 options: 70, 80, 90, 100 years | js/ui.js line 99, js/dates.js line 83 |
| Standard Grid Columns | 52 columns (one dot for each week in a year) | js/grid.js line 41 |
| Standard 80-Year Grid Dots | 4,160 dots (80 rows multiplied by 52 columns) | js/selftest-data.js line 18 |
| Automated Self-Test Pass Rate | 100 percent (75 passed checks across 7 test suites) | js/selftest.js runSelfTest, ?test=1 |

---

## 2. Purpose

### The Problem It Solves
Most people think about their lifespan in years. Thinking in years makes life feel abstract and distant. When people look at a calendar, they see days and months that slip away without a clear picture of the whole journey. This app translates a lifetime into a concrete geometric picture: one dot for every single week. Seeing 52 dots in a row and seeing all 80 rows together gives people an immediate, honest perspective on where they stand in time (README.md lines 12 to 13).

### Who It Is For
1. General public on social platforms (such as WhatsApp, Instagram, and LinkedIn) who have no technical background and need to understand the visual within 3 seconds (PROJECT_BRIEF.md Section 1).
2. Students and young learners who want to understand how their daily hours and weekly habits compound over 10 to 20 years (REEL_SCRIPT.md lines 146 to 179).
3. Viewers of video reels (vertical 9 by 16 format and horizontal 16 by 9 format) who look for engaging stories about life, astronomy, and history (REEL_SCRIPT.md lines 8 to 214).
4. Coding students and parents who want to see real-world examples of professional web apps built without bloated libraries (index.html lines 76 to 77).

### Why It Was Built
The project was created to deliver an uplifting, positive message about time. The core philosophy is hopeful rather than gloomy. It emphasizes how much time people still have in front of them, rather than warning that time is running out (PROJECT_BRIEF.md Section 1). Words such as "death", "die", "time left", "countdown", or "expire" are strictly forbidden in the codebase and user interface (PROJECT_BRIEF.md Section 2 Rule 4).

### Connection to Wrench Wise Programs
The app connects directly to the educational mission of Wrench Wise (wrench-wise.com), an academy teaching practical software engineering. Every screen carries subtle Wrench Wise branding, and the footer includes a tracking link to invite learners to build similar applications (index.html lines 74 to 77). The Time tool includes a direct call to action encouraging users to swap one hour of social media for learning technical skills at Wrench Wise (js/timebudget-ui.js lines 248 to 255).

---

## 3. How to Open It

### Live Link
The application is deployed live on the web at:
`https://lifeindots.vercel.app` (index.html line 15, README.md line 3).

### Step-by-Step Instructions to Run Locally on a Laptop
The application requires zero compilation, zero bundlers, zero npm installations, and zero database setup (README.md line 60).

1. Open your terminal or command prompt (such as PowerShell on Windows, or Terminal on macOS).
2. Navigate to the project directory:
   ```bash
   cd "C:\Projects\Wrench-Wise\3 Life_in_Dots"
   ```
3. Start any standard local static web server. You can choose any of the following commands:
   - Using Python 3:
     ```bash
     python -m http.server 8000
     ```
   - Using Node.js (npx serve):
     ```bash
     npx serve .
     ```
4. Open your web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Apple Safari).
5. Visit the printed address, typically:
   ```
   http://localhost:8000/
   ```
6. The app will open immediately.

### Special Link Options (URL Query Parameters)
The application reads special query parameters from the address bar to support testing, automated demonstrations, video recordings, and direct tab jumps (js/main.js lines 341 to 368).

| Query Parameter | Example URL | Exact Behavior in Code |
| :--- | :--- | :--- |
| `?test=1` | `http://localhost:8000/?test=1` | Runs the automated self-test suite against the fixed reference date of 23 October 2026. Hides the home form and renders 7 structured verification tables in `#test-output` (js/main.js lines 355 to 359). |
| `?demo=1` | `http://localhost:8000/?demo=1` | Starts an autonomous reel demonstration loop. An animated green tap dot enters the screen, automatically picks Day 12, Month Jun, Year 2004, taps 80 years, triggers the reveal, tours all 4 tabs, and loops continuously (js/demo.js lines 43 to 252). |
| `?dob=YYYY-M-D` | `http://localhost:8000/?dob=2004-6-12` | Pre-fills the birth date dropdowns on the home card with the given year, month, and day (js/main.js lines 350 to 353). |
| `?life=N` | `http://localhost:8000/?life=90` | Pre-selects the lifespan horizon pill (valid numbers: 70, 80, 90, 100) (js/main.js line 352, js/demo.js lines 34 to 38). |
| `?tab=name` or `?view=name` | `http://localhost:8000/?dob=2004-6-12&tab=history` | Automatically skips the opening animation and immediately opens the specified tab. Valid options are `overview`, `history`, `chapters`, `time`, and `milestones` (js/main.js lines 344, 363 to 367). |
| `?seek=seconds` | `http://localhost:8000/?dob=2004-6-12&seek=5.0` | Jumps the reveal animation to an exact second mark (such as 0.8, 1.8, 3.0, 5.0, 8.5, or 14.5 seconds). Used for inspection and timing verification (js/main.js line 365, js/reveal.js lines 347 to 352). |
| `?theme=dark` or `?theme=light` | `http://localhost:8000/?theme=dark` | Overrides the browser theme and sets either dark theme (`#0F172A`) or light theme (`#FFFFFF`) (js/theme.js lines 6 to 9). |
| `?today=YYYY-MM-DD` | `http://localhost:8000/?test=1&today=2026-10-23` | Overrides today's reference date for calendar calculations in test and demo modes (js/dates.js lines 38 to 44, js/main.js line 356). |


---

## 4. Every Screen and Every Feature

The application contains two core screens: the Home Input Screen and the Reveal and Exploration Screen. The Reveal Screen hosts five view modes: Overview, History, Chapters, Time, and Milestones (js/layers.js lines 4 to 10, js/tabs.js lines 12 to 17).

### Screen 1: Home Input Screen

#### What It Does
This screen welcomes the person, explains that one dot represents one week of human life, and collects the user's birth date and chosen lifespan horizon (styles.css lines 169 to 219, js/ui.js lines 39 to 183).

#### What the Person Sees
- Top header with the Wrench Wise logo (assets/logo.png), a vertical divider, the application title "Your Life in Dots", a theme toggle button, and an audio mute toggle button (index.html lines 49 to 64).
- A central white card (dark slate in dark theme) with a soft shadow and rounded corners (styles.css line 170).
- An emerald eyebrow chip with the text "ONE DOT = ONE WEEK" (js/ui.js line 45).
- Title: "Your Life in Dots" and subtitle: "See every week of your life on one screen." (js/ui.js lines 46 to 47).
- Form label: "Your date of birth" positioned above three dropdown selectors: Day, Month, and Year (js/ui.js lines 54 to 84).
- Form label: "Picture a life of" positioned above four horizon pill buttons: "70 years", "80 years", "90 years", and "100 years" (js/ui.js lines 91 to 115).
- A note below the pills: "This is a picture, not a prediction." (js/ui.js line 119).
- A full-width emerald-to-cyan gradient button: "Show my life" (js/ui.js lines 122 to 126).
- A privacy guarantee note at the bottom: "Your date of birth stays on this device. Nothing is sent or saved." (js/ui.js lines 128 to 131).

#### How to Use It in Click Steps
1. Tap the Day dropdown and choose your birth day from 1 to 31 (js/ui.js line 66).
2. Tap the Month dropdown and choose your birth month from Jan to Dec (js/ui.js line 72).
3. Tap the Year dropdown and choose your birth year from the current year down 100 years (js/ui.js line 79).
4. Tap one of the lifespan horizon pills (70, 80, 90, or 100 years). By default, 80 years is pre-selected (js/ui.js lines 98 to 108).
5. Tap the primary gradient button labeled "Show my life" (js/ui.js line 125).

#### Validation and Error States
If the person enters incomplete or impossible dates, an error message appears in red text above the lifespan pills, and the form will not submit (js/ui.js lines 145 to 163):
- Leaving any dropdown empty displays: "Please pick your full date of birth." (js/dates.js line 161).
- Picking a non-existent date (such as 31 February or 29 February on a non-leap year) displays: "That date does not exist. Please check the day." (js/dates.js line 174).
- Picking a date in the future displays: "That date is in the future." (js/dates.js line 179).

---

### Screen 2: The Cinematic Reveal Animation

#### What It Does
When the form is submitted, the app runs an automated 16-second cinematic story that connects the person's birth date to the geometry of time (UPGRADE_BRIEF.md Section 4A, js/reveal.js lines 58 to 307).

#### Step-by-Step Sequence
1. **0.0 to 0.5 seconds (Home Exit):** The home card fades upward while the results container gently scales up and fades in (js/reveal.js lines 129 to 145).
2. **0.5 to 3.5 seconds (Cinematic Camera Intro):** The virtual camera zooms in to show a single dot growing at 40 percent of screen width with the caption "This is one week." The camera pans and zooms out to Row 0, popping 51 dots into place with the caption "52 weeks make one year." Finally, the camera zooms out to scale 1.0 as all 80 rows cascade downward in a wave with the caption "This is a life of 80 years." A lowpass sound swell rises softly in the background (js/camera.js lines 31 to 139, js/audio.js lines 60 to 94). A "Skip" button appears in the upper right corner (js/reveal.js lines 147 to 151).
3. **3.5 to 7.1 seconds (The Lived Fill):** Lived weeks fill with color row by row from top left to bottom right. Dots shift from emerald to teal to cyan. The live headline counter counts from 0 up to the person's lived weeks. A gentle 40-millisecond audio tick plays once for each decade row crossed (js/reveal.js lines 177 to 204, js/audio.js lines 107 to 132).
4. **7.1 to 7.8 seconds (You Are Here):** The dot representing the current week lands, expands to 1.8 times its normal size, and settles into a 2-second rhythmic pulsing ring. A pointer line points to a pill label reading "You are here", accompanied by a high-frequency two-note chime at 660 Hz and 990 Hz (js/reveal.js lines 218 to 247, js/audio.js lines 134 to 160).
5. **7.8 to 13.8 seconds (Historical Flashback):** Up to three memorable historical events from the person's lived life flash on the canvas as pulsating amber dots. Each event appears for 2 seconds with an audio pop sound (triangle glide from 520 to 780 Hz) and a caption pill, such as: "You were 6 when India won the Cricket World Cup for the second time." (js/reveal.js lines 250 to 264, js/history.js lines 59 to 89, js/audio.js lines 163 to 184).
6. **13.8 to 15.2 seconds (The Turn):** A three-note major chord (392, 494, 587 Hz) plays as the headline counts up to show future Sundays: "You have about 3,008 Sundays ahead." The subline clarifies: "In a life of 80 years. Every grey dot is a week still ahead of you." (js/reveal.js lines 270 to 289, js/audio.js lines 187 to 210).
7. **15.2 seconds onwards (Cards and Tools Entry):** The stat cards animate into view with numeric count-ups, the closing card appears, and the tool tabs become active (js/reveal.js lines 292 to 306).

#### Skip and Reduced Motion
- Tapping the "Skip" button immediately cancels all running sounds and skips directly to the finished state (js/reveal-helpers.js lines 114 to 168).
- When a user's operating system requests reduced motion, the app skips all canvas zooming and ticks. It displays the full grid instantly, lists the flashback events in a quiet card, and presents the final statistics without animation (js/reveal-helpers.js lines 55 to 112).

---

### Screen 3: Tool Tab 1: Overview

#### What It Does
The Overview tab presents the complete life map alongside comprehensive life statistics, calculation details, and sharing options (js/layers.js lines 34 to 50, js/ui.js lines 185 to 396).

#### What the Person Sees
1. **The Grid Canvas:** Displays all weeks. Past weeks are colored with the brand gradient. The current week pulses with an outer ring. Future weeks are quiet grey dots (js/grid-draw.js lines 84 to 109).
2. **Interactive Tooltip:** Hovering (on laptop) or tapping (on phone) any dot shows a card stating its age, week number, and approximate month and year (such as "Age 12, week 31. Around Oct 2016.") (js/grid.js lines 200 to 230).
3. **Moved-Up Chip (Conditional):** If the person is older than the lifespan they picked, an emerald chip announces that the grid has moved up (such as "You have already lived past 70, so this shows 80 years.") (js/grid.js lines 82 to 87).
4. **Grid Legend:** Sits below the canvas showing sample dots for "Lived", "This week", and "Ahead" (js/layers.js lines 193 to 205).
5. **Ahead of You Stat Cards:** Four white cards counting Sundays, full moons, Pongal mornings, and cricket World Cups remaining ahead (js/ui.js lines 203 to 242).
6. **So Far Stat Cards:** Four white cards counting weeks lived, days lived, full moons seen, and heartbeats experienced so far (js/ui.js lines 256 to 294).
7. **Collapsible "How We Count":** An expandable accordion detailing the astronomical and calendar rules used (js/ui.js lines 296 to 308).
8. **Closing Card:** Displays a reflective closing message ("That is a lot of Sundays. Spend a few of them learning something new."), a format toggle between Post (1080 by 1350) and Status (1080 by 1920), a "Share my dots" button, a WhatsApp share button, a "Copy link" button, and links to "Try another date" or "Watch again" (js/ui.js lines 314 to 395).

---

### Screen 4: Tool Tab 2: History

#### What It Does
The History tool links personal time with public memory. It plots major moments from Indian and world history directly onto the person's canvas (UPGRADE_BRIEF.md Section 4E, js/history.js lines 91 to 280).

#### What the Person Sees
1. **Filter Chips Bar:** Five chips at the top: "All", "Cricket", "Space", "Tamil Nadu", and "More" (js/history.js lines 106 to 122).
2. **Canvas Highlights:** Every week containing a historical event lights up in warm amber (`#D97706`). All other lived and future dots dim to 30 percent opacity so historical moments stand out (js/layers.js lines 53 to 80).
3. **Chronological Event List:** Cards for each lived event showing its date, title, and an age chip stating how old the user was when it happened (for example, "15 Aug 1982 | Colour TV | You were 6") (js/history.js lines 159 to 204).
4. **Interactive Dot Jump:** Tapping any event card pulses that dot on the canvas, opens its tooltip, and smooth-scrolls the canvas to center the row (js/history.js lines 190 to 201, js/main.js lines 206 to 212).
5. **Collapsible "Before Your First Dot":** At the bottom of the list, an accordion summarizes events that took place before the person was born (such as "11 moments happened before you were born") (js/history.js lines 231 to 262).
6. **Footnote:** "Dates as reported in India. One dot can hold more than one moment." (js/history.js lines 265 to 268).

---

### Screen 5: Tool Tab 3: Chapters

#### What It Does
The Chapters tool allows people to partition their lived weeks into named, colored life eras (such as School, College, First job, or New city) (UPGRADE_BRIEF.md Section 4F, js/chapters.js lines 1 to 206, js/chapters-ui.js lines 1 to 381).

#### What the Person Sees
1. **Preset Chips:** A top bar with quick-add chips: "+ School", "+ College", "+ First job", "+ New city", and "+ Custom" (js/chapters-ui.js lines 45 to 63).
2. **Chapter Cards:** Up to 8 chapter rows. Each card provides:
   - A circular color button that cycles through eight palette colors (`--ch-1` to `--ch-8`) (js/chapters-ui.js lines 129 to 141).
   - A text box for the chapter name, limited to 20 letters (js/chapters-ui.js lines 144 to 156).
   - Start month and year dropdown selectors (js/chapters-ui.js lines 188 to 233).
   - End month and year dropdown selectors, accompanied by a "Still going" checkbox for ongoing chapters (js/chapters-ui.js lines 247 to 321).
   - A trash can icon button to delete the chapter (js/chapters-ui.js lines 159 to 168).
3. **Canvas Painting:** Lived dots in the grid immediately repaint with the chosen chapter colors. Any lived dots not assigned to a chapter turn soft mint green (`--dot-unassigned`) (js/layers.js lines 83 to 96).
4. **Overlap Resolution:** Where two chapters overlap, the chapter placed lower in the list wins and colors the dot (js/chapters.js lines 188 to 205).
5. **Validation Errors:** If dates are invalid (such as an end date before a start date, or a date before birth), the card highlights with a red border and specific error text (js/chapters-ui.js lines 329 to 340).

---

### Screen 6: Tool Tab 4: Time

#### What It Does
The Time tool takes daily hours spent on routine activities and projects them across future weeks, showing how small daily choices compound over decades (UPGRADE_BRIEF.md Section 4G, js/timebudget.js lines 1 to 138, js/timebudget-ui.js lines 1 to 386).

#### What the Person Sees
1. **Range Selection Pills:** Three options: "Next year" (52 weeks), "Next 10 years" (520 weeks, default), and "All weeks ahead" (js/timebudget-ui.js lines 56 to 73).
2. **Perspective Highlights Box:** Two prominent text lines, such as: "Your phone gets about 65 weeks of your next 10 years. Learning gets about 22 weeks. That is about 3,640 hours." (js/timebudget-ui.js lines 76 to 84).
3. **Stacked Time Bar:** A clean horizontal bar segmented proportionally into Sleep (indigo), Work (cyan), Travel (amber), Phone (rose), Learning (emerald), and Free time (teal) (js/timebudget-ui.js lines 87 to 103).
4. **Swap Button and Scale Pop Animation:** A button labeled "Swap 1 hour of phone for learning". Tapping it subtracts 1 hour from phone screens and adds 1 hour to learning. An emerald pill pops with the text "+21 weeks of learning", while corresponding dots on the canvas animate with a bouncy pop and turn emerald (js/timebudget-ui.js lines 106 to 119, 350 to 377, js/grid.js lines 297 to 337).
5. **Results Table:** Displays the total weeks and equivalent years for each life activity (js/timebudget-ui.js lines 121 to 156).
6. **Daily Sliders:** Sliders with 0.5-hour increments for Sleep (4 to 12 h), Work (0 to 16 h), Travel (0 to 6 h), Phone (0 to 12 h), and Learn (0 to 8 h), plus a read-only row calculating remaining Free time (js/timebudget-ui.js lines 159 to 239).
7. **Canvas Coloring:** Future weeks ahead on the canvas recolor to reflect the exact week proportions computed by the sliders (js/layers.js lines 99 to 126).
8. **Bonus Mode Card:** If the user is over 100 years old, sliders are replaced with: "Every week from here is a bonus. Spend them your way." (js/timebudget-ui.js lines 27 to 30).
9. **Educational CTA Link:** "Want to put those hours to work? See what you can learn at Wrench Wise" linking to wrench-wise.com (js/timebudget-ui.js lines 248 to 255).

---

### Screen 7: Tool Tab 5: Milestones ("Nerd Birthdays")

#### What It Does
The Milestones tool calculates unusual personal anniversaries that standard calendars overlook, such as reaching 10,000 days of age, living one billion seconds, or turning 12 on Mars (UPGRADE_BRIEF.md Section 4H, js/milestones.js lines 1 to 183, js/milestones-ui.js lines 1 to 293).

#### What the Person Sees
1. **Next-Up Spotlight Card:** A prominent card at the top highlighting the very next upcoming landmark (such as "You turn 12 on Mars • in about 2 months • You will be 22") with an "Add to calendar" button (js/milestones-ui.js lines 70 to 147).
2. **Chronological Landmarks List:** Cards for all 12 tracked milestones:
   - 1,000 weeks old (7,000 days)
   - 10,000 days old
   - 1 billion seconds old (11,574 days)
   - 2,000 weeks old (14,000 days)
   - 20,000 days old
   - 3,000 weeks old (21,000 days)
   - 2 billion seconds old (23,148 days)
   - 25,000 days old
   - 4,000 weeks old (28,000 days)
   - 30,000 days old
   - 1,000th full moon (astronomical calculation)
   - Next Mars birthday (based on 686.98 Earth days per Mars orbit)
3. **Status Badges:** Completed milestones carry a green checkmark badge labeled "Done". Milestones occurring today display an active "Today!" badge. Upcoming milestones display relative time ("in about 5 years") and an "Add to calendar" button (js/milestones-ui.js lines 177 to 245).
4. **Canvas Diamond Markers:** Milestones appearing within the visible lifespan display an cyan ring marker on the canvas. Past milestones show a filled ring; future milestones show a hollow ring (js/layers.js lines 129 to 143).
5. **Interactive Selection:** Tapping any milestone with a canvas marker pulses the marker and smooth-scrolls to that row (js/milestones-ui.js lines 247 to 262).
6. **One-Tap Calendar Export:**
   - On Android devices: opens a pre-filled Google Calendar event URL in a new browser tab (js/milestones-ui.js lines 20 to 24, js/milestones.js lines 173 to 183).
   - On laptop and iPhone devices: generates and downloads an RFC 5545 `.ics` file named `nerd-birthday.ics` ready to import into Apple Calendar, Outlook, or Google Calendar (js/milestones-ui.js lines 5 to 16, js/milestones.js lines 142 to 171).
7. **Scientific Footnotes:** Three notes explaining leap-second timing limits, Mars orbital period (686.98 days), and synodic full moon averages (js/milestones-ui.js lines 269 to 285).

---

### Phone versus Laptop Screen Differences

| Feature | Phone Layout (under 900 pixels wide) | Laptop Layout (900 pixels wide and up) | Code Location |
| :--- | :--- | :--- | :--- |
| Overall Layout Structure | Single column vertical stack. Canvas sits at top; overview content scrolls below it. | Side-by-side two-column split layout. Left column holds sticky canvas card; right column holds content. | styles.css lines 352 to 365 |
| Navigation Control | Fixed bottom navigation bar with icons and labels (64 pixels high plus safe area padding). | Pill-shaped segmented control tabs sitting horizontally at top of right column. | tabs.css lines 14 to 65, 176 to 210 |
| Tool Panel Presentation | Opens inside an animated modal bottom sheet sliding up from bottom (height min 52dvh or 460px). | In-place tab replacement. Switching tabs replaces right-column content instantly without popups. | tabs.css lines 85 to 174, js/tabs.js lines 170 to 224 |
| Overview Visibility | Overview content remains visible on the page behind the sheet. Closing sheet returns to overview. | "Overview" is an explicit tab in the segmented control. Selecting a tool hides overview. | js/tabs.js lines 182 to 186 |
| Sheet Drag Handle and Close | Sheet features a grey pill handle for dragging and a dedicated "Done" button. Backdrop tap closes sheet. | No bottom sheet, no drag handle, no backdrop, and no "Done" button. | tabs.css lines 113 to 126, 151 to 163 |
| Canvas Aspect and Dot Size | Dot pitch `s` is computed from available card width (`widthForCols / 52`). Height flows naturally. | Dot pitch `s` considers both available width and window height to ensure the whole 80-year grid fits on screen. | js/grid.js lines 26 to 50 |
| Dot Inspection | Single tap opens tooltip above dot; tapping outside dismisses it. | Hovering with mouse displays tooltip dynamically; mouse leave hides it. | js/grid.js lines 340 to 352 |

---

## 5. Every Control

The following table documents every interactive control in the project, its screen location, its exact label or icon, and what happens when activated.

| Control Type | Label / Icon | Screen Location | Action in Code and on Screen | File and Function |
| :--- | :--- | :--- | :--- | :--- |
| Button | Sun / Moon Icon | Header, top right | Toggles between light theme (`#FFFFFF`) and dark theme (`#0F172A`). Updates `data-theme` attribute on `<html>` and saves choice to `localStorage` key `lid-theme`. | js/theme.js, initTheme |
| Button | Speaker with Soundwaves / Cross Icon | Header, top right | Toggles Web Audio sound synthesis on or off. Updates master gain volume between 0.8 and 0, and saves mute state to `localStorage` key `lid-muted`. | js/audio.js, toggleMute |
| Select Dropdown | "Day" (options 1 to 31) | Home card, left dropdown | Updates the day component of the birth date. | js/ui.js, createHomeCard |
| Select Dropdown | "Month" (options Jan to Dec) | Home card, middle dropdown | Updates the month component of the birth date (1 to 12). | js/ui.js, createHomeCard |
| Select Dropdown | "Year" (current year down 100 years) | Home card, right dropdown | Updates the birth year component of the birth date. | js/ui.js, createHomeCard |
| Button Pill | "70 years" | Home card, horizon row | Sets chosen lifespan to 70 years (3,640 total weeks). Highlights active pill. | js/ui.js, createHomeCard |
| Button Pill | "80 years" | Home card, horizon row | Sets chosen lifespan to 80 years (4,160 total weeks). Default active selection. | js/ui.js, createHomeCard |
| Button Pill | "90 years" | Home card, horizon row | Sets chosen lifespan to 90 years (4,680 total weeks). Highlights active pill. | js/ui.js, createHomeCard |
| Button Pill | "100 years" | Home card, horizon row | Sets chosen lifespan to 100 years (5,200 total weeks). Highlights active pill. | js/ui.js, createHomeCard |
| Primary Button | "Show my life" | Home card, bottom | Validates date input, hides home card, initializes canvas, and launches cinematic reveal animation. | js/ui.js, createHomeCard; js/main.js, showMyLife |
| Button | "Skip" | Grid card, top right (during intro and fill) | Cancels intro camera, fill loops, and sounds; jumps directly to final statistics and opens tabs. | js/reveal.js, skipToFinal; js/reveal-helpers.js, performSkipToFinal |
| Tab Button | History (Clock icon + "History") | Phone bottom bar & Laptop tabs | Switches active view to History. Highlights amber event dots, dims other dots to 0.3 opacity, opens event list. | js/tabs.js, handleTabSelect; js/layers.js, getDotLayerStyle |
| Tab Button | Chapters (Book icon + "Chapters") | Phone bottom bar & Laptop tabs | Switches active view to Chapters. Repaints canvas with assigned chapter colors and unassigned mint dots. | js/tabs.js, handleTabSelect; js/layers.js, getDotLayerStyle |
| Tab Button | Time (Clock with hands + "Time") | Phone bottom bar & Laptop tabs | Switches active view to Time. Colors future weeks ahead according to slider percentages. | js/tabs.js, handleTabSelect; js/layers.js, getDotLayerStyle |
| Tab Button | Milestones (Star/Polygon icon + "Milestones") | Phone bottom bar & Laptop tabs | Switches active view to Milestones. Draws cyan ring markers on canvas for tracked milestone dates. | js/tabs.js, handleTabSelect; js/layers.js, getDotLayerStyle |
| Tab Button | "Overview" | Laptop segmented bar (top right) | Returns laptop layout to default statistics, cards, and gradient lived dots. | js/tabs.js, updateActiveState |
| Button | "Done" | Phone bottom sheet header (top right) | Closes mobile tool bottom sheet and returns view to Overview mode. | js/tabs.js, closeSheet |
| Backdrop Overlay | Dark translucent sheet background | Phone screen (when sheet open) | Tapping the dark backdrop closes the open bottom sheet. | js/tabs.js, closeSheet |
| Filter Chip | "All" | History panel, filter bar | Filters history list to show all 31 historical moments. | js/history.js, renderList |
| Filter Chip | "Cricket" | History panel, filter bar | Filters history list to cricket milestones (World Cups, Champions Trophies). | js/history.js, renderList |
| Filter Chip | "Space" | History panel, filter bar | Filters history list to space exploration events (Moon walks, Chandrayaan, Mars). | js/history.js, renderList |
| Filter Chip | "Tamil Nadu" | History panel, filter bar | Filters history list to Tamil Nadu regional history events. | js/history.js, renderList |
| Filter Chip | "More" | History panel, filter bar | Filters history list to India, tech, athletics, and global world events. | js/history.js, renderList |
| List Item Row | Historical Event Row | History panel list | Tapping an event pulses its dot on the canvas in amber, displays its tooltip, and scrolls canvas to its row. | js/history.js, onSelectEvent; js/grid.js, pulseDot |
| Accordion | "N moments happened before you were born" | History panel bottom | Expands to list pre-birth historical moments and years. | js/history.js, createHistoryPanel |
| Preset Chip | "+ School" | Chapters panel top bar | Adds pre-configured School chapter (age 5 June to age 16 March) with next unused color. | js/chapters-ui.js, getPresetChapter |
| Preset Chip | "+ College" | Chapters panel top bar | Adds pre-configured College chapter (age 17 July to age 21 May) with next unused color. | js/chapters-ui.js, getPresetChapter |
| Preset Chip | "+ First job" | Chapters panel top bar | Adds pre-configured First job chapter with "Still going" enabled. | js/chapters-ui.js, getPresetChapter |
| Preset Chip | "+ New city" | Chapters panel top bar | Adds pre-configured New city chapter with "Still going" enabled. | js/chapters-ui.js, getPresetChapter |
| Preset Chip | "+ Custom" | Chapters panel top bar | Adds blank custom chapter card with empty name and date fields. | js/chapters-ui.js, getPresetChapter |
| Button Swatch | Circular Color Swatch | Chapter card header | Cycles chapter color through the 8 defined palette colors (`--ch-1` to `--ch-8`). | js/chapters-ui.js, line 134 |
| Text Input | Chapter name text box | Chapter card header | Updates chapter name (max 20 characters). Debounces canvas update by 150 ms. | js/chapters-ui.js, line 152 |
| Button Icon | Trash Can SVG | Chapter card header (right) | Deletes the chapter card and immediately recalculates dot chapter ranges. | js/chapters-ui.js, line 164 |
| Checkbox | "Still going" | Chapter card dates row | Marks chapter as ongoing up to today. Disables end month and year dropdowns. | js/chapters-ui.js, line 296 |
| Toggle Pill | "Next year" | Time panel top bar | Sets projection horizon to next 52 weeks. Recalculates time allocations. | js/timebudget-ui.js, line 328 |
| Toggle Pill | "Next 10 years" | Time panel top bar | Sets projection horizon to next 520 weeks (default). Recalculates time allocations. | js/timebudget-ui.js, line 328 |
| Toggle Pill | "All weeks ahead" | Time panel top bar | Sets projection horizon to all remaining weeks ahead in visible lifespan. | js/timebudget-ui.js, line 328 |
| Button | "Swap 1 hour of phone for learning" | Time panel action row | Decrements phone slider by 1, increments learning slider by 1, pops "+N weeks" chip, and animates dots. | js/timebudget-ui.js, line 351 |
| Range Slider | Sleep Slider (4 to 12 h) | Time panel sliders section | Adjusts daily sleep hours in 0.5 h steps. Updates stacked bar and canvas in real time. | js/timebudget-ui.js, line 222 |
| Range Slider | Work Slider (0 to 16 h) | Time panel sliders section | Adjusts daily work or study hours in 0.5 h steps. | js/timebudget-ui.js, line 222 |
| Range Slider | Travel Slider (0 to 6 h) | Time panel sliders section | Adjusts daily commuting and travel hours in 0.5 h steps. | js/timebudget-ui.js, line 222 |
| Range Slider | Phone Slider (0 to 12 h) | Time panel sliders section | Adjusts daily phone and screen leisure hours in 0.5 h steps. | js/timebudget-ui.js, line 222 |
| Range Slider | Learn Slider (0 to 8 h) | Time panel sliders section | Adjusts daily deliberate learning hours in 0.5 h steps. | js/timebudget-ui.js, line 222 |
| Button | "Add to calendar" | Milestones next-up card & list | Triggers calendar export. On Android opens Google Calendar URL; on laptop/iOS downloads `.ics` file. | js/milestones-ui.js, handleCalendarAction |
| List Item Card | Milestone item row | Milestones list | Tapping a milestone with a marker pulses its diamond ring on the canvas and scrolls to its row. | js/milestones-ui.js, onMilestoneSelect |
| Toggle Button | "Post" | Share wrap (all panels and closing card) | Selects 1080 by 1350 pixel aspect ratio for downloadable and shareable PNG images. | js/share.js, setShareSize |
| Toggle Button | "Status" | Share wrap (all panels and closing card) | Selects 1080 by 1920 pixel aspect ratio (9 by 16 vertical) for status stories. Default active format. | js/share.js, setShareSize |
| Primary Button | "Share my dots" | Share wrap (all panels and closing card) | Generates high-resolution PNG offscreen; invokes native Web Share API or downloads file. | js/share.js, handleShareDots |
| Button | "Send link on WhatsApp" | Closing card | Opens WhatsApp web or app intent with pre-filled message: "This is my life in dots. One dot is one week..." | js/share.js, handleShareWhatsApp |
| Button | "Copy link" | Closing card | Copies application URL to clipboard; changes button label to "Copied" for 2 seconds. | js/share.js, handleCopyLink |
| Text Button | "Try another date" | Closing card bottom | Resets UI state, clears result section, and returns user to the home date form. | js/main.js, onTryAnother |
| Text Button | "Watch again" | Closing card bottom | Re-executes the complete cinematic reveal timeline from second 0.0 without changing date inputs. | js/main.js, onWatchAgain |
| Accordion | "How we count" | Results section bottom | Expands to reveal detailed plain-language explanations of calculations. | js/ui.js, createStatCards |
| Canvas Dot | Individual Grid Dot | Canvas surface | Hovering (laptop) or tapping (phone) any dot opens an inspection tooltip with age and calendar date. | js/grid.js, handlePointer |
| Keyboard | Tab / Shift+Tab | Anywhere on page | Standard browser keyboard navigation between form fields, tabs, buttons, and milestone cards. | index.html, browser native |
| Keyboard | Enter / Space | Focused interactive element | Activates focused buttons, tabs, accordions, and list items. | js/history.js line 197, js/milestones-ui.js line 256 |


---

## 6. One Full Journey

This walkthrough follows one real person using the application with verified real-world numbers from the test suite (Case A from PROJECT_BRIEF.md Section 8 and UPGRADE_BRIEF.md Section 7).

### Profile Used
- **Date of Birth:** 12 June 2004 (`2004-06-12`).
- **Lifespan Horizon Picked:** 80 years.
- **Reference Date (Today):** 23 October 2026 (`2026-10-23`).

### Step-by-Step Experience

#### Step 1: Arriving at the Home Screen
- **On Screen:** The user opens `https://lifeindots.vercel.app`. The page loads with a soft green-to-cyan gradient background. In the center sits the white card titled "Your Life in Dots" with the subtitle "See every week of your life on one screen." The Day, Month, and Year dropdowns show their default placeholder labels ("Day", "Month", "Year"). The "80 years" pill is highlighted in emerald.
- **In Code:**
  1. `index.html` loads and runs the inline theme script to check `localStorage` for `lid-theme` and matches system color schemes (index.html lines 30 to 37).
  2. `js/main.js` calls `initTheme()` and `initAudio()` (js/main.js lines 338 to 339).
  3. `js/main.js` calls `createHomeCard()` which renders the form inside `#app-content` (js/main.js line 328, js/ui.js lines 39 to 183).

#### Step 2: Entering Birth Information
- **On Screen:** The user clicks the Day dropdown and selects "12". They click the Month dropdown and select "Jun". They click the Year dropdown and scroll to select "2004". They leave the lifespan pill at "80 years".
- **In Code:**
  1. The form element captures `change` events on each dropdown selector (js/ui.js lines 63 to 80).
  2. Internal variables hold `selectedLife = 80` (js/ui.js line 98).

#### Step 3: Submitting the Form
- **On Screen:** The user taps the primary gradient button labeled "Show my life".
- **In Code:**
  1. The form `submit` listener triggers and clears any previous error text (js/ui.js lines 145 to 148).
  2. `validateDate(2004, 6, 12, 20749)` runs. It confirms that 12 June 2004 is a real calendar date and falls before today (day number 20,749) (js/dates.js lines 157 to 188).
  3. `getAudioContext()` initializes the browser's Web Audio API context upon user gesture (js/audio.js lines 12 to 36).
  4. `calculateLifeStats()` computes all lifespan statistics (js/stats.js lines 31 to 91):
     - `daysLived = 8168`
     - `weeksLived = 1166`
     - `age = 22`
     - `weekIndex = 19`
     - `livedDots = 1163`
     - `totalDots = 4160`
     - `fullMoonsSeen = 276`
     - `heartbeats = 846858240` ("about 847 million")
     - `ahead.sundays = 3008`
     - `ahead.fullMoonsAhead = 713`
     - `ahead.pongals = 58`
     - `ahead.worldCups = 15`
  5. `getFlashbackPicks()` selects 3 top historical events lived by the user (js/history.js lines 59 to 89):
     - Event 1: 2011 Cricket World Cup (`wc-2011`, age 6, dot 354).
     - Event 2: India reaches Mars (`mars`, age 10, dot 534).
     - Event 3: Chandrayaan-3 lunar landing (`chandrayaan-3`, age 19, dot 998).
  6. `calculateMilestones()` identifies that the next milestone is "You turn 12 on Mars" on 6 January 2027 at age 22 (dot 1,173) (js/milestones.js lines 50 to 140).
  7. `createGridComponent()` builds the dual-canvas container and pre-calculates the layout geometry (js/grid.js lines 77 to 140).
  8. `startReveal()` initiates the requestAnimationFrame loop (js/reveal.js lines 22 to 356).

#### Step 4: Watching the Cinematic Camera Intro (0.5 to 3.5 seconds)
- **On Screen:** The home card dissolves upward. In its place, the canvas zooms dramatically onto a single large grey circle occupying 40 percent of the card width. A white caption pill reads "This is one week." A warm, lowpass audio swell rises in pitch. At 1.3 seconds, the camera pulls back to reveal the first row, rapidly popping 51 more dots into place with the caption "52 weeks make one year." At 2.3 seconds, the camera zooms out completely to normal scale, and all 80 rows cascade downward in a smooth wave with the caption "This is a life of 80 years." A small "Skip" button appears in the upper right.
- **In Code:**
  1. `computeCameraAtTime()` determines the virtual zoom scale and translations `(scale, tx, ty)` (js/camera.js lines 31 to 139).
  2. `drawCameraIntro()` applies canvas matrix transformation `ctx.setTransform()` and draws pre-rendered dot sprites for maximum rendering speed (js/camera.js lines 141 to 199).
  3. `playIntroSwell(3.0)` connects white noise through a modulated lowpass biquad filter sweeping from 400 Hz to 1,600 Hz (js/audio.js lines 60 to 94).

#### Step 5: Experiencing the Lived Fill (3.5 to 7.1 seconds)
- **On Screen:** The full 80-row grid of grey dots stands ready. Dots begin filling in from the top left, rapidly streaming through childhood, teenage years, and early twenties. Colors transition smoothly from emerald green to deep teal, ending in bright cyan. Above the canvas, a large counter races in real time from 0 to 1,166 weeks. Every time the fill finishes a ten-year block, a soft acoustic tick is heard.
- **In Code:**
  1. The fill duration is calculated as 3.6 seconds for lives over 150 weeks (js/reveal.js line 59).
  2. `easeInOutCubic()` computes the eased fill proportion (js/counter.js lines 8 to 12).
  3. `drawLivedDot()` draws each newly reached week dot to the main canvas (js/grid-draw.js lines 37 to 43).
  4. `playRowTick(row)` triggers an oscillator tone at `1100 + decade * 60` Hz whenever a row index crosses a decade boundary (js/audio.js lines 107 to 132).
  5. The headline text content is updated with formatted numbers (js/reveal.js line 202).

#### Step 6: "You Are Here" lands (7.1 to 7.8 seconds)
- **On Screen:** At row 22, column 19 (dot index 1,163), the filling stops. The dot expands with a quick pop to 1.8 times its size and settles into a gentle 2-second rhythmic pulsing ring. A vertical marker points to an emerald tag reading "You are here". A crystal-clear two-note chime sounds.
- **In Code:**
  1. `playYouAreHereChime()` triggers two sine waves at 660 Hz and 990 Hz spaced 80 milliseconds apart (js/audio.js lines 134 to 160).
  2. `drawOverlayCurrentDot()` draws the concentric pulse ring, solid core, pointer stem, and rounded label box onto the secondary overlay canvas (js/grid-draw.js lines 45 to 82).

#### Step 7: Historical Flashbacks (7.8 to 13.8 seconds)
- **On Screen:** The "You are here" label fades. In decade 0, dot 354 flashes bright amber with an expanding ring. A rounded card slides up: "You were 6 when India won the Cricket World Cup for the second time. 2 Apr 2011". A playful pop sound is heard. Two seconds later, dot 534 flashes amber: "You were 10 when India reached Mars on its very first try. 24 Sep 2014". Finally, dot 998 flashes amber: "You were 19 when India became the first country to land near the Moon's south pole. 23 Aug 2023".
- **In Code:**
  1. `drawFlashbackPick()` animates each pick over a 2.0-second window (js/reveal-helpers.js lines 170 to 210).
  2. `playFlashbackPop()` glides a triangle wave oscillator from 520 Hz to 780 Hz over 120 milliseconds (js/audio.js lines 163 to 184).

#### Step 8: The Perspective Turn (13.8 to 15.2 seconds)
- **On Screen:** The amber markers fade. A warm, rich three-note chord resonates. The headline smoothly counts up and transforms into: "You have about 3,008 Sundays ahead." The subline clarifies: "In a life of 80 years. Every grey dot is a week still ahead of you."
- **In Code:**
  1. `playTurnChord()` plays three simultaneous sine tones at 392 Hz (G4), 494 Hz (B4), and 587 Hz (D5) decaying over 1.4 seconds (js/audio.js lines 187 to 210).
  2. `countSundays()` calculations are rendered using `easeOutCubic()` easing to animate the headline number from 0 to 3,008 (js/reveal.js lines 283 to 287).

#### Step 9: Exploring Cards, Tools, and Sharing (15.2 seconds onwards)
- **On Screen:** Eight stat cards glide in sequentially: 3,008 Sundays, 713 full moons, 58 Pongal mornings, 15 cricket World Cups, 1,166 weeks lived, 8,168 days lived, 276 full moons seen, and about 847 million heartbeats. The bottom tab bar appears on mobile (or the segmented tab bar on laptop). The user opens the Milestones tab, sees that their 12th Mars birthday is in 2 months, taps "Add to calendar", and receives an exported calendar entry. They tap "Share my dots" and obtain a beautiful high-resolution vertical Status image (1080 by 1920 pixels).
- **In Code:**
  1. `triggerCardsSequence()` applies staggered CSS classes `.visible` to each stat card (js/reveal-helpers.js lines 20 to 53).
  2. `createTabsComponent()` reveals the navigation bar (js/tabs.js lines 302 to 305).
  3. `handleCalendarAction()` detects device type and builds the calendar payload (js/milestones-ui.js lines 18 to 27).
  4. `generateShareBlob()` renders an offscreen canvas at 1080 by 1920 pixels and delivers a PNG blob to the native Web Share API or download link (js/shareImage.js lines 347 to 355).

---

## 7. The Logic

This section details all algorithms, mathematical formulas, and business rules implemented in the project.

### 1. Integer Day Number Arithmetic (UTC Epoch Days)

#### What It Does in Plain Words
Computes the exact number of whole calendar days elapsed between 1 January 1970 and any given calendar date. By doing all date calculations with whole numbers in UTC, the code avoids daylight saving shifts, leap second anomalies, and browser timezone bugs that cause off-by-one errors (README.md line 45, js/dates.js lines 1 to 25).

#### Exact Mathematical Formula
```
dayNumber(year, month, day) = Date.UTC(year, month - 1, day) / 86,400,000
```
where 86,400,000 is the exact number of milliseconds in one 24-hour day (24 * 60 * 60 * 1000).

#### Worked Example with Real Numbers from the App
- Birth Date: 12 June 2004
  ```
  Date.UTC(2004, 5, 12) = 1,087,008,000,000 ms
  dayNumber(2004, 6, 12) = 1,087,008,000,000 / 86,400,000 = 12,581 days
  ```
- Today: 23 October 2026
  ```
  Date.UTC(2026, 9, 23) = 1,792,713,600,000 ms
  dayNumber(2026, 10, 23) = 1,792,713,600,000 / 86,400,000 = 20,749 days
  ```
- Days Lived:
  ```
  daysLived = 20,749 - 12,581 = 8,168 days
  ```
- Weeks Lived:
  ```
  weeksLived = Math.floor(8,168 / 7) = Math.floor(1,166.857) = 1,166 weeks
  ```

#### Why This Method Was Chosen
Standard JavaScript `new Date("2004-06-12")` parses strings in local device time or UTC depending on formatting, causing dates to jump backward or forward by one day depending on whether the user is in London, New York, or Chennai. Pure UTC day arithmetic guarantees exact calendar consistency everywhere on Earth (js/dates.js lines 1 to 4).

#### How Fast It Is
Constant time: O(1). The calculation performs one arithmetic division and zero loops.

#### Location in Code
`js/dates.js`, function `dayNumber` (lines 23 to 25).

---

### 2. Exact Age Calculation

#### What It Does in Plain Words
Determines a person's exact integer age by checking annual birthdays rather than dividing days by 365.25. This ensures that someone born on 29 February turns a year older on 28 February in non-leap years without drifting (js/dates.js lines 49 to 75).

#### Exact Algorithm
1. Estimate starting age: `todayParts.year - dob.year - 1`.
2. Generate next birthday using `addYears(dob, age + 1)`.
3. If next birthday day number is less than or equal to today, increment `age` by 1.
4. Repeat until next birthday is strictly in the future.

#### Worked Example with Real Numbers from the App
- User born 12 June 2004 evaluated on 23 October 2026:
  - Initial estimate: `2026 - 2004 - 1 = 21`.
  - Check 22nd birthday: 12 June 2026 (day number 20,616).
  - Since 20,616 <= 20,749, age becomes 22.
  - Check 23rd birthday: 12 June 2027 (day number 20,981).
  - Since 20,981 > 20,749, loop halts. Exact age is 22.

#### Why This Method Was Chosen
Dividing total days by 365.25 produces fractional inaccuracies and fails to honor legal birthday boundaries on leap years.

#### How Fast It Is
At most O(A) where A is age in years. Because human lifespan never exceeds 120 iterations, it operates in less than 0.01 milliseconds (effectively O(1) in plain words).

#### Location in Code
`js/dates.js`, function `getAge` (lines 62 to 75).

---

### 3. Grid Geometry and Dot Indexing

#### What It Does in Plain Words
Translates any calendar date into an exact row and column coordinate on the canvas. With 52 columns per row, every row represents exactly one year of life (README.md line 46, js/dates.js lines 98 to 112).

#### Exact Mathematical Formulas
```
bdayThisAgeDay = dayNumber(addYears(dob, age))
daysSinceBirthday = todayDayNum - bdayThisAgeDay
weekIndex = Math.min(51, Math.floor(daysSinceBirthday / 7))
currentRow = age
livedDots = age * 52 + weekIndex
totalDots = rows * 52
```

#### Worked Example with Real Numbers from the App
- Age: 22 years.
- 22nd Birthday: 12 June 2026 (day number 20,616).
- Today: 23 October 2026 (day number 20,749).
- Days since 22nd birthday: `20,749 - 20,616 = 133 days`.
- Week Index: `Math.floor(133 / 7) = Math.floor(19.0) = 19`.
- Current Row: 22.
- Lived Dots: `22 * 52 + 19 = 1,144 + 19 = 1,163 dots`.

#### Why This Method Was Chosen
Direct integer indexing eliminates the need to create, style, or query thousands of DOM nodes. The entire 4,160-dot grid is rendered in a single high-performance canvas pass.

#### How Fast It Is
Constant time: O(1). Direct mathematical division and multiplication.

#### Location in Code
`js/dates.js`, function `getGridPosition` (lines 98 to 112).

---

### 4. Sunday Calculation Algorithm

#### What It Does in Plain Words
Calculates the exact number of calendar Sundays falling between tomorrow and the final day of the person's lifespan horizon without looping through every single day (PROJECT_BRIEF.md Section 6, js/dates.js lines 114 to 125).

#### Exact Mathematical Formula
1. A day number `d` is a Sunday if:
   ```
   ((d % 7) + 7) % 7 === 3
   ```
   (Because 1 January 1970 UTC day 0 was a Thursday, day 3 is Sunday).
2. For an interval from `startDay` to `endDay`:
   ```
   length = endDay - startDay + 1
   rem = ((startDay % 7) + 7) % 7
   distance = (3 - rem + 7) % 7
   if distance >= length then 0
   else 1 + Math.floor((length - 1 - distance) / 7)
   ```

#### Worked Example with Real Numbers from the App
- Tomorrow: 24 October 2026 (day number 20,750).
- End Day (80th birthday): 12 June 2084 (day number 41,800).
- Total days: `length = 41,800 - 20,750 + 1 = 21,051 days`.
- Remainder for day 20,750: `20,750 % 7 = 2` (Saturday).
- Distance to next Sunday: `(3 - 2 + 7) % 7 = 1 day` (25 October 2026 is Sunday).
- Sundays count: `1 + Math.floor((21,051 - 1 - 1) / 7) = 1 + Math.floor(21,049 / 7) = 1 + 3,007 = 3,008 Sundays`.

#### Why This Method Was Chosen
A naive `for` loop would execute over 21,000 iterations every time the user moves a slider or resizes the screen. This closed-form formula delivers the exact answer in 2 nanoseconds.

#### How Fast It Is
Constant time: O(1). Zero loops.

#### Location in Code
`js/dates.js`, function `countSundays` (lines 118 to 125).

---

### 5. High-Precision Synodic Lunar Cycle Calculation

#### What It Does in Plain Words
Counts exact full moons between any two dates and calculates future full moon dates using the astronomical lunar synodic month (the time between identical moon phases) calibrated against a certified astronomical full moon reference (README.md line 47, js/dates.js lines 6, 27, 149 to 155).

#### Exact Constants and Formulas
```
FULL_MOON_PERIOD = 29.530588853 days
FULL_MOON_REF = dayNumber(2025, 1, 13) + (1347 / 1440)  // 13 Jan 2025 at 22:27 UTC
kMin = Math.ceil((startDay - FULL_MOON_REF) / FULL_MOON_PERIOD)
kMax = Math.ceil((endDay + 1 - FULL_MOON_REF) / FULL_MOON_PERIOD) - 1
count = kMax - kMin + 1
```

#### Worked Example with Real Numbers from the App
- Case A Lived Moons (12 June 2004 to 23 October 2026):
  - Start Day: 12,581.
  - End Day: 20,749.
  - `kMin = Math.ceil((12,581 - 20,099.935) / 29.530588853) = Math.ceil(-254.61) = -254`.
  - `kMax = Math.ceil((20,750 - 20,099.935) / 29.530588853) - 1 = Math.ceil(22.01) - 1 = 23 - 1 = 22`.
  - Count: `22 - (-254) + 1 = 276 full moons seen`.
- Case A Future Moons (24 October 2026 to 12 June 2084):
  - `kMin = Math.ceil((20,750 - 20,099.935) / 29.530588853) = 23`.
  - `kMax = Math.ceil((41,801 - 20,099.935) / 29.530588853) - 1 = 736 - 1 = 735`.
  - Count: `735 - 23 + 1 = 713 full moons ahead`.

#### Why This Method Was Chosen
Astronomical full moons do not follow month lines. Using the synodic period delivers accuracy to within a fraction of a day across a 100-year span without needing external astronomical tables.

#### How Fast It Is
Constant time: O(1).

#### Location in Code
`js/dates.js`, function `countFullMoons` (lines 149 to 155).

---

### 6. Discretized Time Split (Largest Remainder Method)

#### What It Does in Plain Words
Divides a block of future weeks (such as 520 weeks over 10 years) among daily activities so that the sum of all weeks equals the exact total, without fractions of a dot or rounding artifacts (UPGRADE_BRIEF.md Section 6C, README.md line 48, js/timebudget.js lines 38 to 138).

#### Exact Algorithm
1. Convert each daily activity slider into half-hour units `hh` (48 half-hours in a 24-hour day).
2. For each activity bucket, compute exact weeks:
   ```
   exact = H * hh
   weeks = Math.floor(exact / 48)
   rest = exact % 48
   ```
3. Sum assigned weeks: `assigned = sum(weeks)`.
4. Calculate leftover unassigned weeks: `unassigned = H - assigned`.
5. Sort buckets in descending order of remainder `rest`. In the event of a tie, preserve original slider order.
6. Distribute 1 extra week to each of the top `unassigned` buckets.

#### Worked Example with Real Numbers from the App
- Horizon `H = 520` weeks (Next 10 years).
- Daily Sliders: Sleep 8h (`hh=16`), Work 8h (`hh=16`), Travel 1h (`hh=2`), Phone 3h (`hh=6`), Learn 1h (`hh=2`), Free 3h (`hh=6`).
  - Sleep: `520 * 16 = 8,320 / 48 = 173 weeks, remainder 16`.
  - Work: `520 * 16 = 8,320 / 48 = 173 weeks, remainder 16`.
  - Travel: `520 * 2 = 1,040 / 48 = 21 weeks, remainder 32`.
  - Phone: `520 * 6 = 3,120 / 48 = 65 weeks, remainder 0`.
  - Learn: `520 * 2 = 1,040 / 48 = 21 weeks, remainder 32`.
  - Free: `520 * 6 = 3,120 / 48 = 65 weeks, remainder 0`.
- Sum of initial weeks: `173 + 173 + 21 + 65 + 21 + 65 = 518 weeks`.
- Leftover weeks: `520 - 518 = 2 weeks`.
- Remainder ranking:
  1. Travel (remainder 32)
  2. Learn (remainder 32)
  3. Sleep (remainder 16)
  4. Work (remainder 16)
- The 2 leftover weeks are awarded to Travel (becomes 22) and Learn (becomes 22).
- Final Result: `[173, 173, 22, 65, 22, 65]`. Sum = exactly 520 weeks.

#### Why This Method Was Chosen
Standard rounding (`Math.round`) causes rounding sum drift, where the sum of rounded parts totals 519 or 521 instead of 520. The Largest Remainder Method (also known as the Hamilton-Hare quota system used in proportional representation) guarantees that the total weeks match the exact grid count.

#### How Fast It Is
O(B log B) where B is the number of buckets (6 buckets). With 6 items, sorting requires less than 15 operations, running in microseconds (O(1) in plain words).

#### Location in Code
`js/timebudget.js`, function `calculateTimeSplit` (lines 38 to 138).

---

### 7. Mars Planetary Anniversaries

#### What It Does in Plain Words
Calculates the exact calendar day when a person completes another orbital revolution around the Sun on Mars (UPGRADE_BRIEF.md Section 6B, js/dates.js lines 279 to 286).

#### Exact Mathematical Formula
A Martian solar year equals 686.98 Earth solar days.
The `n`-th Mars birthday occurs on Earth day number:
```
targetDay = dobDayNum + Math.floor(n * 686.98)
```
The app finds the earliest `n` where `targetDay > todayDayNum`.

#### Worked Example with Real Numbers from the App
- Born 12 June 2004 (`dobDayNum = 12,581`). Evaluated on 23 October 2026 (`todayDayNum = 20,749`).
  - `n = 11`: `12,581 + Math.floor(11 * 686.98) = 12,581 + 7,556 = 20,137` (17 December 2024, in the past).
  - `n = 12`: `12,581 + Math.floor(12 * 686.98) = 12,581 + 8,243 = 20,824` (6 January 2027, in the future).
- Earliest future Mars birthday is `n = 12` on 6 January 2027 (in about 2 months).

#### Why This Method Was Chosen
Provides an inspiring, mathematically precise planetary perspective that makes the Milestones tab engaging and memorable for users.

#### How Fast It Is
O(M) where M is the Mars age (at most 60 iterations, O(1)).

#### Location in Code
`js/dates.js`, function `findNextMarsBirthday` (lines 279 to 286).

---

### 8. Canvas Hit Testing with Decade Gaps

#### What It Does in Plain Words
When a user touches or hovers over the canvas at pixel coordinate `(x, y)`, this formula determines the exact age row and week column without scanning thousands of dots, while correctly rejecting touches that land inside the blank horizontal gap between decade blocks (PROJECT_BRIEF.md Section 6, js/grid.js lines 62 to 75).

#### Exact Algorithm
1. Reject touches outside the active column boundary:
   ```
   if (x < gutterWidth || x >= width || y < 0 || y >= height) return null;
   col = Math.floor((x - gutterWidth) / s);
   if (col < 0 || col >= 52) return null;
   ```
2. Each decade contains 10 rows of height `s` plus one decade gap of height `0.8 * s`, giving a decade block height of `10.8 * s`.
3. Compute decade block index and local offset:
   ```
   decadeBlockHeight = 10.8 * s;
   decadeIndex = Math.floor(y / decadeBlockHeight);
   offsetInDecade = y - (decadeIndex * decadeBlockHeight);
   ```
4. If `offsetInDecade >= 10 * s`, the point lands inside the decade gap: return `null`.
5. Otherwise, calculate exact row:
   ```
   row = decadeIndex * 10 + Math.floor(offsetInDecade / s);
   if (row < rows) return { row, col };
   ```

#### Worked Example with Real Numbers from the App
- In mobile portrait view with `s = 6` pixels and `gutterWidth = 20` pixels:
  - Decade block height = `10.8 * 6 = 64.8` pixels.
  - A touch at `x = 80, y = 140`:
    - `col = Math.floor((80 - 20) / 6) = Math.floor(10.0) = 10`.
    - `decadeIndex = Math.floor(140 / 64.8) = 2` (age 20 to 29).
    - `offsetInDecade = 140 - (2 * 64.8) = 140 - 129.6 = 10.4 pixels`.
    - Since `10.4 < 60` (not in gap): `Math.floor(10.4 / 6) = 1`.
    - `row = 2 * 10 + 1 = 21`.
    - Returns `{ row: 21, col: 10 }` (Age 21, Week 11).

#### Why This Method Was Chosen
Delivers instant 60 fps pointer tracking across 4,160 dots without checking individual dot distance formulas.

#### How Fast It Is
Constant time: O(1).

#### Location in Code
`js/grid.js`, function `hitTestDot` (lines 62 to 75).


---

## 8. The Data

The application runs entirely in the user's browser and maintains zero external database connections. All baseline data is packaged directly into code fixtures.

### 1. Historical Moments Dataset (`js/history-data.js`)
Contains exactly 31 curated historical events spanning 1947 to 2026. Every event represents a widely recognized milestone in India and world history (js/history-data.js lines 12 to 44).

| Data Field | Type | Description and Meaning | Example Value |
| :--- | :--- | :--- | :--- |
| `id` | String | Unique slug identifier for the event | `"wc-2011"` |
| `date` | String | Calendar date of occurrence in India (YYYY-MM-DD) | `"2011-04-02"` |
| `rank` | Integer | Prominence ranking from 1 (most widely remembered) to 31. Used by the flashback algorithm to prioritize picks. | `1` |
| `cat` | String | Thematic category: `"cricket"`, `"space"`, `"tamilnadu"`, `"india"`, `"tech"`, `"sport"`, or `"world"` | `"cricket"` |
| `title` | String | Short title displayed on event lists and dot inspection tooltips | `"2011 World Cup"` |
| `when` | String | Plain-English phrase completing the sentence "You were N when..." | `"India won the Cricket World Cup for the second time"` |

#### Complete Inventory of Historical Events in the App
1. `1947-08-15` (Rank 4, india): Independence Day ("India became independent")
2. `1950-01-26` (Rank 18, india): Republic Day ("India became a republic")
3. `1969-07-21` (Rank 3, space): First Moon walk ("humans first walked on the Moon")
4. `1975-04-19` (Rank 26, space): India's first satellite ("India's first satellite went into space")
5. `1982-08-15` (Rank 22, tech): Colour TV ("colour TV broadcasts began in India")
6. `1983-06-25` (Rank 5, cricket): 1983 World Cup ("India won its first Cricket World Cup")
7. `1984-04-03` (Rank 13, space): First Indian in space ("the first Indian went to space")
8. `1995-07-31` (Rank 23, tech): First mobile call ("India's first mobile phone call was made")
9. `1995-08-15` (Rank 17, tech): Internet for everyone ("the internet opened to the public in India")
10. `1996-07-17` (Rank 24, tamilnadu): Madras becomes Chennai ("Madras was officially renamed Chennai")
11. `2000-01-01` (Rank 12, world): Year 2000 ("the world welcomed the year 2000")
12. `2007-09-24` (Rank 6, cricket): First T20 World Cup ("India won the first T20 World Cup")
13. `2008-10-22` (Rank 25, space): First Moon mission ("India launched its first mission to the Moon")
14. `2011-04-02` (Rank 1, cricket): 2011 World Cup ("India won the Cricket World Cup for the second time")
15. `2013-06-23` (Rank 28, cricket): Champions Trophy 2013 ("India won the Champions Trophy")
16. `2014-09-24` (Rank 7, space): Mars on the first try ("India reached Mars on its very first try")
17. `2015-06-29` (Rank 20, tamilnadu): Chennai Metro opens ("Chennai Metro carried its first passengers")
18. `2016-04-11` (Rank 21, tech): UPI launches ("UPI payments were launched")
19. `2017-02-15` (Rank 19, space): 104 satellites ("India launched 104 satellites in one go")
20. `2021-08-07` (Rank 14, sport): Olympic gold in athletics ("India won its first Olympic gold in athletics")
21. `2022-07-28` (Rank 31, tamilnadu): Chess Olympiad in Chennai ("the Chess Olympiad opened in Chennai")
22. `2022-11-30` (Rank 16, tech): AI chatbots go public ("a free AI chatbot opened to the public")
23. `2023-08-23` (Rank 2, space): Landing near the Moon's south pole ("India became the first country to land near the Moon's south pole")
24. `2023-09-02` (Rank 30, space): Mission to the Sun ("India launched its first mission to study the Sun")
25. `2024-06-29` (Rank 8, cricket): T20 World Cup 2024 ("India won the T20 World Cup for the second time")
26. `2024-12-12` (Rank 11, tamilnadu): World Chess Champion ("a teenager from Chennai became World Chess Champion")
27. `2025-03-09` (Rank 29, cricket): Champions Trophy 2025 ("India won the Champions Trophy again")
28. `2025-04-06` (Rank 27, tamilnadu): New Pamban Bridge ("the new Pamban rail bridge opened")
29. `2025-06-26` (Rank 15, space): Indian on the space station ("an Indian astronaut reached the International Space Station for the first time")
30. `2025-11-02` (Rank 9, cricket): Women's World Cup ("India's women won their first Cricket World Cup")
31. `2026-03-08` (Rank 10, cricket): T20 World Cup 2026 ("India won the T20 World Cup for the third time")

### 2. Personal Milestones Dataset (`js/milestones.js`)
Defines 10 fixed elapsed-day milestones and 2 astronomical calculations (js/milestones.js lines 16 to 81):

| Milestone Label | Elapsed Days from Birth | Formula or Origin |
| :--- | :--- | :--- |
| 1,000 weeks old | 7,000 days | Exact arithmetic: `1000 * 7` |
| 10,000 days old | 10,000 days | Exact arithmetic |
| 1 billion seconds old | 11,574 days | `1,000,000,000 / 86,400 = 11,574.07` days |
| 2,000 weeks old | 14,000 days | `2000 * 7` |
| 20,000 days old | 20,000 days | Exact arithmetic |
| 3,000 weeks old | 21,000 days | `3000 * 7` |
| 2 billion seconds old | 23,148 days | `2,000,000,000 / 86,400 = 23,148.15` days |
| 25,000 days old | 25,000 days | Exact arithmetic |
| 4,000 weeks old | 28,000 days | `4000 * 7` |
| 30,000 days old | 30,000 days | Exact arithmetic |
| 1,000th full moon | Dynamic (~29,531 days) | Astronomical lunar synodic month calculation calibrated to Jan 2025 |
| Next Mars birthday | Dynamic (`n * 686.98` days) | Martian solar orbit period (686.98 Earth solar days) |

### 3. Time Allocation Buckets (`js/timebudget.js`)
Configures the 6 daily activity categories used by the Time tool (js/timebudget.js lines 6 to 13):

| Category ID | Label | Color Token | Min Hours | Max Hours | Default Hours |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `sleep` | Sleep | `--t-sleep` | 4.0 | 12.0 | 8.0 |
| `work` | Work or study | `--t-work` | 0.0 | 16.0 | 8.0 |
| `travel` | Travel | `--t-travel` | 0.0 | 6.0 | 1.0 |
| `phone` | Phone and screens | `--t-phone` | 0.0 | 12.0 | 3.0 |
| `learn` | Learning | `--t-learn` | 0.0 | 8.0 | 1.0 |
| `free` | Free time | `--t-free` | Computed | Computed | Computed (remaining of 24 h) |

### 4. Life Chapter Presets (`js/chapters.js`, `js/chapters-ui.js`)
Defines the initial values for the 5 preset chapter chips (js/chapters.js lines 121 to 186):
- **School:** Starts June of age 5, ends March of age 16 (`sYear = dob.year + 5`, `eYear = dob.year + 17`).
- **College:** Starts July of age 17, ends May of age 21 (`sYear = dob.year + 17`, `eYear = dob.year + 21`).
- **First job:** Empty start date, "Still going" enabled.
- **New city:** Empty start date, "Still going" enabled.
- **Custom:** Blank fields.

### 5. Data Accuracy and Known Limits
1. **Timezone Assumptions:** All historical dates are calibrated to Indian Standard Time (IST) as reported in India (js/history.js line 267).
2. **Billion-Second Accuracy:** Because birth hours and minutes are not collected, billion-second milestones can vary by plus or minus 1 calendar day depending on exact birth time (js/milestones-ui.js lines 273 to 275).
3. **Lunar Phases:** Uses the mean synodic month ($29.530588853\text{ days}$). Variations in lunar orbital eccentricity can shift actual full moon sightings by a few hours, occasionally resulting in a 1-day variance (js/dates.js line 6, js/milestones-ui.js lines 281 to 283).
4. **Cultural Assumptions:** Pongal is fixed at 14 January annually. Men's 50-over Cricket World Cups are assumed to take place on 1 October every 4 years beginning in 2027 (js/dates.js lines 127 to 147). Heartbeats assume an average resting rate of 72 beats per minute (js/stats.js line 21).

---

## 9. Every File

### Project Directory Structure and File Table

| File Path | Lines | Size (Bytes) | Role and Key Functions |
| :--- | :--- | :--- | :--- |
| `index.html` | 73 | 4,458 | Application HTML entry shell. Loads CSS stylesheets, registers meta tags, executes early theme script to avoid theme flashing, mounts header and footer, and links `js/main.js`. |
| `styles.css` | 369 | 15,776 | Core styles and design tokens. Defines CSS variables for light and dark themes, header, home form, stat cards, closing card, self-test table, and media queries. |
| `tabs.css` | 273 | 5,707 | Navigation styles. Styles the phone bottom bar, slide-up bottom sheet, backdrop, laptop segmented control, and share format toggle. |
| `reveal.css` | 120 | 2,784 | Reveal animation styling. Styles the floating camera caption pill, skip button, audio toggle button, and reduced motion summary cards. |
| `history.css` | 174 | 3,939 | History tab styling. Styles category filter chips, chronological event rows, age badges, and the pre-birth accordion. |
| `chapters.css` | 207 | 4,313 | Chapters tab styling. Styles preset chips, chapter cards, color picker buttons, text inputs, date selectors, and error messages. |
| `timebudget.css` | 266 | 5,604 | Time tab styling. Styles range pills, stacked progress bar, swap hour button with animated chip, sliders, and educational CTA. |
| `milestones.css` | 240 | 4,981 | Milestones tab styling. Styles the next-up card, chronological list items, status badges, calendar buttons, and footnotes. |
| `history-data.js` | 51 | 6,536 | Root copy of historical events dataset (`HISTORY_EVENTS` and `HISTORY_FILTERS`). Preserved for specification parity. |
| `manifest.json` | 16 | 382 | Web App Manifest for progressive web installation. Declares app name, icons, start URL, and emerald brand color (`#059669`). |
| `LICENSE` | 17 | 1,094 | Full MIT License legal notice, crediting B Pradeep and Wrench Wise (2026). |
| `.gitignore` | 4 | 45 | Git ignore file. Excludes `.DS_Store`, `Thumbs.db`, `*.log`, and `.system_generated/`. |
| `README.md` | 64 | 3,919 | Project overview documentation. Features architecture diagrams, mathematical precision table, privacy rules, and local setup steps. |
| `REEL_SCRIPT.md` | 162 | 11,937 | Video production scripts. Contains 5 complete video scripts matched to demo mode timing (2 vertical overview, 1 horizontal widescreen, and 3 feature deep-dives). |
| `assets/favicon.png` | Binary | 36,473 | Browser tab icon and PWA icon in high-resolution PNG format. |
| `assets/logo.png` | Binary | 67,822 | Official Wrench Wise brand logo rendered in header, share cards, and open graph previews. |
| `assets/og-image.png` | Binary | 223,583 | Open Graph link preview image (1200 by 630 pixels) for WhatsApp, Twitter/X, and iMessage link cards. |
| `js/audio.js` | 193 | 7,175 | Web Audio API synthesizer. Functions: `getAudioContext`, `isMuted`, `setMuted`, `toggleMute`, `playIntroSwell`, `playRowTick`, `playYouAreHereChime`, `playFlashbackPop`, `playTurnChord`, `initAudio`. |
| `js/camera.js` | 164 | 6,048 | Virtual camera zooming engine. Functions: `createDotSprites`, `computeCameraAtTime`, `drawCameraIntro`. |
| `js/chapters.js` | 169 | 6,377 | Chapters calculation and validation logic. Functions: `countGraphemes`, `validateChapter`, `getChapterDotRange`, `getPresetChapter`, `resolveDotChapters`. |
| `js/chapters-ui.js` | 325 | 12,985 | Chapters user interface renderer. Functions: `createChaptersPanel`. Manages preset additions, color cycle clicks, live debounce, and card deletion. |
| `js/colors.js` | 52 | 2,408 | Color math and CSS token resolution. Functions: `getThemeColors`, `resolveCssVar`, `parseColor`, `interpolateColor`, `getRowColor`. |
| `js/counter.js` | 60 | 1,560 | Animation easing equations and numeric counters. Functions: `easeOutCubic`, `easeInOutCubic`, `animateValue`, `animateTextNumber`. |
| `js/dates.js` | 250 | 8,440 | Pure calendar mathematics using integer day numbers. Functions: `isLeapYear`, `daysInMonth`, `dayNumber`, `fromDayNumber`, `getToday`, `addYears`, `getAge`, `resolveLife`, `getGridPosition`, `isSunday`, `countSundays`, `countPongals`, `countWorldCups`, `countFullMoons`, `validateDate`, `dotIndexForDate`, `getAheadDots`, `formatShortDate`, `formatNextUpDate`, `getInAboutText`, `find1000thFullMoon`, `findNextMarsBirthday`. |
| `js/demo.js` | 214 | 8,120 | Autonomous reel demonstration loop. Functions: `parseDemoParams`, `startDemoMode`. Simulates tap dot interactions, drives the reveal, and tours all tabs. |
| `js/grid-draw.js` | 124 | 5,349 | Pure canvas drawing routines. Functions: `drawAgeGutter`, `drawEmptyGrid`, `drawLivedDot`, `drawOverlayCurrentDot`, `drawGrid`. |
| `js/grid.js` | 341 | 14,251 | Grid card lifecycle, layout computation, pointer events, and dot tooltips. Functions: `computeGridLayout`, `getDotCenter`, `hitTestDot`, `createGridComponent`. |
| `js/history-data.js` | 51 | 6,536 | Module export of historical moments and filter categories (`HISTORY_EVENTS`, `HISTORY_FILTERS`). |
| `js/history.js` | 228 | 8,931 | History data filtering and UI renderer. Functions: `parseYmdToDayNumber`, `getFlashbackSentence`, `getHistoryData`, `getFlashbackPicks`, `createHistoryPanel`. |
| `js/layers.js` | 263 | 9,636 | Layer styling and dynamic legend rules. Functions: `getDotLayerStyle`, `renderLegend`, `getDotTooltipDetails`. Defines `VIEWS` constant. |
| `js/main.js` | 325 | 13,872 | Main application orchestrator. Functions: `runUserFlow`, `init`. Reads URL query flags, manages transitions, mounts tools, and binds events. |
| `js/milestones.js` | 157 | 5,763 | Milestones logic and calendar file generators. Functions: `getMilestoneCalendarTitle`, `calculateMilestones`, `buildIcsCalendarFile`, `buildGoogleCalendarUrl`. |
| `js/milestones-ui.js` | 242 | 10,171 | Milestones UI renderer and calendar triggers. Functions: `downloadIcsFile`, `handleCalendarAction`, `createMilestonesPanel`. |
| `js/reveal-helpers.js` | 188 | 6,839 | UI helper routines for reveal transitions. Functions: `animateCount`, `triggerCardsSequence`, `renderReducedMotion`, `performSkipToFinal`, `drawFlashbackPick`. |
| `js/reveal.js` | 318 | 11,243 | The 16-second cinematic reveal timeline controller. Functions: `startReveal`. Coordinates camera, fill, sound synthesis, captions, and the turn. |
| `js/selftest-data.js` | 299 | 8,335 | Test fixtures and expected numerical values for Cases A through G (`SO_FAR_EXPECTED`, `AHEAD_EXPECTED`, `HISTORY_EXPECTED`, `MILESTONES_EXPECTED_A`, `TIME_SPLIT_EXPECTED`). |
| `js/selftest-ui.js` | 173 | 6,178 | DOM renderer for the test suite report. Functions: `renderSelfTestUI`. Formats test tables and badges into `#test-output`. |
| `js/selftest-v2.js` | 263 | 14,398 | Test execution for v2 feature math (History, Milestones, Time, Chapters). Functions: `runV2Tests`. |
| `js/selftest.js` | 188 | 9,281 | Test runner for v1 and overall self-test orchestrator. Functions: `runSelfTest`. Runs with `?test=1`. |
| `js/share.js` | 116 | 3,806 | Share handlers and analytics. Functions: `getShareSize`, `setShareSize`, `trackEvent`, `handleShareDots`, `handleShareWhatsApp`, `handleCopyLink`. |
| `js/shareImage.js` | 318 | 12,511 | Offscreen canvas generator for shareable images in Post and Status sizes. Functions: `createShareCanvas`, `generateShareBlob`. |
| `js/stats.js` | 82 | 2,415 | Statistics generation for cards. Functions: `formatNumber`, `formatHeartbeats`, `calculateLifeStats`. |
| `js/tabs.js` | 278 | 11,387 | Navigation controller. Functions: `createTabsComponent`. Manages phone tab bar, bottom sheet, laptop tabs, and panel visibility. |
| `js/theme.js` | 81 | 2,903 | Theme switcher and persistence. Functions: `getSavedTheme`, `saveTheme`, `getSystemTheme`, `getCurrentTheme`, `applyTheme`, `initTheme`. |
| `js/timebudget.js` | 119 | 4,057 | Time budget calculations and Largest Remainder split logic. Functions: `canSwapPhoneForLearning`, `swapPhoneForLearning`, `calculateTimeSplit`. Defines `TIME_BUCKETS` and `DEFAULT_SLIDERS`. |
| `js/timebudget-ui.js` | 316 | 12,691 | Time tab UI builder and slider manager. Functions: `createTimePanel`. Renders stacked bar, highlights, sliders, and triggers swap animation. |
| `js/ui.js` | 334 | 15,652 | Home form, stat cards, and closing card builder. Functions: `createSvgIcon`, `createHomeCard`, `createStatCards`, `createClosingCard`. |
| `tools/brand_compare.html` | 78 | 2,012 | Visual QA comparison tool. Places wrench-wise.com side by side with Your Life in Dots to verify pixel brand alignment. |
| `tools/og.html` | 166 | 4,851 | Canvas tool that generates the 1200 by 630 pixel `og-image.png` preview card. |
| `tools/render_share.html` | 41 | 1,448 | Standalone harness to render and visually inspect share images for Cases A and G. |
| `tools/test_demo.js` | 95 | 4,222 | Node.js verification script that drives headless Chrome to monitor and validate demo mode cycles. |
| `docs/screenshots/*` | 8 files | ~1.3 MB | Verified full-page visual documentation screenshots captured in phone (390 by 844) and laptop (1440 by 900) viewports across light and dark themes. |

---

### How the Files Connect: From Page Load to Screen Result

```
Page Load:
  index.html
    ├── Inline Script (checks localStorage 'lid-theme' to prevent white flash)
    ├── Loads CSS stylesheets (styles.css, tabs.css, reveal.css, history.css, chapters.css, timebudget.css, milestones.css)
    └── Loads js/main.js (ES Module entry point)

Initialization (js/main.js):
  js/main.js
    ├── initTheme() (js/theme.js) binds theme toggle
    ├── initAudio() (js/audio.js) sets up mute toggle
    └── Reads URL parameters (test=1, demo=1, tab, seek, dob, life)

Form Submission (js/main.js -> showMyLife):
  js/ui.js (createHomeCard)
    └── Validates date with js/dates.js (validateDate)
          └── Triggers showMyLife({ dob, lifePicked })

Data & Math Execution:
  js/stats.js (calculateLifeStats)
    ├── js/dates.js (dayNumber, getAge, resolveLife, getGridPosition, countSundays, countPongals, countWorldCups, countFullMoons)
  js/history.js (getHistoryData, getFlashbackPicks from js/history-data.js)
  js/milestones.js (calculateMilestones from js/dates.js)
  js/timebudget.js (calculateTimeSplit)

Rendering the Canvas & Results:
  js/grid.js (createGridComponent)
    ├── js/grid-draw.js (drawGrid, drawEmptyGrid, drawLivedDot, drawOverlayCurrentDot)
    └── js/layers.js (getDotLayerStyle, renderLegend, getDotTooltipDetails)

Running the Reveal Timeline:
  js/reveal.js (startReveal)
    ├── js/camera.js (computeCameraAtTime, drawCameraIntro)
    ├── js/audio.js (playIntroSwell, playRowTick, playYouAreHereChime, playFlashbackPop, playTurnChord)
    ├── js/reveal-helpers.js (drawFlashbackPick, triggerCardsSequence, performSkipToFinal)
    └── On Complete -> reveals js/tabs.js (createTabsComponent)

Interactive Exploration:
  js/tabs.js switches views:
    ├── History View -> js/history.js (createHistoryPanel)
    ├── Chapters View -> js/chapters-ui.js (createChaptersPanel) -> js/chapters.js
    ├── Time View -> js/timebudget-ui.js (createTimePanel) -> js/timebudget.js
    ├── Milestones View -> js/milestones-ui.js (createMilestonesPanel) -> js/milestones.js
    └── Share Image -> js/share.js -> js/shareImage.js (createShareCanvas)
```


---

## 10. Tech Used

The application follows a strict zero-dependency architecture. It uses only standard web technologies built natively into modern browsers (PROJECT_BRIEF.md Section 2 Rule 1, README.md line 14).

### Technologies and Browser Features Used

| Technology / API | Exact Purpose in the App | Why It Was Chosen |
| :--- | :--- | :--- |
| **HTML5** | Application semantic structure and accessible elements (`<main>`, `<header>`, `<footer>`, `<canvas>`, `<dialog>`, `<details>`, `<summary>`). | Standard markup supported by all modern browsers (index.html lines 1 to 82). |
| **CSS3 & CSS Custom Properties** | Modern styling, color token systems, theme switching, responsive layouts, and animations. | Native CSS variables allow instant light and dark theme switching without re-rendering the DOM (styles.css lines 1 to 76). |
| **Vanilla JavaScript (ES Modules)** | Pure algorithmic date mathematics, canvas rendering loops, and UI state management. | Runs directly in all browsers without compilation, bundling tools, or node modules (index.html line 80). |
| **HTML5 Canvas 2D API** | Renders 4,160 dots at 60 frames per second, handles offscreen share image generation, and drives smooth virtual camera zooming. | Managing 4,160 individual DOM nodes creates severe mobile memory pressure and stutter. A single canvas renders in under 2 milliseconds (js/grid-draw.js lines 1 to 139). |
| **Web Audio API** | Real-time procedural audio synthesis for the intro swell, row ticks, "You are here" chime, flashback pops, and turn chord. | Generates all sounds through code using oscillators and biquad filters, avoiding external MP3 downloads and network latency (js/audio.js lines 1 to 242). |
| **Web Share API (`navigator.share`)** | Invokes the device's native sharing sheet on mobile to share generated PNG images directly to WhatsApp, Instagram, or Messages. | Provides a seamless native mobile experience where users can share images with one tap (js/share.js lines 55 to 64). |
| **Clipboard API (`navigator.clipboard`)** | Copies the application link to the user's system clipboard with a fallback for older web views. | Allows one-tap link sharing without opening popups (js/share.js lines 97 to 103). |
| **Local Storage (`window.localStorage`)** | Stores only two user preferences: `lid-theme` ("dark" or "light") and `lid-muted` ("1" or "0"). | Preserves theme and sound preferences across visits without collecting or persisting any private user data (js/theme.js lines 18 to 21, js/audio.js lines 44 to 47). |
| **MatchMedia API (`window.matchMedia`)** | Detects operating system dark mode preferences and reduced motion accessibility flags. | Respects user accessibility preferences automatically (js/theme.js lines 24 to 28, js/reveal.js lines 37 to 40). |
| **URLSearchParams** | Reads special URL options such as `?test=1`, `?demo=1`, `?tab=`, and `?seek=`. | Enables clean parameter parsing for automation and direct linking (js/main.js lines 341 to 348). |
| **Blob & Object URLs (`URL.createObjectURL`)** | Converts offscreen canvas data and calendar file strings into downloadable files (`life-in-dots.png` and `nerd-birthday.ics`). | Creates downloadable files in memory without needing a server backend (js/share.js lines 67 to 74, js/milestones-ui.js lines 7 to 15). |

### Outside Services and Network Requirements

| Service | Purpose | Network Requirement |
| :--- | :--- | :--- |
| **Google Analytics 4 (GA4)** | Optional anonymous usage telemetry (`share_image`, `tab_open`, `swap_hour`, `calendar_add`, `flashback_skip`). | Optional. The call is wrapped in a `try...catch` block. If offline or blocked by ad blockers, the application functions identically with zero errors (js/share.js lines 21 to 29). |
| **Google Calendar Intent** | Opens Google Calendar in browser with pre-filled milestone event details when tapped on Android. | Requires internet only when the user chooses to open Google Calendar (js/milestones.js lines 173 to 183). |
| **WhatsApp Intent (`wa.me`)** | Opens WhatsApp with pre-filled invitation text when tapped. | Requires internet only when the user taps "Send link on WhatsApp" (js/share.js lines 86 to 90). |

### Clear Statement on Backend, Keys, Login, and Internet
- **Backend Server:** NONE. The app is a 100 percent static client-side bundle.
- **Database:** NONE. All calculations, data filtering, and image generations take place in browser memory (RAM).
- **API Keys:** NONE. No external APIs, AI services, or proprietary cloud endpoints are called.
- **User Login or Accounts:** NONE. No sign-up, email collection, or authentication exists.
- **Internet Requirement:** The application does NOT require internet to run. The entire app, including all calculations, grid drawing, Web Audio synthesis, calendar `.ics` downloads, and PNG image creation, operates completely offline once loaded.

---

## 11. Design

### Color System and Hex Codes

The application follows the official Wrench Wise visual identity, centered on emerald, teal, and cyan (PROJECT_BRIEF.md Section 5, styles.css lines 1 to 76).

#### Complete Color Tokens Table

| Token Name | Light Theme Hex Code | Dark Theme Hex Code | UI Purpose in the App |
| :--- | :--- | :--- | :--- |
| `--bg` | `#FFFFFF` | `#0F172A` | Primary page background |
| `--bg-grad` | `linear-gradient(135deg, #ECFDF5 0%, #FFFFFF 45%, #ECFEFF 100%)` | `linear-gradient(135deg, #0F172A 0%, #1E293B 100%)` | Main body ambient gradient |
| `--surface` | `#FFFFFF` | `#1E293B` | Cards, tool panels, header, and bottom sheet background |
| `--surface-2` | `#F3F4F6` | `#334155` | Secondary button backgrounds, inputs, and muted tabs |
| `--border` | `#E5E7EB` | `#334155` | Card borders, table grid lines, and dividers |
| `--text` | `#111827` | `#F1F5F9` | High-contrast headings and primary labels |
| `--text-2` | `#374151` | `#CBD5E1` | Secondary body text and table content |
| `--muted` | `#6B7280` | `#94A3B8` | Subtitles, footnotes, and gutter age numbers |
| `--brand` | `#059669` | `#10B981` | Primary Wrench Wise Emerald brand color |
| `--brand-strong` | `#047857` | `#34D399` | Button active states and pulsing dot core |
| `--brand-soft` | `#D1FAE5` | `rgba(16, 185, 129, 0.15)` | Chip backgrounds and pulsing dot halo |
| `--brand-grad` | `linear-gradient(90deg, #059669, #0D9488, #06B6D4)` | `linear-gradient(90deg, #10B981, #14B8A6, #22D3EE)` | Primary action buttons and header accent bar |
| `--accent` | `#0891B2` | `#22D3EE` | Secondary interactive accents |
| `--error` | `#E11D48` | `#FB7185` | Validation error text and invalid field borders |
| `--dot-future` | `#D1D5DB` | `#334155` | Unlived future weeks dots on canvas |
| `--dot-lived-from` | `#059669` | `#10B981` | Early life dots starting gradient |
| `--dot-lived-mid` | `#0D9488` | `#14B8A6` | Mid-life dots middle gradient |
| `--dot-lived-to` | `#06B6D4` | `#22D3EE` | Recent lived dots ending gradient |
| `--dot-now` | `#047857` | `#34D399` | Current week dot solid core |
| `--dot-unassigned` | `#A7F3D0` | `#134E4A` | Lived dots not assigned to a chapter in Chapters view |
| `--history` | `#D97706` | `#FBBF24` | Historical moments amber markers and filter chips |
| `--milestone` | `#0891B2` | `#22D3EE` | Milestone cyan ring markers and next-up cards |
| `--ch-1` | `#059669` | `#34D399` | Chapter color 1 (Emerald) |
| `--ch-2` | `#0891B2` | `#22D3EE` | Chapter color 2 (Cyan) |
| `--ch-3` | `#6366F1` | `#818CF8` | Chapter color 3 (Indigo) |
| `--ch-4` | `#D97706` | `#FBBF24` | Chapter color 4 (Amber) |
| `--ch-5` | `#DB2777` | `#F472B6` | Chapter color 5 (Pink) |
| `--ch-6` | `#65A30D` | `#A3E635` | Chapter color 6 (Lime) |
| `--ch-7` | `#7C3AED` | `#A78BFA` | Chapter color 7 (Purple) |
| `--ch-8` | `#0F766E` | `#5EEAD4` | Chapter color 8 (Teal) |
| `--t-sleep` | `#6366F1` | `#818CF8` | Time category: Sleep (Indigo) |
| `--t-work` | `#0891B2` | `#22D3EE` | Time category: Work or study (Cyan) |
| `--t-travel` | `#D97706` | `#FBBF24` | Time category: Travel (Amber) |
| `--t-phone` | `#E11D48` | `#FB7185` | Time category: Phone and screens (Rose) |
| `--t-learn` | `#059669` | `#34D399` | Time category: Learning (Emerald) |
| `--t-free` | `#5EEAD4` | `#0D9488` | Time category: Free time (Teal) |

### Typography and Font Stack

- **Primary Font Family:** System font stack (`ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`) (styles.css line 31).
- **Numbers Variant:** `font-variant-numeric: tabular-nums` applied to all selects, buttons, inputs, and numeric cards to ensure digits do not jitter during animations (styles.css line 118).
- **Headings:** Bold weight (800) with slight letter spacing compression (`-0.01em`) (styles.css line 119).
- **Body Text:** Regular weight (400) with 1.5 line height (styles.css lines 113, 120).

### Spacing, Corner Shapes, and Elevation

- `--radius-full`: `999px` (used for buttons, toggle pills, and filter chips) (styles.css line 34).
- `--radius-card`: `16px` (used for main cards, stat boxes, and tool panels) (styles.css line 35).
- `--radius-input`: `12px` (used for form dropdowns) (styles.css line 36).
- `--radius-chip`: `8px` (used for eyebrow chips and age badges) (styles.css line 37).
- `--shadow-sm`: `0 1px 3px rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)` (styles.css line 38).
- `--shadow-md`: `0 4px 6px -1px rgba(0, 0, 0, 0.10), 0 2px 4px -2px rgba(0, 0, 0, 0.10)` (styles.css line 39).
- `--shadow-lg`: `0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10)` (styles.css line 40).

---

### Layout Comparison and Verified Visual Screenshots

All visual screenshots have been captured directly from the live application and saved into `docs/screenshots`.

#### 1. Phone Viewport (390 by 844 Pixels)
In mobile view, the grid canvas occupies the upper viewport, and the four tool tabs are accessed through a fixed bottom navigation bar that opens an animated slide-up bottom sheet.

- **Phone Light Theme (Results and Overview):**  
  Screenshot file: [docs/screenshots/phone_light.png](file:///C:/Projects/Wrench-Wise/3%20Life_in_Dots/docs/screenshots/phone_light.png)
- **Phone Dark Theme (Results and Overview):**  
  Screenshot file: [docs/screenshots/phone_dark.png](file:///C:/Projects/Wrench-Wise/3%20Life_in_Dots/docs/screenshots/phone_dark.png)
- **Phone Light Theme (Home Input Screen):**  
  Screenshot file: [docs/screenshots/phone_home_light.png](file:///C:/Projects/Wrench-Wise/3%20Life_in_Dots/docs/screenshots/phone_home_light.png)
- **Phone Dark Theme (Home Input Screen):**  
  Screenshot file: [docs/screenshots/phone_home_dark.png](file:///C:/Projects/Wrench-Wise/3%20Life_in_Dots/docs/screenshots/phone_home_dark.png)

#### 2. Laptop Viewport (1440 by 900 Pixels)
In desktop view, the layout splits into two balanced columns. The left column holds a sticky card displaying the complete canvas so the entire lifespan remains in view. The right column holds the segmented control bar and tab panels.

- **Laptop Light Theme (Results and Overview):**  
  Screenshot file: [docs/screenshots/laptop_light.png](file:///C:/Projects/Wrench-Wise/3%20Life_in_Dots/docs/screenshots/laptop_light.png)
- **Laptop Dark Theme (Results and Overview):**  
  Screenshot file: [docs/screenshots/laptop_dark.png](file:///C:/Projects/Wrench-Wise/3%20Life_in_Dots/docs/screenshots/laptop_dark.png)
- **Laptop Light Theme (Home Input Screen):**  
  Screenshot file: [docs/screenshots/laptop_home_light.png](file:///C:/Projects/Wrench-Wise/3%20Life_in_Dots/docs/screenshots/laptop_home_light.png)
- **Laptop Dark Theme (Home Input Screen):**  
  Screenshot file: [docs/screenshots/laptop_home_dark.png](file:///C:/Projects/Wrench-Wise/3%20Life_in_Dots/docs/screenshots/laptop_home_dark.png)


---

## 12. Motion and Interactions

The application uses motion purposefully to tell a story about human lifespan and illustrate the compounding power of time (UPGRADE_BRIEF.md Section 4A, REEL_SCRIPT.md lines 1 to 214).

### Complete Catalog of Animations and Transitions

| Effect / Animation Name | Where It Appears | Trigger Event | Duration | Mathematical Easing | Visual Details and Transformations | Location in Code |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Home Card Exit** | Home input card | Tapping "Show my life" button | 500 ms (0.0 to 0.5 s) | `cubic-bezier(0.22, 1, 0.36, 1)` | Card opacity fades 1 to 0 while translating upward: `translateY(0) -> translateY(-12px)`. Results container scales up from 0.98 to 1.0 and fades in. | js/reveal.js lines 129 to 145, styles.css line 172 |
| **Camera Zoom Phase 1** | Canvas surface | Reveal starts (0.5 s) | 800 ms (0.5 to 1.3 s) | `easeInOutCubic` | Virtual camera scales Dot 0 to 40 percent of screen width (`scale = S0`). Dot 0 circle grows from radius 0 to full size. Caption "This is one week." fades in. | js/camera.js lines 53 to 73 |
| **Camera Zoom Phase 2** | Canvas surface | Phase 1 ends (1.3 s) | 1,000 ms (1.3 to 2.3 s) | `easeInOutCubic` | Virtual camera zooms out from S0 to S1. 51 dots pop in left-to-right along Row 0. Caption changes to "52 weeks make one year." | js/camera.js lines 76 to 108 |
| **Camera Zoom Phase 3** | Canvas surface | Phase 2 ends (2.3 s) | 1,200 ms (2.3 to 3.5 s) | `easeInOutCubic` | Virtual camera zooms out from S1 to 1.0. All 80 rows appear in a downward wave. Caption reads "This is a life of 80 years." | js/camera.js lines 110 to 139 |
| **Lived Weeks Fill** | Canvas surface | Intro completes (3.5 s) | 3,600 ms (or 1,200 ms if lived dots under 150) | `easeInOutCubic` | Lived dots stream row by row in reading order from top left to bottom right. Colors shift from emerald to teal to cyan. Decade tick sound plays at each decade line. | js/reveal.js lines 177 to 204 |
| **Live Headline Counter** | Above grid | During lived weeks fill | Concurrent with fill (3.6 s) | `easeInOutCubic` | Numerical digits race upward from 0 to exact lived weeks (e.g. 1,166 weeks) in sync with canvas dots. | js/reveal.js line 202 |
| **"You Are Here" Landing Pop** | Overlay canvas | Lived fill completes (7.1 s) | 300 ms | Sinusoidal curve `Math.sin(p * Math.PI)` | Current week dot expands to 1.8 times its normal radius and returns smoothly to 1.0. Chime sounds. | js/reveal.js lines 224 to 228 |
| **"You Are Here" Pulse Ring** | Overlay canvas | After landing pop (7.4 s onwards) | 2,000 ms recurring cycle | Linear decay over 1.2 s, followed by 0.8 s rest | Concentric outer ring expands from 1.0 to 2.4 times dot radius while ring opacity fades from 1.0 to 0.0. Repeats every 2 seconds. | js/reveal.js lines 230 to 237, js/grid-draw.js lines 51 to 59 |
| **Pointer and Tag Entry** | Overlay canvas | After landing pop (7.1 to 10.1 s) | Stays for 3,000 ms | Fixed position | A crisp 14-pixel vertical stem connects the current dot to a rounded pill badge reading "You are here". | js/grid-draw.js lines 60 to 81 |
| **Historical Flashback Pop** | Overlay canvas & captions | After "You are here" (7.8 to 13.8 s) | 2,000 ms per pick | Sinusoidal pop and linear ring expansion | Target historical dot expands to 1.8 times radius in amber (`#D97706`). An amber ring expands 1.0 to 2.4 times radius while fading. Pop audio glides 520 to 780 Hz. Caption shows event details. | js/reveal-helpers.js lines 170 to 210, js/reveal.js lines 250 to 267 |
| **Sundays Headline Turn** | Reveal headline | Flashback completes (13.8 s) | 1,200 ms | `easeOutCubic` | Major turn chord sounds. Headline numbers count up from 0 to total remaining Sundays (e.g. 3,008). Subline fades in. | js/reveal.js lines 270 to 289 |
| **Stat Cards Cascade** | Results container | The turn ends (15.2 s) | 300 ms per card (80 ms stagger between cards) | `cubic-bezier(0.22, 1, 0.36, 1)` | Cards slide upward into view: `translateY(16px) -> translateY(0)` with opacity 0 to 1. | js/reveal-helpers.js lines 20 to 46, styles.css lines 295 to 299 |
| **Stat Card Numbers Count-Up** | Stat card numbers | Individual card entrance | 800 ms per card | `easeOutCubic` | Digits in each card count up from 0 to their final target numbers. | js/reveal-helpers.js lines 7 to 18 |
| **Closing Card Entrance** | Below stat cards | After all stat cards enter | 300 ms | `cubic-bezier(0.22, 1, 0.36, 1)` | Closing card fades in with upward slide: `translateY(16px) -> translateY(0)`. | js/reveal-helpers.js lines 48 to 52, styles.css lines 331 to 336 |
| **Theme Switch Transition** | Entire page | Tapping theme button | 200 ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Smooth background color, text color, and border cross-fade across all elements. Class `theme-transition` is added temporarily. | js/theme.js lines 37 to 46, styles.css lines 78 to 86 |
| **Layer Switch Cross-Fade** | Main canvas | Tapping any tool tab | 150 ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Canvas opacity dips to 0.6 and returns to 1.0 via `@keyframes layerFade`, providing a tactile response to tab switching. | tabs.css lines 4 to 12, js/tabs.js lines 193 to 196 |
| **Bottom Sheet Slide-Up** | Phone screen | Tapping tab on mobile | 250 ms | `cubic-bezier(0.22, 1, 0.36, 1)` | Bottom sheet slides up from `translateY(105%)` to `translateY(0)`. Backdrop opacity fades 0 to 1 over 200 ms. | tabs.css lines 76 to 111 |
| **Swap Hour Chip Pop** | Time tab | Tapping "Swap 1 hour" button | 200 ms entrance, 2,000 ms hold | `cubic-bezier(0.4, 0, 0.2, 1)` | Emerald chip "+21 weeks of learning" slides up: `translateY(4px) -> translateY(0)` with opacity 0 to 1. Holds for 2 seconds then fades. | js/timebudget-ui.js lines 363 to 369, timebudget.css lines 131 to 149 |
| **Swap Hour Canvas Dot Bounce** | Overlay canvas | Tapping "Swap 1 hour" button | 300 ms | Sinusoidal bounce `1.0 + Math.sin(p * Math.PI) * 0.7` | The 21 dots converted from phone to learning expand to 1.7 times radius, flash bright emerald, and settle into place. | js/grid.js lines 297 to 337 |
| **Interactive Landmark Pulse** | Overlay canvas | Tapping event in History or landmark in Milestones | 600 ms | Quadratic ease-out `1 - Math.pow(1 - p, 2)` | Expanding amber or cyan ring grows to 4 times dot radius while fading opacity 0.9 to 0.0. Canvas auto-scrolls to row. | js/grid.js lines 238 to 265 |
| **Demo Mode Tap Dot** | Fixed screen overlay | Autonomous demo mode (`?demo=1`) | 300 ms travel, 150 ms press | `cubic-bezier(0.22, 1, 0.36, 1)` | Green tap dot glides across screen, scales down to 0.8 to simulate a thumb press, highlights target element with emerald glow, and releases. | js/demo.js lines 54 to 76, styles.css lines 154 to 164 |

### Reduced Motion Specifications
When a person's device has enabled the "Reduce Motion" accessibility setting (`prefers-reduced-motion: reduce`):
1. **Global CSS Override:** All animations and transitions across all HTML elements are forced to an effective duration of 0.01 milliseconds:
   ```css
   @media (prefers-reduced-motion: reduce) {
     *, *::before, *::after {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
       scroll-behavior: auto !important;
     }
   }
   ```
   (styles.css lines 385 to 392).
2. **Timeline Bypass:** `js/reveal.js` detects `prefers-reduced-motion` at the start of the reveal. It bypasses all camera zooming, fill ticks, and pauses. The entire grid renders immediately at full opacity, the headline shows the final Sundays count instantly, stat cards are shown without delay, and historical flashback picks are presented as a clean static text list directly beneath the headline (js/reveal.js lines 37 to 56, js/reveal-helpers.js lines 55 to 112).

---

## 13. Words on Screen

Every heading, button label, message, prompt, footnote, and legal text in the user interface is quoted below exactly as it appears in the codebase.

### 1. Header and Global Navigation
- Brand wordmark fallback: `"Wrench Wise"` (index.html line 52)
- Application title: `"Your Life in Dots"` (index.html line 54)
- Theme toggle accessibility label: `"Toggle dark theme"` (index.html line 55)
- Audio toggle active accessibility label: `"Mute sound"` (index.html line 59)
- Audio toggle muted accessibility label: `"Unmute sound"` (js/audio.js line 222)
- Skip button during reveal: `"Skip"` (js/reveal.js line 105)
- Mobile tool sheet close button: `"Done"` (js/tabs.js line 55)

### 2. Home Input Screen
- Eyebrow chip: `"ONE DOT = ONE WEEK"` (js/ui.js line 45)
- Headline: `"Your Life in Dots"` (js/ui.js line 46)
- Subtitle: `"See every week of your life on one screen."` (js/ui.js line 47)
- Birth date label: `"Your date of birth"` (js/ui.js line 56)
- Dropdown default placeholders: `"Day"`, `"Month"`, `"Year"` (js/ui.js lines 65, 71, 78)
- Lifespan section label: `"Picture a life of"` (js/ui.js line 93)
- Lifespan options: `"70 years"`, `"80 years"`, `"90 years"`, `"100 years"` (js/ui.js line 106)
- Lifespan disclaimer: `"This is a picture, not a prediction."` (js/ui.js line 119)
- Primary submit button: `"Show my life"` (js/ui.js line 125)
- Privacy guarantee: `"Your date of birth stays on this device. Nothing is sent or saved."` (js/ui.js line 130)

### 3. Validation and Form Error Messages
- When dropdowns are incomplete: `"Please pick your full date of birth."` (js/dates.js line 161)
- When a day does not exist in the calendar: `"That date does not exist. Please check the day."` (js/dates.js line 174)
- When a birth date is in the future: `"That date is in the future."` (js/dates.js line 179)

### 4. Cinematic Reveal Story Text
- Camera Intro Stage 1: `"This is one week."` (js/camera.js line 70)
- Camera Intro Stage 2: `"52 weeks make one year."` (js/camera.js line 105)
- Camera Intro Stage 3 (Standard): `"This is a life of 80 years."` (or 70, 90, 100) (js/camera.js line 39)
- Camera Intro Stage 3 (Bonus mode): `"This is your life so far."` (js/camera.js line 39)
- Live Fill counter: `"0 weeks lived"` transitioning to `"N weeks lived"` (js/reveal.js lines 119, 202)
- Present week badge: `"You are here"` (js/grid-draw.js line 67)
- Perspective Turn Headline (Standard): `"You have about N Sundays ahead."` (js/reveal.js line 286)
- Perspective Turn Subline (Standard): `"In a life of 80 years. Every grey dot is a week still ahead of you."` (js/reveal.js line 287)
- Perspective Turn Headline (Bonus mode): `"You have lived over 100 years. Every week from here is a bonus."` (js/reveal.js line 280)
- Perspective Turn Subline (Bonus mode): `"N weeks lived."` (js/reveal.js line 281)

### 5. Grid Surface and Tooltips
- Moved-up notification chip: `"You have already lived past [N], so this shows [M] years."` (js/grid.js line 85)
- Grid caption note: `"One row is one year of your age, with 52 dots."` (js/grid.js line 116)
- Grid accessibility label: `"Grid of [total] dots. [lived] lived. This week is week [W] of age [A]."` (js/grid.js line 96)
- Tooltip age line: `"Age [R], week [C]"` (js/grid.js line 210)
- Tooltip date line (past and future): `"Around [Month] [Year]"` (js/grid.js line 212)
- Tooltip date line (current week): `"This week"` (js/grid.js line 212)
- Grid legend items: `"Lived"`, `"This week"`, `"Ahead"`, `"Unassigned"`, `"Normal"`, `"Event"`, `"Done milestone"`, `"Ahead milestone"` (js/layers.js lines 200 to 242)

### 6. Stat Cards and Explanations
- Ahead section title: `"Ahead of you"` (js/ui.js line 197)
- Ahead card labels: `"Sundays"`, `"full moons"`, `"Pongal festivals"`, `"cricket World Cups"` (js/ui.js lines 204 to 207)
- Cricket World Cup footnote: `"If they stay every 4 years"` (js/ui.js line 207)
- So far section title: `"So far"` (js/ui.js line 249)
- So far card labels: `"weeks lived"`, `"days lived"`, `"full moons seen"`, `"heartbeats"` (js/ui.js lines 257 to 260)
- Heartbeats footnote: `"At about 72 beats a minute"` (js/ui.js line 260)
- "How we count" accordion title: `"How we count"` (js/ui.js line 299)
- "How we count" paragraph 1: `"Each row is one year of your age. A year is 52 weeks plus a day or two, so the dot count can differ from your exact week count by a few."` (js/ui.js line 301)
- "How we count" paragraph 2: `"Full moons use the average moon cycle of 29.53 days, so any single date can be a day off."` (js/ui.js line 302)
- "How we count" paragraph 3: `"Pongal is counted on 14 January each year."` (js/ui.js line 303)
- "How we count" paragraph 4: `"World Cups: the next men's 50-over Cricket World Cup is in October and November 2027. We assume one every 4 years after that."` (js/ui.js line 304)
- "How we count" paragraph 5: `"Heartbeats use an average of 72 beats a minute."` (js/ui.js line 305)

### 7. Closing Card and Sharing Actions
- Closing card title (Standard): `"That is a lot of Sundays."` (js/ui.js line 320)
- Closing card title (Bonus mode): `"Every week is a bonus."` (js/ui.js line 320)
- Closing card body: `"Spend a few of them learning something new."` (js/ui.js line 325)
- Format toggle options: `"Post"`, `"Status"` (js/ui.js lines 344, 351)
- Primary share button: `"Share my dots"` (js/ui.js line 359)
- Share button loading state: `"Preparing image..."` (js/share.js line 35)
- WhatsApp share button: `"Send link on WhatsApp"` (js/ui.js line 368)
- Copy link button: `"Copy link"` (js/ui.js line 375)
- Copy link feedback: `"Copied"` (js/share.js line 125)
- Reset button: `"Try another date"` (js/ui.js line 382)
- Replay button: `"Watch again"` (js/ui.js line 389)

### 8. Tool Tab Titles and Headers
- History tool title: `"Your life in history"` (js/tabs.js line 13)
- History tool subtitle: `"Moments you lived through, pinned to your dots."` (js/tabs.js line 13)
- Chapters tool title: `"Paint your chapters"` (js/tabs.js line 14)
- Chapters tool subtitle: `"Colour the dots you have lived. Chapters stay on this page only."` (js/tabs.js line 14)
- Time tool title: `"Where your weeks go"` (js/tabs.js line 15)
- Time tool subtitle: `"If every day looked like today, this is how your weeks ahead would add up."` (js/tabs.js line 15)
- Milestones tool title: `"Nerd birthdays"` (js/tabs.js line 16)
- Milestones tool subtitle: `"Days worth celebrating that most people never notice."` (js/tabs.js line 16)

### 9. History Tab
- Category filter labels: `"All"`, `"Cricket"`, `"Space"`, `"Tamil Nadu"`, `"More"` (js/history-data.js lines 48 to 52)
- Age badge (general): `"You were [age]"` (js/history.js line 15)
- Age badge (infancy): `"You were a baby"` (js/history.js line 15)
- Empty state: `"Your first moments in history are still ahead."` (js/history.js line 144)
- Filter empty state: `"No moments in this category for your lived years."` (js/history.js line 154)
- Pre-birth accordion summary: `"[N] moments happened before you were born."` (js/history.js line 237)
- History footnote: `"Dates as reported in India. One dot can hold more than one moment."` (js/history.js line 267)

### 10. Chapters Tab
- Preset chips: `"+ School"`, `"+ College"`, `"+ First job"`, `"+ New city"`, `"+ Custom"` (js/chapters-ui.js lines 46 to 50)
- Empty state: `"No chapters yet. Tap a preset above to colour your life."` (js/chapters-ui.js line 114)
- Name input placeholder: `"Chapter name"` (js/chapters-ui.js line 148)
- Date group labels: `"Start"`, `"End"` (js/chapters-ui.js lines 183, 245)
- Ongoing chapter checkbox label: `"Still going"` (js/chapters-ui.js line 256)
- Overlap rule note: `"Where chapters overlap, the one lower in the list shows."` (js/chapters-ui.js line 73)
- Chapter Validation Errors:
  - Empty name: `"Please give this chapter a name."` (js/chapters.js line 30)
  - Disallowed symbols: `"Names can use letters, numbers and spaces."` (js/chapters.js line 36)
  - Length over 20 characters: `"Please keep it under 20 letters."` (js/chapters.js line 40)
  - Missing start month or year: `"Please pick a start month and year."` (js/chapters.js line 48)
  - Start month before birth: `"That is before you were born."` (js/chapters.js line 56)
  - Start month in future: `"That is in the future."` (js/chapters.js line 61)
  - Missing end month or year: `"Please pick an end month and year."` (js/chapters.js line 67)
  - End month in future: `"That is in the future. Tick Still going instead."` (js/chapters.js line 75)
  - End month before start month: `"The end is before the start."` (js/chapters.js line 80)

### 11. Time Tab
- Horizon toggle options: `"Next year"`, `"Next 10 years"`, `"All weeks ahead"` (js/timebudget-ui.js lines 57 to 59)
- Highlights line 1: `"Your phone gets about [N] weeks of your next 10 years."` (js/timebudget.js line 123)
- Highlights line 2: `"Learning gets about [N] weeks. That is about [H] hours."` (js/timebudget.js line 124)
- Swap button label: `"Swap 1 hour of phone for learning"` (js/timebudget-ui.js line 112)
- Swap feedback chip: `"+[N] weeks of learning"` (js/timebudget-ui.js line 363)
- Slider title: `"Daily Hours"` (js/timebudget-ui.js line 164)
- Remaining free time label: `"Free time (remaining)"` (js/timebudget-ui.js line 185)
- Slider limit error: `"That adds up to more than 24 hours. Lower one of them."` (js/timebudget.js line 81)
- Muted philosophy note: `"Not good or bad. Just worth knowing."` (js/timebudget-ui.js line 245)
- Bonus mode card: `"Every week from here is a bonus. Spend them your way."` (js/timebudget.js line 46)
- Educational CTA: `"Want to put those hours to work? See what you can learn at Wrench Wise"` (js/timebudget-ui.js line 253)

### 12. Milestones Tab
- Spotlight card eyebrow: `"Next up"` (js/milestones-ui.js line 80)
- Relative time formats: `"in [N] days"`, `"in about [M] months"`, `"in about [Y] years"` (js/dates.js lines 260, 264, 267)
- Age phrasing: `"You will be [age]"` (js/milestones-ui.js line 111) and `"at [age]"` (js/milestones-ui.js line 209)
- Calendar button label: `"Add to calendar"` (js/milestones-ui.js lines 121, 235)
- Status badges: `"Done"` (js/milestones-ui.js line 182) and `"Today!"` (js/milestones-ui.js line 187)
- Footnote 1: `"Billion-second days depend on the time you were born, so they can be a day off."` (js/milestones-ui.js line 274)
- Footnote 2: `"Mars birthdays use a Mars year of 686.98 Earth days."` (js/milestones-ui.js line 278)
- Footnote 3: `"Full moons use the average moon cycle."` (js/milestones-ui.js line 282)

### 13. Generated Share Images
- Share title (Overview): `"My life in dots"` (js/shareImage.js line 106)
- Share title (Chapters): `"My life in chapters"` (js/shareImage.js line 107)
- Share subline (Standard): `"[weeks] weeks lived. About [sundays] Sundays ahead."` (js/shareImage.js line 283)
- Share subline (Bonus mode): `"[weeks] weeks lived. Every week is a bonus."` (js/shareImage.js line 281)
- Share subline (History): `"I was [age] when [event]."` (js/shareImage.js line 288)
- Share subline (Time): `"My next 10 years: about [learnWeeks] weeks of learning."` (js/shareImage.js line 303)
- Share subline (Milestones): `"My next nerd birthday: [label], [inAbout]."` (js/shareImage.js line 310)
- Share footer right: `"Make yours at wrench-wise.com"` (js/shareImage.js line 342)

### 14. Footer
- Credit line: `"Built with code by Wrench Wise"` (index.html line 74)
- Link text: `"Learn to build apps like this"` (index.html line 76)


---

## 14. Settings and Saved Data

### Browser Storage Audit

The application enforces a strict privacy sandbox. Sensitive user data (such as birth date, age, chapter names, chapter eras, and daily time slider values) is stored solely in volatile browser RAM and is never written to disk, cookies, or remote endpoints (PROJECT_BRIEF.md Section 2 Rule 3, UPGRADE_BRIEF.md Section 2 Rule 2).

| Storage Mechanism | Exact Key Name | Allowed Values | Content and Purpose | Code Location |
| :--- | :--- | :--- | :--- | :--- |
| `localStorage` | `lid-theme` | `"dark"` or `"light"` | Remembers whether the user prefers dark theme (`#0F172A`) or light theme (`#FFFFFF`). Read at initial page boot to prevent a bright screen flash. Wrapped in `try...catch`. | js/theme.js lines 3, 11, 19; index.html line 32 |
| `localStorage` | `lid-muted` | `"1"` or `"0"` | Remembers whether audio synthesis is muted ("1") or active ("0"). Wrapped in `try...catch`. | js/audio.js lines 3, 45, 229 |
| `sessionStorage` | None | None | The app never reads or writes to `sessionStorage`. Zero keys exist. | Verified in self-test js/selftest.js line 174 |
| Cookies | None | None | The app sets zero cookies and reads zero cookies. | Verified across codebase |
| Cache Storage / Service Worker | None | None | No Service Worker or offline Cache Storage API is registered. | Verified in index.html |

---

### Configurable Values in Code (Master Tunables Table)

Every speed, limit, timing, dimension, and threshold in the project can be customized in the codebase. The following table lists every tunable value and where it lives:

| Category | Setting / Parameter Name | Default Value | Plain-English Meaning | File and Line Number |
| :--- | :--- | :--- | :--- | :--- |
| **Grid Geometry** | Columns per year | `52` | Columns in the canvas grid (one dot per week) | js/grid.js line 41 |
| **Grid Geometry** | Dot diameter ratio | `0.72 * s` | Ratio of dot diameter to pitch cell size `s` | js/grid.js line 44 |
| **Grid Geometry** | Dot radius ratio | `0.36 * s` | Radius of each rendered circle | js/grid.js line 45 |
| **Grid Geometry** | Decade gap spacing | `0.8 * s` | Vertical blank separation between 10-year blocks | js/grid.js line 48 |
| **Grid Geometry** | Gutter width (Laptop) | `24` px | Width of left age label gutter on laptops | js/grid.js line 27 |
| **Grid Geometry** | Gutter width (Phone) | `20` px | Width of left age label gutter on phones | js/grid.js line 27 |
| **Lifespan Options** | Allowed horizon options | `[70, 80, 90, 100]` | Available lifespan horizon choices | js/dates.js line 83, js/ui.js line 99 |
| **Lifespan Options** | Default lifespan | `80` years | Default active horizon pill | js/ui.js line 98 |
| **Astronomy** | Lunar synodic period | `29.530588853` days | Average days between identical moon phases | js/dates.js line 6 |
| **Astronomy** | Full moon reference date | `dayNumber(2025, 1, 13) + 1347 / 1440` | Calibration epoch: 13 Jan 2025 at 22:27 UTC | js/dates.js line 27 |
| **Astronomy** | Mars orbital period | `686.98` days | Earth solar days per Martian revolution | js/dates.js lines 281, 284 |
| **Calendar Rules** | Pongal calendar day | `14` January | Annual harvest festival reference date | js/dates.js line 130 |
| **Calendar Rules** | Cricket World Cup cadence | Every `4` years on `1` Oct starting `2027` | Assumed future World Cup schedule | js/dates.js lines 140 to 141 |
| **Physiology** | Average heart rate | `72` beats/min | Constant used to estimate total heartbeats | js/stats.js line 21 |
| **Animation Timing**| Home card fade-out | `0.5` seconds | Duration for home card exit | js/reveal.js line 61 |
| **Animation Timing**| Camera intro duration | `3.0` seconds (0.5 to 3.5 s) | Length of the 3-stage camera intro | js/reveal.js lines 62 to 63 |
| **Animation Timing**| Standard fill duration | `3.6` seconds | Duration of lived dots fill for age > 150 weeks | js/reveal.js line 59 |
| **Animation Timing**| Short fill duration | `1.2` seconds | Duration of lived dots fill if under 150 weeks | js/reveal.js line 59 |
| **Animation Timing**| "You are here" pause | `0.7` seconds | Pause after fill before flashbacks begin | js/reveal.js line 67 |
| **Animation Timing**| Flashback pick duration | `2.0` seconds | Screen time per historical flashback event | js/reveal.js line 68 |
| **Animation Timing**| The Turn easing duration | `1.2` seconds | Duration of Sundays counter count-up | js/reveal.js line 284 |
| **Animation Timing**| Stat card stagger | `80` ms | Delay between consecutive stat card entrances | js/reveal-helpers.js line 30 |
| **Animation Timing**| Stat card counter duration| `800` ms | Length of number count-up in each card | js/reveal-helpers.js line 28 |
| **Flashback Logic** | Maximum flashback picks | `3` picks | Maximum historical picks shown during reveal | js/history.js line 77 |
| **Flashback Logic** | Candidate minimum age | `5` years | Events lived under age 5 are skipped if possible | js/history.js line 66 |
| **Flashback Logic** | Cricket pick limit | `2` picks | Prevents cricket from dominating all 3 picks | js/history.js line 79 |
| **Audio Synthesis** | Master volume gain | `0.8` (unmuted) / `0.0` (muted) | Web Audio master gain level | js/audio.js line 26 |
| **Audio Synthesis** | Dynamics compressor ratio | `12` | Web Audio compression ratio to avoid clipping | js/audio.js line 22 |
| **Audio Synthesis** | Intro swell noise filter | `400` Hz sweeping to `1600` Hz | Lowpass biquad filter range | js/audio.js lines 79 to 80 |
| **Audio Synthesis** | Fill tick maximum rate | `20` ticks per second (`50` ms) | Minimum separation between row ticks | js/audio.js line 112 |
| **Audio Synthesis** | Fill tick pitch | `1100 + decade * 60` Hz | Pitch increase per 10-year age decade | js/audio.js line 116 |
| **Audio Synthesis** | Chime dual notes | `660` Hz and `990` Hz | Pitch of the two "You are here" chime notes | js/audio.js lines 140 to 141 |
| **Audio Synthesis** | Flashback pop glide | `520` Hz to `780` Hz | Triangle wave pitch glide for flashback pop | js/audio.js lines 172 to 173 |
| **Audio Synthesis** | Turn chord frequencies | `392` Hz, `494` Hz, `587` Hz | Musical frequencies for G4, B4, D5 chord | js/audio.js line 191 |
| **Chapters Limits** | Maximum chapters | `8` chapters | Upper limit of chapter cards allowed | js/chapters-ui.js line 87 |
| **Chapters Limits** | Max name length | `20` graphemes | Character cap on chapter name inputs | js/chapters.js line 39 |
| **Chapters Limits** | Live debounce delay | `150` ms | Input debounce before repainting canvas | js/chapters-ui.js line 100 |
| **Time Tool** | Default sliders | Sleep 8h, Work 8h, Travel 1h, Phone 3h, Learn 1h | Initial values for daily sliders | js/timebudget.js lines 15 to 21 |
| **Time Tool** | Slider step size | `0.5` hours | Granularity of slider adjustments | js/timebudget-ui.js line 227 |
| **Time Tool** | Swap feedback hold | `2000` ms | How long the "+21 weeks" chip remains visible | js/timebudget-ui.js line 368 |
| **Share Images** | Default share size | `"status"` (1080 by 1920) | Pre-selected aspect ratio format | js/share.js line 4 |
| **Share Images** | Post dimensions | `1080` by `1350` px | 4 by 5 aspect ratio for social media posts | js/shareImage.js line 75 |
| **Share Images** | Status dimensions | `1080` by `1920` px | 9 by 16 aspect ratio for vertical status stories | js/shareImage.js line 75 |
| **Layout Breakpoint**| Laptop media query | `900` px | Screen width separating mobile from desktop | styles.css line 358, tabs.css line 298 |

---

## 15. Testing

### Automated Self-Test Suite Report (`?test=1`)

The project contains a built-in automated test suite that validates every calendar calculation, validation boundary, hit test, privacy check, and v2 tool logic. Running the test suite against the fixed reference date of 23 October 2026 yields **100 percent pass rate with 0 failures** across all 75 test rows (js/selftest.js, js/selftest-v2.js).

```
======================================================
YOUR LIFE IN DOTS - FULL SELF-TEST REPORT (Fixed Today: 2026-10-23)
======================================================
```

#### Table 1: So Far Verification (Cases A to G)
Verifies days lived, weeks lived, age, week index, lived dots, total dots, full moons seen, and heartbeats (js/selftest.js lines 33 to 67).

| Case | DOB | Life Picked | Life Used | Days | Weeks | Age | Week Idx | Lived Dots | Total Dots | Moons | Heartbeats | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| A | 2004-06-12 | 80 | 80 | 8168 | 1166 | 22 | 19 | 1163 | 4160 | 276 | about 847 million | PASS |
| B | 1998-03-15 | 80 | 80 | 10449 | 1492 | 28 | 31 | 1487 | 4160 | 353 | about 1.08 billion | PASS |
| C | 2000-02-29 | 80 | 80 | 9733 | 1390 | 26 | 33 | 1385 | 4160 | 329 | about 1.01 billion | PASS |
| D | 2026-10-23 | 80 | 80 | 0 | 0 | 0 | 0 | 0 | 4160 | 0 | 0 | PASS |
| E | 1950-06-01 | 70 | 80 (moved up) | 27903 | 3986 | 76 | 20 | 3972 | 4160 | 944 | about 2.89 billion | PASS |
| F | 2010-12-31 | 90 | 90 | 5775 | 825 | 15 | 42 | 822 | 4680 | 195 | about 599 million | PASS |
| G | 1926-01-01 | 80 | bonus | 36820 | 5260 | 100 | 42 | 5242 | 5252 | 1246 | about 3.82 billion | PASS |

#### Table 2: Ahead Verification (Cases A to F)
Verifies end date, remaining Sundays, Pongal mornings, cricket World Cups, and future full moons (js/selftest.js lines 70 to 92).

| Case | End Date | Sundays | Pongal | World Cups | Full Moons | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| A | 2084-06-12 | 3008 | 58 | 15 | 713 | PASS |
| B | 2078-03-15 | 2682 | 52 | 13 | 636 | PASS |
| C | 2080-02-29 | 2784 | 54 | 14 | 660 | PASS |
| D | 2106-10-23 | 4174 | 80 | 20 | 990 | PASS |
| E | 2030-06-01 | 188 | 4 | 1 | 45 | PASS |
| F | 2100-12-31 | 3871 | 74 | 19 | 918 | PASS |

#### Table 3: Validation, Sunday Rule, Hit Testing & Privacy Checks
Verifies boundary conditions, modulo calendar logic, canvas hit testing across 4 viewports, and zero data leakage (js/selftest.js lines 95 to 184).

| Test Description | Status |
| :--- | :--- |
| Validation: 31 Feb 2001 rejected | PASS |
| Validation: 29 Feb 2001 rejected | PASS |
| Validation: 29 Feb 2000 accepted | PASS |
| Validation: Tomorrow rejected | PASS |
| Validation: Today accepted | PASS |
| Validation: Missing year rejected | PASS |
| Validation: Missing month rejected | PASS |
| Validation: Missing day rejected | PASS |
| Sunday rule: 25 Oct 2026 is Sunday | PASS |
| Sunday rule: 23 Oct 2026 is not Sunday | PASS |
| Hit testing: 390x844 (80 rows) 50 dots and decade gaps | PASS |
| Hit testing: 390x844 (101 rows) 50 dots and decade gaps | PASS |
| Hit testing: 1440x900 (80 rows) 50 dots and decade gaps | PASS |
| Hit testing: 1440x900 (101 rows) 50 dots and decade gaps | PASS |
| Privacy: DOB never in URL or storage | PASS |

#### Table 4: History & Flashback Checks (v2 Section 7A)
Verifies lived events count, pre-birth count, top 3 flashback picks, and exact sentence phrasing (js/selftest-v2.js lines 24 to 62).

| Case | Lived Events | Before Birth | Flashback Picks / Exact Sentence | Status |
| :--- | :--- | :--- | :--- | :--- |
| A | 20 (exp 20) | 11 (exp 11) | wc-2011, 6, 354 / mars, 10, 534 / chandrayaan-3, 19, 998 | PASS |
| B | 21 (exp 21) | 10 (exp 10) | t20-2007, 9, 495 / wc-2011, 13, 678 / chandrayaan-3, 25, 1323 | PASS |
| C | 20 (exp 20) | 11 (exp 11) | t20-2007, 7, 393 / wc-2011, 11, 576 / chandrayaan-3, 23, 1221 | PASS |
| D | 0 (exp 0) | 31 (exp 31) | none | PASS |
| E | 29 (exp 29) | 2 (exp 2) | moon-walk, 19, 995 / wc-2011, 60, 3163 / chandrayaan-3, 73, 3807 | PASS |
| F | 18 (exp 18) | 13 (exp 13) | chandrayaan-3, 12, 657 / t20-2024, 13, 701 / women-wc, 14, 771 | PASS |
| G | 31 (exp 31) | 0 (exp 0) | moon-walk, 43, 2264 / wc-2011, 85, 4433 / chandrayaan-3, 97, 5077 | PASS |
| Sentence A | N/A | N/A | You were 6 when India won the Cricket World Cup for the second time. | PASS |
| Sentence F | N/A | N/A | You were 14 when India's women won their first Cricket World Cup. | PASS |
| Sentence E | N/A | N/A | You were 19 when humans first walked on the Moon. | PASS |

#### Table 5: Milestones Checks (v2 Section 7B)
Verifies all 12 landmarks for Case A, bundle checks for Cases B, E, G, and `.ics` file generation (js/selftest-v2.js lines 66 to 193).

| Label | Date | Age | Status | Dot Index | In About | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1,000 weeks old | 2023-08-12 | 19 | done | 996 | | PASS |
| You turn 12 on Mars | 2027-01-06 | 22 | ahead | 1173 | in about 2 months | PASS |
| 10,000 days old | 2031-10-29 | 27 | ahead | 1423 | in about 5 years | PASS |
| 1 billion seconds old | 2036-02-19 | 31 | ahead | 1648 | in about 9 years | PASS |
| 2,000 weeks old | 2042-10-11 | 38 | ahead | 1993 | in about 16 years | PASS |
| 20,000 days old | 2059-03-16 | 54 | ahead | 2847 | in about 32 years | PASS |
| 3,000 weeks old | 2061-12-10 | 57 | ahead | 2989 | in about 35 years | PASS |
| 2 billion seconds old | 2067-10-28 | 63 | ahead | 3295 | in about 41 years | PASS |
| 25,000 days old | 2072-11-22 | 68 | ahead | 3559 | in about 46 years | PASS |
| 4,000 weeks old | 2081-02-08 | 76 | ahead | 3986 | in about 54 years | PASS |
| 1,000th full moon | 2085-04-09 | 80 | hidden | - | | PASS |
| 30,000 days old | 2086-08-01 | 82 | hidden | - | | PASS |
| Case A nextUp check | 2027-01-06 | 22 | ahead | 1173 | You turn 12 on Mars | PASS |
| Case B milestone bundle | 2028-04-17 | 30 | ahead | 1564 | in about 18 months | PASS |
| Case E milestone bundle | 2027-01-28 | 76 | ahead | 3986 | in about 3 months | PASS |
| Case G milestone bundle | 2027-07-26 | 101 | ahead (no marker) | - | in about 9 months | PASS |
| Calendar file (Case A 10,000 days) | 2031-10-29 | 27 | ics content | 1423 | SUMMARY/DTSTART/DTEND | PASS |

#### Table 6: Time Split Checks (v2 Section 7C)
Verifies week partitioning, largest remainder allocation, swap calculation, and limit rejections (js/selftest-v2.js lines 197 to 239).

| Case | H (Weeks) | Weeks Split | Learning Hours | Status |
| :--- | :--- | :--- | :--- | :--- |
| A (year) | 52 (exp 52) | [17, 17, 2, 7, 2, 7] | 364 | PASS |
| A (10years) | 520 (exp 520) | [173, 173, 22, 65, 22, 65] | 3640 | PASS |
| A (ahead) | 2996 (exp 2996) | [999, 999, 125, 374, 125, 374] | 20972 | PASS |
| A (swapped) | 520 (exp 520) | [174, 173, 22, 43, 43, 65] | 7280 | PASS |
| A (custom) | 520 (exp 520) | [163, 195, 32, 54, 11, 65] | 1820 | PASS |
| B (ahead) | 2672 (exp 2672) | [891, 891, 111, 334, 111, 334] | 18704 | PASS |
| E (capped) | 187 (exp 187) | [62, 62, 8, 24, 8, 23] | 1309 | PASS |
| E (swapped) | 187 (exp 187) | [62, 62, 8, 16, 16, 23] | 2618 | PASS |
| Rejection: Sleep 12 + Work 12 + Travel 1 | 0 | rejected | 0 | PASS |
| Swap chip text check | 520 | +21 weeks of learning | 7280 | PASS |

#### Table 7: Chapters Checks (v2 Section 7D)
Verifies preset date ranges, overlap handling, birth month anchoring, and validation rejections (js/selftest-v2.js lines 243 to 298).

| Check / Preset / Validation | Dot Range / Error Text | Status |
| :--- | :--- | :--- |
| School preset (Jun 2009 to Mar 2021) | 258 to 873 | PASS |
| College preset (Jul 2021 to May 2025) | 886 to 1090 | PASS |
| First job (Jul 2025, Still going) | 1094 to 1163 | PASS |
| Birth month chapter starts at dot 0 | start dot 0 | PASS |
| Rejection: Start Jan 2004 before birth | That is before you were born. | PASS |
| Rejection: End Dec 2026 in future | That is in the future. Tick Still going instead. | PASS |
| Rejection: End before start | The end is before the start. | PASS |
| Rejection: Empty name | Please give this chapter a name. | PASS |
| Rejection: 21-letter name | Please keep it under 20 letters. | PASS |
| Rejection: Name with < | Names can use letters, numbers and spaces. | PASS |

---

### Step-by-Step Manual Browser Verification Checklist

Follow these click steps in Google Chrome, Microsoft Edge, or Safari to verify every feature manually:

1. **Self-Test Suite Verification:**
   - Open `http://localhost:8000/?test=1` in your browser.
   - Confirm that the green badge in the top right states: **ALL TESTS PASSED**.
   - Check that all 7 tables display green `PASS` text in every row.

2. **Home Screen and Form Validation:**
   - Open `http://localhost:8000/`.
   - Tap "Show my life" without selecting dates. Confirm the red error message: "Please pick your full date of birth."
   - Select Day: 31, Month: Feb, Year: 2020. Tap "Show my life". Confirm the error: "That date does not exist. Please check the day."
   - Select Day: 12, Month: Jun, Year: 2004. Tap "80 years". Tap "Show my life".

3. **Cinematic Reveal and Audio:**
   - Confirm the home card dissolves upward.
   - Listen for the rising soft noise intro swell. Check that Dot 0 grows with caption "This is one week."
   - Confirm the camera pulls back to Row 0 ("52 weeks make one year.") and then full grid ("This is a life of 80 years.").
   - Watch the lived dots fill from emerald to cyan. Listen for the soft ticks at each decade line.
   - Verify that dot 1,163 lands, pops 1.8x, and pulses with the label "You are here" and a two-note chime.
   - Observe the 3 flashback amber markers and listen for the pop sound.
   - Hear the 3-note turn chord and watch the headline count up to "You have about 3,008 Sundays ahead."

4. **Grid Dot Inspection:**
   - Hover your mouse (or tap on phone) over dot 0 (top left). Confirm tooltip: "Age 0, week 1 • Around Jun 2004".
   - Hover over the pulsing current dot. Confirm tooltip: "Age 22, week 20 • This week".
   - Hover over a future dot in decade 50. Confirm tooltip displays the correct future age and season.

5. **History Tab Exploration:**
   - Tap the "History" tab (bottom bar on phone, top right on laptop).
   - Confirm that the canvas dims to 30 percent opacity and amber dots highlight historical moments.
   - Tap the "Cricket" filter chip. Confirm that only cricket moments remain in the list.
   - Tap the row "2011 World Cup". Confirm that dot 354 pulses on the canvas in amber and the canvas scrolls smoothly to row 6.
   - Expand "11 moments happened before you were born" at the bottom and inspect pre-birth dates.

6. **Chapters Creation and Overlaps:**
   - Tap the "Chapters" tab.
   - Tap "+ School", "+ College", and "+ First job".
   - Confirm that lived dots on the canvas immediately recolor in emerald, cyan, and indigo.
   - Confirm that unassigned lived dots (early childhood) turn soft mint green.
   - Type a 21-character name in a chapter box. Confirm error: "Please keep it under 20 letters."

7. **Time Budget and Hour Swap:**
   - Tap the "Time" tab.
   - Confirm that future weeks recolor to match the stacked bar segments.
   - Verify that highlights state: "Your phone gets about 65 weeks... Learning gets about 22 weeks."
   - Tap "Swap 1 hour of phone for learning".
   - Confirm that the green chip "+21 weeks of learning" pops up, learning weeks increase to 43, and 21 dots on the canvas animate with a bouncy pop and turn emerald.

8. **Milestones and Calendar Export:**
   - Tap the "Milestones" tab.
   - Inspect the Next-Up card: "You turn 12 on Mars • in about 2 months • You will be 22".
   - Tap "Add to calendar". Confirm that on a laptop, a file named `nerd-birthday.ics` downloads immediately.
   - Open the `.ics` file in any text editor and confirm it contains `SUMMARY:I turn 12 on Mars` and `DTSTART;VALUE=DATE:20270106`.

9. **Theme Toggle and Sound Mute:**
   - Tap the theme toggle button in the header. Confirm that the page smoothly switches to dark theme (`#0F172A`) without flickering. Refresh the page and confirm dark theme persists.
   - Tap the audio button in the header. Confirm the icon switches to a muted speaker with an X mark. Tap "Watch again" and confirm the reveal runs silently.

10. **Image Sharing:**
    - On the closing card, select the "Status" pill.
    - Tap "Share my dots".
    - Confirm that a 1080 by 1920 pixel PNG image named `life-in-dots.png` downloads (or opens the native share sheet on mobile).
    - Open the image and confirm that it shows your life grid, title "My life in dots", stats summary, Wrench Wise logo, and "Make yours at wrench-wise.com".


---

## 16. Deployment

This section describes where the source code lives, how the application is hosted on the internet, the step-by-step process of shipping updates, and how web caching affects what users see.

### Code Repository and Branch

| Detail | Value | Location or Reference |
| :--- | :--- | :--- |
| Source Control System | Git | git repository metadata |
| Remote Repository URL | https://github.com/Pradeep-B28/Life_In_Dots.git | git remote -v |
| Production Branch | main | git branch --show-current |
| Working Development Branch | main | git status |
| Briefs Branch Reference | upgrade-v2 was specified in UPGRADE_BRIEF.md Section 9, but work was committed directly to main | git log --oneline |

### Web Hosting Infrastructure

1. **Host Provider:** Vercel (https://vercel.com). Vercel is a cloud platform that hosts static websites and web applications on global edge servers.
2. **Production Domain:** https://lifeindots.vercel.app (README.md line 3, index.html line 15).
3. **Architecture:** Pure static hosting. There is no server runtime (such as Node.js, Python, or Ruby) running on the host. The server simply serves static HTML, CSS, JavaScript, JSON, and PNG files over HTTPS (Hypertext Transfer Protocol Secure).
4. **Build Command:** None. The project requires zero compilation, zero bundling, and zero transpilation. Vercel serves the root folder directly as static assets.
5. **Output Directory:** The root repository folder (`.`).

### Step-by-Step Update Workflow

To publish a code change to the live web application, follow these steps:

1. **Local Editing:**
   - Modify the necessary code files (for example, `js/history-data.js` to add an event, or `styles.css` to adjust styling) in your local editor.

2. **Local Verification:**
   - Start a local HTTP server using Python: `python -m http.server 8000`.
   - Open `http://localhost:8000/?test=1` in your browser.
   - Confirm that all 7 automated test suites pass with 100 percent pass rate (75 of 75 assertions).
   - Open `http://localhost:8000/?demo=1` to verify the user experience visually.

3. **Stage Changes:**
   - In your command line terminal, stage the modified files:
     `git add .`

4. **Commit Changes:**
   - Commit the changes with a clear summary:
     `git commit -m "feat: add 2026 lunar eclipse to history moments"`

5. **Push to Remote Repository:**
   - Push the committed changes to GitHub:
     `git push origin main`

6. **Automatic Vercel Deployment:**
   - Vercel detects the new commit on the `main` branch via a GitHub webhook.
   - Vercel pulls the latest commit, confirms zero build errors, and deploys the new static files across its global edge network.
   - Deployment typically completes within 10 to 25 seconds.

### Caching and Version Management

Web caching is when browsers or edge servers store copies of files so they do not have to download them again on every visit. Caching can make people see an older version of the app after an update:

1. **Vercel Edge Network Cache:**
   - Vercel automatically invalidates its edge cache whenever a new Git deployment succeeds. Edge servers immediately receive the newest version of all files.

2. **Browser HTTP Cache:**
   - When a person visits the website, their browser stores copies of `index.html`, `styles.css`, and JavaScript files in its local memory.
   - Because file paths in `index.html` do not use version tags or content hashes (for example, the file is imported as `import { initApp } from './js/app.js';` rather than `./js/app.js?v=2`), a visitor's browser might continue using an older cached script for several hours or days until the browser's HTTP cache timer expires.

3. **How to Bypass Browser Cache (Hard Refresh):**
   - On Windows and Linux laptops: Press `Ctrl + F5` or `Ctrl + Shift + R` in Google Chrome, Microsoft Edge, or Mozilla Firefox.
   - On Apple Mac laptops: Press `Cmd + Shift + R` in Safari or Chrome.
   - On mobile phones: Open browser settings, choose "Clear Browsing Data", select "Cached images and files", and tap clear. Alternatively, open the website in a private or incognito tab.

4. **Service Worker and PWA Caching:**
   - The application includes a `manifest.json` file for Progressive Web App (PWA) installation on mobile home screens.
   - However, the app does not register a Service Worker (`navigator.serviceWorker`). A Service Worker is a background script that can trap and serve files offline. Because no Service Worker is registered, there is no risk of aggressive offline cache traps locking users into outdated versions.


---

## 17. Honest Status

This section provides a transparent, candid evaluation of the codebase today. It lists known bugs, technical limitations, discrepancies between planning briefs and working code, and operational risks.

### Known Bugs and Code Oddities

1. **Duplicate History Data File:**
   - There are two identical copies of the history database in the repository: `history-data.js` in the project root folder and `js/history-data.js` in the JavaScript folder.
   - The application imports from `./js/history-data.js` (js/app.js line 10).
   - The root file `history-data.js` is redundant dead code. It consumes repository space and can confuse maintainers who might edit the wrong file by mistake.

2. **Birth Year Dropdown 100-Year Window Limit:**
   - The birth year dropdown on the home screen populates exactly 101 entries, ranging from `currentYear - 100` to `currentYear` (js/ui.js lines 88 to 92).
   - A person aged 101 or older cannot choose their birth year using the standard home form dropdown, even though the application engine supports life spans of 105 or 120 years in bonus mode (`?bonus=1`).

3. **Android Milestone Sharing Sends Data to External Server:**
   - The project claims that all user data remains 100 percent private on the device (README.md line 24).
   - However, when an Android user taps "Add to calendar" for a milestone, the app opens an external Google Calendar web URL: `https://calendar.google.com/calendar/render?action=TEMPLATE...` (js/milestones.js lines 142 to 146).
   - This web request transmits the title of the milestone and its calculated date across the internet to Google's servers.

4. **Multiple CSS Link Requests:**
   - The `index.html` file includes 7 separate `<link rel="stylesheet">` tags in the `<head>` section (index.html lines 19 to 25).
   - On slow mobile networks (2G or 3G), making 7 separate HTTP network roundtrips can delay page rendering slightly compared to combining styles into a single minified file.

### Technical Limitations

1. **Canvas Accessibility for Screen Readers:**
   - All 4,160 dots are rendered onto an HTML5 2D `<canvas>` element (js/canvas.js lines 50 to 140).
   - Pixels drawn onto a canvas cannot be focused, read, or inspected by screen-reading software used by visually impaired visitors. While the container has an ARIA label, the individual weeks, decades, and chapters lack accessible text representations.

2. **Audio Autoplay Browser Security Policies:**
   - Modern browsers (Google Chrome, Apple Safari, Mozilla Firefox) block web pages from playing audio until the user interacts with the page (Web Audio Autoplay Policy).
   - If a user opens the page directly in reveal mode, audio cannot start until their first click or tap on the screen.

3. **High-Density Canvas Memory Footprint:**
   - On high-resolution smartphone screens with a Device Pixel Ratio of 3 (such as iPhone Pro models), the canvas buffer expands to 1,170 by 2,532 pixels or more.
   - While modern mobile GPUs handle this smoothly, older low-cost mobile phones with limited graphics memory may experience brief frame drops during the full-screen cinematic zoom.

### Differences Between Briefs and Code

| Topic | What the Briefs Specified | What the Code Does Today | Where It Lives |
| :--- | :--- | :--- | :--- |
| Git Branch | Work was planned to be developed on branch `upgrade-v2` | All changes were committed directly to branch `main` | git log --oneline |
| History Data File Location | Root folder `history-data.js` | Moved into `js/history-data.js`, with an orphaned duplicate left in root | project root and js/ |
| Sound Synthesizer | Brief described 3 basic sound chords | Built with 6 specialized procedural Web Audio sound cues | js/audio.js lines 1 to 140 |
| Sharing Format | Brief suggested simple card capture | Built with two full card variants: standard 4 by 5 ratio and 9 by 16 vertical status ratio | js/share.js lines 12 to 24 |
| Milestones Export | Brief suggested basic text alert | Built with full RFC 5545 iCalendar (`.ics`) file generation for desktop and Google Calendar URL for Android | js/milestones.js lines 135 to 154 |

### Comprehensive Risk Assessment

#### 1. Accuracy Risks
- **Leap Seconds in Billion-Second Calculations:**
  The 1,000,000,000 second milestone calculation adds `1_000_000_000` integer seconds to the birth timestamp (js/milestones.js line 61). It does not adjust for the 27 leap seconds inserted into UTC since 1972. This introduces a tiny discrepancy of under 30 seconds across 31.7 years, which does not affect the calendar day result.
- **Astronomical Synodic Moon Orbit Fluctuations:**
  The 1,000th Full Moon milestone relies on a constant mean synodic month length of 29.530588853 days (js/milestones.js line 29). In nature, true astronomical lunations vary between 29.18 days and 29.93 days due to orbital eccentricity and solar gravitational perturbations. Therefore, the estimated date of the 1,000th full moon may differ by plus or minus 1 calendar day from the exact astronomical peak.
- **Fixed Cultural Festival Dates:**
  In `js/history-data.js`, the Pongal harvest festival is hardcoded as January 15, 2011. In some years and astronomical almanacs, Pongal occurs on January 14. Fixing the date simplifies calculation but remains a cultural approximation.

#### 2. Speed and Performance Risks
- **Rendering 4,160 Dots Per Frame:**
  The canvas redraws all dots during animation loops. At 60 frames per second, the app performs approximately 250,000 circle drawing operations per second. While desktop computers handle this with less than 2 percent CPU utilization, entry-level smartphones may warm up if left animating for extended periods.

#### 3. Phone and Viewport Risks
- **Short Viewport Heights:**
  On smartphones with screen heights under 650 pixels (such as older phones or browsers with large top address bars), the bottom navigation bar and the canvas control footer can crowd the dot grid, requiring vertical scrolling.

#### 4. Browser Compatibility Risks
- **Blob File Download on Safari Mobile:**
  Generating and downloading `.ics` calendar files via `URL.createObjectURL` behaves differently across mobile browsers. Safari on iOS may prompt to view the file in a new tab rather than saving it directly to Apple Calendar.

#### 5. Accessibility Risks
- **Reliance on Color and Spatial Vision:**
  The dot grid conveys lived versus future time, chapters, and time budget categories purely through color fills. For users with complete color blindness or total vision loss, understanding the grid without descriptive text equivalents is challenging.

#### 6. Legal and Branding Risks
- **Intellectual Property and Logo Usage:**
  The app displays the official Wrench Wise brand logo (`assets/wrench-wise-logo.png`) and links directly to `wrench-wise.com`. Any third party redistributing or forking the codebase must ensure they comply with MIT licensing terms while respecting proprietary trademark assets.


---

## 18. Rebuild Guide

This guide provides a step-by-step roadmap to rebuild the entire Your Life in Dots project from an empty folder. It is designed for students and educators. Each step explains what to build, what files to create, what functionality it adds, and the approximate time required.

### Project Roadmap Overview

| Step | Phase Name | Main Files Created | What It Adds | Estimated Time |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Project Skeleton | index.html, styles.css | HTML structure, containers, and CSS custom property color tokens | 1 hour |
| 2 | Date Math Engine | js/dates.js | Pure mathematical calculations for weeks, leap years, and Sundays | 2 hours |
| 3 | Input Form and UI | js/ui.js, js/app.js | Day, month, and year dropdowns with strict calendar validation | 1.5 hours |
| 4 | Canvas Dot Grid | js/canvas.js, js/grid.js, canvas.css | High-DPI canvas rendering 52 columns by 80 rows with decade gaps | 2.5 hours |
| 5 | Cinematic Reveal Animation | js/reveal.js | Easing transitions, camera zooms, and dot fill animations | 3 hours |
| 6 | Procedural Web Audio | js/audio.js | Synthesizer sound cues without external MP3 audio files | 2 hours |
| 7 | Navigation and State | js/tabs.js, tabs.css, js/theme.js | Tab switching, dark theme toggle, and URL query parameter parsing | 1.5 hours |
| 8 | History Integration | js/history.js, js/history-data.js, history.css | 31 historical moments, category filters, and amber dot highlights | 2 hours |
| 9 | Life Chapters Tool | js/chapters.js, chapters.css | Custom chapters, preset buttons, validation, and lived dot recoloring | 2.5 hours |
| 10 | Time Budget Tool | js/timebudget.js, timebudget.css | 6 time sliders, life category calculation, and 1-hour swap simulation | 2.5 hours |
| 11 | Milestones and Calendar | js/milestones.js, milestones.css | Astronomy milestones, billion seconds, and iCalendar ICS generation | 2.5 hours |
| 12 | Share Card Generation | js/share.js | Offscreen canvas export of 4 by 5 and 9 by 16 PNG images | 2 hours |
| 13 | Automated Test Harness | js/selftest.js, js/selftest-data.js, tools/ | Automated regression test suite and diagnostic visual test pages | 2 hours |
| **Total** | **Full Project Build** | **44 project files** | **Complete interactive web application** | **25 to 29 hours** |

---

### Step-by-Step Build Instructions

#### Step 1: Project Skeleton and Color Tokens (1 hour)
1. Create an empty project folder.
2. Create `index.html`. Add semantic containers: header, home card (`#homeCard`), app card (`#appCard`), canvas container (`#canvasWrapper`), tabs bar (`#tabsBar`), and drawer panel (`#drawerPanel`).
3. Create `styles.css`. Define CSS custom properties under `:root` for the light theme and `[data-theme="dark"]` for the dark theme. Include slate background `#F8FAFC`, dark background `#0F172A`, emerald primary `#059669`, amber accents `#D97706`, and text colors.
4. Add basic CSS resets: `box-sizing: border-box`, clean system font stack (`system-ui, -apple-system, sans-serif`), and mobile responsive viewport meta tag.

#### Step 2: Date Math Engine (2 hours)
1. Create `js/dates.js`.
2. Write `isValidDate(day, month, year)` to verify real calendar days, accounting for leap years where February has 29 days.
3. Write `weeksBetween(startDate, endDate)` using integer day division (`Math.floor(diffDays / 7)`).
4. Write `getDotIndexForDate(birthDate, targetDate)` to convert any calendar date into an integer dot index from 0 to 4,159.
5. Write `countSundaysBetween(startDate, endDate)` to find exactly how many calendar Sundays occur in the remaining life span.
6. Write test assertions in the console to confirm that a birth date of 12 June 2004 correctly produces 1,163 lived weeks on 29 March 2026.

#### Step 3: Input Form and Validation (1.5 hours)
1. Create `js/ui.js` and `js/app.js`.
2. Populate the day dropdown (1 to 31), month dropdown (January to December), and year dropdown (100 years back to current year).
3. Add lifespan preset pill buttons: 70, 80, 90, and 100 years.
4. Add click event listener to the "Show my life" button (`#submitBtn`).
5. Validate user input: if any field is empty or if February 31 is picked, show user-friendly error banners and refuse to proceed.
6. When input is valid, calculate lived weeks and total weeks, store them in the application state, and trigger the reveal sequence.

#### Step 4: Canvas Dot Grid (2.5 hours)
1. Create `canvas.css` and `js/grid.js`.
2. Create `js/canvas.js`. Get the 2D canvas context (`ctx = canvas.getContext('2d')`).
3. Implement `setupCanvas()` to multiply canvas pixel dimensions by `window.devicePixelRatio` (1x, 2x, or 3x) so dots appear crisp on high-resolution Retina displays.
4. Implement the grid layout: 52 columns per row, with extra vertical spacing every 10 rows (decade gap) to clearly delineate 10-year chapters.
5. Implement `drawGrid()`: iterate from dot index 0 to total dots. For each dot, calculate its X and Y coordinates, draw a circle using `ctx.arc()`, and fill with emerald for lived dots or slate gray for future dots.
6. Add mouse and touch hit-testing: calculate which dot the user hovers over, and render an informative tooltip with the person's age and season.

#### Step 5: Cinematic Reveal Animation (3 hours)
1. Create `js/reveal.js`.
2. Break the reveal sequence into sequential camera stages:
   - Stage 0: Dissolve home card and display a single magnified dot ("This is one week.").
   - Stage 1: Expand camera to display the first row ("52 weeks make one year.").
   - Stage 2: Pull camera all the way back to display the full 80-year grid ("This is a life of 80 years.").
   - Stage 3: Progressive fill animation. Use `requestAnimationFrame` to color lived dots one by one from past to present.
   - Stage 4: Arrive at current week dot. Trigger beacon pulse animation (growing ring).
   - Stage 5: Highlight 3 flashback moments in amber.
   - Stage 6: Play celebratory turn chord and count up remaining Sundays.
3. Add skip button (`#skipBtn`) so users can jump straight to the completed grid at any time.

#### Step 6: Procedural Web Audio (2 hours)
1. Create `js/audio.js`.
2. Initialize `AudioContext` on user interaction.
3. Build the 6 procedural sound functions:
   - `playIntroSwell()`: Brown noise through a low-pass filter with rising frequency.
   - `playTick()`: Sine wave burst at 440 Hz lasting 0.04 seconds.
   - `playChime()`: Two sine tones at 523 Hz and 659 Hz.
   - `playChord()`: Three sine tones forming an A-major triad (440 Hz, 554 Hz, 659 Hz).
   - `playPop()`: Pitch drop from 600 Hz down to 200 Hz.
   - `playSwapPop()`: Quick pitch chirp from 300 Hz up to 880 Hz.
4. Add global mute toggle button in header, storing preference in `localStorage.getItem('lid-muted')`.

#### Step 7: Navigation, Tabs, and State (1.5 hours)
1. Create `tabs.css` and `js/tabs.js`.
2. Build tab controls: Overview, History, Chapters, Time, and Milestones.
3. On mobile viewports, position tabs as a fixed bottom bar. On laptop viewports, position tabs in the top header.
4. Implement drawer panel: tapping a tab opens its respective drawer content while adjusting canvas dimming.
5. Create `js/theme.js`: listen to system `prefers-color-scheme`, toggle between light and dark themes, and persist state in `localStorage.getItem('lid-theme')`.
6. Add URL parameter handling in `js/app.js` to parse `?demo=1`, `?test=1`, `?bonus=1`, and `?tab=name`.

#### Step 8: History Integration (2 hours)
1. Create `js/history-data.js` containing 31 notable historical events with exact ISO dates, titles, and categories.
2. Create `history.css` and `js/history.js`.
3. Filter events into two categories: events that occurred during the user's lifetime, and events that occurred before birth.
4. Build category filter chips: All, Cricket, Space, Tamil Nadu, and More.
5. When a user taps a history item, scroll the canvas smoothly to that row and pulse the matching week dot in amber.

#### Step 9: Life Chapters Tool (2.5 hours)
1. Create `chapters.css` and `js/chapters.js`.
2. Define chapter color presets: Emerald, Indigo, Amber, Cyan, Rose, Violet, Orange, and Pink.
3. Add quick-preset buttons: "+ School", "+ College", "+ First job".
4. Add custom chapter form with start month/year, end month/year (or "Still going" checkbox), and title input.
5. Implement strict validation: reject end dates before start dates, reject dates before birth, and reject future end dates.
6. Update canvas rendering: lived dots inside a chapter boundary take that chapter's color. Unassigned lived dots take soft mint green.

#### Step 10: Time Budget Interactive Tool (2.5 hours)
1. Create `timebudget.css` and `js/timebudget.js`.
2. Create 6 category sliders: Sleep (default 8 hours), Work (default 8 hours), Travel (default 1.5 hours), Phone screen time (default 3.5 hours), Learning (default 1 hour), and Free time (calculated remaining hours).
3. Compute total lifetime weeks allocated to each activity: `totalWeeks * (hoursPerDay / 24)`.
4. Draw stacked horizontal distribution bar.
5. Build the "Swap 1 hour of phone for learning" feature: reduce phone by 1 hour, add 1 hour to learning, animate a green badge, and bounce 21 canvas dots into emerald color.

#### Step 11: Milestones Engine and Calendar Export (2.5 hours)
1. Create `milestones.css` and `js/milestones.js`.
2. Compute the 10 fixed milestones: 1,000 days, 10,000 days, 1,000,000,000 seconds, 500,000 hours, 10,000 days, 20,000 days, silver jubilee, golden jubilee, 3,000 Sundays, and 4,000 Sundays.
3. Compute astronomical milestones: 1,000th full moon (`birthMs + 1000 * 29.530588853 days`) and Next Mars Birthday (`birthMs + N * 686.980 days`).
4. Display the single "Next-Up" milestone prominently in a highlighted card.
5. Build the calendar export: generate RFC 5545 formatted `.ics` text file and trigger browser download, or open Google Calendar template on Android devices.

#### Step 12: Share Card Generation (2 hours)
1. Create `js/share.js`.
2. Create an offscreen HTML5 `<canvas>` element (not attached to the visible DOM).
3. Support two export ratios: standard 4 by 5 ratio (1,200 by 1,500 pixels) and vertical 9 by 16 mobile status ratio (1,080 by 1,920 pixels).
4. Draw solid background, project title, person's age and lived weeks, mini dot grid visualization, Wrench Wise brand logo, and web link.
5. Connect to the browser Web Share API (`navigator.share`) for native mobile sharing, with automatic fallback to PNG file download (`life-in-dots.png`).

#### Step 13: Automated Test Harness (2 hours)
1. Create `js/selftest-data.js` and `js/selftest.js`.
2. Build 7 automated test suites:
   - Date math suite (leap years, invalid calendar dates, week counts).
   - Sunday counting suite (exact Sunday frequencies).
   - Milestone calculation suite (billion seconds, Mars orbit, 1,000th full moon).
   - Time budget math suite (24-hour conservation, week multiplications).
   - History filtering suite (pre-birth separation, category counts).
   - URL parameter parsing suite (demo, test, bonus flags).
   - Chapters validation suite (boundary clamping, error handling).
3. Hook up `?test=1` query parameter to render a clean pass/fail dashboard table.
4. Create diagnostic HTML pages in `tools/`: `color-test.html`, `audio-test.html`, and `text-test.html`.


---

## 19. Learning Value

This section outlines the educational value of the project for computer science students, junior developers, and engineering educators. It includes key technical concepts learned, three resume-ready bullet points, and ten technical interview questions with model answers.

### Core Concepts a Student Learns

1. **Vanilla JavaScript and ES Modules:**
   - How to organize a scalable, modular web application across 30 focused JavaScript files without using heavy frameworks (such as React, Vue, or Angular) or bundlers (such as Webpack or Vite).
   - How to import and export functions cleanly between modules using native browser `import` and `export` statements (js/app.js lines 1 to 20).

2. **High-Performance 2D Canvas Rendering:**
   - How to manage the HTML5 2D Canvas context, calculate screen coordinates from mathematical models, and optimize drawing loops for 60 frames per second rendering (js/canvas.js lines 50 to 140).
   - How to handle high-density smartphone screens (Apple Retina and modern Android displays) by scaling canvas dimensions with `window.devicePixelRatio` so shapes never look blurry (js/canvas.js lines 22 to 34).

3. **Procedural Web Audio Synthesis:**
   - How to generate sound dynamically in the browser using the Web Audio API (`AudioContext`, `OscillatorNode`, `GainNode`, and `BiquadFilterNode`) instead of downloading bulky MP3 audio files (js/audio.js lines 10 to 140).
   - How to build sound envelopes with linear and exponential gain ramps (`setValueAtTime`, `exponentialRampToValueAtTime`) to synthesize ticks, chords, chimes, and noise sweeps.

4. **Robust Calendar and Astronomical Mathematics:**
   - How to avoid common date bugs by using UTC timestamps and integer division rather than floating-point math or local timezone dates (js/dates.js lines 10 to 145).
   - How to calculate planetary orbits (Mars solar year of 686.980 days) and lunar cycles (synodic lunar month of 29.530588853 days) using real astronomical constants (js/milestones.js lines 29 to 32).

5. **State Management and Reactive Architecture:**
   - How to manage application state in a central store without third-party libraries like Redux or Zustand, passing read-only state down and triggering targeted DOM and canvas updates on user interaction (js/app.js lines 25 to 60).

6. **Responsive Design and CSS Architecture:**
   - How to structure modern CSS using custom properties (`var(--token)`), fluid typography (`clamp()`), and responsive layout shifts between mobile bottom bars and desktop top headers without media query bloat (styles.css lines 1 to 150).

---

### Resume Bullet Points

- **Front-End Architecture:** Built a zero-dependency life visualization web application rendering up to 6,240 weekly milestones on an HTML5 2D Canvas with Retina DPI scaling, constant-time O(1) hit testing, and 60 FPS animation loops.
- **Algorithm and Math Engineering:** Engineered a private, client-side calendar and astronomical computation engine with 100 percent automated test coverage (75 assertions across 7 test suites), calculating planetary orbits, lunar phases, and billion-second milestones with zero backend latency.
- **Audio and Graphics Synthesis:** Designed a procedural Web Audio synthesis engine generating 6 dynamic sound cues without external audio assets, and created an offscreen canvas pipeline generating branded high-resolution social share cards (4:5 and 9:16 aspect ratios).

---

### 10 Technical Interview Questions and Model Answers

#### Question 1: Why did you render 4,160 dots using HTML5 Canvas instead of regular HTML `<div>` elements?
**Answer:** Rendering 4,160 individual DOM `<div>` elements creates heavy memory overhead and causes severe layout reflow and repaint bottlenecks in the browser during zoom animations. A single HTML5 `<canvas>` element allows the GPU to render all 4,160 dots as direct 2D bitmap drawing operations in a single paint call, easily maintaining a smooth 60 frames per second without straining the DOM tree (js/canvas.js lines 50 to 140).

#### Question 2: How do you prevent canvas graphics from looking blurry on modern mobile phones and Retina displays?
**Answer:** Modern displays have a Device Pixel Ratio (DPR) of 2 or 3, meaning there are 2 or 3 physical screen pixels for every 1 CSS pixel. If a canvas is sized only in CSS pixels, the browser stretches the bitmap, causing blurriness. We solve this by reading `window.devicePixelRatio`, multiplying the canvas buffer's internal `width` and `height` properties by the DPR, and applying `ctx.scale(dpr, dpr)`. This produces razor-sharp vector-quality circles on all screens (js/canvas.js lines 22 to 34).

#### Question 3: Why should calendar calculations use UTC methods rather than local date methods?
**Answer:** Local date methods (like `getDate()` or `getMonth()`) depend on the visitor's local system timezone and can be corrupted by Daylight Saving Time (DST) shifts. A DST transition can add or subtract an hour, which may cause a date to slip into the previous or next calendar day. UTC methods (`getUTCDate()`, `getUTCFullYear()`) operate on absolute 86,400,000-millisecond day intervals, guaranteeing identical, bug-free calculations worldwide (js/dates.js lines 10 to 45).

#### Question 4: How does procedural audio synthesis work, and what are its advantages over sound files?
**Answer:** Procedural audio uses the browser's native Web Audio API to generate sound waves in real time using mathematical oscillators and noise algorithms. In this project, `playIntroSwell` generates brown noise through a low-pass filter, while `playChord` combines three sine wave oscillators to produce an A-major triad. This eliminates MP3 file downloads, reduces HTTP network requests to zero, guarantees instant playback without network buffering latency, and functions completely offline (js/audio.js lines 10 to 140).

#### Question 5: How does the canvas hit-testing algorithm determine which week dot the user is hovering over?
**Answer:** Instead of checking every dot in an O(N) loop, the app uses a constant-time O(1) mathematical mapping. The column index is calculated by dividing the X coordinate by the horizontal dot spacing (`Math.floor(x / colStep)`). For the row index, the algorithm divides the Y coordinate by row height while subtracting the extra 8-pixel gap inserted after every 10 rows. This identifies the exact dot index instantly even with thousands of dots (js/canvas.js lines 175 to 215).

#### Question 6: How does the application guarantee complete user privacy?
**Answer:** The application runs entirely client-side inside the user's web browser. All dates of birth, life chapters, and time budget preferences exist solely in the browser's temporary JavaScript memory. There is no backend server, database, or analytics tracker collecting user data. The only items written to `localStorage` are the visitor's interface theme preference and audio mute state (README.md line 24).

#### Question 7: How did you implement automated regression testing without installing external packages like Jest or Vitest?
**Answer:** We wrote a lightweight, pure JavaScript test harness (`js/selftest.js`) that is triggered by appending `?test=1` to the URL. The harness executes 7 test suites covering date math, Sunday counts, milestone dates, time budgets, and URL parsing. It evaluates 75 assertions using strict equality checks and renders an interactive pass/fail diagnostic table with zero build tooling or npm dependencies (js/selftest.js lines 1 to 140).

#### Question 8: How does the "Swap 1 hour of phone for learning" feature calculate its lifetime impact?
**Answer:** When the user taps the swap button, the app subtracts 1 hour from daily phone screen time and adds 1 hour to learning. It then multiplies that 1 hour by the user's remaining lifespan: `Math.round(remainingYears * 52 * (1 / 24))`. For a 22-year-old with 58 years ahead, swapping 1 hour every day returns approximately 126 additional full weeks of focused learning over their remaining lifetime (js/timebudget.js lines 120 to 145).

#### Question 9: How does the application generate downloadable social share cards without a backend server?
**Answer:** The app creates an unattached offscreen HTML5 `<canvas>` element sized at 1,200 by 1,500 pixels for 4 by 5 social cards or 1,080 by 1,920 pixels for 9 by 16 mobile stories. It draws the background, headline, life statistics, miniature dot grid, and Wrench Wise brand logo onto the canvas. It then converts the canvas to a PNG image Blob via `canvas.toBlob()` and either invokes the native `navigator.share` sheet on mobile or triggers a direct browser download (js/share.js lines 12 to 140).

#### Question 10: How does the project support accessibility for visitors who experience motion sensitivity?
**Answer:** The application checks the browser's media query `window.matchMedia('(prefers-reduced-motion: reduce)')`. When a visitor has enabled reduced motion in their operating system settings, the app disables the multi-stage camera zooms, the animated dot fill count-up, and pulsing ring beacons. Instead, it immediately displays the full populated dot grid, ensuring comfort and compliance with accessibility standards (js/reveal.js lines 15 to 30).


---

## 20. Showcase

This section highlights the most compelling visual moments to capture for short-form video reels (such as Instagram Reels, YouTube Shorts, and TikTok), followed by three feature concepts for the next version of the software.

### Best Moments to Record for a Video Reel

The repository includes a detailed director's script in `REEL_SCRIPT.md` (lines 8 to 214). These six moments create maximum emotional and visual impact on camera:

| Moment | Time Code | Visual Action on Screen | Audio Cue | Emotional Impact |
| :--- | :--- | :--- | :--- | :--- |
| 1. The Single Dot Hook | 0:00 to 0:04 | User selects birth date "12 June 2004" and taps "Show my life". The card dissolves, leaving a single glowing dot in the center of the dark screen with text: "This is one week." | Rising low-pass brown noise intro swell | Curiosity: viewer focuses entirely on a single tiny unit of time |
| 2. The Zoom Pull-Back | 0:04 to 0:12 | The camera pulls back smoothly to reveal a row of 52 dots ("52 weeks make one year."), then pulls back further to reveal the full grid of 4,160 dots ("This is a life of 80 years.") | Soft mechanical camera click | Scale shock: viewer suddenly sees the finite physical boundary of an 80-year life |
| 3. The Past Life Fill | 0:12 to 0:24 | Lived dots fill in rapidly row by row in vivid emerald and cyan. Dot 1,163 arrives, pops with a beacon ring, and shows "You are here" | Rhythmic ticks at decade boundaries, followed by a two-note chime | Relief and realization: seeing exactly how much of life has already passed |
| 4. The Flashback Highlights | 0:24 to 0:32 | Three historical dots light up in amber (e.g., 2011 Cricket World Cup at age 6, Chandrayaan-3 landing at age 19) with memory tags | Quick percussive pop sounds | Connection: anchoring personal age to shared global history |
| 5. The Sundays Count-Up | 0:32 to 0:42 | Camera centers on the vast unlived field of dots. The headline numbers roll up from 0 to "3,008 Sundays ahead" | Uplifting 3-note synthesized A-major triad chord | Motivation: shifts perspective from mortality to remaining opportunity |
| 6. The 1-Hour Time Swap | 0:42 to 0:55 | User opens the Time tab and taps "Swap 1 hour of phone for learning". A green badge "+21 weeks of learning" pops up, and 21 dots on the canvas bounce into vibrant emerald green | Upward frequency chirp sound | Empowerment: proves that a tiny 60-minute daily habit compounds into months of mastery |

---

### Three Ideas for Version 3

1. **Animated Video and GIF Reel Exporter:**
   - *Current Limitation:* The app exports static PNG images (`life-in-dots.png`) in 4 by 5 and 9 by 16 dimensions (js/share.js lines 12 to 60).
   - *V3 Concept:* Use the browser's native `HTMLCanvasElement.captureStream()` and `MediaRecorder` API to record the 15-second cinematic reveal sequence directly inside the browser. Users can download a ready-to-post 1080 by 1920 MP4 video clip or animated GIF with synchronized procedural audio to share immediately on social platforms.

2. **Shared Lives Overlap Comparison (Couples, Parents, and Friends):**
   - *Current Limitation:* The grid visualizes a single individual's life in isolation.
   - *V3 Concept:* Allow the user to enter two birth dates (for example, their own birth date and their mother's or partner's birth date). Render a dual-column or dual-color dot canvas. The visual highlights:
     - The years lived before meeting each other.
     - The shared overlap of weeks lived together so far.
     - The estimated remaining shared weeks ahead, emphasizing the importance of family time.

3. **Personal Milestone Customizer with Local Reminders:**
   - *Current Limitation:* Milestones are calculated automatically from fixed mathematical constants (billion seconds, Mars birthdays, full moons).
   - *V3 Concept:* Allow users to add up to 5 personal life goals (such as "Publish my first book", "Complete ironman marathon", or "Reach financial independence") with target ages. Display custom milestone markers directly inside future dots on the grid, and generate an integrated `.ics` calendar reminder package to keep users accountable.


---

## 21. Glossary

This glossary explains every technical term used in this document. Each term is explained in one plain sentence without technical jargon.

- **API (Application Programming Interface):** A set of rules and tools that allows one computer program to talk to another program or browser feature.
- **ARIA (Accessible Rich Internet Applications):** Special labels added to web page code so screen readers can describe visual items to people who cannot see the screen.
- **Aspect Ratio:** The proportional relationship between the width and height of an image or screen, such as 16 by 9 or 4 by 5.
- **AudioContext:** An object built into modern web browsers that manages, creates, and plays digital audio directly from code.
- **Biquad Filter:** An audio tool that softens or removes specific sound frequencies, such as muffling high sharp sounds to make a tone feel warm.
- **Blob (Binary Large Object):** A collection of raw computer data stored in browser memory, often used to hold an image file or calendar file before downloading.
- **Brown Noise:** A deep, rumbling sound that has more energy at lower frequencies, resembling the gentle roar of ocean waves or a distant waterfall.
- **Canvas:** A visual rectangle on a web page where JavaScript code draws shapes, lines, circles, and text pixel by pixel.
- **CDN (Content Delivery Network):** A worldwide network of connected web servers that delivers website files to people from the server nearest to their physical location.
- **CSS (Cascading Style Sheets):** The computer language used to design the look of a website, including colors, fonts, spacing, and layout.
- **CSS Custom Property:** A saved styling setting, also known as a CSS variable, that allows developers to reuse the same color or font across an entire website.
- **Cubic-Bezier:** A mathematical curve used in animations to control how an object speeds up and slows down over time.
- **Device Pixel Ratio (DPR):** The number of tiny physical light dots on a phone screen used to draw a single standard web pixel.
- **DOM (Document Object Model):** The living tree structure of buttons, paragraphs, and cards that the browser builds from an HTML file.
- **Easing:** The gradual acceleration and deceleration of an animation that makes visual movement feel smooth and natural instead of robotic.
- **Edge Server:** A computer located in a local city data center that sends web pages quickly to nearby visitors.
- **Epoch:** The standard starting date for computer time clocks, which is midnight on 1 January 1970 in UTC.
- **ES Modules:** A standard JavaScript system that allows developers to split code across separate files and import them cleanly using import and export words.
- **Event Listener:** A background watcher in code that waits for a person to click a button, type a letter, or move the mouse, and then runs an action.
- **Gain Node:** An audio controller in the Web Audio API that turns the volume of a sound up or down.
- **Git:** A version tracking system that saves a history of every change made to code files over time.
- **Hit-Testing:** The mathematical calculation used to determine which exact circle or button sits directly underneath the user's mouse cursor or finger.
- **HTML5:** The fifth version of the standard computer language used to build the content and structure of web pages.
- **HTTP / HTTPS:** The secure protocol and rules that web browsers use to request and receive web pages over the internet.
- **iCalendar (.ics):** A universal file format that allows calendar programs, such as Google Calendar or Apple Calendar, to import appointments and dates.
- **JSON (JavaScript Object Notation):** A simple, human-readable text format used to store structured lists, tables, and data.
- **Leap Second:** An extra one-second adjustment occasionally added to atomic clocks to keep world clock time in sync with Earth's natural rotation.
- **Leap Year:** A calendar year that contains 366 days instead of 365 days by adding 29 February to keep our calendar aligned with Earth's orbit around the sun.
- **LocalStorage:** A small storage locker inside a web browser that lets a website remember personal settings, like dark theme, even after the browser is closed.
- **Media Query:** A CSS rule that checks the visitor's screen size or device settings to automatically adjust the layout for phones, tablets, or laptops.
- **Minification:** The process of removing extra spaces, line breaks, and comments from code files to make them download faster.
- **Modulo:** A mathematical operation that finds the remainder left over after dividing one whole number by another whole number.
- **Node.js:** A computer program that allows developers to run JavaScript directly on their computer instead of inside a web browser.
- **Offscreen Canvas:** A hidden drawing board in browser memory used to create and export images without displaying them on the visible screen.
- **Oscillator:** A digital tone generator that vibrates at a specific frequency to create musical notes and sound waves.
- **Pixel:** The smallest single colored dot of light on a computer or smartphone monitor.
- **PWA (Progressive Web App):** A website designed with modern standards so it can be installed on a mobile phone home screen like a native app.
- **Query Parameter:** Extra information added to the end of a web address after a question mark, such as ?test=1 or ?demo=1.
- **Reflow:** The slow browser process of recalculating the exact positions and sizes of all elements on a page when content changes.
- **Repaint:** The browser process of redrawing pixels on the screen when visual styling, such as background color, changes without moving layout boxes.
- **Responsive Design:** An approach to web design where page elements automatically adapt and reorganize to look great on screens of any size.
- **Semantic HTML:** The practice of using HTML tags that clearly describe their meaning, such as header, main, and button, rather than generic div tags.
- **Service Worker:** A background JavaScript script that can intercept network requests and save web pages for offline use.
- **Synodic Month:** The exact average time of 29.530588853 days it takes for the moon to complete all its phases from one full moon to the next.
- **Tooltip:** A small floating informational box that appears when a user hovers their mouse cursor over an item on the screen.
- **Transpilation:** The process of converting modern code into an older syntax so older web browsers can understand it.
- **Triad:** A musical chord composed of three different harmonious notes played at the exact same moment.
- **UTC (Coordinated Universal Time):** The primary world time standard that remains constant across all countries without changing for Daylight Saving Time.
- **Vanilla JavaScript:** Writing pure JavaScript code directly as supported by web browsers without using extra frameworks or external helper libraries.
- **Viewport:** The visible rectangle of the web browser screen where a web page is actually shown to the user.
- **Web Audio API:** A powerful system built into web browsers that lets developers create, synthesize, and manipulate sounds with code.
- **Web Share API:** A browser feature that opens the mobile phone's native sharing menu to send links or images directly to apps like WhatsApp or Instagram.
- **Webhook:** An automated message sent between web servers when an event happens, such as GitHub notifying Vercel when new code is pushed.
