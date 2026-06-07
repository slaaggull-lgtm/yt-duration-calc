/**
 * api.js â€” YouTube Data API v3 wrapper
 *
 * Handles:
 *  - Fetching playlist metadata (title, channel, thumbnail)
 *  - Paginated fetching of all video IDs in the playlist
 *  - Batch fetching of video durations (50 videos per request â€” API limit)
 *  - Progress callback for UI feedback
 */

const YT_API_BASE = 'https://www.googleapis.com/youtube/v3';

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// LOW-LEVEL FETCH HELPER
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Fetches a YouTube API endpoint and returns parsed JSON.
 * Throws a user-friendly error on failure.
 *
 * @param {string} endpoint - e.g. "/playlistItems"
 * @param {Object} params   - query parameters
 * @returns {Promise<Object>}
 */
async function ytFetch(endpoint, params) {
  const url = new URL(YT_API_BASE + endpoint);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString());
  const json = await res.json();

  // Handle API errors (key invalid, quota exceeded, playlist not found, etc.)
  if (!res.ok) {
    const err = json?.error;
    if (err) {
      const reason = err.errors?.[0]?.reason || '';
      if (reason === 'keyInvalid' || reason === 'badRequest') {
        throw new Error('Invalid API key. Please check your YouTube Data API v3 key.');
      }
      if (reason === 'quotaExceeded' || reason === 'dailyLimitExceeded') {
        throw new Error('YouTube API quota exceeded. Please try again tomorrow.');
      }
      if (reason === 'playlistNotFound' || res.status === 404) {
        throw new Error('Playlist not found. Make sure it is public or unlisted.');
      }
      throw new Error(err.message || `API error ${res.status}`);
    }
    throw new Error(`HTTP ${res.status} â€” ${res.statusText}`);
  }

  return json;
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// PLAYLIST METADATA
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Fetches metadata for a playlist (title, channel, thumbnail, privacy).
 *
 * @param {string} apiKey
 * @param {string} playlistId
 * @returns {Promise<{ title, channel, thumbnail, privacy, videoCount }>}
 */
async function fetchPlaylistMeta(apiKey, playlistId) {
  const data = await ytFetch('/playlists', {
    part: 'snippet,contentDetails,status',
    id: playlistId,
    key: apiKey,
  });

  if (!data.items || data.items.length === 0) {
    throw new Error('Playlist not found or is private.');
  }

  const item = data.items[0];
  const snippet = item.snippet || {};
  const status  = item.status  || {};
  const details = item.contentDetails || {};

  // Best available thumbnail (maxres â†’ high â†’ medium â†’ default)
  const thumbs = snippet.thumbnails || {};
  const thumbnail =
    (thumbs.maxres || thumbs.high || thumbs.medium || thumbs.default || {}).url || '';

  return {
    title:      snippet.title      || 'Untitled Playlist',
    channel:    snippet.channelTitle || 'Unknown Channel',
    thumbnail,
    privacy:    status.privacyStatus || 'public',
    videoCount: details.itemCount   || 0,
  };
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// PAGINATED VIDEO ID COLLECTION
// YouTube returns max 50 items per playlistItems page.
// We follow nextPageToken until exhausted.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Collects ALL video IDs from a playlist (handles pagination).
 *
 * @param {string} apiKey
 * @param {string} playlistId
 * @param {Function} [onProgress] - called with (fetchedCount, totalKnown)
 * @returns {Promise<Array<{ videoId, title, position }>>}
 */
async function fetchAllVideoIds(apiKey, playlistId, onProgress) {
  const items = [];
  let pageToken = '';
  let pagesFetched = 0;

  do {
    const params = {
      part: 'snippet,contentDetails',
      playlistId,
      maxResults: 50,      // Maximum allowed by the API
      key: apiKey,
    };
    if (pageToken) params.pageToken = pageToken;

    const data = await ytFetch('/playlistItems', params);
    pagesFetched++;

    for (const item of (data.items || [])) {
      const videoId = item.contentDetails?.videoId || item.snippet?.resourceId?.videoId;
      const title   = item.snippet?.title || 'Untitled';
      const pos     = item.snippet?.position ?? items.length;

      // Skip "deleted" or "private" placeholders
      if (!videoId || title === 'Deleted video' || title === 'Private video') continue;

      items.push({ videoId, title, position: pos });
    }

    pageToken = data.nextPageToken || '';

    // Notify progress: we've fetched items.length so far
    if (typeof onProgress === 'function') {
      onProgress(items.length, null); // total not yet known at this stage
    }

  } while (pageToken);

  return items;
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// BATCH DURATION FETCH
// videos.list allows max 50 IDs per request.
// We chunk the ID list and make parallel batches.
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Fetches duration (in seconds) for a list of video IDs.
 * Automatically chunks into batches of 50.
 *
 * @param {string} apiKey
 * @param {Array<string>} videoIds
 * @param {Function} [onProgress] - called with (loadedCount, totalCount)
 * @returns {Promise<Map<string, number>>} Map of videoId â†’ seconds
 */
async function fetchVideosDuration(apiKey, videoIds, onProgress) {
  const durationMap = new Map(); // videoId â†’ seconds
  const CHUNK_SIZE = 50;

  // Split IDs into chunks of 50
  const chunks = [];
  for (let i = 0; i < videoIds.length; i += CHUNK_SIZE) {
    chunks.push(videoIds.slice(i, i + CHUNK_SIZE));
  }

  let processed = 0;

  for (const chunk of chunks) {
    const data = await ytFetch('/videos', {
      part: 'contentDetails',
      id: chunk.join(','),
      key: apiKey,
    });

    for (const item of (data.items || [])) {
      const iso = item.contentDetails?.duration || 'PT0S';
      durationMap.set(item.id, isoToSeconds(iso));  // isoToSeconds from utils.js
    }

    processed += chunk.length;

    if (typeof onProgress === 'function') {
      onProgress(processed, videoIds.length);
    }
  }

  return durationMap;
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// MAIN ORCHESTRATOR
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

/**
 * Full pipeline: metadata â†’ video IDs â†’ durations â†’ assembled results.
 *
 * @param {string} apiKey
 * @param {string} playlistId
 * @param {Function} [onProgress] - called with { stage, current, total, message }
 * @returns {Promise<{
 *   meta: Object,
 *   videos: Array<{ videoId, title, position, durationSeconds, durationHuman }>,
 *   totalSeconds: number
 * }>}
 */
async function analyzePlaylist(apiKey, playlistId, onProgress) {
  const notify = (stage, current, total, message) => {
    if (typeof onProgress === 'function') onProgress({ stage, current, total, message });
  };

  // Stage 1: Playlist metadata
  notify('meta', 0, 1, 'Fetching playlist infoâ€¦');
  const meta = await fetchPlaylistMeta(apiKey, playlistId);

  // Stage 2: Collect all video IDs (paginated)
  notify('ids', 0, null, 'Collecting video listâ€¦');
  const videoItems = await fetchAllVideoIds(apiKey, playlistId, (count) => {
    notify('ids', count, null, `Collecting videosâ€¦ (${count} found so far)`);
  });

  if (videoItems.length === 0) {
    throw new Error('No playable videos found in this playlist.');
  }

  // Stage 3: Fetch durations in batches of 50
  const allIds = videoItems.map(v => v.videoId);
  notify('durations', 0, allIds.length, 'Loading video durationsâ€¦');

  const durationMap = await fetchVideosDuration(apiKey, allIds, (current, total) => {
    notify('durations', current, total, `Loading durationsâ€¦ (${current}/${total})`);
  });

  // Stage 4: Assemble final video objects
  let totalSeconds = 0;
  const videos = videoItems.map(item => {
    const secs = durationMap.get(item.videoId) || 0;
    totalSeconds += secs;
    return {
      videoId:         item.videoId,
      title:           item.title,
      position:        item.position,
      durationSeconds: secs,
      durationHuman:   secondsToHuman(secs, true),  // compact clock format
    };
  });

  // Update meta with accurate count (may differ from contentDetails.itemCount)
  meta.videoCount = videos.length;

  notify('done', 1, 1, 'Done!');

  return { meta, videos, totalSeconds };
}
