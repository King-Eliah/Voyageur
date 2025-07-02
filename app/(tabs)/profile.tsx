import { useState, useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreditCard as Edit3, Settings, Bell, CircleHelp as HelpCircle, Info, CreditCard, LogOut, MapPin, Calendar, Star, ChevronRight, ChartBar as BarChart3, Camera } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useData } from '@/contexts/DataContext';

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { user, logout, updateUser } = useAuth();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const { trips } = useData();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/auth');
          },
        },
      ]
    );
  };

  // Calculate stats dynamically from trips data
  const stats = useMemo(() => {
    const tripsCompleted = trips.filter(trip => trip.status === 'completed').length;
    
    const reviewsWritten = trips.reduce(
      (count, trip) => count + (trip.review ? 1 : 0),
      0
    );
    
    const countriesVisited = [
      ...new Set(
        trips
          .filter(trip => trip.status === 'completed')
          .map(trip => trip.destination)
      )
    ].length;

    return [
      {
        id: '1',
        title: 'Countries Visited',
        value: countriesVisited,
        icon: MapPin,
        color: '#3B82F6',
      },
      {
        id: '2',
        title: 'Trips Completed',
        value: tripsCompleted,
        icon: Calendar,
        color: '#10B981',
      },
      {
        id: '3',
        title: 'Reviews Written',
        value: reviewsWritten,
        icon: Star,
        color: '#F59E0B',
      },
    ];
  }, [trips]);

  const pickImage = async () => {
    try {
      setIsUploading(true);
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need access to your photos to upload a profile picture');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        await updateUser({ profileImage: uri });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const takePhoto = async () => {
    try {
      setIsUploading(true);
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need access to your camera to take a photo');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        await updateUser({ profileImage: uri });
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      'Update Profile Picture',
      'Choose an option',
      [
        {
          text: 'Take Photo',
          onPress: takePhoto,
        },
        {
          text: 'Choose from Library',
          onPress: pickImage,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const menuItems = [
    {
      id: '1',
      title: 'Travel Stats',
      icon: BarChart3,
      onPress: () => router.push('/profile/stats'),
      color: colors.primary,
    },
    {
      id: '2',
      title: 'Edit Profile',
      icon: Edit3,
      onPress: () => router.push('/profile/edit'),
      color: colors.primary,
    },
    {
      id: '3',
      title: 'My Reviews',
      icon: Star,
      onPress: () => router.push('/profile/reviews'),
      color: colors.primary,
    },
    {
      id: '4',
      title: 'Settings',
      icon: Settings,
      onPress: () => router.push('/profile/settings'),
      color: colors.textSecondary,
    },
    {
      id: '5',
      title: 'Notifications',
      icon: Bell,
      onPress: () => router.push('/profile/notifications'),
      color: colors.textSecondary,
    },
    {
      id: '6',
      title: 'Payment Methods',
      icon: CreditCard,
      onPress: () => router.push('/profile/payment'),
      color: colors.textSecondary,
    },
    {
      id: '7',
      title: 'Help & Support',
      icon: HelpCircle,
      onPress: () => router.push('/profile/help'),
      color: colors.textSecondary,
    },
    {
      id: '8',
      title: 'About',
      icon: Info,
      onPress: () => router.push('/profile/about'),
      color: colors.textSecondary,
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
        </View>

        <View style={[styles.profileSection, { backgroundColor: colors.card }]}>
          <TouchableOpacity 
            style={styles.profileImageContainer}
            onPress={showImagePickerOptions}
            disabled={isUploading}
          >
            {isUploading ? (
              <View style={[styles.profileImage, styles.loadingImage]}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : (
              <Image
                source={user?.profileImage 
                  ? { uri: user.profileImage } 
                  : require('../../assets/images/profile.png')}
                style={styles.profileImage}
                defaultSource={require('../../assets/images/profile.png')} 
              />
            )}
            <View style={[styles.editBadge, { backgroundColor: colors.primary }]}>
              <Edit3 size={12} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          
          <Text style={[styles.userName, { color: colors.text }]}>
            {user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
          </Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            {user?.email || 'guest@example.com'}
          </Text>
          
          <TouchableOpacity
            style={[styles.editProfileButton, { borderColor: colors.primary }]}
            onPress={() => router.push('/profile/edit')}
          >
            <Text style={[styles.editProfileText, { color: colors.primary }]}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Travel Stats</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat) => (
              <View key={stat.id} style={[styles.statCard, { backgroundColor: colors.card }]}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                  <stat.icon size={20} color={stat.color} />
                </View>
                <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
                <Text style={[styles.statTitle, { color: colors.textSecondary }]}>{stat.title}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Account</Text>
          <View style={[styles.menuContainer, { backgroundColor: colors.card }]}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  index !== menuItems.length - 1 && { 
                    borderBottomColor: colors.border, 
                    borderBottomWidth: 1 
                  }
                ]}
                onPress={item.onPress}
              >
                <View style={styles.menuItemLeft}>
                  <View style={[styles.menuIcon, { backgroundColor: item.color + '20' }]}>
                    <item.icon size={20} color={item.color} />
                  </View>
                  <Text style={[styles.menuItemText, { color: colors.text }]}>{item.title}</Text>
                </View>
                <ChevronRight size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: '#EF4444' + '20' }]}
            onPress={handleLogout}
          >
            <LogOut size={20} color="#EF4444" />
            <Text style={[styles.logoutText, { color: '#EF4444' }]}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.versionSection}>
          <Text style={[styles.versionText, { color: colors.textSecondary }]}>
            Voyageur v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  loadingImage: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    marginBottom: 20,
  },
  editProfileButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  menuSection: {
    marginBottom: 24,
  },
  menuContainer: {
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  logoutSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  versionSection: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  versionText: {
    fontSize: 14,
  },
});