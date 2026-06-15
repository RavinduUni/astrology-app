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

export function useChat(userId, conversationId) {
  const [messages, setMessages]         = useState(INITIAL_MESSAGES);
  const [inputText, setInputText]       = useState('');
  const [isTyping, setIsTyping]         = useState(false);
  const [isRecording, setIsRecording]   = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [error, setError]               = useState(null);

  const convIdRef = useRef(conversationId ?? null);

  const addMessage = useCallback((msg) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const sendMessage = useCallback(
    async (overrideText) => {
      const text = (overrideText ?? inputText).trim();
      if (!text) return;

      setInputText('');
      setShowSuggestions(false);
      setError(null);

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
          userId,
          message: text,
          conversationId: convIdRef.current ?? undefined,
        });

        if (result.conversationId) convIdRef.current = result.conversationId;

        setMessages((prev) =>
          prev.map((m) => (m.id === userMsg.id ? { ...m, status: 'read' } : m))
        );

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
          text: 'The stars are momentarily obscured. Please try again shortly.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      } finally {
        setIsTyping(false);
      }
    },
    [inputText, addMessage, userId]
  );

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
    toggleRecording,
  };
}
