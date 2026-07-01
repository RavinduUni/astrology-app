import React, { useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import CosmicBackground from '../../components/ui/Cosmicbackground';
import HomeSkeleton from '../../components/ui/LoadingSkeleton';
import HomeHeader from '../../components/home/HomeHeader';
import DailyHoroscopeCard from '../../components/home/DailyHoroscopeCard';
import LuckyStatsRow from '../../components/home/LuckyStatsRow';
import PlanetaryOverview from '../../components/home/PlanetaryOverview';
import QuickActions from '../../components/home/QuickActions';
import AuspiciousTimeline from '../../components/home/AuspiciousTimeline';

import { useAstroData } from '../../hooks/useAstroData';
import { useAuth } from '../context/AuthContext';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Layout } from '../../constants/Layout';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// ── Floating AI chat button ───────────────────────────────────────────────────
function FloatingAIButton({ onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.12, duration: 1800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 1800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const onPressIn = () => {
    Animated.spring(scale, { toValue: 0.92, useNativeDriver: true, speed: 50 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30 }).start();
  };

  return (
    <Animated.View style={[fabStyles.wrapper, { transform: [{ scale }] }]}>
      {/* Pulse ring */}
      <Animated.View style={[fabStyles.pulseRing, { transform: [{ scale: pulse }] }]} />
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        style={fabStyles.btn}
      >
        <Text style={fabStyles.icon}><Ionicons name="sparkles" size={24} color="white" /></Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const fabStyles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: Layout.tabBarHeight + 16,
    right: 20,
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: 'rgba(59,79,212,0.2)',
  },
  btn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.indigoBright,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
    gap: 1,
    ...Layout.indigoGlow,
  },
  icon: { fontSize: 20 },
  label: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 0.5,
  },
});

// ── Main Home Dashboard ───────────────────────────────────────────────────────
export default function HomeDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Auth context — provides the logged-in user info
  const { user, refreshDashboardData } = useAuth();

  // Astro data — reads from AuthContext.homeData (no extra API call)
  const { data, loading } = useAstroData();

  const [refreshing, setRefreshing] = React.useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  // Derive display name from user object (handles both decoded JWT and full user object)
  const displayName = user?.name || user?.id || 'Stargazer';

  // Parallax header opacity
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0.92],
    extrapolate: 'clamp',
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshDashboardData();
    } catch (_) {}
    setRefreshing(false);
  }, [refreshDashboardData]);

  const handleQuickAction = (id) => {
    if (id === 'chat') {
      router.push('/screens/ChatScreen');
    } else if (id === 'report') {
      router.push('/(tabs)/reports');
    }
  };

  return (
    <CosmicBackground style={styles.bg}>
      <StatusBar barStyle="light-content" />

      {loading ? (
        <View style={{ flex: 1, paddingTop: insets.top + 10 }}>
          <HomeSkeleton />
        </View>
      ) : (
        <>
          <Animated.ScrollView
            contentContainerStyle={[
              styles.scroll,
              { paddingTop: insets.top + 10 },
            ]}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.gold}
                colors={[Colors.gold]}
              />
            }
          >
            <View style={styles.innerPad}>
              {/* ── Header ── */}
              <Animated.View style={{ opacity: headerOpacity }}>
                <HomeHeader
                  name={displayName}
                  moonPhase={data?.moonPhase}
                  moonEmoji={data?.moonEmoji}
                  date={data?.date}
                  onNotificationPress={() => router.push('/screens/NotificationsScreen')}
                />
              </Animated.View>

              {/* ── Daily horoscope hero card ── */}
              <DailyHoroscopeCard data={data} />

              {/* ── Lucky stats ── */}
              <LuckyStatsRow data={data} />

              {/* ── Quick actions ── */}
              <QuickActions onActionPress={handleQuickAction} />

              {/* ── Planetary overview ── */}
              <PlanetaryOverview
                planets={data?.planets || []}
                onSeeAll={() => router.push('/(tabs)/starbase')}
              />

              {/* ── Auspicious timeline ── */}
              <AuspiciousTimeline
                onSeeAll={() => router.push('/screens/NotificationsScreen')}
              />

              {/* ── Bottom promo banner ── */}
              <PromoBanner onPress={() => router.push('/(tabs)/reports')} />

              {/* Extra bottom space for FAB + tab bar */}
              <View style={{ height: Layout.tabBarHeight + 80 }} />
            </View>
          </Animated.ScrollView>

          {/* ── Floating AI button ── */}
          <FloatingAIButton onPress={() => router.push('/screens/ChatScreen')} />
        </>
      )}
    </CosmicBackground>
  );
}

// Small promotional banner at bottom
function PromoBanner({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={promoStyles.banner} activeOpacity={0.85}>
      {/* Background glow */}
      <View style={promoStyles.glow} />
      <View style={promoStyles.content}>
        <View>
          <Text style={promoStyles.title}>✦ Unlock Full Report</Text>
          <Text style={promoStyles.sub}>Career · Love · Health · Life Path</Text>
        </View>
        <View style={promoStyles.badge}>
          <Text style={promoStyles.badgeText}>Premium</Text>
        </View>
      </View>
      <Text style={promoStyles.arrow}>→</Text>
    </TouchableOpacity>
  );
}

const promoStyles = StyleSheet.create({
  banner: {
    marginTop: 24,
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    borderWidth: 1.5,
    borderColor: Colors.borderGold,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    ...Layout.goldGlow,
  },
  glow: {
    position: 'absolute',
    left: -30,
    top: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(200,151,58,0.12)',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 3,
  },
  sub: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  badge: {
    backgroundColor: Colors.gold,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.white,
    letterSpacing: 0.5,
  },
  arrow: {
    fontSize: 20,
    color: Colors.gold,
    marginLeft: 8,
  },
});

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  innerPad: {
    paddingHorizontal: Layout.padding,
  },
});