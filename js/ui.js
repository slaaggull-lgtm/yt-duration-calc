/**
 * ui.js â€” DOM rendering helpers
 * Knows about the DOM; does not call the API directly.
 * Receives processed data objects and renders them.
 */

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// TOAST NOTIFICATIONS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

let toastTimer = null;

/**
 * Shows a brief toast message at the bottom-right.
 * @param {string} message
 * @param {number} [duration=2800] ms
 */
function showToast(message, duration = 2800) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.classList.remove('hidden');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add('hidden'), duration);
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// ERROR / STATUS DISPLAY
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function showError(message) {
  const el = document.getElementById('errorMsg');
  if (!el) return;
  el.textContent = 'âš  ' + message;
  el.classList.remove('hidden');
}

function clearError() {
  const el = document.getElementById('errorMsg');
  if (el) el.classList.add('hidden');
}

function setKeyStatus(type, message) {
  const el = document.getElementById('keyStatus');
  if (!el) return;
  el.textContent = message;
  el.className = `key-status ${type}`;
  el.classList.remove('hidden');
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// LOADING STATE
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function setLoading(isLoading, progressMessage = '') {
  const btn      = document.getElementById('calculateBtn');
  const btnText  = document.getElementById('btnText');
  const spinner  = document.getElementById('btnSpinner');
  const errorMsg = document.getElementById('errorMsg');

  if (isLoading) {
    btn.disabled = true;
    btnText.textContent = progressMessage || 'Loadingâ€¦';
    spinner.classList.remove('hidden');
    if (errorMsg) errorMsg.classList.add('hidden');
  } else {
    btn.disabled = false;
    btnText.textContent = 'Calculate';
    spinner.classList.add('hidden');
  }
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// PLAYLIST METADATA
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Renders the playlist info card.
 * @param {{ title, channel, thumbnail, privacy, videoCount }} meta
 */
function renderPlaylistMeta(meta) {
  const el = id => document.getElementById(id);

  const thumb = el('metaThumbnail');
  if (thumb) {
    thumb.src = meta.thumbnail || '';
    thumb.alt = meta.title;
    // Hide the img if there's no thumbnail URL
    thumb.style.display = meta.thumbnail ? 'block' : 'none';
  }

  setTextContent('metaTitle',   meta.title);
  setTextContent('metaChannel', 'ğŸ“º ' + meta.channel);
  setTextContent('badgeCount',  fmtNum(meta.videoCount) + ' videos');
  setTextContent('badgePrivacy', meta.privacy.charAt(0).toUpperCase() + meta.privacy.slice(1));
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// TOTAL DURATION
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Renders the large total duration display.
 * @param {number} totalSeconds
 * @param {number} videoCount
 */
function renderTotalDuration(totalSeconds, videoCount) {
  const { days, hours, minutes, seconds } = secondsToBreakdown(totalSeconds);

  // Build display string â€” show days only if > 0
  let displayStr = '';
  if (days > 0) {
    displayStr = `${days}d ${hours}h ${minutes}m`;
  } else if (hours > 0) {
    displayStr = `${hours}h ${minutes}m ${seconds}s`;
  } else {
    displayStr = `${minutes}m ${seconds}s`;
  }

  setTextContent('totalDuration', displayStr);
  setTextContent('totalSeconds', `${fmtNum(totalSeconds)} seconds total`);

  // Average per video
  const avgSec = videoCount > 0 ? Math.round(totalSeconds / videoCount) : 0;
  setTextContent('avgDuration', secondsToHuman(avgSec));
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// SPEED ANALYSIS CARDS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Renders the playback speed comparison grid.
 * @param {Array} speedData - from calcSpeedBreakdown(totalSeconds)
 */
function renderSpeedGrid(speedData) {
  const grid = document.getElementById('speedGrid');
  if (!grid) return;

  grid.innerHTML = '';

  speedData.forEach(item => {
    const isNormal   = item.speed === 1.0;
    const highlight  = item.speed === 1.5; // highlight the most common speed

    const div = document.createElement('div');
    div.className = 'speed-item' + (highlight ? ' highlight' : '');

    div.innerHTML = `
      <div class="speed-label">${item.speed === 1.0 ? '1Ã— Normal' : item.speed + 'Ã— Speed'}</div>
      <div class="speed-value">${item.adjustedHuman}</div>
      ${!isNormal ? `<div class="speed-saved">saves ${item.savedHuman}</div>` : '<div class="speed-saved">baseline</div>'}
    `;
    grid.appendChild(div);
  });
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// EXTRA FUN STATS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Renders the stat cards (days, coffee, sleep cycles, avg).
 * @param {number} totalSeconds
 * @param {number} videoCount
 */
function renderStats(totalSeconds, videoCount) {
  // Days to watch non-stop
  const days = (totalSeconds / 86400).toFixed(1);
  setTextContent('statDays', days);

  // Coffee breaks: one ~5-min break every 45 min
  const coffeeBreaks = Math.floor(totalSeconds / 2700);
  setTextContent('statCoffee', fmtNum(coffeeBreaks));

  // Sleep cycles skipped (90-minute cycle)
  const sleepCycles = Math.floor(totalSeconds / 5400);
  setTextContent('statSleep', fmtNum(sleepCycles));

  // Average video length
  const avgSec = videoCount > 0 ? Math.round(totalSeconds / videoCount) : 0;
  setTextContent('statAvg', secondsToHuman(avgSec));
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// VIDEO TABLE
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// Store video data for sorting/filtering
let _videoData = [];

/**
 * Renders the video list table.
 * @param {Array<{ videoId, title, position, durationSeconds, durationHuman }>} videos
 */
function renderVideoTable(videos) {
  _videoData = videos.slice(); // Store a copy
  applyVideoTableFilters();
}

/**
 * Applies current sort & filter settings and re-renders the table body.
 */
function applyVideoTableFilters() {
  const searchVal = (document.getElementById('searchVideos')?.value || '').toLowerCase();
  const sortVal   = document.getElementById('sortVideos')?.value || 'index';

  // Filter by title
  let filtered = searchVal
    ? _videoData.filter(v => v.title.toLowerCase().includes(searchVal))
    : _videoData.slice();

  // Sort
  if (sortVal === 'duration-desc') {
    filtered.sort((a, b) => b.durationSeconds - a.durationSeconds);
  } else if (sortVal === 'duration-asc') {
    filtered.sort((a, b) => a.durationSeconds - b.durationSeconds);
  } else if (sortVal === 'title') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    // Default: playlist order (position)
    filtered.sort((a, b) => a.position - b.position);
  }

  renderVideoTableBody(filtered);

  const info = document.getElementById('videoListInfo');
  if (info) {
    if (searchVal) {
      info.textContent = `Showing ${filtered.length} of ${_videoData.length} videos`;
    } else {
      info.textContent = `${_videoData.length} videos`;
    }
  }
}

/**
 * Renders rows into the video table's tbody.
 * @param {Array} videos
 */
function renderVideoTableBody(videos) {
  const tbody = document.getElementById('videoTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';

  videos.forEach((video, idx) => {
    // Pre-calculate speed durations for this individual video
    const s125 = secondsToHuman(Math.round(video.durationSeconds / 1.25), true);
    const s150 = secondsToHuman(Math.round(video.durationSeconds / 1.5),  true);
    const s200 = secondsToHuman(Math.round(video.durationSeconds / 2.0),  true);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td class="title-cell">
        <a
          href="https://www.youtube.com/watch?v=${escapeHtml(video.videoId)}"
          target="_blank"
          rel="noopener"
          title="${escapeHtml(video.title)}"
        >${escapeHtml(video.title)}</a>
      </td>
      <td class="duration-cell">${video.durationHuman}</td>
      <td class="speed-cell">${s125}</td>
      <td class="speed-cell">${s150}</td>
      <td class="speed-cell">${s200}</td>
    `;
    tbody.appendChild(tr);
  });
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// SHOW / HIDE RESULTS SECTION
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function showResults() {
  const section = document.getElementById('resultsSection');
  if (!section) return;
  section.classList.remove('hidden');
  // Trigger animation
  requestAnimationFrame(() => section.classList.add('visible'));
  // Scroll into view
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function hideResults() {
  const section = document.getElementById('resultsSection');
  if (!section) return;
  section.classList.add('hidden');
  section.classList.remove('visible');
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// COPY SUMMARY TO CLIPBOARD
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Builds a plain-text summary of results for clipboard.
 * @param {{ meta, videos, totalSeconds }} data
 * @returns {string}
 */
function buildSummaryText(data) {
  const { meta, videos, totalSeconds } = data;
  const speedData  = calcSpeedBreakdown(totalSeconds);
  const avgSec     = videos.length > 0 ? Math.round(totalSeconds / videos.length) : 0;

  const lines = [
    `ğŸ“Š YouTube Playlist Duration Report`,
    `â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€`,
    `Playlist : ${meta.title}`,
    `Channel  : ${meta.channel}`,
    `Videos   : ${fmtNum(videos.length)}`,
    `Total    : ${secondsToFullDisplay(totalSeconds)} (${fmtNum(totalSeconds)}s)`,
    `Average  : ${secondsToHuman(avgSec)} per video`,
    ``,
    `âš¡ Playback Speed Analysis:`,
    ...speedData.map(s =>
      `  ${s.speed}Ã—  â†’  ${s.adjustedHuman}${s.speed !== 1.0 ? '  (saves ' + s.savedHuman + ')' : ''}`
    ),
    ``,
    `Generated by YT Duration Calc`,
  ];
  return lines.join('\n');
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// EXPORT CSV
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Triggers a CSV download of the video list.
 * @param {Array} videos
 * @param {string} playlistTitle
 */
function exportCsv(videos, playlistTitle) {
  const headers = ['#', 'Title', 'Video ID', 'Duration', 'Seconds', '@ 1.25x', '@ 1.5x', '@ 2x'];

  const rows = videos.map((v, i) => [
    i + 1,
    `"${v.title.replace(/"/g, '""')}"`,
    v.videoId,
    v.durationHuman,
    v.durationSeconds,
    secondsToHuman(Math.round(v.durationSeconds / 1.25), true),
    secondsToHuman(Math.round(v.durationSeconds / 1.5),  true),
    secondsToHuman(Math.round(v.durationSeconds / 2.0),  true),
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href     = url;
  a.download = `yt-playlist-${playlistTitle.replace(/[^a-z0-9]/gi, '_').slice(0, 40)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// DOM HELPERS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Sets textContent safely.
 * @param {string} id
 * @param {string} text
 */
function setTextContent(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
