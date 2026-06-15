import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CosmicBackground from '../../components/ui/Cosmicbackground';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import { Typography } from '../../constants/Typography';

const NOTIFICATIONS = [
  {
    id: '1',
    type: 'auspicious',
    icon: '🌟',
    title: 'Abhijit Muhurta Starting',
    body: 'The most powerful auspicious window opens in 15 minutes. Ideal for new beginnings.',
    time: '10:15 AM',
    unread: true,
  },
  {
    id: '2',
    type: 'warning',
    icon: '⚠️',
    title: 'Rahu Kaal Alert',
    body: 'Avoid important decisions between 08:15 – 09:45 AM today.',
    time: '08:00 AM',
    unread: true,
  },
  {
    id: '3',
    type: 'lucky',
    icon: '🎯',
    title: 'Your Lucky Hour',
    body: 'Venus transits your 5th house. Creative and romantic energies are heightened now.',
    time: 'Yesterday',
    unread: false,
  },
  {
    id: '4',
    type: 'report',
    icon: '📊',
    title: 'Monthly Report Ready',
    body: 'Your June 2026 astrology report has been generated. Tap to view full insights.',
    time: 'Jun 1',
    unread: false,
  },
  {
    id: '5',
    type: 'auspicious',
    icon: '💫',
    title: 'Full Moon in Scorpio',
    body: 'Tonight\'s full moon amplifies emotional depth and intuition. Journal your feelings.',
    time: 'May 31',
    unread: false,
  },
];

const TYPE_CONFIG = {
  auspicious: { color: '#4AFF8C', bg: 'rgba(74,255,140,0.08)', border: 'rgba(74,255,140,0.2)' },
  warning:    { color: '#FFB84A', bg: 'rgba(255,184,74,0.08)', border: 'rgba(255,184,74,0.2)' },
  lucky:      { color: Colors.gold, bg: 'rgba(200,151,58,0.08)', border: 'rgba(200,151,58,0.2)' },
  report:     { color: Colors.glowPurple, bg: 'rgba(107,78,255,0.08)', border: 'rgba(107,78,255,0.2)' },
};

function NotifCard({ notif }) {
  const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.report;
  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: cfg.bg, borderColor: notif.unread ? cfg.border : Colors.border },
      ]}
      activeOpacity={0.75}
    >
      <View style={[styles.iconCircle, { backgroundColor: `${cfg.color}18`, borderColor: `${cfg.color}35` }]}>
        <Text style={styles.cardIcon}>{notif.icon}</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle} numberOfLines={1}>{notif.title}</Text>
          {notif.unread && <View style={[styles.unreadDot, { backgroundColor: cfg.color }]} />}
        </View>
        <Text style={styles.cardText} numberOfLines={2}>{notif.body}</Text>
        <Text style={styles.cardTime}>{notif.time}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function NotificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <CosmicBackground>
      <StatusBar barStyle="light-content" />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <TouchableOpacity style={styles.markAllBtn}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        </View>

        {/* Unread count */}
        <View style={styles.countRow}>
          <View style={styles.countPill}>
            <Text style={styles.countText}>2 unread alerts</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Section: Today */}
          <Text style={styles.sectionLabel}>TODAY</Text>
          {NOTIFICATIONS.filter((n) => n.unread).map((n) => (
            <NotifCard key={n.id} notif={n} />
          ))}

          {/* Section: Earlier */}
          <Text style={[styles.sectionLabel, { marginTop: 20 }]}>EARLIER</Text>
          {NOTIFICATIONS.filter((n) => !n.unread).map((n) => (
            <NotifCard key={n.id} notif={n} />
          ))}

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Layout.padding,
    paddingVertical: 14,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  backIcon: { fontSize: 22, color: Colors.white, marginTop: -2 },
  headerTitle: { ...Typography.h3, flex: 1 },
  markAllBtn: { paddingVertical: 4, paddingHorizontal: 8 },
  markAllText: { fontSize: 12, color: Colors.textGold, fontWeight: '600' },

  countRow: { paddingHorizontal: Layout.padding, marginBottom: 12 },
  countPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(107,78,255,0.15)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(107,78,255,0.3)',
  },
  countText: { fontSize: 12, color: Colors.glowPurple, fontWeight: '600' },

  scroll: { paddingHorizontal: Layout.padding },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1.2,
    marginBottom: 10,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: Layout.radiusMd,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardIcon: { fontSize: 19 },
  cardBody: { flex: 1 },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
    flex: 1,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    flexShrink: 0,
  },
  cardText: {
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 18,
    marginBottom: 6,
  },
  cardTime: { fontSize: 10, color: Colors.textMuted, fontWeight: '500' },
});