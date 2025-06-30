import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Modal,
  ScrollView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface SearchResult {
  id: string;
  title: string;
  image: string;
  price: number;
  rating: number;
  location: string;
  amenities?: string[];
  description: string;
  type: 'hotel' | 'car' | 'activity';
}

export default function ResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors } = useTheme();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Available amenities for filtering
  const allAmenities = [
    'WiFi', 'Pool', 'Gym', 'Spa', 'Breakfast', 
    'Parking', 'AC', 'Restaurant', 'Bar'
  ];

  // Mock data - would come from API in real app
  const mockResults: Record<string, SearchResult[]> = {
    hotel: [
      {
        id: '1',
        title: 'Grand Palace Hotel',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
        price: 150,
        rating: 4.5,
        location: 'Downtown',
        amenities: ['WiFi', 'Pool', 'Gym', 'Spa'],
        description: 'Luxury hotel in the heart of the city',
        type: 'hotel'
      },
      {
        id: '2',
        title: 'Beach Resort',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400',
        price: 220,
        rating: 4.8,
        location: 'Beachfront',
        amenities: ['WiFi', 'Pool', 'Restaurant', 'Bar'],
        description: 'Beautiful resort with ocean views',
        type: 'hotel'
      },
      {
        id: '3',
        title: 'Mountain Lodge',
        image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400',
        price: 180,
        rating: 4.3,
        location: 'Mountain',
        amenities: ['WiFi', 'Restaurant', 'Parking'],
        description: 'Cozy lodge with mountain views',
        type: 'hotel'
      },
    ],
    car: [
      {
        id: '4',
        title: 'Toyota Camry',
        image: 'https://images.unsplash.com/photo-1549399167-4d2b3e7c87ac?w=400',
        price: 45,
        rating: 4.3,
        location: 'Economy',
        amenities: ['AC', 'Bluetooth', 'GPS'],
        description: 'Reliable and fuel-efficient sedan',
        type: 'car'
      },
      {
        id: '5',
        title: 'BMW X5',
        image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400',
        price: 90,
        rating: 4.7,
        location: 'Luxury',
        amenities: ['AC', 'Leather', 'Premium Sound'],
        description: 'Luxury SUV with all the features',
        type: 'car'
      },
      {
        id: '6',
        title: 'Ford Mustang',
        image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=400',
        price: 75,
        rating: 4.5,
        location: 'Sports',
        amenities: ['AC', 'Convertible', 'Sport Mode'],
        description: 'Classic American muscle car',
        type: 'car'
      },
    ],
    activity: [
      {
        id: '7',
        title: 'City Walking Tour',
        image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400',
        price: 25,
        rating: 4.6,
        location: 'Historic District',
        amenities: ['Guide', '3 hours', 'Small group'],
        description: 'Explore the city\'s historic landmarks',
        type: 'activity'
      },
      {
        id: '8',
        title: 'Wine Tasting',
        image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400',
        price: 40,
        rating: 4.8,
        location: 'Vineyard',
        amenities: ['5 wines', 'Cheese plate', '2 hours'],
        description: 'Sample local wines with an expert',
        type: 'activity'
      },
      {
        id: '9',
        title: 'Hiking Adventure',
        image: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=400',
        price: 35,
        rating: 4.9,
        location: 'National Park',
        amenities: ['Guide', 'Lunch', '6 hours'],
        description: 'Guided hike through scenic trails',
        type: 'activity'
      },
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const searchType = params.type as string || 'hotel';
      setResults(mockResults[searchType] || []);
      setLoading(false);
    }, 1000);
  }, [params]);

  const handleBookNow = (item: SearchResult) => {
    router.push({
      pathname: '/bookings/payment',
      params: {
        id: item.id,
        title: item.title,
        image: item.image,
        price: item.price.toString(),
        type: item.type,
        location: item.location,
      },
    });
  };

  const filteredResults = results.filter(item => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Price filter
    const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
    
    // Rating filter
    const matchesRating = selectedRating === null || item.rating >= selectedRating;
    
    // Amenities filter
    const matchesAmenities = selectedAmenities.length === 0 || 
      (item.amenities && selectedAmenities.every(a => item.amenities.includes(a)));
    
    return matchesSearch && matchesPrice && matchesRating && matchesAmenities;
  });

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity) 
        : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setPriceRange([0, 500]);
    setSelectedRating(null);
    setSelectedAmenities([]);
  };

  const renderResultItem = ({ item }: { item: SearchResult }) => (
    <View style={[styles.resultCard, { backgroundColor: colors.card }]}>
      <Image source={{ uri: item.image }} style={styles.resultImage} />
      
      <View style={styles.resultContent}>
        <View style={styles.resultHeader}>
          <Text style={[styles.resultTitle, { color: colors.text }]}>{item.title}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={[styles.ratingText, { color: colors.text }]}>{item.rating}</Text>
          </View>
        </View>
        
        <Text style={[styles.locationText, { color: colors.textSecondary }]}>{item.location}</Text>
        <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>{item.description}</Text>
        
        {item.amenities && (
          <View style={styles.amenitiesContainer}>
            {item.amenities.slice(0, 3).map((amenity, index) => (
              <View key={index} style={[styles.amenityTag, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.amenityText, { color: colors.primary }]}>{amenity}</Text>
              </View>
            ))}
          </View>
        )}
        
        <View style={styles.priceRow}>
          <View>
            <Text style={[styles.priceText, { color: colors.text }]}>${item.price}</Text>
            <Text style={[styles.priceUnit, { color: colors.textSecondary }]}>
              {item.type === 'hotel' ? '/night' : item.type === 'car' ? '/day' : '/person'}
            </Text>
          </View>
          
          <TouchableOpacity
            style={[styles.bookButton, { backgroundColor: colors.primary }]}
            onPress={() => handleBookNow(item)}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const getResultsTitle = () => {
    const type = params.type as string || 'hotel';
    const location = params.location as string || 'your destination';
    return `${type.charAt(0).toUpperCase() + type.slice(1)}s in ${location}`;
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Searching...</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Finding the best options for you...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{getResultsTitle()}</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search and Filter Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search listings..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity 
          onPress={() => setShowFilters(true)}
          style={[styles.filterButton, { backgroundColor: colors.primary }]}
        >
          <Ionicons name="options" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Active Filters */}
      {(searchQuery || priceRange[0] > 0 || priceRange[1] < 500 || selectedRating || selectedAmenities.length > 0) && (
        <View style={styles.activeFiltersContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.activeFiltersScroll}
          >
            {searchQuery && (
              <View style={[styles.filterPill, { backgroundColor: colors.card }]}>
                <Text style={[styles.filterPillText, { color: colors.text }]}>Search: "{searchQuery}"</Text>
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            )}
            {(priceRange[0] > 0 || priceRange[1] < 500) && (
              <View style={[styles.filterPill, { backgroundColor: colors.card }]}>
                <Text style={[styles.filterPillText, { color: colors.text }]}>
                  ${priceRange[0]} - ${priceRange[1]}
                </Text>
                <TouchableOpacity onPress={() => setPriceRange([0, 500])}>
                  <Ionicons name="close" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            )}
            {selectedRating && (
              <View style={[styles.filterPill, { backgroundColor: colors.card }]}>
                <Text style={[styles.filterPillText, { color: colors.text }]}>
                  {selectedRating}+ stars
                </Text>
                <TouchableOpacity onPress={() => setSelectedRating(null)}>
                  <Ionicons name="close" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            )}
            {selectedAmenities.map(amenity => (
              <View key={amenity} style={[styles.filterPill, { backgroundColor: colors.card }]}>
                <Text style={[styles.filterPillText, { color: colors.text }]}>{amenity}</Text>
                <TouchableOpacity onPress={() => toggleAmenity(amenity)}>
                  <Ionicons name="close" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity onPress={clearFilters}>
              <Text style={[styles.clearFilters, { color: colors.primary }]}>Clear all</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* Results Count */}
      <View style={styles.resultsInfo}>
        <Text style={[styles.resultsCount, { color: colors.textSecondary }]}>
          {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'} found
        </Text>
      </View>

      {/* Results List */}
      {filteredResults.length > 0 ? (
        <FlatList
          data={filteredResults}
          renderItem={renderResultItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
          <Ionicons name="search" size={48} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No results found
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Try adjusting your search or filters
          </Text>
          <TouchableOpacity 
            style={[styles.clearButton, { backgroundColor: colors.primary }]}
            onPress={clearFilters}
          >
            <Text style={styles.clearButtonText}>Clear Filters</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Filters Modal */}
      <Modal
        visible={showFilters}
        animationType="slide"
        transparent={false}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Filters</Text>
            <TouchableOpacity onPress={() => setShowFilters(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.modalContent}
            contentContainerStyle={{ paddingBottom: 20 }} // Added padding to prevent cutoff
          >
            {/* Price Range Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Price Range</Text>
              <View style={styles.priceRangeDisplay}>
                <Text style={[styles.priceRangeText, { color: colors.text }]}>
                  ${priceRange[0]} - ${priceRange[1]}
                </Text>
              </View>
              <View style={styles.sliderContainer}>
                {/* In a real app, you would use a Slider component here */}
                <View style={[styles.sliderTrack, { backgroundColor: colors.border }]}>
                  <View 
                    style={[
                      styles.sliderFill, 
                      { 
                        backgroundColor: colors.primary,
                        left: `${(priceRange[0] / 500) * 100}%`,
                        width: `${((priceRange[1] - priceRange[0]) / 500) * 100}%`
                      }
                    ]}
                  />
                  <View 
                    style={[
                      styles.sliderThumb, 
                      { 
                        backgroundColor: colors.primary,
                        left: `${(priceRange[0] / 500) * 100}%`
                      }
                    ]}
                  />
                  <View 
                    style={[
                      styles.sliderThumb, 
                      { 
                        backgroundColor: colors.primary,
                        left: `${(priceRange[1] / 500) * 100}%`
                      }
                    ]}
                  />
                </View>
                <View style={styles.sliderLabels}>
                  <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>$0</Text>
                  <Text style={[styles.sliderLabel, { color: colors.textSecondary }]}>$500</Text>
                </View>
              </View>
            </View>

            {/* Rating Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Minimum Rating</Text>
              <View style={styles.ratingOptions}>
                {[1, 2, 3, 4, 5].map(rating => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.ratingOption,
                      { 
                        backgroundColor: selectedRating === rating ? colors.primary : colors.card,
                        borderColor: colors.border
                      }
                    ]}
                    onPress={() => setSelectedRating(selectedRating === rating ? null : rating)}
                  >
                    <Ionicons 
                      name="star" 
                      size={16} 
                      color={selectedRating === rating ? 'white' : '#FFD700'} 
                    />
                    <Text style={[
                      styles.ratingOptionText, 
                      { color: selectedRating === rating ? 'white' : colors.text }
                    ]}>
                      {rating}+
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Amenities Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Amenities</Text>
              <View style={styles.amenitiesGrid}>
                {allAmenities.map(amenity => (
                  <TouchableOpacity
                    key={amenity}
                    style={[
                      styles.amenityOption,
                      { 
                        backgroundColor: selectedAmenities.includes(amenity) ? colors.primary : colors.card,
                        borderColor: colors.border
                      }
                    ]}
                    onPress={() => toggleAmenity(amenity)}
                  >
                    <Text style={[
                      styles.amenityOptionText,
                      { color: selectedAmenities.includes(amenity) ? 'white' : colors.text }
                    ]}>
                      {amenity}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={[styles.modalFooter, { backgroundColor: colors.card }]}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.background }]}
              onPress={clearFilters}
            >
              <Text style={[styles.modalButtonText, { color: colors.text }]}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.modalButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
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
    paddingHorizontal: 20,
    paddingBottom: 12,
    height: 40, // Fixed height for the container
  },
  activeFiltersScroll: {
    gap: 8,
    alignItems: 'center',
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
  clearFilters: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultsInfo: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  resultsCount: {
    fontSize: 14,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  resultCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  resultImage: {
    width: '100%',
    height: 200,
  },
  resultContent: {
    padding: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 4,
  },
  locationText: {
    fontSize: 14,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    marginBottom: 12,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  amenityTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  amenityText: {
    fontSize: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  priceUnit: {
    fontSize: 14,
  },
  bookButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
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
    marginBottom: 16,
  },
  clearButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    paddingTop: 50,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  priceRangeDisplay: {
    alignItems: 'center',
    marginBottom: 16,
  },
  priceRangeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  sliderContainer: {
    marginBottom: 8,
  },
  sliderTrack: {
    height: 4,
    borderRadius: 2,
    position: 'relative',
    marginBottom: 8,
  },
  sliderFill: {
    height: '100%',
    borderRadius: 2,
    position: 'absolute',
  },
  sliderThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    top: -8,
    marginLeft: -10,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 12,
  },
  ratingOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  ratingOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  ratingOptionText: {
    fontSize: 14,
    marginLeft: 4,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  amenityOptionText: {
    fontSize: 14,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});