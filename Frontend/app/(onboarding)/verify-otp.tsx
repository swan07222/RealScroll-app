// app/(onboarding)/verify-otp.tsx
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const OTP_LENGTH = 6;

interface KeypadKey {
  num: string;
  letters: string;
  blank?: boolean;
}

const KEYPAD: KeypadKey[] = [
  { num: '1', letters: '' },
  { num: '2', letters: 'ABC' },
  { num: '3', letters: 'DEF' },
  { num: '4', letters: 'GHI' },
  { num: '5', letters: 'JKL' },
  { num: '6', letters: 'MNO' },
  { num: '7', letters: 'PQRS' },
  { num: '8', letters: 'TUV' },
  { num: '9', letters: 'WXYZ' },
  { num: '', letters: '', blank: true },
  { num: '0', letters: '' },
  { num: 'backspace', letters: '' },
];

export default function VerifyOtpScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [resendTimer, setResendTimer] = useState<number>(56);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleKeyPress = (key: string): void => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (key === 'backspace') {
      if (activeIndex > 0) {
        const newOtp = [...otp];
        newOtp[activeIndex - 1] = '';
        setOtp(newOtp);
        setActiveIndex(activeIndex - 1);
      }
    } else if (activeIndex < OTP_LENGTH) {
      const newOtp = [...otp];
      newOtp[activeIndex] = key;
      setOtp(newOtp);
      setActiveIndex(activeIndex + 1);
    }
  };

  const handleVerify = (): void => {
    if (activeIndex !== OTP_LENGTH) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    router.push({
      pathname: '/(onboarding)/verifying',
      params: { phone: phone || '', otp: otp.join('') },
    });
  };

  const handleResend = (): void => {
    if (resendTimer > 0) return;
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setResendTimer(56);
    setOtp(Array(OTP_LENGTH).fill(''));
    setActiveIndex(0);
  };

  const isComplete = activeIndex === OTP_LENGTH;

  const renderOtpBox = (digit: string, index: number): React.ReactElement => (
    <View
      key={`otp-${index}`}
      style={[
        styles.otpBox,
        index === activeIndex && styles.otpBoxActive,
        digit !== '' && styles.otpBoxFilled,
      ]}
    >
      <Text style={styles.otpText}>{digit}</Text>
    </View>
  );

  const renderKeypadKey = (key: KeypadKey, index: number): React.ReactElement => {
    if (key.blank) {
      return <View key={`blank-${index}`} style={styles.keyBlank} />;
    }

    if (key.num === 'backspace') {
      return (
        <TouchableOpacity
          key="backspace"
          style={styles.keyBlank}
          onPress={() => handleKeyPress('backspace')}
        >
          <Ionicons name="backspace-outline" size={24} color="#000" />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        key={key.num}
        style={styles.key}
        onPress={() => handleKeyPress(key.num)}
        activeOpacity={0.7}
      >
        <Text style={styles.keyNum}>{key.num}</Text>
        {key.letters ? (
          <Text style={styles.keyLetters}>{key.letters}</Text>
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Content */}
      <View style={styles.content}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>
          Please check your SMS for the verification code and enter it here to complete the process.
        </Text>

        {/* OTP Boxes */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => renderOtpBox(digit, index))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[
            styles.verifyButton,
            isComplete && styles.verifyButtonActive,
          ]}
          onPress={handleVerify}
          disabled={!isComplete}
        >
          <Text
            style={[
              styles.verifyButtonText,
              isComplete && styles.verifyButtonTextActive,
            ]}
          >
            Verify
          </Text>
        </TouchableOpacity>

        {/* Resend */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendTimerText}>
            You can resend the code in{' '}
            <Text style={styles.resendTimerBold}>{resendTimer} seconds</Text>
          </Text>
          <TouchableOpacity onPress={handleResend} disabled={resendTimer > 0}>
            <Text style={styles.resendLink}>Resend Code</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Keypad */}
      <View style={styles.keypadContainer}>
        <View style={styles.keypadGrid}>
          {KEYPAD.map((key, index) => renderKeypadKey(key, index))}
        </View>
      </View>

      {/* Home Indicator */}
      <View style={styles.homeIndicator}>
        <View style={styles.indicator} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  backButton: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 32,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  otpBox: {
    width: 44,
    height: 56,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  otpBoxActive: {
    borderColor: '#000',
  },
  otpBoxFilled: {
    borderColor: '#E5E7EB',
  },
  otpText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  verifyButton: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  verifyButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  verifyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#D1D5DB',
  },
  verifyButtonTextActive: {
    color: '#fff',
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendTimerText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  resendTimerBold: {
    fontWeight: '700',
    color: '#000',
  },
  resendLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
  },
  keypadContainer: {
    backgroundColor: '#F2F2F7',
    paddingVertical: 16,
    paddingHorizontal: 30,
    paddingBottom: 8,
  },
  keypadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  key: {
    width: (width - 60 - 24) / 3,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#898989',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 1,
  },
  keyBlank: {
    width: (width - 60 - 24) / 3,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  keyNum: {
    fontSize: 22,
    fontWeight: '400',
    color: '#000',
  },
  keyLetters: {
    fontSize: 9,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 1.5,
    marginTop: -2,
  },
  homeIndicator: {
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#F2F2F7',
  },
  indicator: {
    width: 130,
    height: 5,
    backgroundColor: '#000',
    borderRadius: 3,
  },
});