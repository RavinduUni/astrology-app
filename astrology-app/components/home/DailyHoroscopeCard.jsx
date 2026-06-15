import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Layout } from '../../constants/Layout';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

function EnergyBar({ level, color }) {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: level,
      duration: 1200,
      delay: 400,
      useNativeDriver: false,
    }).start();
  }, [level]);

  const width = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={energyStyles.container}>
      <View style={energyStyles.track}>
        <Animated.View
          style={[energyStyles.fill, { width, backgroundColor: color }]}
        />
        {/* Glow dot at end */}
        <Animated.View
          style={[energyStyles.glowDot, { left: width, backgroundColor: color }]}
        />
      </View>
    </View>
  );
}

const energyStyles = StyleSheet.create({
  container: { flex: 1 },
  track: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 3,
    overflow: 'visible',
    position: 'relative',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
    opacity: 0.9,
  },
  glowDot: {
    position: 'absolute',
    top: -3,
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: -6,
  },
});

export default function DailyHoroscopeCard({ data, style }) {
  const scaleAnim = useRef(new Animated.Value(0.97)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, delay: 150, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 10, delay: 150, useNativeDriver: true }),
    ]).start();
  }, []);

  if (!data) return null;

  const { sign, zodiac, horoscope, energyLevel, mood } = data;
  const accentColor = zodiac.color;

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        style,
      ]}
    >
      {/* Card body */}
      <View style={[styles.card, { borderColor: `${accentColor}35` }]}>
        {/* Background glow orb */}
        <View style={[styles.bgGlow, { backgroundColor: `${accentColor}18` }]} />

        {/* Top row — sign info */}
        <View style={styles.topRow}>
          <View style={styles.signBlock}>
            <View style={[styles.symbolCircle, { borderColor: `${accentColor}55`, backgroundColor: `${accentColor}18` }]}>
              <Text style={[styles.symbolText, { color: accentColor }]}>{zodiac.symbol}</Text>
            </View>
            <View style={styles.signInfo}>
              <Text style={styles.signName}>{sign}</Text>
              <Text style={styles.signDates}>{zodiac.dates}</Text>
              <View style={[styles.elementPill, { backgroundColor: `${accentColor}22` }]}>
                <Text style={[styles.elementText, { color: accentColor }]}>
                  {zodiac.element} Sign
                </Text>
              </View>
            </View>
          </View>

          {/* Today label */}
          <View style={styles.todayBadge}>
            <Text style={styles.todayText}>Today</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: `${accentColor}25` }]} />

        {/* Horoscope title */}
        <View style={styles.titleRow}>
          <Text style={styles.cardTitle}>Daily Horoscope</Text>
          <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center', justifyContent: 'center' }} onPress={() => {router.push('/horoscope')}}>
            <Text style={styles.readMore}>Full Reading</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.textMuted} style={{ marginTop: 2 }} />
          </TouchableOpacity>
        </View>

        {/* Prediction text */}
        <Text style={styles.prediction} numberOfLines={4}>
          {horoscope}
        </Text>

        {/* Energy + mood row */}
        <View style={styles.statsRow}>
          {/* Energy */}
          <View style={styles.energySection}>
            <View style={styles.energyLabelRow}>
              <Text style={styles.statLabel}>Cosmic Energy</Text>
              <Text style={[styles.energyValue, { color: accentColor }]}>{energyLevel}%</Text>
            </View>
            <EnergyBar level={energyLevel} color={accentColor} />
          </View>

          {/* Mood */}
          <View style={[styles.moodPill, { backgroundColor: `${accentColor}18`, borderColor: `${accentColor}40` }]}>
            <Text style={styles.moodEmoji}>
              {mood === 'Optimistic' ? <Ionicons name="happy" size={18} color="white" /> : mood === 'Focused' ? <Ionicons name="refresh-circle" size={18} color="white" /> : mood === 'Creative' ? <Ionicons name="sparkles" size={18} color="white" /> : mood === 'Reflective' ? <Ionicons name="sunny" size={18} color="white" /> : mood === 'Energetic' ? <Ionicons name="flash" size={18} color="white" /> : <Ionicons name="thunderstorm" size={18} color="white" />}
            </Text>
            <Text style={[styles.moodText, { color: accentColor }]}>{mood}</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusXl,
    borderWidth: 1.5,
    padding: 20,
    overflow: 'hidden',
    ...Layout.shadow,
  },
  bgGlow: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
  },

  // Top row
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  signBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  symbolCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolText: {
    fontSize: 26,
  },
  signInfo: { gap: 2 },
  signName: {
    ...Typography.h4,
    fontSize: 18,
  },
  signDates: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  elementPill: {
    marginTop: 4,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  elementText: {
    fontSize: 10,
    fontWeight: '600',
  },
  todayBadge: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  todayText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },

  divider: {
    height: 1,
    marginBottom: 16,
  },

  // Content
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    ...Typography.h4,
    fontSize: 15,
    color: Colors.textGold,
  },
  readMore: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  prediction: {
    ...Typography.body,
    lineHeight: 22,
    marginBottom: 18,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  energySection: {
    flex: 1,
    gap: 8,
  },
  energyLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: "white",
    fontWeight: '500',
  },
  energyValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  moodPill: {
    borderRadius: Layout.radiusMd,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    gap: 4,
  },
  moodEmoji: { fontSize: 20 },
  moodText: {
    fontSize: 10,
    fontWeight: '700',
  },
});