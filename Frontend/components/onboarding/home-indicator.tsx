// components/onboarding/home-indicator.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';

export function HomeIndicator() {
  return (
    <View style={styles.container}>
      <View style={styles.indicator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  indicator: {
    width: 130,
    height: 5,
    backgroundColor: '#000',
    borderRadius: 3,
  },
});