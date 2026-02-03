// components/onboarding/dynamic-island.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function DynamicIsland() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { top: insets.top + 8 }]}>
      <View style={styles.island} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  island: {
    width: 120,
    height: 36,
    backgroundColor: '#000',
    borderRadius: 20,
  },
});