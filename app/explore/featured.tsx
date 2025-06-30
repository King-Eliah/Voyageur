import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useData } from '@/contexts/DataContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, Filter, Star, Heart, MapPin } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function FeaturedDestinationsScreen() {
  const { colors } = useTheme();
  const { addSavedItem, removeSavedItem, isItemSaved } = useData();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const featuredDestinations = [
    {
      id: 'santorini',
      title: 'Santorini, Greece',
      image: 'https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      price: 299,
      description: 'Stunning sunsets and white architecture overlooking the Aegean Sea',
      location: 'Cyclades, Greece',
      category: 'beach',
    },
    {
      id: 'kyoto',
      title: 'Kyoto, Japan',
      image: 'https://images.pexels.com/photos/402028/pexels-photo-402028.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      price: 399,
      description: 'Ancient temples, traditional gardens, and cherry blossoms',
      location: 'Kansai, Japan',
      category: 'culture',
    },
    {
      id: 'machu-picchu',
      title: 'Machu Picchu, Peru',
      image: 'https://images.pexels.com/photos/259967/pexels-photo-259967.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      price: 599,
      description: 'Ancient Incan citadel high in the Andes Mountains',
      location: 'Cusco, Peru',
      category: 'adventure',
    },
    {
      id: 'bali',
      title: 'Bali, Indonesia',
      image: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.7,
      price: 199,
      description: 'Tropical paradise with rice terraces and Hindu temples',
      location: 'Indonesia',
      category: 'beach',
    },
    {
      id: 'iceland',
      title: 'Reykjavik, Iceland',
      image: 'https://images.pexels.com/photos/1433052/pexels-photo-1433052.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      price: 449,
      description: 'Northern lights, geysers, and dramatic landscapes',
      location: 'Iceland',
      category: 'nature',
    },
    {
      id: 'dubai',
      title: 'Dubai, UAE',
      image: 'https://images.pexels.com/photos/162031/dubai-tower-arab-khalifa-162031.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.6,
      price: 549,
      description: 'Luxury shopping, ultramodern architecture, and desert adventures',
      location: 'United Arab Emirates',
      category: 'luxury',
    },
  ];

  const filters = [
    { id: 'all', title: 'All' },
    { id: 'beach', title: 'Beach' },
    { id: 'culture', title: 'Culture' },
    { id: 'adventure', title: 'Adventure' },
    { id: 'nature', title: 'Nature' },
    { id: 'luxury', title: 'Luxury' },
  ];

  const filteredDestinations = featuredDestinations.filter(destination => {
    const matchesSearch = destination.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         destination.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || destination.category === selectedFilter;
    return matchesSearch && matchesFilter;
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Featured Destinations</Text>
      </View>

      {/* Search */}
      <View style={[styles.searchContainer, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
        <Search size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search destinations..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterChip,
              {
                backgroundColor: selectedFilter === filter.id ? colors.primary : colors.card,
                borderColor: selectedFilter === filter.id ? colors.primary : colors.border,
              }
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Text
              style={[
                styles.filterText,
                { color: selectedFilter === filter.id ? '#FFFFFF' : colors.text }
              ]}
            >
              {filter.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Destinations List */}
      <ScrollView style={styles.destinationsList} showsVerticalScrollIndicator={false}>
        {filteredDestinations.map((destination) => (
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
      description: destination.description,
      rating: String(destination.rating),
      location: destination.location,
      type: 'destination'
    }
  })}
>
            <Image source={{ uri: destination.image }} style={styles.destinationImage} />
  
  <TouchableOpacity
    style={styles.heartButton}
    onPress={() => handleToggleFavorite(destination)}
  >
    <Heart 
      size={20} 
      color={isItemSaved(destination.id) ? '#EF4444' : '#FFFFFF'} 
      fill={isItemSaved(destination.id) ? '#EF4444' : 'transparent'}
    />
  </TouchableOpacity>
  
  <View style={styles.destinationContent}>
              <View style={styles.destinationHeader}>
                <Text style={[styles.destinationTitle, { color: colors.text }]}>{destination.title}</Text>
                <View style={styles.ratingContainer}>
                  <Star size={14} color="#FFD700" fill="#FFD700" />
                  <Text style={[styles.rating, { color: colors.text }]}>{destination.rating}</Text>
                </View>
              </View>
              
              <View style={styles.locationContainer}>
                <MapPin size={14} color={colors.textSecondary} />
                <Text style={[styles.location, { color: colors.textSecondary }]}>{destination.location}</Text>
              </View>
              
              <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
                {destination.description}
              </Text>
              
              <View style={styles.priceContainer}>
                <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>From</Text>
                <Text style={[styles.price, { color: colors.primary }]}>${destination.price}</Text>
                <Text style={[styles.priceUnit, { color: colors.textSecondary }]}>/person</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
  alignSelf: 'flex-start'
},
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  destinationsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  destinationCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  destinationImage: {
    width: '100%',
    height: 200,
  },
  heartButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  destinationContent: {
    padding: 16,
  },
  destinationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  destinationTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceUnit: {
    fontSize: 14,
    marginLeft: 4,
  },
});