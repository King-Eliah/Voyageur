import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useData } from '@/contexts/DataContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, Filter, Star, Heart, MapPin, Clock } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function RecommendedScreen() {
  const { colors } = useTheme();
  const { addSavedItem, removeSavedItem, isItemSaved } = useData();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const recommendedDestinations = [
    {
      id: 'swiss-alps',
      title: 'Swiss Alps',
      image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.9,
      price: 599,
      location: 'Switzerland',
      category: 'nature',
      reason: 'Based on your love for mountain destinations',
      bestTime: 'Jun - Sep',
    },
    {
      id: 'tuscany',
      title: 'Tuscany, Italy',
      image: 'https://images.pexels.com/photos/1701595/pexels-photo-1701595.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.7,
      price: 399,
      location: 'Italy',
      category: 'culture',
      reason: 'Perfect for wine and culture enthusiasts',
      bestTime: 'Apr - Oct',
    },
    {
      id: 'norwegian-fjords',
      title: 'Norwegian Fjords',
      image: 'https://images.pexels.com/photos/1559821/pexels-photo-1559821.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.8,
      price: 499,
      location: 'Norway',
      category: 'nature',
      reason: 'Stunning landscapes similar to your saved destinations',
      bestTime: 'May - Sep',
    },
    {
      id: 'morocco',
      title: 'Marrakech, Morocco',
      image: 'https://images.pexels.com/photos/2467558/pexels-photo-2467558.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.6,
      price: 249,
      location: 'Morocco',
      category: 'culture',
      reason: 'Exotic culture and architecture',
      bestTime: 'Oct - Apr',
    },
    {
      id: 'new-zealand',
      title: 'Queenstown, New Zealand',
      image: 'https://images.pexels.com/photos/1006965/pexels-photo-1006965.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.8,
      price: 699,
      location: 'New Zealand',
      category: 'adventure',
      reason: 'Adventure activities and stunning scenery',
      bestTime: 'Dec - Mar',
    },
    {
      id: 'costa-rica',
      title: 'Costa Rica',
      image: 'https://images.pexels.com/photos/1903702/pexels-photo-1903702.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.7,
      price: 349,
      location: 'Costa Rica',
      category: 'nature',
      reason: 'Biodiversity and eco-tourism',
      bestTime: 'Dec - Apr',
    },
  ];

  const filters = [
    { id: 'all', title: 'All' },
    { id: 'nature', title: 'Nature' },
    { id: 'culture', title: 'Culture' },
    { id: 'adventure', title: 'Adventure' },
    { id: 'budget', title: 'Budget Friendly' },
  ];

  const filteredDestinations = recommendedDestinations.filter(destination => {
    const matchesSearch = destination.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         destination.location.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesFilter = true;
    
    if (selectedFilter === 'budget') {
      matchesFilter = destination.price < 400;
    } else if (selectedFilter !== 'all') {
      matchesFilter = destination.category === selectedFilter;
    }
    
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
        <Text style={[styles.title, { color: colors.text }]}>Recommended for You</Text>
      </View>

      {/* Search */}
      <View style={[styles.searchContainer, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
        <Search size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search recommendations..."
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

      {/* Recommendations List */}
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
      rating: String(destination.rating),
      location: destination.location,
      type: 'destination',
      description: destination.reason,
      highlights: JSON.stringify([
        `Best time to visit: ${destination.bestTime}`,
        `Category: ${destination.category}`,
        'Personalized recommendation'
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
              
              <View style={[styles.reasonContainer, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.reasonText, { color: colors.primary }]}>{destination.reason}</Text>
              </View>
              
              <View style={styles.detailsRow}>
                <View style={styles.timeContainer}>
                  <Clock size={14} color={colors.textSecondary} />
                  <Text style={[styles.timeText, { color: colors.textSecondary }]}>Best: {destination.bestTime}</Text>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>From</Text>
                  <Text style={[styles.price, { color: colors.primary }]}>${destination.price}</Text>
                </View>
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
    height: 180,
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
    marginBottom: 12,
  },
  location: {
    fontSize: 14,
    marginLeft: 4,
  },
  reasonContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  reasonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    marginLeft: 4,
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
});