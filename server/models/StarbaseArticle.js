import mongoose from "mongoose";

/**
 * StarbaseArticle
 *
 * Vedic astrology knowledge-base articles for the Starbase tab.
 * Articles are public (no auth required for the list) but premium ones require
 * a valid JWT + isPremium flag on the User.
 *
 * Powers:
 *  - GET /api/starbase/articles          → paginated list (summary fields)
 *  - GET /api/starbase/articles/:id      → full article body
 */
const starbaseArticleSchema = new mongoose.Schema(
  {
    // ── Content ──────────────────────────────────────────────────────────────
    title: {
      type: String,
      required: true,
      trim: true,
    },
    /** Short excerpt shown in the article card list */
    excerpt: {
      type: String,
      required: true,
    },
    /** Full markdown / rich-text body returned only on the detail endpoint */
    body: {
      type: String,
      required: true,
    },

    // ── Taxonomy ──────────────────────────────────────────────────────────────
    category: {
      type: String,
      required: true,
      enum: ["planets", "signs", "houses", "remedies"],
    },

    // ── Media ─────────────────────────────────────────────────────────────────
    imageUrl: {
      type: String,
      default: null,
    },

    // ── Access control ────────────────────────────────────────────────────────
    /** Premium articles require a paid subscription to read the full body */
    isPremium: {
      type: Boolean,
      default: false,
    },

    // ── Discovery ─────────────────────────────────────────────────────────────
    tags: {
      type: [String],
      default: [],
    },
    /** Manually controlled ordering weight (higher = shown first) */
    sortOrder: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
starbaseArticleSchema.index({ category: 1, sortOrder: -1 }); // filtered + sorted listing
starbaseArticleSchema.index({ isPublished: 1 });
starbaseArticleSchema.index({ tags: 1 });

const StarbaseArticle = mongoose.model("StarbaseArticle", starbaseArticleSchema);

export default StarbaseArticle;
