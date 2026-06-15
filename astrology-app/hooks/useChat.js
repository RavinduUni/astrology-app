import { useState, useRef, useCallback } from 'react';

const AI_RESPONSES = [
  {
    text: "Based on your natal chart, Venus in your 7th house creates a powerful potential for a meaningful relationship this season. The upcoming Jupiter transit in June amplifies romantic energies beautifully. ✨\n\nI'd be happy to look at your natal chart to give you some insights. Can you provide me with your birth date, time, and place?",
    delay: 1600,
  },
  {
    text: "Saturn in your 10th house is carefully building long-term career foundations right now. While progress may feel slow, every effort compounds powerfully.\n\nA significant breakthrough is signalled around Q3 2026 when Jupiter moves into a favourable trine with your natal Saturn. 🪐",
    delay: 1900,
  },
  {
    text: "Your next auspicious window begins around the 15th of this month when the Moon aligns with your natal Sun in Leo. Expect 3–4 days of elevated clarity, fortune, and confidence. 🌟\n\nPlan important decisions, meetings, or new ventures during this period.",
    delay: 1700,
  },
  {
    text: "Today, Jupiter trines your natal Moon, bringing emotional warmth and mental expansion. Mercury in your 3rd house sharpens communication — a wonderful day for important conversations and creative expression. ☿\n\nThat sounds accurate. The Moon-Saturn trine in your chart does indicate an innate need for stability and structure.",
    delay: 2100,
  },
  {
    text: "Your Lagna lord Mars is currently transiting the 11th house of gains and social connections. This is an excellent time to network, collaborate, and pursue group goals.\n\nCommunity and friendships formed now have long-term karmic significance for you. 🔴",
    delay: 1800,
  },
  {
    text: "The Moon is waxing in Scorpio today, activating your 4th house of home, family, and emotional roots. Deep feelings may surface — honour them rather than suppressing them.\n\nThis transit favours inner reflection, healing family dynamics, and spending time in comfortable, familiar environments. 🌖",
    delay: 2000,
  },
];

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

// Demo: after user sends their birth details, AI sends a voice message + image attachments
const DEMO_VOICE_TRIGGER_KEYWORDS = ['born', 'birth', 'chart', 'natal', '1990', 'pm', 'am'];

let msgIdCounter = 100;
const nextId = () => String(++msgIdCounter);

export function useChat() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const responseIndex = useRef(0);

  const addMessage = useCallback((msg) => {
    setMessages((prev) => [...prev, msg]);
  }, []);

  const sendMessage = useCallback(
    (overrideText) => {
      const text = overrideText ?? inputText.trim();
      if (!text) return;

      setInputText('');
      setShowSuggestions(false);

      // Add user message
      const userMsg = {
        id: nextId(),
        role: 'user',
        type: 'text',
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent',
      };
      addMessage(userMsg);

      // Check if it contains birth info — if so, respond with attachments + voice
      const hasBirthInfo = DEMO_VOICE_TRIGGER_KEYWORDS.some((kw) =>
        text.toLowerCase().includes(kw)
      );

      setIsTyping(true);

      // Pick AI response
      const responseData =
        AI_RESPONSES[responseIndex.current % AI_RESPONSES.length];
      responseIndex.current++;

      setTimeout(() => {
        setIsTyping(false);

        // Mark user message as read
        setMessages((prev) =>
          prev.map((m) => (m.id === userMsg.id ? { ...m, status: 'read' } : m))
        );

        if (hasBirthInfo) {
          // AI text first
          addMessage({
            id: nextId(),
            role: 'ai',
            type: 'text',
            text: "Great, give me a moment to pull up your chart.",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });

        } else {
          // Standard text response
          addMessage({
            id: nextId(),
            role: 'ai',
            type: 'text',
            text: responseData.text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
        }
      }, responseData.delay);
    },
    [inputText, addMessage]
  );

  // Send a message that includes image attachments (user sharing profile images)
  const sendWithImages = useCallback(() => {
    const userMsg = {
      id: nextId(),
      role: 'user',
      type: 'text',
      text: 'Sure! I was born on May 15, 1990, at 2:30 PM in San Francisco, California.',
      images: [
        { emoji: '🧑' },
        { emoji: '🧑' },
      ],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'read',
    };
    setMessages((prev) => [...prev, userMsg]);
    setShowSuggestions(false);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      addMessage({
        id: nextId(),
        role: 'ai',
        type: 'text',
        text: "Great, give me a moment to pull up your chart.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      setTimeout(() => {
        addMessage({
          id: nextId(),
          role: 'ai',
          type: 'voice',
          duration: 35,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        });
      }, 900);
    }, 1500);
  }, [addMessage]);

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
    sendMessage,
    sendWithImages,
    toggleRecording,
  };
}