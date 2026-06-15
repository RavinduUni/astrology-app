import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import { Ionicons } from '@expo/vector-icons';


const TIME_BLOCKS = [
    { time: '05:30', label: 'Brahma Muhurta', type: 'auspicious', icon: <Ionicons name="moon" size={20} color="white" /> , desc: 'Ideal for meditation & prayer' },
    { time: '06:00', label: 'Sunrise Puja', type: 'auspicious', icon: <Ionicons name="sunny" size={20} color="white" />, desc: 'Start new ventures' },
    { time: '08:15', label: 'Rahu Kaal', type: 'caution', icon: <Ionicons name="warning" size={20} color="white" />, desc: 'Avoid important decisions' },
    { time: '10:30', label: 'Abhijit Muhurta', type: 'auspicious', icon: <Ionicons name="sparkles" size={20} color="white" />, desc: 'Most powerful time of day' },
    { time: '12:00', label: 'Yamaganda', type: 'caution', icon: <Ionicons name="close-circle" size={20} color="white" />, desc: 'Skip travel & new starts' },
    { time: '15:00', label: 'Gulika Kaal', type: 'neutral', icon: <Ionicons name="alert-circle" size={20} color="white" />, desc: 'Routine tasks only' },
    { time: '18:30', label: 'Sunset Sandhya', type: 'auspicious', icon: <Ionicons name="moon" size={20} color="white" />, desc: 'Evening rituals & reflection' },
];

const TYPE_CONFIG = {
    auspicious: { color: '#4AFF8C', bg: 'rgba(74,255,140,0.08)', dotColor: '#4AFF8C' },
    caution: { color: '#FFB84A', bg: 'rgba(255,184,74,0.08)', dotColor: '#FFB84A' },
    neutral: { color: '#A0A0B8', bg: 'rgba(160,160,184,0.08)', dotColor: '#A0A0B8' },
};

export default function AuspiciousTimeline({ onSeeAll }) {
    const now = new Date();
    const currentHour = now.getHours() + now.getMinutes() / 60;

    const isPast = (timeStr) => {
        const [h, m] = timeStr.split(':').map(Number);
        return h + m / 60 < currentHour;
    };

    return (
        <View style={styles.container}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Today's Muhurta</Text>
                <TouchableOpacity onPress={onSeeAll}>
                    <Text style={styles.seeAll}>Full Day →</Text>
                </TouchableOpacity>
            </View>

            {/* Timeline */}
            <View style={styles.timeline}>
                {TIME_BLOCKS.map((block, i) => {
                    const cfg = TYPE_CONFIG[block.type];
                    const past = isPast(block.time);
                    return (
                        <View key={i} style={styles.timeRow}>
                            {/* Time column */}
                            <Text style={[styles.timeText, past && styles.timeTextPast]}>
                                {block.time}
                            </Text>

                            {/* Connector */}
                            <View style={styles.connector}>
                                <View
                                    style={[
                                        styles.dot,
                                        { backgroundColor: past ? Colors.textMuted : cfg.dotColor },
                                    ]}
                                />
                                {i < TIME_BLOCKS.length - 1 && (
                                    <View style={[styles.line, past && styles.linePast]} />
                                )}
                            </View>

                            {/* Block card */}
                            <View
                                style={[
                                    styles.block,
                                    { backgroundColor: past ? 'rgba(255,255,255,0.03)' : cfg.bg, borderColor: past ? Colors.border : `${cfg.color}30` },
                                ]}
                            >
                                <Text style={styles.blockIcon}>{block.icon}</Text>
                                <View style={styles.blockInfo}>
                                    <Text style={[styles.blockLabel, past && styles.blockLabelPast]}>
                                        {block.label}
                                    </Text>
                                    <Text style={styles.blockDesc}>{block.desc}</Text>
                                </View>
                                {!past && (
                                    <View style={[styles.typePill, { backgroundColor: `${cfg.color}18` }]}>
                                        <Text style={[styles.typeText, { color: cfg.color }]}>
                                            {block.type === 'auspicious' ? '✓' : block.type === 'caution' ? '!' : '–'}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 26,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.textGold,
    },
    seeAll: {
        fontSize: 12,
        color: Colors.textMuted,
        fontWeight: '500',
    },
    timeline: {
        gap: 0,
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        minHeight: 60,
    },
    timeText: {
        width: 42,
        fontSize: 11,
        fontWeight: '600',
        color: Colors.textSecondary,
        marginTop: 10,
    },
    timeTextPast: {
        color: Colors.textMuted,
        opacity: 0.5,
    },
    connector: {
        alignItems: 'center',
        width: 16,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginTop: 10,
        zIndex: 2,
    },
    line: {
        width: 1.5,
        flex: 1,
        backgroundColor: 'rgba(200,151,58,0.2)',
        minHeight: 40,
        marginTop: 2,
    },
    linePast: {
        backgroundColor: Colors.border,
    },
    block: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderRadius: Layout.radiusMd,
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 8,
    },
    blockIcon: { fontSize: 18 },
    blockInfo: { flex: 1 },
    blockLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.white,
    },
    blockLabelPast: {
        color: Colors.textMuted,
        textDecorationLine: 'line-through',
    },
    blockDesc: {
        fontSize: 10,
        color: Colors.textMuted,
        marginTop: 2,
    },
    typePill: {
        width: 22,
        height: 22,
        borderRadius: 11,
        alignItems: 'center',
        justifyContent: 'center',
    },
    typeText: {
        fontSize: 11,
        fontWeight: '800',
    },
});