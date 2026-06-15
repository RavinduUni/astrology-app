import { useEffect, useRef } from 'react';
import {
    Animated,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

const SUGGESTIONS = [
    { icon: '❤️', text: 'What does my chart say about love?' },
    { icon: '🌟', text: 'When is my next lucky period?' },
    { icon: '💼', text: 'Career path insights' },
    { icon: '🪐', text: 'Planets affecting me today' },
    { icon: '🏥', text: 'My health horoscope' },
    { icon: '💰', text: 'Financial forecast' },
];

export default function SuggestionChips({ onSelect, visible = true }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(12)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay: 300, useNativeDriver: true }),
                Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 12, delay: 300, useNativeDriver: true }),
            ]).start();
        } else {
            Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Animated.View style={[styles.wrapper, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.label}>✦ Ask me about</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.scroll}
            >
                {SUGGESTIONS.map((s, i) => (
                    <TouchableOpacity
                        key={i}
                        onPress={() => onSelect(s.text)}
                        style={styles.chip}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.chipIcon}>{s.icon}</Text>
                        <Text style={styles.chipText}>{s.text}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        backgroundColor: 'rgba(10,10,18,0.95)',
    },
    label: {
        fontSize: 10,
        color: Colors.textMuted,
        fontWeight: '600',
        letterSpacing: 0.8,
        paddingHorizontal: Layout.padding,
        marginBottom: 8,
    },
    scroll: {
        paddingHorizontal: Layout.padding,
        paddingBottom: 10,
        gap: 8,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: Layout.radiusFull,
        backgroundColor: Colors.surface,
        borderWidth: 1.5,
        borderColor: Colors.borderGold,
        maxWidth: 220,
    },
    chipIcon: { fontSize: 13 },
    chipText: {
        fontSize: 12,
        color: Colors.textGold,
        fontWeight: '500',
    },
});