import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnboardingIntro() {
  const router = useRouter();
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const screenWidth = Dimensions.get('window').width;

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / screenWidth);
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    if (currentIndex < 2) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * screenWidth,
        animated: true
      });
    } else {
      AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.replace('/auth');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {/* Screen 1 - Welcome */}
        <View style={[styles.screen, { width: screenWidth }]}>
          <View style={styles.content}>
            <Image
              source={require('../../assets/images/onb77.png')} 
              style={styles.image}
            />
            <Text style={[styles.title, { color: colors.text }]}>Welcome to Voyageur</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Plan your perfect trip with our comprehensive travel planning tools
            </Text>
          </View>
        </View>

        {/* Screen 2 - Features */}
        <View style={[styles.screen, { width: screenWidth }]}>
          <View style={styles.content}>
            <Image
              source={require('../../assets/images/onb44.png')} 
              style={styles.image}
            />
            <Text style={[styles.title, { color: colors.text }]}>Plan Your Perfect Trip</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Create detailed itineraries, manage bookings, and keep all your travel information in one place
            </Text>
          </View>
        </View>

        {/* Screen 3 - Get Started */}
        <View style={[styles.screen, { width: screenWidth }]}>
          <View style={styles.content}>
            <Image
              source={require('../../assets/images/onb33.png')} 
              style={styles.image}
            />
            <Text style={[styles.title, { color: colors.text }]}>Travel with Confidence</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Get real-time updates, access your bookings offline, and enjoy 24/7 support wherever you go
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Controls */}
      <View style={styles.controlsContainer}>
        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {[0, 1, 2].map((index) => (
            <View 
              key={index}
              style={[
                styles.dot, 
                { 
                  backgroundColor: index === currentIndex ? colors.primary : colors.border,
                  marginHorizontal: 4,
                }
              ]} 
            />
          ))}
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={goToNext}
        >
          <Text style={styles.buttonText}>
            {currentIndex < 2 ? 'Next' : 'Get Started'}
          </Text>
        </TouchableOpacity>

        {/* Skip Button (only shown on first two screens) */}
        {currentIndex < 2 && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => {
              AsyncStorage.setItem('hasSeenOnboarding', 'true');
              router.replace('/auth');
            }}
          >
            <Text style={[styles.skipText, { color: colors.textSecondary }]}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 60,
  },
  image: {
    width: 320,
    height: 320,
    borderRadius: 16,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  controlsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  button: {
    width: '50%',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    padding: 16,
  },
  skipText: {
    fontSize: 16,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});