import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import { Typography } from '../../constants/Typography';

const SLOT_TYPES = {
  best:   { color: '#4AFF8C', bg: 'rgba(74,255,140,0.10)', label: 'Best Time',  icon: '✦' },
  good:   { color: '#FFB84A', bg: 'rgba(255,184,74,0.10)', label: 'Good',       icon: '◆' },
  avoid:  { color: '#FF4D6A', bg: 'rgba(255,77,106,0.10)', label: 'Avoid',      icon: '✕' },
};

function TimeSlot({ slot, index }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay: index * 80, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 350, delay: index * 80, useNativeDriver: true }),
    ]).start();
  }, []);

  const cfg = SLOT_TYPES[slot.type] || SLOT_TYPES.good;

  return (
    <Animated.View style={[styles.slotRow, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      {/* Timeline dot + line */}
      <View style={styles.dotCol}>
        <View style={[styles.dot, { backgroundColor: cfg.color }]} />
        {index < 5 && <View style={[styles.line, { backgroundColor: `${cfg.color}25` }]} />}
      </View>

      {/* Content */}
      <View style={[styles.slotCard, { borderColor: `${cfg.color}30`, backgroundColor: cfg.bg }]}>
        <View style={styles.slotTop}>
          <Text style={[styles.slotTime, { color: cfg.color }]}>{slot.time}</Text>
          <View style={styles.typePill}>
            <Text style={[styles.typeIcon, { color: cfg.color }]}>{cfg.icon}</Text>
            <Text style={[styles.typeLabel, { color: cfg.color }]}>{cfg.label}</Text>
          </View>
        </View>
        <Text style={styles.slotActivity}>{slot.activity}</Text>
      </View>
    </Animated.View>
  );
}

export default function AuspiciousTimingsCard({ slots = [] }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Section header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Auspicious Timings</Text>
        <Text style={styles.sectionSub}>Muhurta for today</Text>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <View style={[styles.cardGlow]} />
        {slots.map((slot, i) => (
          <TimeSlot key={i} slot={slot} index={i} />
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 26,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textGold,
  },
  sectionSub: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    overflow: 'hidden',
    ...Layout.shadowSm,
  },
  cardGlow: {
    position: 'absolute',
    top: -40,
    left: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(200,151,58,0.07)',
  },

  // Slot row
  slotRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 4,
  },
  dotCol: {
    alignItems: 'center',
    width: 14,
    paddingTop: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    flexShrink: 0,
  },
  line: {
    width: 2,
    flex: 1,
    marginTop: 4,
    marginBottom: -8,
    minHeight: 24,
  },

  // Slot card
  slotCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
    gap: 4,
  },
  slotTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slotTime: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typeIcon: { fontSize: 9 },
  typeLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  slotActivity: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
