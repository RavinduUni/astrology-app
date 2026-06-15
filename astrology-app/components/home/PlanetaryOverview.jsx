import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import { Ionicons } from '@expo/vector-icons';

const INFLUENCE_CONFIG = {
  positive: { color: '#4AFF8C', label: '▲ Favourable', bg: 'rgba(74,255,140,0.1)' },
  neutral: { color: '#A0A0B8', label: '● Neutral', bg: 'rgba(160,160,184,0.1)' },
  caution: { color: '#FFB84A', label: '▼ Caution', bg: 'rgba(255,184,74,0.1)' },
};

// Minimal radial planet chart using circles
function MiniChart({ planets }) {
  const rings = [
    { r: 18, color: Colors.textSecondary },
    { r: 36, color: Colors.textSecondary },
    { r: 52, color: Colors.textSecondary },
  ];

  const displayed = planets.slice(0, 6);

  return (
    <View style={chartStyles.container}>
      {rings.map((ring, i) => (
        <View
          key={i}
          style={[
            chartStyles.ring,
            {
              width: ring.r * 2,
              height: ring.r * 2,
              borderRadius: ring.r,
              borderColor: ring.color,
            },
          ]}
        />
      ))}
      {/* Center sun */}
      <View style={chartStyles.center}>
        <Text style={chartStyles.centerText}><Ionicons name="sunny" size={20} color="white" /></Text>
      </View>
      {/* Planet dots around rings */}
      {displayed.map((planet, i) => {
        const angle = (i / displayed.length) * 2 * Math.PI - Math.PI / 2;
        const r = i % 2 === 0 ? 36 : 52;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        const inf = INFLUENCE_CONFIG[planet.influence];
        return (
          <View
            key={planet.name}
            style={[
              chartStyles.planetDot,
              {
                left: 58 + x - 10,
                top: 58 + y - 10,
                backgroundColor: `${inf.color}22`,
                borderColor: `${inf.color}66`,
              },
            ]}
          >
            <Text style={chartStyles.planetDotText}>{planet.symbol}</Text>
          </View>
        );
      })}
    </View>
  );
}

const chartStyles = StyleSheet.create({
  container: {
    width: 116,
    height: 116,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ring: {
    position: 'absolute',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  center: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(200,151,58,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  centerText: { fontSize: 14 },
  planetDot: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  planetDotText: { fontSize: 13, color: Colors.white },
});

function PlanetCard({ planet, delay }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  const inf = INFLUENCE_CONFIG[planet.influence];

  return (
    <Animated.View style={[styles.planetCard, { opacity: fadeAnim }]}>
      <View style={[styles.planetSymbolWrap, { backgroundColor: `${inf.color}15`, borderColor: `${inf.color}35` }]}>
        <Text style={styles.planetSymbol}>{planet.symbol}</Text>
      </View>
      <Text style={styles.planetName}>{planet.name}</Text>
      <Text style={styles.planetPosition}>{planet.position}</Text>
      <Text style={styles.planetHouse}>House {planet.house}</Text>
      <View style={[styles.influencePill, { backgroundColor: inf.bg }]}>
        <Text style={[styles.influenceText, { color: inf.color }]}>{inf.label}</Text>
      </View>
    </Animated.View>
  );
}

export default function PlanetaryOverview({ planets = [], onSeeAll }) {
  return (
    <View style={styles.container}>
      {/* Section header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}> Planetary Positions</Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.seeAll}>See All →</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal row: mini chart + planet cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Mini chart card */}
        <View style={styles.chartCard}>
          <MiniChart planets={planets} />
          <Text style={styles.chartLabel}>Natal Chart</Text>
          <Text style={styles.chartSub}>Today's Transits</Text>
        </View>

        {/* Planet cards */}
        {planets.map((planet, i) => (
          <PlanetCard key={planet.name} planet={planet} delay={i * 60} />
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
    paddingHorizontal: 0,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textGold,
  },
  seeAll: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  scroll: {
    paddingRight: 20,
    gap: 12,
    paddingBottom: 4,
  },

  // Chart card
  chartCard: {
    width: 140,
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    borderWidth: 1,
    borderColor: Colors.borderGold,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    ...Layout.shadowSm,
  },
  chartLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  chartSub: {
    fontSize: 10,
    color: Colors.textMuted,
  },

  // Planet card
  planetCard: {
    width: 108,
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    alignItems: 'center',
    gap: 4,
    ...Layout.shadowSm,
  },
  planetSymbolWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  planetSymbol: {
    fontSize: 18,
    color: Colors.white,
  },
  planetName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.white,
  },
  planetPosition: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  planetHouse: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  influencePill: {
    marginTop: 4,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  influenceText: {
    fontSize: 9,
    fontWeight: '700',
  },
});