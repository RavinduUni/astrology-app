import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const TYPES = [
  { id: 'daily',   label: 'Daily',   icon: <MaterialCommunityIcons name="calendar-clock" size={18} color="white" /> },
  { id: 'weekly',  label: 'Weekly',  icon: <MaterialCommunityIcons name="calendar-clock" size={18} color="white" /> },
  { id: 'monthly', label: 'Monthly', icon: <MaterialCommunityIcons name="calendar-clock" size={18} color="white" /> },
  { id: 'yearly',  label: 'Yearly',  icon: <MaterialCommunityIcons name="calendar-clock" size={18} color="white" /> },
];

function TypePill({ item, isSelected, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.93, useNativeDriver: true, speed: 50 }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30 }).start();

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        style={[styles.pill, isSelected && styles.pillActive]}
      >
        <Text style={styles.pillIcon}>{item.icon}</Text>
        <Text style={[styles.pillLabel, isSelected && styles.pillLabelActive]}>
          {item.label}
        </Text>
        {isSelected && <View style={styles.activeDot} />}
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ReportTypeSelector({ selected = 'daily', onSelect }) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {TYPES.map((item) => (
          <TypePill
            key={item.id}
            item={item}
            isSelected={selected === item.id}
            onPress={() => onSelect(item.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  scroll: {
    gap: 10,
    paddingVertical: 4,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: Layout.radiusFull,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    position: 'relative',
  },
  pillActive: {
    backgroundColor: 'rgba(200,151,58,0.14)',
    borderColor: Colors.gold,
    ...{
      shadowColor: Colors.gold,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
  },
  pillIcon: { fontSize: 14 },
  pillLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
    letterSpacing: 0.2,
  },
  pillLabelActive: {
    color: Colors.goldLight,
    fontWeight: '700',
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.gold,
    marginLeft: 2,
  },
});
