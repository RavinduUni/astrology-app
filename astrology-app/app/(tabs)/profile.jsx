import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

import CosmicBackground from '../../components/ui/Cosmicbackground';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import { Typography } from '../../constants/Typography';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { updateUserProfile, uploadProfileImage } from '../../services/api';

// ── Zodiac data for the badge ─────────────────────────────────────────────────
const ZODIAC = {
  Aries:       { symbol: '♈', element: 'Fire',  color: '#FF6B4A' },
  Taurus:      { symbol: '♉', element: 'Earth', color: '#4AFF8C' },
  Gemini:      { symbol: '♊', element: 'Air',   color: '#4AD4FF' },
  Cancer:      { symbol: '♋', element: 'Water', color: '#4A8CFF' },
  Leo:         { symbol: '♌', element: 'Fire',  color: '#FFB84A' },
  Virgo:       { symbol: '♍', element: 'Earth', color: '#8CFF4A' },
  Libra:       { symbol: '♎', element: 'Air',   color: '#D4A4FF' },
  Scorpio:     { symbol: '♏', element: 'Water', color: '#FF4A8C' },
  Sagittarius: { symbol: '♐', element: 'Fire',  color: '#FF884A' },
  Capricorn:   { symbol: '♑', element: 'Earth', color: '#8CAAFF' },
  Aquarius:    { symbol: '♒', element: 'Air',   color: '#4AFFEE' },
  Pisces:      { symbol: '♓', element: 'Water', color: '#AA88FF' },
};

const formatDate = (isoString) => {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
};
// ── Field row for read-only info ──────────────────────────────────────────────
function InfoRow({ icon, label, value }) {
  return (
    <View style={rowStyles.row}>
      <View style={rowStyles.iconBox}>{icon}</View>
      <View style={rowStyles.textBox}>
        <Text style={rowStyles.label}>{label}</Text>
        <Text style={rowStyles.value}>{value || '—'}</Text>
      </View>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(200,151,58,0.12)',
    borderWidth: 1,
    borderColor: Colors.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBox: { flex: 1 },
  label: { fontSize: 11, color: Colors.textMuted, fontWeight: '600', letterSpacing: 0.3, marginBottom: 2 },
  value: { fontSize: 14, color: Colors.white, fontWeight: '500' },
});

// ── Section card wrapper ──────────────────────────────────────────────────────
function SectionCard({ title, children, style }) {
  return (
    <View style={[cardStyles.card, style]}>
      {title ? <Text style={cardStyles.title}>{title}</Text> : null}
      {children}
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 18,
    marginBottom: 16,
    overflow: 'hidden',
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textGold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
});

// ── Styled TextInput ──────────────────────────────────────────────────────────
function CosmicTextInput({ label, value, onChangeText, placeholder, editable = true }) {
  return (
    <View style={inputStyles.wrap}>
      <Text style={inputStyles.label}>{label}</Text>
      <TextInput
        style={[inputStyles.input, !editable && inputStyles.inputDisabled]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        editable={editable}
        autoCorrect={false}
      />
    </View>
  );
}

const inputStyles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: { fontSize: 11, color: Colors.textMuted, fontWeight: '600', letterSpacing: 0.3, marginBottom: 6 },
  input: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Layout.radiusMd,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 13,
    paddingHorizontal: 16,
    color: Colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  inputDisabled: {
    opacity: 0.45,
  },
});

// ── Main Profile Screen ───────────────────────────────────────────────────────
export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, logout, updateUserData } = useAuth();

  // ── Edit form state ──────────────────────────────────────────────────────
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCity, setEditCity] = useState('');
  const [saving, setSaving] = useState(false);

  // ── Avatar upload state ──────────────────────────────────────────────────
  const [avatarUri, setAvatarUri] = useState(null);    // local preview URI
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // ── Derived display values ───────────────────────────────────────────────
  const displayName   = user?.name      || 'Stargazer';
  const displayEmail  = user?.email     || '—';
  const displaySign   = user?.sign      || null;
  const signMeta      = ZODIAC[displaySign] || null;
  const displayLagna  = user?.lagna     || '—';
  const displayBirth  = user?.birthDate || '—';
  const displayCity   = user?.birthCity || '—';
  const displayAvatar = avatarUri || user?.avatarUrl || null;

  // ── Enter edit mode ──────────────────────────────────────────────────────
  const handleEdit = () => {
    setEditName(user?.name || '');
    setEditCity(user?.birthCity || '');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditName('');
    setEditCity('');
  };

  // ── Save text changes ────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!editName.trim()) {
      Alert.alert('Validation', 'Name cannot be empty.');
      return;
    }
    setSaving(true);
    try {
      const updates = {};
      if (editName.trim()  !== user?.name)      updates.name      = editName.trim();
      if (editCity.trim()  !== user?.birthCity) updates.birthCity = editCity.trim();

      if (Object.keys(updates).length > 0) {
        const { user: updated } = await updateUserProfile(updates);
        updateUserData(updated);
      }
      setIsEditing(false);
    } catch (err) {
      Alert.alert('Save Failed', err.message || 'Could not update profile.');
    } finally {
      setSaving(false);
    }
  };

  // ── Pick & upload avatar ─────────────────────────────────────────────────
  const handlePickAvatar = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library in Settings.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.length) return;

    const asset = result.assets[0];
    setAvatarUri(asset.uri);   // show preview immediately
    setUploadingAvatar(true);

    try {
      const mimeType = asset.mimeType || 'image/jpeg';
      const { user: updated } = await uploadProfileImage(asset.uri, mimeType);
      updateUserData(updated);
      Alert.alert('✦ Done', 'Your profile photo has been updated!');
    } catch (err) {
      setAvatarUri(null);   // revert preview on failure
      Alert.alert('Upload Failed', err.message || 'Could not upload image.');
    } finally {
      setUploadingAvatar(false);
    }
  }, [updateUserData]);

  // ── Logout ───────────────────────────────────────────────────────────────
  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of Cosmiq?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (_) {}
          },
        },
      ]
    );
  };

  return (
    <CosmicBackground>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 16, paddingBottom: Layout.tabBarHeight + 40 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inner}>

          {/* ── Page header ── */}
          <View style={styles.pageHeader}>
            <Text style={styles.pageTitle}>My Profile</Text>
            {!isEditing ? (
              <TouchableOpacity onPress={handleEdit} style={styles.editBtn} activeOpacity={0.8}>
                <Ionicons name="pencil" size={15} color={Colors.gold} />
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {/* ── Avatar + name ── */}
          <SectionCard style={styles.heroCard}>
            {/* Ambient glow */}
            <View style={[styles.heroGlow, signMeta ? { backgroundColor: `${signMeta.color}12` } : null]} />

            <View style={styles.heroContent}>
              {/* Avatar */}
              <TouchableOpacity
                onPress={handlePickAvatar}
                style={styles.avatarWrap}
                activeOpacity={0.8}
                disabled={uploadingAvatar}
              >
                {displayAvatar ? (
                  <Image source={{ uri: displayAvatar }} style={styles.avatarImg} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Ionicons name="person" size={42} color={Colors.textMuted} />
                  </View>
                )}

                {/* Camera badge */}
                <View style={styles.cameraBadge}>
                  {uploadingAvatar ? (
                    <ActivityIndicator size="small" color={Colors.white} />
                  ) : (
                    <Ionicons name="camera" size={14} color={Colors.white} />
                  )}
                </View>
              </TouchableOpacity>

              {/* Name + sign */}
              <View style={styles.heroText}>
                <Text style={styles.heroName}>{displayName}</Text>
                <Text style={styles.heroEmail}>{displayEmail}</Text>

                {signMeta && (
                  <View style={[styles.signBadge, { borderColor: `${signMeta.color}44`, backgroundColor: `${signMeta.color}18` }]}>
                    <Text style={[styles.signSymbol, { color: signMeta.color }]}>{signMeta.symbol}</Text>
                    <Text style={[styles.signName, { color: signMeta.color }]}>{displaySign}</Text>
                    <Text style={[styles.signElement, { color: `${signMeta.color}AA` }]}>· {signMeta.element}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Upload hint */}
            {!uploadingAvatar && (
              <Text style={styles.avatarHint}>Tap photo to change</Text>
            )}
            {uploadingAvatar && (
              <Text style={styles.avatarHint}>Uploading…</Text>
            )}
          </SectionCard>

          {/* ── Edit form (visible when isEditing) ── */}
          {isEditing && (
            <SectionCard title="Edit Details" style={styles.editCard}>
              <CosmicTextInput
                label="Display Name"
                value={editName}
                onChangeText={setEditName}
                placeholder="Your full name"
              />
              <CosmicTextInput
                label="Birth City"
                value={editCity}
                onChangeText={setEditCity}
                placeholder="City, Country"
              />
              <View style={styles.editActions}>
                <TouchableOpacity onPress={handleCancelEdit} style={styles.cancelBtn} activeOpacity={0.8}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSave}
                  style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                  activeOpacity={0.8}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator size="small" color={Colors.bg} />
                  ) : (
                    <>
                      <Ionicons name="checkmark" size={16} color={Colors.bg} />
                      <Text style={styles.saveBtnText}>Save Changes</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </SectionCard>
          )}

          {/* ── Birth details (read-only) ── */}
          <SectionCard title="Birth Details">
            <InfoRow
              icon={<MaterialCommunityIcons name="cake-variant" size={18} color={Colors.gold} />}
              label="Date of Birth"
              value={formatDate(displayBirth)}
            />
            <InfoRow
              icon={<MaterialCommunityIcons name="map-marker-radius" size={18} color={Colors.gold} />}
              label="Birth City"
              value={displayCity}
            />
            <View style={[rowStyles.row, { borderBottomWidth: 0 }]}>
              <View style={rowStyles.iconBox}>
                <MaterialCommunityIcons name="star-four-points" size={18} color={Colors.gold} />
              </View>
              <View style={rowStyles.textBox}>
                <Text style={rowStyles.label}>Lagna (Ascendant)</Text>
                <Text style={rowStyles.value}>{displayLagna}</Text>
              </View>
            </View>
          </SectionCard>

          {/* ── Zodiac summary ── */}
          {signMeta && (
            <SectionCard title="Cosmic Identity">
              <View style={styles.zodiacGrid}>
                <ZodiacTile label="Sun Sign" value={displaySign} color={signMeta.color} symbol={signMeta.symbol} />
                <ZodiacTile label="Element" value={signMeta.element} color={signMeta.color} symbol={
                  signMeta.element === 'Fire' ? '🔥' :
                  signMeta.element === 'Earth' ? '🌿' :
                  signMeta.element === 'Air' ? '💨' : '🌊'
                } />
                <ZodiacTile label="Lagna" value={displayLagna !== '—' ? displayLagna : '—'} color={Colors.glowPurple} symbol="🔮" />
              </View>
            </SectionCard>
          )}

          {/* ── Danger zone / Logout ── */}
          <SectionCard style={styles.logoutCard}>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn} activeOpacity={0.8}>
              <View style={styles.logoutIconBox}>
                <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
              </View>
              <Text style={styles.logoutText}>Sign Out</Text>
              <Ionicons name="chevron-forward" size={18} color={Colors.danger} style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          </SectionCard>

        </View>
      </ScrollView>
    </CosmicBackground>
  );
}

// ── Small zodiac info tile ────────────────────────────────────────────────────
function ZodiacTile({ label, value, color, symbol }) {
  return (
    <View style={[tileStyles.tile, { borderColor: `${color}30` }]}>
      <Text style={tileStyles.symbol}>{symbol}</Text>
      <Text style={[tileStyles.value, { color }]}>{value}</Text>
      <Text style={tileStyles.label}>{label}</Text>
    </View>
  );
}

const tileStyles = StyleSheet.create({
  tile: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 14,
    borderRadius: Layout.radiusMd,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  symbol: { fontSize: 22 },
  value: { fontSize: 13, fontWeight: '700', letterSpacing: 0.2 },
  label: { fontSize: 10, color: Colors.textMuted, fontWeight: '600' },
});

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },
  inner: { paddingHorizontal: Layout.padding },

  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 4,
  },
  pageTitle: { fontSize: 22, fontWeight: '700', color: Colors.white },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(200,151,58,0.12)',
    borderWidth: 1,
    borderColor: Colors.borderGold,
  },
  editBtnText: { fontSize: 13, fontWeight: '700', color: Colors.gold },

  // Hero card
  heroCard: { marginBottom: 16 },
  heroGlow: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  avatarWrap: {
    position: 'relative',
    width: 88,
    height: 88,
  },
  avatarImg: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2.5,
    borderColor: Colors.borderGold,
  },
  avatarPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.surfaceElevated,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  heroText: { flex: 1, gap: 4 },
  heroName: { fontSize: 20, fontWeight: '700', color: Colors.white },
  heroEmail: { fontSize: 12, color: Colors.textMuted, fontWeight: '400' },
  signBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 4,
  },
  signSymbol: { fontSize: 14, fontWeight: '700' },
  signName:   { fontSize: 12, fontWeight: '700' },
  signElement:{ fontSize: 11 },
  avatarHint: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 12,
    letterSpacing: 0.3,
  },

  // Edit card
  editCard: { borderColor: Colors.borderGold, ...Layout.goldGlow },
  editActions: { flexDirection: 'row', gap: 10, marginTop: 6 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: Layout.radiusFull,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  cancelBtnText: { fontSize: 14, fontWeight: '600', color: Colors.textSecondary },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 13,
    borderRadius: Layout.radiusFull,
    backgroundColor: Colors.gold,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { fontSize: 14, fontWeight: '700', color: Colors.bg },

  // Zodiac grid
  zodiacGrid: { flexDirection: 'row', gap: 10, marginTop: 8 },

  // Logout
  logoutCard: { borderColor: 'rgba(255,77,106,0.25)', marginBottom: 0 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 4,
  },
  logoutIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255,77,106,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,77,106,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: { fontSize: 15, fontWeight: '600', color: Colors.danger },
});