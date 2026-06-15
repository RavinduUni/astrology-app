import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl
  ?? process.env.EXPO_PUBLIC_API_BASE_URL
  ?? 'http://localhost:5000';

let _token = null;

export function setAuthToken(token) {
  _token = token;
}

export function clearAuthToken() {
  _token = null;
}

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };
  if (_token) headers['Authorization'] = `Bearer ${_token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message ?? `HTTP ${res.status}`);
  return json;
}

const get  = (path)        => request('GET',  path);
const post = (path, body)  => request('POST', path, body);
const put  = (path, body)  => request('PUT',  path, body);

// ── Auth ──────────────────────────────────────────────────────────────────────

/**
 * Register a new user.
 * @param {{ email, password, name, birthDate, birthCity, lagna, gender }} data
 * @returns {{ token: string, user: UserProfile }}
 */
export const authRegister = (data) => post('/api/auth/register', data);

/**
 * Login with email + password.
 * @param {{ email: string, password: string }} credentials
 * @returns {{ token: string, user: UserProfile }}
 */
export const authLogin = (credentials) => post('/api/auth/login', credentials);

/**
 * Logout — invalidates the JWT on the server.
 * @returns {{ message: string }}
 */
export const authLogout = () => post('/api/auth/logout');

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
export const getProfile = () => get('/api/user/profile');

/**
 * Update editable profile fields.
 * @param {{ name?: string, birthCity?: string, avatarUrl?: string }} updates
 * @returns {UserProfile}
 */
export const updateProfile = (updates) => put('/api/user/profile', updates);

// ── Horoscope (Home tab) ──────────────────────────────────────────────────────

/**
 * Daily horoscope for the Home tab.
 * @param {{ userId: string, date: string }} params   date format: YYYY-MM-DD
 * @returns {{
 *   date: string,
 *   sign: string,
 *   summary: string,
 *   luckyNumber: number,
 *   luckyColor: { name: string, hex: string },
 *   luckyTime: string,
 *   energy: number,        // 0–100
 *   mood: string,
 *   moonPhase: string,
 *   moonEmoji: string,
 *   planets: Planet[]
 * }}
 *
 * Planet shape: { name, symbol, position, house, influence: 'positive'|'neutral'|'caution' }
 */
export const getDailyHoroscope = ({ userId, date }) =>
  get(`/api/horoscope/daily?userId=${userId}&date=${date}`);

/**
 * Auspicious time slots for the day (Home + Reports tab).
 * @param {{ userId: string, date: string }} params
 * @returns {AuspiciousSlot[]}
 *
 * AuspiciousSlot shape: { time: string, type: 'best'|'good'|'avoid', activity: string }
 */
export const getAuspiciousTimes = ({ userId, date }) =>
  get(`/api/horoscope/auspicious-times?userId=${userId}&date=${date}`);

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
export const getDailyReport = ({ userId, date }) =>
  get(`/api/reports/daily?userId=${userId}&date=${date}`);

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
export const getDomainReports = ({ userId, date, domain }) => {
  const q = domain
    ? `/api/reports/domains?userId=${userId}&date=${date}&domain=${domain}`
    : `/api/reports/domains?userId=${userId}&date=${date}`;
  return get(q);
};

/**
 * Current positions of all 9 Vedic planets.
 * @param {{ userId: string, date: string }} params
 * @returns {Planet[]}
 */
export const getPlanetTransits = ({ userId, date }) =>
  get(`/api/reports/planet-transits?userId=${userId}&date=${date}`);

/**
 * Auspicious timing slots scoped to Reports tab.
 * @param {{ userId: string, date: string }} params
 * @returns {AuspiciousSlot[]}
 */
export const getReportTimings = ({ userId, date }) =>
  get(`/api/reports/auspicious-timings?userId=${userId}&date=${date}`);

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
export const getRemedies = ({ userId, date }) =>
  get(`/api/reports/remedies?userId=${userId}&date=${date}`);

/**
 * Multi-year life path forecast (LifeTimelineCard).
 * @param {{ userId: string, year: string }} params   year: YYYY
 * @returns {{ year: string, label: string }[]}
 */
export const getYearlyForecast = ({ userId, year }) =>
  get(`/api/reports/yearly?userId=${userId}&year=${year}`);

/**
 * 7-day weekly report (premium).
 * @param {{ userId: string, weekStartDate: string }} params
 * @returns {{ weekRange: string, cosmicScore: number, summary: string, days: DayHighlight[] }}
 */
export const getWeeklyReport = ({ userId, weekStartDate }) =>
  get(`/api/reports/weekly?userId=${userId}&weekStartDate=${weekStartDate}`);

/**
 * Monthly report (premium).
 * @param {{ userId: string, month: string }} params   month: YYYY-MM
 * @returns {{ month: string, cosmicScore: number, summary: string, weeks: object[] }}
 */
export const getMonthlyReport = ({ userId, month }) =>
  get(`/api/reports/monthly?userId=${userId}&month=${month}`);

/**
 * Generate a shareable link for a report.
 * @param {{ userId: string, date: string, reportType: string }} body
 * @returns {{ shareUrl: string, shareText: string }}
 */
export const shareReport = (body) => post('/api/reports/share', body);

// ── Chat ──────────────────────────────────────────────────────────────────────

/**
 * Send a message to the Cosmiq AI astrologer.
 * @param {{ userId: string, message: string, conversationId?: string }} body
 * @returns {{ reply: string, conversationId: string, isVoice: boolean }}
 */
export const sendChatMessage = (body) => post('/api/chat/message', body);

/**
 * Fetch paginated chat history.
 * @param {{ userId: string, conversationId: string, limit?: number, offset?: number }} params
 * @returns {{ messages: ChatMessage[] }}
 *
 * ChatMessage shape: { id, role: 'user'|'ai', text, timestamp, isVoice }
 */
export const getChatHistory = ({ userId, conversationId, limit = 20, offset = 0 }) =>
  get(`/api/chat/history?userId=${userId}&conversationId=${conversationId}&limit=${limit}&offset=${offset}`);

// ── Astrologers ───────────────────────────────────────────────────────────────

/**
 * List astrologers (Astrologers tab).
 * @param {{ page?: number, limit?: number, specialty?: string }} params
 * @returns {Astrologer[]}
 *
 * Astrologer shape: { id, name, avatarUrl, specialty, rating, reviewCount, pricePerMin, isOnline }
 */
export const getAstrologers = ({ page = 1, limit = 20, specialty } = {}) => {
  const q = specialty
    ? `/api/astrologers?page=${page}&limit=${limit}&specialty=${specialty}`
    : `/api/astrologers?page=${page}&limit=${limit}`;
  return get(q);
};

/**
 * Fetch a single astrologer's full profile.
 * @param {string} id
 * @returns {AstrologerDetail}
 */
export const getAstrologer = (id) => get(`/api/astrologers/${id}`);

// ── Notifications ─────────────────────────────────────────────────────────────

/**
 * Fetch notification feed.
 * @param {{ userId: string, limit?: number, offset?: number }} params
 * @returns {Notification[]}
 *
 * Notification shape: { id, title, body, type, isRead, createdAt }
 * Types: 'daily_report' | 'auspicious_alert' | 'chat_reply'
 */
export const getNotifications = ({ userId, limit = 20, offset = 0 }) =>
  get(`/api/notifications?userId=${userId}&limit=${limit}&offset=${offset}`);

/**
 * Mark a notification as read.
 * @param {string} id
 * @returns {{ success: boolean }}
 */
export const markNotificationRead = (id) => put(`/api/notifications/${id}/read`);

// ── Starbase ──────────────────────────────────────────────────────────────────

/**
 * List knowledge base articles (Starbase tab).
 * @param {{ category?: string, page?: number }} params
 * @returns {Article[]}
 *
 * Article shape: { id, title, excerpt, category, imageUrl, isPremium }
 * Categories: 'planets' | 'signs' | 'houses' | 'remedies'
 */
export const getArticles = ({ category, page = 1 } = {}) => {
  const q = category
    ? `/api/starbase/articles?category=${category}&page=${page}`
    : `/api/starbase/articles?page=${page}`;
  return get(q);
};

/**
 * Fetch a single article.
 * @param {string} id
 * @returns {{ id, title, body, category, imageUrl, isPremium }}
 */
export const getArticle = (id) => get(`/api/starbase/articles/${id}`);
