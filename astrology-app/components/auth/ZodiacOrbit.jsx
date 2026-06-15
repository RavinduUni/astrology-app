import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

const ZODIAC_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

export default function ZodiacOrbit({ size = 220 }) {
  const rotate = useRef(new Animated.Value(0)).current;
  const rotateInner = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotate, {
        toValue: 1,
        duration: 40000,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(rotateInner, {
        toValue: -1,
        duration: 25000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotate.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const spinInner = rotateInner.interpolate({ inputRange: [-1, 0], outputRange: ['-360deg', '0deg'] });

  const radius = size / 2 - 18;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Outer ring */}
      <View
        style={[
          styles.ring,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      />
      {/* Inner glow circle */}
      <View
        style={[
          styles.innerGlow,
          {
            width: size * 0.55,
            height: size * 0.55,
            borderRadius: (size * 0.55) / 2,
            left: size * 0.225,
            top: size * 0.225,
          },
        ]}
      />

      {/* Center symbol */}
      <View style={styles.center}>
        <Text style={styles.centerSymbol}>☽</Text>
        <Text style={styles.centerStar}>✦</Text>
      </View>

      {/* Orbiting zodiac symbols */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { transform: [{ rotate: spin }] },
        ]}
      >
        {ZODIAC_SYMBOLS.map((symbol, i) => {
          const angle = (i / ZODIAC_SYMBOLS.length) * 2 * Math.PI;
          const x = size / 2 + radius * Math.cos(angle) - 12;
          const y = size / 2 + radius * Math.sin(angle) - 12;

          return (
            <View key={i} style={[styles.zodiacWrap, { left: x, top: y }]}>
              <Text style={styles.zodiacSymbol}>{symbol}</Text>
            </View>
          );
        })}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(200,151,58,0.2)',
    borderStyle: 'dashed',
  },
  innerGlow: {
    position: 'absolute',
    backgroundColor: 'rgba(107,78,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(107,78,255,0.2)',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerSymbol: {
    fontSize: 36,
    color: Colors.goldLight,
  },
  centerStar: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: -4,
  },
  zodiacWrap: {
    position: 'absolute',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zodiacSymbol: {
    fontSize: 13,
    color: Colors.gold,
    opacity: 0.7,
  },
});