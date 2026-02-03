// app/(onboarding)/phone.tsx
import { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { authApi } from '@/api';

const { width } = Dimensions.get('window');

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

export default function PhoneScreen() {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleKeyPress = (key: string): void => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (key === 'backspace') {
      setPhoneNumber((prev: string) => prev.slice(0, -1));
    } else if (phoneNumber.length < 10) {
      setPhoneNumber((prev: string) => prev + key);
    }
  };

  const formatPhoneNumber = (num: string): string => {
    if (num.length <= 3) return num;
    if (num.length <= 6) return `(${num.slice(0, 3)}) ${num.slice(3)}`;
    return `(${num.slice(0, 3)}) ${num.slice(3, 6)}-${num.slice(6)}`;
  };

  const isValid = phoneNumber.length >= 10;

  const handleVerify = async (): Promise<void> => {
    if (!isValid) return;
    
    setIsLoading(true);
    try {
      await authApi.sendOtp(`+1${phoneNumber}`);
      router.push({
        pathname: '/(onboarding)/verify-otp',
        params: { phone: `+1${phoneNumber}` },
      });
    } catch (error) {
      console.error('Send OTP error:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
        {/* Title */}
        <Text style={styles.title}>Enter your phone number</Text>
        <Text style={styles.subtitle}>
          Realscroll needs to verify your account carrier charges may apply.
        </Text>

        {/* Phone Input Card */}
        <View style={styles.phoneCard}>
          <TouchableOpacity style={styles.countryRow}>
            <Text style={styles.countryText}>United States</Text>
            <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <View style={styles.numberRow}>
            <Text style={styles.dialCode}>+1</Text>
            <View style={styles.dialCodeDivider} />
            <Text
              style={[
                styles.phoneDisplay,
                !phoneNumber && styles.placeholder,
              ]}
            >
              {phoneNumber 
                ? formatPhoneNumber(phoneNumber) 
                : '|your phone number'}
            </Text>
          </View>
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[
            styles.verifyButton,
            isValid && styles.verifyButtonActive,
          ]}
          onPress={handleVerify}
          disabled={!isValid || isLoading}
        >
          <Text
            style={[
              styles.verifyButtonText,
              isValid && styles.verifyButtonTextActive,
            ]}
          >
            {isLoading ? 'Sending...' : 'Verify'}
          </Text>
        </TouchableOpacity>
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
    backgroundColor: '#FAFAF9',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
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
  phoneCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
    marginBottom: 16,
  },
  countryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  countryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  dialCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginRight: 12,
  },
  dialCodeDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E5E7EB',
    marginRight: 12,
  },
  phoneDisplay: {
    fontSize: 14,
    color: '#000',
    letterSpacing: 0.5,
  },
  placeholder: {
    color: '#D1D5DB',
  },
  verifyButton: {
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  verifyButtonActive: {
    backgroundColor: '#000',
  },
  verifyButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#D1D5DB',
  },
  verifyButtonTextActive: {
    color: '#fff',
  },
  keypadContainer: {
    backgroundColor: '#D1D5DB',
    paddingVertical: 8,
    paddingHorizontal: 6,
    paddingBottom: 8,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  keypadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  key: {
    width: (width - 12 - 18) / 3,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#888',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 0,
    elevation: 1,
  },
  keyNum: {
    fontSize: 20,
    fontWeight: '400',
    color: '#000',
  },
  keyLetters: {
    fontSize: 9,
    fontWeight: '700',
    color: '#000',
    letterSpacing: 1.5,
    marginTop: 1,
  },
  keyBlank: {
    width: (width - 12 - 18) / 3,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIndicator: {
    alignItems: 'center',
    paddingVertical: 8,
    backgroundColor: '#D1D5DB',
  },
  indicator: {
    width: 130,
    height: 5,
    backgroundColor: '#000',
    borderRadius: 3,
  },
});