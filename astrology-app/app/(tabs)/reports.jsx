import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Share } from 'react-native';

import CosmicBackground from '../../components/ui/Cosmicbackground';
import ReportsHeader from '../../components/reports/ReportsHeader';
import ReportTypeSelector from '../../components/reports/ReportTypeSelector';
import DailyScoreCard from '../../components/reports/DailyScoreCard';
import DomainExpandCard from '../../components/reports/DomainExpandCard';
import PlanetInfluenceStrip from '../../components/reports/PlanetInfluenceStrip';
import AuspiciousTimingsCard from '../../components/reports/AuspiciousTimingsCard';
import RemediesCard from '../../components/reports/RemediesCard';
import LifeTimelineCard from '../../components/reports/LifeTimelineCard';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Layout } from '../../constants/Layout';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

// ── Mock data (replace with API calls to backend endpoints) ────────────────
// Endpoint: GET /api/user/profile
const USER_PROFILE = {
  name: 'Arya Silva',
  sign: 'Leo',
  signSymbol: '♌',
  signColor: '#FFB84A',
  lagna: 'Scorpio',
  birthDate: '15 August 1995',
  birthCity: 'Colombo, Sri Lanka',
};

// Endpoint: GET /api/reports/daily?userId=&date=
function generateDailyReport(seed = 1) {
  const rand = (n) => Math.floor((seed * 1664525 + 1013904223) % n);
  return {
    // Overall cosmic score
    cosmicScore: 78,

    // Endpoint: GET /api/reports/domains?userId=&date=&domain=love|career|health|wealth
    domains: [
      {
        id: 'love',
        icon: <Ionicons name="heart-sharp" size={18} color='white' />,
        label: 'Love & Relationships',
        color: '#FF6B8A',
        score: 84,
        summary: 'Venus shines beautifully in your 5th house',
        detail:
          'Venus entering your 5th house brings warmth, attraction and emotional depth to all your relationships today. Single Leo natives may encounter someone with a meaningful connection. For couples, this is an ideal day for deep conversation and quality time.',
        subScores: [
          { label: 'Romance',    value: 88 },
          { label: 'Harmony',   value: 80 },
          { label: 'Intimacy',  value: 83 },
        ],
        tips: [
          'Express your feelings openly — vulnerability is your strength today.',
          'Plan an evening activity that involves creativity or art.',
          'Avoid confrontational discussions after 9 PM.',
        ],
      },
      {
        id: 'career',
        icon: <Ionicons name="briefcase-sharp" size={18} color='white' />,
        label: 'Career & Success',
        color: '#4AD4FF',
        score: 72,
        summary: 'Mercury sharpens your analytical mind',
        detail:
          'Mercury in your 10th house boosts communication skills and intellectual clarity. Presentations, negotiations and written work are strongly favoured. A senior colleague or authority figure may take notice of your efforts. Avoid making major financial decisions before noon.',
        subScores: [
          { label: 'Focus',      value: 78 },
          { label: 'Influence',  value: 70 },
          { label: 'Progress',   value: 68 },
        ],
        tips: [
          'Schedule important meetings between 10 AM – 1 PM.',
          'Your creative ideas will be well-received — speak up in team discussions.',
          'Double-check contracts or documents before signing.',
        ],
      },
      {
        id: 'health',
        icon: <Ionicons name="medkit-sharp" size={18} color='white' />,
        label: 'Health & Vitality',
        color: '#4AFF8C',
        score: 75,
        summary: 'Moderate energy levels, prioritise rest',
        detail:
          'Mars in your 8th house indicates high physical drive but also a risk of overexertion. Your immune system is slightly sensitive today. Stay well-hydrated, avoid skipping meals and give yourself adequate rest. Yoga or gentle stretching will be more beneficial than intense workouts.',
        subScores: [
          { label: 'Physical',  value: 70 },
          { label: 'Mental',    value: 82 },
          { label: 'Immunity',  value: 73 },
        ],
        tips: [
          'Start the day with warm water infused with ginger and honey.',
          'Take short breaks during work to avoid eye or back strain.',
          'Aim for at least 7 hours of sleep tonight.',
        ],
      },
      {
        id: 'wealth',
        icon: <Ionicons name="wallet-sharp" size={18} color='white' />,
        label: 'Wealth & Finance',
        color: '#C8973A',
        score: 65,
        summary: 'Saturn urges caution in spending',
        detail:
          'Saturn\'s influence on your 2nd house counsels financial discipline today. Income flows are stable but unexpected expenses may arise. This is a good day for budgeting and reviewing existing investments, but avoid speculative moves or large purchases. Long-term financial planning will be highly rewarding.',
        subScores: [
          { label: 'Income',    value: 70 },
          { label: 'Savings',   value: 68 },
          { label: 'Investment',value: 57 },
        ],
        tips: [
          'Track all expenditures today — small leaks cause large deficits.',
          'Revisit your savings goals and adjust where needed.',
          'Avoid gambling, speculation or impulsive purchases.',
        ],
      },
    ],

    // Endpoint: GET /api/reports/planet-transits?userId=&date=
    planets: [
      { name: 'Sun',     symbol: '☉', position: 'Gemini',   house: '10th', influence: 'positive' },
      { name: 'Moon',    symbol: '☾', position: 'Scorpio',  house: '3rd',  influence: 'neutral'  },
      { name: 'Mercury', symbol: '☿', position: 'Cancer',   house: '11th', influence: 'positive' },
      { name: 'Venus',   symbol: '♀', position: 'Leo',      house: '12th', influence: 'positive' },
      { name: 'Mars',    symbol: '♂', position: 'Aries',    house: '8th',  influence: 'caution'  },
      { name: 'Jupiter', symbol: '♃', position: 'Taurus',   house: '9th',  influence: 'positive' },
      { name: 'Saturn',  symbol: '♄', position: 'Aquarius', house: '6th',  influence: 'neutral'  },
      { name: 'Rahu',    symbol: '☊', position: 'Pisces',   house: '7th',  influence: 'caution'  },
      { name: 'Ketu',    symbol: '☋', position: 'Virgo',    house: '1st',  influence: 'neutral'  },
    ],

    // Endpoint: GET /api/reports/auspicious-timings?userId=&date=
    timings: [
      { time: '06:00 – 07:30 AM', type: 'best',  activity: 'Meditation, puja and important decisions' },
      { time: '09:15 – 10:45 AM', type: 'best',  activity: 'Business meetings and creative work' },
      { time: '12:00 – 01:30 PM', type: 'good',  activity: 'Financial discussions' },
      { time: '02:30 – 04:00 PM', type: 'avoid', activity: 'Avoid signing contracts (Rahu Kalam)' },
      { time: '06:30 – 08:00 PM', type: 'good',  activity: 'Social interactions and romance' },
      { time: '10:00 PM+',        type: 'avoid', activity: 'Avoid major decisions — energy is low' },
    ],

    // Endpoint: GET /api/reports/remedies?userId=&date=
    remedies: [
      {
        type: 'Gemstone',
        icon: <MaterialCommunityIcons name="diamond" size={18} color="white" />,
        value: 'Ruby',
        desc: 'Wear on ring finger',
        color: '#FF6B8A',
      },
      {
        type: 'Lucky Color',
        icon: <Ionicons name="color-palette-sharp" size={18} color='white' />,
        value: 'Golden Yellow',
        desc: 'Wear or carry this color',
        color: '#FFB84A',
      },
      {
        type: 'Fasting',
        icon: <MaterialCommunityIcons name="food-variant" size={18} color='white' />,
        value: 'Sunday',
        desc: 'Sun deity fasting ritual',
        color: '#4AFF8C',
      },
      {
        type: 'Mantra',
        icon: <MaterialCommunityIcons name="book-music" size={18} color='white' />,
        value: 'Om Suryaya Namah',
        desc: 'Sun mantra for strength',
        color: '#C8973A',
        fullMantra: 'ॐ सूर्याय नमः',
      },
    ],

    // Endpoint: GET /api/reports/yearly?userId=&year=  (life timeline data)
    lifeTimeline: [
      { year: '2024–25', label: 'Jupiter transit activates career breakthroughs. Expect recognition and new leadership opportunities.' },
      { year: '2025–26', label: 'Saturn matures your long-term goals. A period of disciplined growth and spiritual advancement.' },
      { year: '2026–27', label: 'Rahu brings transformative change in residence or career location. International opportunities may arise.' },
      { year: '2028+',   label: 'Jupiter in Scorpio marks a golden period for marriage prospects and deep personal evolution.' },
    ],
  };
}

// Coming-soon placeholder for non-daily report types
function ComingSoonCard({ type }) {
  const TYPE_DATA = {
    weekly:  { icon: <Ionicons name="calendar-sharp" size={18} color='white' />, title: 'Weekly Overview', sub: 'Your 7-day cosmic forecast is being prepared' },
    monthly: { icon: <Ionicons name="moon-sharp" size={18} color='white' />, title: 'Monthly Report',  sub: 'Monthly trends and opportunities coming soon' },
    yearly:  { icon: <Ionicons name="star-sharp" size={18} color='white' />, title: 'Yearly Forecast', sub: 'Full-year life path reading coming soon' },
  };
  const d = TYPE_DATA[type] || TYPE_DATA.weekly;
  return (
    <View style={comingStyles.card}>
      <View style={comingStyles.glow} />
      <Text style={comingStyles.icon}>{d.icon}</Text>
      <Text style={comingStyles.title}>{d.title}</Text>
      <Text style={comingStyles.sub}>{d.sub}</Text>
      <View style={comingStyles.badge}>
        <Text style={comingStyles.badgeText}>⭐ Premium Feature</Text>
      </View>
    </View>
  );
}

const comingStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusXl,
    borderWidth: 1.5,
    borderColor: Colors.borderGold,
    padding: 40,
    alignItems: 'center',
    gap: 12,
    overflow: 'hidden',
    marginTop: 16,
    ...Layout.goldGlow,
  },
  glow: {
    position: 'absolute',
    top: -40,
    left: -40,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(200,151,58,0.08)',
  },
  icon: { fontSize: 48 },
  title: { ...Typography.h3, textAlign: 'center' },
  sub: { ...Typography.body, textAlign: 'center', color: Colors.textMuted },
  badge: {
    backgroundColor: 'rgba(200,151,58,0.15)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.gold,
    marginTop: 8,
  },
  badgeText: {
    fontSize: 12,
    color: Colors.goldLight,
    fontWeight: '700',
  },
});

// Section header subcomponent
function SectionHeader({ title }) {
  return (
    <View style={secStyles.row}>
      <Text style={secStyles.title}>{title}</Text>
    </View>
  );
}
const secStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, marginTop: 26 },
  title: { fontSize: 14, fontWeight: '700', color: Colors.textGold },
});

// ── Main Reports Screen ────────────────────────────────────────────────────
export default function ReportsScreen() {
  const insets = useSafeAreaInsets();
  const [reportType, setReportType] = useState('daily');
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const report = generateDailyReport(refreshKey);
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 1200));
    setRefreshKey((k) => k + 1);
    setRefreshing(false);
  }, []);

  const handleShare = async () => {
    // Endpoint: POST /api/reports/share
    try {
      await Share.share({
        message: `✦ My Cosmiq Daily Report — ${today}\n\nCosmic Score: ${report.cosmicScore}/100\nSign: ${USER_PROFILE.sign} ${USER_PROFILE.signSymbol}\n\nDownload Cosmiq for your personalised astrology reports.`,
        title: 'Cosmiq Daily Report',
      });
    } catch (_) {}
  };

  return (
    <CosmicBackground>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 10, paddingBottom: Layout.tabBarHeight + 40 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.gold}
            colors={[Colors.gold]}
          />
        }
      >
        <View style={styles.inner}>

          {/* ── Header ── */}
          <ReportsHeader
            userName={USER_PROFILE.name}
            sign={USER_PROFILE.sign}
            signSymbol={USER_PROFILE.signSymbol}
            signColor={USER_PROFILE.signColor}
            date={today}
            onShare={handleShare}
          />

          {/* ── Report Type Selector ── */}
          <ReportTypeSelector selected={reportType} onSelect={setReportType} />

          {reportType === 'daily' ? (
            <>
              {/* ── Cosmic Score Card ── */}
              <DailyScoreCard
                score={report.cosmicScore}
                domains={report.domains}
                signColor={USER_PROFILE.signColor}
              />

              {/* ── Domain Reports ── */}
              <SectionHeader title="Life Domain Reports" />
              {report.domains.map((domain) => (
                <DomainExpandCard key={domain.id} domain={domain} />
              ))}

              {/* ── Planet Influences ── */}
              <PlanetInfluenceStrip planets={report.planets} />

              {/* ── Auspicious Timings ── */}
              <AuspiciousTimingsCard slots={report.timings} />

              {/* ── Remedies ── */}
              <RemediesCard remedies={report.remedies} />

              {/* ── Life Timeline ── */}
              <View style={styles.timelineSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Life Path Forecast</Text>
                  <Text style={styles.sectionSub}>Major planetary periods</Text>
                </View>
                <View style={styles.timelineCard}>
                  <View style={styles.timelineGlow} />
                  <LifeTimelineCard events={report.lifeTimeline} />
                </View>
              </View>

              {/* ── User birth profile strip ── */}
              <View style={styles.profileStrip}>
                <View style={styles.profileGlow} />
                <Text style={styles.profileLabel}>Report based on</Text>
                <View style={styles.profileDetails}>
                  <ProfilePill icon={<MaterialCommunityIcons name="cake" size={16} color="white" />} label={USER_PROFILE.birthDate} />
                  <ProfilePill icon={<MaterialCommunityIcons name="map-marker-radius" size={16} color="white" />} label={USER_PROFILE.birthCity} />
                  <ProfilePill icon={<MaterialCommunityIcons name="star" size={16} color="white" />} label={`Lagna: ${USER_PROFILE.lagna}`} />
                </View>
              </View>
            </>
          ) : (
            <ComingSoonCard type={reportType} />
          )}

        </View>
      </ScrollView>
    </CosmicBackground>
  );
}

// Small inline profile detail pill
function ProfilePill({ icon, label }) {
  return (
    <View style={pillStyles.pill}>
      <Text style={pillStyles.icon}>{icon}</Text>
      <Text style={pillStyles.label}>{label}</Text>
    </View>
  );
}

const pillStyles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Layout.radiusFull,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  icon: { fontSize: 12 },
  label: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
  },
  inner: {
    paddingHorizontal: Layout.padding,
  },

  // Life timeline
  timelineSection: {
    marginTop: 26,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textGold,
  },
  sectionSub: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  timelineCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 18,
    overflow: 'hidden',
  },
  timelineGlow: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(107,78,255,0.08)',
  },

  // Profile strip
  profileStrip: {
    marginTop: 24,
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    overflow: 'hidden',
    gap: 10,
  },
  profileGlow: {
    position: 'absolute',
    bottom: -20,
    left: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(200,151,58,0.06)',
  },
  profileLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  profileDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});