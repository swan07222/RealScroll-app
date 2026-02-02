// app/(onboarding)/verifying.tsx
import { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, { Path, Circle, Line, G } from 'react-native-svg';
import { authApi } from '@/api';
import { storage } from '@/utils/storage';
import { Config } from '@/constants/config';

export default function VerifyingScreen() {
  const { phone, otp } = useLocalSearchParams<{ phone: string; otp: string }>();

  useEffect(() => {
    verifyCode();
  }, []);

  const verifyCode = async () => {
    try {
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await authApi.verifyOtp(phone || '', otp || '');
      
      if (response.success && response.data) {
        await storage.set(Config.STORAGE_KEYS.AUTH_TOKEN, response.data.token);
        await storage.set(Config.STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
        await storage.setObject(Config.STORAGE_KEYS.USER, response.data);
        
        router.replace('/(onboarding)/verified');
      } else {
        router.replace({
          pathname: '/(onboarding)/verification-error',
          params: { error: response.error || 'Verification failed' },
        });
      }
    } catch (error: any) {
      router.replace({
        pathname: '/(onboarding)/verification-error',
        params: { error: error.message || 'Verification failed' },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Face Scan Illustration */}
        <View style={styles.illustrationContainer}>
          <Svg width={120} height={120} viewBox="0 0 100 100" fill="none">
            {/* Head */}
            <Path
              d="M50 25c-12 0-22 10-22 22v5c0 8 15 15 22 15s22-7 22-15v-5c0-12-10-22-22-22z"
              stroke="#000"
              strokeWidth={2}
            />
            <Path
              d="M28 70c0-10 8-15 22-15s22 5 22 15"
              stroke="#000"
              strokeWidth={2}
            />
            {/* Brackets */}
            <Path
              d="M20 25 h-10 v50 h10"
              stroke="#000"
              strokeWidth={3}
              strokeLinecap="round"
            />
            <Path
              d="M80 25 h10 v50 h-10"
              stroke="#000"
              strokeWidth={3}
              strokeLinecap="round"
            />
            {/* Green Dots */}
            <Circle cx={10} cy={50} r={3} fill="#34C759" />
            <Circle cx={90} cy={50} r={3} fill="#34C759" />
          </Svg>
        </View>

        <Text style={styles.statusText}>Verifying your credentials</Text>
        
        <ActivityIndicator size="large" color="#666" style={styles.spinner} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  illustrationContainer: {
    marginBottom: 24,
  },
  statusText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 15,
  },
  spinner: {
    marginTop: 15,
  },
});