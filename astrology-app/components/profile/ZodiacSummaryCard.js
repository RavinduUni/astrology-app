import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GlassCard from '../ui/GlassCard';

export default function ZodiacSummaryCard({ sign, element, ruler, description, style }) {
  return (
    <GlassCard style={[styles.card, style]}>
      <Text style={styles.sign}>{sign}</Text>
      <View style={styles.row}>
        <Text style={styles.meta}>Element: <Text style={styles.val}>{element}</Text></Text>
        <Text style={styles.meta}>Ruler: <Text style={styles.val}>{ruler}</Text></Text>
      </View>
      <Text style={styles.desc}>{description}</Text>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: { padding: 18 },
  sign: { color: '#FFD700', fontSize: 22, fontWeight: '800', marginBottom: 8 },
  row: { flexDirection: 'row', gap: 20, marginBottom: 10 },
  meta: { color: 'rgba(255,255,255,0.5)', fontSize: 12 },
  val: { color: '#fff', fontWeight: '600' },
  desc: { color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 21 },
});
