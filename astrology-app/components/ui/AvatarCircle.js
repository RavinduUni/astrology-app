import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export default function AvatarCircle({ uri, size = 48, style }) {
  return (
    <View style={[styles.wrapper, { width: size, height: size, borderRadius: size / 2 }, style]}>
      <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 2,
    borderColor: '#FFD700',
    overflow: 'hidden',
  },
});
