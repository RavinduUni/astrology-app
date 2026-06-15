import React, { useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// ── Tab definitions ────────────────────────────────────────────────────────
const TABS = [
  { name: 'index',    label: 'Discover',    icon: '🔭' },
  { name: 'discover', label: 'Astrologers', icon: '🌙' },
  { name: 'starbase', label: 'Starbase',    icon: '🪐', center: true },
  { name: 'reports',  label: 'Consultant',  icon: '💬' },
  { name: 'profile',  label: 'Profile',     icon: '👤', badge: 5 },
];

// ── Zodiac arc labels above center button ─────────────────────────────────
const ARC_LABELS = ['Taurus', 'Aries', 'Pisces'];

function ZodiacArcStrip() {
  return (
    <View style={arcStyles.container} pointerEvents="none">
      {ARC_LABELS.map((label, i) => (
        <View key={label} style={arcStyles.labelWrap}>
          <Text style={[arcStyles.label, i === 1 && arcStyles.labelCenter]}>
            {label}
          </Text>
        </View>
      ))}
    </View>
  );
}

const arcStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: -22,
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 10,
    alignItems: 'center',
  },
  labelWrap: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  label: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.35)',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  labelCenter: {
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '700',
    fontSize: 10,
  },
});

// ── Center (Starbase) elevated button ────────────────────────────────────
function CenterTab({ isFocused, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0.6, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.91, useNativeDriver: true, speed: 50 }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30 }).start();

  return (
    <View style={centerStyles.wrapper}>
      {/* Zodiac arc labels */}
      <ZodiacArcStrip />

      {/* Outer glow pulse ring */}
      <Animated.View style={[centerStyles.pulseRing, { opacity: glow }]} />

      {/* Elevated button */}
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          activeOpacity={1}
          style={[centerStyles.btn, isFocused && centerStyles.btnActive]}
        >
          {/* Inner ring decoration */}
          <View style={centerStyles.innerRing} />
          <Text style={centerStyles.icon}>🪐</Text>
        </TouchableOpacity>
      </Animated.View>

      <Text style={[centerStyles.label, isFocused && centerStyles.labelActive]}>
        Starbase
      </Text>
    </View>
  );
}

const centerStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 6,
    // Pull the button up above the bar
    marginTop: -46,
  },
  pulseRing: {
    position: 'absolute',
    top: 4,
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(59,79,212,0.18)',
  },
  btn: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#1E2460',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: 'rgba(100,120,255,0.5)',
    shadowColor: '#3B4FD4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 16,
    elevation: 16,
  },
  btnActive: {
    backgroundColor: '#2A35A0',
    borderColor: 'rgba(150,170,255,0.7)',
  },
  innerRing: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  icon: { fontSize: 28 },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.45)',
    marginTop: 5,
    textAlign: 'center',
  },
  labelActive: { color: '#FFFFFF' },
});

// ── Regular tab item ──────────────────────────────────────────────────────
function RegularTab({ tab, isFocused, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.90, useNativeDriver: true, speed: 50 }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30 }).start();

  return (
    <Animated.View style={[styles.tabItem, { transform: [{ scale }] }]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        style={styles.tabTouch}
      >
        {/* Icon container — white filled circle when active */}
        <View style={[styles.iconBox, isFocused && styles.iconBoxActive]}>
          <Text style={[styles.tabIcon, isFocused && styles.tabIconActive]}>
            {tab.icon}
          </Text>

          {/* Notification badge */}
          {tab.badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{tab.badge}</Text>
            </View>
          ) : null}
        </View>

        <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
          {tab.label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Main BottomTabBar ─────────────────────────────────────────────────────
export default function BottomTabBar({ state, descriptors, navigation }) {
  return (
    <View style={styles.outerWrap}>
      {/* The arc bar */}
      <View style={styles.barContainer}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const tab = TABS.find((t) => t.name === route.name) || {
            label: route.name,
            icon: '●',
          };

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          if (tab.center) {
            return (
              <CenterTab
                key={route.key}
                isFocused={isFocused}
                onPress={onPress}
              />
            );
          }

          return (
            <RegularTab
              key={route.key}
              tab={tab}
              isFocused={isFocused}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
}

const BAR_HEIGHT = 68;

const styles = StyleSheet.create({
  outerWrap: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 22 : 10,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },

  // The main bar — dark navy pill shape matching the reference
  barContainer: {
    width: '97%',
    height: BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#141430',
    borderRadius: 36,
    borderWidth: 1,
    borderColor: 'rgba(100,110,200,0.25)',
    paddingHorizontal: 8,
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },

  // Regular tab
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tabTouch: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
  },

  // Icon box — dark rounded square by default, white circle when active
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#1E1E40',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconBoxActive: {
    width: 44,
    height: 44,
    borderRadius: 22,          // full circle when active
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  tabIcon: {
    fontSize: 19,
  },
  tabIconActive: {
    fontSize: 20,
  },

  // Label
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
  },
  tabLabelActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // Notification badge
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FF6B35',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#141430',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});