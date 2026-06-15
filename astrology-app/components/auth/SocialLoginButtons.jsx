import React, { useRef } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Animated } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

const PROVIDERS = {
    google: { icon: 'G', label: 'Google', color: '#EA4335', bg: 'rgba(234,67,53,0.12)', border: 'rgba(234,67,53,0.3)' },
    facebook: { icon: 'f', label: 'Facebook', color: '#1877F2', bg: 'rgba(24,119,242,0.12)', border: 'rgba(24,119,242,0.3)' },
    apple: { icon: '', label: 'Apple', color: '#FFFFFF', bg: 'rgba(255,255,255,0.08)', border: 'rgba(255,255,255,0.2)' },
};

function SocialButton({ provider, onPress }) {
    const scale = useRef(new Animated.Value(1)).current;
    const p = PROVIDERS[provider];

    const onPressIn = () => {
        Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 50 }).start();
    };
    const onPressOut = () => {
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30 }).start();
    };

    return (
        <Animated.View style={{ transform: [{ scale }], flex: 1 }}>
            <TouchableOpacity
                onPress={onPress}
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                activeOpacity={1}
                style={[styles.btn, { backgroundColor: p.bg, borderColor: p.border }]}
            >
                <Text style={[styles.icon, { color: p.color }]}>{p.icon}</Text>
            </TouchableOpacity>
        </Animated.View>
    );
}

export default function SocialLoginButtons({ onGoogle, onFacebook, onApple, label = 'Or continue with' }) {
    return (
        <View style={styles.wrapper}>
            <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>{label}</Text>
                <View style={styles.dividerLine} />
            </View>
            <View style={styles.row}>
                <SocialButton provider="google" onPress={onGoogle} />
                <SocialButton provider="apple" onPress={onApple} />
                <SocialButton provider="facebook" onPress={onFacebook} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginVertical: 8,
    },
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.border,
    },
    dividerText: {
        fontSize: 12,
        color: Colors.textMuted,
        marginHorizontal: 14,
        letterSpacing: 0.5,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    btn: {
        height: 52,
        borderRadius: Layout.radiusMd,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    icon: {
        fontSize: 20,
        fontWeight: '700',
    },
});