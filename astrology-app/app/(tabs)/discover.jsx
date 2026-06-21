import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function DiscoverScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>✦ Discover Astrologers</Text>
      <Text style={styles.sub}>Coming Soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 22,
    fontWeight: '700',
    color: '#C8973A',
    letterSpacing: 1,
    marginBottom: 8,
  },
  sub: {
    fontSize: 14,
    color: '#888',
  },
});
