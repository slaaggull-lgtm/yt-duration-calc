/**
 * utils.js â€” Pure utility functions
 * No DOM access here; all functions are stateless and unit-testable.
 */

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// ISO 8601 DURATION â†’ SECONDS
// YouTube returns durations like: "PT1H23M45S", "PT45M", "PT30S", "PT1H"
// Regex captures optional H, M, S groups.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Converts an ISO 8601 duration string to total seconds.
 * @param {string} iso - e.g. "PT1H23M45S"
 * @returns {number} total seconds
 */
function isoToSeconds(iso) {
  if (!iso || typeof iso !== 'string') return 0;

  // Match optional hours (H), minutes (M), seconds (S)
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours   = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);

  return (hours * 3600) + (minutes * 60) + seconds;
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// SECONDS â†’ HUMAN-READABLE DURATION STRING
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Converts seconds to a human-friendly duration string.
 * @param {number} totalSeconds
 * @param {boolean} [compact=false] - if true, uses short format like "1:23:45"
 * @returns {string}
 */
function secondsToHuman(totalSeconds, compact = false) {
  if (!totalSeconds || totalSeconds <= 0) return compact ? '0:00' : '0s';

  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);

  if (compact) {
    // Format: H:MM:SS or M:SS
    if (h > 0) {
      return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  // Verbose format: "2h 34m 12s"
  const parts = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (s > 0 || parts.length === 0) parts.push(`${s}s`);
  return parts.join(' ');
}

/**
 * Converts seconds to a detailed breakdown object.
 * @param {number} totalSeconds
 * @returns {{ days, hours, minutes, seconds }}
 */
function secondsToBreakdown(totalSeconds) {
  const days    = Math.floor(totalSeconds / 86400);
  const hours   = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return { days, hours, minutes, seconds };
}

/**
 * Formats a large seconds value as a full display string (e.g. "3 days 4h 12m 5s").
 * @param {number} totalSeconds
 * @returns {string}
 */
function secondsToFullDisplay(totalSeconds) {
  const { days, hours, minutes, seconds } = secondsToBreakdown(totalSeconds);
  const parts = [];
  if (days    > 0) parts.push(`${days}d`);
  if (hours   > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);
  return parts.join(' ');
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// PLAYBACK SPEED ANALYSIS
// At speed X, actual time = totalSeconds / X
// Time saved = totalSeconds - adjustedTime
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const SPEEDS = [
  { value: 1.0,  label: '1Ã—   Normal' },
  { value: 1.25, label: '1.25Ã— ' },
  { value: 1.5,  label: '1.5Ã—  ' },
  { value: 1.75, label: '1.75Ã— ' },
  { value: 2.0,  label: '2Ã—   Fast' },
];

/**
 * Calculates duration and time saved for each playback speed.
 * @param {number} totalSeconds
 * @returns {Array<{ speed, label, adjustedSeconds, savedSeconds, adjustedHuman, savedHuman }>}
 */
function calcSpeedBreakdown(totalSeconds) {
  return SPEEDS.map(({ value, label }) => {
    // Core math: divide total time by speed multiplier
    const adjustedSeconds = Math.round(totalSeconds / value);
    const savedSeconds    = totalSeconds - adjustedSeconds;

    return {
      speed:           value,
      label:           label.trim(),
      adjustedSeconds,
      savedSeconds,
      adjustedHuman:   secondsToFullDisplay(adjustedSeconds),
      savedHuman:      secondsToFullDisplay(savedSeconds),
    };
  });
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// PLAYLIST ID EXTRACTION
// Supports full URLs and bare IDs
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Extracts the playlist ID from a YouTube URL or returns the raw ID.
 * @param {string} input
 * @returns {string|null} playlist ID or null if not found
 */
function extractPlaylistId(input) {
  if (!input) return null;
  input = input.trim();

  // Try URL patterns
  try {
    const url = new URL(input);
    const listParam = url.searchParams.get('list');
    if (listParam) return listParam;
  } catch (e) {
    // Not a valid URL; fall through to bare ID check
  }

  // Bare playlist ID: starts with PL, UU, FL, RD, etc.
  const bareIdMatch = input.match(/^(PL|UU|FL|RD|OL|LL)[a-zA-Z0-9_-]+$/);
  if (bareIdMatch) return input;

  return null;
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// MISC HELPERS
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Throttle function: limits how often fn can be called.
 * @param {Function} fn
 * @param {number} wait - ms
 * @returns {Function}
 */
function throttle(fn, wait) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn.apply(this, args);
    }
  };
}

/**
 * Escapes HTML special characters to prevent XSS.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Formats a number with locale-aware comma separators.
 * @param {number} n
 * @returns {string}
 */
function fmtNum(n) {
  return n.toLocaleString();
}
