import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, Calendar, DollarSign, Plane, Award, TrendingUp, Globe } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function TravelStatsScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { trips, bookings } = useData();
  const router = useRouter();

  const currentYear = new Date().getFullYear();
  const thisYearTrips = trips.filter(trip => 
    new Date(trip.startDate).getFullYear() === currentYear
  );

  const totalSpent = bookings.reduce((sum, booking) => sum + booking.price, 0);
  const completedTrips = trips.filter(trip => trip.status === 'completed').length;

  const stats = [
    {
      id: '1',
      title: 'Trips This Year',
      value: thisYearTrips.length,
      icon: Calendar,
      color: '#3B82F6',
      change: '+2 from last year',
    },
    {
      id: '2',
      title: 'Countries Visited',
      value: user?.countriesVisited || 12,
      icon: Globe,
      color: '#10B981',
      change: '+3 this year',
    },
    {
      id: '3',
      title: 'Cities Explored',
      value: 28,
      icon: MapPin,
      color: '#F59E0B',
      change: '+8 this year',
    },
    {
      id: '4',
      title: 'Total Spent',
      value: `$${totalSpent.toLocaleString()}`,
      icon: DollarSign,
      color: '#EF4444',
      change: '+15% from last year',
    },
    {
      id: '5',
      title: 'Miles Traveled',
      value: '45,230',
      icon: Plane,
      color: '#8B5CF6',
      change: '+12,500 this year',
    },
    {
      id: '6',
      title: 'Carbon Footprint',
      value: '8.2 tons CO₂',
      icon: TrendingUp,
      color: '#06B6D4',
      change: '-5% from last year',
    },
  ];

  const monthlyData = [
    { month: 'Jan', trips: 1, spending: 1200 },
    { month: 'Feb', trips: 0, spending: 0 },
    { month: 'Mar', trips: 2, spending: 2800 },
    { month: 'Apr', trips: 1, spending: 1500 },
    { month: 'May', trips: 3, spending: 4200 },
    { month: 'Jun', trips: 2, spending: 3100 },
    { month: 'Jul', trips: 1, spending: 1800 },
    { month: 'Aug', trips: 2, spending: 2900 },
    { month: 'Sep', trips: 1, spending: 1600 },
    { month: 'Oct', trips: 0, spending: 0 },
    { month: 'Nov', trips: 1, spending: 1400 },
    { month: 'Dec', trips: 2, spending: 3200 },
  ];

  const achievements = [
    {
      id: '1',
      title: 'Frequent Flyer',
      description: 'Completed 10+ trips',
      icon: '✈️',
      earned: true,
    },
    {
      id: '2',
      title: 'Explorer',
      description: 'Visited 10+ countries',
      icon: '🌍',
      earned: true,
    },
    {
      id: '3',
      title: 'Adventure Seeker',
      description: 'Booked 5+ activities',
      icon: '🏔️',
      earned: true,
    },
    {
      id: '4',
      title: 'Globetrotter',
      description: 'Visited 25+ countries',
      icon: '🌎',
      earned: false,
    },
    {
      id: '5',
      title: 'Eco Warrior',
      description: 'Reduced carbon footprint',
      icon: '🌱',
      earned: true,
    },
    {
      id: '6',
      title: 'Culture Enthusiast',
      description: 'Visited 20+ museums',
      icon: '🏛️',
      earned: false,
    },
  ];

  const maxSpending = Math.max(...monthlyData.map(d => d.spending));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Travel Stats</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overview Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>2024 Overview</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat) => (
              <View key={stat.id} style={[styles.statCard, { backgroundColor: colors.card }]}>
                <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                  <stat.icon size={24} color={stat.color} />
                </View>
                <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
                <Text style={[styles.statTitle, { color: colors.textSecondary }]}>{stat.title}</Text>
                <Text style={[styles.statChange, { color: stat.color }]}>{stat.change}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Monthly Chart */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Monthly Activity</Text>
          <View style={[styles.chartContainer, { backgroundColor: colors.card }]}>
            <Text style={[styles.chartTitle, { color: colors.text }]}>Travel Spending</Text>
            <View style={styles.chart}>
              {monthlyData.map((data, index) => (
                <View key={index} style={styles.chartBar}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: (data.spending / maxSpending) * 100 || 2,
                        backgroundColor: colors.primary,
                      }
                    ]}
                  />
                  <Text style={[styles.barLabel, { color: colors.textSecondary }]}>{data.month}</Text>
                </View>
              ))}
            </View>
            <View style={styles.chartLegend}>
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>
                Total: ${monthlyData.reduce((sum, d) => sum + d.spending, 0).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Travel Goals */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>2024 Goals</Text>
          <View style={[styles.goalsContainer, { backgroundColor: colors.card }]}>
            <View style={styles.goalItem}>
              <Text style={[styles.goalTitle, { color: colors.text }]}>Visit 15 Countries</Text>
              <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                <View
                  style={[
                    styles.progressFill,
                    { backgroundColor: colors.primary, width: `${(12 / 15) * 100}%` }
                  ]}
                />
              </View>
              <Text style={[styles.goalProgress, { color: colors.textSecondary }]}>12 / 15 countries</Text>
            </View>

            <View style={styles.goalItem}>
              <Text style={[styles.goalTitle, { color: colors.text }]}>Complete 20 Trips</Text>
              <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                <View
                  style={[
                    styles.progressFill,
                    { backgroundColor: colors.primary, width: `${(thisYearTrips.length / 20) * 100}%` }
                  ]}
                />
              </View>
              <Text style={[styles.goalProgress, { color: colors.textSecondary }]}>
                {thisYearTrips.length} / 20 trips
              </Text>
            </View>

            <View style={styles.goalItem}>
              <Text style={[styles.goalTitle, { color: colors.text }]}>Reduce Carbon Footprint</Text>
              <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                <View
                  style={[
                    styles.progressFill,
                    { backgroundColor: '#10B981', width: '75%' }
                  ]}
                />
              </View>
              <Text style={[styles.goalProgress, { color: colors.textSecondary }]}>75% reduction achieved</Text>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement) => (
              <View
                key={achievement.id}
                style={[
                  styles.achievementCard,
                  {
                    backgroundColor: colors.card,
                    opacity: achievement.earned ? 1 : 0.6,
                  }
                ]}
              >
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <Text style={[styles.achievementTitle, { color: colors.text }]}>{achievement.title}</Text>
                <Text style={[styles.achievementDesc, { color: colors.textSecondary }]}>
                  {achievement.description}
                </Text>
                {achievement.earned && (
                  <View style={[styles.earnedBadge, { backgroundColor: colors.primary }]}>
                    <Award size={12} color="#FFFFFF" />
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* World Map Placeholder */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Countries Visited</Text>
          <View style={[styles.mapContainer, { backgroundColor: colors.card }]}>
            <View style={styles.mapPlaceholder}>
              <Globe size={48} color={colors.primary} />
              <Text style={[styles.mapText, { color: colors.text }]}>Interactive World Map</Text>
              <Text style={[styles.mapSubtext, { color: colors.textSecondary }]}>
                {user?.countriesVisited || 12} countries explored
              </Text>
            </View>
          </View>
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
  content: {
    flex: 1,
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    width: (width - 52) / 2,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  statChange: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  chartContainer: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 16,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  bar: {
    width: '80%',
    minHeight: 2,
    borderRadius: 2,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 10,
  },
  chartLegend: {
    alignItems: 'center',
  },
  legendText: {
    fontSize: 14,
    fontWeight: '500',
  },
  goalsContainer: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  goalItem: {
    marginBottom: 20,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalProgress: {
    fontSize: 14,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  achievementCard: {
    width: (width - 52) / 2,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 12,
    textAlign: 'center',
  },
  earnedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mapPlaceholder: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  mapSubtext: {
    fontSize: 14,
  },
});