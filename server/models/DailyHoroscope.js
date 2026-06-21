import mongoose from "mongoose";

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

/**
 * PlanetSchema
 * One of the 9 Vedic planets (Navagrahas) for the given day.
 * Powers PlanetaryOverview on the Home tab and PlanetInfluenceStrip in Reports.
 */
const planetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Rahu", "Ketu"],
    },
    symbol:    { type: String, required: true }, // e.g. "☉"
    position:  { type: String, required: true }, // zodiac sign the planet is transiting, e.g. "Gemini"
    house:     { type: String, required: true }, // e.g. "10th"
    influence: {
      type: String,
      required: true,
      enum: ["positive", "neutral", "caution"],
    },
  },
  { _id: false }
);

/**
 * LuckyColorSchema
 * The lucky colour shown in LuckyStatsRow.
 */
const luckyColorSchema = new mongoose.Schema(
  {
    name:  { type: String, required: true }, // e.g. "Golden Amber"
    hex:   { type: String, required: true }, // e.g. "#C8973A"
    emoji: { type: String, default: null },  // e.g. "🟡"
  },
  { _id: false }
);

// ─── Main schema ──────────────────────────────────────────────────────────────

/**
 * DailyHoroscope
 *
 * One document per (sign, date). If the backend generates readings per sign
 * (rather than per individual user), every Leo user on the same day sees the
 * same document — which keeps the collection small and makes caching easy.
 *
 * Powers:
 *  - GET /api/horoscope/daily        → DailyHoroscopeCard, LuckyStatsRow, PlanetaryOverview
 *  - GET /api/horoscope/auspicious-times → AuspiciousTimeline
 */
const dailyHoroscopeSchema = new mongoose.Schema(
  {
    /** ISO date string: "2026-06-15" */
    date: {
      type: String,
      required: true,
    },
    /** Zodiac sign this reading belongs to, e.g. "Leo" */
    sign: {
      type: String,
      required: true,
      enum: [
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
      ],
    },

    // ── Main reading ────────────────────────────────────────────────────────
    /** One-paragraph daily reading shown in DailyHoroscopeCard */
    summary: { type: String, required: true },

    // ── Lucky stats (LuckyStatsRow) ─────────────────────────────────────────
    luckyNumber: { type: Number, default: null },
    luckyColor:  { type: luckyColorSchema, default: null },
    luckyTime:   { type: String, default: null }, // e.g. "09:15 – 10:45 AM"

    // ── Energy & mood ────────────────────────────────────────────────────────
    energy:    { type: Number, min: 0, max: 100, default: null },
    mood:      { type: String, default: null }, // e.g. "Optimistic"

    // ── Moon ─────────────────────────────────────────────────────────────────
    moonPhase: { type: String, default: null }, // e.g. "Waxing Gibbous"
    moonEmoji: { type: String, default: null }, // e.g. "🌖"

    // ── Planetary positions (9 Vedic planets) ────────────────────────────────
    planets: {
      type: [planetSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// ── Compound index: one document per sign per date ────────────────────────────
dailyHoroscopeSchema.index({ date: 1, sign: 1 }, { unique: true });

const DailyHoroscope = mongoose.model("DailyHoroscope", dailyHoroscopeSchema);

export default DailyHoroscope;
