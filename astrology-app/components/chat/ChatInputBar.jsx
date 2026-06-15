import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Text,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import { FontAwesome5 } from '@expo/vector-icons';

export default function ChatInputBar({
  value,
  onChangeText,
  onSend,
  onMicPress,
  onAttachPress,
  isRecording,
  insetBottom,
}) {
  const sendScale = useRef(new Animated.Value(1)).current;
  const micPulse = useRef(new Animated.Value(1)).current;

  // Pulse animation while recording
  React.useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(micPulse, { toValue: 1.18, duration: 600, useNativeDriver: true }),
          Animated.timing(micPulse, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();
    } else {
      micPulse.setValue(1);
    }
  }, [isRecording]);

  const onSendPressIn = () => {
    Animated.spring(sendScale, { toValue: 0.88, useNativeDriver: true, speed: 50 }).start();
  };
  const onSendPressOut = () => {
    Animated.spring(sendScale, { toValue: 1, useNativeDriver: true, speed: 30 }).start();
  };

  const hasText = value.trim().length > 0;

  return (
    <View style={[styles.container, { paddingBottom: insetBottom + 10 }]}>
      {/* Cosmic attach / menu button */}
      <TouchableOpacity
        onPress={onAttachPress}
        style={styles.cosmicBtn}
        activeOpacity={0.75}
      >
        <Text style={styles.cosmicIcon}>✦</Text>
      </TouchableOpacity>

      {/* Text input field */}
      <TextInput
        style={styles.input}
        placeholder="Your message..."
        placeholderTextColor={Colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        multiline
        maxLength={1000}
        selectionColor={Colors.gold}
        returnKeyType="default"
        blurOnSubmit={false}
      />

      {/* Right action — mic (idle) or send (when text exists) */}
      {hasText ? (
        <Animated.View style={{ transform: [{ scale: sendScale }] }}>
          <TouchableOpacity
            onPress={onSend}
            onPressIn={onSendPressIn}
            onPressOut={onSendPressOut}
            style={styles.sendBtn}
            activeOpacity={1}
          >
            <FontAwesome5 name="paper-plane" size={14} color={Colors.white} />
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <Animated.View style={{ transform: [{ scale: micPulse }] }}>
          <TouchableOpacity
            onPress={onMicPress}
            style={[styles.micBtn, isRecording && styles.micBtnRecording]}
            activeOpacity={0.75}
          >
            <FontAwesome5 name="microphone" size={14} color={Colors.white} />
            {isRecording && <View style={styles.recordingDot} />}
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: Layout.padding,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: 'rgba(10,10,18,0.98)',
  },

  // Cosmic / attach button
  cosmicBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginBottom: 1,
  },
  cosmicIcon: {
    fontSize: 18,
    color: Colors.gold,
  },

  // Text input
  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 130,
    backgroundColor: Colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingTop: 11,
    paddingBottom: 11,
    fontSize: 14,
    color: Colors.white,
    lineHeight: 20,
  },

  // Send button
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginBottom: 1,
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.55,
    shadowRadius: 10,
    elevation: 10,
  },
  sendIcon: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: '800',
  },

  // Mic button
  micBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginBottom: 1,
    position: 'relative',
  },
  micBtnRecording: {
    backgroundColor: 'rgba(255,74,106,0.15)',
    borderColor: Colors.danger,
  },
  micIcon: { fontSize: 19 },
  recordingDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.danger,
  },
});