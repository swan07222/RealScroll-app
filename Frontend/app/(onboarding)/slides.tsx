// app/(onboarding)/slides.tsx
import { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ViewToken,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { storage } from '@/utils/storage';
import { Config } from '@/constants/config';

const { width } = Dimensions.get('window');

interface Slide {
  id: string;
  title: string;
  description: string;
}

const SLIDES: Slide[] = [
  {
    id: '1',
    title: 'The future of real\nsocial media.',
    description: 'Every post is verified human. No AI content. Just real moments from real people.',
  },
  {
    id: '2',
    title: 'Scroll confidently.\nEverything is real.',
    description: 'We scan every upload to block AI and fake media so what you see is real.',
  },
  {
    id: '3',
    title: 'Authentic posts.\nVerified people.',
    description: 'Bringing social media back to real people, real moments, and content you can trust.',
  },
];

interface ViewableItemsChanged {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}

export default function SlidesScreen() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const flatListRef = useRef<FlatList<Slide>>(null);

  const handleViewableItemsChanged = useRef(
    ({ viewableItems }: ViewableItemsChanged): void => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const completeOnboarding = async (): Promise<void> => {
    await storage.set(Config.STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
  };

  const handleGetStarted = (): void => {
    router.push('/(onboarding)/language');
  };

  const handleLogin = async (): Promise<void> => {
    await completeOnboarding();
    router.replace('/(auth)/login');
  };

  const handleSkip = async (): Promise<void> => {
    await completeOnboarding();
    router.replace('/(tabs)');
  };

  const renderSlide = ({ item }: { item: Slide }): React.ReactElement => (
    <View style={styles.slide}>
      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <View style={styles.doodleCard}>
          <View style={styles.avatarCircle}>
            <View style={styles.avatarInner} />
          </View>
          <View style={styles.line1} />
          <View style={styles.line2} />
        </View>
        {/* Sparkle */}
        <View style={styles.sparkleContainer}>
          <Ionicons name="flash" size={24} color="#22C55E" />
        </View>
      </View>
    </View>
  );

  const renderDot = (_: Slide, index: number): React.ReactElement => (
    <View
      key={`dot-${index}`}
      style={[
        styles.dot,
        currentIndex === index ? styles.dotActive : styles.dotInactive,
      ]}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Ionicons name="checkmark" size={14} color="#fff" />
          </View>
          <Text style={styles.logoText}>RealScroll</Text>
        </View>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item: Slide): string => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        style={styles.flatList}
      />

      {/* Bottom Content */}
      <View style={styles.bottomContent}>
        {/* Dots */}
        <View style={styles.dotsContainer}>
          {SLIDES.map(renderDot)}
        </View>

        {/* Title & Description */}
        <Text style={styles.title}>{SLIDES[currentIndex].title}</Text>
        <Text style={styles.description}>{SLIDES[currentIndex].description}</Text>

        {/* Buttons */}
        <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
          <Text style={styles.getStartedButtonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#000',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  skipButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  skipButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  flatList: {
    flex: 1,
  },
  slide: {
    width: width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  doodleCard: {
    width: 120,
    height: 180,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    transform: [{ rotate: '-10deg' }],
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarInner: {
    width: 40,
    height: 40,
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
  },
  line1: {
    width: 70,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 8,
  },
  line2: {
    width: 50,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
  },
  sparkleContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  bottomContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 24,
    backgroundColor: '#000',
  },
  dotInactive: {
    width: 6,
    backgroundColor: '#D1D5DB',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    lineHeight: 38,
    letterSpacing: -1,
    textAlign: 'center',
    marginBottom: 12,
    color: '#000',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  getStartedButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F3F4F6',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  getStartedButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
  },
  loginButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000',
  },
  homeIndicator: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  indicator: {
    width: 130,
    height: 5,
    backgroundColor: '#000',
    borderRadius: 3,
  },
});