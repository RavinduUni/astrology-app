import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CosmicBackground from '../../components/ui/Cosmicbackground';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

export default function ProfileScreen() {
  return (
    <CosmicBackground>
      <View style={styles.center}>
        <Text style={styles.icon}>👤</Text>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.sub}>Your cosmic identity</Text>
      </View>
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingBottom: Layout.tabBarHeight,
  },
  icon: { fontSize: 48 },
  title: { fontSize: 22, fontWeight: '700', color: Colors.white },
  sub: { fontSize: 14, color: Colors.textMuted },
});