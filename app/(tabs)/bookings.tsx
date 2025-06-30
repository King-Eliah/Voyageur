import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useData } from '@/contexts/DataContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, MapPin, Car, Plane, Camera, Clock, CircleCheck as CheckCircle, Circle as XCircle, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function BookingsScreen() {
  const { colors } = useTheme();
  const { bookings } = useData();
  const router = useRouter();

  // Get current date at start of day for accurate comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Sort bookings by date (newest first)
  const sortedBookings = [...bookings].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Upcoming bookings: future dates AND not cancelled
  const upcomingBookings = sortedBookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    return bookingDate >= today && booking.status !== 'cancelled';
  });

  // Past bookings: past dates OR cancelled (limited to 5 most recent)
  const recentPastBookings = sortedBookings
    .filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate < today || booking.status === 'cancelled';
    })
    .slice(0, 5);

  const getBookingIcon = (type: string) => {
    switch (type) {
      case 'hotel': return MapPin;
      case 'car': return Car;
      case 'flight': return Plane;
      case 'activity': return Camera;
      default: return Calendar;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#10B981';
      case 'cancelled': return '#EF4444';
      case 'pending': return '#F59E0B';
      default: return colors.textSecondary;
    }
  };

  const navigateToBookingDetail = (booking: any) => {
    router.push({
      pathname: '/bookings/detail',
      params: { 
        id: booking.id,
        ...booking
      }
    });
  };

  const quickBookingOptions = [
    { id: '1', title: 'Hotels', icon: MapPin, route: '/bookings/hotels', color: '#3B82F6' },
    { id: '2', title: 'Flights', icon: Plane, route: '/bookings/flights', color: '#10B981' },
    { id: '3', title: 'Cars', icon: Car, route: '/bookings/cars', color: '#F59E0B' },
    { id: '4', title: 'Activities', icon: Camera, route: '/bookings/activities', color: '#EF4444' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>My Bookings</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Quick Booking Options */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>     Book Now</Text>
          <View style={styles.quickBookingGrid}>
            {quickBookingOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.quickBookingCard, 
                  { 
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderWidth: 1
                  }
                ]}
                onPress={() => router.push(option.route)}
              >
                <View style={[styles.quickBookingIcon, { backgroundColor: option.color + '20' }]}>
                  <option.icon size={20} color={option.color} />
                </View>
                <Text style={[styles.quickBookingTitle, { color: colors.text }]}>{option.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Upcoming Bookings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming</Text>
            {upcomingBookings.length > 0 && (
              <TouchableOpacity onPress={() => router.push('/bookings/upcoming')}>
                <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {upcomingBookings.length > 0 ? (
            <View style={styles.bookingCardsContainer}>
              {upcomingBookings.map((booking) => {
                const IconComponent = getBookingIcon(booking.type);
                const StatusIcon = getStatusIcon(booking.status);
                const statusColor = getStatusColor(booking.status);

                return (
                  <TouchableOpacity
                    key={booking.id}
                    style={[styles.bookingCard, { backgroundColor: colors.card }]}
                    onPress={() => navigateToBookingDetail(booking)}
                  >
                    <Image source={{ uri: booking.image }} style={styles.bookingImage} />
                    <View style={styles.bookingContent}>
                      <View style={styles.bookingHeader}>
                        <View style={styles.bookingInfo}>
                          <Text style={[styles.bookingTitle, { color: colors.text }]} numberOfLines={1}>
                            {booking.title}
                          </Text>
                          <View style={styles.bookingLocation}>
                            <IconComponent size={14} color={colors.textSecondary} />
                            <Text style={[styles.locationText, { color: colors.textSecondary }]} numberOfLines={1}>
                              {booking.location}
                            </Text>
                          </View>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                          <StatusIcon size={12} color={statusColor} />
                          <Text style={[styles.statusText, { color: statusColor }]}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.bookingMeta}>
                        <View style={styles.bookingDate}>
                          <Calendar size={14} color={colors.textSecondary} />
                          <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                            {new Date(booking.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </Text>
                        </View>

                        <View style={styles.bookingFooter}>
                          <Text style={[styles.bookingType, { color: colors.textSecondary }]}>
                            {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}
                          </Text>
                          <Text style={[styles.bookingPrice, { color: colors.primary }]}>
                            {booking.currency}{booking.price.toLocaleString()}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
              <Calendar size={32} color={colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No Upcoming Bookings</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Your future bookings will appear here
              </Text>
            </View>
          )}
        </View>

        {/* Recent Past Bookings */}
        {recentPastBookings.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent History</Text>
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => router.push('/bookings/history')}
              >
                <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
                <ChevronRight size={16} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.bookingCardsContainer}>
              {recentPastBookings.map((booking) => {
                const IconComponent = getBookingIcon(booking.type);
                const StatusIcon = getStatusIcon(booking.status);
                const statusColor = getStatusColor(booking.status);

                return (
                  <TouchableOpacity
                    key={booking.id}
                    style={[styles.bookingCard, { backgroundColor: colors.card }]}
                    onPress={() => navigateToBookingDetail(booking)}
                  >
                    <Image source={{ uri: booking.image }} style={styles.bookingImage} />
                    <View style={styles.bookingContent}>
                      <View style={styles.bookingHeader}>
                        <View style={styles.bookingInfo}>
                          <Text style={[styles.bookingTitle, { color: colors.text }]} numberOfLines={1}>
                            {booking.title}
                          </Text>
                          <View style={styles.bookingLocation}>
                            <IconComponent size={14} color={colors.textSecondary} />
                            <Text style={[styles.locationText, { color: colors.textSecondary }]} numberOfLines={1}>
                              {booking.location}
                            </Text>
                          </View>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                          <StatusIcon size={12} color={statusColor} />
                          <Text style={[styles.statusText, { color: statusColor }]}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.bookingMeta}>
                        <View style={styles.bookingDate}>
                          <Calendar size={14} color={colors.textSecondary} />
                          <Text style={[styles.dateText, { color: colors.textSecondary }]}>
                            {new Date(booking.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </Text>
                        </View>

                        <View style={styles.bookingFooter}>
                          <Text style={[styles.bookingType, { color: colors.textSecondary }]}>
                            {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)}
                          </Text>
                          <Text style={[styles.bookingPrice, { color: colors.primary }]}>
                            {booking.currency}{booking.price.toLocaleString()}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    paddingBottom:10,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  quickBookingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  quickBookingCard: {
    width: '47%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  quickBookingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickBookingTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  bookingCardsContainer: {
    paddingHorizontal: 20,
    gap: 12,
    
  },
  bookingCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  bookingImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  bookingContent: {
    padding: 16,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bookingInfo: {
    flex: 1,
    marginRight: 8,
  },
  bookingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  bookingLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 13,
    marginLeft: 6,
    flexShrink: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  bookingMeta: {
    marginTop: 8,
  },
  bookingDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 13,
    marginLeft: 6,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingType: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bookingPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    marginHorizontal: 24,
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});