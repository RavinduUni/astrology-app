import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../constants/Typography';

export default function HomeHeader({ name = 'Cosmic Soul', moonPhase = 'Waxing Gibbous', moonEmoji = '🌖', date = '', onNotificationPress }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(-12)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 12, useNativeDriver: true }),
        ]).start();
    }, []);

    const hour = new Date().getHours();
    

    return (
        <Animated.View
            style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        >
            {/* Left — greeting */}
            <View style={styles.left}>
                <Text style={styles.name}>{name}</Text>
                <View style={styles.dateRow}>
                    <Text style={styles.dateText}>{date}</Text>
                    {/* <View style={styles.moonPill}>
                        <Text style={styles.moonText}>{moonPhase}</Text>
                    </View> */}
                </View>
            </View>

            {/* Right — notification + avatar */}
            <View style={styles.right}>
                <TouchableOpacity
                    onPress={onNotificationPress}
                    style={styles.notifBtn}
                    activeOpacity={0.7}
                >
                    <Text style={styles.notifIcon}><Ionicons name="notifications-outline" size={24} color="white" /></Text>
                    <View style={styles.notifBadge}>
                        <Text style={styles.notifBadgeText}>3</Text>
                    </View>
                </TouchableOpacity>
                <View style={styles.avatar}>
                    <Text style={styles.avatarEmoji}><Ionicons name="person" size={24} color="white" /></Text>
                </View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingTop: 8,
        paddingBottom: 4,
    },
    left: { flex: 1 },
    name: {
        ...Typography.h3,
        fontSize: 22,
        color: Colors.white,
        marginBottom: 6,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    moonEmoji: { fontSize: 13 },
    dateText: {
        fontSize: 18,
        color: Colors.goldLight,
    },
    moonPill: {
        backgroundColor: 'rgba(107,78,255,0.18)',
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderWidth: 1,
        borderColor: 'rgba(107,78,255,0.3)',
    },
    moonText: {
        fontSize: 10,
        color: Colors.glowPurple,
        fontWeight: '600',
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 4,
    },
    notifBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notifIcon: { fontSize: 18 },
    notifBadge: {
        position: 'absolute',
        top: -2,
        right: -2,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: Colors.danger,
        alignItems: 'center',
        justifyContent: 'center',
    },
    notifBadgeText: { fontSize: 9, color: Colors.white, fontWeight: '700' },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 40,
    },
    avatarEmoji: { fontSize: 22 },
});