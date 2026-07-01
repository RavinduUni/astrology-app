import * as SecureStore from 'expo-secure-store';

// ⚠️  On a physical device or Android emulator, 'localhost' refers to the
// device itself — NOT your dev machine. Use your machine's LAN IP instead,
// or set EXPO_PUBLIC_API_BASE_URL in your .env file.
// e.g.  EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:5000
// Android emulator shortcut: http://10.0.2.2:5000
const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const REQUEST_TIMEOUT_MS = 30_000; // 30 seconds (AI responses can be slow)

/**
 * Called automatically on any 401 response so the AuthContext can
 * clear the stale token and redirect the user to login.
 * Set this once in AuthContext via `setApiLogoutCallback(logout)`.
 */
let _logoutCallback = null;
export const setApiLogoutCallback = (cb) => { _logoutCallback = cb; };


async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  // Read directly from SecureStore here so that api.js stays
  // independent from auth.js (avoiding a circular dependency).
  const token = await SecureStore.getItemAsync('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;

  // Abort the request if it takes longer than REQUEST_TIMEOUT_MS
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection.');
    }
    throw new Error('Network request failed. Please check your internet connection.');
  } finally {
    clearTimeout(timeoutId);
  }

  // Auto-logout on 401 Unauthorized (expired / revoked token)
  if (res.status === 401) {
    if (_logoutCallback) _logoutCallback();
    throw new Error('Session expired. Please log in again.');
  }

  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? `HTTP ${res.status}`);
  return json;
}

export const get = (path) => request('GET', path);
export const post = (path, body) => request('POST', path, body);
export const put = (path, body) => request('PUT', path, body);


// ── User ──────────────────────────────────────────────────────────────────────

/**
 * Fetch the authenticated user's profile.
 * @returns {UserProfile}
 *
 * UserProfile shape:
 * {
 *   id: string,
 *   name: string,
 *   email: string,
 *   sign: string,          // e.g. "Leo"
 *   signSymbol: string,    // e.g. "♌"
 *   signColor: string,     // e.g. "#FFB84A"
 *   lagna: string,         // e.g. "Scorpio"
 *   birthDate: string,     // e.g. "15 August 1995"
 *   birthCity: string,     // e.g. "Colombo, Sri Lanka"
 *   avatarUrl: string|null
 * }
 */
export const getProfile = async () => await get('/api/user/profile');

/**
 * Update editable profile fields.
 * @param {{ name?: string, birthCity?: string, avatarUrl?: string }} updates
 * @returns {UserProfile}
 */
export const updateProfile = async (updates) => await put('/api/user/profile', updates);

// ── Dashboard (new single-call endpoints — use these in screens) ─────────────

/**
 * All data needed for the Home tab in a single request.
 * Cache-first: served instantly from DB if already generated for today.
 * @returns {{ date, sign, signSymbol, signColor, summary, luckyNumber, luckyColor,
 *             luckyTime, energy, mood, moonPhase, moonEmoji, planets }}
 */
export const getHomeDashboard = async () => await get('/api/dashboard/home');

/**
 * All data needed for the Reports tab in a single request.
 * Cache-first: served instantly from DB if already generated for today.
 * @returns {{ date, userProfile, cosmicScore, cosmicLabel, headline, summary,
 *             domains, planets, auspiciousSlots, remedies, lifeTimeline }}
 */
export const getReportsDashboard = async () => await get('/api/dashboard/reports');

// ── Horoscope (Home tab) — legacy, kept for reference ─────────────────────────

/**
 * Daily horoscope for the Home tab.
 * @param {{ userId: string, date: string }} params   date format: YYYY-MM-DD
 */
export const getDailyHoroscope = async ({ userId, date }) =>
  await get(`/api/horoscope/daily?userId=${userId}&date=${date}`);

/**
 * Auspicious time slots for the day.
 * @param {{ userId: string, date: string }} params
 */
export const getAuspiciousTimes = async ({ userId, date }) =>
  await get(`/api/horoscope/auspicious-times?userId=${userId}&date=${date}`);

// ── Reports ───────────────────────────────────────────────────────────────────

/**
 * Daily cosmic score summary (top card in Reports tab).
 * @param {{ userId: string, date: string }} params
 * @returns {{
 *   date: string,
 *   cosmicScore: number,   // 0–100
 *   cosmicLabel: string,   // e.g. "Highly Favourable"
 *   headline: string,
 *   summary: string
 * }}
 */
export const getDailyReport = async ({ userId, date }) =>
  await get(`/api/reports/daily?userId=${userId}&date=${date}`);

/**
 * Domain readings: Love, Career, Health, Wealth.
 * @param {{ userId: string, date: string, domain?: string }} params
 * @returns {DomainReport[]}
 *
 * DomainReport shape:
 * {
 *   id: 'love'|'career'|'health'|'wealth',
 *   label: string,
 *   color: string,
 *   score: number,
 *   summary: string,
 *   detail: string,
 *   subScores: [{ label: string, value: number }],
 *   tips: string[]
 * }
 */
export const getDomainReports = async ({ userId, date, domain }) => {
  const q = domain
    ? `/api/reports/domains?userId=${userId}&date=${date}&domain=${domain}`
    : `/api/reports/domains?userId=${userId}&date=${date}`;
  return await get(q);
};

/**
 * Current positions of all 9 Vedic planets.
 * @param {{ userId: string, date: string }} params
 * @returns {Planet[]}
 */
export const getPlanetTransits = async ({ userId, date }) =>
  await get(`/api/reports/planet-transits?userId=${userId}&date=${date}`);

/**
 * Auspicious timing slots scoped to Reports tab.
 * @param {{ userId: string, date: string }} params
 * @returns {AuspiciousSlot[]}
 */
export const getReportTimings = async ({ userId, date }) =>
  await get(`/api/reports/auspicious-timings?userId=${userId}&date=${date}`);

/**
 * Vedic remedies for the day.
 * @param {{ userId: string, date: string }} params
 * @returns {Remedy[]}
 *
 * Remedy shape:
 * {
 *   type: 'Gemstone'|'Lucky Color'|'Fasting'|'Mantra',
 *   value: string,
 *   desc: string,
 *   color: string,
 *   fullMantra?: string
 * }
 */
export const getRemedies = async ({ userId, date }) =>
  await get(`/api/reports/remedies?userId=${userId}&date=${date}`);

/**
 * Multi-year life path forecast (LifeTimelineCard).
 * @param {{ userId: string, year: string }} params   year: YYYY
 * @returns {{ year: string, label: string }[]}
 */
export const getYearlyForecast = async ({ userId, year }) =>
  await get(`/api/reports/yearly?userId=${userId}&year=${year}`);

/**
 * 7-day weekly report (premium).
 * @param {{ userId: string, weekStartDate: string }} params
 * @returns {{ weekRange: string, cosmicScore: number, summary: string, days: DayHighlight[] }}
 */
export const getWeeklyReport = async ({ userId, weekStartDate }) =>
  await get(`/api/reports/weekly?userId=${userId}&weekStartDate=${weekStartDate}`);

/**
 * Monthly report (premium).
 * @param {{ userId: string, month: string }} params   month: YYYY-MM
 * @returns {{ month: string, cosmicScore: number, summary: string, weeks: object[] }}
 */
export const getMonthlyReport = async ({ userId, month }) =>
  await get(`/api/reports/monthly?userId=${userId}&month=${month}`);

/**
 * Generate a shareable link for a report.
 * @param {{ userId: string, date: string, reportType: string }} body
 * @returns {{ shareUrl: string, shareText: string }}
 */
export const shareReport = async (body) => await post('/api/reports/share', body);

// ── Chat ──────────────────────────────────────────────────────────────────────

/**
 * Send a message to the Cosmiq AI astrologer.
 * @param {{ userId: string, message: string, conversationId?: string }} body
 * @returns {{ reply: string, conversationId: string, isVoice: boolean }}
 */
export const sendChatMessage = async (body) => await post('/api/chat/message', body);

/**
 * Fetch paginated chat history.
 * @param {{ userId: string, conversationId: string, limit?: number, offset?: number }} params
 * @returns {{ messages: ChatMessage[] }}
 *
 * ChatMessage shape: { id, role: 'user'|'ai', text, timestamp, isVoice }
 */
export const getChatHistory = async ({ userId, conversationId, limit = 20, offset = 0 }) =>
  await get(`/api/chat/history?userId=${userId}&conversationId=${conversationId}&limit=${limit}&offset=${offset}`);

// ── Astrologers ───────────────────────────────────────────────────────────────

/**
 * List astrologers (Astrologers tab).
 * @param {{ page?: number, limit?: number, specialty?: string }} params
 * @returns {Astrologer[]}
 *
 * Astrologer shape: { id, name, avatarUrl, specialty, rating, reviewCount, pricePerMin, isOnline }
 */
export const getAstrologers = async ({ page = 1, limit = 20, specialty } = {}) => {
  const q = specialty
    ? `/api/astrologers?page=${page}&limit=${limit}&specialty=${specialty}`
    : `/api/astrologers?page=${page}&limit=${limit}`;
  return await get(q);
};

/**
 * Fetch a single astrologer's full profile.
 * @param {string} id
 * @returns {AstrologerDetail}
 */
export const getAstrologer = async (id) => await get(`/api/astrologers/${id}`);

// ── Notifications ─────────────────────────────────────────────────────────────

/**
 * Fetch notification feed.
 * @param {{ userId: string, limit?: number, offset?: number }} params
 * @returns {Notification[]}
 *
 * Notification shape: { id, title, body, type, isRead, createdAt }
 * Types: 'daily_report' | 'auspicious_alert' | 'chat_reply'
 */
export const getNotifications = async ({ userId, limit = 20, offset = 0 }) =>
  await get(`/api/notifications?userId=${userId}&limit=${limit}&offset=${offset}`);

/**
 * Mark a notification as read.
 * @param {string} id
 * @returns {{ success: boolean }}
 */
export const markNotificationRead = async (id) => await put(`/api/notifications/${id}/read`);

// ── Starbase ──────────────────────────────────────────────────────────────────

/**
 * List knowledge base articles (Starbase tab).
 * @param {{ category?: string, page?: number }} params
 * @returns {Article[]}
 *
 * Article shape: { id, title, excerpt, category, imageUrl, isPremium }
 * Categories: 'planets' | 'signs' | 'houses' | 'remedies'
 */
export const getArticles = async ({ category, page = 1 } = {}) => {
  const q = category
    ? `/api/starbase/articles?category=${category}&page=${page}`
    : `/api/starbase/articles?page=${page}`;
  return await get(q);
};

/**
 * Fetch a single article.
 * @param {string} id
 * @returns {{ id, title, body, category, imageUrl, isPremium }}
 */
export const getArticle = async (id) => await get(`/api/starbase/articles/${id}`);
