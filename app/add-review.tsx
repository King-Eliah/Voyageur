import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Image, FlatList } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useData } from '@/contexts/DataContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Star, X, Camera, Image as ImageIcon, ChevronLeft, Trash2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { format } from 'date-fns';

export default function AddReviewScreen() {
  const { id } = useLocalSearchParams();
  const { trips, updateTrip } = useData();
  const { colors } = useTheme();
  const router = useRouter();
  
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const trip = trips.find(t => t.id === id);

  const pickImage = async () => {
    try {
      setIsUploading(true);
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need access to your photos to add images');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map(asset => asset.uri);
        setImages(prev => [...prev, ...newImages]);
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to select images');
    } finally {
      setIsUploading(false);
    }
  };

  const takePhoto = async () => {
    try {
      setIsUploading(true);
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need access to your camera');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        setImages(prev => [...prev, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const submitReview = async () => {
    if (rating === 0) {
      Alert.alert('Rating Required', 'Please select a star rating for your review');
      return;
    }

    if (!reviewText.trim()) {
      Alert.alert('Review Required', 'Please write something about your experience');
      return;
    }

    try {
      const updatedTrip = {
        ...trip,
        review: {
          rating,
          text: reviewText,
          images,
          createdAt: new Date().toISOString()
        }
      };

      await updateTrip(trip.id, updatedTrip);
      
      Alert.alert(
        'Review Submitted!',
        'Thank you for sharing your experience',
        [
          { 
            text: 'OK', 
            onPress: () => router.push('/profile/reviews') 
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review. Please try again.');
    }
  };

  if (!trip) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Trip not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Add Review</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.tripCard, { backgroundColor: colors.card }]}>
          <Image source={{ uri: trip.image }} style={styles.tripImage} />
          <View style={styles.tripInfo}>
            <Text style={[styles.tripTitle, { color: colors.text }]}>{trip.title}</Text>
            <Text style={[styles.tripDestination, { color: colors.textSecondary }]}>
              {trip.destination}
            </Text>
            <Text style={[styles.tripDates, { color: colors.textSecondary }]}>
              {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
            </Text>
          </View>
        </View>

        <View style={styles.ratingContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Rating</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Star 
                  size={40} 
                  fill={star <= rating ? colors.primary : 'transparent'} 
                  color={star <= rating ? colors.primary : colors.border} 
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.reviewInputContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Review</Text>
          <TextInput
            style={[
              styles.reviewInput,
              { 
                backgroundColor: colors.card, 
                color: colors.text, 
                borderColor: colors.border 
              }
            ]}
            placeholder="Share your experience..."
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={5}
            value={reviewText}
            onChangeText={setReviewText}
          />
        </View>

        <View style={styles.photosSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Add Photos (Optional)</Text>
          <View style={styles.photoButtons}>
            <TouchableOpacity
              style={[
                styles.photoButton, 
                { backgroundColor: colors.primary + '20', borderColor: colors.border }
              ]}
              onPress={pickImage}
              disabled={isUploading}
            >
              <ImageIcon size={20} color={colors.primary} />
              <Text style={[styles.photoButtonText, { color: colors.primary }]}>
                {isUploading ? 'Uploading...' : 'Choose Photos'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.photoButton, 
                { backgroundColor: colors.primary + '20', borderColor: colors.border }
              ]}
              onPress={takePhoto}
              disabled={isUploading}
            >
              <Camera size={20} color={colors.primary} />
              <Text style={[styles.photoButtonText, { color: colors.primary }]}>Take Photo</Text>
            </TouchableOpacity>
          </View>

          {images.length > 0 && (
            <FlatList
              horizontal
              data={images}
              renderItem={({ item, index }) => (
                <View style={styles.photoItem}>
                  <Image source={{ uri: item }} style={styles.uploadedPhoto} />
                  <TouchableOpacity
                    style={[styles.removePhotoButton, { backgroundColor: colors.background }]}
                    onPress={() => removeImage(index)}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.photosList}
            />
          )}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: colors.primary }]}
          onPress={submitReview}
        >
          <Text style={styles.submitButtonText}>Submit Review</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  tripCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  tripImage: {
    width: '100%',
    height: 180,
  },
  tripInfo: {
    padding: 16,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  tripDestination: {
    fontSize: 16,
    marginBottom: 4,
  },
  tripDates: {
    fontSize: 14,
  },
  ratingContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  stars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  reviewInputContainer: {
    marginBottom: 24,
  },
  reviewInput: {
    minHeight: 150,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  photosSection: {
    marginBottom: 24,
  },
  photoButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  photoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  photoButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  photosList: {
    gap: 12,
  },
  photoItem: {
    position: 'relative',
  },
  uploadedPhoto: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  removePhotoButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});