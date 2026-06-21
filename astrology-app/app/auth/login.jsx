import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';

import CosmicBackground from '../../components/ui/Cosmicbackground';
import GlassCard from '../../components/ui/GlassCard';
import GlowButton from '../../components/ui/GlowButton';
import CosmicInput from '../../components/ui/CosmicInput';
import SocialLoginButtons from '../../components/auth/SocialLoginButtons';
import ZodiacOrbit from '../../components/auth/ZodiacOrbit';

import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Layout } from '../../constants/Layout';
import { Ionicons } from '@expo/vector-icons';
import { authLogin } from '../../services/auth';
import { useAuth } from '../context/AuthContext';


const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  // Entrance animations
  const orbitAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(40)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(-20)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(120, [
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(titleAnim, { toValue: 0, useNativeDriver: true, tension: 60, friction: 10 }),
      ]),
      Animated.parallel([
        Animated.timing(cardOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.spring(cardAnim, { toValue: 0, useNativeDriver: true, tension: 60, friction: 10 }),
      ]),
    ]).start();
  }, []);

  const validate = () => {
    let valid = true;
    if (!email.includes('@')) {
      setEmailError('Enter a valid email address');
      valid = false;
    } else setEmailError('');
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    } else setPasswordError('');
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      const { token, user } = await authLogin({ email, password });
      await login(token, user);
      router.replace('/(tabs)');
    } catch (err) {
      setApiError(err.message ?? 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CosmicBackground>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top section — zodiac orbit + branding */}
          <Animated.View
            style={[
              styles.topSection,
              {
                opacity: titleOpacity,
                transform: [{ translateY: titleAnim }],
              },
            ]}
          >
            {/* Cosmic orbit illustration */}
            <View style={styles.orbitWrap}>
              <ZodiacOrbit size={200} />
            </View>

            {/* App name */}
            <Text style={styles.appName}>✦ COSMIQ ✦</Text>
            <Text style={styles.tagline}>Your AI-Powered Cosmic Guide</Text>
          </Animated.View>

          {/* Glass card */}
          <Animated.View
            style={[
              styles.cardWrap,
              {
                opacity: cardOpacity,
                transform: [{ translateY: cardAnim }],
              },
            ]}
          >
            <GlassCard
              style={styles.card}
              glowColor={Colors.glowPurple}
              radius={Layout.radiusXl}
              borderColor={Colors.borderGold}
            >
              {/* Card header */}
              {/* <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Welcome Back</Text>
                <Text style={styles.cardSubtitle}>
                  Sign in to continue your cosmic journey
                </Text>
              </View> */}

              {/* Inputs */}
              <View style={styles.inputs}>
                <CosmicInput
                  label="Email Address"
                  placeholder="your@email.com"
                  value={email}
                  onChangeText={setEmail}
                  icon={<Ionicons name='mail-outline' size={18} color={Colors.goldLight} />}
                  keyboardType="email-address"
                  error={emailError}
                />
                <CosmicInput
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  icon={<Ionicons name='lock-closed-outline' size={18} color={Colors.goldLight} />}
                  secureTextEntry
                  error={passwordError}
                />
              </View>

              {/* Forgot password */}
              <TouchableOpacity style={styles.forgotWrap}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* API error */}
              {apiError ? (
                <Text style={styles.apiError}>{apiError}</Text>
              ) : null}

              {/* CTA Button */}
              <GlowButton
                label={loading ? 'Reading your stars...' : 'Enter Your Destiny'}
                onPress={handleLogin}
                style={styles.ctaBtn}
                icon={loading ? <ActivityIndicator size='small' color={Colors.goldLight} /> : <Ionicons name='arrow-forward' size={18} color={Colors.goldLight} />}
                disabled={loading}
              />

              {/* Social login */}
              {/* <SocialLoginButtons
                onGoogle={() => {}}
                onFacebook={() => {}}
                onApple={() => {}}
              /> */}
            </GlassCard>

            {/* Sign up link */}
            <View style={styles.signupRow}>
              <Text style={styles.signupText}>New to the cosmos? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/register')}>
                <Text style={styles.signupLink}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </CosmicBackground>
  );
}

const styles = StyleSheet.create({
  kav: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Layout.padding,
    paddingTop: 50,
    paddingBottom: 40,
  },

  // Top section
  topSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  orbitWrap: {
    marginBottom: 16,
  },
  appName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.goldLight,
    letterSpacing: 6,
    textAlign: 'center',
  },
  tagline: {
    ...Typography.body,
    textAlign: 'center',
    marginTop: 6,
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },

  // Card
  cardWrap: {
    width: '100%',
  },
  card: {
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  cardHeader: {
    marginBottom: 24,
    alignItems: 'center',
  },
  cardTitle: {
    ...Typography.h2,
    textAlign: 'center',
    fontSize: 24,
  },
  cardSubtitle: {
    ...Typography.body,
    textAlign: 'center',
    marginTop: 6,
    color: Colors.textMuted,
  },

  // Inputs
  inputs: {
    marginBottom: 4,
  },

  // Forgot
  forgotWrap: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -4,
  },
  forgotText: {
    fontSize: 13,
    color: Colors.textGold,
    fontWeight: '500',
  },

  // CTA
  ctaBtn: {
    width: '100%',
    marginBottom: 24,
    borderRadius: 12,
  },

  apiError: {
    fontSize: 13,
    color: '#FF4A6A',
    textAlign: 'center',
    marginBottom: 12,
  },

  // Sign up
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    alignItems: 'center',
  },
  signupText: {
    ...Typography.body,
    color: Colors.textMuted,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textGold,
  },
});