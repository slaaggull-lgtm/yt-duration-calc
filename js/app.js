/**
 * app.js â€” Main application entry point
 *
 * Wires together:
 *  - API key storage (localStorage)
 *  - Calculate button â†’ API call â†’ UI render
 *  - Sort / filter on video table
 *  - Copy summary & Export CSV buttons
 */

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// LOCAL STORAGE KEY
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const LS_KEY = 'yt_calc_api_key';

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// STATE
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
let currentResult = null; // { meta, videos, totalSeconds }

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// INIT â€” Run after DOM is ready
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
document.addEventListener('DOMContentLoaded', () => {
  // Restore saved API key
  const savedKey = localStorage.getItem(LS_KEY);
  if (savedKey) {
    const input = document.getElementById('apiKeyInput');
    if (input) input.value = savedKey;
    setKeyStatus('success', 'âœ” API key loaded from storage');
  }

  // â”€â”€ API KEY: toggle visibility â”€â”€
  document.getElementById('toggleKey')?.addEventListener('click', () => {
    const inp = document.getElementById('apiKeyInput');
    if (!inp) return;
    const isPassword = inp.type === 'password';
    inp.type = isPassword ? 'text' : 'password';
    // Swap icon label
    const icon = document.getElementById('eyeIcon');
    if (icon) {
      icon.innerHTML = isPassword
        ? `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>`
        : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
    }
  });

  // â”€â”€ API KEY: save button â”€â”€
  document.getElementById('saveKeyBtn')?.addEventListener('click', () => {
    const key = document.getElementById('apiKeyInput')?.value.trim();
    if (!key) {
      setKeyStatus('error', 'âœ˜ Please enter an API key');
      return;
    }
    localStorage.setItem(LS_KEY, key);
    setKeyStatus('success', 'âœ” API key saved to browser storage');
    showToast('API key saved!');
  });

  // â”€â”€ CALCULATE BUTTON â”€â”€
  document.getElementById('calculateBtn')?.addEventListener('click', handleCalculate);

  // Allow Enter key on playlist input
  document.getElementById('playlistInput')?.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleCalculate();
  });

  // â”€â”€ VIDEO TABLE: search & sort â”€â”€
  document.getElementById('searchVideos')?.addEventListener(
    'input',
    throttle(applyVideoTableFilters, 200)
  );
  document.getElementById('sortVideos')?.addEventListener('change', applyVideoTableFilters);

  // â”€â”€ COPY SUMMARY â”€â”€
  document.getElementById('copyResultBtn')?.addEventListener('click', () => {
    if (!currentResult) return;
    const text = buildSummaryText(currentResult);
    navigator.clipboard?.writeText(text)
      .then(() => showToast('ğŸ“‹ Summary copied to clipboard!'))
      .catch(() => {
        // Fallback for browsers without clipboard API
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('ğŸ“‹ Copied!');
      });
  });

  // â”€â”€ EXPORT CSV â”€â”€
  document.getElementById('exportCsvBtn')?.addEventListener('click', () => {
    if (!currentResult) return;
    exportCsv(currentResult.videos, currentResult.meta.title);
    showToast('â¬‡ CSV download started!');
  });

  // â”€â”€ RESET â”€â”€
  document.getElementById('resetBtn')?.addEventListener('click', () => {
    currentResult = null;
    hideResults();
    clearError();
    document.getElementById('playlistInput').value = '';
    document.getElementById('playlistInput').focus();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// MAIN CALCULATE HANDLER
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

async function handleCalculate() {
  clearError();

  // 1. Get and validate API key
  const apiKey = (document.getElementById('apiKeyInput')?.value || '').trim();
  if (!apiKey) {
    showError('Please enter your YouTube Data API v3 key first.');
    document.getElementById('apiKeyInput')?.focus();
    return;
  }

  // 2. Get and validate playlist input
  const rawInput = (document.getElementById('playlistInput')?.value || '').trim();
  if (!rawInput) {
    showError('Please enter a YouTube playlist URL or ID.');
    document.getElementById('playlistInput')?.focus();
    return;
  }

  // 3. Extract playlist ID
  const playlistId = extractPlaylistId(rawInput);
  if (!playlistId) {
    showError('Could not find a valid playlist ID. Please paste a full YouTube playlist URL (e.g. https://www.youtube.com/playlist?list=PLxxxxx) or a bare playlist ID.');
    return;
  }

  // 4. Hide previous results
  hideResults();
  setLoading(true, 'Fetchingâ€¦');

  try {
    // 5. Run the full analysis pipeline
    const result = await analyzePlaylist(apiKey, playlistId, ({ stage, current, total, message }) => {
      // Update button text with progress messages
      const btn = document.getElementById('btnText');
      if (btn) btn.textContent = message || 'Loadingâ€¦';
    });

    // 6. Store result for copy/export
    currentResult = result;

    // 7. Render all sections
    renderPlaylistMeta(result.meta);
    renderTotalDuration(result.totalSeconds, result.videos.length);
    renderSpeedGrid(calcSpeedBreakdown(result.totalSeconds));
    renderStats(result.totalSeconds, result.videos.length);
    renderVideoTable(result.videos);

    // 8. Show results with animation
    showResults();

  } catch (err) {
    // Show friendly error in the UI
    showError(err.message || 'An unexpected error occurred. Please try again.');
    console.error('[YT Calc Error]', err);
  } finally {
    setLoading(false);
  }
}
