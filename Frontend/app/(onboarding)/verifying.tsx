import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';

import { authApi } from '@/api';
import { storage } from '@/utils/storage';
import { Config } from '@/constants/config';
import { Images } from '@/constants/images';

export default function VerifyingScreen() {
  const { phone, otp } = useLocalSearchParams<{ phone: string; otp: string }>();

  useEffect(() => {
    verifyCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const verifyCode = async () => {
    try {
      // Optional: small UX delay
      await new Promise((r) => setTimeout(r, 1500));

      const response = await authApi.verifyOtp(phone || '', otp || '');

      if (response.success && response.data) {
        await storage.set(Config.STORAGE_KEYS.AUTH_TOKEN, response.data.token);
        await storage.set(Config.STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
        await storage.setObject(Config.STORAGE_KEYS.USER, response.data);

        router.replace('/(onboarding)/verified');
      } else {
        router.replace('/(onboarding)/verification-error');
      }
    } catch {
      router.replace('/(onboarding)/verification-error');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          // Change to Images.verifyDNA or Images.verifyPhone if you want
          source={Images.verifyFingerprint}
          style={styles.illustration}
          contentFit="contain"
        />

        <Text style={styles.statusText}>Verifying your credentials</Text>
        <ActivityIndicator size="large" color="#666" style={styles.spinner} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  illustration: {
    width: 180,
    height: 180,
    marginBottom: 18,
  },
  statusText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  spinner: {
    marginTop: 8,
  },
});