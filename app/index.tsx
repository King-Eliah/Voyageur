import { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { colors } = useTheme();

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');

        setTimeout(() => {
          if (!hasSeenOnboarding) {
            router.replace('/onboarding');
          } else if (isAuthenticated) {
            router.replace('/(tabs)');
          } else {
            router.replace('/auth');
          }
        }, 3000);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        router.replace('/onboarding');
      }
    };

    checkOnboarding();
  }, [isAuthenticated]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background}]}>
      {/* Logo Image */}
      <Image
        source={require('../assets/images/logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 340,
    height: 340,
   
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 10,
    color: '#000000',
    opacity: 0.9,
    marginBottom: 40,
  },
 
});
