import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

function SkeletonPulse({ style }) {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 0.7, duration: 900, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.3, duration: 900, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View
            style={[
                styles.skeleton,
                style,
                { opacity },
            ]}
        />
    );
}

export default function HomeSkeleton() {
    return (
        <View style={styles.container}>
            {/* Header skeleton */}
            <View style={styles.headerRow}>
                <View>
                    <SkeletonPulse style={styles.greetingLine} />
                    <SkeletonPulse style={styles.nameLine} />
                    <SkeletonPulse style={styles.dateLine} />
                </View>
                <View style={styles.headerRight}>
                    <SkeletonPulse style={styles.circle40} />
                    <SkeletonPulse style={styles.circle44} />
                </View>
            </View>

            {/* Horoscope card skeleton */}
            <SkeletonPulse style={styles.horoCard} />

            {/* Lucky stats row skeleton */}
            <View style={styles.statsRow}>
                <SkeletonPulse style={styles.statCard} />
                <SkeletonPulse style={styles.statCard} />
                <SkeletonPulse style={styles.statCard} />
            </View>

            {/* Quick actions skeleton */}
            <View style={styles.actionsGrid}>
                {Array(6).fill(0).map((_, i) => (
                    <SkeletonPulse key={i} style={styles.actionCard} />
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: Layout.padding,
        paddingTop: 12,
    },
    skeleton: {
        backgroundColor: Colors.surface,
        borderRadius: 8,
    },

    // Header
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        marginTop: 8,
    },
    greetingLine: { width: 120, height: 12, marginBottom: 10 },
    nameLine: { width: 180, height: 20, marginBottom: 10, borderRadius: 10 },
    dateLine: { width: 140, height: 12 },
    headerRight: { flexDirection: 'row', gap: 12, alignItems: 'center' },
    circle40: { width: 40, height: 40, borderRadius: 20 },
    circle44: { width: 44, height: 44, borderRadius: 22 },

    // Horoscope
    horoCard: { height: 220, borderRadius: Layout.radiusXl, marginBottom: 24 },

    // Stats
    statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
    statCard: { flex: 1, height: 110, borderRadius: Layout.radiusLg },

    // Actions
    actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    actionCard: { width: '30%', flexGrow: 1, height: 100, borderRadius: Layout.radiusLg },
});