import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Camera, User, Mail, Phone, MapPin, } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function EditProfileScreen() {
  const { colors } = useTheme();
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    bio: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateUser(formData);
      Alert.alert('Success', 'Profile updated successfully!');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImagePicker = () => {
    Alert.alert(
      'Change Profile Photo',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => console.log('Camera selected') },
        { text: 'Photo Library', onPress: () => console.log('Library selected') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };
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
  
      console.log('Image picker result:', result); // Add this for debugging
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        console.log('Selected image URI:', uri); // Debug log
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
  
      console.log('Camera result:', result); // Add this for debugging
  
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        console.log('Captured image URI:', uri); // Debug log
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
            icon: () => <Camera size={20} color={colors.primary} />,
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          <Text style={[styles.saveButton, { color: colors.primary }]}>
            {loading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Photo */}
        <View style={styles.photoSection}>
          <TouchableOpacity style={styles.photoContainer} onPress={showImagePickerOptions}>
         <Image
  source={user?.profileImage 
    ? { uri: user.profileImage } 
    : require('../../assets/images/profile.png')
  }
  style={styles.profilePhoto}
  defaultSource={require('../../assets/images/profile.png')} // Fallback for loading
/>
            <View style={[styles.cameraButton, { backgroundColor: colors.primary }]}>
              <Camera size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <Text style={[styles.photoText, { color: colors.textSecondary }]}>Tap to change photo</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={[styles.label, { color: colors.text }]}>First Name</Text>
              <View style={styles.inputWithIcon}>
                <User size={20} color={colors.textSecondary} />
                <TextInput
                  style={[styles.input, { color: colors.text, backgroundColor: colors.inputBackground, borderColor: colors.border }]}
                  value={formData.firstName}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, firstName: text }))}
                  placeholder="First name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={[styles.label, { color: colors.text }]}>Last Name</Text>
              <View style={styles.inputWithIcon}>
                <User size={20} color={colors.textSecondary} />
                <TextInput
                  style={[styles.input, { color: colors.text, backgroundColor: colors.inputBackground, borderColor: colors.border }]}
                  value={formData.lastName}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, lastName: text }))}
                  placeholder="Last name"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Email</Text>
            <View style={styles.inputWithIcon}>
              <Mail size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: colors.text, backgroundColor: colors.inputBackground, borderColor: colors.border }]}
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                placeholder="Email address"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Phone</Text>
            <View style={styles.inputWithIcon}>
              <Phone size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: colors.text, backgroundColor: colors.inputBackground, borderColor: colors.border }]}
                value={formData.phone}
                onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                placeholder="Phone number"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Location</Text>
            <View style={styles.inputWithIcon}>
              <MapPin size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: colors.text, backgroundColor: colors.inputBackground, borderColor: colors.border }]}
                value={formData.location}
                onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
                placeholder="City, Country"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Bio</Text>
            <TextInput
              style={[
                styles.textArea,
                { color: colors.text, backgroundColor: colors.inputBackground, borderColor: colors.border }
              ]}
              value={formData.bio}
              onChangeText={(text) => setFormData(prev => ({ ...prev, bio: text }))}
              placeholder="Tell us about yourself..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  photoSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoText: {
    fontSize: 14,
  },
  form: {
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    marginBottom: 20,
  },
  halfWidth: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingLeft: 48,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    marginLeft:10
  },
  textArea: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
    minHeight: 100,
  },
});