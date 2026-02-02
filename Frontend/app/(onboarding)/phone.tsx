// app/(onboarding)/phone.tsx
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { authApi } from '@/api';

const { width } = Dimensions.get('window');

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

export default function PhoneScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleKeyPress = (key: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (key === 'backspace') {
      setPhoneNumber((prev) => prev.slice(0, -1));
    } else if (phoneNumber.length < 10) {
      setPhoneNumber((prev) => prev + key);
    }
  };

  const formatPhoneNumber = (num: string) => {
    if (num.length <= 3) return num;
    if (num.length <= 6) return `(${num.slice(0, 3)}) ${num.slice(3)}`;
    return `(${num.slice(0, 3)}) ${num.slice(3, 6)}-${num.slice(6)}`;
  };

  const isValid = phoneNumber.length >= 10;

  const handleVerify = async () => {
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

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.title}>Enter your phone number</Text>
        <Text style={styles.subtitle}>
          RealScroll needs to verify your account. Carrier charges may apply.
        </Text>

        {/* Phone Input Group */}
        <View style={styles.phoneInputGroup}>
          <TouchableOpacity style={styles.countrySelect}>
            <Text style={styles.countryText}>United States</Text>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>
          <View style={styles.numberField}>
            <Text style={styles.dialCode}>+1</Text>
            <Text
              style={[
                styles.phoneDisplay,
                phoneNumber.length === 0 && styles.placeholder,
              ]}
            >
              {phoneNumber.length > 0
                ? formatPhoneNumber(phoneNumber)
                : '| your phone number'}
            </Text>
          </View>
        </View>

        {/* Verify Button */}
        <TouchableOpacity
          style={[styles.verifyButton, isValid && styles.verifyButtonActive]}
          onPress={handleVerify}
          disabled={!isValid || isLoading}
        >
          <Text style={[styles.verifyButtonText, isValid && styles.verifyButtonTextActive]}>
            {isLoading ? 'Sending...' : 'Verify'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Keypad */}
      <View style={styles.keypadContainer}>
        <View style={styles.keypadGrid}>
          {KEYPAD.map((key, index) => {
            if (key.blank) {
              return <View key={index} style={styles.keyBlank} />;
            }

            if (key.num === 'backspace') {
              return (
                <TouchableOpacity
                  key={index}
                  style={styles.keyBackspace}
                  onPress={() => handleKeyPress('backspace')}
                >
                  <Ionicons name="backspace-outline" size={24} color="#000" />
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
          })}
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
    lineHeight: 21,
    marginBottom: 25,
  },
  phoneInputGroup: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 1,
  },
  countrySelect: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  countryText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
  },
  numberField: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    height: 50,
  },
  dialCode: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: '#eee',
    color: '#000',
  },
  phoneDisplay: {
    fontSize: 16,
    color: '#000',
    letterSpacing: 1,
  },
  placeholder: {
    color: '#ccc',
  },
  verifyButton: {
    borderRadius: 12,
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
  keypadContainer: {
    backgroundColor: '#CED2D9',
    padding: 10,
    paddingBottom: 40,
  },
  keypadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  key: {
    width: (width - 20 - 18) / 3,
    height: 48,
    backgroundColor: '#FCFCFE',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#888',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 1,
  },
  keyNum: {
    fontSize: 20,
    color: '#000',
    fontWeight: '400',
  },
  keyLetters: {
    fontSize: 9,
    fontWeight: '700',
    color: '#666',
    marginTop: 2,
  },
  keyBlank: {
    width: (width - 20 - 18) / 3,
    height: 48,
  },
  keyBackspace: {
    width: (width - 20 - 18) / 3,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});