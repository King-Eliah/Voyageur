// /app/bookings/confirmation.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  Share,
  Alert,
  PermissionsAndroid
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Calendar from 'expo-calendar';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { useTheme } from '../../contexts/ThemeContext';

export default function ConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors } = useTheme();
  const [showAnimation, setShowAnimation] = useState(false);
  
  const {
    id,
    title,
    image,
    price,
    type = 'hotel',
    location,
    checkInDate,
    checkOutDate,
    guests
  } = params;

  // Generate booking reference
  const bookingRef = `${type.toUpperCase()}${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

  useEffect(() => {
    // Trigger success animation
    setTimeout(() => setShowAnimation(true), 300);
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🎉 Booking Confirmed!\n\n${title}\nBooking Reference: ${bookingRef}\nDates: ${checkInDate} - ${checkOutDate}\nTotal: $${price}`,
        title: 'Booking Confirmation',
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleDownloadTicket = async () => {
    try {
      // In a real app, you would generate a proper ticket image or PDF
      // For this example, we'll just simulate the download
      
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to storage to save your ticket',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission denied', 'Cannot save ticket without storage permission');
          return;
        }
      }

      // Simulate creating a ticket file
      const ticketContent = `Booking Confirmation\n\nReference: ${bookingRef}\nType: ${type}\nTitle: ${title}\nDates: ${checkInDate} - ${checkOutDate}\nTotal: $${price}`;
      const fileUri = FileSystem.documentDirectory + `ticket_${bookingRef}.txt`;
      
      await FileSystem.writeAsStringAsync(fileUri, ticketContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (Platform.OS === 'ios') {
        await MediaLibrary.saveToLibraryAsync(fileUri);
      }

      Alert.alert(
        'Download Complete',
        'Your booking confirmation has been saved to your device.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error downloading ticket:', error);
      Alert.alert(
        'Error',
        'Failed to save ticket. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleAddToCalendar = async () => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Calendar access is needed to add this booking');
        return;
      }

      const calendarId = await Calendar.getDefaultCalendarAsync();
      
      await Calendar.createEventAsync(calendarId.id, {
        title: `${title} Booking`,
        startDate: new Date(checkInDate as string),
        endDate: new Date(checkOutDate as string),
        timeZone: 'UTC',
        location: location as string,
        notes: `Booking Reference: ${bookingRef}\nTotal: $${price}`,
      });

      Alert.alert(
        'Added to Calendar',
        'Your booking has been added to your calendar',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error adding to calendar:', error);
      Alert.alert(
        'Error',
        'Failed to add to calendar. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const getBookingTypeInfo = () => {
    switch (type) {
      case 'hotel':
        return {
          icon: 'bed-outline',
          typeLabel: 'Hotel Booking',
          dateLabel: 'Check-in / Check-out',
          actionLabel: 'View Hotel Details'
        };
      case 'car':
        return {
          icon: 'car-outline',
          typeLabel: 'Car Rental',
          dateLabel: 'Pickup / Return',
          actionLabel: 'View Rental Details'
        };
      case 'activity':
        return {
          icon: 'compass-outline',
          typeLabel: 'Activity Booking',
          dateLabel: 'Activity Date',
          actionLabel: 'View Activity Details'
        };
      default:
        return {
          icon: 'checkmark-circle-outline',
          typeLabel: 'Booking',
          dateLabel: 'Date',
          actionLabel: 'View Details'
        };
    }
  };

  const bookingInfo = getBookingTypeInfo();

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Confirmed</Text>
        <TouchableOpacity onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Success Animation */}
        <View style={[styles.successContainer, showAnimation && styles.successContainerAnimated]}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={48} color="white" />
          </View>
          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successSubtitle}>
            Your {bookingInfo.typeLabel.toLowerCase()} has been successfully booked
          </Text>
        </View>

        {/* Booking Reference */}
        <View style={styles.referenceContainer}>
          <Text style={styles.referenceLabel}>Booking Reference</Text>
          <Text style={styles.referenceNumber}>{bookingRef}</Text>
          <TouchableOpacity style={styles.copyButton}>
            <Ionicons name="copy-outline" size={16} color={colors.primary} />
            <Text style={styles.copyText}>Copy</Text>
          </TouchableOpacity>
        </View>

        {/* Booking Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.cardHeader}>
            <Ionicons name={bookingInfo.icon as any} size={24} color={colors.primary} />
            <Text style={styles.cardTitle}>{bookingInfo.typeLabel}</Text>
          </View>

          {image && (
            <Image source={{ uri: image as string }} style={styles.bookingImage} />
          )}

          <View style={styles.bookingInfo}>
            <Text style={styles.bookingTitle}>{title}</Text>
            {location && (
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
                <Text style={styles.locationText}>{location}</Text>
              </View>
            )}
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>{bookingInfo.dateLabel}</Text>
              <Text style={styles.detailValue}>
                {checkInDate}
                {checkOutDate && ` - ${checkOutDate}`}
              </Text>
            </View>

            {guests && (
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Guests</Text>
                <Text style={styles.detailValue}>{guests}</Text>
              </View>
            )}

            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Total Amount</Text>
              <Text style={styles.priceText}>${price}</Text>
            </View>
          </View>
        </View>

        {/* Important Information */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
            <Text style={styles.infoTitle}>Important Information</Text>
          </View>
          <Text style={styles.infoText}>
            • Please arrive 15 minutes early for check-in{'\n'}
            • Bring a valid ID and credit card{'\n'}
            • Cancellation policy applies{'\n'}
            • Contact support for any changes
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleDownloadTicket}>
            <Ionicons name="download-outline" size={20} color="white" />
            <Text style={styles.primaryButtonText}>Download Ticket</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={handleAddToCalendar}>
            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            <Text style={styles.secondaryButtonText}>Add to Calendar</Text>
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={styles.supportSection}>
          <Text style={styles.supportTitle}>Need Help?</Text>
          <Text style={styles.supportText}>
            Our support team is available 24/7 to assist you
          </Text>
          <TouchableOpacity style={styles.supportButton}>
            <Ionicons name="chatbubble-outline" size={20} color={colors.primary} />
            <Text style={styles.supportButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        {/* Home Button */}
        <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/')}>
          <Text style={styles.homeButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 20,
    backgroundColor: colors.background,
  },
  headerTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 30,
    opacity: 0,
    transform: [{ scale: 0.8 }],
  },
  successContainerAnimated: {
    opacity: 1,
    transform: [{ scale: 1 }],
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  successSubtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  referenceContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  referenceLabel: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  referenceNumber: {
    color: colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 12,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  copyText: {
    color: colors.primary,
    fontSize: 14,
    marginLeft: 4,
  },
  detailsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  bookingImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 16,
  },
  bookingInfo: {
    marginBottom: 20,
  },
  bookingTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginLeft: 4,
  },
  detailsGrid: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  detailLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  detailValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  priceText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  supportSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  supportTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  supportText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  supportButtonText: {
    color: colors.primary,
    fontSize: 14,
    marginLeft: 6,
  },
  homeButton: {
    backgroundColor: colors.surface,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  homeButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
});