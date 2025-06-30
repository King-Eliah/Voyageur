import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
  Share,
  Linking
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Heart, 
  Share as ShareIcon, 
  Star, 
  MapPin, 
  Calendar, 
  Users,
  Bed,
  Car as CarIcon,
  Compass,
  Wifi,
  Camera,
  Coffee,
  Shield,
  Navigation,
  Activity,
  Dumbbell,
  Clock,
  Mountain,
  Waves,
  Building,
  TreePine,
  Fuel,
  Settings,
  Zap,
  ChevronRight,
  Phone,
  Globe,
  Mail
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

const { width } = Dimensions.get('window');

export default function DetailScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const params = useLocalSearchParams();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Get detailed data from params with proper typing
  const detailData = {
    id: params.id as string || '1',
    title: params.title as string || params.name as string || 'Item',
    type: (params.type as 'hotel' | 'car' | 'activity' | 'destination') || 'hotel',
    image: params.image as string || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    price: parseInt(params.price as string) || 0,
    currency: params.currency as string || '$',
    rating: parseFloat(params.rating as string) || 4.5,
    reviewCount: parseInt(params.reviews as string) || 0,
    location: params.location as string || params.pickupLocation as string || 'Location',
    description: params.description as string || 'Description not available',
    features: params.features ? JSON.parse(params.features as string) : [],
    highlights: params.highlights ? JSON.parse(params.highlights as string) : [],
    
    // Car specific
    model: params.model as string || '',
    provider: params.provider as string || '',
    seats: parseInt(params.seats as string) || 0,
    transmission: params.transmission as string || '',
    fuelType: params.fuelType as string || '',
    mileage: params.mileage as string || '',
    
    // Hotel specific
    checkInTime: params.checkInTime as string || '',
    checkOutTime: params.checkOutTime as string || '',
    roomType: params.roomType as string || '',
    
    // Activity specific
    duration: params.duration as string || '',
    groupSize: params.groupSize as string || '',
    difficulty: params.difficulty as 'easy' | 'moderate' | 'challenging' || 'moderate',
    includes: params.includes ? JSON.parse(params.includes as string) : [],
    
    // Destination specific
    bestTime: params.bestTime as string || ''
  };

  const handleShare = async () => {
    try {
      let message = `Check out this ${detailData.type}: ${detailData.title}\n`;
      message += `Rating: ${detailData.rating}⭐\n`;
      message += `Price: ${detailData.currency}${detailData.price}\n`;
      message += `Location: ${detailData.location}`;

      await Share.share({
        message,
        title: detailData.title,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleBookNow = () => {
    router.push({
      pathname: '/bookings/booking',
      params: {
        id: detailData.id,
        title: detailData.title,
        image: detailData.image,
        price: detailData.price.toString(),
        type: detailData.type,
        location: detailData.location,
        ...(detailData.type === 'hotel' && {
          checkIn: detailData.checkInTime,
          checkOut: detailData.checkOutTime
        }),
        ...(detailData.type === 'car' && {
          model: detailData.model,
          provider: detailData.provider
        })
      }
    });
  };

  const getTypeIcon = () => {
    switch (detailData.type) {
      case 'hotel': return Bed;
      case 'car': return CarIcon;
      case 'activity': return Compass;
      case 'destination': return MapPin;
      default: return Star;
    }
  };

  const getTypeTitle = () => {
    switch (detailData.type) {
      case 'hotel': return 'Hotel';
      case 'car': return 'Car Rental';
      case 'activity': return 'Activity';
      case 'destination': return 'Destination';
      default: return 'Item';
    }
  };

  const getPriceUnit = () => {
    switch (detailData.type) {
      case 'hotel': return '/night';
      case 'car': return '/day';
      case 'activity': return '/person';
      case 'destination': return '/person';
      default: return '';
    }
  };

  const getFeatureIcon = (feature: string) => {
    if (feature.toLowerCase().includes('gps') || feature.toLowerCase().includes('navigation')) return MapPin;
    if (feature.toLowerCase().includes('bluetooth') || feature.toLowerCase().includes('mobile')) return Settings;
    if (feature.toLowerCase().includes('charging') || feature.toLowerCase().includes('supercharging')) return Zap;
    if (feature.toLowerCase().includes('safety') || feature.toLowerCase().includes('security')) return Shield;
    if (feature.toLowerCase().includes('wifi')) return Wifi;
    if (feature.toLowerCase().includes('parking')) return CarIcon;
    if (feature.toLowerCase().includes('restaurant')) return Coffee;
    if (feature.toLowerCase().includes('gym') || feature.toLowerCase().includes('fitness')) return Dumbbell;
    if (feature.toLowerCase().includes('guide')) return Users;
    if (feature.toLowerCase().includes('transport')) return Navigation;
    return Settings;
  };

  const getDifficultyColor = () => {
    if (!detailData.difficulty) return colors.text;
    switch (detailData.difficulty) {
      case 'easy': return '#10B981';
      case 'moderate': return '#F59E0B';
      case 'challenging': return '#EF4444';
      default: return colors.text;
    }
  };

  const renderTypeSpecificContent = () => {
    switch (detailData.type) {
      case 'hotel':
        return (
          <>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Room Type</Text>
              <Text style={[styles.description, { color: colors.textSecondary }]}>
                {detailData.roomType}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Check-In/Out</Text>
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Clock size={16} color={colors.textSecondary} />
                  <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                    Check-in: {detailData.checkInTime}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Clock size={16} color={colors.textSecondary} />
                  <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                    Check-out: {detailData.checkOutTime}
                  </Text>
                </View>
              </View>
            </View>
          </>
        );
      case 'car':
        return (
          <>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Vehicle Details</Text>
              <View style={styles.detailGrid}>
                <View style={[styles.detailCard, { backgroundColor: colors.card }]}>
                  <Users size={20} color={colors.primary} />
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Seats</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{detailData.seats}</Text>
                </View>
                <View style={[styles.detailCard, { backgroundColor: colors.card }]}>
                  <Settings size={20} color={colors.primary} />
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Transmission</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{detailData.transmission}</Text>
                </View>
                <View style={[styles.detailCard, { backgroundColor: colors.card }]}>
                  <Fuel size={20} color={colors.primary} />
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Fuel Type</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{detailData.fuelType}</Text>
                </View>
                <View style={[styles.detailCard, { backgroundColor: colors.card }]}>
                  <Navigation size={20} color={colors.primary} />
                  <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Mileage</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{detailData.mileage}</Text>
                </View>
              </View>
            </View>
          </>
        );
      case 'activity':
        return (
          <>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Activity Details</Text>
              <View style={styles.detailRow}>
                <View style={styles.detailItem}>
                  <Clock size={16} color={colors.textSecondary} />
                  <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                    Duration: {detailData.duration}
                  </Text>
                </View>
                <View style={styles.detailItem}>
                  <Users size={16} color={colors.textSecondary} />
                  <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                    Group Size: {detailData.groupSize}
                  </Text>
                </View>
              </View>
            </View>

            {detailData.difficulty && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Difficulty Level</Text>
                <View style={styles.difficultyContainer}>
                  <Shield size={16} color={getDifficultyColor()} />
                  <Text style={[styles.difficultyText, { color: getDifficultyColor() }]}>
                    {detailData.difficulty.charAt(0).toUpperCase() + detailData.difficulty.slice(1)}
                  </Text>
                </View>
              </View>
            )}
          </>
        );
      case 'destination':
        return (
          <>
            {detailData.bestTime && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Best Time to Visit</Text>
                <Text style={[styles.description, { color: colors.textSecondary }]}>
                  {detailData.bestTime}
                </Text>
              </View>
            )}
          </>
        );
      default:
        return null;
    }
  };

  const renderContactOptions = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact</Text>
      <TouchableOpacity style={[styles.contactOption, { backgroundColor: colors.card }]}>
        <Phone size={20} color={colors.primary} />
        <Text style={[styles.contactText, { color: colors.text }]}>Call Provider</Text>
        <ChevronRight size={20} color={colors.textSecondary} />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.contactOption, { backgroundColor: colors.card }]}>
        <Mail size={20} color={colors.primary} />
        <Text style={[styles.contactText, { color: colors.text }]}>Send Email</Text>
        <ChevronRight size={20} color={colors.textSecondary} />
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.contactOption, { backgroundColor: colors.card }]}
        onPress={() => Linking.openURL('https://www.example.com')}
      >
        <Globe size={20} color={colors.primary} />
        <Text style={[styles.contactText, { color: colors.text }]}>Visit Website</Text>
        <ChevronRight size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.headerButton, { backgroundColor: 'rgba(0, 0, 0, 0.3)' }]}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.headerButton, { backgroundColor: 'rgba(0, 0, 0, 0.3)' }]}
              onPress={handleShare}
            >
              <ShareIcon size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.headerButton, { backgroundColor: 'rgba(0, 0, 0, 0.3)' }]}
              onPress={handleToggleFavorite}
            >
              <Heart 
                size={24} 
                color={isFavorite ? '#EF4444' : '#FFFFFF'} 
                fill={isFavorite ? '#EF4444' : 'transparent'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Image */}
        <Image source={{ uri: detailData.image }} style={styles.mainImage} />

        {/* Content */}
        <View style={styles.content}>
          {/* Type Badge */}
          <View style={styles.typeBadge}>
            {React.createElement(getTypeIcon(), { size: 16, color: colors.primary })}
            <Text style={[styles.typeText, { color: colors.primary }]}>
              {getTypeTitle().toUpperCase()}
            </Text>
          </View>

          {/* Title and Rating */}
          <View style={styles.titleSection}>
            <Text style={[styles.title, { color: colors.text }]}>{detailData.title}</Text>
            <View style={styles.ratingContainer}>
              <Star size={16} color="#FFD700" fill="#FFD700" />
              <Text style={[styles.rating, { color: colors.text }]}>{detailData.rating}</Text>
              {detailData.reviewCount > 0 && (
                <Text style={[styles.reviews, { color: colors.textSecondary }]}>
                  ({detailData.reviewCount} reviews)
                </Text>
              )}
            </View>
          </View>

          {/* Location */}
          <View style={styles.locationContainer}>
            <MapPin size={16} color={colors.textSecondary} />
            <Text style={[styles.location, { color: colors.textSecondary }]}>{detailData.location}</Text>
          </View>

          {/* Type-specific details */}
          {renderTypeSpecificContent()}

          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>{detailData.description}</Text>
          </View>

          {/* Highlights */}
          {detailData.highlights.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {detailData.type === 'hotel' ? 'Property Highlights' : 
                 detailData.type === 'car' ? 'Vehicle Features' : 
                 detailData.type === 'activity' ? 'Experience Highlights' : 'Why Visit'}
              </Text>
              {detailData.highlights.map((highlight, index) => (
                <View key={index} style={styles.highlightItem}>
                  <View style={[styles.highlightDot, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.highlightText, { color: colors.textSecondary }]}>{highlight}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Features/Includes */}
          {(detailData.features.length > 0 || detailData.includes.length > 0) && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {detailData.type === 'hotel' ? 'Amenities' : 
                 detailData.type === 'car' ? 'Features' : 
                 detailData.type === 'activity' ? 'What\'s Included' : 'Key Features'}
              </Text>
              <View style={styles.featuresGrid}>
                {(detailData.type === 'activity' ? detailData.includes : detailData.features).map((item, index) => {
                  const IconComponent = getFeatureIcon(item);
                  return (
                    <View key={index} style={[styles.featureItem, { backgroundColor: colors.card }]}>
                      <IconComponent size={16} color={colors.primary} />
                      <Text style={[styles.featureText, { color: colors.text }]}>{item}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Contact Options */}
          {detailData.type !== 'destination' && renderContactOptions()}

          {/* Map Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Location</Text>
            <View style={[styles.mapPlaceholder, { backgroundColor: colors.card }]}>
              <MapPin size={48} color={colors.textSecondary} />
              <Text style={[styles.mapText, { color: colors.textSecondary }]}>
                {detailData.location}
              </Text>
              <TouchableOpacity 
                style={[styles.mapButton, { backgroundColor: colors.primary }]}
                onPress={() => Linking.openURL(`https://maps.google.com/?q=${detailData.location}`)}
              >
                <Text style={[styles.mapButtonText, { color: '#FFFFFF' }]}>View on Map</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action */}
      {detailData.type !== 'destination' && (
        <View style={[styles.bottomAction, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
          <View style={styles.priceContainer}>
            <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Starting from</Text>
            <Text style={[styles.price, { color: colors.primary }]}>{detailData.currency}{detailData.price}</Text>
            <Text style={[styles.priceUnit, { color: colors.textSecondary }]}>{getPriceUnit()}</Text>
          </View>
          <TouchableOpacity
            style={[styles.bookButton, { backgroundColor: colors.primary }]}
            onPress={handleBookNow}
          >
            <Text style={styles.bookButtonText}>
              {detailData.type === 'destination' ? 'Explore Options' : 'Book Now'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  mainImage: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 20,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  titleSection: {
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  reviews: {
    fontSize: 14,
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  location: {
    fontSize: 16,
    marginLeft: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 8,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailCard: {
    width: (width - 52) / 2,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  difficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  highlightDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
  },
  highlightText: {
    fontSize: 16,
    flex: 1,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    marginLeft: 8,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  contactText: {
    fontSize: 16,
    flex: 1,
    marginLeft: 12,
  },
  mapPlaceholder: {
    height: 150,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapText: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 12,
  },
  mapButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  mapButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  bottomAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    marginRight: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  priceUnit: {
    fontSize: 14,
    marginLeft: 4,
  },
  bookButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 25,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});