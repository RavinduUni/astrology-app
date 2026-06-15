import React from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    FlatList,
    StyleSheet,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import { Typography } from '../../constants/Typography';
import { Ionicons } from '@expo/vector-icons';

const LAGNAS = [
    { name: 'Mesha (Aries)', symbol: '♈', element: 'Fire', lord: 'Mars' },
    { name: 'Vrishabha (Taurus)', symbol: '♉', element: 'Earth', lord: 'Venus' },
    { name: 'Mithuna (Gemini)', symbol: '♊', element: 'Air', lord: 'Mercury' },
    { name: 'Karka (Cancer)', symbol: '♋', element: 'Water', lord: 'Moon' },
    { name: 'Simha (Leo)', symbol: '♌', element: 'Fire', lord: 'Sun' },
    { name: 'Kanya (Virgo)', symbol: '♍', element: 'Earth', lord: 'Mercury' },
    { name: 'Tula (Libra)', symbol: '♎', element: 'Air', lord: 'Venus' },
    { name: 'Vrischika (Scorpio)', symbol: '♏', element: 'Water', lord: 'Mars' },
    { name: 'Dhanu (Sagittarius)', symbol: '♐', element: 'Fire', lord: 'Jupiter' },
    { name: 'Makara (Capricorn)', symbol: '♑', element: 'Earth', lord: 'Saturn' },
    { name: 'Kumbha (Aquarius)', symbol: '♒', element: 'Air', lord: 'Saturn' },
    { name: 'Meena (Pisces)', symbol: '♓', element: 'Water', lord: 'Jupiter' },
];

const ELEMENT_COLORS = {
    Fire: '#FF6B4A',
    Earth: '#4AFF8C',
    Air: '#4AD4FF',
    Water: '#4A8CFF',
};

export default function LagnaPicker({ visible, onClose, onSelect, selected }) {
    const handleSelect = (lagna) => {
        onSelect(lagna);
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1} />
            <View style={styles.sheet}>
                <View style={styles.handle} />
                <Text style={styles.title}><Ionicons name="star-outline" size={18} color={Colors.goldLight} />  Select Your Lagna</Text>
                <Text style={styles.subtitle}>Your ascendant sign at birth</Text>

                <FlatList
                    data={LAGNAS}
                    keyExtractor={(item) => item.name}
                    showsVerticalScrollIndicator={false}
                    style={styles.list}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    renderItem={({ item }) => {
                        const isSelected = selected?.name === item.name;
                        const elementColor = ELEMENT_COLORS[item.element];
                        return (
                            <TouchableOpacity
                                onPress={() => handleSelect(item)}
                                style={[
                                    styles.lagnaCard,
                                    isSelected && { borderColor: Colors.gold, backgroundColor: 'rgba(200,151,58,0.1)' },
                                ]}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.symbol, { color: isSelected ? Colors.gold : elementColor }]}>
                                    {item.symbol}
                                </Text>
                                <Text style={[styles.lagnaName, isSelected && { color: Colors.gold }]}>
                                    {item.name.split(' ')[0]}
                                </Text>
                                <Text style={styles.lord}>Lord: {item.lord}</Text>
                                <View style={[styles.elementPill, { backgroundColor: `${elementColor}22` }]}>
                                    <Text style={[styles.elementText, { color: elementColor }]}>{item.element}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    sheet: {
        backgroundColor: Colors.surface,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingTop: 20,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderColor: Colors.borderGold,
        maxHeight: '80%',
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: Colors.border,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 16,
    },
    title: {
        ...Typography.h4,
        textAlign: 'center',
        color: Colors.textGold,
    },
    subtitle: {
        ...Typography.caption,
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 4,
    },
    list: {
        paddingHorizontal: 20,
    },
    row: {
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    lagnaCard: {
        width: '48%',
        backgroundColor: Colors.surfaceElevated,
        borderRadius: Layout.radiusMd,
        padding: 14,
        borderWidth: 1.5,
        borderColor: Colors.border,
        alignItems: 'center',
    },
    symbol: {
        fontSize: 28,
        marginBottom: 6,
    },
    lagnaName: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.white,
        textAlign: 'center',
    },
    lord: {
        fontSize: 11,
        color: Colors.textMuted,
        marginTop: 4,
        textAlign: 'center',
    },
    elementPill: {
        marginTop: 8,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 20,
    },
    elementText: {
        fontSize: 10,
        fontWeight: '600',
    },
});