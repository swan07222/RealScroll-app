// components/onboarding/doodle-card.tsx
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface DoodleCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  rotate?: number;
}

export function DoodleCard({ children, style, rotate = -6 }: DoodleCardProps) {
  return (
    <View
      style={[
        styles.card,
        { transform: [{ rotate: `${rotate}deg` }] },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 0,
    elevation: 2,
  },
});