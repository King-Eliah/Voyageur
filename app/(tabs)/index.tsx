import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, MapPin, Calendar, TrendingUp, Cloud, Sun, Bell } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { trips } = useData();
  const router = useRouter();

  const quickActions = [
    { id: '1', title: 'Add Trip', icon: Plus, onPress: () => router.push('/modal/add-trip') },
    { id: '2', title: 'Find Hotels', icon: MapPin, onPress: () => router.push('/bookings/hotels') },
    { id: '3', title: 'Book Flight', icon: Calendar, onPress: () => router.push('/bookings/flights') },
  ];

  const recentTrips = trips.slice(0, 3);

  const recommendations = [
    {
      id: '1',
      title: 'Bali, Indonesia',
      image: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Tropical paradise',
    },
    {
      id: '2',
      title: 'Tokyo, Japan',
      image: 'https://images.pexels.com/photos/315191/pexels-photo-315191.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'Modern culture',
    },
    {
      id: '3',
      title: 'Paris, France',
      image: 'https://images.pexels.com/photos/161853/eiffel-tower-paris-france-tower-161853.jpeg?auto=compress&cs=tinysrgb&w=400',
      description: 'City of lights',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
  <View>
    <Text style={[styles.greeting, { color: colors.textSecondary }]}>
      {user ? `Hello, ${user.firstName}` : 'Hello, Traveller'}
    </Text>
    <Text style={[styles.title, { color: colors.text }]}>Where to next?</Text>
  </View>
  <View style={styles.headerIcons}>
    <TouchableOpacity 
      onPress={() => router.push('/notifications')}
      style={styles.notificationIcon}
    >
      <Bell size={24} color={colors.text} />
      {/* Optional badge */}
      <View style={[styles.notificationBadge, { backgroundColor: colors.primary }]} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => router.push('/profile')}>
     <Image
    source={user?.profileImage 
    ? { uri: user.profileImage } 
    : require('../../assets/images/profile.png')
  }
  style={styles.profileImage}
  defaultSource={require('../../assets/images/profile.png')} // Fallback for loading
/>
    </TouchableOpacity>
  </View>
</View>

        {/* Weather Widget */}
        <View style={[styles.weatherCard, { backgroundColor: colors.card }]}>
          <View style={styles.weatherContent}>
            <View>
              <Text style={[styles.weatherLocation, { color: colors.text }]}>Current Location</Text>
              <Text style={[styles.weatherTemp, { color: colors.primary }]}>24°C</Text>
              <Text style={[styles.weatherDesc, { color: colors.textSecondary }]}>Sunny</Text>
            </View>
            <Sun size={48} color={colors.primary} />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>     Quick Actions</Text>
          <View style={styles.quickActions}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickActionCard, { backgroundColor: colors.card }]}
                onPress={action.onPress}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: colors.primary + '20' }]}>
                  <action.icon size={24} color={colors.primary} />
                </View>
                <Text style={[styles.quickActionText, { color: colors.text }]}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Trips */}
        {recentTrips.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Trips</Text>
              <TouchableOpacity onPress={() => router.push('/trips')}>
                <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
             {recentTrips.map((trip) => (
  <TouchableOpacity
    key={trip.id}
    style={[styles.tripCard, { backgroundColor: colors.card }]}
    onPress={() => router.push({
      pathname: '/bookings/detail',
      params: {
        id: trip.id,
        title: trip.title,
        destination: trip.destination,
        image: trip.image,
        startDate: trip.startDate,
        endDate: trip.endDate,
        type: 'trip'
      }
    })}
  >

                  <Image source={{ uri: trip.image }} style={styles.tripImage} />
                  <View style={styles.tripInfo}>
                    <Text style={[styles.tripTitle, { color: colors.text }]}>{trip.title}</Text>
                    <Text style={[styles.tripLocation, { color: colors.textSecondary }]}>{trip.destination}</Text>
                    <Text style={[styles.tripDates, { color: colors.primary }]}>
                      {new Date(trip.startDate).toLocaleDateString()}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Recommendations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recommended for You</Text>
            <TouchableOpacity onPress={() => router.push('/explore/recommended')}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {recommendations.map((item) => (
  <TouchableOpacity
    key={item.id}
    style={[styles.recommendationCard, { backgroundColor: colors.card }]}
    onPress={() => router.push({
      pathname: '/bookings/detail',
      params: {
        id: item.id,
        title: item.title,
        image: item.image,
        description: item.description,
        type: 'destination',
        highlights: JSON.stringify([
          'Recommended for you',
          'Matches your travel preferences',
          'Popular destination'
        ])
      }
    })}
  >
                <Image source={{ uri: item.image }} style={styles.recommendationImage} />
                <View style={styles.recommendationInfo}>
                  <Text style={[styles.recommendationTitle, { color: colors.text }]}>{item.title}</Text>
                  <Text style={[styles.recommendationDesc, { color: colors.textSecondary }]}>{item.description}</Text>
                </View>
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
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  weatherCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  weatherContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherLocation: {
    fontSize: 14,
    marginBottom: 4,
  },
  weatherTemp: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  weatherDesc: {
    fontSize: 14,
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
  headerIcons: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 16,
},
notificationIcon: {
  position: 'relative',
},
notificationBadge: {
  position: 'absolute',
  top: -4,
  right: -4,
  width: 8,
  height: 8,
  borderRadius: 4,
},
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  horizontalScroll: {
    paddingLeft: 20,
  },
  tripCard: {
    width: 240,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tripImage: {
    width: '100%',
    height: 120,
  },
  tripInfo: {
    padding: 16,
  },
  tripTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  tripLocation: {
    fontSize: 14,
    marginBottom: 8,
  },
  tripDates: {
    fontSize: 12,
    fontWeight: '500',
  },
  recommendationCard: {
    width: 200,
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
  recommendationImage: {
    width: '100%',
    height: 120,
  },
  recommendationInfo: {
    padding: 16,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  recommendationDesc: {
    fontSize: 14,
  },
});