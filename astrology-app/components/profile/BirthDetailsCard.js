import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GlassCard from '../ui/GlassCard';

export default function BirthDetailsCard({ name, dob, pob, tob, style }) {
  const details = [
    { label: 'Date of Birth', value: dob },
    { label: 'Place of Birth', value: pob },
    { label: 'Time of Birth', value: tob },
  ];
  return (
    <GlassCard style={[styles.card, style]}>
      <Text style={styles.name}>{name}</Text>
      {details.map((d) => (
        <View key={d.label} style={styles.row}>
          <Text style={styles.label}>{d.label}</Text>
          <Text style={styles.value}>{d.value}</Text>
        </View>
      ))}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: { padding: 18 },
  name: { color: '#FFD700', fontSize: 17, fontWeight: '700', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  value: { color: '#fff', fontSize: 13, fontWeight: '600' },
});
