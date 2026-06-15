import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import { Typography } from '../../constants/Typography';
import { Ionicons } from '@expo/vector-icons';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];

const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 80 }, (_, i) => new Date().getFullYear() - i);
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

function WheelColumn({ items, selected, onSelect, width = 80 }) {
    return (
        <ScrollView
            style={{ width }}
            contentContainerStyle={styles.columnContent}
            showsVerticalScrollIndicator={false}
        >
            {items.map((item, i) => {
                const isSelected = String(item) === String(selected);
                return (
                    <TouchableOpacity
                        key={i}
                        onPress={() => onSelect(item)}
                        style={[styles.columnItem, isSelected && styles.columnItemSelected]}
                    >
                        <Text style={[styles.columnText, isSelected && styles.columnTextSelected]}>
                            {item}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}

export default function CosmicDatePicker({ visible, onClose, onConfirm, mode = 'date', value }) {
    const now = new Date();
    const [day, setDay] = useState(value?.day || now.getDate());
    const [month, setMonth] = useState(value?.month || MONTHS[now.getMonth()]);
    const [year, setYear] = useState(value?.year || now.getFullYear() - 22);
    const [hour, setHour] = useState(value?.hour || '08');
    const [minute, setMinute] = useState(value?.minute || '00');

    const handleConfirm = () => {
        if (mode === 'date') {
            onConfirm({ day, month, year });
        } else {
            onConfirm({ hour, minute });
        }
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="slide">
            <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1} />
            <View style={styles.sheet}>
                {/* Handle */}
                <View style={styles.handle} />

                <Text style={styles.title}>
                    {mode === 'date' ? <Ionicons name="calendar-outline" color={Colors.goldLight} size={20} /> : <Ionicons name="time-outline" color={Colors.goldLight} size={20} />}
                    <Text>  {mode === 'date' ? 'Select Birth Date' : 'Select Birth Time'}</Text>
                </Text>

                <View style={styles.columnsRow}>
                    {mode === 'date' ? (
                        <>
                            <WheelColumn items={DAYS} selected={day} onSelect={setDay} width={60} />
                            <WheelColumn items={MONTHS} selected={month} onSelect={setMonth} width={120} />
                            <WheelColumn items={YEARS} selected={year} onSelect={setYear} width={80} />
                        </>
                    ) : (
                        <>
                            <WheelColumn items={HOURS} selected={hour} onSelect={setHour} width={80} />
                            <Text style={styles.colon}>:</Text>
                            <WheelColumn items={MINUTES} selected={minute} onSelect={setMinute} width={80} />
                        </>
                    )}
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleConfirm} style={styles.confirmBtn}>
                        <Text style={styles.confirmText}>Confirm</Text>
                    </TouchableOpacity>
                </View>
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
        padding: 24,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderColor: Colors.borderGold,
        maxHeight: '65%',
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: Colors.border,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    title: {
        ...Typography.h4,
        textAlign: 'center',
        marginBottom: 20,
        color: Colors.textGold,
    },
    columnsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 20,
        height: 180,
        overflow: 'hidden',
    },
    columnItem: {
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    columnItemSelected: {
        backgroundColor: 'rgba(200,151,58,0.15)',
    },
    columnText: {
        fontSize: 15,
        color: Colors.textMuted,
        fontWeight: '400',
    },
    columnTextSelected: {
        fontSize: 17,
        color: Colors.goldLight,
        fontWeight: '700',
    },
    selectionBar: {
        position: 'absolute',
        left: 24,
        right: 24,
        top: '50%',
        height: 46,
        marginTop: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.borderGold,
        backgroundColor: 'rgba(200,151,58,0.06)',
    },
    colon: {
        fontSize: 24,
        color: Colors.textSecondary,
        fontWeight: '700',
        marginHorizontal: 8,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
    },
    cancelBtn: {
        flex: 1,
        height: 50,
        borderRadius: Layout.radiusFull,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.surfaceElevated,
    },
    cancelText: {
        ...Typography.bodyWhite,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    confirmBtn: {
        flex: 1,
        height: 50,
        borderRadius: Layout.radiusFull,
        backgroundColor: Colors.gold,
        alignItems: 'center',
        justifyContent: 'center',
    },
    confirmText: {
        ...Typography.bodyWhite,
        fontWeight: '700',
        color: Colors.white,
    },
});