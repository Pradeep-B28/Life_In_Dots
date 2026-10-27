<div align="center">

# ⚪ Your Life in Dots
### *Visual Life Map in Weeks: Perspective on Time Lived and Sundays Ahead*

A clean, responsive visual canvas mapping an entire human lifespan into weeks. One dot represents one week.

[![Live Deployment](https://img.shields.io/badge/Live_App-lifeindots.vercel.app-06B6D4?style=for-the-badge&logo=vercel&logoColor=white)](https://lifeindots.vercel.app)
[![Autonomous Demo](https://img.shields.io/badge/Demo-Interactive_Reel-8B5CF6?style=for-the-badge&logo=googlechrome&logoColor=white)](https://lifeindots.vercel.app/?demo=1)
[![Self-Test Suite](https://img.shields.io/badge/Test_Suite-Passing-22C55E?style=for-the-badge&logo=checkmarx&logoColor=white)](https://lifeindots.vercel.app/?test=1)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Pradeep--B28%2FLife__In__Dots-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Pradeep-B28/Life_In_Dots)
[![Author](https://img.shields.io/badge/Author-Pradeep_B-0B2A45?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/pradeepb-2k)
[![License: MIT](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)](LICENSE)

<p align="center">
  <a href="#-project-overview">Overview</a> •
  <a href="#-5-interactive-view-layers">5 View Layers</a> •
  <a href="#-mathematical-foundations--precision">Math & Algorithms</a> •
  <a href="#-strict-client-side-privacy">Privacy</a> •
  <a href="#-multi-format-export--sharing">Social Sharing</a> •
  <a href="#-repository-structure">Architecture</a> •
  <a href="#-local-development">Local Setup</a> •
  <a href="#-author--contact">Author & Contact</a>
</p>

</div>

---

## ⏳ Project Overview

**Your Life in Dots** transforms abstract calendar time into a tangible, geometric perspective. By rendering an entire life grid—52 columns wide (one per week of a year) across 70, 80, 90, or 100 rows—users instantly visualize the proportion of life lived, the transient nature of routine, and the precious number of Sundays remaining.

- **Zero-Dependency Engine:** Pure HTML5 Canvas, modern CSS, and Vanilla JavaScript.
- **Cinematic Zoom & Pan:** Smooth 4-stage camera glide zooming from initial infancy dots to the complete macroscopic life canvas.
- **Dual Theme Support:** Custom dark slate and light minimalist themes.

---

## 🎨 5 Interactive View Layers

1. **Overview:** Complete life grid featuring a pulsing present-week indicator, exact percentage completed, and count of upcoming Sundays.
2. **History:** Curated scientific, technological, and cultural milestones across the user's lifespan. Tapping any historical event highlights that exact week on the life grid.
3. **Chapters:** Interactive color-coded life phases (School, College, Career, Personal Eras) with dynamic canvas updates and intelligent overlap resolution.
4. **Time Budget:** Interactive weekly time allocation across Sleep, Work, Screen Time, and Free Time. Features an instant hour-swap calculator demonstrating how 1 hour saved per day recovers months of learning weeks over a lifetime.
5. **Milestones:** Exact calculations for milestone events including 10,000th day, 100th full moon, billionth heartbeat, and Martian birthdays with one-click calendar exports.

---

## 📐 Mathematical Foundations & Precision

- **Integer UTC Day Calculation:** Dates are converted to integer days elapsed since January 1, 1970 UTC, completely preventing daylight saving drift, leap year edge cases, and timezone distortion.
- **Constant-Time O(1) Grid Arithmetic:** With 52 columns per row, dot positions are calculated via direct division and modulus rather than iterating through thousands of DOM elements.
- **Synodic Lunar Modeling:** Full moon calculations leverage the high-precision synodic period ($T = 29.530588853\text{ days}$) calibrated against the reference full moon of January 13, 2025 at 22:27 UTC.
- **Integer Week Time Discretization:** Daily time budget hours are converted into integer weeks using standard whole-number division, eliminating sub-pixel rendering artifacts and preserving exact week sums.

---

## 🔒 Strict Client-Side Privacy

- **Zero Tracking:** Date of birth and custom life chapters are processed solely in volatile browser RAM.
- **No Cookies or Local Storage for PII:** Sensitive personal details are never saved to disk, cookies, or remote databases.
- **Zero Network Transmission:** All math, canvas rendering, and image generation occurs on your device.

---

## 📤 Multi-Format Export & Sharing

Generates beautiful high-resolution shareable summary cards:
- **Status / Stories:** 9:16 vertical ratio (1080 × 1920) formatted for WhatsApp, Instagram Stories, and TikTok.
- **Feed Posts:** 4:5 portrait ratio (1080 × 1350) optimized for LinkedIn, X (Twitter), and Instagram feeds.

---

## 📂 Repository Structure

```
Life_In_Dots/
├── index.html        Main application structure, modal dialogs, and SVG icons
├── styles.css        Design tokens, dark/light themes, typography, and responsive grid
├── manifest.json     PWA manifest and mobile app icons
├── LICENSE           MIT Open Source License
├── README.md         Technical documentation, mathematics, and setup
├── REEL_SCRIPT.md    Short video recording scripts
├── assets/           Favicon, open-graph preview image, and brand logos
└── js/
    ├── main.js       Application bootstrap and state management
    ├── canvas.js     High-DPI life grid rendering and camera zoom animation
    ├── time.js       Time budget allocation and hourly recovery calculator
    ├── chapters.js   Life chapter era definitions and canvas highlight engine
    ├── milestones.js High-precision planetary and lunar milestone calculations
    ├── history.js    Curated historical milestones and sync engine
    ├── share.js      Canvas-based image generator for 9:16 and 4:5 social cards
    ├── audio.js      Web Audio gentle synthetic tone generator
    └── test.js       Automated date and coordinate verification tests
```

---

## 💻 Local Development

Run the application locally without any dependencies:

```bash
# Clone the repository
git clone https://github.com/Pradeep-B28/Life_In_Dots.git
cd Life_In_Dots

# Run local web server
python -m http.server 8000
```
Open `http://localhost:8000` in your web browser.

- **Run Self-Test Verification:** `http://localhost:8000/?test=1`
- **Run Automated Demo Reel:** `http://localhost:8000/?demo=1`

---

## 📄 License

This project is open-source and released under the **[MIT License](LICENSE)**.

```
Copyright (c) 2026 Pradeep B (Pradeep-B28) & Wrench Wise
```

---

## 👨‍💻 Author & Contact

**Pradeep B**  
*Java & DSA Master Trainer | Full-Stack Architect | Web Platform Engineer*

- 🌐 **Softech Career & Placement Portal:** [reachsoftech.onrender.com](https://reachsoftech.onrender.com/home)
- 🌌 **3D Interactive Developer Portfolio:** [pradeep-b28.github.io/GIT_3D_Portfolio](https://pradeep-b28.github.io/GIT_3D_Portfolio/)
- 💻 **GitHub Profile:** [@Pradeep-B28](https://github.com/Pradeep-B28)
- 💼 **LinkedIn:** [linkedin.com/in/pradeepb-2k](https://www.linkedin.com/in/pradeepb-2k)
- 📧 **Email:** [pradeepbashaa@gmail.com](mailto:pradeepbashaa@gmail.com)
