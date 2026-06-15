import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Animated,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';
import { Typography } from '../../constants/Typography';

export default function GlowButton({
  label,
  onPress,
  style,
  textStyle,
  icon,
  variant = 'gold', // 'gold' | 'indigo' | 'outline' | 'ghost'
  size = 'lg',       // 'lg' | 'md' | 'sm'
  disabled = false,
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
    }).start();
  };

  const buttonStyle = [
    styles.base,
    styles[`size_${size}`],
    styles[`variant_${variant}`],
    disabled && styles.disabled,
    style,
  ];

  const glowStyle = variant === 'gold' ? Layout.goldGlow : variant === 'indigo' ? Layout.indigoGlow : {};

  return (
    <Animated.View style={[{ transform: [{ scale }] }, glowStyle]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        disabled={disabled}
        style={buttonStyle}
      >

        <View style={styles.inner}>
          {icon && <Text style={styles.icon}>{icon}</Text>}
          <Text style={[styles.label, styles[`label_${size}`], textStyle]}>
            {label}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Layout.radiusLg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  size_lg: {
    height: Layout.buttonHeight,
    paddingHorizontal: 32,
  },
  size_md: {
    height: 48,
    paddingHorizontal: 24,
  },
  size_sm: {
    height: 38,
    paddingHorizontal: 18,
  },
  variant_gold: {
    backgroundColor: Colors.gold,
    // Simulate gradient with layered approach
    borderWidth: 0,
  },
  variant_indigo: {
    backgroundColor: Colors.indigoBright,
    borderWidth: 0,
  },
  variant_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.gold,
  },
  variant_ghost: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  disabled: {
    opacity: 0.45,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 18,
  },
  label: {
    ...Typography.cta,
    color: Colors.white,
  },
  label_lg: { fontSize: 18, fontWeight: '700' },
  label_md: { fontSize: 15, fontWeight: '600' },
  label_sm: { fontSize: 13, fontWeight: '600' },
  mandalaWrap: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 16,
    right: 16,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    opacity: 0.25,
  },
  mandalaLeft: {
    fontSize: 28,
    color: Colors.white,
  },
  mandalaRight: {
    fontSize: 28,
    color: Colors.white,
  },
});