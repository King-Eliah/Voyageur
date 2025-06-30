import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert,
  Platform,
  Modal,
  Dimensions,
  StatusBar
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { ChevronLeft, ChevronRight, Plus, Minus, Calendar, MapPin, Users, Clock, Car, Bed } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

type BookingType = 'hotel' | 'activity' | 'car';

const { width, height } = Dimensions.get('window');

export default function BookingScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { title, image, price, type = 'hotel' } = useLocalSearchParams();
  
  const [bookingType, setBookingType] = useState<BookingType>(type as BookingType);
  const [location, setLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000));
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);
  const [showCustomCalendar, setShowCustomCalendar] = useState(false);
  const [activeCalendar, setActiveCalendar] = useState('checkIn');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [carClass, setCarClass] = useState('Economy');
  const [pickupTime, setPickupTime] = useState('10:00 AM');
  const [returnTime, setReturnTime] = useState('10:00 AM');
  const [driverAge, setDriverAge] = useState('25+');
  const [activityCategory, setActivityCategory] = useState('All');
  
  // Modal states
  const [showGuestsModal, setShowGuestsModal] = useState(false);
  const [showRoomsModal, setShowRoomsModal] = useState(false);
  const [showCarClassModal, setShowCarClassModal] = useState(false);
  const [showDriverAgeModal, setShowDriverAgeModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const getBookingTypeTitle = () => {
    switch(bookingType) {
      case 'hotel': return 'Book Hotel';
      case 'activity': return 'Book Activity';
      case 'car': return 'Book Car';
      default: return 'Book Service';
    }
  };

  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateFull = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getNightsBetween = () => {
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const nightsDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return nightsDiff;
  };

  const openCalendar = (type: string) => {
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

  const onCheckInDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowCheckInPicker(false);
    if (selectedDate) {
      setCheckInDate(selectedDate);
      if (selectedDate >= checkOutDate) {
        setCheckOutDate(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000));
      }
    }
  };

  const onCheckOutDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowCheckOutPicker(false);
    if (selectedDate) {
      setCheckOutDate(selectedDate);
    }
  };

  const handleCalendarDateSelect = (date: Date) => {
    if (activeCalendar === 'checkIn') {
      setCheckInDate(date);
      if (date >= checkOutDate) {
        setCheckOutDate(new Date(date.getTime() + 24 * 60 * 60 * 1000));
      }
    } else {
      setCheckOutDate(date);
    }
    setShowCustomCalendar(false);
  };

  const handleSearch = () => {
    if (!location) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    if (bookingType === 'hotel' && !checkOutDate) {
      Alert.alert('Error', 'Please select check-out date');
      return;
    }
    
    router.push({
      pathname: '/bookings/results',
      params: {
        type: bookingType,
        location,
        destination,
        checkInDate: checkInDate.toISOString(),
        checkOutDate: checkOutDate.toISOString(),
        guests: guests.toString(),
        rooms: rooms.toString(),
        carClass,
        pickupTime,
        returnTime,
        driverAge,
        activityCategory
      },
    });
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

    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDay} />);
    }

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
                style={[styles.calendarNavButton, { backgroundColor: colors.background }]}
              >
                <ChevronLeft size={24} color={colors.text} />
              </TouchableOpacity>
              
              <Text style={[styles.calendarTitle, { color: colors.text }]}>
                {monthNames[currentMonth]} {currentYear}
              </Text>
              
              <TouchableOpacity
                onPress={() => setCalendarDate(new Date(currentYear, currentMonth + 1, 1))}
                style={[styles.calendarNavButton, { backgroundColor: colors.background }]}
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
          <Text style={[styles.guestsTitle, { color: colors.text }]}>
            {bookingType === 'activity' ? 'Participants' : 'Guests'}
          </Text>
          
          <View style={styles.guestsSelector}>
            <TouchableOpacity
              style={[styles.guestsButton, { backgroundColor: colors.background }]}
              onPress={() => setGuests(Math.max(1, guests - 1))}
            >
              <Minus size={20} color={colors.text} />
            </TouchableOpacity>
            
            <View style={styles.guestsCountContainer}>
              <Text style={[styles.guestsCount, { color: colors.text }]}>{guests}</Text>
              <Text style={[styles.guestsLabel, { color: colors.textSecondary }]}>
                {bookingType === 'activity' 
                  ? (guests === 1 ? 'Person' : 'People')
                  : (guests === 1 ? 'Guest' : 'Guests')
                }
              </Text>
            </View>
            
            <TouchableOpacity
              style={[styles.guestsButton, { backgroundColor: colors.background }]}
              onPress={() => setGuests(Math.min(10, guests + 1))}
            >
              <Plus size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.modalActionButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowGuestsModal(false)}
          >
            <Text style={styles.modalActionButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderSelectModal = (visible: boolean, onClose: () => void, title: string, options: string[], selectedValue: string, onSelect: (value: string) => void) => (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={[styles.selectModalContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.selectModalTitle, { color: colors.text }]}>{title}</Text>
          <ScrollView style={styles.selectOptionsContainer}>
            {options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.selectOption,
                  { 
                    backgroundColor: selectedValue === option ? 
                      `${colors.primary}20` : 'transparent',
                    borderColor: selectedValue === option ? 
                      colors.primary : colors.border
                  }
                ]}
                onPress={() => {
                  onSelect(option);
                  onClose();
                }}
              >
                <Text style={[
                  styles.selectOptionText, 
                  { 
                    color: selectedValue === option ? colors.primary : colors.text,
                    fontWeight: selectedValue === option ? '600' : '400'
                  }
                ]}>
                  {option}
                </Text>
                {selectedValue === option && (
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const BookingTypeTab = ({ type, label, icon }: { type: BookingType, label: string, icon: any }) => {
    const isActive = bookingType === type;
    const IconComponent = icon;
    
    return (
      <TouchableOpacity 
        style={[
          styles.bookingTab,
          { 
            backgroundColor: isActive ? colors.primary : colors.background,
            borderColor: isActive ? colors.primary : colors.border
          }
        ]}
        onPress={() => setBookingType(type)}
      >
        <IconComponent 
          size={20} 
          color={isActive ? '#FFFFFF' : colors.textSecondary} 
        />
        <Text style={[
          styles.bookingTabText,
          { color: isActive ? '#FFFFFF' : colors.textSecondary }
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const InputField = ({ label, placeholder, value, onChangeText, icon }: any) => (
    <View style={[styles.modernInputContainer, { backgroundColor: colors.card }]}>
      <View style={styles.inputLabelRow}>
        {icon}
        <Text style={[styles.modernInputLabel, { color: colors.textSecondary }]}>
          {label}
        </Text>
      </View>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        style={[styles.modernTextInput, { color: colors.text }]}
      />
    </View>
  );

  const DateCard = ({ label, date, onPress, showTime = false, time }: any) => (
    <TouchableOpacity 
      style={[styles.modernDateCard, { backgroundColor: colors.card }]}
      onPress={onPress}
    >
      <View style={styles.dateCardHeader}>
        <Calendar size={20} color={colors.primary} />
        <Text style={[styles.dateCardLabel, { color: colors.textSecondary }]}>
          {label}
        </Text>
      </View>
      <Text style={[styles.dateCardValue, { color: colors.text }]}>
        {formatDateDisplay(date)}
      </Text>
      {showTime && (
        <Text style={[styles.dateCardTime, { color: colors.textSecondary }]}>
          {time}
        </Text>
      )}
    </TouchableOpacity>
  );

  const OptionCard = ({ label, value, onPress, icon }: any) => (
    <TouchableOpacity 
      style={[styles.modernOptionCard, { backgroundColor: colors.card }]}
      onPress={onPress}
    >
      <View style={styles.optionCardHeader}>
        {icon}
        <Text style={[styles.optionCardLabel, { color: colors.textSecondary }]}>
          {label}
        </Text>
      </View>
      <Text style={[styles.optionCardValue, { color: colors.text }]}>
        {value}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={colors.background} 
      />
      
      {/* Modern Header */}
      <View style={[styles.modernHeader, { backgroundColor: colors.background }]}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.card }]}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.modernHeaderTitle, { color: colors.text }]}>
            {getBookingTypeTitle()}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Find your perfect match
          </Text>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Booking Type Selection */}
        <View style={styles.bookingTypeContainer}>
          <BookingTypeTab type="hotel" label="Hotels" icon={Bed} />
          <BookingTypeTab type="car" label="Cars" icon={Car} />
          <BookingTypeTab type="activity" label="Activities" icon={MapPin} />
        </View>

        {/* Dynamic Content */}
        <View style={styles.formContainer}>
          {bookingType === 'hotel' && (
            <>
              <InputField
                label="Destination"
                placeholder="Where do you want to stay?"
                value={location}
                onChangeText={setLocation}
                icon={<MapPin size={16} color={colors.primary} />}
              />

              <View style={styles.dateRowContainer}>
                <DateCard
                  label="Check-in"
                  date={checkInDate}
                  onPress={() => openCalendar('checkIn')}
                />
                <DateCard
                  label="Check-out"
                  date={checkOutDate}
                  onPress={() => openCalendar('checkOut')}
                />
              </View>

              {getNightsBetween() > 0 && (
                <View style={[styles.nightsInfo, { backgroundColor: `${colors.primary}15` }]}>
                  <Text style={[styles.nightsText, { color: colors.primary }]}>
                    {getNightsBetween()} {getNightsBetween() === 1 ? 'night' : 'nights'} stay
                  </Text>
                </View>
              )}

              <View style={styles.optionsRow}>
                <OptionCard
                  label="Guests"
                  value={`${guests} ${guests === 1 ? 'Guest' : 'Guests'}`}
                  onPress={() => setShowGuestsModal(true)}
                  icon={<Users size={16} color={colors.primary} />}
                />
                <OptionCard
                  label="Rooms"
                  value={`${rooms} ${rooms === 1 ? 'Room' : 'Rooms'}`}
                  onPress={() => setShowRoomsModal(true)}
                  icon={<Bed size={16} color={colors.primary} />}
                />
              </View>
            </>
          )}

          {bookingType === 'car' && (
            <>
              <InputField
                label="Pickup Location"
                placeholder="Where do you want to pickup?"
                value={location}
                onChangeText={setLocation}
                icon={<MapPin size={16} color={colors.primary} />}
              />

              <InputField
                label="Drop-off Location"
                placeholder="Where do you want to drop-off?"
                value={destination}
                onChangeText={setDestination}
                icon={<MapPin size={16} color={colors.primary} />}
              />

              <View style={styles.dateRowContainer}>
                <DateCard
                  label="Pickup"
                  date={checkInDate}
                  onPress={() => openCalendar('checkIn')}
                  showTime={true}
                  time={pickupTime}
                />
                <DateCard
                  label="Return"
                  date={checkOutDate}
                  onPress={() => openCalendar('checkOut')}
                  showTime={true}
                  time={returnTime}
                />
              </View>

              <View style={styles.optionsRow}>
                <OptionCard
                  label="Driver Age"
                  value={driverAge}
                  onPress={() => setShowDriverAgeModal(true)}
                  icon={<Users size={16} color={colors.primary} />}
                />
                <OptionCard
                  label="Car Class"
                  value={carClass}
                  onPress={() => setShowCarClassModal(true)}
                  icon={<Car size={16} color={colors.primary} />}
                />
              </View>
            </>
          )}

          {bookingType === 'activity' && (
            <>
              <InputField
                label="Destination"
                placeholder="Where do you want to explore?"
                value={location}
                onChangeText={setLocation}
                icon={<MapPin size={16} color={colors.primary} />}
              />

              <View style={styles.dateRowContainer}>
                <DateCard
                  label="Date"
                  date={checkInDate}
                  onPress={() => openCalendar('checkIn')}
                />
                <DateCard
                  label="Time"
                  date={checkInDate}
                  onPress={() => {}}
                  showTime={true}
                  time={pickupTime}
                />
              </View>

              <View style={styles.optionsRow}>
                <OptionCard
                  label="Participants"
                  value={`${guests} ${guests === 1 ? 'Person' : 'People'}`}
                  onPress={() => setShowGuestsModal(true)}
                  icon={<Users size={16} color={colors.primary} />}
                />
                <OptionCard
                  label="Category"
                  value={activityCategory}
                  onPress={() => setShowCategoryModal(true)}
                  icon={<MapPin size={16} color={colors.primary} />}
                />
              </View>
            </>
          )}
        </View>

        {/* Search Button */}
        <TouchableOpacity 
          style={[styles.modernSearchButton, { backgroundColor: colors.primary }]} 
          onPress={handleSearch}
        >
          <Text style={styles.modernSearchButtonText}>
            Search {bookingType === 'hotel' ? 'Hotels' : bookingType === 'car' ? 'Cars' : 'Activities'}
          </Text>
          <ChevronRight size={20} color="#FFFFFF" />
        </TouchableOpacity>
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

      {/* Modals */}
      {renderCalendar()}
      {renderGuestsModal()}
      
      {renderSelectModal(
        showRoomsModal,
        () => setShowRoomsModal(false),
        'Select Rooms',
        ['1 Room', '2 Rooms', '3 Rooms', '4 Rooms'],
        `${rooms} ${rooms === 1 ? 'Room' : 'Rooms'}`,
        (value) => setRooms(parseInt(value.split(' ')[0]))
      )}

      {renderSelectModal(
        showCarClassModal,
        () => setShowCarClassModal(false),
        'Select Car Class',
        ['Economy', 'Compact', 'Mid-size', 'Full-size', 'Premium', 'Luxury', 'SUV'],
        carClass,
        setCarClass
      )}

      {renderSelectModal(
        showDriverAgeModal,
        () => setShowDriverAgeModal(false),
        'Select Driver Age',
        ['18-24', '25+', '30+', '35+'],
        driverAge,
        setDriverAge
      )}

      {renderSelectModal(
        showCategoryModal,
        () => setShowCategoryModal(false),
        'Select Category',
        ['All', 'Adventure', 'Cultural', 'Food & Drink', 'Nature', 'Sightseeing', 'Sports'],
        activityCategory,
        setActivityCategory
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modernHeader: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitleContainer: {
    flex: 1,
  },
  modernHeaderTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  bookingTypeContainer: {
    flexDirection: 'row',
    marginBottom: 32,
    gap: 12,
  },
  bookingTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 8,
  },
  bookingTabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  formContainer: {
    gap: 20,
  },
  modernInputContainer: {
    borderRadius: 16,
    padding: 20,
  },
  inputLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  modernInputLabel: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modernTextInput: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
  },
  dateRowContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  modernDateCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
  },
  dateCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  dateCardLabel: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dateCardValue: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  dateCardTime: {
    fontSize: 14,
  },
  nightsInfo: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  nightsText: {
    fontSize: 14,
    fontWeight: '600',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modernOptionCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
  },
  optionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  optionCardLabel: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  optionCardValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  modernSearchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 16,
    marginTop: 32,
    gap: 8,
  },
  modernSearchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarContainer: {
    width: width - 40,
    borderRadius: 24,
    padding: 24,
    maxHeight: height * 0.8,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  calendarNavButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center' },
  calendarTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  calendarWeekdays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  calendarWeekday: {
    width: 40,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  calendarDay: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  calendarDayText: {
    fontSize: 16,
    fontWeight: '500',
  },
  calendarCloseButton: {
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  calendarCloseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  guestsContainer: {
    width: width - 80,
    borderRadius: 24,
    padding: 24,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestsCountContainer: {
    alignItems: 'center',
  },
  guestsCount: {
    fontSize: 32,
    fontWeight: '600',
  },
  guestsLabel: {
    fontSize: 14,
  },
  modalActionButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalActionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  selectModalContainer: {
    width: width - 80,
    borderRadius: 24,
    padding: 24,
    maxHeight: height * 0.6,
  },
  selectModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  selectOptionsContainer: {
    maxHeight: height * 0.4,
  },
  selectOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectOptionText: {
    fontSize: 16,
  },
});