import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  countriesVisited: number;
  tripsCompleted: number;
  visitedCountries: string[]; // Added to track specific countries
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isUploading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  uploadProfilePicture: (imageUri: string) => Promise<void>;
  pickImage: () => Promise<string | null>;
  takePhoto: () => Promise<string | null>;
  incrementTripsCompleted: () => void;
  addVisitedCountry: (country: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        // Ensure visitedCountries exists
        const userWithCountries = {
          ...parsedUser,
          visitedCountries: parsedUser.visitedCountries || []
        };
        setUser(userWithCountries);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserData = async (userData: User) => {
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // Stats management functions
  const incrementTripsCompleted = () => {
    if (user) {
      const updatedUser = {
        ...user,
        tripsCompleted: user.tripsCompleted + 1
      };
      saveUserData(updatedUser);
    }
  };

  const addVisitedCountry = (country: string) => {
    if (user && !user.visitedCountries.includes(country)) {
      const updatedUser = {
        ...user,
        countriesVisited: user.countriesVisited + 1,
        visitedCountries: [...user.visitedCountries, country]
      };
      saveUserData(updatedUser);
    }
  };

  // Image handling functions
  const pickImage = async (): Promise<string | null> => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need access to your photos to upload a profile picture');
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        return result.assets[0].uri;
      }
      return null;
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
      return null;
    }
  };

  const takePhoto = async (): Promise<string | null> => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need access to your camera to take a photo');
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        return result.assets[0].uri;
      }
      return null;
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      return null;
    }
  };

  const uploadProfilePicture = async (imageUri: string) => {
    try {
      setIsUploading(true);
      if (user) {
        const updatedUser = { ...user, profileImage: imageUri };
        saveUserData(updatedUser);
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Auth functions
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData: User = {
        id: '1',
        email,
        firstName: 'John',
        lastName: 'Doe',
        profileImage: undefined,
        countriesVisited: 12,
        tripsCompleted: 8,
        visitedCountries: ['France', 'Italy', 'Japan', 'USA']
      };
      
      saveUserData(userData);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData: User = {
        id: Date.now().toString(),
        email,
        firstName,
        lastName,
        profileImage: undefined,
        countriesVisited: 0,
        tripsCompleted: 0,
        visitedCountries: []
      };
      
      saveUserData(userData);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      // Simulate Google login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData: User = {
        id: 'google_' + Date.now(),
        email: 'user@gmail.com',
        firstName: 'Google',
        lastName: 'User',
        profileImage: undefined,
        countriesVisited: 5,
        tripsCompleted: 3,
        visitedCountries: ['Canada', 'Mexico', 'Brazil']
      };
      
      saveUserData(userData);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithFacebook = async () => {
    try {
      setIsLoading(true);
      // Simulate Facebook login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const userData: User = {
        id: 'facebook_' + Date.now(),
        email: 'user@facebook.com',
        firstName: 'Facebook',
        lastName: 'User',
        profileImage: undefined,
        countriesVisited: 3,
        tripsCompleted: 2,
        visitedCountries: ['Germany', 'Spain']
      };
      
      saveUserData(userData);
      setIsAuthenticated(true);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      setUser(null);
      setIsAuthenticated(false);
      await AsyncStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      setIsLoading(true);
      if (user) {
        const updatedUser = { ...user, ...userData };
        saveUserData(updatedUser);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      isUploading,
      login,
      register,
      logout,
      updateUser,
      loginWithGoogle,
      loginWithFacebook,
      uploadProfilePicture,
      pickImage,
      takePhoto,
      incrementTripsCompleted,
      addVisitedCountry
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}