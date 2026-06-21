import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';

import CosmicBackground from '../../components/ui/Cosmicbackground';
import GlassCard from '../../components/ui/GlassCard';
import GlowButton from '../../components/ui/GlowButton';
import CosmicInput from '../../components/ui/CosmicInput';
import CosmicDatePicker from '../../components/auth/CosmicDatePicker';
import CityPicker from '../../components/auth/CityPicker';
import LagnaPicker from '../../components/auth/LagnaPicker';
import SocialLoginButtons from '../../components/auth/SocialLoginButtons';

import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Layout } from '../../constants/Layout';
import { Ionicons } from '@expo/vector-icons';
import { authRegister } from '../../services/auth';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const TOTAL_STEPS = 2;

// Step indicator dots
function StepIndicator({ step }) {
  return (
    <View style={stepStyles.row}>
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <View key={i} style={stepStyles.dotWrap}>
          <View
            style={[
              stepStyles.dot,
              i < step && stepStyles.dotDone,
              i === step && stepStyles.dotActive,
            ]}
          >
            {i < step ? (
              <Text style={stepStyles.checkmark}>✓</Text>
            ) : (
              <Text style={[stepStyles.dotNum, i === step && stepStyles.dotNumActive]}>
                {i + 1}
              </Text>
            )}
          </View>
          {i < TOTAL_STEPS - 1 && (
            <View style={[stepStyles.line, i < step - 0 && stepStyles.lineDone]} />
          )}
        </View>
      ))}
    </View>
  );
}

const stepStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 28 },
  dotWrap: { flexDirection: 'row', alignItems: 'center' },
  dot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotActive: { borderColor: Colors.gold, backgroundColor: 'rgba(200,151,58,0.15)' },
  dotDone: { backgroundColor: Colors.gold, borderColor: Colors.gold },
  dotNum: { fontSize: 13, fontWeight: '700', color: Colors.textMuted },
  dotNumActive: { color: Colors.gold },
  checkmark: { fontSize: 14, color: Colors.white, fontWeight: '700' },
  line: { width: 48, height: 1.5, backgroundColor: Colors.border, marginHorizontal: 6 },
  lineDone: { backgroundColor: Colors.gold },
});

// Zodiac gender options
const GENDERS = [
  { label: 'Male', icon: <Ionicons name="male-outline" color={Colors.goldLight} size={20} /> },
  { label: 'Female', icon: <Ionicons name="female-outline" color={Colors.goldLight} size={20} /> },
  { label: 'Other', icon: <Ionicons name="transgender-outline" color={Colors.goldLight} size={20} /> },
];

export default function RegisterScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Step 1 — account details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');

  // Step 2 — birth details
  const [birthDate, setBirthDate] = useState(null);
  const [birthTime, setBirthTime] = useState(null);
  const [city, setCity] = useState(null);
  const [lagna, setLagna] = useState(null);

  // Picker visibility
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showLagnaPicker, setShowLagnaPicker] = useState(false);

  // Errors
  const [errors, setErrors] = useState({});

  // Animation
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 60, friction: 12 }),
    ]).start();
  }, []);

  const animateStep = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  };

  const validateStep0 = () => {
    const e = {};
    if (!name.trim()) e.name = 'Full name is required';
    if (!email.includes('@')) e.email = 'Enter a valid email';
    if (password.length < 6) e.password = 'Min 6 characters required';
    if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!gender) e.gender = 'Please select your gender';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep1 = () => {
    const e = {};
    if (!birthDate) e.birthDate = 'Please select your birth date';
    if (!city) e.city = 'Please select your birth city';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 0 && !validateStep0()) return;
    animateStep();
    setStep(step + 1);
  };

  const handleBack = () => {
    animateStep();
    setStep(step - 1);
  };

  const handleRegister = async () => {
    if (!validateStep1()) return;
    setLoading(true);
    setApiError('');
    try {
      const { token, user } = await authRegister({
        name,
        email,
        password,
        gender,
        birthDate: birthDate ? `${birthDate.year}-${String(birthDate.month).padStart(2,'0')}-${String(birthDate.day).padStart(2,'0')}` : null,
        birthTime: birthTime ? `${birthTime.hour}:${birthTime.minute}` : null,
        birthCity: city ? `${city.name}, ${city.country}` : null,
        lagna: lagna?.name ?? null,
      });
      await login(token, user);
      router.replace('/(tabs)');
    } catch (err) {
      setApiError(err.message ?? 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) => d ? `${d.day} ${d.month} ${d.year}` : '';
  const formatTime = (t) => t ? `${t.hour}:${t.minute}` : '';

  return (
    <CosmicBackground>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            {step > 0 && (
              <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
                <Text style={styles.backIcon}>‹</Text>
              </TouchableOpacity>
            )}
            <View style={styles.headerCenter}>
              <Text style={styles.appName}>✦ COSMIQ ✦</Text>
              <Text style={styles.headerTitle}>
                {step === 0 ? 'Create Your Account' : 'Your Cosmic Profile'}
              </Text>
              <Text style={styles.headerSub}>
                {step === 0
                  ? 'Begin your astral journey'
                  : 'Precise birth details unlock accurate predictions'}
              </Text>
            </View>
          </View>

          {/* Step indicator */}
          <StepIndicator step={step} />

          {/* Card */}
          <Animated.View style={{ opacity: fadeAnim }}>
            <GlassCard
              style={styles.card}
              radius={Layout.radiusXl}
              borderColor={Colors.borderGold}
              glowColor={Colors.glowPurple}
            >
              {step === 0 ? (
                // ─── STEP 1: Account Details ────────────────────────
                <View>
                  <View style={styles.sectionLabel}>
                    <Ionicons name="person-outline" color={Colors.goldLight} size={20} />
                    <Text style={styles.sectionTitle}>Account Details</Text>
                  </View>

                  <CosmicInput
                    label="Full Name"
                    placeholder="Your full name"
                    value={name}
                    onChangeText={setName}
                    icon={<Ionicons name="person-outline" color={Colors.goldLight} size={18} />}
                    error={errors.name}
                  />
                  <CosmicInput
                    label="Email Address"
                    placeholder="your@email.com"
                    value={email}
                    onChangeText={setEmail}
                    icon={<Ionicons name="mail-outline" color={Colors.goldLight} size={18} />}
                    keyboardType="email-address"
                    error={errors.email}
                  />
                  <CosmicInput
                    label="Password"
                    placeholder="Create a password"
                    value={password}
                    onChangeText={setPassword}
                    icon={<Ionicons name="lock-closed-outline" color={Colors.goldLight} size={18} />}
                    secureTextEntry
                    error={errors.password}
                  />
                  <CosmicInput
                    label="Confirm Password"
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    icon={<Ionicons name="lock-closed-outline" color={Colors.goldLight} size={18} />}
                    secureTextEntry
                    error={errors.confirmPassword}
                  />

                  {/* Gender selector */}
                  <Text style={styles.genderLabel}>GENDER</Text>
                  <View style={styles.genderRow}>
                    {GENDERS.map((g) => (
                      <TouchableOpacity
                        key={g.label}
                        onPress={() => setGender(g.label)}
                        style={[
                          styles.genderBtn,
                          gender === g.label && styles.genderBtnActive,
                        ]}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.genderIcon}>{g.icon}</Text>
                        <Text
                          style={[
                            styles.genderText,
                            gender === g.label && styles.genderTextActive,
                          ]}
                        >
                          {g.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {errors.gender ? (
                    <Text style={styles.errorText}>{errors.gender}</Text>
                  ) : null}

                  <GlowButton
                    label="Continue"
                    onPress={handleNext}
                    style={styles.actionBtn}
                    icon={<Ionicons name="arrow-forward-outline" color={Colors.goldLight} size={18} />}
                  />

                </View>
              ) : (
                // ─── STEP 2: Birth Details ──────────────────────────
                <View>
                  <View style={styles.sectionLabel}>
                    <Ionicons name="calendar-outline" color={Colors.goldLight} size={20} />
                    <Text style={styles.sectionTitle}>Birth Details</Text>
                  </View>

                  <Text style={styles.astroNote}>
                    ✦ Your birth details help us calculate your exact natal chart,
                    planetary positions, and life predictions.
                  </Text>

                  {/* Birth Date */}
                  <CosmicInput
                    label="Birth Date"
                    placeholder="Select your date of birth"
                    value={formatDate(birthDate)}
                    icon={<Ionicons name="calendar-outline" color={Colors.goldLight} size={20} />}
                    rightIcon={<Ionicons name="arrow-forward" color={Colors.goldLight} size={20} />}
                    onPress={() => setShowDatePicker(true)}
                    editable={false}
                    error={errors.birthDate}
                  />

                  {/* Birth Time */}
                  <CosmicInput
                    label="Birth Time (Optional)"
                    placeholder="Select your time of birth"
                    value={formatTime(birthTime)}
                    icon={<Ionicons name="time-outline" color={Colors.goldLight} size={20} />}
                    rightIcon={<Ionicons name="arrow-forward" color={Colors.goldLight} size={20} />}
                    onPress={() => setShowTimePicker(true)}
                    editable={false}
                  />

                  {/* Birth City */}
                  <CosmicInput
                    label="Birth City"
                    placeholder="Select your birth city"
                    value={city ? `${city.flag} ${city.name}, ${city.country}` : ''}
                    icon={<Ionicons name="location-outline" color={Colors.goldLight} size={20} />}
                    rightIcon={<Ionicons name="arrow-forward" color={Colors.goldLight} size={20} />}
                    onPress={() => setShowCityPicker(true)}
                    editable={false}
                    error={errors.city}
                  />

                  {/* Lagna */}
                  <CosmicInput
                    label="Lagna / Ascendant (Optional)"
                    placeholder="Select your lagna sign"
                    value={lagna ? `${lagna.symbol} ${lagna.name.split(' ')[0]}` : ''}
                    icon={<Ionicons name="star-outline" color={Colors.goldLight} size={20} />}
                    rightIcon={<Ionicons name="arrow-forward" color={Colors.goldLight} size={20} />}
                    onPress={() => setShowLagnaPicker(true)}
                    editable={false}
                  />


                  {apiError ? (
                    <Text style={styles.errorText}>{apiError}</Text>
                  ) : null}

                  <GlowButton
                    label={loading ? 'Aligning your stars...' : 'Begin My Journey ✦'}
                    onPress={handleRegister}
                    style={styles.actionBtn}
                    disabled={loading}
                  />
                </View>
              )}
            </GlassCard>
          </Animated.View>

          {/* Login link */}
          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Pickers */}
      <CosmicDatePicker
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onConfirm={setBirthDate}
        mode="date"
        value={birthDate}
      />
      <CosmicDatePicker
        visible={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        onConfirm={setBirthTime}
        mode="time"
        value={birthTime}
      />
      <CityPicker
        visible={showCityPicker}
        onClose={() => setShowCityPicker(false)}
        onSelect={setCity}
      />
      <LagnaPicker
        visible={showLagnaPicker}
        onClose={() => setShowLagnaPicker(false)}
        onSelect={setLagna}
        selected={lagna}
      />
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Layout.padding,
    paddingTop: 54,
    paddingBottom: 40,
  },

  // Header
  header: {
    marginBottom: 28,
    position: 'relative',
    alignItems: 'center',
  },
  backBtn: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  backIcon: {
    fontSize: 24,
    color: Colors.white,
    marginTop: -2,
    fontWeight: '300',
  },
  headerCenter: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.goldLight,
    letterSpacing: 5,
    marginBottom: 10,
  },
  headerTitle: {
    ...Typography.h2,
    fontSize: 22,
    textAlign: 'center',
  },
  headerSub: {
    ...Typography.body,
    textAlign: 'center',
    marginTop: 6,
    color: Colors.textMuted,
  },

  // Card
  card: {
    paddingHorizontal: 22,
    paddingVertical: 24,
  },

  // Section label
  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 22,
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.textGold,
  },

  // Gender
  genderLabel: {
    ...Typography.label,
    marginBottom: 10,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 6,
  },
  genderBtn: {
    flex: 1,
    height: 52,
    borderRadius: Layout.radiusMd,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    flexDirection: 'row',
  },
  genderBtnActive: {
    borderColor: Colors.gold,
    backgroundColor: 'rgba(200,151,58,0.12)',
  },
  genderIcon: { fontSize: 16 },
  genderText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  genderTextActive: { color: Colors.goldLight },

  // Error
  errorText: {
    ...Typography.caption,
    color: Colors.danger,
    marginTop: 4,
    marginLeft: 4,
    marginBottom: 8,
  },

  // Action button
  actionBtn: {
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 12,
  },

  // Astro note
  astroNote: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(107,78,255,0.08)',
    borderLeftWidth: 2,
    borderLeftColor: Colors.glowPurple,
    borderRadius: 8,
    padding: 12,
  },

  // Privacy note
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  privacyIcon: { fontSize: 14, marginTop: 1 },
  privacyText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textMuted,
    lineHeight: 18,
  },

  // Login link
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textGold,
  },
});