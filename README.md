[README.md](https://github.com/user-attachments/files/28682575/README.md)
[🇹🇷 Türkçe README için buraya tıklayın](README_TR.md)

<div align="center">

# ▶ YT Duration Calc

### YouTube Playlist Duration Calculator

[![License: MIT](https://img.shields.io/badge/License-MIT-red.svg?style=flat-square)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![YouTube API](https://img.shields.io/badge/YouTube%20Data%20API-v3-FF0000?style=flat-square&logo=youtube&logoColor=white)](https://developers.google.com/youtube/v3)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-00C864?style=flat-square)](#)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-181717?style=flat-square&logo=github)](https://pages.github.com)

**Calculate total duration of any YouTube playlist — with per-video breakdown, playback speed analysis, and CSV export.**

[🚀 Live Demo](#) · [📖 How to Get API Key](#-getting-a-youtube-api-key) · [🐛 Report Bug](../../issues) · [✨ Request Feature](../../issues)

<br/>

![YT Duration Calc Screenshot](https://via.placeholder.com/900x500/0a0a0f/ff4444?text=YT+Duration+Calc+Screenshot)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎯 **Full Playlist Analysis** | Fetches all videos with automatic pagination — no limit on playlist size |
| ⏱ **ISO 8601 Parsing** | Accurately converts YouTube's `PT1H23M45S` format to seconds |
| ⚡ **Speed Analysis** | Breakdown at 1×, 1.25×, 1.5×, 1.75×, 2× with time-saved display |
| 📋 **Per-Video Table** | Every video listed with its own speed-adjusted durations |
| 🔍 **Search & Sort** | Filter by title, sort by duration or playlist order |
| 📊 **Fun Stats** | Days to watch, coffee breaks needed, sleep cycles skipped |
| 📁 **CSV Export** | One-click export of the full video list as a CSV file |
| 📋 **Copy Summary** | Copy a formatted plain-text report to clipboard |
| 🔒 **Privacy First** | API key stored in localStorage only — never sent anywhere except YouTube's API |
| 📱 **Responsive** | Fully responsive; works on mobile, tablet, and desktop |
| 🌙 **Dark Theme** | Sleek dark editorial UI — easy on the eyes |
| ⚡ **Zero Dependencies** | Pure HTML + CSS + JS — no npm, no bundler, no framework |

---

## 📸 Screenshots

<div align="center">

| Hero & Input | Results & Speed Analysis |
|:---:|:---:|
| ![Input](https://via.placeholder.com/420x280/111118/ff4444?text=Input+Screen) | ![Results](https://via.placeholder.com/420x280/111118/ff4444?text=Results+Screen) |

</div>

---

## 🚀 Getting Started

### Prerequisites

- A modern browser (Chrome, Firefox, Edge, Safari)
- A YouTube Data API v3 key (free — see below)

### 🔑 Getting a YouTube API Key

> The free daily quota (10,000 units/day) is more than enough for personal use.

1. **Open [Google Cloud Console](https://console.cloud.google.com)** and sign in.
2. Click **"Create Project"** → name it (e.g. `YT Calculator`) → click **Create**.
3. In the left sidebar: **APIs & Services → Library**.
4. Search for **"YouTube Data API v3"** → click **Enable**.
5. Go to **APIs & Services → Credentials** → click **+ CREATE CREDENTIALS → API Key**.
6. *(Recommended)* Click **Restrict Key** → under API restrictions, select **YouTube Data API v3** only.
7. Copy your key — it looks like `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`.

### 📦 Installation & Running

#### Option A — GitHub Pages (Recommended, no setup)
```
1. Fork this repository
2. Go to your fork → Settings → Pages
3. Set source to: Branch: main / root
4. Visit: https://<your-username>.github.io/yt-duration-calc
```

#### Option B — Local (also instant, no server needed)
```bash
# Clone the repo
git clone https://github.com/<your-username>/yt-duration-calc.git

# Navigate to folder
cd yt-duration-calc

# Just open index.html in your browser
# macOS:
open index.html
# Windows:
start index.html
# Linux:
xdg-open index.html
```

> ✅ No `npm install`, no build step, no server required.

---

## 📁 Project Structure

```
yt-duration-calc/
│
├── index.html           # Single-page app shell — all sections, no framework
│
├── css/
│   └── style.css        # Full UI styles — dark theme, responsive, animations
│
├── js/
│   ├── utils.js         # Pure helpers: ISO 8601 parsing, time formatting, speed math
│   ├── api.js           # YouTube Data API v3 wrapper (pagination, batching)
│   ├── ui.js            # DOM rendering: fills cards, table, toast, CSV export
│   └── app.js           # Wires everything: events, state, orchestrates the pipeline
│
├── README.md            # This file (English)
├── README_TR.md         # Turkish README
└── LICENSE              # MIT License
```

---

## 🧮 Technical Deep-Dive

### ISO 8601 → Seconds

YouTube returns video durations in [ISO 8601 duration format](https://en.wikipedia.org/wiki/ISO_8601#Durations):

```
PT1H23M45S  →  1 hour, 23 minutes, 45 seconds  →  5025 seconds
PT45M       →  45 minutes                        →  2700 seconds
PT30S       →  30 seconds                        →  30 seconds
```

**Parsing logic (`utils.js`):**
```javascript
function isoToSeconds(iso) {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const h = parseInt(match[1] || '0', 10);
  const m = parseInt(match[2] || '0', 10);
  const s = parseInt(match[3] || '0', 10);
  return (h * 3600) + (m * 60) + s;
}
```

### Speed Analysis Formula

```
adjustedTime = totalSeconds / speedMultiplier
timeSaved    = totalSeconds - adjustedTime
```

| Speed | Formula | Example (10h playlist) |
|---|---|---|
| 1×   | `36000 / 1.00` | **10h 0m** (baseline) |
| 1.25× | `36000 / 1.25` | **8h 0m** (saves 2h) |
| 1.5× | `36000 / 1.50` | **6h 40m** (saves 3h 20m) |
| 1.75× | `36000 / 1.75` | **5h 42m** (saves 4h 18m) |
| 2×   | `36000 / 2.00` | **5h 0m** (saves 5h) |

### API Architecture

```
analyzePlaylist()
  ├── fetchPlaylistMeta()      → 1 API call  → title, channel, thumbnail
  ├── fetchAllVideoIds()       → N API calls → paginated (50 items/page)
  │     └── follows nextPageToken until exhausted
  └── fetchVideosDuration()   → N API calls → batched (50 IDs/request)
        └── chunks video IDs into groups of 50 (API limit)
```

**API quota cost estimate:**
- 1 playlist metadata call = ~1 unit
- Each page of video IDs = ~1 unit (50 videos/page)
- Each batch of durations = ~1 unit (50 videos/batch)
- A 200-video playlist ≈ ~10 units total

---

## ⚙ Configuration

All configuration is done through the UI — no `.env` file needed.

| Setting | Where | Persistence |
|---|---|---|
| API Key | Input field → "Save Key" | `localStorage` (browser only) |
| Playlist URL | Input field | Per session |

---

## 🤝 Contributing

Contributions are welcome!

```bash
# 1. Fork the repo
# 2. Create a feature branch
git checkout -b feature/amazing-feature

# 3. Commit your changes
git commit -m 'Add amazing feature'

# 4. Push to the branch
git push origin feature/amazing-feature

# 5. Open a Pull Request
```

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

## 🙏 Acknowledgements

- [YouTube Data API v3](https://developers.google.com/youtube/v3) — Google
- [Syne](https://fonts.google.com/specimen/Syne) & [DM Mono](https://fonts.google.com/specimen/DM+Mono) — Google Fonts
- [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) duration standard

---

<div align="center">

Made with ❤ · If this helped you, please ⭐ the repo!

</div>
