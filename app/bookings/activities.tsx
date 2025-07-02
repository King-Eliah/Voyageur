import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useData } from '@/contexts/DataContext'; // Added useData
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Camera, 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Star,
  ArrowLeft,
  Filter,
  Search,
  Mountain,
  Waves,
  Building,
  TreePine,
  Compass,
  Heart,
  Shield
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

interface Activity {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  currency: string;
  originalPrice?: number;
  rating: number;
  reviews: number;
  duration: string;
  location: string;
  category: string;
  provider: string;
  groupSize: string;
  highlights: string[];
  difficulty: 'easy' | 'moderate' | 'challenging';
  includes: string[];
  featured: boolean;
  discount?: number;
}

export default function ActivitiesScreen() {
  const { colors } = useTheme();
  const { addSavedItem, removeSavedItem, isItemSaved } = useData(); // Added favorites functions
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock activities data
  const activities: Activity[] = [
    {
      id: 'activity-1',
      title: 'City Walking Tour',
      description: 'Explore the historic downtown area with a knowledgeable local guide',
      image: 'https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg?auto=compress&cs=tinysrgb&w=400',
      price: 25,
      currency: '$',
      originalPrice: 35,
      rating: 4.8,
      reviews: 234,
      duration: '3 hours',
      location: 'Downtown District',
      category: 'tours',
      provider: 'City Tours Co.',
      groupSize: 'Up to 15 people',
      highlights: ['Historic landmarks', 'Local stories', 'Photo opportunities', 'Small group experience'],
      difficulty: 'easy',
      includes: ['Professional guide', 'Walking route map', 'Complimentary water'],
      featured: true,
      discount: 29
    },
    {
      id: 'activity-2',
      title: 'Mountain Hiking Adventure',
      description: 'Challenge yourself with breathtaking mountain trails and scenic viewpoints',
      image: 'https://images.pexels.com/photos/618848/pexels-photo-618848.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: 75,
      currency: '$',
      rating: 4.9,
      reviews: 156,
      duration: '6 hours',
      location: 'Mountain Range National Park',
      category: 'adventure',
      provider: 'Adventure Seekers',
      groupSize: 'Up to 8 people',
      highlights: ['Panoramic views', 'Wildlife spotting', 'Professional equipment', 'Lunch included'],
      difficulty: 'challenging',
      includes: ['Hiking guide', 'Safety equipment', 'Packed lunch', 'Transportation'],
      featured: false
    },
    {
      id: 'activity-3',
      title: 'Sunset Boat Cruise',
      description: 'Relax on a beautiful boat ride while watching the sunset over the water',
      image: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: 55,
      currency: '$',
      rating: 4.7,
      reviews: 198,
      duration: '2.5 hours',
      location: 'Marina Bay',
      category: 'cruises',
      provider: 'Sunset Cruises',
      groupSize: 'Up to 30 people',
      highlights: ['Stunning sunset views', 'Complimentary drinks', 'Live commentary', 'Photo opportunities'],
      difficulty: 'easy',
      includes: ['Boat cruise', 'Welcome drink', 'Snacks', 'Professional crew'],
      featured: true
    },
    {
      id: 'activity-4',
      title: 'Cooking Class Experience',
      description: 'Learn to cook authentic local dishes with a professional chef',
      image: 'https://images.pexels.com/photos/2284166/pexels-photo-2284166.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: 65,
      currency: '$',
      rating: 4.9,
      reviews: 145,
      duration: '4 hours',
      location: 'Culinary Studio',
      category: 'culture',
      provider: 'Culinary Masters',
      groupSize: 'Up to 12 people',
      highlights: ['Hands-on cooking', 'Professional chef', 'Recipe booklet', 'Full meal included'],
      difficulty: 'easy',
      includes: ['Cooking lesson', 'All ingredients', 'Recipe cards', 'Full meal'],
      featured: false
    },
    {
      id: 'activity-5',
      title: 'Museum Art Tour',
      description: 'Discover masterpieces with an expert art historian guide',
      image: 'https://images.pexels.com/photos/1040422/pexels-photo-1040422.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: 30,
      currency: '$',
      originalPrice: 40,
      rating: 4.6,
      reviews: 87,
      duration: '2 hours',
      location: 'Metropolitan Museum',
      category: 'culture',
      provider: 'Art Explorers',
      groupSize: 'Up to 20 people',
      highlights: ['Famous artworks', 'Expert commentary', 'Skip-the-line access', 'Audio headsets'],
      difficulty: 'easy',
      includes: ['Museum entry', 'Expert guide', 'Audio equipment', 'Group photos'],
      featured: false,
      discount: 25
    },
    {
      id: 'activity-6',
      title: 'Zip Line Canopy Tour',
      description: 'Soar through the treetops on an exhilarating zip line adventure',
      image: 'https://images.pexels.com/photos/618833/pexels-photo-618833.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: 85,
      currency: '$',
      rating: 4.8,
      reviews: 112,
      duration: '3.5 hours',
      location: 'Forest Adventure Park',
      category: 'adventure',
      provider: 'Canopy Adventures',
      groupSize: 'Up to 10 people',
      highlights: ['Multiple zip lines', 'Treetop platforms', 'Safety briefing', 'Professional equipment'],
      difficulty: 'moderate',
      includes: ['Safety equipment', 'Professional guide', 'Training session', 'Insurance coverage'],
      featured: true
    }
  ];

  const activityCategories = [
    { id: 'all', title: 'All', icon: Compass, color: '#6B7280' },
    { id: 'tours', title: 'Tours', icon: MapPin, color: '#3B82F6' },
    { id: 'adventure', title: 'Adventure', icon: Mountain, color: '#10B981' },
    { id: 'cruises', title: 'Cruises', icon: Waves, color: '#06B6D4' },
    { id: 'culture', title: 'Culture', icon: Building, color: '#8B5CF6' },
    { id: 'nature', title: 'Nature', icon: TreePine, color: '#059669' },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '#10B981';
      case 'moderate':
        return '#F59E0B';
      case 'challenging':
        return '#EF4444';
      default:
        return colors.textSecondary;
    }
  };

  // Added favorite toggle function
  const handleToggleFavorite = async (activity: Activity) => {
    const savedItem = {
      id: activity.id,
      type: 'attraction' as const,
      title: activity.title,
      location: activity.location,
      image: activity.image,
      rating: activity.rating,
      price: activity.price
    };

    if (isItemSaved(activity.id)) {
      await removeSavedItem(activity.id);
    } else {
      await addSavedItem(savedItem);
    }
  };

const renderActivityCard = (activity: Activity) => {
  const hasDiscount = activity.originalPrice && activity.originalPrice > activity.price;
  
  return (
    <TouchableOpacity
      key={activity.id}
      style={[styles.activityCard, { backgroundColor: colors.card }]}
      onPress={() => router.push({
        pathname: '/bookings/detail',
        params: {
          id: activity.id,
          name: activity.title,
          image: activity.image,
          price: String(activity.price),
          currency: activity.currency,
          description: activity.description,
          provider: activity.provider,
          rating: String(activity.rating),
          reviews: String(activity.reviews),
          location: activity.location,
          duration: activity.duration,
          groupSize: activity.groupSize,
          difficulty: activity.difficulty,
          features: JSON.stringify(activity.includes),
          highlights: JSON.stringify(activity.highlights),
          type: 'activity'
        }
      })}
    >
        <View style={styles.imageContainer}>
          <Image source={{ uri: activity.image }} style={styles.activityImage} />
          
          {activity.featured && (
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredText}>Featured</Text>
            </View>
          )}
          
          {hasDiscount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{activity.discount}%</Text>
            </View>
          )}

          {/* Updated favorite button */}
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={() => handleToggleFavorite(activity)}
          >
            <Heart 
              size={16} 
              color={isItemSaved(activity.id) ? '#EF4444' : 'white'} 
              fill={isItemSaved(activity.id) ? '#EF4444' : 'transparent'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.activityContent}>
          <View style={styles.activityHeader}>
            <View style={styles.activityInfo}>
              <Text style={[styles.activityTitle, { color: colors.text }]} numberOfLines={2}>
                {activity.title}
              </Text>
              <Text style={[styles.provider, { color: colors.textSecondary }]}>
                by {activity.provider}
              </Text>
            </View>
            <View style={styles.ratingContainer}>
              <Star size={14} color="#F59E0B" fill="#F59E0B" />
              <Text style={[styles.rating, { color: colors.text }]}>{activity.rating}</Text>
              <Text style={[styles.reviews, { color: colors.textSecondary }]}>
                ({activity.reviews})
              </Text>
            </View>
          </View>

          <Text style={[styles.description, { color: colors.textSecondary }]} numberOfLines={2}>
            {activity.description}
          </Text>

          <View style={styles.activityDetails}>
            <View style={styles.detailItem}>
              <Clock size={14} color={colors.textSecondary} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                {activity.duration}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <MapPin size={14} color={colors.textSecondary} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]} numberOfLines={1}>
                {activity.location}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Users size={14} color={colors.textSecondary} />
              <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                {activity.groupSize}
              </Text>
            </View>
          </View>

          <View style={styles.difficultyContainer}>
            <Shield size={12} color={getDifficultyColor(activity.difficulty)} />
            <Text style={[styles.difficultyText, { color: getDifficultyColor(activity.difficulty) }]}>
              {activity.difficulty.charAt(0).toUpperCase() + activity.difficulty.slice(1)}
            </Text>
          </View>

          <View style={styles.highlightsContainer}>
            {activity.highlights.slice(0, 2).map((highlight, index) => (
              <View key={index} style={[styles.highlightTag, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[styles.highlightText, { color: colors.primary }]}>{highlight}</Text>
              </View>
            ))}
            {activity.highlights.length > 2 && (
              <Text style={[styles.moreHighlights, { color: colors.textSecondary }]}>
                +{activity.highlights.length - 2} more
              </Text>
            )}
          </View>

          <View style={styles.activityFooter}>
            <View style={styles.priceContainer}>
              {hasDiscount && (
                <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
                  {activity.currency}{activity.originalPrice}
                </Text>
              )}
              <Text style={[styles.price, { color: colors.primary }]}>
                {activity.currency}{activity.price}
              </Text>
              <Text style={[styles.priceUnit, { color: colors.textSecondary }]}>
                /person
              </Text>
            </View>
                <TouchableOpacity 
        style={[styles.bookButton, { backgroundColor: colors.primary }]}
        onPress={() => router.push({
          pathname: '/bookings/booking',
          params: {
            title: activity.title,
            image: activity.image,
            price: String(activity.price),
            currency: activity.currency,
            provider: activity.provider,
            type: 'activity'
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

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.provider.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || activity.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredActivities = filteredActivities.filter(activity => activity.featured);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Activities</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
            <Search size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search activities, tours, experiences..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            {activityCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard, 
                  { 
                    backgroundColor: selectedCategory === category.id ? category.color + '20' : colors.card,
                    borderColor: selectedCategory === category.id ? category.color : 'transparent',
                    borderWidth: selectedCategory === category.id ? 1 : 0
                  }
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                  <category.icon size={20} color={category.color} />
                </View>
                <Text style={[styles.categoryTitle, { color: colors.text }]}>{category.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Activities */}
        {featuredActivities.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Featured Activities</Text>
            {featuredActivities.map(renderActivityCard)}
          </View>
        )}

        {/* All Activities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {selectedCategory === 'all' ? 'All Activities' : `${activityCategories.find(cat => cat.id === selectedCategory)?.title} Activities`} ({filteredActivities.length})
            </Text>
            <TouchableOpacity>
              <Text style={[styles.sortText, { color: colors.primary }]}>Sort by Rating</Text>
            </TouchableOpacity>
          </View>
          
          {filteredActivities.length > 0 ? (
            filteredActivities.map(renderActivityCard)
          ) : (
            <View style={styles.emptyState}>
              <Camera size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No Activities Found</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Try adjusting your search or category filters
              </Text>
            </View>
          )}
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
  activityCard: {
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
  activityImage: {
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
  activityContent: {
    padding: 16,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  activityInfo: {
    flex: 1,
    marginRight: 12,
  },
  activityTitle: {
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
  activityDetails: {
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
  difficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    textTransform: 'capitalize',
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
  activityFooter: {
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
});