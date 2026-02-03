// components/onboarding/status-bar.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function StatusBar() {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingTop: insets.top + 4 }]}>
      <Text style={styles.time}>9:41</Text>
      <View style={styles.icons}>
        {/* Signal */}
        <View style={styles.signal}>
          <View style={[styles.signalBar, { height: 4 }]} />
          <View style={[styles.signalBar, { height: 6 }]} />
          <View style={[styles.signalBar, { height: 8 }]} />
          <View style={[styles.signalBar, { height: 10 }]} />
        </View>
        {/* Battery */}
        <View style={styles.battery}>
          <View style={styles.batteryLevel} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    zIndex: 50,
  },
  time: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  signal: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 1.5,
  },
  signalBar: {
    width: 3,
    backgroundColor: '#000',
    borderRadius: 1,
  },
  battery: {
    width: 24,
    height: 12,
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 4,
    padding: 1.5,
  },
  batteryLevel: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 1.5,
    width: '70%',
  },
});