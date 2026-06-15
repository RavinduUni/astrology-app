import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PremiumBadge({ style }) {
  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.text}>⭐ Premium</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: 'rgba(255,215,0,0.2)',
    borderRadius: 12,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#FFD700',
    alignSelf: 'flex-start',
  },
  text: { color: '#FFD700', fontSize: 11, fontWeight: '700' },
});
