// app/(onboarding)/welcome.tsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { HomeIndicator } from '@/components/onboarding/home-indicator';
import { DynamicIsland } from '@/components/onboarding/dynamic-island';

export default function WelcomeScreen() {
  const handleAgree = () => {
    router.push('/(onboarding)/phone');
  };

  return (
    <View style={styles.container}>
      <DynamicIsland />

      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          {/* Geometric Logo */}
          <View style={styles.logoOuter}>
            <View style={styles.logoInner} />
          </View>
        </View>

        <Text style={styles.title}>Welcome To RealScroll</Text>
        
        <Text style={styles.termsText}>
          Read our <Text style={styles.bold}>Privacy Policy</Text>. Tap "Agree and continue"
          {'\n'}To accept <Text style={styles.bold}>Terms of Service</Text>.
        </Text>

        <TouchableOpacity style={styles.agreeButton} onPress={handleAgree}>
          <Text style={styles.agreeButtonText}>Agree & continue</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.watermark}>Real stories. Real creators.</Text>
      <HomeIndicator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF9',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    marginBottom: 32,
  },
  logoOuter: {
    width: 48,
    height: 48,
    backgroundColor: '#000',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }],
  },
  logoInner: {
    width: 24,
    height: 24,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  title: {
    fontSize: 21,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  termsText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  bold: {
    fontWeight: '700',
    color: '#000',
  },
  agreeButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F0F0F0',
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
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: '#D1D5DB',
  },
});