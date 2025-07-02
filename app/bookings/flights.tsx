import React, { useState } from 'react';
import { 
  ScrollView, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  Modal,
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Plane, 
  Calendar, 
  Users, 
  ArrowUpDown, 
  Clock,
  Wifi,
  Coffee,
  Luggage,
  Star
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function FlightBookingScreen() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  
  // Search form state
  const [tripType, setTripType] = useState('roundtrip'); // 'roundtrip' or 'oneway'
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [passengers, setPassengers] = useState(1);
  const [travelClass, setTravelClass] = useState('economy');
  
  // UI state
  const [showResults, setShowResults] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showPassengerModal, setShowPassengerModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showDepartureDateModal, setShowDepartureDateModal] = useState(false);
  const [showReturnDateModal, setShowReturnDateModal] = useState(false);

  // Mock flight data
  const flightResults = [
    {
      id: '1',
      airline: 'Delta Airlines',
      flightNumber: 'DL 1234',
      departure: { time: '08:30', airport: 'JFK', city: 'New York' },
      arrival: { time: '11:45', airport: 'LAX', city: 'Los Angeles' },
      duration: '5h 15m',
      price: 299,
      stops: 'Direct',
      amenities: ['wifi', 'meal', 'entertainment'],
      rating: 4.2
    },
    {
      id: '2',
      airline: 'American Airlines',
      flightNumber: 'AA 5678',
      departure: { time: '14:20', airport: 'JFK', city: 'New York' },
      arrival: { time: '17:50', airport: 'LAX', city: 'Los Angeles' },
      duration: '5h 30m',
      price: 275,
      stops: 'Direct',
      amenities: ['wifi', 'snack'],
      rating: 4.0
    },
    {
      id: '3',
      airline: 'United Airlines',
      flightNumber: 'UA 9012',
      departure: { time: '19:15', airport: 'JFK', city: 'New York' },
      arrival: { time: '22:35', airport: 'LAX', city: 'Los Angeles' },
      duration: '5h 20m',
      price: 320,
      stops: 'Direct',
      amenities: ['wifi', 'meal', 'entertainment', 'extra_legroom'],
      rating: 4.5
    }
  ];

  const travelClasses = [
    { id: 'economy', name: 'Economy', price: '+$0' },
    { id: 'premium', name: 'Premium Economy', price: '+$150' },
    { id: 'business', name: 'Business', price: '+$800' },
    { id: 'first', name: 'First Class', price: '+$1500' }
  ];

  // Date utility functions
  const formatDate = (date) => {
    if (!date) return null;
    const options = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };

  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  const handleSearch = () => {
    if (!departure || !destination || !departureDate) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }
    
    if (tripType === 'roundtrip' && !returnDate) {
      Alert.alert('Missing Information', 'Please select a return date');
      return;
    }
    
    setShowResults(true);
  };

  const swapLocations = () => {
    const temp = departure;
    setDeparture(destination);
    setDestination(temp);
  };

  const handleFlightSelect = (flight) => {
    setSelectedFlight(flight);
    // Navigate to booking confirmation or payment screen
    Alert.alert('Flight Selected', 'Proceeding to booking confirmation...');
  };

  const getAmenityIcon = (amenity) => {
    switch (amenity) {
      case 'wifi': return <Wifi size={16} color={colors.primary} />;
      case 'meal': case 'snack': return <Coffee size={16} color={colors.primary} />;
      case 'entertainment': return <Star size={16} color={colors.primary} />;
      case 'extra_legroom': return <Luggage size={16} color={colors.primary} />;
      default: return null;
    }
  };

  const handleDateSelect = (date, isReturn = false) => {
    if (isReturn) {
      setReturnDate(date);
      setShowReturnDateModal(false);
    } else {
      setDepartureDate(date);
      setShowDepartureDateModal(false);
      
      // If selecting departure date and it's after return date, clear return date
      if (returnDate && date > returnDate) {
        setReturnDate(null);
      }
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { 
        backgroundColor: colors.background,
        borderBottomColor: colors.border || (isDark ? '#333' : '#f0f0f0')
      }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Book Flight</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {!showResults ? (
          // Search Form
          <View style={styles.searchContainer}>
            {/* Trip Type Toggle */}
            <View style={[styles.tripTypeContainer, { 
              backgroundColor: isDark ? colors.card : '#f8f9fa' 
            }]}>
              <TouchableOpacity
                style={[
                  styles.tripTypeButton,
                  { backgroundColor: tripType === 'roundtrip' ? colors.primary : 'transparent' }
                ]}
                onPress={() => setTripType('roundtrip')}
              >
                <Text style={[
                  styles.tripTypeText,
                  { color: tripType === 'roundtrip' ? '#fff' : colors.text }
                ]}>
                  Round Trip
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tripTypeButton,
                  { backgroundColor: tripType === 'oneway' ? colors.primary : 'transparent' }
                ]}
                onPress={() => setTripType('oneway')}
              >
                <Text style={[
                  styles.tripTypeText,
                  { color: tripType === 'oneway' ? '#fff' : colors.text }
                ]}>
                  One Way
                </Text>
              </TouchableOpacity>
            </View>

            {/* Location Inputs */}
            <View style={styles.locationContainer}>
              <View style={[styles.locationInputContainer, { backgroundColor: colors.card }]}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>From</Text>
                <TextInput
                  style={[styles.locationInput, { color: colors.text }]}
                  placeholder="Departure city"
                  placeholderTextColor={colors.textSecondary}
                  value={departure}
                  onChangeText={setDeparture}
                />
              </View>
              
              <View style={[styles.locationInputContainer, { backgroundColor: colors.card }]}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>To</Text>
                <TextInput
                  style={[styles.locationInput, { color: colors.text }]}
                  placeholder="Destination city"
                  placeholderTextColor={colors.textSecondary}
                  value={destination}
                  onChangeText={setDestination}
                />
              </View>
              
              <TouchableOpacity style={[styles.swapButton, { 
                backgroundColor: colors.card,
                shadowColor: isDark ? '#000' : '#000',
                elevation: isDark ? 8 : 3,
              }]} onPress={swapLocations}>
                <ArrowUpDown size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Date Inputs */}
            <View style={styles.dateContainer}>
              <TouchableOpacity 
                style={[styles.dateInput, { backgroundColor: colors.card }]}
                onPress={() => setShowDepartureDateModal(true)}
              >
                <Calendar size={20} color={colors.primary} />
                <View style={styles.dateTextContainer}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Departure</Text>
                  <Text style={[styles.dateText, { color: colors.text }]}>
                    {departureDate ? formatDate(departureDate) : 'Select date'}
                  </Text>
                </View>
              </TouchableOpacity>
              
              {tripType === 'roundtrip' && (
                <TouchableOpacity 
                  style={[styles.dateInput, { backgroundColor: colors.card }]}
                  onPress={() => setShowReturnDateModal(true)}
                >
                  <Calendar size={20} color={colors.primary} />
                  <View style={styles.dateTextContainer}>
                    <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Return</Text>
                    <Text style={[styles.dateText, { color: colors.text }]}>
                      {returnDate ? formatDate(returnDate) : 'Select date'}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            {/* Passengers and Class */}
            <View style={styles.passengerClassContainer}>
              <TouchableOpacity 
                style={[styles.passengerClassInput, { backgroundColor: colors.card }]}
                onPress={() => setShowPassengerModal(true)}
              >
                <Users size={20} color={colors.primary} />
                <View style={styles.passengerClassTextContainer}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Passengers</Text>
                  <Text style={[styles.passengerClassText, { color: colors.text }]}>
                    {passengers} {passengers === 1 ? 'Adult' : 'Adults'}
                  </Text>
                </View>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.passengerClassInput, { backgroundColor: colors.card }]}
                onPress={() => setShowClassModal(true)}
              >
                <Plane size={20} color={colors.primary} />
                <View style={styles.passengerClassTextContainer}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Class</Text>
                  <Text style={[styles.passengerClassText, { color: colors.text }]}>
                    {travelClasses.find(c => c.id === travelClass)?.name}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Search Button */}
            <TouchableOpacity 
              style={[styles.searchButton, { backgroundColor: colors.primary }]}
              onPress={handleSearch}
            >
              <Text style={styles.searchButtonText}>Search Flights</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Flight Results
          <View style={styles.resultsContainer}>
            <View style={styles.resultsHeader}>
              <Text style={[styles.resultsTitle, { color: colors.text }]}>
                {departure} → {destination}
              </Text>
              <Text style={[styles.resultsSubtitle, { color: colors.textSecondary }]}>
                {flightResults.length} flights found • {formatDate(departureDate)}
              </Text>
            </View>

            {flightResults.map((flight) => (
              <TouchableOpacity
                key={flight.id}
                style={[styles.flightCard, { 
                  backgroundColor: colors.card,
                  shadowColor: isDark ? '#000' : '#000',
                  elevation: isDark ? 8 : 4,
                }]}
                onPress={() => handleFlightSelect(flight)}
              >
                <View style={styles.flightHeader}>
                  <Text style={[styles.airline, { color: colors.text }]}>{flight.airline}</Text>
                  <Text style={[styles.flightNumber, { color: colors.textSecondary }]}>
                    {flight.flightNumber}
                  </Text>
                </View>

                <View style={styles.flightDetails}>
                  <View style={styles.timeContainer}>
                    <Text style={[styles.time, { color: colors.text }]}>{flight.departure.time}</Text>
                    <Text style={[styles.airport, { color: colors.textSecondary }]}>
                      {flight.departure.airport}
                    </Text>
                  </View>

                  <View style={styles.flightPath}>
                    <View style={styles.flightDuration}>
                      <Text style={[styles.duration, { color: colors.textSecondary }]}>
                        {flight.duration}
                      </Text>
                      <Text style={[styles.stops, { color: colors.primary }]}>{flight.stops}</Text>
                    </View>
                    <View style={[styles.flightLine, { backgroundColor: colors.border || (isDark ? '#444' : '#e0e0e0') }]} />
                    <Plane size={16} color={colors.primary} style={styles.planeIcon} />
                  </View>

                  <View style={styles.timeContainer}>
                    <Text style={[styles.time, { color: colors.text }]}>{flight.arrival.time}</Text>
                    <Text style={[styles.airport, { color: colors.textSecondary }]}>
                      {flight.arrival.airport}
                    </Text>
                  </View>
                </View>

                <View style={styles.flightFooter}>
                  <View style={styles.amenitiesContainer}>
                    {flight.amenities.map((amenity, index) => (
                      <View key={index} style={styles.amenityIcon}>
                        {getAmenityIcon(amenity)}
                      </View>
                    ))}
                    <View style={styles.ratingContainer}>
                      <Star size={14} color={colors.primary} />
                      <Text style={[styles.rating, { color: colors.textSecondary }]}>
                        {flight.rating}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={[styles.price, { color: colors.primary }]}>${flight.price}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Departure Date Modal */}
      <Modal visible={showDepartureDateModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Departure Date</Text>
            <ScrollView style={styles.dateScrollView}>
              {generateDateOptions().map((date, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateOption,
                    { backgroundColor: departureDate && date.toDateString() === departureDate.toDateString() ? 
                      (colors.primary + (isDark ? '40' : '20')) : 'transparent' }
                  ]}
                  onPress={() => handleDateSelect(date, false)}
                >
                  <Text style={[styles.dateOptionText, { color: colors.text }]}>
                    {formatDate(date)}
                  </Text>
                  <Text style={[styles.dateOptionDay, { color: colors.textSecondary }]}>
                    {date.toLocaleDateString('en-US', { year: 'numeric' })}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity 
              style={[styles.modalCloseButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowDepartureDateModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Return Date Modal */}
      <Modal visible={showReturnDateModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Return Date</Text>
            <ScrollView style={styles.dateScrollView}>
              {generateDateOptions()
                .filter(date => !departureDate || date > departureDate)
                .map((date, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateOption,
                    { backgroundColor: returnDate && date.toDateString() === returnDate.toDateString() ? 
                      (colors.primary + (isDark ? '40' : '20')) : 'transparent' }
                  ]}
                  onPress={() => handleDateSelect(date, true)}
                >
                  <Text style={[styles.dateOptionText, { color: colors.text }]}>
                    {formatDate(date)}
                  </Text>
                  <Text style={[styles.dateOptionDay, { color: colors.textSecondary }]}>
                    {date.toLocaleDateString('en-US', { year: 'numeric' })}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity 
              style={[styles.modalCloseButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowReturnDateModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Passenger Modal */}
      <Modal visible={showPassengerModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Passengers</Text>
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <TouchableOpacity
                key={num}
                style={[
                  styles.modalOption,
                  { backgroundColor: passengers === num ? 
                    (colors.primary + (isDark ? '40' : '20')) : 'transparent' }
                ]}
                onPress={() => {
                  setPassengers(num);
                  setShowPassengerModal(false);
                }}
              >
                <Text style={[styles.modalOptionText, { color: colors.text }]}>
                  {num} {num === 1 ? 'Adult' : 'Adults'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Class Modal */}
      <Modal visible={showClassModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Class</Text>
            {travelClasses.map((cls) => (
              <TouchableOpacity
                key={cls.id}
                style={[
                  styles.modalOption,
                  { backgroundColor: travelClass === cls.id ? 
                    (colors.primary + (isDark ? '40' : '20')) : 'transparent' }
                ]}
                onPress={() => {
                  setTravelClass(cls.id);
                  setShowClassModal(false);
                }}
              >
                <Text style={[styles.modalOptionText, { color: colors.text }]}>
                  {cls.name}
                </Text>
                <Text style={[styles.modalOptionPrice, { color: colors.textSecondary }]}>
                  {cls.price}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
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
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  searchContainer: {
    padding: 20,
  },
  tripTypeContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 12,
    padding: 4,
  },
  tripTypeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  tripTypeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  locationContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  locationInputContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  locationInput: {
    fontSize: 16,
    fontWeight: '500',
  },
  swapButton: {
    position: 'absolute',
    right: 20,
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1,
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  dateInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  dateTextContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
  },
  passengerClassContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  passengerClassInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  passengerClassTextContainer: {
    flex: 1,
  },
  passengerClassText: {
    fontSize: 16,
    fontWeight: '500',
  },
  searchButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    padding: 20,
  },
  resultsHeader: {
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resultsSubtitle: {
    fontSize: 14,
  },
  flightCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  flightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  airline: {
    fontSize: 16,
    fontWeight: '600',
  },
  flightNumber: {
    fontSize: 14,
  },
  flightDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeContainer: {
    alignItems: 'center',
    flex: 1,
  },
  time: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  airport: {
    fontSize: 12,
  },
  flightPath: {
    flex: 2,
    alignItems: 'center',
    position: 'relative',
  },
  flightDuration: {
    alignItems: 'center',
    marginBottom: 8,
  },
  duration: {
    fontSize: 12,
    marginBottom: 2,
  },
  stops: {
    fontSize: 10,
    fontWeight: '500',
  },
  flightLine: {
    height: 1,
    width: '100%',
    position: 'relative',
  },
  planeIcon: {
    position: 'absolute',
    top: -18,
  },
  flightFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amenityIcon: {
    marginRight: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 12,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalOptionPrice: {
    fontSize: 14,
  },
  dateScrollView: {
    maxHeight: 300,
  },
  dateOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  dateOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  dateOptionDay: {
    fontSize: 14,
  },
  modalCloseButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});