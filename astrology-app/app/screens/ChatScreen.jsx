import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CosmicBackground from '../../components/ui/Cosmicbackground';
import ChatHeader from '../../components/chat/ChatHeader';
import ChatBubble from '../../components/chat/ChatBubble';
import VoiceMessageBubble from '../../components/chat/VoiceMessageBubble';
import AITypingIndicator from '../../components/chat/AITypingIndicator';
import ChatInputBar from '../../components/chat/ChatInputBar';
import SuggestionChips from '../../components/chat/SuggestionChips';
import { useChat } from '../../hooks/useChat';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

// ── Date separator ────────────────────────────────────────────────────────
function DateSeparator({ label }) {
  return (
    <View style={sepStyles.row}>
      <View style={sepStyles.line} />
      <Text style={sepStyles.text}>{label}</Text>
      <View style={sepStyles.line} />
    </View>
  );
}

const sepStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 16,
    paddingHorizontal: Layout.padding,
  },
  line: { flex: 1, height: 1, backgroundColor: Colors.border },
  text: { fontSize: 11, color: Colors.textMuted, fontWeight: '500', letterSpacing: 0.5 },
});

// ── Demo quick-fill button (shows birth detail scenario) ──────────────────
function DemoBar({ onDemoPress }) {
  return (
    <View style={demoStyles.bar}>
      <Text style={demoStyles.label}>💡 Demo:</Text>
      <TouchableOpacity onPress={onDemoPress} style={demoStyles.btn} activeOpacity={0.75}>
        <Text style={demoStyles.btnText}>Send birth details + voice response</Text>
      </TouchableOpacity>
    </View>
  );
}

const demoStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: Layout.padding,
    paddingVertical: 8,
    backgroundColor: 'rgba(107,78,255,0.08)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(107,78,255,0.15)',
  },
  label: { fontSize: 11, color: Colors.textMuted },
  btn: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(107,78,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(107,78,255,0.3)',
  },
  btnText: { fontSize: 11, color: Colors.glowPurple, fontWeight: '600' },
});

// ── Main Screen ───────────────────────────────────────────────────────────
export default function ChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef(null);

  const {
    messages,
    inputText,
    setInputText,
    isTyping,
    isRecording,
    showSuggestions,
    sendMessage,
    sendWithImages,
    toggleRecording,
  } = useChat();

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    const t = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 80);
    return () => clearTimeout(t);
  }, [messages, isTyping]);

  const handleBack = useCallback(() => router.back(), [router]);

  return (
    <CosmicBackground>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.kav}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <View style={[styles.container, { paddingTop: insets.top }]}>

          {/* ── Header ── */}
          <ChatHeader
            onBack={handleBack}
            onCall={() => { }}
            onVideo={() => { }}
            astrologerName="Cosmiq AI"
            astrologerSub="Vedic Astrology Guide"
            isOnline
          />

          {/* ── Message list ── */}
          <ScrollView
            ref={scrollRef}
            style={styles.messageScroll}
            contentContainerStyle={styles.messageContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            <DateSeparator label="Today" />

            {messages.map((msg) => {
              if (msg.type === 'voice') {
                return <VoiceMessageBubble key={msg.id} message={msg} />;
              }
              return <ChatBubble key={msg.id} message={msg} />;
            })}

            {isTyping && <AITypingIndicator />}

            {/* Bottom padding for last message */}
            <View style={styles.listBottom} />
          </ScrollView>


          {/* ── Suggestion chips ── */}
          <SuggestionChips
            visible={showSuggestions}
            onSelect={(text) => sendMessage(text)}
          />

          {/* ── Input bar ── */}
          <ChatInputBar
            value={inputText}
            onChangeText={setInputText}
            onSend={() => sendMessage()}
            onMicPress={toggleRecording}
            onAttachPress={() => { }}
            isRecording={isRecording}
            insetBottom={insets.bottom}
          />
        </View>
      </KeyboardAvoidingView>
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  kav: { flex: 1 },
  container: { flex: 1 },
  messageScroll: { flex: 1 },
  messageContent: {
    paddingTop: 8,
    paddingBottom: 12,
  },
  listBottom: { height: 8 },
});