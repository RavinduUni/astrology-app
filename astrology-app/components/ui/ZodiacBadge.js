import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ZodiacBadge({ sign, style }) {
  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.text}>{sign}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: 'rgba(255,215,0,0.15)',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.4)',
  },
  text: { color: '#FFD700', fontSize: 12, fontWeight: '600' },
});
