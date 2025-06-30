import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Plane, Hotel, Gift, Check, Cloud } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function NotificationsScreen() {
  const { colors, isDark } = useTheme();
  const [notifications, setNotifications] = useState([]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 16,
      backgroundColor: colors.background,
    },
    backButton: {
      padding: 8,
      marginRight: 16,
      borderRadius: 8,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      flex: 1,
    },
    markAllButton: {
      padding: 8,
    },
    markAllText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 20,
    },
    notificationCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    unreadCard: {
      backgroundColor: colors.primary + '05',
      borderColor: colors.primary + '20',
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    tripIcon: {
      backgroundColor: colors.primary + '20',
    },
    flightIcon: {
      backgroundColor: '#2196F3' + '20',
    },
    promoIcon: {
      backgroundColor: '#FF9800' + '20',
    },
    bookingIcon: {
      backgroundColor: '#4CAF50' + '20',
    },
    weatherIcon: {
      backgroundColor: '#607D8B' + '20',
    },
    notificationContent: {
      flex: 1,
    },
    notificationTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    notificationMessage: {
      fontSize: 14,
      fontWeight: '400',
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: 8,
    },
    notificationTime: {
      fontSize: 12,
      fontWeight: '400',
      color: colors.textSecondary,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
      marginLeft: 8,
      marginTop: 4,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 40,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptyText: {
      fontSize: 16,
      fontWeight: '400',
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
  });

  useEffect(() => {
    // Mock notifications data
    const mockNotifications = [
      {
        id: '1',
        title: 'Your trip to Bali is coming up!',
        message: 'Your trip starts in 3 days. Don\'t forget to pack your swimsuit and check the weather forecast for optimal planning.',
        type: 'trip',
        time: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
        actionUrl: '/trips',
      },
      {
        id: '2',
        title: 'Flight reminder',
        message: 'Your flight to Tokyo departs in 5 hours',
        type: 'flight',
        time: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: false,
        actionUrl: '/flights',
      },
      {
        id: '3',
        title: 'Special offer',
        message: 'Get 20% off your next hotel booking in Paris',
        type: 'promotion',
        time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        read: true,
      },
      {
        id: '4',
        title: 'Booking confirmed',
        message: 'Your hotel reservation in Rome has been confirmed',
        type: 'booking',
        time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        read: true,
      },
      {
        id: '5',
        title: 'Weather alert',
        message: 'Rain expected in your destination tomorrow',
        type: 'weather',
        time: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        read: false,
      },
    ];

    setNotifications(mockNotifications);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'trip':
        return { icon: Gift, style: styles.tripIcon, color: colors.primary };
      case 'flight':
        return { icon: Plane, style: styles.flightIcon, color: '#2196F3' };
      case 'promotion':
        return { icon: Gift, style: styles.promoIcon, color: '#FF9800' };
      case 'booking':
        return { icon: Check, style: styles.bookingIcon, color: '#4CAF50' };
      case 'weather':
        return { icon: Cloud, style: styles.weatherIcon, color: '#607D8B' };
      default:
        return { icon: Gift, style: styles.tripIcon, color: colors.textSecondary };
    }
  };

  const formatTimestamp = (time) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 24 * 60) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      const days = Math.floor(diffInMinutes / (24 * 60));
      return `${days}d ago`;
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const handleNotificationPress = (notification) => {
    // Mark as read
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    );

    // Navigate to action URL if available
    if (notification.actionUrl) {
      router.push(notification.actionUrl);
    }
  };

  const renderNotification = ({ item }) => {
    const iconConfig = getNotificationIcon(item.type);
    const IconComponent = iconConfig.icon;

    return (
      <TouchableOpacity
        style={[styles.notificationCard, !item.read && styles.unreadCard]}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, iconConfig.style]}>
          <IconComponent size={20} color={iconConfig.color} />
        </View>
        
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.notificationTime}>
            {formatTimestamp(item.time)}
          </Text>
        </View>

        {!item.read && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllButton} onPress={markAllAsRead}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Gift size={64} color={colors.textSecondary} style={styles.emptyIcon} />
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptyText}>
              You're all caught up! Notifications about your trips, flights, and updates will appear here.
            </Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderNotification}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}