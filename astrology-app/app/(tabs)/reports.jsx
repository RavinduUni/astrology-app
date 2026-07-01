import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
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

import { useAuth } from '../context/AuthContext';

// ── Icon map (icons can't come from the server — they're React elements) ──────
const DOMAIN_ICONS = {
  love:   <Ionicons name="heart-sharp"    size={18} color="white" />,
  career: <Ionicons name="briefcase-sharp" size={18} color="white" />,
  health: <Ionicons name="medkit-sharp"   size={18} color="white" />,
  wealth: <Ionicons name="wallet-sharp"   size={18} color="white" />,
};

// ── Loading skeleton for reports ──────────────────────────────────────────────
function ReportsLoadingScreen() {
  return (
    <View style={loadingStyles.container}>
      <View style={loadingStyles.header}>
        <View style={loadingStyles.titleBar} />
        <View style={loadingStyles.subtitleBar} />
      </View>
      <View style={loadingStyles.scoreCard} />
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={loadingStyles.domainCard} />
      ))}
      <ActivityIndicator
        size="large"
        color={Colors.gold}
        style={{ marginTop: 24 }}
      />
      <Text style={loadingStyles.loadingText}>
        ✦ Generating your cosmic report…
      </Text>
    </View>
  );
}

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Layout.padding,
    paddingTop: 20,
    gap: 12,
  },
  header: { gap: 8, marginBottom: 8 },
  titleBar: {
    height: 22,
    width: '60%',
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  subtitleBar: {
    height: 14,
    width: '40%',
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  scoreCard: {
    height: 120,
    borderRadius: Layout.radiusLg,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  domainCard: {
    height: 72,
    borderRadius: Layout.radiusLg,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  loadingText: {
    textAlign: 'center',
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 12,
    letterSpacing: 0.3,
  },
});

// ── Coming-soon placeholder for non-daily report types ───────────────────────
function ComingSoonCard({ type }) {
  const TYPE_DATA = {
    weekly:  { title: 'Weekly Overview', sub: 'Your 7-day cosmic forecast is being prepared' },
    monthly: { title: 'Monthly Report',  sub: 'Monthly trends and opportunities coming soon' },
    yearly:  { title: 'Yearly Forecast', sub: 'Full-year life path reading coming soon' },
  };
  const d = TYPE_DATA[type] || TYPE_DATA.weekly;
  return (
    <View style={comingStyles.card}>
      <View style={comingStyles.glow} />
      <Text style={comingStyles.icon}>🔮</Text>
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

// ── Section header ────────────────────────────────────────────────────────────
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

// ── Small inline profile detail pill ─────────────────────────────────────────
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

// ── Main Reports Screen ───────────────────────────────────────────────────────
export default function ReportsScreen() {
  const insets = useSafeAreaInsets();
  const [reportType, setReportType] = useState('daily');
  const [refreshing, setRefreshing] = useState(false);

  // All report data comes from AuthContext — no repeated API calls
  const { reportsData, reportsDataLoading, refreshDashboardData } = useAuth();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshDashboardData();
    } catch (_) {}
    setRefreshing(false);
  }, [refreshDashboardData]);

  const handleShare = async () => {
    const profile = reportsData?.userProfile;
    const score   = reportsData?.cosmicScore ?? '–';
    try {
      await Share.share({
        message: `✦ My Cosmiq Daily Report — ${today}\n\nCosmic Score: ${score}/100\nSign: ${profile?.sign ?? ''} ${profile?.signSymbol ?? ''}\n\nDownload Cosmiq for your personalised astrology reports.`,
        title: 'Cosmiq Daily Report',
      });
    } catch (_) {}
  };

  // ── Derive display data ───────────────────────────────────────────────────
  const profile = reportsData?.userProfile || {};

  // Attach icons to domains (icons are React elements, can't be stored in DB)
  const domains = (reportsData?.domains || []).map((d) => ({
    ...d,
    icon: DOMAIN_ICONS[d.id] || DOMAIN_ICONS.love,
  }));

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
            userName={profile.name || 'Stargazer'}
            sign={profile.sign || '–'}
            signSymbol={profile.signSymbol || '✦'}
            signColor={profile.signColor || Colors.gold}
            date={today}
            onShare={handleShare}
          />

          {/* ── Report Type Selector ── */}
          <ReportTypeSelector selected={reportType} onSelect={setReportType} />

          {reportType === 'daily' ? (
            <>
              {/* ── Loading state ── */}
              {reportsDataLoading && (
                <View style={{ paddingTop: insets.top + 10 }}>
                  <ReportsLoadingScreen />
                </View>
              )}

              {/* ── Loaded state ── */}
              {!reportsDataLoading && reportsData && (
                <>
                  {/* ── Cosmic Score Card ── */}
                  <DailyScoreCard
                    score={reportsData.cosmicScore}
                    domains={domains}
                    signColor={profile.signColor || Colors.gold}
                  />

                  {/* ── Domain Reports ── */}
                  <SectionHeader title="Life Domain Reports" />
                  {domains.map((domain) => (
                    <DomainExpandCard key={domain.id} domain={domain} />
                  ))}

                  {/* ── Planet Influences ── */}
                  <PlanetInfluenceStrip planets={reportsData.planets || []} />

                  {/* ── Auspicious Timings ── */}
                  <AuspiciousTimingsCard slots={reportsData.auspiciousSlots || []} />

                  {/* ── Remedies ── */}
                  <RemediesCard remedies={reportsData.remedies || []} />

                  {/* ── Life Timeline ── */}
                  <View style={styles.timelineSection}>
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>Life Path Forecast</Text>
                      <Text style={styles.sectionSub}>Major planetary periods</Text>
                    </View>
                    <View style={styles.timelineCard}>
                      <View style={styles.timelineGlow} />
                      <LifeTimelineCard events={reportsData.lifeTimeline || []} />
                    </View>
                  </View>

                  {/* ── User birth profile strip ── */}
                  <View style={styles.profileStrip}>
                    <View style={styles.profileGlow} />
                    <Text style={styles.profileLabel}>Report based on</Text>
                    <View style={styles.profileDetails}>
                      {profile.birthDate ? (
                        <ProfilePill
                          icon={<MaterialCommunityIcons name="cake" size={16} color="white" />}
                          label={profile.birthDate}
                        />
                      ) : null}
                      {profile.birthCity ? (
                        <ProfilePill
                          icon={<MaterialCommunityIcons name="map-marker-radius" size={16} color="white" />}
                          label={profile.birthCity}
                        />
                      ) : null}
                      {profile.lagna ? (
                        <ProfilePill
                          icon={<MaterialCommunityIcons name="star" size={16} color="white" />}
                          label={`Lagna: ${profile.lagna}`}
                        />
                      ) : null}
                    </View>
                  </View>
                </>
              )}

              {/* ── No data fallback ── */}
              {!reportsDataLoading && !reportsData && (
                <View style={styles.errorBox}>
                  <Text style={styles.errorIcon}>🌌</Text>
                  <Text style={styles.errorTitle}>Report Unavailable</Text>
                  <Text style={styles.errorSub}>
                    Pull down to refresh and generate your cosmic report.
                  </Text>
                </View>
              )}
            </>
          ) : (
            <ComingSoonCard type={reportType} />
          )}

        </View>
      </ScrollView>
    </CosmicBackground>
  );
}

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

  // Error / empty state
  errorBox: {
    marginTop: 40,
    alignItems: 'center',
    gap: 12,
    padding: 32,
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusXl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  errorIcon: { fontSize: 48 },
  errorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  errorSub: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});