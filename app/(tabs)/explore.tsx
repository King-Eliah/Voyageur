import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, TextInput, FlatList, Dimensions } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useData } from '@/contexts/DataContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, Plane, Car, Camera, Star, Heart, Filter } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

const { width } = Dimensions.get('window');

export default function ExploreScreen() {
  const { colors } = useTheme();
  const { addSavedItem, removeSavedItem, isItemSaved } = useData();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: '1', title: 'Hotels', icon: MapPin, color: '#3B82F6' },
    { id: '2', title: 'Flights', icon: Plane, color: '#10B981' },
    { id: '3', title: 'Cars', icon: Car, color: '#F59E0B' },
    { id: '4', title: 'Activities', icon: Camera, color: '#EF4444' },
  ];

  const featuredDestinations = [
    {
      id: '1',
      title: 'Santorini, Greece',
      image: 'https://images.pexels.com/photos/161815/santorini-oia-greece-water-161815.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      price: '$299',
      description: 'Stunning sunsets and white architecture',
    },
    {
      id: '2',
      title: 'Kyoto, Japan',
      image: 'https://images.pexels.com/photos/402028/pexels-photo-402028.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.8,
      price: '$399',
      description: 'Ancient temples and cherry blossoms',
    },
    {
      id: '3',
      title: 'Machu Picchu, Peru',
      image: 'https://images.pexels.com/photos/259967/pexels-photo-259967.jpeg?auto=compress&cs=tinysrgb&w=400',
      rating: 4.9,
      price: '$599',
      description: 'Ancient Incan citadel in the clouds',
    },
  ];

  const popularThisWeek = [
    {
      id: '1',
      title: 'Bali, Indonesia',
      image: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.7,
      price: '$199',
    },
    {
      id: '2',
      title: 'Dubai, UAE',
      image: 'https://images.pexels.com/photos/162031/dubai-tower-arab-khalifa-162031.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.6,
      price: '$449',
    },
    {
      id: '3',
      title: 'Maldives',
      image: 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.9,
      price: '$799',
    },
    {
      id: '4',
      title: 'Iceland',
      image: 'https://images.pexels.com/photos/1433052/pexels-photo-1433052.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.8,
      price: '$349',
    },
  ];

  const recommendedForYou = [
    {
      id: '1',
      title: 'Swiss Alps',
      image: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.9,
      price: '$599',
    },
    {
      id: '2',
      title: 'Tuscany, Italy',
      image: 'https://images.pexels.com/photos/1701595/pexels-photo-1701595.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.7,
      price: '$399',
    },
    {
      id: '3',
      title: 'Norwegian Fjords',
      image: 'https://images.pexels.com/photos/1559821/pexels-photo-1559821.jpeg?auto=compress&cs=tinysrgb&w=300',
      rating: 4.8,
      price: '$499',
    },
  ];

  const handleCategoryPress = (category: any) => {
    switch (category.title) {
      case 'Hotels':
        router.push('/bookings/hotels');
        break;
      case 'Flights':
        router.push('/bookings/flights');
        break;
      case 'Cars':
        router.push('/bookings/cars');
        break;
      case 'Activities':
        router.push('/bookings/activities');
        break;
    }
  };

  const handleToggleFavorite = async (item: any, type: 'destination' | 'hotel' | 'attraction') => {
    const savedItem = {
      id: item.id,
      type,
      title: item.title,
      location: item.title, // Using title as location for simplicity
      image: item.image,
      rating: item.rating,
      price: parseInt(item.price?.replace('$', '') || '0'),
    };

    if (isItemSaved(item.id)) {
      await removeSavedItem(item.id);
    } else {
      await addSavedItem(savedItem);
    }
  };

 const renderPopularItem = ({ item }: { item: any }) => (
  <TouchableOpacity 
    style={[styles.popularCard, { backgroundColor: colors.card }]}
    onPress={() => router.push({
      pathname: '/bookings/detail',
      params: {
        id: item.id,
        title: item.title,
        image: item.image,
        price: item.price.replace('$', ''),
        currency: '$',
        rating: String(item.rating),
        location: item.title, // Using title as location for simplicity
        type: 'destination',
        description: item.description || 'Popular destination with great reviews',
        highlights: JSON.stringify([
          `Ranked #${Math.floor(Math.random() * 10) + 1} in ${item.title}`,
          'Best time to visit: All year round',
          'Top-rated by travelers'
        ])
      }
    })}
  >
    <Image source={{ uri: item.image }} style={styles.popularImage} />
    <View style={styles.popularInfo}>
      <Text style={[styles.popularTitle, { color: colors.text }]} numberOfLines={1}>
        {item.title}
      </Text>
      <View style={styles.popularMeta}>
        <View style={styles.ratingContainer}>
          <Star size={12} color="#FFD700" fill="#FFD700" />
          <Text style={[styles.rating, { color: colors.textSecondary }]}>{item.rating}</Text>
        </View>
        <Text style={[styles.price, { color: colors.primary }]}>{item.price}</Text>
      </View>
    </View>
    <TouchableOpacity 
      style={styles.heartButton}
      onPress={() => handleToggleFavorite(item, 'destination')}
    >
      <Heart 
        size={16} 
        color={isItemSaved(item.id) ? '#EF4444' : colors.textSecondary} 
        fill={isItemSaved(item.id) ? '#EF4444' : 'transparent'}
      />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Explore</Text>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Where do you want to go?"
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>     Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryCard, { backgroundColor: colors.card }]}
                onPress={() => handleCategoryPress(category)}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                  <category.icon size={24} color={category.color} />
                </View>
                <Text style={[styles.categoryTitle, { color: colors.text }]}>{category.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Destinations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Destinations</Text>
            <TouchableOpacity onPress={() => router.push('/explore/featured')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
           {featuredDestinations.map((destination) => (
  <TouchableOpacity
    key={destination.id}
    style={[styles.featuredCard, { backgroundColor: colors.card }]}
    onPress={() => router.push({
      pathname: '/bookings/detail',
      params: {
        id: destination.id,
        title: destination.title,
        image: destination.image,
        price: destination.price.replace('$', ''),
        currency: '$',
        rating: String(destination.rating),
        location: destination.title,
        type: 'destination',
        description: destination.description,
        highlights: JSON.stringify([
          'Featured destination',
          'Highly rated by travelers',
          'Unique cultural experience'
        ])
      }
    })}
  >
                <Image source={{ uri: destination.image }} style={styles.featuredImage} />
                <View style={styles.featuredOverlay}>
                  <TouchableOpacity 
                    style={styles.heartButton}
                    onPress={() => handleToggleFavorite(destination, 'destination')}
                  >
                    <Heart 
                      size={20} 
                      color={isItemSaved(destination.id) ? '#EF4444' : '#FFFFFF'} 
                      fill={isItemSaved(destination.id) ? '#EF4444' : 'transparent'}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.featuredInfo}>
                  <Text style={[styles.featuredTitle, { color: colors.text }]}>{destination.title}</Text>
                  <Text style={[styles.featuredDescription, { color: colors.textSecondary }]} numberOfLines={2}>
                    {destination.description}
                  </Text>
                  <View style={styles.featuredMeta}>
                    <View style={styles.ratingContainer}>
                      <Star size={14} color="#FFD700" fill="#FFD700" />
                      <Text style={[styles.rating, { color: colors.textSecondary }]}>{destination.rating}</Text>
                    </View>
                    <Text style={[styles.price, { color: colors.primary }]}>{destination.price}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Popular This Week */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Popular This Week</Text>
            <TouchableOpacity onPress={() => router.push('/explore/popular')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={popularThisWeek}
            renderItem={renderPopularItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.popularRow}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Recommended for You */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recommended for You</Text>
            <TouchableOpacity onPress={() => router.push('/explore/recommended')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {recommendedForYou.map((item) => (
               <TouchableOpacity
    key={item.id}
    style={[styles.recommendedCard, { backgroundColor: colors.card }]}
    onPress={() => router.push({
      pathname: '/bookings/detail',
      params: {
        id: item.id,
        title: item.title,
        image: item.image,
        price: item.price.replace('$', ''),
        currency: '$',
        rating: String(item.rating),
        location: item.title,
        type: 'destination',
        description: 'Recommended based on your preferences',
        highlights: JSON.stringify([
          'Personalized recommendation',
          'Matches your travel style',
          'Popular with similar travelers'
        ])
      }
    })}
  >
                <Image source={{ uri: item.image }} style={styles.recommendedImage} />
                <View style={styles.recommendedInfo}>
                  <Text style={[styles.recommendedTitle, { color: colors.text }]}>{item.title}</Text>
                  <View style={styles.recommendedMeta}>
                    <View style={styles.ratingContainer}>
                      <Star size={12} color="#FFD700" fill="#FFD700" />
                      <Text style={[styles.rating, { color: colors.textSecondary }]}>{item.rating}</Text>
                    </View>
                    <Text style={[styles.price, { color: colors.primary }]}>{item.price}</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.heartButton}
                  onPress={() => handleToggleFavorite(item, 'destination')}
                >
                  <Heart 
                    size={16} 
                    color={isItemSaved(item.id) ? '#EF4444' : colors.textSecondary} 
                    fill={isItemSaved(item.id) ? '#EF4444' : 'transparent'}
                  />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
   
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoriesScroll: {
    paddingLeft: 20,
    paddingBottom: 7,
    paddingTop: 7
  },
  categoryCard: {
    alignItems: 'center',
    padding: 16,
    marginRight: 16,
    borderRadius: 16,
    width: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  horizontalScroll: {
    paddingLeft: 20,
  },
  featuredCard: {
    width: 280,
    marginRight: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featuredImage: {
    width: '100%',
    height: 160,
  },
  featuredOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  featuredInfo: {
    padding: 16,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  featuredDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  featuredMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  popularRow: {
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  popularCard: {
    width: (width - 52) / 2,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  popularImage: {
    width: '100%',
    height: 120,
  },
  popularInfo: {
    padding: 12,
  },
  popularTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  popularMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recommendedCard: {
    width: 200,
    marginRight: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  recommendedImage: {
    width: '100%',
    height: 120,
  },
  recommendedInfo: {
    padding: 12,
  },
  recommendedTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  recommendedMeta: {
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
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});