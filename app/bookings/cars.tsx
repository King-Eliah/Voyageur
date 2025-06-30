import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useData } from '@/contexts/DataContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Car, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Fuel, 
  Settings, 
  Star,
  ArrowLeft,
  Filter,
  Search,
  Heart,
  Shield,
  Zap
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

interface CarRental {
  id: string;
  name: string;
  model: string;
  image: string;
  pricePerDay: number;
  originalPrice?: number;
  currency: string;
  rating: number;
  reviews: number;
  seats: number;
  transmission: 'automatic' | 'manual';
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  provider: string;
  features: string[];
  pickupLocation: string;
  available: boolean;
  featured?: boolean;
  discount?: number;
  highlights: string[];
  category: 'economy' | 'compact' | 'suv' | 'luxury' | 'electric';
  mileage: string;
  description: string;
}

export default function CarsScreen() {
  const { colors } = useTheme();
  const { addBooking } = useData();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [pickupDate, setPickupDate] = useState(new Date());
  const [dropoffDate, setDropoffDate] = useState(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000));
  const [showPickupPicker, setShowPickupPicker] = useState(false);
  const [showDropoffPicker, setShowDropoffPicker] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Enhanced mock car rental data
  const carRentals: CarRental[] = [
    {
      id: '1',
      name: 'Tesla Model 3',
      model: '2024',
      image: 'https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?auto=compress&cs=tinysrgb&w=400',
      pricePerDay: 89,
      originalPrice: 109,
      currency: '$',
      rating: 4.9,
      reviews: 187,
      seats: 5,
      transmission: 'automatic',
      fuelType: 'electric',
      provider: 'Premium Rentals',
      features: ['Autopilot', 'Premium Interior', 'Supercharging', 'Mobile App'],
      pickupLocation: 'Airport Terminal A',
      available: true,
      featured: true,
      discount: 18,
      highlights: ['Zero emissions', 'Autopilot', 'Premium sound', 'Mobile access'],
      category: 'electric',
      mileage: '400+ miles range',
      description: 'Experience the future of driving with Tesla\'s most popular electric sedan'
    },
    {
      id: '2',
      name: 'BMW X5',
      model: '2024',
      image: 'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg?auto=compress&cs=tinysrgb&w=400',
      pricePerDay: 125,
      originalPrice: 155,
      currency: '$',
      rating: 4.8,
      reviews: 143,
      seats: 7,
      transmission: 'automatic',
      fuelType: 'petrol',
      provider: 'Luxury Fleet',
      features: ['All-Wheel Drive', 'Panoramic Roof', 'Heated Seats', 'Premium Sound'],
      pickupLocation: 'Downtown Premium',
      available: true,
      featured: true,
      discount: 19,
      highlights: ['Luxury interior', 'All-wheel drive', 'Panoramic roof', '7 seats'],
      category: 'luxury',
      mileage: '28 mpg',
      description: 'Premium luxury SUV perfect for family trips and business travel'
    },
    {
      id: '3',
      name: 'Toyota Camry',
      model: '2024',
      image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=400',
      pricePerDay: 45,
      originalPrice: 55,
      currency: '$',
      rating: 4.7,
      reviews: 324,
      seats: 5,
      transmission: 'automatic',
      fuelType: 'petrol',
      provider: 'Economy Cars',
      features: ['GPS Navigation', 'Bluetooth', 'Air Conditioning', 'USB Charging'],
      pickupLocation: 'City Center Hub',
      available: true,
      featured: false,
      discount: 18,
      highlights: ['Fuel efficient', 'Reliable', 'Comfortable', 'Great value'],
      category: 'economy',
      mileage: '35 mpg',
      description: 'Reliable and fuel-efficient sedan perfect for city driving and road trips'
    },
    {
      id: '4',
      name: 'Honda CR-V',
      model: '2024',
      image: 'https://images.pexels.com/photos/1118448/pexels-photo-1118448.jpeg?auto=compress&cs=tinysrgb&w=400',
      pricePerDay: 65,
      originalPrice: 75,
      currency: '$',
      rating: 4.6,
      reviews: 256,
      seats: 5,
      transmission: 'automatic',
      fuelType: 'hybrid',
      provider: 'Eco Rentals',
      features: ['All-Wheel Drive', 'Cargo Space', 'Safety Features', 'Fuel Efficient'],
      pickupLocation: 'Suburban Location',
      available: true,
      featured: false,
      discount: 13,
      highlights: ['Hybrid engine', 'Spacious cargo', 'Safety tech', 'All-weather'],
      category: 'suv',
      mileage: '40 mpg hybrid',
      description: 'Versatile hybrid SUV combining efficiency with practicality'
    },
    {
      id: '5',
      name: 'Ford Mustang',
      model: '2024',
      image: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=400',
      pricePerDay: 85,
      currency: '$',
      rating: 4.5,
      reviews: 178,
      seats: 4,
      transmission: 'manual',
      fuelType: 'petrol',
      provider: 'Sports Cars Plus',
      features: ['Sport Package', 'Performance Tires', 'Manual Transmission', 'V8 Engine'],
      pickupLocation: 'Performance Center',
      available: false,
      featured: false,
      highlights: ['V8 power', 'Sport tuned', 'Manual trans', 'Iconic design'],
      category: 'luxury',
      mileage: '25 mpg',
      description: 'Iconic American muscle car delivering thrilling performance and style'
    },
  ];

  const carCategories = [
    { id: 'all', title: 'All', icon: Car, color: '#6B7280' },
    { id: 'economy', title: 'Economy', icon: Car, color: '#10B981' },
    { id: 'suv', title: 'SUV', icon: Car, color: '#F59E0B' },
    { id: 'luxury', title: 'Luxury', icon: Star, color: '#8B5CF6' },
    { id: 'electric', title: 'Electric', icon: Zap, color: '#06B6D4' },
  ];

  const getFeatureIcon = (feature: string) => {
    if (feature.toLowerCase().includes('gps') || feature.toLowerCase().includes('navigation')) return MapPin;
    if (feature.toLowerCase().includes('bluetooth') || feature.toLowerCase().includes('mobile')) return Settings;
    if (feature.toLowerCase().includes('charging') || feature.toLowerCase().includes('supercharging')) return Zap;
    if (feature.toLowerCase().includes('safety') || feature.toLowerCase().includes('security')) return Shield;
    return Settings;
  };

  const handleBookCar = async (car: CarRental) => {
    if (!car.available) return;

    try {
      const days = Math.ceil((dropoffDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24));
      
      await addBooking({
        type: 'car',
        title: `${car.name} ${car.model}`,
        location: car.pickupLocation,
        date: pickupDate.toISOString(),
        status: 'confirmed',
        price: car.pricePerDay * days,
        currency: car.currency,
        image: car.image,
        details: {
          pickup: pickupDate.toISOString(),
          dropoff: dropoffDate.toISOString(),
          provider: car.provider,
          features: car.features,
          days: days,
          pricePerDay: car.pricePerDay,
        },
      });

      Alert.alert(
        'Booking Confirmed!',
        `Your ${car.name} rental has been confirmed for ${days} days.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to book car. Please try again.');
    }
  };

const renderCarCard = (car: CarRental) => {
  const hasDiscount = car.originalPrice && car.originalPrice > car.pricePerDay;
  const days = Math.ceil((dropoffDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <TouchableOpacity
      key={car.id}
      style={[
        styles.carCard,
        {
          backgroundColor: colors.card,
          opacity: car.available ? 1 : 0.7,
        },
      ]}
      onPress={() =>
        car.available &&
        router.push({
          pathname: '/bookings/detail',
          params: {
            id: car.id,
            name: car.name,
            model: car.model,
            image: car.image,
            price: String(car.pricePerDay),
            currency: car.currency,
            description: car.description,
            provider: car.provider,
            rating: String(car.rating),
            reviews: String(car.reviews),
            seats: String(car.seats),
            transmission: car.transmission,
            fuelType: car.fuelType,
            pickupLocation: car.pickupLocation,
            mileage: car.mileage,
            features: JSON.stringify(car.features),
            highlights: JSON.stringify(car.highlights),
            type: 'car'
          },
        })
      }
      disabled={!car.available}
    >
        <View style={styles.imageContainer}>
          <Image source={{ uri: car.image }} style={styles.carImage} />
          
          {car.featured && (
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredText}>Featured</Text>
            </View>
          )}
          
          {hasDiscount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{car.discount}%</Text>
            </View>
          )}

          {!car.available && (
            <View style={styles.unavailableBadge}>
              <Text style={styles.unavailableText}>Not Available</Text>
            </View>
          )}

          <TouchableOpacity style={styles.favoriteButton}>
            <Heart size={16} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.carContent}>
          <View style={styles.carHeader}>
            <View style={styles.carInfo}>
              <Text style={[styles.carName, { color: colors.text }]} numberOfLines={1}>
                {car.name} {car.model}
              </Text>
              <Text style={[styles.provider, { color: colors.textSecondary }]}>
                {car.provider}
              </Text>
            </View>
            <View style={styles.ratingContainer}>
              <Star size={14} color="#F59E0B" fill="#F59E0B" />
              <Text style={[styles.rating, { color: colors.text }]}>{car.rating}</Text>
              <Text style={[styles.reviews, { color: colors.textSecondary }]}>
                ({car.reviews})
              </Text>
            </View>
          </View>

          <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
            {car.description}
          </Text>

          <View style={styles.carDetails}>
            <View style={styles.detailItem}>
              <MapPin size={14} color={colors.textSecondary} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]} numberOfLines={1}>
                {car.pickupLocation}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Users size={14} color={colors.textSecondary} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                {car.seats} seats • {car.transmission}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Fuel size={14} color={colors.textSecondary} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                {car.fuelType} • {car.mileage}
              </Text>
            </View>
          </View>

          <View style={styles.featuresContainer}>
            {car.features.slice(0, 4).map((feature: string, index: number) => {
              const IconComponent = getFeatureIcon(feature);
              return (
                <View key={index} style={[styles.featureIcon, { backgroundColor: colors.primary + '20' }]}>
                  <IconComponent size={12} color={colors.primary} />
                </View>
              );
            })}
          </View>

          <View style={styles.highlightsContainer}>
            {car.highlights.slice(0, 2).map((highlight: string, index: number) => (
              <View key={index} style={[styles.highlightTag, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.highlightText, { color: colors.primary }]}>{highlight}</Text>
              </View>
            ))}
            {car.highlights.length > 2 && (
              <Text style={[styles.moreHighlights, { color: colors.textSecondary }]}>
                +{car.highlights.length - 2} more
              </Text>
            )}
          </View>

           <View style={styles.carFooter}>
        <View style={styles.priceContainer}>
          {hasDiscount && (
            <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
              {car.currency}
              {car.originalPrice}
            </Text>
          )}
          <Text style={[styles.price, { color: colors.primary }]}>
            {car.currency}
            {car.pricePerDay}
          </Text>
          <Text style={[styles.priceUnit, { color: colors.textSecondary }]}>/day</Text>
        </View>
        
         {/* Update the Book Now button */}
      {car.available && (
        <TouchableOpacity
          style={[styles.bookButton, { backgroundColor: colors.primary }]}
          onPress={() =>
            router.push({
              pathname: '/bookings/booking',
              params: {
                title: `${car.name} ${car.model}`,
                image: car.image,
                price: String(car.pricePerDay * days),
                currency: car.currency,
                pickup: pickupDate.toISOString(),
                dropoff: dropoffDate.toISOString(),
                provider: car.provider,
                type: 'car'
              },
            })
          }
        >
                <Text style={styles.bookButtonText}>Book Now</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredCars = carRentals.filter(car => {
    const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         car.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         car.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedFilter === 'all' || car.category === selectedFilter;
    
    return matchesSearch && matchesCategory;
  });

  const featuredCars = filteredCars.filter(car => car.featured);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Car Rentals</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
            <Search size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search cars, brands, locations..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Date Selection */}
        <View style={styles.dateSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Rental Period</Text>
          <View style={styles.dateRow}>
            <TouchableOpacity
              style={[styles.dateButton, { backgroundColor: colors.card }]}
              onPress={() => setShowPickupPicker(true)}
            >
              <Calendar size={16} color={colors.primary} />
              <View style={styles.dateInfo}>
                <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>Pick-up</Text>
                <Text style={[styles.dateValue, { color: colors.text }]}>{pickupDate.toLocaleDateString()}</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.dateButton, { backgroundColor: colors.card }]}
              onPress={() => setShowDropoffPicker(true)}
            >
              <Calendar size={16} color={colors.primary} />
              <View style={styles.dateInfo}>
                <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>Drop-off</Text>
                <Text style={[styles.dateValue, { color: colors.text }]}>{dropoffDate.toLocaleDateString()}</Text>
              </View>
            </TouchableOpacity>
            
            <View style={[styles.daysButton, { backgroundColor: colors.card }]}>
              <Clock size={16} color={colors.primary} />
              <View style={styles.dateInfo}>
                <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>Days</Text>
                <Text style={[styles.dateValue, { color: colors.text }]}>
                  {Math.ceil((dropoffDate.getTime() - pickupDate.getTime()) / (1000 * 60 * 60 * 24))}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {carCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard, 
                  { 
                    backgroundColor: selectedFilter === category.id ? category.color + '20' : colors.card,
                    borderColor: selectedFilter === category.id ? category.color : 'transparent',
                    borderWidth: selectedFilter === category.id ? 1 : 0
                  }
                ]}
                onPress={() => setSelectedFilter(category.id)}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                  <category.icon size={20} color={category.color} />
                </View>
                <Text style={[styles.categoryTitle, { color: colors.text }]}>{category.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Cars */}
        {featuredCars.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Cars</Text>
            {featuredCars.map(renderCarCard)}
          </View>
        )}

        {/* All Cars */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {selectedFilter === 'all' ? 'All Cars' : `${carCategories.find(cat => cat.id === selectedFilter)?.title} Cars`} ({filteredCars.length})
            </Text>
            <TouchableOpacity>
              <Text style={[styles.sortText, { color: colors.primary }]}>Sort by Price</Text>
            </TouchableOpacity>
          </View>
          
          {filteredCars.length > 0 ? (
            filteredCars.map(renderCarCard)
          ) : (
            <View style={styles.emptyState}>
              <Car size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No Cars Found</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Try adjusting your search or category filters
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Date Pickers */}
      {showPickupPicker && (
        <DateTimePicker
          value={pickupDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowPickupPicker(Platform.OS === 'ios');
            if (selectedDate) setPickupDate(selectedDate);
          }}
          minimumDate={new Date()}
        />
      )}

      {showDropoffPicker && (
        <DateTimePicker
          value={dropoffDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDropoffPicker(Platform.OS === 'ios');
            if (selectedDate) setDropoffDate(selectedDate);
          }}
          minimumDate={pickupDate}
        />
      )}
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
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  dateSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  daysButton: {
    flex: 0.7,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateInfo: {
    marginLeft: 8,
  },
  dateLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sortText: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesContainer: {
    paddingLeft: 20,
    paddingBottom:10,
    paddingTop:10
  },
  categoryCard: {
    alignItems: 'center',
    padding: 16,
    marginRight: 12,
    borderRadius: 12,
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  carCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  imageContainer: {
    position: 'relative',
  },
  carImage: {
    width: '100%',
    height: 180,
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  featuredText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    right: 52,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  unavailableBadge: {
    position: 'absolute',
    top: 12,
    right: 52,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  unavailableText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carContent: {
    padding: 16,
  },
  carHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  carInfo: {
    flex: 1,
    marginRight: 12,
  },
  carName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 24,
  },
  provider: {
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  reviews: {
    fontSize: 12,
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  carDetails: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 13,
    marginLeft: 6,
    flex: 1,
  },
  featuresContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  featureIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 16,
  },
  highlightTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 6,
    marginBottom: 4,
  },
  highlightText: {
    fontSize: 11,
    fontWeight: '500',
  },
  moreHighlights: {
    fontSize: 11,
    fontStyle: 'italic',
  },
  hotelFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  priceUnit: {
    fontSize: 14,
    marginLeft: 2,
  },
  bookButton: {
    marginTop:5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});