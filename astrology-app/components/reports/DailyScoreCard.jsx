import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import { Typography } from '../../constants/Typography';

// Animated arc drawn using a rotated border trick
function ScoreRing({ score, color }) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue: score / 100,
        duration: 1400,
        delay: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 10,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [score]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const RING_SIZE = 0;
  const RING_THICKNESS = 0;

  return (
    <Animated.View style={[styles.ringWrapper, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      {/* Background ring */}
      <View style={[styles.ring, {
        width: RING_SIZE, height: RING_SIZE, borderRadius: RING_SIZE / 2,
        borderWidth: RING_THICKNESS, borderColor: 'rgba(255,255,255,0.06)',
      }]} />

      {/* Glow ring fill segment — simulated with gradient-like layers */}
      <Animated.View style={[styles.ringSegment, {
        width: RING_SIZE, height: RING_SIZE, borderRadius: RING_SIZE / 2,
        borderWidth: RING_THICKNESS,
        borderColor: color,
        borderTopColor: color,
        borderRightColor: score > 50 ? color : 'transparent',
        borderBottomColor: score > 75 ? color : 'transparent',
        borderLeftColor: score > 25 ? color : 'transparent',
        transform: [{ rotate: rotation }],
        opacity: 0.85,
      }]} />

      {/* Center content */}
      <View style={styles.ringCenter}>
        <Text style={[styles.scoreNum, { color }]}>{score}</Text>
        <Text style={styles.scoreLabel}>Cosmic Score</Text>
      </View>
    </Animated.View>
  );
}

// Animated domain bar
function DomainBar({ domain, score, color, delay }) {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: score,
      duration: 1000,
      delay: delay + 400,
      useNativeDriver: false,
    }).start();
  }, [score]);

  const barWidth = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.domainRow}>
      <Text style={styles.domainIcon}>{domain.icon}</Text>
      <View style={styles.domainInfo}>
        <View style={styles.domainLabelRow}>
          <Text style={styles.domainName}>{domain.label}</Text>
          <Text style={[styles.domainScore, { color }]}>{score}%</Text>
        </View>
        <View style={styles.barTrack}>
          <Animated.View style={[styles.barFill, { width: barWidth, backgroundColor: color }]} />
          <Animated.View style={[styles.barGlow, { left: barWidth, backgroundColor: color }]} />
        </View>
      </View>
    </View>
  );
}

export default function DailyScoreCard({ score = 78, domains = [], signColor = '#FFB84A' }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 700, delay: 100, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Background glow orb */}
      <View style={[styles.bgGlow, { backgroundColor: `${signColor}12` }]} />

      {/* Top: ring + domain bars */}
      <View style={styles.topRow}>
        <ScoreRing score={score} color={signColor} />

        <View style={styles.domainsCol}>
          {domains.map((d, i) => (
            <DomainBar
              key={d.id}
              domain={d}
              score={d.score}
              color={d.color}
              delay={i * 100}
            />
          ))}
        </View>
      </View>

      {/* Footer label */}
      <View style={styles.footer}>
        <View style={styles.footerPill}>
          <Text style={styles.footerText}>✦ Based on your natal chart & current transits</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusXl,
    borderWidth: 1.5,
    borderColor: Colors.borderGold,
    padding: Layout.cardPadding,
    marginTop: 4,
    overflow: 'hidden',
    ...Layout.goldGlow,
  },
  bgGlow: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },

  // Score ring
  ringWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ring: {
    position: 'absolute',
  },
  ringSegment: {
    position: 'absolute',
    shadowColor: Colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  ringCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    height: 120,
  },
  scoreNum: {
    fontSize: 38,
    fontWeight: '800',
    letterSpacing: -1,
  },
  scoreLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // Domains
  domainsCol: {
    flex: 1,
    gap: 12,
  },
  domainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  domainIcon: { fontSize: 14 },
  domainInfo: { flex: 1, gap: 4 },
  domainLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  domainName: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  domainScore: {
    fontSize: 11,
    fontWeight: '700',
  },
  barTrack: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 3,
    overflow: 'visible',
    position: 'relative',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
    opacity: 0.85,
  },
  barGlow: {
    position: 'absolute',
    top: -4,
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: -5,
    opacity: 0.8,
  },

  // Footer
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
  footerPill: {
    backgroundColor: 'rgba(107,78,255,0.08)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(107,78,255,0.18)',
  },
  footerText: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});
