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

const KEYPAD = [
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
  const [resendTimer, setResendTimer] = useState(56);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleKeyPress = (key: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (key === 'backspace') {
      const newOtp = [...otp];
      for (let i = OTP_LENGTH - 1; i >= 0; i--) {
        if (newOtp[i] !== '') {
          newOtp[i] = '';
          break;
        }
      }
      setOtp(newOtp);
    } else {
      const newOtp = [...otp];
      const emptyIndex = newOtp.findIndex(digit => digit === '');
      if (emptyIndex !== -1) {
        newOtp[emptyIndex] = key;
        setOtp(newOtp);
      }
    }
  };

  const handleVerify = () => {
    if (!isComplete) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    router.push({
      pathname: '/(onboarding)/verifying',
      params: { phone, otp: otp.join('') },
    });
  };

  const handleResend = () => {
    if (resendTimer > 0) return;
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setResendTimer(56);
    setOtp(Array(OTP_LENGTH).fill(''));
  };

  const isComplete = otp.every(digit => digit !== '');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>
          Please check your SMS for the verification code and enter it here to complete the process.
        </Text>

        {/* OTP Code Boxes */}
        <View style={styles.codeContainer}>
          {otp.map((digit, index) => (
            <View
              key={index}
              style={[
                styles.codeDigit,
                digit !== '' && styles.codeDigitFilled,
              ]}
            >
              <Text style={styles.codeDigitText}>{digit}</Text>
            </View>
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[
            styles.verifyButton,
            isComplete ? styles.verifyButtonActive : styles.verifyButtonInactive,
          ]}
          onPress={handleVerify}
          disabled={!isComplete}
        >
          <Text
            style={[
              styles.verifyButtonText,
              isComplete ? styles.verifyButtonTextActive : styles.verifyButtonTextInactive,
            ]}
          >
            Verify
          </Text>
        </TouchableOpacity>

        {/* Resend Info */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendTimerText}>
            You can resend the code in <Text style={styles.resendTimerBold}>{resendTimer} seconds</Text>
          </Text>
          <TouchableOpacity onPress={handleResend} disabled={resendTimer > 0}>
            <Text style={[styles.resendLink, resendTimer > 0 && styles.resendLinkDisabled]}>
              Resend Code
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Numpad */}
      <View style={styles.numpad}>
        {KEYPAD.map((key, index) => {
          if (key.blank) {
            return <View key={index} style={styles.numKeyEmpty} />;
          }

          if (key.num === 'backspace') {
            return (
              <TouchableOpacity
                key={index}
                style={styles.numKeyEmpty}
                onPress={() => handleKeyPress('backspace')}
              >
                <Ionicons name="backspace-outline" size={26} color="#000" />
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={index}
              style={styles.numKey}
              onPress={() => handleKeyPress(key.num)}
              activeOpacity={0.7}
            >
              <Text style={styles.numKeyText}>{key.num}</Text>
              {key.letters ? (
                <Text style={styles.numKeyLetters}>{key.letters}</Text>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#86868b',
    lineHeight: 22,
    marginBottom: 30,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  codeDigit: {
    width: 48,
    height: 58,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  codeDigitFilled: {
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  codeDigitText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#000',
  },
  verifyButton: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  verifyButtonActive: {
    backgroundColor: '#000',
  },
  verifyButtonInactive: {
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  verifyButtonText: {
    fontSize: 17,
    fontWeight: '600',
  },
  verifyButtonTextActive: {
    color: '#fff',
  },
  verifyButtonTextInactive: {
    color: '#ccc',
  },
  resendContainer: {
    alignItems: 'center',
  },
  resendTimerText: {
    fontSize: 13,
    color: '#888',
    marginBottom: 5,
  },
  resendTimerBold: {
    fontWeight: '700',
    color: '#000',
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  resendLinkDisabled: {
    color: '#000',
  },
  numpad: {
    backgroundColor: '#F2F2F7',
    paddingVertical: 15,
    paddingHorizontal: 30,
    paddingBottom: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  numKey: {
    width: (width - 60 - 50) / 3,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    shadowColor: '#898989',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 0,
    elevation: 2,
  },
  numKeyEmpty: {
    width: (width - 60 - 50) / 3,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  numKeyText: {
    fontSize: 25,
    fontWeight: '400',
    color: '#000',
  },
  numKeyLetters: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 1.5,
    marginTop: -3,
  },
});