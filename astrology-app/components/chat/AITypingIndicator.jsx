import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

export default function AITypingIndicator() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, { toValue: 1, duration: 250, useNativeDriver: true }).start();

    // Bounce dots
    const bounce = (dot, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.spring(dot, {
            toValue: -7,
            useNativeDriver: true,
            speed: 30,
            bounciness: 12,
          }),
          Animated.spring(dot, {
            toValue: 0,
            useNativeDriver: true,
            speed: 30,
            bounciness: 8,
          }),
          Animated.delay(400),
        ])
      );

    bounce(dot1, 0).start();
    bounce(dot2, 160).start();
    bounce(dot3, 320).start();
  }, []);

  return (
    <Animated.View style={[styles.row, { opacity: fadeAnim }]}>
      {/* Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>🔮</Text>
      </View>

      {/* Bubble */}
      <View style={styles.bubble}>
        <Text style={styles.typingLabel}>Cosmiq AI is thinking</Text>
        <View style={styles.dotsRow}>
          {[dot1, dot2, dot3].map((dot, i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                { transform: [{ translateY: dot }] },
                i === 1 && styles.dotMid,
              ]}
            />
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: Layout.padding,
    marginBottom: 10,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.indigo,
    borderWidth: 1.5,
    borderColor: Colors.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: { fontSize: 16 },

  bubble: {
    backgroundColor: '#2B3A8C',
    borderRadius: 20,
    borderBottomLeftRadius: 5,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#2B3A8C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  typingLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    fontStyle: 'italic',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  dotMid: {
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
});