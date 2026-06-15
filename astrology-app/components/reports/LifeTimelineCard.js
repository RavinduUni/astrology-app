import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function LifeTimelineCard({ events = [], style }) {
  return (
    <View style={[styles.container, style]}>
      {events.map((event, i) => (
        <View key={i} style={styles.row}>
          <View style={styles.dotCol}>
            <View style={styles.dot} />
            {i < events.length - 1 && <View style={styles.line} />}
          </View>
          <View style={styles.content}>
            <Text style={styles.year}>{event.year}</Text>
            <Text style={styles.label}>{event.label}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  row: { flexDirection: 'row', gap: 12 },
  dotCol: { alignItems: 'center', width: 16 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#FFD700', marginTop: 4 },
  line: { width: 2, flex: 1, backgroundColor: 'rgba(255,215,0,0.2)', marginTop: 4 },
  content: { flex: 1, paddingBottom: 20 },
  year: { color: '#FFD700', fontSize: 13, fontWeight: '700' },
  label: { color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 20, marginTop: 2 },
});
