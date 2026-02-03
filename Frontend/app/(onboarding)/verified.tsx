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
import Svg, { Rect, Circle, Line, Path, G } from 'react-native-svg';
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
          <Svg width={120} height={120} viewBox="0 0 100 100" fill="none">
            <G transform="translate(50, 50) rotate(-10) translate(-50, -50)">
              {/* Phone Frame */}
              <Rect x={30} y={20} width={40} height={60} rx={4} stroke="#000" strokeWidth={2} fill="#fff" />
              {/* Speaker */}
              <Line x1={45} y1={25} x2={55} y2={25} stroke="#000" strokeWidth={2} />
              {/* Home Button */}
              <Line x1={40} y1={75} x2={60} y2={75} stroke="#000" strokeWidth={2} />
              {/* Green Check Circle */}
              <Circle cx={50} cy={50} r={10} fill="#34C759" />
              <Path d="M46 50 l3 3 l5 -5" stroke="#fff" strokeWidth={2} />
              {/* Radiating Lines */}
              <Line x1={25} y1={15} x2={35} y2={25} stroke="#34C759" strokeWidth={2} />
              <Line x1={75} y1={15} x2={65} y2={25} stroke="#34C759" strokeWidth={2} />
            </G>
          </Svg>
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