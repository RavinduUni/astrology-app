import mongoose from "mongoose";

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

/**
 * LuckyColorSchema
 * Stored on the user so the frontend can quickly retrieve their zodiac-based
 * lucky colour without a separate lookup.
 */
const luckyColorSchema = new mongoose.Schema(
  {
    name:  { type: String, default: null }, // e.g. "Golden Amber"
    hex:   { type: String, default: null }, // e.g. "#C8973A"
    emoji: { type: String, default: null }, // e.g. "🟡"
  },
  { _id: false }
);

// ─── Main schema ─────────────────────────────────────────────────────────────

const userSchema = new mongoose.Schema(
  {
    // ── Identity ──────────────────────────────────────────────────────────────
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // never returned in queries by default
    },

    // ── Birth details (immutable after registration) ───────────────────────
    birthDate: {
      type: Date,
      required: true,
    },
    birthTime: {
      type: String,           // "HH:MM" – stored as string to avoid TZ drift
      required: true,
    },
    /** Human-readable city label sent from the frontend, e.g. "Colombo, Sri Lanka" */
    birthCity: {
      type: String,
      required: true,
      trim: true,
    },
    /** Geo-coordinates of the birth city (resolved server-side for calculations) */
    birthLat: {
      type: Number,
      default: null,
    },
    birthLng: {
      type: Number,
      default: null,
    },
    /** IANA timezone string, e.g. "Asia/Colombo" – resolved from birthCity */
    birthTimezone: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    // ── Derived zodiac data (computed server-side at registration) ─────────
    /** Western sun sign, e.g. "Leo" */
    sign: {
      type: String,
      required: true,
      enum: [
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
      ],
    },
    /** Unicode symbol for the sign, e.g. "♌" */
    signSymbol: {
      type: String,
      default: null,
    },
    /** Brand hex accent colour for the sign, e.g. "#FFB84A" */
    signColor: {
      type: String,
      default: null,
    },
    /**
     * Vedic ascendant (Lagna) chosen by the user during multi-step registration.
     * Immutable after registration.
     */
    lagna: {
      type: String,
      required: true,
      enum: [
        "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
        "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
      ],
    },

    // ── Editable profile fields ────────────────────────────────────────────
    avatarUrl: {
      type: String,
      default: null,
    },

    // ── Premium / subscription ────────────────────────────────────────────
    isPremium: {
      type: Boolean,
      default: false,
    },

    // ── Token blacklist for logout (optional: use a separate collection for scale) ──
    /**
     * Array of invalidated JWT `iat` timestamps. When a user logs out the
     * token's `iat` is pushed here; the middleware rejects any token whose
     * `iat` is in this list. Kept small by only storing the last 10 entries.
     */
    invalidatedTokenIats: {
      type: [Number],
      default: [],
      select: false,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
userSchema.index({ email: 1 });
userSchema.index({ sign: 1 });

// ── Virtual: formatted birthDate for API responses ────────────────────────────
// Returns "15 August 1995" — the shape the frontend expects.
userSchema.virtual("birthDateFormatted").get(function () {
  if (!this.birthDate) return null;
  return this.birthDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
});

const User = mongoose.model("User", userSchema);

export default User;