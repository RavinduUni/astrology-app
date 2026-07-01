import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Typography } from '../../constants/Typography';
import { useAuth } from '../../app/context/AuthContext';

export default function HomeHeader({
  name = 'Cosmic Soul',
  moonPhase = 'Waxing Gibbous',
  moonEmoji = '🌖',
  date = '',
  onNotificationPress,
}) {
  const router = useRouter();
  const { user } = useAuth();
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 60, friction: 12, useNativeDriver: true }),
    ]).start();
  }, []);

  const avatarUrl = user?.avatarUrl || null;

  return (
    <Animated.View
      style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
    >
      {/* Left — greeting */}
      <View style={styles.left}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.dateRow}>
          <Text style={styles.dateText}>{date}</Text>
        </View>
      </View>

      {/* Right — notification + avatar */}
      <View style={styles.right}>
        <TouchableOpacity
          onPress={onNotificationPress}
          style={styles.notifBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications-outline" size={22} color="white" />
          <View style={styles.notifBadge}>
            <Text style={styles.notifBadgeText}>3</Text>
          </View>
        </TouchableOpacity>

        {/* Avatar — tappable, navigates to profile */}
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/profile')}
          style={styles.avatar}
          activeOpacity={0.8}
        >
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatarImg} />
          ) : (
            <Ionicons name="person" size={22} color="white" />
          )}
        </TouchableOpacity>
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
  dateText: {
    fontSize: 14,
    color: Colors.goldLight,
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
    borderWidth: 2,
    borderColor: Colors.borderGold,
    overflow: 'hidden',
  },
  avatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
});