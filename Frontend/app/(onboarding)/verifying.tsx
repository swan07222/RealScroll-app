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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await authApi.verifyOtp(phone || '', otp || '');
      
      if (response.success && response.data) {
        await storage.set(Config.STORAGE_KEYS.AUTH_TOKEN, response.data.token);
        await storage.set(Config.STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
        await storage.setObject(Config.STORAGE_KEYS.USER, response.data);
        
        router.replace('/verified' as any);
      } else {
        router.replace({ pathname: '/verification-error' as any, params: { error: response.error || 'Verification failed' } });
      }
    } catch (error: any) {
      router.replace({ pathname: '/verification-error' as any, params: { error: error.message || 'Verification failed' } });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Face Scan Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.scanFrame}>
            <View style={styles.scanCornerTL} />
            <View style={styles.scanCornerTR} />
            <View style={styles.scanCornerBL} />
            <View style={styles.scanCornerBR} />
            <View style={styles.faceOutline}>
              <View style={styles.faceInner} />
            </View>
            <View style={styles.greenDotLeft} />
            <View style={styles.greenDotRight} />
          </View>
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
    backgroundColor: '#FFFCF9',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  illustrationContainer: {
    marginBottom: 32,
  },
  scanFrame: {
    width: 120,
    height: 120,
    position: 'relative',
  },
  scanCornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#000',
    borderTopLeftRadius: 8,
  },
  scanCornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#000',
    borderTopRightRadius: 8,
  },
  scanCornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#000',
    borderBottomLeftRadius: 8,
  },
  scanCornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#000',
    borderBottomRightRadius: 8,
  },
  faceOutline: {
    position: 'absolute',
    top: 25,
    left: 35,
    width: 50,
    height: 60,
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  faceInner: {
    width: 30,
    height: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: '#000',
  },
  greenDotLeft: {
    position: 'absolute',
    left: -8,
    top: '50%',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34C759',
  },
  greenDotRight: {
    position: 'absolute',
    right: -8,
    top: '50%',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34C759',
  },
  statusText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 20,
  },
  spinner: {
    marginTop: 15,
  },
});