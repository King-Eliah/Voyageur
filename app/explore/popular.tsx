import { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useData } from '@/contexts/DataContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, Filter, Star, Heart, MapPin } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function PopularDestinationsScreen() {
  const { colors } = useTheme();
  const { addSavedItem, removeSavedItem, isItemSaved } = useData();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');

  const popularDestinations = [
    {
      id: 'bali-popular',
      title: 'Bali, Indonesia',
      image: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.7,
      price: 199,
      location: 'Indonesia',
      category: 'beach',
      popularity: 95,
    },
    {
      id: 'dubai-popular',
      title: 'Dubai, UAE',
      image: 'https://images.pexels.com/photos/162031/dubai-tower-arab-khalifa-162031.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.6,
      price: 449,
      location: 'United Arab Emirates',
      category: 'luxury',
      popularity: 92,
    },
    {
      id: 'maldives-popular',
      title: 'Maldives',
      image: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.9,
      price: 799,
      location: 'Maldives',
      category: 'beach',
      popularity: 90,
    },
    {
      id: 'iceland-popular',
      title: 'Iceland',
      image: 'https://images.pexels.com/photos/1433052/pexels-photo-1433052.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.8,
      price: 349,
      location: 'Iceland',
      category: 'nature',
      popularity: 88,
    },
    {
      id: 'thailand-popular',
      title: 'Phuket, Thailand',
      image: 'https://images.pexels.com/photos/1007657/pexels-photo-1007657.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.5,
      price: 159,
      location: 'Thailand',
      category: 'beach',
      popularity: 85,
    },
    {
      id: 'paris-popular',
      title: 'Paris, France',
      image: 'https://images.pexels.com/photos/161853/eiffel-tower-paris-france-tower-161853.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.7,
      price: 299,
      location: 'France',
      category: 'culture',
      popularity: 83,
    },
  ];

  const filters = [
    { id: 'all', title: 'All' },
    { id: 'beach', title: 'Beach' },
    { id: 'culture', title: 'Culture' },
    { id: 'nature', title: 'Nature' },
    { id: 'luxury', title: 'Luxury' },
  ];

  const sortOptions = [
    { id: 'popularity', title: 'Popularity' },
    { id: 'price-low', title: 'Price: Low to High' },
    { id: 'price-high', title: 'Price: High to Low' },
    { id: 'rating', title: 'Rating' },
  ];

  let filteredDestinations = popularDestinations.filter((destination) => {
    const matchesSearch =
      destination.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      destination.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || destination.category === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  filteredDestinations = filteredDestinations.sort((a, b) => {
    switch (sortBy) {
      case 'popularity':
        return b.popularity - a.popularity;
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const handleToggleFavorite = async (destination: any) => {
    const savedItem = {
      id: destination.id,
      type: 'destination' as const,
      title: destination.title,
      location: destination.location,
      image: destination.image,
      rating: destination.rating,
      price: destination.price,
    };

    if (isItemSaved(destination.id)) {
      await removeSavedItem(destination.id);
    } else {
      await addSavedItem(savedItem);
    }
  };

 const renderDestinationCard = (destination: any) => (
  <TouchableOpacity
    key={destination.id}
    style={[styles.destinationCard, { backgroundColor: colors.card }]}
    onPress={() => router.push({
      pathname: '/bookings/detail',
      params: {
        id: destination.id,
        title: destination.title,
        image: destination.image,
        price: String(destination.price),
        currency: '$',
        rating: String(destination.rating),
        location: destination.location,
        type: 'destination',
        description: `Popular destination with ${destination.popularity}% popularity rating`,
        highlights: JSON.stringify([
          `Ranked #${Math.floor(Math.random() * 10) + 1} in ${destination.location}`,
          'Best time to visit: All year round',
          'Top-rated by travelers'
        ])
      }
    })}
  >
       <Image source={{ uri: destination.image }} style={styles.destinationImage} />
    <TouchableOpacity 
      style={styles.heartButton} 
      onPress={() => handleToggleFavorite(destination)}
    >
      <Heart
        size={16}
        color={isItemSaved(destination.id) ? '#EF4444' : '#FFFFFF'}
        fill={isItemSaved(destination.id) ? '#EF4444' : 'transparent'}
      />
    </TouchableOpacity>
    <View style={styles.destinationContent}>
      <Text style={[styles.destinationTitle, { color: colors.text }]} numberOfLines={1}>
        {destination.title}
      </Text>
      <View style={styles.locationContainer}>
        <MapPin size={12} color={colors.textSecondary} />
        <Text style={[styles.location, { color: colors.textSecondary }]} numberOfLines={1}>
          {destination.location}
        </Text>
      </View>
      <View style={styles.bottomRow}>
        <View style={styles.ratingContainer}>
          <Star size={12} color="#FFD700" fill="#FFD700" />
          <Text style={[styles.rating, { color: colors.textSecondary }]}>{destination.rating}</Text>
        </View>
        <Text style={[styles.price, { color: colors.primary }]}>${destination.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Popular This Week</Text>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
        <Search size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search popular destinations..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterChip,
              {
                backgroundColor: selectedFilter === filter.id ? colors.primary : colors.card,
                borderColor: selectedFilter === filter.id ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Text
              style={[
                styles.filterText,
                { color: selectedFilter === filter.id ? '#FFFFFF' : colors.text },
              ]}
            >
              {filter.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortScroll}>
        {sortOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.sortChip,
              {
                backgroundColor: sortBy === option.id ? colors.primary : colors.card,
                borderColor: sortBy === option.id ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setSortBy(option.id)}
          >
            <Text
              style={[
                styles.sortText,
                { color: sortBy === option.id ? '#FFFFFF' : colors.text },
              ]}
            >
              {option.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.destinationsList} showsVerticalScrollIndicator={false}>
        <View style={styles.gridContainer}>
          {filteredDestinations.map((destination) => renderDestinationCard(destination))}
        </View>
      </ScrollView>
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
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  filtersScroll: {
      paddingLeft: 20,
  marginBottom: 16,
  flexGrow: 0,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  sortScroll: {
     paddingLeft: 20,
  marginBottom: 16,
  flexGrow: 0,
  },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  sortText: {
    fontSize: 12,
    fontWeight: '500',
  },
  destinationsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  destinationCard: {
    width: (width - 52) / 2,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  destinationImage: {
    width: '100%',
    height: 120,
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  destinationContent: {
    padding: 12,
  },
  destinationTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 12,
    marginLeft: 4,
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    marginLeft: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '600',
  },
});
