import mongoose from "mongoose";

// ─── ChatMessage sub-schema ───────────────────────────────────────────────────
/**
 * ChatMessageSchema
 * A single message exchanged between the user and Cosmiq AI.
 * Stored embedded in ChatConversation for efficient retrieval of full threads.
 * Large histories are paginated by the API layer (limit + offset).
 *
 * Shape matches the frontend ChatMessage type:
 * { id, role, text, timestamp, isVoice, duration? }
 */
const chatMessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      enum: ["user", "ai"],
    },
    /** The message text content displayed in ChatBubble */
    text: {
      type: String,
      required: true,
    },
    /**
     * True when this was a voice message (VoiceMessageBubble).
     * The text field holds the transcription in that case.
     */
    isVoice: {
      type: Boolean,
      default: false,
    },
    /** Duration in seconds — only present for voice messages */
    duration: {
      type: Number,
      default: null,
    },
    /** ISO 8601 timestamp shown alongside each bubble */
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false, // timestamp is managed manually above
  }
);

// ─── Main schema ──────────────────────────────────────────────────────────────

/**
 * ChatConversation
 *
 * One document per conversation thread between a user and Cosmiq AI.
 * A user can have multiple conversations (e.g. different sessions / topics).
 *
 * Powers:
 *  - POST /api/chat/message  → creates/updates a conversation + appends message
 *  - GET  /api/chat/history  → returns paginated messages for a conversationId
 */
const chatConversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /**
     * Short descriptive title auto-generated from the first user message.
     * Not exposed to the frontend yet but useful for future conversation list UI.
     */
    title: {
      type: String,
      default: "New conversation",
      trim: true,
    },

    /** All messages in chronological order */
    messages: {
      type: [chatMessageSchema],
      default: [],
    },

    /**
     * Snapshot of the user's natal chart context that was injected into the
     * LLM system prompt for this conversation. Stored so that old conversations
     * remain consistent even if the user edits their profile.
     */
    natalChartSnapshot: {
      sign:     { type: String, default: null },
      lagna:    { type: String, default: null },
      birthDate: { type: String, default: null },
      birthCity: { type: String, default: null },
    },

    /** Total message count — cached for quick pagination without aggregation */
    messageCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // createdAt = conversation start, updatedAt = last message
  }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
chatConversationSchema.index({ userId: 1, updatedAt: -1 }); // list user's recent conversations
chatConversationSchema.index({ userId: 1 });

const ChatConversation = mongoose.model("ChatConversation", chatConversationSchema);

export default ChatConversation;
