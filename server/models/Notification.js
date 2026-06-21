import mongoose from "mongoose";

/**
 * Notification
 *
 * One document per notification sent to a user.
 * Powers NotificationsScreen and the unread badge in the tab bar.
 *
 * Powers:
 *  - GET /api/notifications         → notification feed (paginated)
 *  - PUT /api/notifications/:id/read → mark as read
 */
const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /** Short heading shown in bold, e.g. "Your Daily Report is Ready ✦" */
    title: {
      type: String,
      required: true,
      trim: true,
    },

    /** Body text, e.g. "Cosmic Score 78 — Highly Favourable. Tap to read your full report." */
    body: {
      type: String,
      required: true,
    },

    /** Notification category used by the frontend to route deep-links */
    type: {
      type: String,
      required: true,
      enum: ["daily_report", "auspicious_alert", "chat_reply"],
    },

    /** Whether the user has tapped / opened this notification */
    isRead: {
      type: Boolean,
      default: false,
    },

    /**
     * Optional deep-link payload, e.g. { reportDate: "2026-06-15", reportType: "daily" }
     * Kept as Mixed so it can hold arbitrary data per notification type.
     */
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true, // createdAt is the notification send time
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
notificationSchema.index({ userId: 1, createdAt: -1 }); // latest-first feed
notificationSchema.index({ userId: 1, isRead: 1 });      // fast unread count

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
