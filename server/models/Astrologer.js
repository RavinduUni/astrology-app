import mongoose from "mongoose";

// ─── Sub-schemas ──────────────────────────────────────────────────────────────

/**
 * AvailabilitySlotSchema
 * One day of the astrologer's weekly schedule.
 */
const availabilitySlotSchema = new mongoose.Schema(
  {
    day:   { type: String, required: true },  // e.g. "Monday"
    slots: { type: [String], default: [] },   // e.g. ["09:00", "11:00", "14:00"]
  },
  { _id: false }
);

/**
 * ReviewSchema
 * A single user review left on an astrologer's profile.
 */
const reviewSchema = new mongoose.Schema(
  {
    /** Display name of the reviewer (not linked to a User doc for privacy) */
    user:   { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text:   { type: String, required: true },
    date:   { type: String, required: true }, // "YYYY-MM-DD"
  },
  { _id: false }
);

// ─── Main schema ──────────────────────────────────────────────────────────────

/**
 * Astrologer
 *
 * Human astrologer profiles listed in the Astrologers tab (currently a
 * placeholder, scheduled for a future release).
 *
 * Powers:
 *  - GET /api/astrologers        → list (summary fields only)
 *  - GET /api/astrologers/:id    → full profile for detail/booking screen
 */
const astrologerSchema = new mongoose.Schema(
  {
    // ── Identity ──────────────────────────────────────────────────────────────
    name:      { type: String, required: true, trim: true },
    avatarUrl: { type: String, default: null },
    bio:       { type: String, default: null },

    // ── Professional details ──────────────────────────────────────────────────
    specialty: {
      type: String,
      required: true,
      enum: ["vedic", "tarot", "numerology", "nadi", "vastu"],
    },
    languages: {
      type: [String],
      default: [],
    }, // e.g. ["English", "Hindi", "Tamil"]

    // ── Rating & pricing ──────────────────────────────────────────────────────
    rating:       { type: Number, default: 0, min: 0, max: 5 },
    reviewCount:  { type: Number, default: 0, min: 0 },
    pricePerMin:  { type: Number, required: true, min: 0 }, // USD per minute

    // ── Live status ───────────────────────────────────────────────────────────
    isOnline: { type: Boolean, default: false },

    // ── Schedule ──────────────────────────────────────────────────────────────
    availability: {
      type: [availabilitySlotSchema],
      default: [],
    },

    // ── Reviews ───────────────────────────────────────────────────────────────
    reviews: {
      type: [reviewSchema],
      default: [],
    },

    // ── Visibility ────────────────────────────────────────────────────────────
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
astrologerSchema.index({ specialty: 1, rating: -1 }); // filtered + sorted list
astrologerSchema.index({ isOnline: 1 });
astrologerSchema.index({ isActive: 1 });

const Astrologer = mongoose.model("Astrologer", astrologerSchema);

export default Astrologer;
