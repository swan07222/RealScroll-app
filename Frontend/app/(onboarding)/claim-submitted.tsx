// app/(onboarding)/claim-submitted.tsx
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Rect, Circle, Path, Line, G } from 'react-native-svg';
import * as Haptics from 'expo-haptics';

export default function ClaimSubmittedScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckbox = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsChecked(!isChecked);
  };

  const handleComplete = () => {
    if (!isChecked) return;
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace('/(onboarding)/setup-username');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* ID Badge Illustration */}
        <View style={styles.illustrationContainer}>
          <Svg width={120} height={120} viewBox="0 0 100 100" fill="none" style={{ transform: [{ rotate: '-5deg' }] }}>
            <G stroke="#000" strokeWidth={2}>
              {/* Badge */}
              <Rect x={25} y={40} width={50} height={35} rx={3} fill="#fff" />
              {/* Lanyard clip */}
              <Path d="M45 40 L40 25 L60 25 L55 40" fill="#fff" />
              <Path d="M40 25 L35 15 M60 25 L65 15" strokeWidth={3} />
              {/* ID details */}
              <Circle cx={50} cy={55} r={5} />
              <Line x1={35} y1={65} x2={65} y2={65} strokeWidth={1} />
            </G>
            {/* Green Badge */}
            <Circle cx={75} cy={75} r={8} fill="#34C759" stroke="#fff" strokeWidth={2} />
            <Path d="M72 75 l2 2 l4 -4" stroke="#fff" strokeWidth={2} />
            {/* Green sparkles */}
            <Path d="M70 25 l2 -5 l2 5" fill="#34C759" />
            <Path d="M80 30 l2 -5 l2 5" fill="#34C759" />
          </Svg>
        </View>

        <Text style={styles.statusText}>Your Request Is Submitted</Text>
        
        <Ionicons name="checkmark-circle" size={32} color="#34C759" style={styles.checkIcon} />
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.infoText}>
          For now, you can <Text style={styles.infoBold}>use a different username</Text>. If{'\n'}
          approved, your claimed username will be granted.
        </Text>

        {/* Checkbox */}
        <TouchableOpacity style={styles.checkboxRow} onPress={handleCheckbox}>
          <Text style={styles.checkboxLabel}>I understand</Text>
          <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
            {isChecked && <Ionicons name="checkmark" size={14} color="#fff" />}
          </View>
        </TouchableOpacity>

        {/* Complete Button */}
        <TouchableOpacity
          style={[
            styles.completeButton,
            isChecked ? styles.completeButtonActive : styles.completeButtonInactive,
          ]}
          onPress={handleComplete}
          disabled={!isChecked}
        >
          <Text
            style={[
              styles.completeButtonText,
              isChecked ? styles.completeButtonTextActive : styles.completeButtonTextInactive,
            ]}
          >
            Complete
          </Text>
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
    alignItems: 'center',
  },
  infoText: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  infoBold: {
    fontWeight: '700',
    color: '#000',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#86868b',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  completeButton: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  completeButtonActive: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  completeButtonInactive: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  completeButtonText: {
    fontSize: 17,
    fontWeight: '600',
  },
  completeButtonTextActive: {
    color: '#000',
  },
  completeButtonTextInactive: {
    color: '#ccc',
  },
});