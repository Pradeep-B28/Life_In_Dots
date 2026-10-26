# Your Life in Dots

A clean visual map of your life in weeks. One dot represents one week. The full canvas shows an entire life on a single screen, giving you perspective on the weeks lived and the Sundays ahead.

Live link: https://lifeindots.vercel.app
Demo link: https://lifeindots.vercel.app/?demo=1

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

## Built by Wrench Wise

Crafted with code by Wrench Wise.
Learn to build web applications like this: https://wrench-wise.com
