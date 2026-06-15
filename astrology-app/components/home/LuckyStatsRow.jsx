import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import { Ionicons } from '@expo/vector-icons';

function LuckyStat({ icon, label, value, subValue, accentColor, delay }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, delay, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 12, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          borderColor: `${accentColor}35`,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Top glow */}
      <View style={[styles.topGlow, { backgroundColor: `${accentColor}20` }]} />

      {/* Icon circle */}
      <View style={[styles.iconCircle, { backgroundColor: `${accentColor}18`, borderColor: `${accentColor}40` }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Value */}
      <Text style={[styles.value, { color: accentColor }]}>{value}</Text>

      {/* Sub value */}
      {subValue ? <Text style={styles.subValue}>{subValue}</Text> : null}
    </Animated.View>
  );
}

export default function LuckyStatsRow({ data }) {
  if (!data) return null;

  const { luckyColor, luckyNumber, luckyTime } = data;

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today's Lucky Energies</Text>
      </View>
      <View style={styles.row}>
        <LuckyStat
          icon={<Ionicons name="color-palette" size={20} color="white" />}
          label="Lucky Color"
          value={luckyColor.name}
          accentColor={luckyColor.hex}
          delay={100}
        />
        <LuckyStat
          icon={<Ionicons name="dice" size={20} color="white" />}
          label="Lucky Number"
          value={String(luckyNumber)}
          accentColor={Colors.gold}
          delay={200}
        />
        <LuckyStat
          icon={<Ionicons name="time" size={20} color="white" />}
          label="Lucky Time"
          value={luckyTime.split(' – ')[0]}
          accentColor={Colors.glowPurple}
          delay={300}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  sectionHeader: {
    marginBottom: 14,
    display: 'flex',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textGold,
    letterSpacing: 0.3,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    borderWidth: 1.5,
    padding: 14,
    alignItems: 'center',
    overflow: 'hidden',
    ...Layout.shadowSm,
  },
  topGlow: {
    position: 'absolute',
    top: -20,
    left: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: { fontSize: 18 },
  label: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  value: {
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 18,
  },
  subValue: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 3,
  },
});