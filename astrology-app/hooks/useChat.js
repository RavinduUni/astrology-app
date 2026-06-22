import { useState, useRef, useCallback } from 'react';
import { sendChatMessage } from '../services/api';

const INITIAL_MESSAGES = [
  {
    id: 'init-1',
    role: 'ai',
    type: 'text',
    text: "Namaste ✨ I'm Cosmiq AI — your personal Vedic astrologer and cosmic guide.\n\nI can analyse your natal chart, reveal planetary transits, predict upcoming opportunities, and offer deep life guidance.\n\nHow can I illuminate your path today?",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'read',
  },
];

let msgIdCounter = 100;
const nextId = () => String(++msgIdCounter);

/**
 * useChat – powers ChatScreen.
 *
 * @param {string|null} [userId]        – optional, passed through for future use
 * @param {string|null} [conversationId] – optional initial conversation thread ID
 */
export function useChat(userId, conversationId) {
  const [messages, setMessages]               = useState(INITIAL_MESSAGES);
  const [inputText, setInputText]             = useState('');
  const [isTyping, setIsTyping]               = useState(false);
  const [isRecording, setIsRecording]         = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [error, setError]                     = useState(null);

  const convIdRef = useRef(conversationId ?? null);

  const addMessage = useCallback((msg) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  // ── Send a plain text message ───────────────────────────────────────────
  const sendMessage = useCallback(
    async (overrideText) => {
      const text = (overrideText ?? inputText).trim();
      if (!text) return;

      setInputText('');
      setShowSuggestions(false);
      setError(null);

      // Optimistically add the user bubble
      const userMsg = {
        id: nextId(),
        role: 'user',
        type: 'text',
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent',
      };
      addMessage(userMsg);
      setIsTyping(true);

      try {
        const result = await sendChatMessage({
          message: text,
          conversationId: convIdRef.current ?? undefined,
        });

        // Store the conversation ID returned by the server for follow-ups
        if (result.conversationId) convIdRef.current = result.conversationId;

        // Mark user message as delivered/read
        setMessages((prev) =>
          prev.map((m) => (m.id === userMsg.id ? { ...m, status: 'read' } : m))
        );

        // Add the AI reply bubble
        addMessage({
          id: nextId(),
          role: 'ai',
          type: result.isVoice ? 'voice' : 'text',
          text: result.reply,
          duration: result.isVoice ? result.duration : undefined,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      } catch (err) {
        setError(err.message);
        // Show a graceful error bubble instead of crashing
        addMessage({
          id: nextId(),
          role: 'ai',
          type: 'text',
          text: '✨ The stars are momentarily obscured. Please try again in a moment.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      } finally {
        setIsTyping(false);
      }
    },
    [inputText, addMessage]
  );

  // ── Send a message with attached images (stub — extend when needed) ─────
  const sendWithImages = useCallback(
    async (text, _images) => {
      // For now, fall back to plain text send; images can be handled later.
      return sendMessage(text);
    },
    [sendMessage]
  );

  // ── Toggle voice recording ───────────────────────────────────────────────
  const toggleRecording = useCallback(() => {
    setIsRecording((r) => !r);
  }, []);

  return {
    messages,
    inputText,
    setInputText,
    isTyping,
    isRecording,
    showSuggestions,
    error,
    sendMessage,
    sendWithImages,
    toggleRecording,
  };
}
