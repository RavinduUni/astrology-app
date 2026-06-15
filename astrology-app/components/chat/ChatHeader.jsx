import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

export default function ChatHeader({ onBack, onCall, onVideo, astrologerName, astrologerSub, isOnline }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 80, friction: 12, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {/* Back button — rounded dark pill matching reference */}
      <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.75}>
        <Text style={styles.backIcon}>‹</Text>
      </TouchableOpacity>

      {/* Center — avatar + name + status */}
      <View style={styles.centerSection}>
        <View style={styles.avatarWrap}>
          {/* Glowing avatar circle */}
          <View style={styles.avatarOuter}>
            <View style={styles.avatarInner}>
              <Text style={styles.avatarEmoji}>🔮</Text>
            </View>
          </View>
          {/* Online indicator dot */}
          {isOnline && <View style={styles.onlineDot} />}
        </View>

        <View style={styles.nameBlock}>
          <Text style={styles.name}>{astrologerName || 'Cosmiq AI'}</Text>
          <View style={styles.statusRow}>
            {isOnline && <View style={styles.statusDot} />}
            <Text style={styles.statusText}>
              {isOnline ? 'Online • Astrology AI' : astrologerSub || 'AI Astrologer'}
            </Text>
          </View>
        </View>
      </View>

      {/* Right — call + video buttons */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={onCall} style={styles.actionBtn} activeOpacity={0.75}>
          <Text style={styles.actionIcon}>📞</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onVideo} style={styles.actionBtn} activeOpacity={0.75}>
          <Text style={styles.actionIcon}>🎥</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.padding,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: 'rgba(10,10,18,0.97)',
  },

  // Back button
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  backIcon: {
    fontSize: 24,
    color: Colors.white,
    lineHeight: 28,
    marginLeft: -2,
  },

  // Center
  centerSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarWrap: {
    position: 'relative',
    flexShrink: 0,
  },
  avatarOuter: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: Colors.borderGold,
    padding: 2,
    backgroundColor: 'rgba(200,151,58,0.1)',
  },
  avatarInner: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: Colors.indigo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 18 },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: '#4AFF8C',
    borderWidth: 2,
    borderColor: Colors.bgDeep,
  },

  nameBlock: { flex: 1 },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
    letterSpacing: 0.1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4AFF8C',
  },
  statusText: {
    fontSize: 11,
    color: Colors.textMuted,
  },

  // Action buttons
  actions: {
    flexDirection: 'row',
    gap: 8,
    flexShrink: 0,
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: { fontSize: 16 },
});