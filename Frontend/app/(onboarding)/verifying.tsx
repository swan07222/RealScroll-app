// app/(onboarding)/verifying.tsx
import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, { Path, Rect, Circle, Line, G } from 'react-native-svg';
import { HomeIndicator } from '@/components/onboarding/home-indicator';
import { DynamicIsland } from '@/components/onboarding/dynamic-island';
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
      await new Promise(resolve => setTimeout(resolve, 2500));
      
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
    <View style={styles.container}>
      <DynamicIsland />

      <View style={styles.content}>
        {/* Face ID Illustration */}
        <View style={styles.illustrationContainer}>
          <Svg width={96} height={120} viewBox="0 0 96 120" fill="none">
            {/* Face outline */}
            <Rect 
              x={16} 
              y={20} 
              width={64} 
              height={80} 
              rx={10}
              stroke="#000" 
              strokeWidth={2}
              fill="#fff"
            />
            {/* Face circle */}
            <Circle cx={48} cy={50} r={16} stroke="#000" strokeWidth={1.5} />
            {/* Shoulders */}
            <Path 
              d="M28 85 Q48 70 68 85" 
              stroke="#000" 
              strokeWidth={1.5}
              fill="none"
            />
            {/* Scan brackets */}
            <Path 
              d="M6 30 L6 20 L16 20" 
              stroke="#000" 
              strokeWidth={3}
              strokeLinecap="round"
            />
            <Path 
              d="M6 90 L6 100 L16 100" 
              stroke="#000" 
              strokeWidth={3}
              strokeLinecap="round"
            />
            <Path 
              d="M90 30 L90 20 L80 20" 
              stroke="#000" 
              strokeWidth={3}
              strokeLinecap="round"
            />
            <Path 
              d="M90 90 L90 100 L80 100" 
              stroke="#000" 
              strokeWidth={3}
              strokeLinecap="round"
            />
            {/* Scan line */}
            <Line 
              x1={0} 
              y1={60} 
              x2={96} 
              y2={60} 
              stroke="#22C55E" 
              strokeWidth={2}
            />
            {/* Green dots */}
            <Circle cx={6} cy={60} r={4} fill="#22C55E" />
            <Circle cx={90} cy={60} r={4} fill="#22C55E" />
          </Svg>
        </View>

        <Text style={styles.statusText}>Verifying your credentials</Text>
        
        <ActivityIndicator size="small" color="#6B7280" style={styles.spinner} />
      </View>

      <HomeIndicator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  spinner: {
    marginTop: 8,
  },
});