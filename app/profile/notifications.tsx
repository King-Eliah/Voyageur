import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, Mail, MessageSquare, Calendar, MapPin } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function NotificationSettingsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  
  const [notifications, setNotifications] = useState({
    pushNotifications: true,
    emailNotifications: true,
    tripReminders: true,
    bookingUpdates: true,
    promotions: false,
    locationAlerts: true,
  });

  const handleToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const notificationGroups = [
    {
      title: 'General',
      items: [
        {
          id: 'pushNotifications',
          title: 'Push Notifications',
          description: 'Receive notifications on your device',
          icon: Bell,
          value: notifications.pushNotifications,
        },
        {
          id: 'emailNotifications',
          title: 'Email Notifications',
          description: 'Receive updates via email',
          icon: Mail,
          value: notifications.emailNotifications,
        },
      ],
    },
    {
      title: 'Travel Updates',
      items: [
        {
          id: 'tripReminders',
          title: 'Trip Reminders',
          description: 'Get reminded about upcoming trips',
          icon: Calendar,
          value: notifications.tripReminders,
        },
        {
          id: 'bookingUpdates',
          title: 'Booking Updates',
          description: 'Updates about your reservations',
          icon: MessageSquare,
          value: notifications.bookingUpdates,
        },
        {
          id: 'locationAlerts',
          title: 'Location Alerts',
          description: 'Alerts about your destination',
          icon: MapPin,
          value: notifications.locationAlerts,
        },
      ],
    },
    {
      title: 'Marketing',
      items: [
        {
          id: 'promotions',
          title: 'Promotions & Offers',
          description: 'Special deals and discounts',
          icon: MessageSquare,
          value: notifications.promotions,
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Notification Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {notificationGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.group}>
            <Text style={[styles.groupTitle, { color: colors.text }]}>{group.title}</Text>
            <View style={[styles.groupContainer, { backgroundColor: colors.card }]}>
              {group.items.map((item, itemIndex) => (
                <View key={item.id}>
                  <View style={styles.notificationItem}>
                    <View style={styles.notificationLeft}>
                      <View style={[styles.notificationIcon, { backgroundColor: colors.primary + '20' }]}>
                        <item.icon size={20} color={colors.primary} />
                      </View>
                      <View style={styles.notificationContent}>
                        <Text style={[styles.notificationTitle, { color: colors.text }]}>{item.title}</Text>
                        <Text style={[styles.notificationDescription, { color: colors.textSecondary }]}>
                          {item.description}
                        </Text>
                      </View>
                    </View>
                    
                    <Switch
                      value={item.value}
                      onValueChange={() => handleToggle(item.id)}
                      trackColor={{ false: colors.border, true: colors.primary }}
                      thumbColor="#FFFFFF"
                    />
                  </View>
                  
                  {itemIndex < group.items.length - 1 && (
                    <View style={[styles.separator, { backgroundColor: colors.border }]} />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={[styles.infoBox, { backgroundColor: colors.card }]}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>About Notifications</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            You can manage your notification preferences here. Some notifications may be required for essential trip updates and cannot be disabled.
          </Text>
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
  group: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  groupContainer: {
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  notificationDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  separator: {
    height: 1,
    marginLeft: 68,
  },
  infoBox: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});