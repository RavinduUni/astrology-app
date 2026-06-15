import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';

export default function ReportsHeader({ userName = 'Arya Silva', sign = 'Leo', signSymbol = '♌', signColor = '#FFB84A', date = '', onShare }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-14)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 55, friction: 11, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      {/* Left block */}
      <View style={styles.left}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>✦ Reports</Text>
          <View style={[styles.signBadge, { borderColor: `${signColor}55`, backgroundColor: `${signColor}18` }]}>
            <Text style={[styles.signSymbol, { color: signColor }]}>{signSymbol}</Text>
            <Text style={[styles.signName, { color: signColor }]}>{sign}</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>Daily Cosmic Report</Text>
        <Text style={styles.date}>{date}</Text>
      </View>

      {/* Right actions */}
      <View style={styles.right}>
        <TouchableOpacity style={styles.iconBtn} onPress={onShare} activeOpacity={0.7}>
          <Ionicons name="share-outline" size={20} color={Colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.avatar}>
          <Ionicons name="person" size={22} color={Colors.white} />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 8,
    paddingBottom: 6,
  },
  left: { flex: 1, gap: 2 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  title: {
    ...Typography.h3,
    fontSize: 22,
    color: Colors.white,
  },
  signBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  signSymbol: { fontSize: 13, fontWeight: '700' },
  signName: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
  date: {
    fontSize: 12,
    color: Colors.textGold,
    marginTop: 2,
    fontWeight: '500',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
