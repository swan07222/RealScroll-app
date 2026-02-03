// app/(onboarding)/splash-loading.tsx
import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { HomeIndicator } from '@/components/onboarding/home-indicator';
import { DynamicIsland } from '@/components/onboarding/dynamic-island';

export default function SplashLoadingScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(onboarding)/slides');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <DynamicIsland />
      
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Ionicons name="checkmark" size={16} color="#fff" />
          </View>
          <Text style={styles.logoText}>RealScroll</Text>
        </View>
        
        <ActivityIndicator 
          size="small" 
          color="#000" 
          style={styles.spinner}
        />
      </View>

      <Text style={styles.watermark}>Real people. Real moments.</Text>
      <HomeIndicator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF9',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  logoIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#000',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  spinner: {
    marginTop: 8,
  },
  watermark: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: '#D1D5DB',
  },
});