import User from "../models/User.js";
import ChatConversation from "../models/ChatConversation.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import ai from "../configs/ai.js";

/**
 * POST /api/auth/register
 * Body: { email, password, name, birthDate, birthCity, lagna }
 * Returns: { token, user: { id, email, name, sign, lagna, birthDate, birthCity } }
 * Creates a new user account. Derives zodiac sign from birthDate on the server.
 */
export const register = async (req, res) => {
  try {

    const { email, password, name, birthDate, birthTime, birthCity, lagna, longitude, latitude, timeZone, gender } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ email, password: hashPassword, name, birthDate, birthTime, birthCity, longitude, latitude, timeZone, gender });

    const token = generateToken(user._id);

    const { password: _, ...userWithoutPassword } = user.toObject();

    return res.status(201).json({ message: "User created successfully", user: userWithoutPassword, token });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns: { token, user: { id, email, name, sign, signSymbol, signColor, lagna, birthDate, birthCity } }
 * Authenticates the user and returns a JWT.
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login request:", req.body);

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = generateToken(user._id);

    const { password: _, ...userWithoutPassword } = user.toObject();

    return res.status(200).json({ message: "Login successful", user: userWithoutPassword, token });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

/**
 * POST /api/auth/logout
 * Headers: Authorization: Bearer <token>
 * Returns: { message: 'Logged out' }
 * Invalidates the session / blacklists the JWT.
 */
export const logout = (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

// ─────────────────────────────────────────────────────────────────────────────
// USER ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/user/profile
 * Headers: Authorization: Bearer <token>
 * Returns: { id, name, email, sign, signSymbol, signColor, lagna, birthDate, birthCity, avatarUrl }
 * Fetches the authenticated user's full profile including derived zodiac data.
 */
export const getProfile = (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

/**
 * PUT /api/user/profile
 * Headers: Authorization: Bearer <token>
 * Body: { name?, birthCity?, avatarUrl? }
 * Returns: updated user object
 * Updates editable profile fields (name, city, avatar). birthDate and lagna
 * are immutable after registration.
 */
export const updateProfile = (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

// ─────────────────────────────────────────────────────────────────────────────
// HOROSCOPE / HOME ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/horoscope/daily?userId=&date=YYYY-MM-DD
 * Headers: Authorization: Bearer <token>
 * Returns: {
 *   date, sign, summary,        // one-paragraph daily reading
 *   luckyNumber, luckyColor, luckyTime,
 *   energy,                     // 0–100 energy level
 *   mood,                       // e.g. "Confident", "Reflective"
 *   planets: [{ name, symbol, position, house, influence }]  // 9 Vedic planets
 * }
 * Powers the Home tab: DailyHoroscopeCard, LuckyStatsRow, PlanetaryOverview.
 */
export const getHoroscope = (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

/**
 * GET /api/horoscope/auspicious-times?userId=&date=YYYY-MM-DD
 * Headers: Authorization: Bearer <token>
 * Returns: [{ time, type: 'best'|'good'|'avoid', activity }]
 * Powers AuspiciousTimeline on the Home tab and AuspiciousTimingsCard in Reports.
 * Times are calculated from the user's birth city (timezone + Rahu Kalam rules).
 */
export const getAuspiciousTimes = (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

// ─────────────────────────────────────────────────────────────────────────────
// REPORTS ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/reports/daily?userId=&date=YYYY-MM-DD
 * Headers: Authorization: Bearer <token>
 * Returns: {
 *   date, cosmicScore,           // overall 0–100 cosmic alignment score
 *   cosmicLabel,                 // e.g. "Highly Favourable"
 *   headline,                    // e.g. "Jupiter amplifies your potential"
 *   summary                      // 1–2 sentence overview for DailyScoreCard
 * }
 * Powers the top DailyScoreCard in the Reports tab.
 */
export const getDailyReports = (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

/**
 * GET /api/reports/domains?userId=&date=YYYY-MM-DD&domain=love|career|health|wealth
 * Omit `domain` to return all four domains in one response.
 * Headers: Authorization: Bearer <token>
 * Returns: [{
 *   id: 'love'|'career'|'health'|'wealth',
 *   label, color, score,         // 0–100 domain score
 *   summary,                     // one-line planet influence note
 *   detail,                      // full paragraph reading for expanded view
 *   subScores: [{ label, value }],  // 3 sub-dimensions per domain
 *   tips: [string]               // 3 actionable tips
 * }]
 * Powers DomainExpandCard (Love, Career, Health, Wealth cards) in Reports tab.
 */
export const getDomainReports = (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

/**
 * GET /api/reports/planet-transits?userId=&date=YYYY-MM-DD
 * Headers: Authorization: Bearer <token>
 * Returns: [{ name, symbol, position, house, influence: 'positive'|'neutral'|'caution' }]
 * 9 Vedic planets (Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Rahu, Ketu).
 * Powers PlanetInfluenceStrip in Reports tab.
 */
export const getPlanetTransits = (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

/**
 * GET /api/reports/auspicious-timings?userId=&date=YYYY-MM-DD
 * Headers: Authorization: Bearer <token>
 * Returns: [{ time, type: 'best'|'good'|'avoid', activity }]
 * Same data as /api/horoscope/auspicious-times but scoped to the Reports tab.
 * Can be a proxy to the same calculation service.
 */
export const getAuspiciousTimingsReport = (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

/**
 * GET /api/reports/remedies?userId=&date=YYYY-MM-DD
 * Headers: Authorization: Bearer <token>
 * Returns: [{
 *   type: 'Gemstone'|'Lucky Color'|'Fasting'|'Mantra',
 *   value,          // e.g. "Ruby", "Golden Yellow", "Sunday", "Om Suryaya Namah"
 *   desc,           // short instruction
 *   color,          // hex accent color for UI
 *   fullMantra?     // Sanskrit / Devanagari string, only for Mantra type
 * }]
 * Powers RemediesCard in Reports tab. Based on current planetary positions
 * relative to user's natal chart.
 */
export const getRemedies = (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

/**
 * GET /api/reports/yearly?userId=&year=YYYY
 * Headers: Authorization: Bearer <token>
 * Returns: [{ year, label }]  // multi-year life path forecast
 * Powers LifeTimelineCard in Reports tab. Based on major Dasha/transit cycles
 * calculated from user's birth details. year ranges like "2024–25".
 */
export const getYearlyReports = (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

/**
 * GET /api/reports/weekly?userId=&weekStartDate=YYYY-MM-DD
 * Headers: Authorization: Bearer <token>
 * Returns: { weekRange, cosmicScore, summary, days: [{ date, score, highlight }] }
 * Powers the Weekly tab in ReportTypeSelector (currently "coming soon" / premium).
 */
export const getWeeklyReports = (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

/**
 * GET /api/reports/monthly?userId=&month=YYYY-MM
 * Headers: Authorization: Bearer <token>
 * Returns: { month, cosmicScore, summary, weeks: [...] }
 * Powers the Monthly tab (currently "coming soon" / premium).
 */
export const getMonthlyReports = (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

/**
 * POST /api/reports/share
 * Headers: Authorization: Bearer <token>
 * Body: { userId, date, reportType: 'daily'|'weekly'|'monthly'|'yearly' }
 * Returns: { shareUrl, shareText }
 * Generates a shareable link/text for the report (used by the Share button in ReportsHeader).
 */
export const shareReport = (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

// ─────────────────────────────────────────────────────────────────────────────
// CHAT / AI ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Builds a concise natal-chart summary string to inject into the AI system prompt.
 * Keeps the prompt short while giving the model essential birth context.
 */
function buildNatalChartForAi(user) {
  const lines = [
    `Name      : ${user.name}`,
    `Gender    : ${user.gender ?? "Not specified"}`,
    `Birth date: ${user.birthDate ? new Date(user.birthDate).toDateString() : "Unknown"}`,
    `Birth time: ${user.birthTime ?? "Unknown"}`,
    `Birth city: ${user.birthCity ?? "Unknown"}`,
    `Sun sign  : ${user.sign ?? "Unknown"}`,
    `Lagna     : ${user.lagna ?? "Unknown"}`,
  ];
  return lines.join("\n");
}

/**
 * POST /api/chat/message
 * Headers: Authorization: Bearer <token>
 * Body: { userId, message, conversationId? }
 * Returns: { reply, conversationId, isVoice?: false }
 * Proxies the user's message to the LLM (e.g. Claude / GPT-4) with the user's
 * natal chart injected as system context. The backend holds the AI API key.
 * Powers ChatScreen (Cosmiq AI tab).
 */
export const chatMessage = async (req, res) => {

  const { message, conversationId } = req.body;
  const userId = req.userId;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  let user;
  try {
    user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });
  } catch (error) {
    console.error("chatMessage — user lookup error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }

  const natalChart = buildNatalChartForAi(user);

  // ── Build the system prompt ───────────────────────────────────────────────
  const systemPrompt = `You are Cosmiq AI, an expert Vedic astrologer and cosmic guide.

Today's date is: ${new Date().toISOString().slice(0, 10)}

User natal chart:
${natalChart}

Guidelines:
1. Be warm, personal, and conversational — you know this person well.
2. Always address the user by their first name (${user.name.split(" ")[0]}).
3. Keep answers practical, uplifting, and easy to understand.
4. Avoid dumping raw calculation data unless the user explicitly asks.
5. When discussing "today", factor in both the natal chart and current planetary transits.
6. Use emojis sparingly to keep the tone friendly but not overwhelming.
7. Keep responses concise — 2-4 short paragraphs unless more depth is requested.`;

  // ── Call the AI ───────────────────────────────────────────────────────────
  let reply;
  try {
    const response = await ai.chat.completions.create({
      model: process.env.GEMINI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: message.trim() },
      ],
    });
    reply = response.choices[0]?.message?.content?.trim() || "";
  } catch (error) {
    console.error("chatMessage — AI error:", error);
    return res.status(500).json({ error: "Failed to generate AI response" });
  }

  // ── Resolve conversationId ────────────────────────────────────────────────
  // We need the conversationId to include in the response so the client can
  // send follow-ups in the same thread.  Find or create it synchronously
  // (just the document shell), then append messages asynchronously.
  let conv;
  try {
    if (conversationId) {
      conv = await ChatConversation.findOne({ _id: conversationId, userId });
    }
    if (!conv) {
      // Create a new conversation shell — messages will be appended below
      conv = await ChatConversation.create({
        userId,
        title: message.trim().slice(0, 60),
        natalChartSnapshot: {
          sign:      user.sign      ?? null,
          lagna:     user.lagna     ?? null,
          birthDate: user.birthDate ? new Date(user.birthDate).toISOString().slice(0, 10) : null,
          birthCity: user.birthCity ?? null,
        },
      });
    }
  } catch (error) {
    // Non-fatal: we still reply to the user even if DB creation fails.
    console.error("chatMessage — conversation create error:", error);
  }

  // ── Respond to the client immediately ────────────────────────────────────
  const resolvedConvId = conv?._id?.toString() ?? null;
  res.json({ reply, conversationId: resolvedConvId, isVoice: false });

  // ── Persist messages asynchronously (fire-and-forget) ────────────────────
  // We do NOT await this — the client already has the reply.
  if (conv) {
    const now = new Date();
    ChatConversation.findByIdAndUpdate(
      conv._id,
      {
        $push: {
          messages: {
            $each: [
              { role: "user", text: message.trim(), timestamp: now },
              { role: "ai",   text: reply,           timestamp: new Date(now.getTime() + 1) },
            ],
          },
        },
        $inc: { messageCount: 2 },
      },
      { new: false }
    ).catch((err) => console.error("chatMessage — async save error:", err));
  }
};

/**
 * GET /api/chat/history?userId=&conversationId=&limit=20&offset=0
 * Headers: Authorization: Bearer <token>
 * Returns: { messages: [{ id, role: 'user'|'ai', text, timestamp, isVoice }] }
 * Fetches paginated chat history for the ChatScreen to restore on re-open.
 */
export const chatHistory = async (req, res) => {
  const userId = req.userId;
  const { conversationId, limit = 20, offset = 0 } = req.query;

  if (!conversationId) {
    return res.status(400).json({ message: "conversationId is required" });
  }

  try {
    const conv = await ChatConversation.findOne({ _id: conversationId, userId });
    if (!conv) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const limitNum  = Math.min(Number(limit)  || 20, 100);
    const offsetNum = Number(offset) || 0;

    // Slice messages array with pagination (newest messages last)
    const total    = conv.messages.length;
    const sliced   = conv.messages.slice(offsetNum, offsetNum + limitNum);

    const messages = sliced.map((m) => ({
      id:        m._id.toString(),
      role:      m.role,
      text:      m.text,
      isVoice:   m.isVoice,
      duration:  m.duration ?? undefined,
      timestamp: m.timestamp,
    }));

    return res.json({
      conversationId,
      total,
      offset:    offsetNum,
      limit:     limitNum,
      messages,
    });
  } catch (error) {
    console.error("chatHistory error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ASTROLOGERS ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/astrologers?page=1&limit=20&specialty=vedic|tarot|numerology
 * Returns: [{ id, name, avatarUrl, specialty, rating, reviewCount, pricePerMin, isOnline }]
 * Powers the Astrologers tab (currently a placeholder).
 */
export const getAstrologers = (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

/**
 * GET /api/astrologers/:id
 * Returns: full astrologer profile with bio, availability, reviews
 * Powers an astrologer detail/booking screen (to be built).
 */
export const getAstrologerById = (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATIONS ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/notifications?userId=&limit=20&offset=0
 * Headers: Authorization: Bearer <token>
 * Returns: [{ id, title, body, type, isRead, createdAt }]
 * Powers NotificationsScreen. Types: 'daily_report', 'auspicious_alert', 'chat_reply'.
 */
export const getNotifications = (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

/**
 * PUT /api/notifications/:id/read
 * Headers: Authorization: Bearer <token>
 * Returns: { success: true }
 * Marks a single notification as read.
 */
export const markNotificationAsRead = (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

// ─────────────────────────────────────────────────────────────────────────────
// STARBASE ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/starbase/articles?category=planets|signs|houses|remedies&page=1
 * Returns: [{ id, title, excerpt, category, imageUrl, isPremium }]
 * Powers the Starbase tab (currently a placeholder).
 * Vedic astrology knowledge base articles.
 */
export const getStarbaseArticles = (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

/**
 * GET /api/starbase/articles/:id
 * Returns: full article { id, title, body, category, imageUrl, isPremium }
 */
export const getStarbaseArticleById = (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};