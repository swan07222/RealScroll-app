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
import Svg, { Rect, Circle, Line, Path, G } from 'react-native-svg';
import * as Haptics from 'expo-haptics';

export default function VerificationErrorScreen() {
  const { error } = useLocalSearchParams<{ error: string }>();

  const handleTryAgain = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    router.replace('/(onboarding)/phone');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Phone with X Illustration */}
        <View style={styles.illustrationContainer}>
          <Svg width={120} height={120} viewBox="0 0 100 100" fill="none">
            <G transform="translate(50, 50) rotate(-10) translate(-50, -50)">
              {/* Phone Frame */}
              <Rect x={30} y={20} width={40} height={60} rx={4} stroke="#000" strokeWidth={2} fill="#fff" />
              {/* Red Cross Circle */}
              <Circle cx={50} cy={50} r={10} fill="#FF3B30" />
              <Path d="M46 46 l8 8 M54 46 l-8 8" stroke="#fff" strokeWidth={2} />
              {/* Radiating Lines Red */}
              <Line x1={25} y1={15} x2={35} y2={25} stroke="#FF3B30" strokeWidth={2} />
              <Line x1={75} y1={15} x2={65} y2={25} stroke="#FF3B30" strokeWidth={2} />
            </G>
          </Svg>
        </View>

        <Text style={styles.statusText}>Error Verifying Number</Text>
        
        <Ionicons name="alert-circle" size={32} color="#FF3B30" style={styles.errorIcon} />
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
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  illustrationContainer: {
    marginBottom: 24,
  },
  statusText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
  },
  errorIcon: {
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