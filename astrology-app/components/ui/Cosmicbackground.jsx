import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '../../constants/Colors';

const { width, height } = Dimensions.get('window');

const NUM_STARS = 55;

function Star({ size, x, y, delay, duration }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, {
          toValue: Math.random() * 0.7 + 0.2,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.05,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
    animate();
  }, []);

  return (
    <Animated.View
      style={[
        styles.star,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          left: x,
          top: y,
          opacity,
        },
      ]}
    />
  );
}

const stars = Array.from({ length: NUM_STARS }, (_, i) => ({
  id: i,
  size: Math.random() * 2.5 + 0.8,
  x: Math.random() * width,
  y: Math.random() * height,
  delay: Math.random() * 3000,
  duration: Math.random() * 3000 + 2500,
}));

export default function CosmicBackground({ children, style }) {
  return (
    <View style={[styles.container, style]}>
      {/* Deep gradient layers */}
      <View style={styles.gradientBase} />
      <View style={styles.glowTopLeft} />
 
      <View style={styles.glowCenter} />

      {/* Stars */}
      {stars.map((s) => (
        <Star key={s.id} {...s} />
      ))}

      {/* Content */}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDeep,
    overflow: 'hidden',
  },
  gradientBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.bgDeep,
  },
  glowTopLeft: {
    position: 'absolute',
    top: -80,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(45,58,140,0.22)',
  },
  glowBottomRight: {
    position: 'absolute',
    bottom: -60,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(107,78,255,0.12)',
  },
  glowCenter: {
    position: 'absolute',
    top: height * 0.3,
    left: width * 0.2,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(200,151,58,0.05)',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
});