// app/(onboarding)/verify-otp.tsx
import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { authApi } from '@/api';
import { storage } from '@/utils/storage';
import { Config } from '@/constants/config';

const OTP_LENGTH = 6;

export default function VerifyOtpScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(30);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      const pastedOtp = value.slice(0, OTP_LENGTH).split('');
      const newOtp = [...otp];
      pastedOtp.forEach((char, i) => {
        if (index + i < OTP_LENGTH) {
          newOtp[index + i] = char;
        }
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + pastedOtp.length, OTP_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();
    } else {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      if (value && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
    setError(null);
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== OTP_LENGTH) {
      setError('Please enter the complete code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.verifyOtp(phone || '', otpCode);
      if (response.success) {
        // Store auth data
        await storage.set(Config.STORAGE_KEYS.AUTH_TOKEN, response.data.token);
        await storage.set(Config.STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
        await storage.setObject(Config.STORAGE_KEYS.USER, response.data);
        
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace('/(onboarding)/slides');
      } else {
        setError(response.error || 'Invalid code');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (err: any) {
      setError(err.message || 'Invalid code. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    
    try {
      await authApi.sendOtp(phone || '');
      setResendTimer(30);
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err) {
      setError('Failed to resend code');
    }
  };

  const isComplete = otp.every(digit => digit !== '');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Verify your number</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to{'\n'}
          <Text style={styles.phone}>{phone}</Text>
        </Text>

        {/* OTP Input */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={[
                styles.otpInput,
                digit && styles.otpInputFilled,
                error && styles.otpInputError,
              ]}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={OTP_LENGTH}
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Error Message */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Resend Link */}
        <TouchableOpacity
          style={styles.resendContainer}
          onPress={handleResend}
          disabled={resendTimer > 0}
        >
          <Text style={styles.resendText}>
            Didn't receive code?{' '}
            <Text style={[styles.resendLink, resendTimer > 0 && styles.resendDisabled]}>
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend'}
            </Text>
          </Text>
        </TouchableOpacity>

        {/* Verify Button */}
        <TouchableOpacity
          style={[styles.verifyButton, isComplete && styles.verifyButtonActive]}
          onPress={handleVerify}
          disabled={!isComplete || isLoading}
        >
          <Text style={[styles.verifyButtonText, isComplete && styles.verifyButtonTextActive]}>
            {isLoading ? 'Verifying...' : 'Verify'}
          </Text>
        </TouchableOpacity>
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
    paddingHorizontal: 24,
  },
  backButton: {
    marginTop: 10,
    marginBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 10,
    color: '#000',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
    marginBottom: 30,
  },
  phone: {
    fontWeight: '600',
    color: '#000',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000',
  },
  otpInputFilled: {
    borderColor: '#000',
  },
  otpInputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  resendText: {
    fontSize: 14,
    color: '#666',
  },
  resendLink: {
    fontWeight: '600',
    color: '#000',
    textDecorationLine: 'underline',
  },
  resendDisabled: {
    color: '#999',
    textDecorationLine: 'none',
  },
  verifyButton: {
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#f5f5f5',
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  verifyButtonActive: {
    borderColor: '#000',
    backgroundColor: '#000',
  },
  verifyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ccc',
  },
  verifyButtonTextActive: {
    color: '#fff',
  },
});