import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import GlassCard from '../ui/GlassCard';

export default function ReportCard({ title, content, premium = false, style }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <GlassCard style={[styles.card, style]}>
      <TouchableOpacity onPress={() => setExpanded((e) => !e)} style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {expanded && <Text style={styles.content}>{content}</Text>}
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, marginBottom: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#fff', fontSize: 15, fontWeight: '600' },
  chevron: { color: '#FFD700', fontSize: 12 },
  content: { color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 21, marginTop: 12 },
});
