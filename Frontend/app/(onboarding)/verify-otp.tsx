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

// Calculate key width based on screen width
const KEYPAD_HORIZONTAL_PADDING = 30;
const KEY_GAP = 8;
const KEY_WIDTH = (width - (KEYPAD_HORIZONTAL_PADDING * 2) - (KEY_GAP * 2)) / 3;

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
      // Find the last filled index and clear it
      const newOtp = [...otp];
      for (let i = OTP_LENGTH - 1; i >= 0; i--) {
        if (newOtp[i] !== '') {
          newOtp[i] = '';
          break;
        }
      }
      setOtp(newOtp);
    } else {
      // Find the first empty index and fill it
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

  const renderKey = (key: typeof KEYPAD[0], index: number) => {
    if (key.blank) {
      return <View key={index} style={styles.keyBlank} />;
    }

    if (key.num === 'backspace') {
      return (
        <TouchableOpacity
          key={index}
          style={styles.keyBackspace}
          onPress={() => handleKeyPress('backspace')}
          activeOpacity={0.6}
        >
          <Ionicons name="backspace-outline" size={26} color="#000" />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        key={index}
        style={styles.key}
        onPress={() => handleKeyPress(key.num)}
        activeOpacity={0.6}
      >
        <Text style={styles.keyNum}>{key.num}</Text>
        {key.letters ? <Text style={styles.keyLetters}>{key.letters}</Text> : null}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Main Content */}
      <View style={styles.content}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>
          Please check your SMS for the verification code and enter it here to complete the process.
        </Text>

        {/* OTP Input Boxes */}
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <View
              key={index}
              style={[
                styles.otpBox,
                digit !== '' && styles.otpBoxFilled,
              ]}
            >
              <Text style={styles.otpDigit}>{digit}</Text>
            </View>
          ))}
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[styles.verifyButton, isComplete && styles.verifyButtonActive]}
          onPress={handleVerify}
          disabled={!isComplete}
        >
          <Text style={[styles.verifyButtonText, isComplete && styles.verifyButtonTextActive]}>
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
      <View style={styles.numpadContainer}>
        <View style={styles.numpadRow}>
          {KEYPAD.slice(0, 3).map((key, i) => renderKey(key, i))}
        </View>
        <View style={styles.numpadRow}>
          {KEYPAD.slice(3, 6).map((key, i) => renderKey(key, i + 3))}
        </View>
        <View style={styles.numpadRow}>
          {KEYPAD.slice(6, 9).map((key, i) => renderKey(key, i + 6))}
        </View>
        <View style={styles.numpadRow}>
          {KEYPAD.slice(9, 12).map((key, i) => renderKey(key, i + 9))}
        </View>
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
    marginBottom: 24,
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
    color: '#000',
  },
  subtitle: {
    fontSize: 15,
    color: '#86868b',
    lineHeight: 22,
    marginBottom: 28,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  otpBox: {
    width: (width - 48 - 8 - 50) / 6,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxFilled: {
    borderColor: '#000',
    backgroundColor: '#fff',
  },
  otpDigit: {
    fontSize: 26,
    fontWeight: '600',
    color: '#000',
  },
  verifyButton: {
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  verifyButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  verifyButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ccc',
  },
  verifyButtonTextActive: {
    color: '#fff',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  resendTimerText: {
    fontSize: 13,
    color: '#888',
    marginBottom: 8,
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
    color: '#ccc',
  },
  numpadContainer: {
    backgroundColor: '#D1D5DB',
    paddingTop: 12,
    paddingBottom: 34,
    paddingHorizontal: KEYPAD_HORIZONTAL_PADDING,
  },
  numpadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  key: {
    width: KEY_WIDTH,
    height: 46,
    backgroundColor: '#FCFCFE',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#898989',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 0,
    elevation: 2,
  },
  keyNum: {
    fontSize: 24,
    color: '#000',
    fontWeight: '400',
  },
  keyLetters: {
    fontSize: 10,
    fontWeight: '600',
    color: '#000',
    letterSpacing: 1.5,
    marginTop: -2,
  },
  keyBlank: {
    width: KEY_WIDTH,
    height: 46,
    backgroundColor: 'transparent',
  },
  keyBackspace: {
    width: KEY_WIDTH,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
});