import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

const { width } = Dimensions.get('window');
const MAX_BUBBLE_WIDTH = width * 0.72;

// ── Image attachment thumbnail grid ───────────────────────────────────────
function ImageAttachments({ images }) {
  if (!images || images.length === 0) return null;

  return (
    <View style={attachStyles.grid}>
      {images.map((img, i) => (
        <TouchableOpacity key={i} style={attachStyles.thumb} activeOpacity={0.85}>
          <View style={attachStyles.thumbInner}>
            <Text style={attachStyles.thumbEmoji}>{img.emoji || '🖼️'}</Text>
          </View>
        </TouchableOpacity>
      ))}
      {/* Document attachment */}
      {images.length > 0 && (
        <TouchableOpacity style={[attachStyles.thumb, attachStyles.docThumb]} activeOpacity={0.85}>
          <View style={[attachStyles.thumbInner, attachStyles.docInner]}>
            <Text style={attachStyles.thumbEmoji}>📄</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const attachStyles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  thumb: {
    width: 68,
    height: 68,
    borderRadius: 12,
    overflow: 'hidden',
  },
  thumbInner: {
    flex: 1,
    backgroundColor: 'rgba(200,151,58,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(200,151,58,0.3)',
  },
  docThumb: {},
  docInner: {
    backgroundColor: Colors.surfaceElevated,
    borderColor: Colors.border,
  },
  thumbEmoji: { fontSize: 26 },
});

// ── Read receipt ticks ─────────────────────────────────────────────────────
function ReadTicks({ status }) {
  const color = status === 'read' ? Colors.indigoBright : Colors.textMuted;
  return (
    <View style={tickStyles.row}>
      <Text style={[tickStyles.tick, { color }]}>✓</Text>
      <Text style={[tickStyles.tick, { color, marginLeft: -6 }]}>✓</Text>
    </View>
  );
}

const tickStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 4, alignSelf: 'flex-end' },
  tick: { fontSize: 12, fontWeight: '700' },
});

// ── Main ChatBubble ────────────────────────────────────────────────────────
export default function ChatBubble({ message }) {
  const isAI = message.role === 'ai';

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(isAI ? -14 : 14)).current;
  const scaleAnim = useRef(new Animated.Value(0.94)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 75,
        friction: 12,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 75,
        friction: 12,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.row,
        isAI ? styles.rowAI : styles.rowUser,
        {
          opacity: fadeAnim,
          transform: [
            { translateX: slideAnim },
            { scale: scaleAnim },
          ],
        },
      ]}
    >
      {/* AI avatar — shown only on AI side */}
      {isAI && (
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>🔮</Text>
          </View>
        </View>
      )}

      {/* Bubble */}
      <View style={[styles.bubble, isAI ? styles.bubbleAI : styles.bubbleUser]}>

        {/* Text content */}
        {message.text ? (
          <Text style={styles.text}>{message.text}</Text>
        ) : null}

        {/* Image attachments */}
        {message.images && <ImageAttachments images={message.images} />}

        {/* Time + ticks row */}
        <View style={[styles.metaRow, isAI ? styles.metaRowAI : styles.metaRowUser]}>
          <Text style={styles.time}>{message.time}</Text>
          {!isAI && <ReadTicks status={message.status || 'sent'} />}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 6,
    paddingHorizontal: Layout.padding,
  },
  rowAI: {
    justifyContent: 'flex-start',
    gap: 10,
  },
  rowUser: {
    justifyContent: 'flex-end',
  },

  // Avatar
  avatarWrap: {
    flexShrink: 0,
    marginBottom: 2,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.indigo,
    borderWidth: 1.5,
    borderColor: Colors.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 16 },

  // Bubble base
  bubble: {
    maxWidth: MAX_BUBBLE_WIDTH,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
  },

  // AI bubble — deep indigo matching reference image
  bubbleAI: {
    backgroundColor: '#2B3A8C',
    borderBottomLeftRadius: 5,
    shadowColor: '#2B3A8C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },

  // User bubble — dark surface, no left tail
  bubbleUser: {
    backgroundColor: '#1A1A2E',
    borderBottomRightRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },

  // Text
  text: {
    fontSize: 14,
    color: Colors.white,
    lineHeight: 22,
    letterSpacing: 0.1,
  },

  // Meta row (time + ticks)
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  metaRowAI: { justifyContent: 'flex-start' },
  metaRowUser: { justifyContent: 'flex-end' },
  time: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.35)',
    letterSpacing: 0.2,
  },
});