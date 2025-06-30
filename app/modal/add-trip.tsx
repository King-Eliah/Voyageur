import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Image, Modal, Platform, ActivityIndicator, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useData } from '@/contexts/DataContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Calendar, MapPin, DollarSign, FileText, ChevronLeft, ChevronRight, Users, Globe, Info, Plus, Camera, Image as ImageIcon, Star, Clock, Heart } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '@/contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import { Dropdown } from 'react-native-element-dropdown';

export default function AddTripModal() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    description: '',
    budget: '',
    currency: 'USD',
    travelers: '',
    image: null as string | null,
    isPublic: false,
    tripType: 'leisure',
    priority: 'medium',
  });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showCustomCalendar, setShowCustomCalendar] = useState(false);
  const [activeCalendar, setActiveCalendar] = useState<'start' | 'end'>('start');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const { colors } = useTheme();
  const { addTrip } = useData();

  const currencies = [
    { label: 'US Dollar (USD)', value: 'USD' },
    { label: 'Euro (EUR)', value: 'EUR' },
    { label: 'British Pound (GBP)', value: 'GBP' },
    { label: 'Japanese Yen (JPY)', value: 'JPY' },
    { label: 'Canadian Dollar (CAD)', value: 'CAD' },
    { label: 'Australian Dollar (AUD)', value: 'AUD' },
    { label: 'Swiss Franc (CHF)', value: 'CHF' },
    { label: 'Chinese Yuan (CNY)', value: 'CNY' },
    { label: 'Indian Rupee (INR)', value: 'INR' },
    { label: 'South African Rand (ZAR)', value: 'ZAR' },
  ];

  const tripTypes = [
    { label: 'Leisure & Vacation', value: 'leisure', icon: '🏖️' },
    { label: 'Business Travel', value: 'business', icon: '💼' },
    { label: 'Adventure & Outdoor', value: 'adventure', icon: '🏔️' },
    { label: 'Cultural & Heritage', value: 'cultural', icon: '🏛️' },
    { label: 'Family Trip', value: 'family', icon: '👨‍👩‍👧‍👦' },
    { label: 'Solo Travel', value: 'solo', icon: '🎒' },
    { label: 'Romantic Getaway', value: 'romantic', icon: '💕' },
    { label: 'Educational', value: 'educational', icon: '📚' },
  ];

  const priorityLevels = [
    { label: 'Dream Trip', value: 'high', color: '#EF4444', icon: <Star size={16} color="#EF4444" /> },
    { label: 'Planned', value: 'medium', color: '#F59E0B', icon: <Clock size={16} color="#F59E0B" /> },
    { label: 'Someday', value: 'low', color: '#10B981', icon: <Heart size={16} color="#10B981" /> },
  ];

  const steps = [
    { id: 1, title: 'Basic Info', subtitle: 'Trip essentials' },
    { id: 2, title: 'Details', subtitle: 'Dates & travelers' },
    { id: 3, title: 'Preferences', subtitle: 'Budget & type' },
    { id: 4, title: 'Review', subtitle: 'Final check' },
  ];

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission required', 'Sorry, we need camera roll permissions to upload images.');
        }
      }
    })();
  }, []);

 const pickImage = async () => {
  try {
    setIsUploading(true);
    
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need access to your photos to upload a trip cover photo');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9], // Better aspect ratio for trip cover photos
      quality: 0.8,
    });

    console.log('Image picker result:', result);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      console.log('Selected image URI:', uri);
      // Update the trip's cover photo, not the user's profile image
      updateFormData('image', uri);
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
      aspect: [16, 9], // Better aspect ratio for trip cover photos
      quality: 0.8,
    });

    console.log('Camera result:', result);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      console.log('Captured image URI:', uri);
      // Update the trip's cover photo, not the user's profile image
      updateFormData('image', uri);
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
    'Add Trip Cover Photo',
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

  const validateStep = (step: number) => {
    const newErrors: any = {};

    switch (step) {
      case 1:
        if (!formData.title.trim()) {
          newErrors.title = 'Trip title is required';
        }
        if (!formData.destination.trim()) {
          newErrors.destination = 'Destination is required';
        }
        break;
      case 2:
        if (endDate <= startDate) {
          newErrors.endDate = 'Return date must be after departure date';
        }
        if (formData.travelers && (isNaN(Number(formData.travelers)) || Number(formData.travelers) < 1)) {
          newErrors.travelers = 'Please enter a valid number of travelers';
        }
        break;
      case 3:
        if (formData.budget && (isNaN(Number(formData.budget)) || Number(formData.budget) < 0)) {
          newErrors.budget = 'Please enter a valid budget amount';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setLoading(true);
    try {
      const defaultImages = [
        'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/2574391/pexels-photo-2574391.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1268855/pexels-photo-1268855.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=400',
      ];

      await addTrip({
        title: formData.title,
        destination: formData.destination,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        status: 'upcoming',
        image: formData.image || defaultImages[Math.floor(Math.random() * defaultImages.length)],
        description: formData.description,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        currency: formData.currency,
        travelers: formData.travelers ? parseInt(formData.travelers) : undefined,
        tripType: formData.tripType,
        priority: formData.priority,
        isPublic: formData.isPublic,
      });

      Alert.alert(
        'Trip Created! 🎉',
        'Your trip has been successfully created and added to your collection.',
        [{ text: 'Awesome!', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Oops!', 'Failed to create trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: undefined }));
    }
  };

  const openCalendar = (type: 'start' | 'end') => {
    setActiveCalendar(type);
    setCalendarDate(type === 'start' ? startDate : endDate);
    if (Platform.OS === 'ios') {
      setShowCustomCalendar(true);
    } else {
      if (type === 'start') {
        setShowStartDatePicker(true);
      } else {
        setShowEndDatePicker(true);
      }
    }
  };

  const onStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      if (selectedDate >= endDate) {
        setEndDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000));
      }
      if (errors.endDate) {
        setErrors((prev: any) => ({ ...prev, endDate: undefined }));
      }
    }
  };

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
      if (errors.endDate) {
        setErrors((prev: any) => ({ ...prev, endDate: undefined }));
      }
    }
  };

  const handleCalendarDateSelect = (date: Date) => {
    if (activeCalendar === 'start') {
      setStartDate(date);
      if (date >= endDate) {
        setEndDate(new Date(date.getTime() + 24 * 60 * 60 * 1000));
      }
    } else {
      setEndDate(date);
    }
    setShowCustomCalendar(false);
    if (errors.endDate) {
      setErrors((prev: any) => ({ ...prev, endDate: undefined }));
    }
  };

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysBetween = () => {
    const timeDiff = endDate.getTime() - startDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

const getProgressWidth = () => {
  return `${(currentStep / steps.length) * 100}%`;
};

 const renderStepIndicator = () => (
  <View style={styles.stepIndicator}>
    {/* Step Dots */}
    <View style={styles.stepDots}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        
        return (
          <View key={step.id} style={styles.stepDotContainer}>
            {/* Connecting Line */}
            {index > 0 && (
              <View 
                style={[
                  styles.stepLine,
                  { 
                    backgroundColor: isCompleted ? colors.primary : colors.border,
                  }
                ]}
              />
            )}
            
            {/* Step Circle */}
            <View
              style={[
                styles.stepDot,
                {
                  backgroundColor: isActive || isCompleted ? colors.primary : colors.card,
                  borderColor: isActive || isCompleted ? colors.primary : colors.border,
                }
              ]}
            >
              {isCompleted ? (
                <Text style={styles.stepDotCheckmark}>✓</Text>
              ) : (
                <Text
                  style={[
                    styles.stepDotText,
                    { color: isActive ? '#FFFFFF' : colors.textSecondary }
                  ]}
                >
                  {stepNumber}
                </Text>
              )}
            </View>
            
            {/* Step Label */}
            <Text
              style={[
                styles.stepLabel,
                { 
                  color: isActive ? colors.primary : colors.textSecondary,
                  fontWeight: isActive ? '600' : '400'
                }
              ]}
            >
              {step.title}
            </Text>
          </View>
        );
      })}
    </View>
    
    {/* Current Step Info */}
    <View style={[styles.currentStepInfo, { backgroundColor: colors.primary + '10' }]}>
      <View style={styles.stepInfoContent}>
        <Text style={[styles.stepInfoTitle, { color: colors.primary }]}>
          Step {currentStep} of {steps.length}
        </Text>
        <Text style={[styles.stepInfoSubtitle, { color: colors.text }]}>
          {steps[currentStep - 1].title}: {steps[currentStep - 1].subtitle}
        </Text>
      </View>
      
      {/* Progress Bar */}
      <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
        <View
          style={[
            styles.progressBarFill,
            {
              backgroundColor: colors.primary,
              width: `${(currentStep / steps.length) * 100}%`,
            }
          ]}
        />
      </View>
    </View>
  </View>
);

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepHeader, { color: colors.text }]}>Basics </Text>
      
      {/* Trip Cover Image */}
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Trip Cover Photo</Text>
        <TouchableOpacity 
          style={[styles.imageUpload, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={pickImage}
        >
          {formData.image ? (
            <>
              <Image source={{ uri: formData.image }} style={styles.uploadedImage} />
              <TouchableOpacity 
                style={styles.changeImageButton}
                onPress={pickImage}
              >
                <Camera size={16} color="#FFF" />
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.uploadContent}>
              <View style={[styles.uploadIconContainer, { backgroundColor: colors.primary + '20' }]}>
                <ImageIcon size={32} color={colors.primary} />
              </View>
              <Text style={[styles.uploadText, { color: colors.primary }]}>Add Cover Photo</Text>
              <Text style={[styles.uploadSubtext, { color: colors.textSecondary }]}>
                Choose a photo that represents your trip
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Trip Title */}
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Trip Title *</Text>
        <TextInput
          style={[
            styles.input,
            { 
              backgroundColor: colors.inputBackground, 
              color: colors.text, 
              borderColor: errors.title ? '#EF4444' : colors.border 
            }
          ]}
          placeholder="e.g., Summer Adventure in Bali"
          placeholderTextColor={colors.textSecondary}
          value={formData.title}
          onChangeText={(value) => updateFormData('title', value)}
        />
        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
      </View>

      {/* Destination */}
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Destination *</Text>
        <View style={[styles.inputWithIcon, { backgroundColor: colors.inputBackground, borderColor: errors.destination ? '#EF4444' : colors.border }]}>
          <MapPin size={20} color={colors.primary} />
          <TextInput
            style={[styles.inputWithIconText, { color: colors.text }]}
            placeholder="e.g., Bali, Indonesia"
            placeholderTextColor={colors.textSecondary}
            value={formData.destination}
            onChangeText={(value) => updateFormData('destination', value)}
          />
        </View>
        {errors.destination && <Text style={styles.errorText}>{errors.destination}</Text>}
      </View>

      {/* Description */}
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Description (Optional)</Text>
        <TextInput
          style={[
            styles.textArea,
            { backgroundColor: colors.inputBackground, color: colors.text, borderColor: colors.border }
          ]}
          placeholder="What makes this trip special? Share your plans, goals, or excitement..."
          placeholderTextColor={colors.textSecondary}
          value={formData.description}
          onChangeText={(value) => updateFormData('description', value)}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepHeader, { color: colors.text }]}>When are you traveling?</Text>
      
      {/* Enhanced Date Section */}
      <View style={styles.dateSection}>
        <View style={styles.dateContainer}>
          <TouchableOpacity
            style={[styles.dateCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => openCalendar('start')}
          >
            <View style={styles.dateCardHeader}>
              <Calendar size={20} color={colors.primary} />
              <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>Departure</Text>
            </View>
            <Text style={[styles.dateValue, { color: colors.text }]}>
              {formatDateDisplay(startDate)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.dateCard, 
              { 
                backgroundColor: colors.card, 
                borderColor: errors.endDate ? '#EF4444' : colors.border 
              }
            ]}
            onPress={() => openCalendar('end')}
          >
            <View style={styles.dateCardHeader}>
              <Calendar size={20} color={colors.primary} />
              <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>Return</Text>
            </View>
            <Text style={[styles.dateValue, { color: colors.text }]}>
              {formatDateDisplay(endDate)}
            </Text>
          </TouchableOpacity>
        </View>

        {errors.endDate && <Text style={styles.errorText}>{errors.endDate}</Text>}
        
        <View style={[styles.durationInfo, { backgroundColor: colors.primary + '15' }]}>
          <Text style={[styles.durationText, { color: colors.primary }]}>
            🗓️ {getDaysBetween()} {getDaysBetween() === 1 ? 'day' : 'days'} trip
          </Text>
        </View>
      </View>

      {/* Travelers */}
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Number of Travelers</Text>
        <View style={[styles.inputWithIcon, { backgroundColor: colors.inputBackground, borderColor: errors.travelers ? '#EF4444' : colors.border }]}>
          <Users size={20} color={colors.primary} />
          <TextInput
            style={[styles.inputWithIconText, { color: colors.text }]}
            placeholder="e.g., 2"
            placeholderTextColor={colors.textSecondary}
            value={formData.travelers}
            onChangeText={(value) => updateFormData('travelers', value)}
            keyboardType="numeric"
          />
        </View>
        {errors.travelers && <Text style={styles.errorText}>{errors.travelers}</Text>}
        <Text style={[styles.helperText, { color: colors.textSecondary }]}>
          Including yourself
        </Text>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepHeader, { color: colors.text }]}>Trip preferences & budget </Text>

      {/* Trip Type */}
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Trip Type</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tripTypeScroll}
        >
          {tripTypes.map((type) => (
            <TouchableOpacity
              key={type.value}
              style={[
                styles.tripTypeCard,
                {
                  backgroundColor: formData.tripType === type.value ? colors.primary + '20' : colors.card,
                  borderColor: formData.tripType === type.value ? colors.primary : colors.border,
                }
              ]}
              onPress={() => updateFormData('tripType', type.value)}
            >
              <Text style={styles.tripTypeIcon}>{type.icon}</Text>
              <Text style={[
                styles.tripTypeText,
                { color: formData.tripType === type.value ? colors.primary : colors.text }
              ]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Priority Level */}
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Priority Level</Text>
        <View style={styles.priorityContainer}>
          {priorityLevels.map((level) => (
            <TouchableOpacity
              key={level.value}
              style={[
                styles.priorityCard,
                {
                  backgroundColor: formData.priority === level.value ? level.color + '20' : colors.card,
                  borderColor: formData.priority === level.value ? level.color : colors.border,
                }
              ]}
              onPress={() => updateFormData('priority', level.value)}
            >
              {level.icon}
              <Text style={[
                styles.priorityText,
                { color: formData.priority === level.value ? level.color : colors.text }
              ]}>
                {level.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Budget */}
      <View style={styles.inputContainer}>
        <Text style={[styles.label, { color: colors.text }]}>Budget (Optional)</Text>
        <View style={styles.budgetContainer}>
          <Dropdown
            style={[
              styles.dropdown,
              isFocus && { borderColor: colors.primary },
              { backgroundColor: colors.inputBackground, borderColor: colors.border }
            ]}
            placeholderStyle={[styles.placeholderStyle, { color: colors.textSecondary }]}
            selectedTextStyle={[styles.selectedTextStyle, { color: colors.text }]}
            inputSearchStyle={[styles.inputSearchStyle, { color: colors.text }]}
            iconStyle={styles.iconStyle}
            data={currencies}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'Currency' : '...'}
            searchPlaceholder="Search..."
            value={formData.currency}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setFormData({ ...formData, currency: item.value });
              setIsFocus(false);
            }}
            renderLeftIcon={() => (
              <Globe size={20} color={isFocus ? colors.primary : colors.textSecondary} style={styles.dropdownIcon} />
            )}
          />
          <TextInput
            style={[
              styles.budgetInput,
              { 
                backgroundColor: colors.inputBackground, 
                color: colors.text, 
                borderColor: errors.budget ? '#EF4444' : colors.border 
              }
            ]}
            placeholder="0.00"
            placeholderTextColor={colors.textSecondary}
            value={formData.budget}
            onChangeText={(value) => updateFormData('budget', value)}
            keyboardType="numeric"
          />
        </View>
        {errors.budget && <Text style={styles.errorText}>{errors.budget}</Text>}
      </View>

      {/* Privacy Setting */}
      <View style={styles.inputContainer}>
        <View style={styles.switchContainer}>
          <View style={styles.switchInfo}>
            <Text style={[styles.label, { color: colors.text }]}>Make Trip Public</Text>
            <Text style={[styles.helperText, { color: colors.textSecondary }]}>
              Allow others to see your trip
            </Text>
          </View>
          <Switch
            trackColor={{ false: colors.border, true: colors.primary + '50' }}
            thumbColor={formData.isPublic ? colors.primary : '#f4f3f4'}
            ios_backgroundColor={colors.border}
            onValueChange={(value) => updateFormData('isPublic', value)}
            value={formData.isPublic}
          />
        </View>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContent}>
      <Text style={[styles.stepHeader, { color: colors.text }]}>Review your trip ✨</Text>
      
      <View style={[styles.reviewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Image
          source={{ 
            uri: formData.image || 'https://images.pexels.com/photos/1008155/pexels-photo-1008155.jpeg?auto=compress&cs=tinysrgb&w=400' 
          }}
          style={styles.reviewImage}
        />
        <View style={styles.reviewOverlay}>
          <Text style={styles.reviewTitle}>
            {formData.title || 'Your Amazing Trip'}
          </Text>
          <Text style={styles.reviewDestination}>
            {formData.destination || 'Dream Destination'}
          </Text>
        </View>
        
        <View style={styles.reviewDetails}>
          <View style={styles.reviewRow}>
            <Calendar size={18} color={colors.primary} />
            <Text style={[styles.reviewText, { color: colors.text }]}>
              {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
            </Text>
          </View>
          
          <View style={styles.reviewRow}>
            <Clock size={18} color={colors.primary} />
            <Text style={[styles.reviewText, { color: colors.text }]}>
              {getDaysBetween()} {getDaysBetween() === 1 ? 'day' : 'days'}
            </Text>
          </View>

          {formData.travelers && (
            <View style={styles.reviewRow}>
              <Users size={18} color={colors.primary} />
              <Text style={[styles.reviewText, { color: colors.text }]}>
                {formData.travelers} traveler{formData.travelers !== '1' ? 's' : ''}
              </Text>
            </View>
          )}

          <View style={styles.reviewRow}>
            <Text style={styles.reviewTypeIcon}>
              {tripTypes.find(t => t.value === formData.tripType)?.icon || '✈️'}
            </Text>
            <Text style={[styles.reviewText, { color: colors.text }]}>
              {tripTypes.find(t => t.value === formData.tripType)?.label || 'Leisure & Vacation'}
            </Text>
          </View>

          <View style={styles.reviewRow}>
            {priorityLevels.find(p => p.value === formData.priority)?.icon}
            <Text style={[styles.reviewText, { color: colors.text }]}>
              {priorityLevels.find(p => p.value === formData.priority)?.label || 'Planned'}
            </Text>
          </View>

          {formData.budget && (
            <View style={styles.reviewRow}>
              <DollarSign size={18} color={colors.primary} />
              <Text style={[styles.reviewText, { color: colors.text }]}>
                {formData.currency} {formData.budget}
              </Text>
            </View>
          )}

          {formData.description && (
            <View style={styles.reviewDescriptionContainer}>
              <FileText size={18} color={colors.primary} />
              <Text style={[styles.reviewDescription, { color: colors.textSecondary }]}>
                {formData.description}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const renderCalendar = () => {
    const currentMonth = calendarDate.getMonth();
    const currentYear = calendarDate.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const days = [];
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = date.toDateString() === (activeCalendar === 'start' ? startDate : endDate).toDateString();
            const isPast = date < new Date() && !isToday;

      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.calendarDay,
            isSelected && { backgroundColor: colors.primary },
            isToday && !isSelected && { borderColor: colors.primary, borderWidth: 2 },
            isPast && { opacity: 0.3 }
          ]}
          onPress={() => !isPast && handleCalendarDateSelect(date)}
          disabled={isPast}
        >
          <Text
            style={[
              styles.calendarDayText,
              { color: isSelected ? '#FFFFFF' : colors.text },
              isToday && !isSelected && { color: colors.primary, fontWeight: 'bold' }
            ]}
          >
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <Modal
        visible={showCustomCalendar}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCustomCalendar(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.calendarContainer, { backgroundColor: colors.card }]}>
            <View style={styles.calendarHeader}>
              <TouchableOpacity
                onPress={() => setCalendarDate(new Date(currentYear, currentMonth - 1, 1))}
                style={styles.calendarNavButton}
              >
                <ChevronLeft size={24} color={colors.text} />
              </TouchableOpacity>
              
              <Text style={[styles.calendarTitle, { color: colors.text }]}>
                {monthNames[currentMonth]} {currentYear}
              </Text>
              
              <TouchableOpacity
                onPress={() => setCalendarDate(new Date(currentYear, currentMonth + 1, 1))}
                style={styles.calendarNavButton}
              >
                <ChevronRight size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.calendarWeekdays}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <Text key={day} style={[styles.calendarWeekday, { color: colors.textSecondary }]}>
                  {day}
                </Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {days}
            </View>

            <TouchableOpacity
              style={[styles.calendarCloseButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowCustomCalendar(false)}
            >
              <Text style={styles.calendarCloseButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <X size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Create New Trip</Text>
        <View style={{ width: 40 }} />
      </View>

      {renderStepIndicator()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderCurrentStep()}
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <View style={styles.buttonContainer}>
          {currentStep > 1 && (
            <TouchableOpacity
              style={[
                styles.navButton,
                styles.previousButton,
                { backgroundColor: colors.card, borderColor: colors.border }
              ]}
              onPress={handlePrevious}
            >
              <Text style={[styles.navButtonText, { color: colors.text }]}>Back</Text>
            </TouchableOpacity>
          )}
          
          {currentStep < 4 ? (
            <TouchableOpacity
              style={[
                styles.navButton,
                styles.nextButton,
                { 
                  backgroundColor: colors.primary,
                  opacity: loading ? 0.7 : 1
                }
              ]}
              onPress={handleNext}
              disabled={loading}
            >
              <Text style={styles.navButtonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.navButton,
                styles.submitButton,
                { 
                  backgroundColor: colors.primary,
                  opacity: loading ? 0.7 : 1
                }
              ]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.navButtonText}>Create Trip</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Native Date Pickers for Android */}
      {Platform.OS === 'android' && showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={onStartDateChange}
          minimumDate={new Date()}
        />
      )}

      {Platform.OS === 'android' && showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={onEndDateChange}
          minimumDate={startDate}
        />
      )}

      {/* Custom Calendar for iOS */}
      {Platform.OS === 'ios' && renderCalendar()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
   stepIndicator: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  stepDots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  stepDotContainer: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  stepLine: {
    position: 'absolute',
    top: 18,
    left: -50,
    width: 100,
    height: 2,
    zIndex: 0,
  },
  stepDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    zIndex: 1,
    backgroundColor: '#FFFFFF', 
  },
  stepDotText: {
    fontSize: 14,
    fontWeight: '600',
  },
  stepDotCheckmark: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  stepLabel: {
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 80,
  },
  currentStepInfo: {
    borderRadius: 16,
    padding: 16,
  },
  stepInfoContent: {
    marginBottom: 12,
  },
  stepInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  stepInfoSubtitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 0.3s ease-in-out', // For smooth animation on web
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
    stepIndicator: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  stepInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  stepSubtitle: {
    fontSize: 14,
  },
  content: {
    flex: 1,
  },
  stepContent: {
    paddingHorizontal: 20,
  },
  stepHeader: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 24,
  },
  form: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 1.5,
    fontSize: 16,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  inputWithIconText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  imageUpload: {
    height: 180,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
    borderRadius: 20,
  },
  uploadContent: {
    alignItems: 'center',
    padding: 20,
  },
  uploadIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  uploadSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  dateSection: {
    marginBottom: 24,
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  dateCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  dateCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  durationInfo: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  durationText: {
    fontSize: 14,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 13,
    marginTop: 8,
  },
  tripTypeScroll: {
    marginBottom: 8,
  },
  tripTypeCard: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    marginRight: 8,
    alignItems: 'center',
    minWidth: 120,
  },
  tripTypeIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  tripTypeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  budgetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height:55,
  },
  dropdown: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    borderWidth: 1.5,
    borderRightWidth: 0,
  },
  dropdownIcon: {
    marginRight: 8,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  budgetInput: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    borderWidth: 1.5,
    fontSize: 16,
  },
  textArea: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 1.5,
    fontSize: 16,
    minHeight: 120,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchInfo: {
    flex: 1,
    
    
  },
  reviewCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  reviewImage: {
    width: '100%',
    height: 180,
  },
  reviewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    padding: 20,
  },
  reviewTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  reviewDestination: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  reviewDetails: {
    padding: 20,
  },
  reviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  reviewTypeIcon: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  reviewDescriptionContainer: {
    flexDirection: 'row',
    marginTop: 16,
  },
  reviewDescription: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 12,
  },
  // Calendar Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    margin: 20,
    borderRadius: 20,
    padding: 20,
    minWidth: 300,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  calendarNavButton: {
    padding: 8,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  calendarWeekdays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  calendarWeekday: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    paddingVertical: 8,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom: 4,
  },
  calendarDayText: {
    fontSize: 16,
    fontWeight: '500',
  },
  calendarCloseButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  calendarCloseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  navButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  previousButton: {
    flex: 0.5,
  },
  nextButton: {
    flex: 1,
    
  },
  submitButton: {
    flex: 1,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 8,
    fontWeight: '500',
  },
});