import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import { Typography } from '../../constants/Typography';

function RemedyItem({ remedy }) {
  return (
    <View style={[styles.remedyCard, { borderColor: `${remedy.color}30` }]}>
      <View style={[styles.remedyIconWrap, { backgroundColor: `${remedy.color}14`, borderColor: `${remedy.color}40` }]}>
        <Text style={styles.remedyIcon}>{remedy.icon}</Text>
      </View>
      <Text style={styles.remedyType}>{remedy.type}</Text>
      <Text style={[styles.remedyValue, { color: remedy.color }]}>{remedy.value}</Text>
      {remedy.desc ? <Text style={styles.remedyDesc}>{remedy.desc}</Text> : null}
    </View>
  );
}

export default function RemediesCard({ remedies = [] }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, delay: 200, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 55, friction: 12, delay: 200, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      {/* Section header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Vedic Remedies</Text>
        <Text style={styles.sectionSub}>For today</Text>
      </View>

      {/* Card */}
      <View style={styles.card}>
        {/* Glow */}
        <View style={styles.cardGlow} />

        {/* Note */}
        <View style={styles.noteRow}>
          <Ionicons name="information-circle-outline" size={14} color={Colors.glowPurple} />
          <Text style={styles.noteText}>
            These remedies align your energy with today's planetary influences
          </Text>
        </View>

        {/* Remedy grid */}
        <View style={styles.grid}>
          {remedies.map((r, i) => (
            <RemedyItem key={i} remedy={r} />
          ))}
        </View>

        {/* Mantra block (if any) */}
        {remedies.find(r => r.type === 'Mantra') && (
          <View style={styles.mantraBlock}>
            <Text style={styles.mantraLabel}>✦ Chant Today</Text>
            <Text style={styles.mantraText}>{remedies.find(r => r.type === 'Mantra')?.fullMantra || ''}</Text>
            <Text style={styles.mantraCount}>Repeat 108 times in the morning</Text>
          </View>
        )}
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
    borderWidth: 1.5,
    borderColor: Colors.borderGold,
    padding: 16,
    overflow: 'hidden',
    ...Layout.goldGlow,
  },
  cardGlow: {
    position: 'absolute',
    bottom: -40,
    right: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(200,151,58,0.08)',
  },

  // Note
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    backgroundColor: 'rgba(107,78,255,0.08)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    borderLeftWidth: 2,
    borderLeftColor: Colors.glowPurple,
  },
  noteText: {
    flex: 1,
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 17,
  },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 4,
  },
  remedyCard: {
    width: '47%',
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Layout.radius,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    gap: 5,
  },
  remedyIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  remedyIcon: { fontSize: 20 },
  remedyType: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  remedyValue: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  remedyDesc: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 14,
  },

  // Mantra
  mantraBlock: {
    marginTop: 14,
    backgroundColor: 'rgba(107,78,255,0.10)',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(107,78,255,0.22)',
    alignItems: 'center',
    gap: 6,
  },
  mantraLabel: {
    fontSize: 10,
    color: Colors.glowPurple,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  mantraText: {
    fontSize: 15,
    color: Colors.white,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  mantraCount: {
    fontSize: 10,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
});
