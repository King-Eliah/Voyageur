import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Star, MapPin, Calendar, Edit, Trash2, Plus, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { format } from 'date-fns';

export default function TripReviewsScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { trips, updateTrip, deleteTrip } = useData();
  const router = useRouter();
  
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedReview, setEditedReview] = useState({ text: '', rating: 0, images: [] });
  const [isUploading, setIsUploading] = useState(false);

  // Get only trips with reviews
  const reviewedTrips = trips.filter(trip => trip.review);

  // Get completed trips without reviews
  const completedTripsWithoutReviews = trips.filter(
    trip => trip.status === 'completed' && !trip.review
  );

  const handleEditReview = (trip) => {
    setEditingReviewId(trip.id);
    setEditedReview({
      text: trip.review?.text || '',
      rating: trip.review?.rating || 0,
      images: trip.review?.images || []
    });
  };

  const saveEditedReview = async () => {
    try {
      const updatedTrip = {
        ...trips.find(t => t.id === editingReviewId),
        review: {
          ...editedReview,
          updatedAt: new Date().toISOString()
        }
      };

      await updateTrip(editingReviewId, updatedTrip);
      setEditingReviewId(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to update review');
    }
  };

  const handleDeleteReview = (tripId) => {
    Alert.alert(
      'Delete Review',
      'Are you sure you want to delete this review?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
            const trip = trips.find(t => t.id === tripId);
            const updatedTrip = { ...trip, review: null };
            await updateTrip(tripId, updatedTrip);
          }
        }
      ]
    );
  };

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
        setEditedReview(prev => ({
          ...prev,
          images: [...prev.images, ...newImages]
        }));
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
        setEditedReview(prev => ({
          ...prev,
          images: [...prev.images, result.assets[0].uri]
        }));
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = [...editedReview.images];
    newImages.splice(index, 1);
    setEditedReview(prev => ({ ...prev, images: newImages }));
  };

  const renderReview = ({ item }) => {
    const trip = item;
    const review = trip.review;

    return (
      <View style={[styles.reviewCard, { backgroundColor: colors.card }]}>
        <View style={styles.reviewHeader}>
          <View style={styles.tripInfo}>
            <Text style={[styles.tripTitle, { color: colors.text }]}>{trip.title}</Text>
            <View style={styles.tripLocation}>
              <MapPin size={16} color={colors.textSecondary} />
              <Text style={[styles.locationText, { color: colors.textSecondary }]}>{trip.destination}</Text>
            </View>
          </View>
          <Text style={[styles.dateText, { color: colors.textSecondary }]}>
            <Calendar size={14} color={colors.textSecondary} /> 
            {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
          </Text>
        </View>
        
        {editingReviewId === trip.id ? (
          <>
            <TextInput
              style={[styles.editInput, { color: colors.text, borderColor: colors.border }]}
              value={editedReview.text}
              onChangeText={(text) => setEditedReview(prev => ({ ...prev, text }))}
              multiline
              placeholder="Share your experience..."
              placeholderTextColor={colors.textSecondary}
            />
            <View style={styles.ratingEdit}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setEditedReview(prev => ({ ...prev, rating: star }))}>
                  <Star 
                    size={28} 
                    fill={star <= editedReview.rating ? colors.primary : 'transparent'} 
                    color={star <= editedReview.rating ? colors.primary : colors.textSecondary} 
                  />
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.imageButtons}>
              <TouchableOpacity
                style={[styles.imageButton, { backgroundColor: colors.primary + '20' }]}
                onPress={pickImage}
                disabled={isUploading}
              >
                <Text style={[styles.imageButtonText, { color: colors.primary }]}>
                  {isUploading ? 'Uploading...' : 'Add Photos'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.imageButton, { backgroundColor: colors.primary + '20' }]}
                onPress={takePhoto}
                disabled={isUploading}
              >
                <Text style={[styles.imageButtonText, { color: colors.primary }]}>
                  Take Photo
                </Text>
              </TouchableOpacity>
            </View>
            
            {editedReview.images.length > 0 && (
              <FlatList
                horizontal
                data={editedReview.images}
                renderItem={({ item, index }) => (
                  <View style={styles.imageItem}>
                    <Image source={{ uri: item }} style={styles.uploadedImage} />
                    <TouchableOpacity
                      style={[styles.removeImageButton, { backgroundColor: colors.background }]}
                      onPress={() => removeImage(index)}
                    >
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.imageList}
              />
            )}
            
            <View style={styles.editActions}>
              <TouchableOpacity 
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={saveEditedReview}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.cancelButton, { borderColor: colors.border }]}
                onPress={() => setEditingReviewId(null)}
              >
                <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  size={20} 
                  fill={star <= review.rating ? colors.primary : 'transparent'} 
                  color={star <= review.rating ? colors.primary : colors.textSecondary} 
                />
              ))}
            </View>
            <Text style={[styles.reviewText, { color: colors.text }]}>{review.text}</Text>
            
            {review.images && review.images.length > 0 && (
              <FlatList
                horizontal
                data={review.images}
                renderItem={({ item }) => (
                  <Image source={{ uri: item }} style={styles.reviewImage} />
                )}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.imagesContainer}
              />
            )}
            
            <Text style={[styles.reviewDate, { color: colors.textSecondary }]}>
              Reviewed on {format(new Date(review.createdAt), 'MMM d, yyyy')}
              {review.updatedAt && ` (edited)`}
            </Text>
            
            <View style={styles.reviewActions}>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: colors.primary + '20' }]}
                onPress={() => handleEditReview(trip)}
              >
                <Edit size={16} color={colors.primary} />
                <Text style={[styles.actionText, { color: colors.primary }]}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: '#EF4444' + '20' }]}
                onPress={() => handleDeleteReview(trip.id)}
              >
                <Trash2 size={16} color="#EF4444" />
                <Text style={[styles.actionText, { color: '#EF4444' }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
         <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      {reviewedTrips.length > 0 || completedTripsWithoutReviews.length > 0 ? (
        <>
          <FlatList
            data={reviewedTrips}
            renderItem={renderReview}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />

          {completedTripsWithoutReviews.length > 0 && (
            <View style={styles.unreviewedSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Trips Waiting for Your Review
              </Text>
              <FlatList
                horizontal
                data={completedTripsWithoutReviews}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={[styles.unreviewedCard, { backgroundColor: colors.card }]}
                    onPress={() => router.push(`/add-review?id=${item.id}`)}
                  >
                    <Image source={{ uri: item.image }} style={styles.unreviewedImage} />
                    <Text style={[styles.unreviewedTitle, { color: colors.text }]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.unreviewedDestination, { color: colors.textSecondary }]}>
                      {item.destination}
                    </Text>
                    <View style={styles.reviewPrompt}>
                      <Star size={16} color="#F59E0B" />
                      <Text style={styles.reviewPromptText}>Add Review</Text>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.unreviewedList}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )}
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            You haven't reviewed any trips yet.
          </Text>
          <TouchableOpacity 
            style={[styles.addTripButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/trips')}
          >
            <Plus size={20} color="#FFFFFF" />
            <Text style={styles.addTripButtonText}>View Your Trips</Text>
          </TouchableOpacity>
        </View>
      )}
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
    paddingTop: 55,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  reviewCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tripInfo: {
    flex: 1,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  tripLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    marginLeft: 4,
  },
  dateText: {
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reviewText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  reviewDate: {
    fontSize: 12,
    marginBottom: 12,
  },
  imagesContainer: {
    gap: 12,
    marginBottom: 12,
  },
  reviewImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  reviewActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  editInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    minHeight: 120,
    fontSize: 16,
    lineHeight: 24,
  },
  ratingEdit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  imageButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  imageButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  imageButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  imageList: {
    gap: 12,
  },
  imageItem: {
    position: 'relative',
  },
  uploadedImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  addTripButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  addTripButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  unreviewedSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  unreviewedList: {
    gap: 16,
  },
  unreviewedCard: {
    width: 200,
    borderRadius: 12,
    overflow: 'hidden',
    paddingBottom: 16,
  },
  unreviewedImage: {
    width: '100%',
    height: 120,
  },
  unreviewedTitle: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 12,
    marginTop: 8,
  },
  unreviewedDestination: {
    fontSize: 14,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  reviewPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 8,
    gap: 4,
  },
  reviewPromptText: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '500',
  },
});