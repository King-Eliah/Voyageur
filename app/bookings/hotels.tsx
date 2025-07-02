import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert, Modal } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useData } from '@/contexts/DataContext'; // Added useData
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Wifi, 
  Car, 
  Coffee, 
  Dumbbell, 
  Heart, 
  Calendar, 
  Clock, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Minus 
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

export default function HotelsScreen() {
  const { colors } = useTheme();
  const { addBooking, addSavedItem, removeSavedItem, isItemSaved } = useData(); // Added favorites functions
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000));
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);
  const [showCustomCalendar, setShowCustomCalendar] = useState(false);
  const [activeCalendar, setActiveCalendar] = useState('checkIn');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [guests, setGuests] = useState(2);
  const [showGuestsModal, setShowGuestsModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const hotels = [
    {
      id: 'hotel-1',
      name: 'Grand Palace Hotel',
      location: 'Downtown, Paris',
      image: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      reviews: 1234,
      price: 299,
      originalPrice: 399,
      amenities: ['wifi', 'parking', 'restaurant', 'gym'],
      description: 'Luxury hotel in the heart of Paris with stunning city views',
      featured: true,
      discount: 25,
      highlights: ['City views', 'Concierge service', 'Spa & wellness', 'Fine dining'],
      category: 'luxury',
      checkInTime: '3:00 PM',
      checkOutTime: '11:00 AM',
      roomType: 'Deluxe Suite',
    },
    {
      id: 'hotel-2',
      name: 'Seaside Resort & Spa',
      location: 'Beachfront, Santorini',
      image: 'https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      reviews: 856,
      price: 450,
      originalPrice: 550,
      amenities: ['wifi', 'restaurant', 'gym'],
      description: 'Beachfront resort with private beach and world-class spa',
      featured: true,
      discount: 18,
      highlights: ['Private beach', 'Infinity pool', 'Spa treatments', 'Ocean views'],
      category: 'luxury',
      checkInTime: '2:00 PM',
      checkOutTime: '12:00 PM',
      roomType: 'Ocean View Villa',
    },
    {
      id: 'hotel-3',
      name: 'Mountain View Lodge',
      location: 'Swiss Alps, Switzerland',
      image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.7,
      reviews: 642,
      price: 199,
      originalPrice: 249,
      amenities: ['wifi', 'parking', 'restaurant'],
      description: 'Cozy lodge with breathtaking mountain views and hiking trails',
      featured: false,
      discount: 20,
      highlights: ['Mountain views', 'Hiking trails', 'Fireplace', 'Local cuisine'],
      category: 'budget',
      checkInTime: '3:00 PM',
      checkOutTime: '10:00 AM',
      roomType: 'Mountain Cabin',
    },
    {
      id: 'hotel-4',
      name: 'Urban Boutique Hotel',
      location: 'City Center, Tokyo',
      image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.6,
      reviews: 923,
      price: 180,
      originalPrice: 220,
      amenities: ['wifi', 'restaurant', 'gym'],
      description: 'Modern boutique hotel in the vibrant heart of Tokyo',
      featured: false,
      discount: 18,
      highlights: ['Modern design', 'Central location', 'Rooftop bar', 'Cultural tours'],
      category: 'business',
      checkInTime: '3:00 PM',
      checkOutTime: '11:00 AM',
      roomType: 'Business Suite',
    },
    {
      id: 'hotel-5',
      name: 'Desert Oasis Resort',
      location: 'Dubai, UAE',
      image: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      reviews: 1567,
      price: 350,
      originalPrice: 450,
      amenities: ['wifi', 'parking', 'restaurant', 'gym'],
      description: 'Luxury desert resort with infinity pools and spa treatments',
      featured: true,
      discount: 22,
      highlights: ['Infinity pools', 'Desert safari', 'Luxury spa', 'Gourmet dining'],
      category: 'luxury',
      checkInTime: '2:00 PM',
      checkOutTime: '12:00 PM',
      roomType: 'Presidential Suite',
    },
  ];

  const hotelCategories = [
    { id: 'all', title: 'All', icon: MapPin, color: '#6B7280' },
    { id: 'luxury', title: 'Luxury', icon: Star, color: '#F59E0B' },
    { id: 'budget', title: 'Budget', icon: Coffee, color: '#10B981' },
    { id: 'business', title: 'Business', icon: Wifi, color: '#3B82F6' },
  ];

  const getAmenityIcon = (amenity) => {
    switch (amenity) {
      case 'wifi':
        return Wifi;
      case 'parking':
        return Car;
      case 'restaurant':
        return Coffee;
      case 'gym':
        return Dumbbell;
      default:
        return Wifi;
    }
  };

  const openCalendar = (type) => {
    setActiveCalendar(type);
    setCalendarDate(type === 'checkIn' ? checkInDate : checkOutDate);
    if (Platform.OS === 'ios') {
      setShowCustomCalendar(true);
    } else {
      if (type === 'checkIn') {
        setShowCheckInPicker(true);
      } else {
        setShowCheckOutPicker(true);
      }
    }
  };

  const onCheckInDateChange = (event, selectedDate) => {
    setShowCheckInPicker(false);
    if (selectedDate) {
      setCheckInDate(selectedDate);
      // Auto-adjust checkout if it's before checkin
      if (selectedDate >= checkOutDate) {
        setCheckOutDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000));
      }
    }
  };

  const onCheckOutDateChange = (event, selectedDate) => {
    setShowCheckOutPicker(false);
    if (selectedDate) {
      setCheckOutDate(selectedDate);
    }
  };

  const handleCalendarDateSelect = (date) => {
    if (activeCalendar === 'checkIn') {
      setCheckInDate(date);
      // Auto-adjust checkout if it's before checkin
      if (date >= checkOutDate) {
        setCheckOutDate(new Date(date.getTime() + 24 * 60 * 60 * 1000));
      }
    } else {
      setCheckOutDate(date);
    }
    setShowCustomCalendar(false);
  };

  const formatDateDisplay = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getNightsBetween = () => {
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const nightsDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return nightsDiff;
  };

  const handleBookHotel = async (hotel) => {
    try {
      const nights = getNightsBetween();
      const totalPrice = hotel.price * nights;

      await addBooking({
        type: 'hotel',
        title: hotel.name,
        location: hotel.location,
        date: checkInDate.toISOString(),
        status: 'confirmed',
        price: totalPrice,
        currency: '$',
        image: hotel.image,
        details: {
          checkIn: checkInDate.toISOString(),
          checkOut: checkOutDate.toISOString(),
          guests,
          nights,
          pricePerNight: hotel.price,
          roomType: hotel.roomType,
          amenities: hotel.amenities,
        },
      });

      Alert.alert(
        'Booking Confirmed!',
        `Your reservation at ${hotel.name} has been confirmed for ${nights} ${nights === 1 ? 'night' : 'nights'}.`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to book hotel. Please try again.');
    }
  };

  // Added favorite toggle function
  const handleToggleFavorite = async (hotel: any) => {
    const savedItem = {
      id: hotel.id,
      type: 'hotel' as const,
      title: hotel.name,
      location: hotel.location,
      image: hotel.image,
      rating: hotel.rating,
      price: hotel.price
    };

    if (isItemSaved(hotel.id)) {
      await removeSavedItem(hotel.id);
    } else {
      await addSavedItem(savedItem);
    }
  };

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
      const isSelected = date.toDateString() === (activeCalendar === 'checkIn' ? checkInDate : checkOutDate).toDateString();
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

  const renderGuestsModal = () => (
    <Modal
      visible={showGuestsModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowGuestsModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.guestsContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.guestsTitle, { color: colors.text }]}>Number of Guests</Text>
          
          <View style={styles.guestsSelector}>
            <TouchableOpacity
              style={[styles.guestsButton, { backgroundColor: colors.background }]}
              onPress={() => setGuests(Math.max(1, guests - 1))}
            >
              <Minus size={20} color={colors.text} />
            </TouchableOpacity>
            
            <Text style={[styles.guestsCount, { color: colors.text }]}>{guests}</Text>
            
            <TouchableOpacity
              style={[styles.guestsButton, { backgroundColor: colors.background }]}
              onPress={() => setGuests(Math.min(10, guests + 1))}
            >
              <Plus size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.guestsCloseButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowGuestsModal(false)}
          >
            <Text style={styles.guestsCloseButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

const renderHotelCard = (hotel) => {
  const hasDiscount = hotel.originalPrice && hotel.originalPrice > hotel.price;
  const nights = getNightsBetween();
  const totalPrice = hotel.price * nights;
  
  return (
    <TouchableOpacity
      key={hotel.id}
      style={[styles.hotelCard, { backgroundColor: colors.card }]}
      onPress={() => router.push({
        pathname: '/bookings/detail',
        params: {
          id: hotel.id,
          name: hotel.name,
          image: hotel.image,
          price: String(hotel.price),
          currency: '$',
          description: hotel.description,
          rating: String(hotel.rating),
          reviews: String(hotel.reviews),
          location: hotel.location,
          checkInTime: hotel.checkInTime,
          checkOutTime: hotel.checkOutTime,
          roomType: hotel.roomType,
          features: JSON.stringify(hotel.amenities),
          highlights: JSON.stringify(hotel.highlights),
          type: 'hotel'
        }
      })}
    >
        <View style={styles.imageContainer}>
        <Image source={{ uri: hotel.image }} style={styles.hotelImage} />
        
        {hotel.featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
        
        {hasDiscount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{hotel.discount}%</Text>
          </View>
        )}

        {/* Updated favorite button */}
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => handleToggleFavorite(hotel)}
        >
          <Heart 
            size={16} 
            color={isItemSaved(hotel.id) ? '#EF4444' : 'white'} 
            fill={isItemSaved(hotel.id) ? '#EF4444' : 'transparent'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.hotelContent}>
          <View style={styles.hotelHeader}>
            <View style={styles.hotelInfo}>
              <Text style={[styles.hotelName, { color: colors.text }]} numberOfLines={2}>
                {hotel.name}
              </Text>
              <Text style={[styles.roomType, { color: colors.textSecondary }]}>
                {hotel.roomType}
              </Text>
            </View>
            <View style={styles.ratingContainer}>
              <Star size={14} color="#F59E0B" fill="#F59E0B" />
              <Text style={[styles.rating, { color: colors.text }]}>{hotel.rating}</Text>
              <Text style={[styles.reviews, { color: colors.textSecondary }]}>
                ({hotel.reviews})
              </Text>
            </View>
          </View>

          <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
            {hotel.description}
          </Text>

          <View style={styles.hotelDetails}>
            <View style={styles.detailItem}>
              <MapPin size={14} color={colors.textSecondary} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]} numberOfLines={1}>
                {hotel.location}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Clock size={14} color={colors.textSecondary} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                Check-in: {hotel.checkInTime}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Users size={14} color={colors.textSecondary} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                Up to {guests} guests
              </Text>
            </View>
          </View>

          <View style={styles.amenitiesContainer}>
            {hotel.amenities.slice(0, 4).map((amenity, index) => {
              const IconComponent = getAmenityIcon(amenity);
              return (
                <View key={index} style={[styles.amenityIcon, { backgroundColor: colors.primary + '20' }]}>
                  <IconComponent size={12} color={colors.primary} />
                </View>
              );
            })}
          </View>

          <View style={styles.highlightsContainer}>
            {hotel.highlights.slice(0, 2).map((highlight, index) => (
              <View key={index} style={[styles.highlightTag, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.highlightText, { color: colors.primary }]}>{highlight}</Text>
              </View>
            ))}
            {hotel.highlights.length > 2 && (
              <Text style={[styles.moreHighlights, { color: colors.textSecondary }]}>
                +{hotel.highlights.length - 2} more
              </Text>
            )}
          </View>

         <View style={styles.hotelFooter}>
          <View style={styles.priceContainer}>
            {hasDiscount && (
              <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
                ${hotel.originalPrice * nights}
              </Text>
            )}
            <Text style={[styles.price, { color: colors.primary }]}>
              ${totalPrice}
            </Text>
            <Text style={[styles.priceUnit, { color: colors.textSecondary }]}>
              total ({nights} {nights === 1 ? 'night' : 'nights'})
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.bookButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push({
              pathname: '/bookings/booking',
              params: {
                title: hotel.name,
                image: hotel.image,
                price: String(totalPrice),
                currency: '$',
                checkIn: checkInDate.toISOString(),
                checkOut: checkOutDate.toISOString(),
                guests: String(guests),
                type: 'hotel'
              }
            })}
          >
              <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hotel.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         hotel.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedFilter === 'all' || hotel.category === selectedFilter;
    
    return matchesSearch && matchesCategory;
  });

  const featuredHotels = filteredHotels.filter(hotel => hotel.featured);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Hotels</Text>
      
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
            <Search size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search hotels, locations, amenities..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Enhanced Date Selection */}
        <View style={styles.dateSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Travel Dates & Guests</Text>
          
          <View style={styles.dateContainer}>
            <TouchableOpacity
              style={[styles.dateCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => openCalendar('checkIn')}
            >
              <View style={styles.dateCardHeader}>
                <Calendar size={20} color={colors.primary} />
                <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>Check-in</Text>
              </View>
              <Text style={[styles.dateValue, { color: colors.text }]}>
                {formatDateDisplay(checkInDate)}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dateCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => openCalendar('checkOut')}
            >
              <View style={styles.dateCardHeader}>
                <Calendar size={20} color={colors.primary} />
                <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>Check-out</Text>
              </View>
              <Text style={[styles.dateValue, { color: colors.text }]}>
                {formatDateDisplay(checkOutDate)}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.guestsCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => setShowGuestsModal(true)}
          >
            <View style={styles.dateCardHeader}>
              <Users size={20} color={colors.primary} />
              <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>Guests</Text>
            </View>
            <Text style={[styles.dateValue, { color: colors.text }]}>
              {guests} {guests === 1 ? 'guest' : 'guests'}
            </Text>
          </TouchableOpacity>
          
          <View style={[styles.durationInfo, { backgroundColor: colors.inputBackground }]}>
            <Text style={[styles.durationText, { color: colors.primary }]}>
              {getNightsBetween()} {getNightsBetween() === 1 ? 'night' : 'nights'} stay
            </Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {hotelCategories.map((category) => (
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

        {/* Featured Hotels */}
        {featuredHotels.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Hotels</Text>
            {featuredHotels.map(renderHotelCard)}
          </View>
        )}

        {/* All Hotels */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {selectedFilter === 'all' ? 'All Hotels' : `${hotelCategories.find(cat => cat.id === selectedFilter)?.title} Hotels`} ({filteredHotels.length})
            </Text>
            <TouchableOpacity>
              <Text style={[styles.sortText, { color: colors.primary }]}>Sort by Rating</Text>
            </TouchableOpacity>
          </View>
          
          {filteredHotels.length > 0 ? (
            filteredHotels.map(renderHotelCard)
          ) : (
            <View style={styles.emptyState}>
              <MapPin size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No Hotels Found</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Try adjusting your search or category filters
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Date Pickers */}
      {Platform.OS === 'android' && showCheckInPicker && (
        <DateTimePicker
          value={checkInDate}
          mode="date"
          display="default"
          onChange={onCheckInDateChange}
          minimumDate={new Date()}
        />
      )}

      {Platform.OS === 'android' && showCheckOutPicker && (
        <DateTimePicker
          value={checkOutDate}
          mode="date"
          display="default"
          onChange={onCheckOutDateChange}
          minimumDate={checkInDate}
        />
      )}

      {/* Custom Calendar for iOS */}
      {Platform.OS === 'ios' && renderCalendar()}

      {/* Guests Modal */}
      {renderGuestsModal()}
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

  // Updated Date Section Styles
  dateSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  dateCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 8,
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  guestsCard: {
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  durationInfo: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  durationText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Rest of your original styles
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
    paddingBottom: 10,
    paddingTop: 10
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
  hotelCard: {
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
  hotelImage: {
    width: '100%',
    height: 200,
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
  hotelContent: {
    padding: 16,
  },
  hotelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  hotelInfo: {
    flex: 1,
    marginRight: 12,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 24,
  },
  roomType: {
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
  hotelDetails: {
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
  amenitiesContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  amenityIcon: {
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

  // Modal styles from new implementation
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    width: '90%',
    borderRadius: 16,
    padding: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarNavButton: {
    padding: 8,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  calendarWeekdays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  calendarWeekday: {
    fontSize: 12,
    fontWeight: '500',
    width: 32,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  calendarDayText: {
    fontSize: 14,
  },
  calendarCloseButton: {
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  calendarCloseButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  guestsContainer: {
    width: '80%',
    borderRadius: 16,
    padding: 20,
  },
  guestsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  guestsSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  guestsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestsCount: {
    fontSize: 24,
    fontWeight: '600',
  },
  guestsCloseButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  guestsCloseButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});