
import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useData } from '@/contexts/DataContext';
import { Star, Heart } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function FavoritesScreen() {
  const { colors } = useTheme();
  const { savedItems, removeSavedItem } = useData();
  const router = useRouter();

  const renderFavoriteItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.favoriteCard, { backgroundColor: colors.card }]}
      onPress={() => router.push({
        pathname: '/bookings/detail',
        params: {
          id: item.id,
          title: item.title,
          image: item.image,
          price: item.price.toString(),
          currency: '$',
          rating: String(item.rating),
          location: item.location,
          type: item.type,
        }
      })}
    >
      <Image source={{ uri: item.image }} style={styles.favoriteImage} />
      <View style={styles.favoriteInfo}>
        <Text style={[styles.favoriteTitle, { color: colors.text }]} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={[styles.favoriteLocation, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.location}
        </Text>
        <View style={styles.favoriteMeta}>
          <View style={styles.ratingContainer}>
            <Star size={12} color="#FFD700" fill="#FFD700" />
            <Text style={[styles.rating, { color: colors.textSecondary }]}>{item.rating}</Text>
          </View>
          <Text style={[styles.price, { color: colors.primary }]}>${item.price}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.heartButton}
        onPress={() => removeSavedItem(item.id)}
      >
        <Heart size={20} color="#EF4444" fill="#EF4444" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Favorites</Text>
      </View>
      
      {savedItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.text }]}>No favorites yet</Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
            Tap the heart icon to save items
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedItems}
          renderItem={renderFavoriteItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop:50,
    padding: 20,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
  },
  favoriteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  favoriteImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  favoriteInfo: {
    flex: 1,
    marginLeft: 12,
  },
  favoriteTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  favoriteLocation: {
    fontSize: 14,
    marginBottom: 8,
  },
  favoriteMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    marginLeft: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
  },
  heartButton: {
    padding: 8,
  },
});