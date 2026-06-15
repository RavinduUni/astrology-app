import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ACTIONS = [
  {
    id: 'chat',
    icon: <MaterialCommunityIcons name="message-processing-outline" size={24} color={Colors.white} />,
    label: 'AI Chat',
    sub: 'Ask anything',
    color: '#3B4FD4',
    glow: 'rgba(59,79,212,0.25)',
  },
  {
    id: 'report',
    icon: <MaterialCommunityIcons name="chart-line" size={24} color={Colors.white} />,
    label: 'Reports',
    sub: 'Full analysis',
    color: '#C8973A',
    glow: 'rgba(200,151,58,0.25)',
  },
  {
    id: 'kundali',
    icon: <MaterialCommunityIcons name="chart-pie" size={24} color={Colors.white} />,
    label: 'Kundali',
    sub: 'Birth chart',
    color: '#6B4EFF',
    glow: 'rgba(107,78,255,0.25)',
  },
  {
    id: 'compatibility',
    icon: <MaterialCommunityIcons name="heart-outline" size={24} color={Colors.white} />,
    label: 'Compatibility',
    sub: 'Love match',
    color: '#FF4A8C',
    glow: 'rgba(255,74,140,0.25)',
  },
  {
    id: 'muhurta',
    icon: <MaterialCommunityIcons name="candle" size={24} color={Colors.white} />,
    label: 'Muhurta',
    sub: 'Auspicious time',
    color: '#4AD4CC',
    glow: 'rgba(74,212,204,0.25)',
  },
  {
    id: 'tarot',
    icon: <MaterialCommunityIcons name="cards" size={24} color={Colors.white} />,
    label: 'Tarot',
    sub: 'Card reading',
    color: '#FFB84A',
    glow: 'rgba(255,184,74,0.25)',
  },
];

function ActionButton({ action, onPress, index }) {
  const scale = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 70,
      useNativeDriver: true,
    }).start();
  }, []);

  const onPressIn = () => {
    Animated.spring(scale, { toValue: 0.93, useNativeDriver: true, speed: 50 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30 }).start();
  };

  return (
    <Animated.View
      style={[
        styles.btnWrapper,
        {
          opacity: fadeAnim,
          transform: [{ scale }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => onPress?.(action.id)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        style={styles.btn}
      >
        {/* Glow bg */}
        <View style={[styles.glowBg, { backgroundColor: action.glow }]} />


        {/* Icon */}
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor: `${action.color}18`,
              borderColor: `${action.color}40`,
            },
          ]}
        >
          <Text style={styles.icon}>{action.icon}</Text>
        </View>

        {/* Labels */}
        <Text style={styles.label}>{action.label}</Text>
        <Text style={styles.sub}>{action.sub}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function QuickActions({ onActionPress }) {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
      </View>
      <View style={styles.grid}>
        {ACTIONS.map((action, i) => (
          <ActionButton
            key={action.id}
            action={action}
            onPress={onActionPress}
            index={i}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 26,
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
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  btnWrapper: {
    width: '30%',
    flexGrow: 1,
    maxWidth: '32%',
  },
  btn: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    alignItems: 'center',
    overflow: 'hidden',
    gap: 6,
    ...Layout.shadowSm,
  },
  glowBg: {
    position: 'absolute',
    bottom: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  topAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    borderTopLeftRadius: Layout.radiusLg,
    borderTopRightRadius: Layout.radiusLg,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  icon: { fontSize: 20 },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
  },
  sub: {
    fontSize: 10,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});