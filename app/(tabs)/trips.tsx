import { useState, useMemo } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, Alert, TextInput, FlatList, Modal } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useData } from '@/contexts/DataContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Calendar, MapPin, Clock, Edit3, Share, Trash2, ChevronLeft, Search, Filter, X, Save, Camera, ImageIcon, Upload } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import ItineraryModal from '../modal/itinerary-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

interface Trip {
  id: string;
  title: string;
  destination: string;
  description?: string;
  image: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function TripsScreen() {
  const { colors } = useTheme();
  const { trips, deleteTrip, updateTrip } = useData();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [tempTrip, setTempTrip] = useState<Partial<Trip>>({});
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  // New state for date modal
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [editingDateField, setEditingDateField] = useState<'start' | 'end'>('start');

  const statusOptions = ['upcoming', 'ongoing', 'completed'];

  const filteredTrips = useMemo(() => {
    return trips.filter(trip => {
      const matchesSearch = 
        trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.destination.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter ? trip.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    }).sort((a, b) => {
      const statusOrder = { ongoing: 1, upcoming: 2, completed: 3 };
      return statusOrder[a.status] - statusOrder[b.status] || 
             new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });
  }, [trips, searchQuery, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return '#3B82F6';
      case 'ongoing': return '#10B981';
      case 'completed': return '#6B7280';
      default: return colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Upcoming';
      case 'ongoing': return 'In Progress';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const handleDeleteTrip = (tripId: string, tripTitle: string) => {
    Alert.alert(
      'Delete Trip',
      `Are you sure you want to delete "${tripTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteTrip(tripId) }
      ]
    );
  };

  const handleShareTrip = (trip: any) => {
    Alert.alert(
      'Share Trip',
      `Share your trip to ${trip.destination}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share', onPress: () => console.log('Sharing trip:', trip.title) }
      ]
    );
  };

  const clearFilters = () => {
    setStatusFilter(null);
    setSearchQuery('');
  };

  const openEditModal = (trip: Trip) => {
    setEditingTrip(trip);
    setTempTrip({ ...trip });
    setShowEditModal(true);
  };

  const handleSaveTrip = () => {
    if (!editingTrip || !tempTrip.title || !tempTrip.destination) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const updatedTrip = {
      ...editingTrip,
      ...tempTrip,
      updatedAt: new Date().toISOString(),
    };

    updateTrip(editingTrip.id, updatedTrip);
    setShowEditModal(false);
    setEditingTrip(null);
  };

  const handleDateChange = (date: Date | undefined, field: 'start' | 'end') => {
    if (!date) return;
    
    const dateString = date.toISOString();
    setTempTrip(prev => ({
      ...prev,
      [field === 'start' ? 'startDate' : 'endDate']: dateString
    }));
    
    setDateModalVisible(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need camera roll permissions to upload photos.');
      return false;
    }
    return true;
  };

  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    setIsUploadingImage(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setTempTrip(prev => ({ ...prev, image: result.assets[0].uri }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'We need camera permissions to take photos.');
      return;
    }

    setIsUploadingImage(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setTempTrip(prev => ({ ...prev, image: result.assets[0].uri }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const showPhotoOptions = () => {
    Alert.alert(
      'Select Photo',
      'Choose how you want to add a photo',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Photo Library', onPress: pickImageFromGallery },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  // Date Selection Modal Component
  const DateSelectionModal = () => (
    <Modal
      visible={dateModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setDateModalVisible(false)}
    >
      <View style={styles.dateModalOverlay}>
        <View style={[styles.dateModalContainer, { backgroundColor: colors.card }]}>
          <View style={styles.dateModalHeader}>
            <Text style={[styles.dateModalTitle, { color: colors.text }]}>
              {editingDateField === 'start' ? 'Select Start Date' : 'Select End Date'}
            </Text>
            <TouchableOpacity 
              onPress={() => setDateModalVisible(false)}
              style={styles.dateModalClose}
            >
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <DateTimePicker
            value={
              editingDateField === 'start' 
                ? (tempTrip.startDate ? new Date(tempTrip.startDate) : new Date())
                : (tempTrip.endDate ? new Date(tempTrip.endDate) : new Date())
            }
            mode="date"
            display="spinner"
            onChange={(event, date) => {
              if (date) handleDateChange(date, editingDateField)
            }}
            minimumDate={
              editingDateField === 'end' && tempTrip.startDate 
                ? new Date(tempTrip.startDate) 
                : undefined
            }
            themeVariant={colors.mode === 'dark' ? 'dark' : 'light'}
            style={styles.datePickerSpinner}
          />
          
          <View style={styles.dateModalFooter}>
            <TouchableOpacity
              style={[styles.dateModalButton, { backgroundColor: colors.border }]}
              onPress={() => setDateModalVisible(false)}
            >
              <Text style={[styles.dateModalButtonText, { color: colors.text }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dateModalButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                const currentDate = new Date();
                handleDateChange(currentDate, editingDateField);
              }}
            >
              <Text style={[styles.dateModalButtonText, { color: 'white' }]}>
                Use Today
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Enhanced Date Selection Component
  const renderDateSelection = () => (
    <View style={styles.dateSelectionContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Trip Duration</Text>
      
      <View style={styles.datePickerRow}>
        {/* Start Date */}
        <View style={styles.datePickerCard}>
          <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>Start Date</Text>
          <TouchableOpacity
            style={[
              styles.modernDateInput,
              { 
                backgroundColor: colors.card, 
                borderColor: colors.border,
              }
            ]}
            onPress={() => {
              setEditingDateField('start');
              setDateModalVisible(true);
            }}
          >
            <View style={styles.dateContent}>
              <View style={[styles.calendarIcon, { backgroundColor: colors.primary + '15' }]}>
                <Calendar size={18} color={colors.primary} />
              </View>
              <View style={styles.dateInfo}>
                {tempTrip.startDate ? (
                  <>
                    <Text style={[styles.selectedDate, { color: colors.text }]}>
                      {new Date(tempTrip.startDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </Text>
                    <Text style={[styles.selectedYear, { color: colors.textSecondary }]}>
                      {new Date(tempTrip.startDate).getFullYear()}
                    </Text>
                  </>
                ) : (
                  <Text style={[styles.placeholderDate, { color: colors.textSecondary }]}>
                    Select date
                  </Text>
                )}
              </View>
            </View>
            <View style={[
              styles.dateIndicator,
              { backgroundColor: tempTrip.startDate ? colors.primary : colors.border }
            ]} />
          </TouchableOpacity>
        </View>

        {/* Date Range Connector */}
        <View style={styles.dateConnector}>
          <View style={[styles.connectorLine, { backgroundColor: colors.border }]} />
          <View style={[styles.connectorDot, { backgroundColor: colors.textSecondary }]} />
        </View>

        {/* End Date */}
        <View style={styles.datePickerCard}>
          <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>End Date</Text>
          <TouchableOpacity
            style={[
              styles.modernDateInput,
              { 
                backgroundColor: colors.card, 
                borderColor: colors.border,
                opacity: tempTrip.startDate ? 1 : 0.6
              }
            ]}
            onPress={() => {
              if (tempTrip.startDate) {
                setEditingDateField('end');
                setDateModalVisible(true);
              }
            }}
            disabled={!tempTrip.startDate}
          >
            <View style={styles.dateContent}>
              <View style={[styles.calendarIcon, { backgroundColor: colors.primary + '15' }]}>
                <Calendar size={18} color={colors.primary} />
              </View>
              <View style={styles.dateInfo}>
                {tempTrip.endDate ? (
                  <>
                    <Text style={[styles.selectedDate, { color: colors.text }]}>
                      {new Date(tempTrip.endDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </Text>
                    <Text style={[styles.selectedYear, { color: colors.textSecondary }]}>
                      {new Date(tempTrip.endDate).getFullYear()}
                    </Text>
                  </>
                ) : (
                  <Text style={[styles.placeholderDate, { color: colors.textSecondary }]}>
                    {tempTrip.startDate ? 'Select date' : 'Select start first'}
                  </Text>
                )}
              </View>
            </View>
            <View style={[
              styles.dateIndicator,
              { backgroundColor: tempTrip.endDate ? colors.primary : colors.border }
            ]} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Trip Duration Display */}
      {tempTrip.startDate && tempTrip.endDate && (
        <View style={[styles.durationDisplay, { backgroundColor: colors.primary + '10' }]}>
          <Clock size={16} color={colors.primary} />
          <Text style={[styles.durationText, { color: colors.primary }]}>
            {Math.ceil((new Date(tempTrip.endDate).getTime() - new Date(tempTrip.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
          </Text>
        </View>
      )}
    </View>
  );

  // Helper functions for status
  const getStatusIcon = (status: string) => {
    const iconColor = tempTrip.status === status ? 'white' : getStatusColor(status);
    const iconSize = 20;

    switch (status) {
      case 'upcoming':
        return <Calendar size={iconSize} color={iconColor} />;
      case 'ongoing':
        return <MapPin size={iconSize} color={iconColor} />;
      case 'completed':
        return <Clock size={iconSize} color={iconColor} />;
      default:
        return <Calendar size={iconSize} color={iconColor} />;
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Trip is planned for the future';
      case 'ongoing':
        return 'Currently on this trip';
      case 'completed':
        return 'Trip has been completed';
      default:
        return '';
    }
  };

  // Enhanced Status Selection Component
  const renderStatusSelection = () => (
    <View style={styles.statusSelectionContainer}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Trip Status</Text>
      <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
        Choose the current status of your trip
      </Text>
      
      <View style={styles.statusGrid}>
        {statusOptions.map((status, index) => {
          const isSelected = tempTrip.status === status;
          const statusColor = getStatusColor(status);
          
          return (
            <TouchableOpacity
              key={status}
              style={[
                styles.modernStatusCard,
                { 
                  backgroundColor: isSelected ? statusColor + '15' : colors.card,
                  borderColor: isSelected ? statusColor : colors.border,
                  borderWidth: isSelected ? 2 : 1,
                }
              ]}
              onPress={() => setTempTrip(prev => ({ ...prev, status }))}
              activeOpacity={0.7}
            >
              <View style={[
                styles.statusIconContainer,
                { 
                  backgroundColor: isSelected ? statusColor : statusColor + '20',
                }
              ]}>
                {getStatusIcon(status)}
              </View>
              
              <View style={styles.statusCardContent}>
                <Text style={[
                  styles.statusTitle,
                  { 
                    color: isSelected ? statusColor : colors.text,
                    fontWeight: isSelected ? '600' : '500'
                  }
                ]}>
                  {getStatusText(status)}
                </Text>
                <Text style={[
                  styles.statusDescription,
                  { color: colors.textSecondary }
                ]}>
                  {getStatusDescription(status)}
                </Text>
              </View>
              
              <View style={[
                styles.statusRadio,
                { 
                  borderColor: isSelected ? statusColor : colors.border,
                  backgroundColor: isSelected ? statusColor : 'transparent'
                }
              ]}>
                {isSelected && (
                  <View style={styles.statusRadioInner} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderTripCard = (trip: Trip) => (
    <TouchableOpacity
      key={trip.id}
      style={[styles.tripCard, { backgroundColor: colors.card }]}
      onPress={() => router.push({
        pathname: '/bookings/detail',
        params: {
          id: trip.id,
          title: trip.title,
          destination: trip.destination,
          image: trip.image,
          startDate: trip.startDate,
          endDate: trip.endDate,
          type: 'trip'
        }
      })}
    >
      <Image source={{ uri: trip.image }} style={styles.tripImage} />
      <View style={styles.tripContent}>
        <View style={styles.tripHeader}>
          <View style={styles.tripInfo}>
            <Text style={[styles.tripTitle, { color: colors.text }]}>{trip.title}</Text>
            <View style={styles.tripLocation}>
              <MapPin size={14} color={colors.textSecondary} />
              <Text style={[styles.locationText, { color: colors.textSecondary }]}>{trip.destination}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(trip.status) + '20' }]}>
            <Text style={[styles.statusText, { color: getStatusColor(trip.status) }]}>
              {getStatusText(trip.status)}
            </Text>
          </View>
        </View>
        
        <View style={styles.tripDates}>
          <Calendar size={14} color={colors.textSecondary} />
          <Text style={[styles.datesText, { color: colors.textSecondary }]}>
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </Text>
        </View>

        {trip.description && (
          <Text style={[styles.tripDescription, { color: colors.textSecondary }]} numberOfLines={2}>
            {trip.description}
          </Text>
        )}

        <View style={styles.tripActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary + '20' }]}
            onPress={() => openEditModal(trip)}
          >
            <Edit3 size={16} color={colors.primary} />
            <Text style={[styles.actionText, { color: colors.primary }]}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.textSecondary + '20' }]}
            onPress={() => handleShareTrip(trip)}
          >
            <Share size={16} color={colors.textSecondary} />
            <Text style={[styles.actionText, { color: colors.textSecondary }]}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#EF4444' + '20' }]}
            onPress={() => handleDeleteTrip(trip.id, trip.title)}
          >
            <Trash2 size={16} color="#EF4444" />
            <Text style={[styles.actionText, { color: '#EF4444' }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEditModal = () => (
    <Modal
      visible={showEditModal}
      animationType="slide"
      onRequestClose={() => setShowEditModal(false)}
      transparent={true}
    >
      <View style={styles.modalOverlay}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Trip</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Trip Title *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                placeholder="Enter trip title"
                placeholderTextColor={colors.textSecondary}
                value={tempTrip.title}
                onChangeText={(text) => setTempTrip(prev => ({ ...prev, title: text }))}
              />
              
              <Text style={[styles.inputLabel, { color: colors.text }]}>Destination *</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                placeholder="Enter destination"
                placeholderTextColor={colors.textSecondary}
                value={tempTrip.destination}
                onChangeText={(text) => setTempTrip(prev => ({ ...prev, destination: text }))}
              />
              
              <Text style={[styles.inputLabel, { color: colors.text }]}>Description</Text>
              <TextInput
                style={[styles.textArea, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                placeholder="Add a description for your trip..."
                placeholderTextColor={colors.textSecondary}
                value={tempTrip.description}
                onChangeText={(text) => setTempTrip(prev => ({ ...prev, description: text }))}
                multiline
                numberOfLines={4}
              />
              
              <Text style={[styles.inputLabel, { color: colors.text }]}>Trip Photo</Text>
              <View style={[styles.photoUploadContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                {tempTrip.image ? (
                  <View style={styles.photoPreviewContainer}>
                    <Image source={{ uri: tempTrip.image }} style={styles.photoPreview} />
                    <View style={styles.photoOverlay}>
                      <TouchableOpacity
                        style={[styles.photoActionButton, { backgroundColor: colors.primary }]}
                        onPress={showPhotoOptions}
                        disabled={isUploadingImage}
                      >
                        <Camera size={20} color="white" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.photoActionButton, { backgroundColor: '#EF4444' }]}
                        onPress={() => setTempTrip(prev => ({ ...prev, image: '' }))}
                      >
                        <Trash2 size={20} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.photoUploadButton}
                    onPress={showPhotoOptions}
                    disabled={isUploadingImage}
                  >
                    <View style={[styles.photoUploadIcon, { backgroundColor: colors.primary + '20' }]}>
                      {isUploadingImage ? (
                        <Upload size={32} color={colors.primary} />
                      ) : (
                        <ImageIcon size={32} color={colors.primary} />
                      )}
                    </View>
                    <Text style={[styles.photoUploadText, { color: colors.text }]}>
                      {isUploadingImage ? 'Uploading...' : 'Add Photo'}
                    </Text>
                    <Text style={[styles.photoUploadSubtext, { color: colors.textSecondary }]}>
                      Tap to choose from gallery or take a photo
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              
              {/* Enhanced Date Selection */}
              {renderDateSelection()}
              
              {/* Enhanced Status Selection */}
              {renderStatusSelection()}
            </ScrollView>
            
            <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                onPress={handleSaveTrip}
              >
                <Save size={20} color="white" />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
      
      {/* Date Selection Modal */}
      <DateSelectionModal />
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Trips</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => setShowItineraryModal(true)}
          >
            <Calendar size={16} color={colors.primary} />
            <Text style={[styles.headerButtonText, { color: colors.primary }]}>Itinerary</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/modal/add-trip')}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <Search size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search trips..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity 
          onPress={() => setShowFilters(!showFilters)}
          style={[styles.filterButton, { backgroundColor: colors.primary }]}
        >
          <Filter size={20} color="white" />
        </TouchableOpacity>
      </View>

      {(statusFilter || searchQuery) && (
        <View style={styles.activeFiltersContainer}>
          <Text style={[styles.activeFiltersText, { color: colors.textSecondary }]}>
            Active filters:
          </Text>
          {searchQuery && (
            <View style={[styles.filterPill, { backgroundColor: colors.card }]}>
              <Text style={[styles.filterPillText, { color: colors.text }]}>
                Search: "{searchQuery}"
              </Text>
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
          {statusFilter && (
            <View style={[styles.filterPill, { backgroundColor: colors.card }]}>
              <Text style={[styles.filterPillText, { color: colors.text }]}>
                Status: {statusFilter}
              </Text>
              <TouchableOpacity onPress={() => setStatusFilter(null)}>
                <X size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity onPress={clearFilters}>
            <Text style={[styles.clearFiltersText, { color: colors.primary }]}>
              Clear all
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {showFilters && (
        <View style={[styles.filtersPanel, { backgroundColor: colors.card }]}>
          <Text style={[styles.filtersTitle, { color: colors.text }]}>Filter by Status</Text>
          <View style={styles.filterOptions}>
            {statusOptions.map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.filterOption,
                  { 
                    backgroundColor: statusFilter === option ? colors.primary : colors.background,
                    borderColor: colors.border
                  }
                ]}
                onPress={() => setStatusFilter(statusFilter === option ? null : option)}
              >
                <Text 
                  style={[
                    styles.filterOptionText, 
                    { color: statusFilter === option ? 'white' : colors.text }
                  ]}
                >
                  {getStatusText(option)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {filteredTrips.length > 0 ? (
        <FlatList
          data={filteredTrips}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => renderTripCard(item)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.noTripsContainer}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=300' }}
            style={styles.noTripsImage}
          />
          <Text style={[styles.noTripsTitle, { color: colors.text }]}>
            {searchQuery || statusFilter ? 'No matching trips' : 'Start Your Journey'}
          </Text>
          <Text style={[styles.noTripsSubtitle, { color: colors.textSecondary }]}>
            {searchQuery || statusFilter 
              ? 'Try adjusting your search or filters'
              : 'Create your first trip and begin planning your perfect adventure'}
          </Text>
          {(searchQuery || statusFilter) ? (
            <TouchableOpacity 
              style={[styles.clearFiltersButton, { backgroundColor: colors.primary }]}
              onPress={clearFilters}
            >
              <Text style={styles.clearFiltersButtonText}>Clear Filters</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.createTripButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/modal/add-trip')}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.createTripButtonText}>Create Your First Trip</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      
      <ItineraryModal 
        visible={showItineraryModal} 
        onClose={() => setShowItineraryModal(false)} 
      />
      
      {renderEditModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  headerButtonText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 7,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 8,
  },
  activeFiltersText: {
    fontSize: 14,
    marginRight: 8,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  filterPillText: {
    fontSize: 14,
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  filtersPanel: {
    padding: 16,
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterOptionText: {
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },
  tripCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  tripImage: {
    width: '100%',
    height: 160,
  },
  tripContent: {
    padding: 16,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  tripDates: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  datesText: {
    fontSize: 14,
  },
  tripDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  tripActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  noTripsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noTripsImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 24,
  },
  noTripsTitle: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  noTripsSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  createTripButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  createTripButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  clearFiltersButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  clearFiltersButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    flex: 1,
    marginTop: 40,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  modalContent: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  photoUploadContainer: {
    height: 160,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  photoUploadButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  photoUploadIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  photoUploadText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  photoUploadSubtext: {
    fontSize: 12,
    textAlign: 'center',
  },
  photoPreviewContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 8,
    gap: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  photoActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
  },
  saveButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Date Selection Styles
  dateSelectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  datePickerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  datePickerCard: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  modernDateInput: {
    borderRadius: 16,
    padding: 16,
    minHeight: 72,
    position: 'relative',
    overflow: 'hidden',
  },
  dateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  calendarIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateInfo: {
    flex: 1,
  },
  selectedDate: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  selectedYear: {
    fontSize: 12,
  },
  placeholderDate: {
    fontSize: 14,
  },
  dateIndicator: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  dateConnector: {
    alignItems: 'center',
    paddingTop: 40,
  },
  connectorLine: {
    height: 2,
    width: 20,
    marginBottom: 4,
  },
  connectorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  durationDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  durationText: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Status Selection Styles
  statusSelectionContainer: {
    marginBottom: 24,
  },
  statusGrid: {
    gap: 12,
  },
  modernStatusCard: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statusIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusCardContent: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    marginBottom: 2,
  },
  statusDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
  statusRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusRadioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  // Date Modal Styles
  dateModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  dateModalContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 34,
  },
  dateModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateModalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  dateModalClose: {
    padding: 4,
  },
  datePickerSpinner: {
    height: 180,
  },
  dateModalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  dateModalButton: {
    flex: 1,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});