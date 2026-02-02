// app/(onboarding)/verification-error.tsx
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function VerificationErrorScreen() {
  const { error } = useLocalSearchParams<{ error: string }>();

  const handleTryAgain = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    // Go back to phone input screen
    router.replace('/(onboarding)/phone');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Phone with X Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.phoneFrame}>
            <View style={styles.phoneSpeaker} />
            <View style={styles.phoneScreen}>
              <View style={styles.errorCircle}>
                <Ionicons name="close" size={24} color="#fff" />
              </View>
            </View>
            <View style={styles.phoneButton} />
          </View>
          {/* Sparkle lines */}
          <View style={[styles.sparkle, styles.sparkleTopLeft]} />
          <View style={[styles.sparkle, styles.sparkleTopRight]} />
        </View>

        <Text style={styles.statusText}>Error Verifying Number</Text>
        
        <Ionicons name="alert-circle" size={32} color="#FF3B30" style={styles.errorIcon} />
        
        {error && <Text style={styles.errorMessage}>{error}</Text>}
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={handleTryAgain}>
          <Text style={styles.buttonText}>Try Again</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  illustrationContainer: {
    marginBottom: 32,
    position: 'relative',
  },
  phoneFrame: {
    width: 80,
    height: 140,
    borderWidth: 3,
    borderColor: '#000',
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 8,
    transform: [{ rotate: '-10deg' }],
  },
  phoneSpeaker: {
    width: 30,
    height: 4,
    backgroundColor: '#000',
    borderRadius: 2,
    marginBottom: 8,
  },
  phoneScreen: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneButton: {
    width: 40,
    height: 4,
    backgroundColor: '#000',
    borderRadius: 2,
    marginTop: 8,
  },
  sparkle: {
    position: 'absolute',
    width: 3,
    height: 12,
    backgroundColor: '#FF3B30',
  },
  sparkleTopLeft: {
    top: -5,
    left: 5,
    transform: [{ rotate: '-30deg' }],
  },
  sparkleTopRight: {
    top: 0,
    right: -5,
    transform: [{ rotate: '30deg' }],
  },
  statusText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  errorIcon: {
    marginTop: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  button: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
});