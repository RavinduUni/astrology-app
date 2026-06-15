import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

// Generates random bar heights for the waveform visual
const NUM_BARS = 28;
const BAR_HEIGHTS = Array.from({ length: NUM_BARS }, (_, i) => {
  // Create a natural waveform-like pattern
  const base = Math.sin(i * 0.6) * 0.4 + 0.5;
  const noise = Math.random() * 0.4;
  return Math.max(0.15, Math.min(1, base + noise));
});

function Waveform({ isPlaying, progress }) {
  const animValues = useRef(
    BAR_HEIGHTS.map(() => new Animated.Value(1))
  ).current;

  useEffect(() => {
    if (!isPlaying) {
      animValues.forEach((v) => Animated.spring(v, { toValue: 1, useNativeDriver: true }).start());
      return;
    }

    // Animate bars when playing
    const animations = animValues.map((v, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 30),
          Animated.timing(v, {
            toValue: 0.3 + Math.random() * 0.7,
            duration: 200 + Math.random() * 200,
            useNativeDriver: true,
          }),
          Animated.timing(v, {
            toValue: 1,
            duration: 200 + Math.random() * 200,
            useNativeDriver: true,
          }),
        ])
      )
    );

    animations.forEach((a) => a.start());
    return () => animations.forEach((a) => a.stop());
  }, [isPlaying]);

  return (
    <View style={waveStyles.container}>
      {BAR_HEIGHTS.map((height, i) => {
        const isPlayed = progress > i / NUM_BARS;
        return (
          <Animated.View
            key={i}
            style={[
              waveStyles.bar,
              {
                height: height * 24,
                backgroundColor: isPlayed
                  ? 'rgba(255,255,255,0.9)'
                  : 'rgba(255,255,255,0.35)',
                transform: [{ scaleY: animValues[i] }],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const waveStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    height: 32,
    overflow: 'hidden',
  },
  bar: {
    width: 2.5,
    borderRadius: 2,
    minHeight: 3,
  },
});

export default function VoiceMessageBubble({ message }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 320, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 75, friction: 12, useNativeDriver: true }),
    ]).start();
  }, []);

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      clearInterval(progressRef.current);
    } else {
      setIsPlaying(true);
      const duration = message.duration || 35; // seconds
      const steps = 100;
      const interval = (duration * 1000) / steps;

      progressRef.current = setInterval(() => {
        setProgress((p) => {
          if (p >= 1) {
            clearInterval(progressRef.current);
            setIsPlaying(false);
            return 0;
          }
          return p + 1 / steps;
        });
      }, interval);
    }
  };

  useEffect(() => {
    return () => clearInterval(progressRef.current);
  }, []);

  const formatDuration = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <Animated.View
      style={[
        styles.row,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      {/* AI avatar */}
      <View style={styles.avatarWrap}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🔮</Text>
        </View>
      </View>

      {/* Voice bubble */}
      <View style={styles.bubble}>
        {/* Play/pause button */}
        <TouchableOpacity onPress={handlePlayPause} style={styles.playBtn} activeOpacity={0.8}>
          <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
        </TouchableOpacity>

        {/* Waveform */}
        <Waveform isPlaying={isPlaying} progress={progress} />

        {/* Duration */}
        <Text style={styles.duration}>
          {isPlaying
            ? formatDuration(Math.round((1 - progress) * (message.duration || 35)))
            : formatDuration(message.duration || 35)}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    marginBottom: 6,
    paddingHorizontal: Layout.padding,
  },
  avatarWrap: { flexShrink: 0, marginBottom: 2 },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.indigo,
    borderWidth: 1.5,
    borderColor: Colors.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 16 },

  bubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#2A2A8C',
    borderRadius: 20,
    borderBottomLeftRadius: 5,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flex: 1,
    maxWidth: '82%',
    shadowColor: '#2A2A8C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },

  playBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  playIcon: { fontSize: 14, color: Colors.white },

  duration: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    flexShrink: 0,
    minWidth: 28,
    textAlign: 'right',
  },
});