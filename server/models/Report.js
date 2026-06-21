import mongoose from "mongoose";

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

/**
 * SubScoreSchema
 * Three sub-dimension scores within each life domain.
 * e.g. Love → Romance / Harmony / Intimacy
 */
const subScoreSchema = new mongoose.Schema(
  {
    label: { type: String, required: true }, // e.g. "Romance"
    value: { type: Number, required: true, min: 0, max: 100 },
  },
  { _id: false }
);

/**
 * DomainReportSchema
 * One entry for each of the four life domains:
 * love | career | health | wealth
 * Powers DomainExpandCard in the Reports tab.
 */
const domainReportSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      enum: ["love", "career", "health", "wealth"],
    },
    label:  { type: String, required: true },            // e.g. "Love & Relationships"
    color:  { type: String, required: true },            // hex, e.g. "#FF6B8A"
    score:  { type: Number, required: true, min: 0, max: 100 },
    summary:    { type: String, required: true },        // one-line planet note
    detail:     { type: String, required: true },        // full paragraph for expanded view
    subScores:  { type: [subScoreSchema], default: [] },
    tips:       { type: [String], default: [] },         // 3 actionable tips
  },
  { _id: false }
);

/**
 * AuspiciousSlotSchema
 * A single time window on the auspicious timeline.
 * Powers AuspiciousTimeline (Home) and AuspiciousTimingsCard (Reports).
 */
const auspiciousSlotSchema = new mongoose.Schema(
  {
    time:     { type: String, required: true },          // e.g. "06:00 – 07:30 AM"
    type:     { type: String, required: true, enum: ["best", "good", "avoid"] },
    activity: { type: String, required: true },
  },
  { _id: false }
);

/**
 * RemedySchema
 * A single Vedic remedy for the day.
 * Powers RemediesCard in the Reports tab.
 */
const remedySchema = new mongoose.Schema(
  {
    type:  {
      type: String,
      required: true,
      enum: ["Gemstone", "Lucky Color", "Fasting", "Mantra"],
    },
    value:      { type: String, required: true },        // e.g. "Ruby"
    desc:       { type: String, required: true },        // short instruction
    color:      { type: String, required: true },        // hex accent for UI
    fullMantra: { type: String, default: null },         // Devanagari, Mantra type only
  },
  { _id: false }
);

/**
 * YearForecastSchema
 * One entry in the multi-year life timeline.
 * Powers LifeTimelineCard (Reports – Yearly tab).
 */
const yearForecastSchema = new mongoose.Schema(
  {
    year:  { type: String, required: true },             // e.g. "2026–27"
    label: { type: String, required: true },             // paragraph description
  },
  { _id: false }
);

/**
 * DayHighlightSchema
 * Daily score/highlight within a weekly report.
 */
const dayHighlightSchema = new mongoose.Schema(
  {
    date:      { type: String, required: true },         // "YYYY-MM-DD"
    score:     { type: Number, required: true, min: 0, max: 100 },
    highlight: { type: String, required: true },
  },
  { _id: false }
);

/**
 * WeekHighlightSchema
 * Weekly summary within a monthly report.
 */
const weekHighlightSchema = new mongoose.Schema(
  {
    weekRange: { type: String, required: true },         // e.g. "1 – 7 Jun"
    score:     { type: Number, required: true, min: 0, max: 100 },
    highlight: { type: String, required: true },
  },
  { _id: false }
);

// ─── Main schema ──────────────────────────────────────────────────────────────

/**
 * Report
 *
 * One document per (userId, reportType, periodKey).
 *
 * periodKey values by reportType:
 *  - "daily"   → "YYYY-MM-DD"
 *  - "weekly"  → "YYYY-MM-DD" (week start date)
 *  - "monthly" → "YYYY-MM"
 *  - "yearly"  → "YYYY"
 *
 * Powers:
 *  - GET /api/reports/daily            → DailyScoreCard
 *  - GET /api/reports/domains          → DomainExpandCard (love, career, health, wealth)
 *  - GET /api/reports/planet-transits  → PlanetInfluenceStrip
 *  - GET /api/reports/auspicious-timings → AuspiciousTimingsCard
 *  - GET /api/reports/remedies         → RemediesCard
 *  - GET /api/reports/yearly           → LifeTimelineCard
 *  - GET /api/reports/weekly           → Weekly tab (premium)
 *  - GET /api/reports/monthly          → Monthly tab (premium)
 */
const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reportType: {
      type: String,
      required: true,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },
    /** Normalised period identifier — see mapping above */
    periodKey: {
      type: String,
      required: true,
    },

    // ── Daily fields (reportType = "daily") ──────────────────────────────────
    /** Overall cosmic alignment score (0–100) — DailyScoreCard */
    cosmicScore: { type: Number, min: 0, max: 100, default: null },
    /** Human-readable label, e.g. "Highly Favourable" */
    cosmicLabel: { type: String, default: null },
    /** Bold headline, e.g. "Jupiter amplifies your potential" */
    headline:    { type: String, default: null },
    /** 1–2 sentence summary for DailyScoreCard */
    summary:     { type: String, default: null },

    /** Four life domain readings — DomainExpandCard */
    domains: {
      type: [domainReportSchema],
      default: [],
    },

    /** 9 Vedic planet positions — PlanetInfluenceStrip */
    planets: {
      type: [
        new mongoose.Schema(
          {
            name:      { type: String, required: true },
            symbol:    { type: String, required: true },
            position:  { type: String, required: true },
            house:     { type: String, required: true },
            influence: { type: String, required: true, enum: ["positive", "neutral", "caution"] },
          },
          { _id: false }
        ),
      ],
      default: [],
    },

    /** Auspicious time slots — AuspiciousTimingsCard */
    auspiciousSlots: {
      type: [auspiciousSlotSchema],
      default: [],
    },

    /** Vedic remedies — RemediesCard */
    remedies: {
      type: [remedySchema],
      default: [],
    },

    // ── Yearly fields (reportType = "yearly") ────────────────────────────────
    /** Multi-year life path forecast — LifeTimelineCard */
    yearlyForecast: {
      type: [yearForecastSchema],
      default: [],
    },

    // ── Weekly fields (reportType = "weekly", premium) ───────────────────────
    weekRange:  { type: String, default: null },   // e.g. "16 – 22 June 2026"
    weeklyDays: {
      type: [dayHighlightSchema],
      default: [],
    },

    // ── Monthly fields (reportType = "monthly", premium) ─────────────────────
    month:        { type: String, default: null }, // e.g. "June 2026"
    monthlyWeeks: {
      type: [weekHighlightSchema],
      default: [],
    },

    // ── Premium gate ──────────────────────────────────────────────────────────
    isPremium: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
// Unique per user + report type + period so we never duplicate
reportSchema.index({ userId: 1, reportType: 1, periodKey: 1 }, { unique: true });
// Fast lookup for the share feature
reportSchema.index({ userId: 1, reportType: 1 });

const Report = mongoose.model("Report", reportSchema);

export default Report;
