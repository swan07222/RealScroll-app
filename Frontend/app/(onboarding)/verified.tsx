// app/(onboarding)/verified.tsx
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function VerifiedScreen() {
  const handleContinue = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace('/(onboarding)/setup-username');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Phone with Check Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.phoneFrame}>
            <View style={styles.phoneSpeaker} />
            <View style={styles.phoneScreen}>
              <View style={styles.checkCircle}>
                <Ionicons name="checkmark" size={24} color="#fff" />
              </View>
            </View>
            <View style={styles.phoneButton} />
          </View>
          {/* Sparkle lines */}
          <View style={[styles.sparkle, styles.sparkleTopLeft]} />
          <View style={[styles.sparkle, styles.sparkleTopRight]} />
        </View>

        <Text style={styles.statusText}>Phone Number Verified</Text>
        
        <Ionicons name="checkmark-circle" size={32} color="#34C759" style={styles.checkIcon} />
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Setup Account</Text>
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
  checkCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#34C759',
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
    backgroundColor: '#34C759',
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
  checkIcon: {
    marginTop: 10,
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