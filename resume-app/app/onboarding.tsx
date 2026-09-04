import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants';

const { width, height } = Dimensions.get('window');

const ONBOARDING_STEPS = [
  {
    id: 1,
    emoji: '🚀',
    title: 'Welcome to Resume Hub',
    subtitle: 'Build professional resumes in minutes',
    description: 'Create stunning, ATS-friendly resumes that stand out. Choose from 25+ professionally designed templates.',
    color: COLORS.primary,
    bgColor: '#e0e7ff',
  },
  {
    id: 2,
    emoji: '🎨',
    title: 'Choose a Template',
    subtitle: '25+ professional designs',
    description: 'From minimalist to creative, find the perfect template for your industry. Each template is optimized for Applicant Tracking Systems.',
    color: '#6366f1',
    bgColor: '#e0e7ff',
  },
  {
    id: 3,
    emoji: '✏️',
    title: 'Fill in Your Details',
    subtitle: 'Easy step-by-step editor',
    description: 'Add your experience, education, skills, and more. Our smart editor guides you through each section.',
    color: COLORS.success,
    bgColor: '#d1fae5',
  },
  {
    id: 4,
    emoji: '📄',
    title: 'Export & Share',
    subtitle: 'Download as PDF or JSON',
    description: 'Export your resume as a print-ready PDF or save as JSON to continue editing later. Share directly from your phone.',
    color: COLORS.warning,
    bgColor: '#fef3c7',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      scrollViewRef.current?.scrollTo({ x: nextStep * width, animated: true });
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('@resume_hub_onboarding_done', 'true');
    } catch {}
    router.replace('/');
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = (e: any) => {
    const step = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentStep(step);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Skip Button */}
      <View style={styles.topBar}>
        <View style={{ width: 60 }} />
        <View style={styles.dots}>
          {ONBOARDING_STEPS.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                idx === currentStep && styles.dotActive,
                { backgroundColor: idx === currentStep ? ONBOARDING_STEPS[currentStep].color : COLORS.gray200 },
              ]}
            />
          ))}
        </View>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {ONBOARDING_STEPS.map((step, idx) => (
          <View key={step.id} style={[styles.slide, { width }]}>
            <View style={[styles.slideContent, { backgroundColor: step.bgColor }]}>
              <View style={[styles.emojiContainer, { backgroundColor: step.color + '20' }]}>
                <Text style={styles.emoji}>{step.emoji}</Text>
              </View>
              <Text style={[styles.slideTitle, { color: step.color }]}>{step.title}</Text>
              <Text style={styles.slideSubtitle}>{step.subtitle}</Text>
              <Text style={styles.slideDescription}>{step.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: ONBOARDING_STEPS[currentStep].color }]}
          onPress={handleNext}
        >
          <Text style={styles.nextText}>
            {currentStep === ONBOARDING_STEPS.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Ionicons
            name={currentStep === ONBOARDING_STEPS.length - 1 ? 'rocket' : 'arrow-forward'}
            size={18}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotActive: { width: 24 },
  skipButton: { width: 60, alignItems: 'flex-end' },
  skipText: { fontSize: 14, fontWeight: '500', color: COLORS.gray400 },
  scrollView: { flex: 1 },
  slide: { flex: 1 },
  slideContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    marginHorizontal: 20,
    borderRadius: 24,
  },
  emojiContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  emoji: { fontSize: 56 },
  slideTitle: { fontSize: 28, fontWeight: '800', textAlign: 'center', marginBottom: 8 },
  slideSubtitle: { fontSize: 16, fontWeight: '600', color: COLORS.gray600, textAlign: 'center', marginBottom: 12 },
  slideDescription: { fontSize: 14, color: COLORS.gray500, textAlign: 'center', lineHeight: 22 },
  bottomBar: {
    padding: 20,
    paddingBottom: 32,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
  },
  nextText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
});
