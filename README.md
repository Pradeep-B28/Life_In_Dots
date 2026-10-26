# Your Life in Dots

A clean visual map of your life in weeks. One dot represents one week. The full canvas shows an entire life on a single screen, giving you perspective on the weeks lived and the Sundays ahead.

Live link: https://lifeindots.vercel.app
Demo link: https://lifeindots.vercel.app/?demo=1

## What is new in v2

- Cinematic intro and camera zoom: A smooth four-stage camera path glides from your first weeks into the full canvas, punctuated by a personal flashback moment from your childhood.
- Five interactive view layers:
  - Overview: Your complete life map with pulsing present indicator and Sunday counts ahead.
  - History: Curated cultural, sporting, and scientific milestones across your lifespan, with row taps highlighting the exact dot on your grid.
  - Chapters: Color-code your life phases (School, College, Career, or custom eras) with live canvas updates and smart overlap resolution.
  - Time: Visual weekly time budget across Sleep, Work, Screens, and Free time. Features a dynamic stacked bar and a single-click hour swap to reclaim learning weeks.
  - Milestones: Track landmark events such as your 10,000th day, 100th full moon, billionth heartbeat, and Martian birthdays, with direct calendar integration.
- Dark theme: Full dark mode support using tailored slate and charcoal design tokens, accessible via the theme toggle.
- Multi-format sharing: Export high-resolution share cards in both Status (9:16 vertical) and Post (4:5) formats with tailored layer summaries and safe areas.
- Audio cues: Soft, uplifting synthesiser tones accompanying the reveal, with an instant mute toggle.

## How to use it

1. Pick your date of birth using the Day, Month, and Year selectors.
2. Choose a life length to picture (70, 80, 90, or 100 years).
3. Click "Show my life" to watch your journey unfold.

## How to run it locally

This project uses standard web technologies with no build steps, package managers, or external dependencies.

1. Clone or download this folder to your machine.
2. Start any local web server in the project folder:
   - Python: `python -m http.server 8000`
   - Node: `npx serve .`
   - Or open the folder in VS Code and use the Live Server extension.
3. Open `http://localhost:8000` in your web browser.
4. To run the automated verification suite, open `http://localhost:8000/?test=1`.
5. To view the automated reel loop, open `http://localhost:8000/?demo=1`.

## How it works

1. Day numbers: Dates are converted to whole integer days since 1 January 1970 UTC. This avoids timezone shifts, daylight saving drift, and month length errors.
2. Row and column arithmetic: The grid is 52 columns wide, where each row is one year of your age. The app finds any dot location using instant multiplication and division rather than searching through thousands of elements.
3. Drawing only what changes: The base canvas paints the background grid once. An overlay canvas handles the pulsing ring and live animations. During the reveal, each frame draws only the newly lived dots for 60 fps performance.
4. Full moon cycle maths: Lunar calculations use the synodic period of 29.530588853 days referenced to the full moon of 13 January 2025 at 22:27 UTC. Counts are determined through division instead of day-by-day looping.
5. Private on your device: Your date of birth is processed entirely inside your browser JavaScript engine. It is never stored in cookies, never saved to local storage, and never sent across a network.
6. Camera zoom: The cinematic intro uses an ease-in-out cubic curve to translate and scale the canvas smoothly from a magnified view of your earliest years to your full life view, keeping dot rendering sharp at every frame.
7. Splitting weeks with whole-number maths: In the Time tab, daily hours across Sleep, Work, Screen time, and Free time are converted into integer weeks using standard whole-number division, preventing fractional dot artifacts and keeping the total week count exact.
8. How milestone dates are found: Key milestones (such as your 10,000th day, 100 full moons, or billionth heartbeat) are computed directly from the birth timestamp using continuous physical constants and calendar formulas, locating each event week directly without looping.
9. Why chapter names never leave the phone: All chapter definitions (labels, start dates, and end dates) live exclusively in transient browser memory. They are never written to disk, local storage, or session storage, and never sent over the wire. Closing or refreshing the page clears them immediately.

## Built by Wrench Wise

Crafted with code by Wrench Wise.
Learn to build web applications like this: https://wrench-wise.com
