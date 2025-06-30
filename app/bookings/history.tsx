import { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useData } from '@/contexts/DataContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Calendar, MapPin, Car, Plane, Camera, CheckCircle, XCircle, Clock, Search, Filter, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function BookingsHistoryScreen() {
  const { colors } = useTheme();
  const { bookings } = useData();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  // Available filter options
  const statusOptions = ['confirmed', 'cancelled', 'pending'];
  const typeOptions = ['hotel', 'flight', 'car', 'activity'];

  // Get past bookings (before today or cancelled)
  const pastBookings = useMemo(() => {
    return [...bookings]
      .filter(booking => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const bookingDate = new Date(booking.date);
        return bookingDate < today || booking.status === 'cancelled';
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [bookings]);

  // Filter bookings based on search and filters
  const filteredBookings = useMemo(() => {
    return pastBookings.filter(booking => {
      // Search filter
      const matchesSearch = 
        booking.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter ? booking.status === statusFilter : true;
      
      // Type filter
      const matchesType = typeFilter ? booking.type === typeFilter : true;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [pastBookings, searchQuery, statusFilter, typeFilter]);

  const getIconComponent = (type: string) => {
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

  const clearFilters = () => {
    setStatusFilter(null);
    setTypeFilter(null);
    setSearchQuery('');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Booking History</Text>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <Search size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search bookings..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity 
          onPress={() => setShowFilters(!showFilters)}
          style={[styles.filterButton, { backgroundColor: colors.primary }]}
        >
          <Filter size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Active Filters */}
      {(statusFilter || typeFilter || searchQuery) && (
        <View style={styles.activeFiltersContainer}>
          <Text style={[styles.activeFiltersText, { color: colors.textSecondary }]}>
            Active filters:
          </Text>
          {searchQuery && (
            <View style={[styles.filterPill, { backgroundColor: colors.card }]}>
              <Text style={[styles.filterPillText, { color: colors.text }]}>
                Search: "{searchQuery}"
              </Text>
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
          {statusFilter && (
            <View style={[styles.filterPill, { backgroundColor: colors.card }]}>
              <Text style={[styles.filterPillText, { color: colors.text }]}>
                Status: {statusFilter}
              </Text>
              <TouchableOpacity onPress={() => setStatusFilter(null)}>
                <X size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
          {typeFilter && (
            <View style={[styles.filterPill, { backgroundColor: colors.card }]}>
              <Text style={[styles.filterPillText, { color: colors.text }]}>
                Type: {typeFilter}
              </Text>
              <TouchableOpacity onPress={() => setTypeFilter(null)}>
                <X size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity onPress={clearFilters}>
            <Text style={[styles.clearFiltersText, { color: colors.primary }]}>
              Clear all
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <View style={[styles.filtersPanel, { backgroundColor: colors.card }]}>
          <Text style={[styles.filtersTitle, { color: colors.text }]}>Filter by:</Text>
          
          <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Status</Text>
          <View style={styles.filterOptions}>
            {statusOptions.map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.filterOption,
                  { 
                    backgroundColor: statusFilter === option ? colors.primary : colors.background,
                    borderColor: colors.border
                  }
                ]}
                onPress={() => setStatusFilter(statusFilter === option ? null : option)}
              >
                <Text 
                  style={[
                    styles.filterOptionText, 
                    { color: statusFilter === option ? 'white' : colors.text }
                  ]}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Type</Text>
          <View style={styles.filterOptions}>
            {typeOptions.map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.filterOption,
                  { 
                    backgroundColor: typeFilter === option ? colors.primary : colors.background,
                    borderColor: colors.border
                  }
                ]}
                onPress={() => setTypeFilter(typeFilter === option ? null : option)}
              >
                <Text 
                  style={[
                    styles.filterOptionText, 
                    { color: typeFilter === option ? 'white' : colors.text }
                  ]}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const IconComponent = getIconComponent(item.type);
            const StatusIcon = getStatusIcon(item.status);
            const statusColor = getStatusColor(item.status);

            return (
              <TouchableOpacity
                style={[styles.card, { backgroundColor: colors.card }]}
                onPress={() => router.push({
                  pathname: '/bookings/detail',
                  params: { 
                    id: item.id,
                    title: item.title,
                    location: item.location,
                    image: item.image,
                    date: item.date,
                    status: item.status,
                    type: item.type,
                    price: item.price,
                    currency: item.currency
                  }
                })}
              >
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <Text style={[styles.cardTitle, { color: colors.text }]} numberOfLines={1}>
                      {item.title}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: `${statusColor}20` }]}>
                      <StatusIcon size={14} color={statusColor} />
                      <Text style={[styles.statusText, { color: statusColor }]}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardDetailRow}>
                    <IconComponent size={16} color={colors.textSecondary} />
                    <Text style={[styles.detailText, { color: colors.textSecondary }]} numberOfLines={1}>
                      {item.location}
                    </Text>
                  </View>

                  <View style={styles.cardDetailRow}>
                    <Calendar size={16} color={colors.textSecondary} />
                    <Text style={[styles.detailText, { color: colors.textSecondary }]}>
                      {new Date(item.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </Text>
                  </View>

                  <View style={styles.cardFooter}>
                    <Text style={[styles.typeText, { color: colors.textSecondary }]}>
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </Text>
                    <Text style={[styles.priceText, { color: colors.primary }]}>
                      {item.currency}{item.price.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
          <Calendar size={48} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            {searchQuery || statusFilter || typeFilter ? 'No matching bookings' : 'No Past Bookings'}
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            {searchQuery || statusFilter || typeFilter 
              ? 'Try adjusting your search or filters'
              : 'Your completed and cancelled bookings will appear here'}
          </Text>
          {(searchQuery || statusFilter || typeFilter) && (
            <TouchableOpacity 
              style={[styles.clearFiltersButton, { backgroundColor: colors.primary }]}
              onPress={clearFilters}
            >
              <Text style={styles.clearFiltersButtonText}>Clear Filters</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
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
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 8,
  },
  activeFiltersText: {
    fontSize: 14,
    marginRight: 8,
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
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  filtersPanel: {
    padding: 16,
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 8,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterOptionText: {
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 16,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
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
  cardDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  typeText: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 24,
    padding: 24,
    borderRadius: 12,
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
    maxWidth: '80%',
  },
  clearFiltersButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  clearFiltersButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});