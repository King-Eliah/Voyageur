import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnboardingStep3() {
  const router = useRouter();
  const { colors } = useTheme();

  const handleGetStarted = async () => {
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');
    router.replace('/auth');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Image
           source={require('../../assets/images/onb3.png')}
          style={styles.image}
        />
        <Text style={[styles.title, { color: colors.text }]}>Travel with Confidence</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Get real-time updates, access your bookings offline, and enjoy 24/7 support wherever you go
        </Text>
        
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleGetStarted}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.pagination}>
        <View style={[styles.dot, { backgroundColor: colors.border }]} />
        <View style={[styles.dot, { backgroundColor: colors.border }]} />
        <View style={[styles.dot, { backgroundColor: colors.primary }]} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  image: {
    width: 200,
    height: 200,
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
  button: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});