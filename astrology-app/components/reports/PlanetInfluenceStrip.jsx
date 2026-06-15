import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

const INFLUENCE_CONFIG = {
  positive: { color: '#4AFF8C', label: 'Favourable', bg: 'rgba(74,255,140,0.10)', icon: '▲' },
  neutral:  { color: '#A0A0B8', label: 'Neutral',    bg: 'rgba(160,160,184,0.10)', icon: '●' },
  caution:  { color: '#FFB84A', label: 'Caution',    bg: 'rgba(255,184,74,0.10)',  icon: '▼' },
};

function PlanetCard({ planet, delay }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, delay, tension: 60, friction: 12, useNativeDriver: true }),
    ]).start();
  }, []);

  const inf = INFLUENCE_CONFIG[planet.influence] || INFLUENCE_CONFIG.neutral;

  return (
    <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      {/* Glow tint */}
      <View style={[styles.cardGlow, { backgroundColor: inf.bg }]} />

      {/* Symbol */}
      <View style={[styles.symbolWrap, { borderColor: `${inf.color}45`, backgroundColor: `${inf.color}14` }]}>
        <Text style={styles.symbolText}>{planet.symbol}</Text>
      </View>

      <Text style={styles.planetName}>{planet.name}</Text>
      <Text style={styles.position}>{planet.position}</Text>
      <Text style={styles.house}>House {planet.house}</Text>

      {/* Influence pill */}
      <View style={[styles.infoPill, { backgroundColor: inf.bg }]}>
        <Text style={[styles.infoText, { color: inf.color }]}>{inf.icon} {inf.label}</Text>
      </View>
    </Animated.View>
  );
}

export default function PlanetInfluenceStrip({ planets = [] }) {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Planet Influences</Text>
        <Text style={styles.sectionSub}>Today's transits</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {planets.map((planet, i) => (
          <PlanetCard key={planet.name} planet={planet} delay={i * 70} />
        ))}
      </ScrollView>
    </View>
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
  scroll: {
    gap: 10,
    paddingBottom: 4,
    paddingRight: 4,
  },
  card: {
    width: 104,
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
    alignItems: 'center',
    gap: 4,
    overflow: 'hidden',
    ...Layout.shadowSm,
  },
  cardGlow: {
    ...StyleSheet.absoluteFillObject,
  },
  symbolWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  symbolText: {
    fontSize: 18,
    color: Colors.white,
  },
  planetName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  position: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  house: {
    fontSize: 9,
    color: Colors.textMuted,
  },
  infoPill: {
    marginTop: 5,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  infoText: {
    fontSize: 9,
    fontWeight: '700',
  },
});
