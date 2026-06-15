import React from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';
import { Layout } from '../../constants/Layout';

export default function ScreenWrapper({ children, scroll = false, padBottom = true, style }) {
  const Inner = scroll ? ScrollView : View;
  return (
    <SafeAreaView style={styles.safe}>
      <Inner
        style={[styles.inner, style]}
        contentContainerStyle={scroll ? [styles.scrollContent, padBottom && styles.padBottom] : undefined}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </Inner>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  inner: { flex: 1, backgroundColor: Colors.bg },
  scrollContent: { paddingHorizontal: Layout.padding },
  padBottom: { paddingBottom: Layout.tabBarHeight + 20 },
});