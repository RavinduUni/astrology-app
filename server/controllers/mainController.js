import User from "../models/User.js";
import ChatConversation from "../models/ChatConversation.js";
import DailyHoroscope from "../models/DailyHoroscope.js";
import Report from "../models/Report.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import ai from "../configs/ai.js";

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Today's date as YYYY-MM-DD in UTC */
function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

/** Derive zodiac sign from a Date object (Western sun sign) */
function deriveSign(birthDate) {
  const d = new Date(birthDate);
  const month = d.getUTCMonth() + 1; // 1-based
  const day = d.getUTCDate();
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
}

const SIGN_META = {
  Aries: { symbol: "♈", color: "#FF6B4A" },
  Taurus: { symbol: "♉", color: "#4AFF8C" },
  Gemini: { symbol: "♊", color: "#4AD4FF" },
  Cancer: { symbol: "♋", color: "#4A8CFF" },
  Leo: { symbol: "♌", color: "#FFB84A" },
  Virgo: { symbol: "♍", color: "#8CFF4A" },
  Libra: { symbol: "♎", color: "#D4A4FF" },
  Scorpio: { symbol: "♏", color: "#FF4A8C" },
  Sagittarius: { symbol: "♐", color: "#FF884A" },
  Capricorn: { symbol: "♑", color: "#8CAAFF" },
  Aquarius: { symbol: "♒", color: "#4AFFEE" },
  Pisces: { symbol: "♓", color: "#AA88FF" },
};

const DOMAIN_META = {
  love: { label: "Love & Relationships", color: "#FF6B8A" },
  career: { label: "Career & Success", color: "#4AD4FF" },
  health: { label: "Health & Vitality", color: "#4AFF8C" },
  wealth: { label: "Wealth & Finance", color: "#C8973A" },
};

const REMEDY_COLORS = {
  Gemstone: "#FF6B8A",
  "Lucky Color": "#FFB84A",
  Fasting: "#4AFF8C",
  Mantra: "#C8973A",
};

/**
 * Calls the AI once to generate a full day's data for a user.
 * Returns parsed JSON or throws.
 */
async function callAiForDashboard(user, date) {
  const birthDateStr = user.birthDate
    ? new Date(user.birthDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : "Unknown";

  const sign = user.sign || deriveSign(user.birthDate) || "Leo";
  const lagna = user.lagna || "Unknown";
  const currentYear = new Date().getFullYear();

  const prompt = `You are an expert Vedic astrology engine. Respond ONLY with valid JSON — no markdown, no explanation.

User profile:
Name: ${user.name}
Gender: ${user.gender ?? "Not specified"}
Born: ${birthDateStr} at ${user.birthTime ?? "unknown time"}
City: ${user.birthCity ?? "Unknown"}
Sun Sign: ${sign}
Lagna (Ascendant): ${lagna}
Today: ${date}

Generate a personalised daily Vedic astrology reading based ONLY on this user's birth data and today's date.
Keep ALL string values short (under 15 words each). Do NOT add details or long descriptions.

Return EXACTLY this JSON structure:
{
  "horoscope": {
    "summary": "one short sentence about today for ${sign}",
    "luckyNumber": <1-9 integer>,
    "luckyColor": { "name": "color name", "hex": "#RRGGBB", "emoji": "single emoji" },
    "luckyTime": "HH:MM – HH:MM AM/PM",
    "energy": <0-100 integer>,
    "mood": "single mood word or short phrase",
    "moonPhase": "phase name",
    "moonEmoji": "single moon emoji",
    "planets": [
      { "name": "Sun",     "symbol": "☉", "position": "<zodiac sign>", "house": "<Nth>",  "influence": "positive|neutral|caution" },
      { "name": "Moon",    "symbol": "☾", "position": "<zodiac sign>", "house": "<Nth>",  "influence": "positive|neutral|caution" },
      { "name": "Mercury", "symbol": "☿", "position": "<zodiac sign>", "house": "<Nth>",  "influence": "positive|neutral|caution" },
      { "name": "Venus",   "symbol": "♀", "position": "<zodiac sign>", "house": "<Nth>",  "influence": "positive|neutral|caution" },
      { "name": "Mars",    "symbol": "♂", "position": "<zodiac sign>", "house": "<Nth>",  "influence": "positive|neutral|caution" },
      { "name": "Jupiter", "symbol": "♃", "position": "<zodiac sign>", "house": "<Nth>",  "influence": "positive|neutral|caution" },
      { "name": "Saturn",  "symbol": "♄", "position": "<zodiac sign>", "house": "<Nth>",  "influence": "positive|neutral|caution" },
      { "name": "Rahu",    "symbol": "☊", "position": "<zodiac sign>", "house": "<Nth>",  "influence": "positive|neutral|caution" },
      { "name": "Ketu",    "symbol": "☋", "position": "<zodiac sign>", "house": "<Nth>",  "influence": "positive|neutral|caution" }
    ]
  },
  "report": {
    "cosmicScore": <0-100 integer>,
    "cosmicLabel": "Highly Favourable|Favourable|Moderate|Challenging",
    "headline": "short bold headline about today",
    "domains": [
      {
        "id": "love",
        "score": <0-100>,
        "summary": "one short planet influence note",
        "subScores": [
          { "label": "Romance",   "value": <0-100> },
          { "label": "Harmony",   "value": <0-100> },
          { "label": "Intimacy",  "value": <0-100> }
        ],
        "tips": ["short tip 1", "short tip 2", "short tip 3"]
      },
      {
        "id": "career",
        "score": <0-100>,
        "summary": "one short planet influence note",
        "subScores": [
          { "label": "Focus",     "value": <0-100> },
          { "label": "Influence", "value": <0-100> },
          { "label": "Progress",  "value": <0-100> }
        ],
        "tips": ["short tip 1", "short tip 2", "short tip 3"]
      },
      {
        "id": "health",
        "score": <0-100>,
        "summary": "one short planet influence note",
        "subScores": [
          { "label": "Physical",  "value": <0-100> },
          { "label": "Mental",    "value": <0-100> },
          { "label": "Immunity",  "value": <0-100> }
        ],
        "tips": ["short tip 1", "short tip 2", "short tip 3"]
      },
      {
        "id": "wealth",
        "score": <0-100>,
        "summary": "one short planet influence note",
        "subScores": [
          { "label": "Income",     "value": <0-100> },
          { "label": "Savings",    "value": <0-100> },
          { "label": "Investment", "value": <0-100> }
        ],
        "tips": ["short tip 1", "short tip 2", "short tip 3"]
      }
    ],
    "auspiciousSlots": [
      { "time": "HH:MM – HH:MM AM/PM", "type": "best",  "activity": "short activity description" },
      { "time": "HH:MM – HH:MM AM/PM", "type": "best",  "activity": "short activity description" },
      { "time": "HH:MM – HH:MM AM/PM", "type": "good",  "activity": "short activity description" },
      { "time": "HH:MM – HH:MM AM/PM", "type": "avoid", "activity": "short activity description (Rahu Kalam)" },
      { "time": "HH:MM – HH:MM AM/PM", "type": "good",  "activity": "short activity description" },
      { "time": "HH:MM – HH:MM AM/PM", "type": "avoid", "activity": "short activity description" }
    ],
    "remedies": [
      { "type": "Gemstone",     "value": "<gemstone for ${sign}>", "desc": "short instruction", "color": "#FF6B8A", "fullMantra": null },
      { "type": "Lucky Color",  "value": "<lucky color today>",    "desc": "short instruction", "color": "#FFB84A", "fullMantra": null },
      { "type": "Fasting",      "value": "<day of week>",          "desc": "deity associated", "color": "#4AFF8C", "fullMantra": null },
      { "type": "Mantra",       "value": "<mantra name>",          "desc": "short benefit",    "color": "#C8973A", "fullMantra": "<Devanagari text>" }
    ],
    "lifeTimeline": [
      { "year": "${currentYear}–${(currentYear + 1).toString().slice(2)}",       "label": "short key theme for this year" },
      { "year": "${currentYear + 1}–${(currentYear + 2).toString().slice(2)}",     "label": "short key theme" },
      { "year": "${currentYear + 2}–${(currentYear + 3).toString().slice(2)}",     "label": "short key theme" },
      { "year": "${currentYear + 3}+",                                           "label": "short long-term outlook" }
    ]
  }
}`;

  const response = await ai.chat.completions.create({
    model: process.env.GEMINI_MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const raw = response.choices[0]?.message?.content?.trim() || "";

  // Strip any accidental markdown fences
  const jsonStr = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();

  return JSON.parse(jsonStr);
}

/**
 * Generates and caches all dashboard data for a user for today.
 * Safe to call multiple times — uses upsert (won't duplicate).
 * Returns { horoscopeDoc, reportDoc } or throws.
 */
async function generateDashboardData(user, date) {
  // Derive sign if not stored
  const sign = user.sign || deriveSign(user.birthDate) || "Leo";

  // ── 1. Check if data already exists for today ────────────────────────────
  const [existingHoro, existingReport] = await Promise.all([
    DailyHoroscope.findOne({ date, sign }),
    Report.findOne({ userId: user._id, reportType: "daily", periodKey: date }),
  ]);

  if (existingHoro && existingReport) {
    return { horoscopeDoc: existingHoro, reportDoc: existingReport };
  }

  // ── 2. Call AI (one call for everything) ─────────────────────────────────
  const aiData = await callAiForDashboard(user, date);

  const { horoscope: h, report: r } = aiData;

  // ── 3. Save horoscope (shared by sign — upsert) ──────────────────────────
  const horoscopeDoc = await DailyHoroscope.findOneAndUpdate(
    { date, sign },
    {
      $setOnInsert: {
        date,
        sign,
        summary: h.summary || "",
        luckyNumber: h.luckyNumber || 7,
        luckyColor: h.luckyColor || { name: "Gold", hex: "#C8973A", emoji: "🟡" },
        luckyTime: h.luckyTime || "06:00 – 07:30 AM",
        energy: h.energy ?? 70,
        mood: h.mood || "Balanced",
        moonPhase: h.moonPhase || "Waxing",
        moonEmoji: h.moonEmoji || "🌖",
        planets: h.planets || [],
      },
    },
    { upsert: true, new: true }
  );

  // ── 4. Save personalised report (per user — upsert) ──────────────────────
  const domainsWithMeta = (r.domains || []).map((d) => ({
    id: d.id,
    label: DOMAIN_META[d.id]?.label || d.id,
    color: DOMAIN_META[d.id]?.color || "#888888",
    score: d.score || 70,
    summary: d.summary || "",
    detail: d.summary || "",   // keep detail same as summary (no long text)
    subScores: d.subScores || [],
    tips: d.tips || [],
  }));

  const remediesWithColor = (r.remedies || []).map((rem) => ({
    type: rem.type,
    value: rem.value,
    desc: rem.desc,
    color: REMEDY_COLORS[rem.type] || rem.color || "#888888",
    fullMantra: rem.fullMantra || null,
  }));

  const reportDoc = await Report.findOneAndUpdate(
    { userId: user._id, reportType: "daily", periodKey: date },
    {
      $setOnInsert: {
        userId: user._id,
        reportType: "daily",
        periodKey: date,
        cosmicScore: r.cosmicScore ?? 70,
        cosmicLabel: r.cosmicLabel || "Moderate",
        headline: r.headline || "",
        summary: r.headline || "",
        domains: domainsWithMeta,
        planets: h.planets || [],
        auspiciousSlots: r.auspiciousSlots || [],
        remedies: remediesWithColor,
        yearlyForecast: r.lifeTimeline || [],
      },
    },
    { upsert: true, new: true }
  );

  return { horoscopeDoc, reportDoc };
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Body: { email, password, name, birthDate, birthTime, birthCity, lagna, longitude, latitude, timeZone, gender }
 * Returns: { token, user }
 */
export const register = async (req, res) => {
  try {
    const { email, password, name, birthDate, birthTime, birthCity, lagna, longitude, latitude, timeZone, gender } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    // Derive sign from birthDate
    const sign = birthDate ? deriveSign(new Date(birthDate)) : null;
    const signMeta = sign ? (SIGN_META[sign] || {}) : {};

    const user = await User.create({
      email,
      password: hashPassword,
      name,
      birthDate,
      birthTime,
      birthCity,
      longitude,
      latitude,
      timeZone,
      gender,
      sign,
      signSymbol: signMeta.symbol || null,
      signColor: signMeta.color || null,
      lagna: lagna || null,
    });

    const token = generateToken(user._id);
    const { password: _, ...userWithoutPassword } = user.toObject();

    // Trigger background data generation (fire-and-forget)
    generateDashboardData(user, todayKey()).catch((err) =>
      console.error("register — background generation error:", err)
    );

    return res.status(201).json({ message: "User created successfully", user: userWithoutPassword, token });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * POST /api/auth/login
 * Body: { email, password }
 * Returns: { token, user }
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

    // Respond immediately — don't block on generation
    res.status(200).json({ message: "Login successful", user: userWithoutPassword, token });

    // Trigger background AI data generation for today (fire-and-forget)
    generateDashboardData(user, todayKey()).catch((err) =>
      console.error("login — background generation error:", err)
    );

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message || "Internal server error" });
  }
};

/**
 * POST /api/auth/logout
 */
export const logout = (req, res) => {
  res.status(200).json({ message: 'Logged out' });
};

// ─────────────────────────────────────────────────────────────────────────────
// USER ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/user/profile
 * Returns the authenticated user's full profile.
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const sign = user.sign || deriveSign(user.birthDate) || "Leo";
    const signMeta = SIGN_META[sign] || {};

    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      sign,
      signSymbol: user.signSymbol || signMeta.symbol || null,
      signColor: user.signColor || signMeta.color || null,
      lagna: user.lagna || null,
      birthDate: user.birthDateFormatted || null,
      birthCity: user.birthCity || null,
      avatarUrl: user.avatarUrl || null,
      isPremium: user.isPremium || false,
    });
  } catch (error) {
    console.error("getProfile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * PUT /api/user/profile
 */
export const updateProfile = async (req, res) => {
  try {
    const { name, birthCity, avatarUrl } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { $set: { name, birthCity, avatarUrl } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ message: "Profile updated", user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD ENDPOINTS  (single-call, cache-first)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/dashboard/home
 * Returns everything the Home tab needs in one response.
 * Cache-first: if today's data exists in DB, returns it instantly.
 * If not, generates via AI then returns.
 */
export const getHomeDashboard = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const date = todayKey();
    const sign = user.sign || deriveSign(user.birthDate) || "Leo";

    // Try cache first
    let horoDoc = await DailyHoroscope.findOne({ date, sign });

    if (!horoDoc) {
      // Generate (and cache) in the background — don't block the request
      generateDashboardData(user, date).catch(err => 
        console.error("Background dashboard generation failed:", err)
      );
      return res.status(202).json({ pending: true, message: "Generating dashboard data..." });
    }

    const signMeta = SIGN_META[sign] || {};

    return res.json({
      date,
      sign,
      signSymbol: user.signSymbol || signMeta.symbol || null,
      signColor: user.signColor || signMeta.color || null,
      summary: horoDoc.summary,
      luckyNumber: horoDoc.luckyNumber,
      luckyColor: horoDoc.luckyColor,
      luckyTime: horoDoc.luckyTime,
      energy: horoDoc.energy,
      mood: horoDoc.mood,
      moonPhase: horoDoc.moonPhase,
      moonEmoji: horoDoc.moonEmoji,
      planets: horoDoc.planets,
    });
  } catch (error) {
    console.error("getHomeDashboard error:", error);
    return res.status(500).json({ message: "Failed to load home dashboard", error: error.message });
  }
};

/**
 * GET /api/dashboard/reports
 * Returns everything the Reports tab needs in one response.
 * Cache-first: if today's report exists, returns it instantly.
 */
export const getReportsDashboard = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const date = todayKey();
    const sign = user.sign || deriveSign(user.birthDate) || "Leo";

    // Try cache first
    let reportDoc = await Report.findOne({ userId, reportType: "daily", periodKey: date });

    if (!reportDoc) {
      // Generate (and cache) in the background — don't block the request
      generateDashboardData(user, date).catch(err => 
        console.error("Background dashboard generation failed:", err)
      );
      return res.status(202).json({ pending: true, message: "Generating report data..." });
    }

    const signMeta = SIGN_META[sign] || {};

    return res.json({
      date,
      // User profile data (for the header + profile strip)
      userProfile: {
        name: user.name,
        sign,
        signSymbol: user.signSymbol || signMeta.symbol || null,
        signColor: user.signColor || signMeta.color || null,
        lagna: user.lagna || null,
        birthDate: user.birthDateFormatted || null,
        birthCity: user.birthCity || null,
      },
      // Report data
      cosmicScore: reportDoc.cosmicScore,
      cosmicLabel: reportDoc.cosmicLabel,
      headline: reportDoc.headline,
      summary: reportDoc.summary,
      domains: reportDoc.domains,
      planets: reportDoc.planets,
      auspiciousSlots: reportDoc.auspiciousSlots,
      remedies: reportDoc.remedies,
      lifeTimeline: reportDoc.yearlyForecast,
    });
  } catch (error) {
    console.error("getReportsDashboard error:", error);
    return res.status(500).json({ message: "Failed to load reports dashboard", error: error.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// LEGACY HOROSCOPE ENDPOINTS (kept for backwards compat, delegate to dashboard)
// ─────────────────────────────────────────────────────────────────────────────

export const getHoroscope = async (req, res) => {
  return getHomeDashboard(req, res);
};

export const getAuspiciousTimes = async (req, res) => {
  try {
    const userId = req.userId || req.query.userId;
    if (!userId) return res.status(400).json({ message: "userId required" });
    const date = req.query.date || todayKey();
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const sign = user.sign || deriveSign(user.birthDate) || "Leo";
    let reportDoc = await Report.findOne({ userId, reportType: "daily", periodKey: date });
    if (!reportDoc) {
      const result = await generateDashboardData(user, date);
      reportDoc = result.reportDoc;
    }
    return res.json(reportDoc.auspiciousSlots || []);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// REPORTS ENDPOINTS (legacy stubs → delegate)
// ─────────────────────────────────────────────────────────────────────────────

export const getDailyReports = (req, res) => getReportsDashboard(req, res);
export const getDomainReports = (req, res) => getReportsDashboard(req, res);
export const getPlanetTransits = (req, res) => getHomeDashboard(req, res);
export const getAuspiciousTimingsReport = (req, res) => getAuspiciousTimes(req, res);

export const getRemedies = async (req, res) => {
  try {
    const userId = req.userId;
    const date = req.query.date || todayKey();
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    let reportDoc = await Report.findOne({ userId, reportType: "daily", periodKey: date });
    if (!reportDoc) {
      const result = await generateDashboardData(user, date);
      reportDoc = result.reportDoc;
    }
    return res.json(reportDoc.remedies || []);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getYearlyReports = async (req, res) => {
  try {
    const userId = req.userId;
    const year = req.query.year || new Date().getFullYear().toString();
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    let reportDoc = await Report.findOne({ userId, reportType: "daily", periodKey: todayKey() });
    if (!reportDoc) {
      const result = await generateDashboardData(user, todayKey());
      reportDoc = result.reportDoc;
    }
    return res.json(reportDoc.yearlyForecast || []);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getWeeklyReports = (req, res) => res.status(501).json({ message: "Premium feature" });
export const getMonthlyReports = (req, res) => res.status(501).json({ message: "Premium feature" });

export const shareReport = async (req, res) => {
  try {
    const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
    return res.json({
      shareText: `✦ My Cosmiq Daily Report — ${today}\n\nDownload Cosmiq for your personalised astrology reports.`,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// CHAT ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Builds a concise natal-chart summary string to inject into the AI system prompt.
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

  let reply;
  try {
    const response = await ai.chat.completions.create({
      model: process.env.GEMINI_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message.trim() },
      ],
    });
    reply = response.choices[0]?.message?.content?.trim() || "";
  } catch (error) {
    console.error("chatMessage — AI error:", error);
    return res.status(500).json({ error: "Failed to generate AI response" });
  }

  let conv;
  try {
    if (conversationId) {
      conv = await ChatConversation.findOne({ _id: conversationId, userId });
    }
    if (!conv) {
      conv = await ChatConversation.create({
        userId,
        title: message.trim().slice(0, 60),
        natalChartSnapshot: {
          sign: user.sign ?? null,
          lagna: user.lagna ?? null,
          birthDate: user.birthDate ? new Date(user.birthDate).toISOString().slice(0, 10) : null,
          birthCity: user.birthCity ?? null,
        },
      });
    }
  } catch (error) {
    console.error("chatMessage — conversation create error:", error);
  }

  const resolvedConvId = conv?._id?.toString() ?? null;
  res.json({ reply, conversationId: resolvedConvId, isVoice: false });

  if (conv) {
    const now = new Date();
    ChatConversation.findByIdAndUpdate(
      conv._id,
      {
        $push: {
          messages: {
            $each: [
              { role: "user", text: message.trim(), timestamp: now },
              { role: "ai", text: reply, timestamp: new Date(now.getTime() + 1) },
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
 * GET /api/chat/history
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

    const limitNum = Math.min(Number(limit) || 20, 100);
    const offsetNum = Number(offset) || 0;

    const total = conv.messages.length;
    const sliced = conv.messages.slice(offsetNum, offsetNum + limitNum);

    const messages = sliced.map((m) => ({
      id: m._id.toString(),
      role: m.role,
      text: m.text,
      isVoice: m.isVoice,
      duration: m.duration ?? undefined,
      timestamp: m.timestamp,
    }));

    return res.json({ conversationId, total, offset: offsetNum, limit: limitNum, messages });
  } catch (error) {
    console.error("chatHistory error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// ASTROLOGERS / NOTIFICATIONS / STARBASE (stubs — not in scope)
// ─────────────────────────────────────────────────────────────────────────────

export const getAstrologers = (req, res) => res.status(501).json({ message: "Not implemented" });
export const getAstrologerById = (req, res) => res.status(501).json({ message: "Not implemented" });
export const getNotifications = (req, res) => res.status(501).json({ message: "Not implemented" });
export const markNotificationAsRead = (req, res) => res.status(501).json({ message: "Not implemented" });
export const getStarbaseArticles = (req, res) => res.status(501).json({ message: "Not implemented" });
export const getStarbaseArticleById = (req, res) => res.status(501).json({ message: "Not implemented" });