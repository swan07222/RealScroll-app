// app/(onboarding)/welcome.tsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Ionicons name="cube" size={40} color="#111" />
          <Text style={styles.logoText}>Welcome To RealScroll</Text>
        </View>

        {/* Terms Text */}
        <Text style={styles.termsText}>
          Read our <Text style={styles.bold}>Privacy Policy</Text>. Tap "Agree and continue"
          {'\n'}To accept <Text style={styles.bold}>Terms of Service</Text>.
        </Text>

        {/* Agree Button */}
        <TouchableOpacity
          style={styles.agreeButton}
          onPress={() => router.push('/(onboarding)/phone')}
        >
          <Text style={styles.agreeButtonText}>Agree & continue</Text>
        </TouchableOpacity>
      </View>

      {/* Watermark */}
      <Text style={styles.watermark}>Real stories. Real creators.</Text>
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginTop: 20,
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  bold: {
    fontWeight: '700',
    color: '#000',
  },
  agreeButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 60,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  agreeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  watermark: {
    textAlign: 'center',
    fontSize: 10,
    color: '#d1d1d1',
    paddingBottom: 20,
  },
});