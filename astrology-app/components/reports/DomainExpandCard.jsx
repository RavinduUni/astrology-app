import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import { Typography } from '../../constants/Typography';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Compatibility meter bar
function CompatMeter({ label, value, color }) {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: value,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const barWidth = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={meterStyles.row}>
      <Text style={meterStyles.label}>{label}</Text>
      <View style={meterStyles.track}>
        <Animated.View style={[meterStyles.fill, { width: barWidth, backgroundColor: color }]} />
      </View>
      <Text style={[meterStyles.value, { color }]}>{value}%</Text>
    </View>
  );
}

const meterStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    color: Colors.textMuted,
    width: 72,
    fontWeight: '500',
  },
  track: {
    flex: 1,
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
    opacity: 0.85,
  },
  value: {
    fontSize: 11,
    fontWeight: '700',
    width: 34,
    textAlign: 'right',
  },
});

export default function DomainExpandCard({ domain, style }) {
  const [expanded, setExpanded] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
    Animated.spring(rotateAnim, {
      toValue: expanded ? 0 : 1,
      tension: 60,
      friction: 12,
      useNativeDriver: true,
    }).start();
  };

  const chevronRotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const { icon, label, color, score, summary, detail, tips = [], subScores = [] } = domain;

  return (
    <Animated.View style={[styles.card, { borderColor: `${color}35` }, style, { opacity: fadeAnim }]}>
      {/* Subtle bg tint */}
      <View style={[styles.bgTint, { backgroundColor: `${color}08` }]} />

      {/* Header row */}
      <TouchableOpacity style={styles.header} onPress={toggle} activeOpacity={0.8}>
        <View style={[styles.iconCircle, { backgroundColor: `${color}18`, borderColor: `${color}40` }]}>
          <Text style={styles.domainIcon}>{icon}</Text>
        </View>

        <View style={styles.headerText}>
          <Text style={styles.domainLabel}>{label}</Text>
          <Text style={styles.summarySnip} numberOfLines={1}>{summary}</Text>
        </View>

        <View style={styles.headerRight}>
          {/* Score badge */}
          <View style={[styles.scoreBadge, { backgroundColor: `${color}22`, borderColor: `${color}50` }]}>
            <Text style={[styles.scoreText, { color }]}>{score}</Text>
          </View>
          <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
            <Ionicons name="chevron-down" size={16} color={Colors.textMuted} />
          </Animated.View>
        </View>
      </TouchableOpacity>

      {/* Expanded content */}
      {expanded && (
        <View style={styles.expandedContent}>
          <View style={[styles.divider, { backgroundColor: `${color}25` }]} />

          {/* Detail paragraph */}
          <Text style={styles.detailText}>{detail}</Text>

          {/* Sub-scores */}
          {subScores.length > 0 && (
            <View style={styles.subScoresSection}>
              <Text style={[styles.sectionHeading, { color }]}>Breakdown</Text>
              {subScores.map((s) => (
                <CompatMeter key={s.label} label={s.label} value={s.value} color={color} />
              ))}
            </View>
          )}

          {/* Tips */}
          {tips.length > 0 && (
            <View style={styles.tipsSection}>
              <Text style={[styles.sectionHeading, { color }]}>✦ Today's Guidance</Text>
              {tips.map((tip, i) => (
                <View key={i} style={styles.tipRow}>
                  <View style={[styles.tipDot, { backgroundColor: color }]} />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    borderWidth: 1.5,
    marginBottom: 12,
    overflow: 'hidden',
    ...Layout.shadowSm,
  },
  bgTint: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  domainIcon: { fontSize: 20 },
  headerText: { flex: 1, gap: 2 },
  domainLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
  summarySnip: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 17,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scoreBadge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
  },
  scoreText: {
    fontSize: 13,
    fontWeight: '800',
  },

  // Expanded
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  divider: {
    height: 1,
    marginBottom: 14,
  },
  detailText: {
    ...Typography.body,
    lineHeight: 22,
    marginBottom: 16,
  },
  subScoresSection: { marginBottom: 14 },
  tipsSection: {},
  sectionHeading: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  tipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 7,
    flexShrink: 0,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
