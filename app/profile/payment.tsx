import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CreditCard, Plus, MoveHorizontal as MoreHorizontal, Calendar, Shield } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function PaymentScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: '1',
      type: 'visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
    },
    {
      id: '2',
      type: 'mastercard',
      last4: '8888',
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false,
    },
  ]);

  const paymentHistory = [
    {
      id: '1',
      description: 'Hotel Booking - Santorini Resort',
      amount: 299.00,
      date: '2024-01-15',
      status: 'completed',
    },
    {
      id: '2',
      description: 'Flight Booking - NYC to Paris',
      amount: 650.00,
      date: '2024-01-10',
      status: 'completed',
    },
    {
      id: '3',
      description: 'Car Rental - BMW X3',
      amount: 120.00,
      date: '2024-01-08',
      status: 'completed',
    },
  ];

  const getCardIcon = (type: string) => {
    return CreditCard; // In a real app, you'd have different icons for different card types
  };

  const getCardName = (type: string) => {
    switch (type) {
      case 'visa':
        return 'Visa';
      case 'mastercard':
        return 'Mastercard';
      case 'amex':
        return 'American Express';
      default:
        return 'Card';
    }
  };

  const handleAddCard = () => {
    Alert.alert('Add Payment Method', 'This would open the add card form');
  };

  const handleCardOptions = (cardId: string) => {
    Alert.alert(
      'Card Options',
      'Choose an action',
      [
        { text: 'Set as Default', onPress: () => setDefaultCard(cardId) },
        { text: 'Remove Card', style: 'destructive', onPress: () => removeCard(cardId) },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const setDefaultCard = (cardId: string) => {
    setPaymentMethods(prev =>
      prev.map(card => ({
        ...card,
        isDefault: card.id === cardId,
      }))
    );
  };

  const removeCard = (cardId: string) => {
    setPaymentMethods(prev => prev.filter(card => card.id !== cardId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'pending':
        return '#F59E0B';
      case 'failed':
        return '#EF4444';
      default:
        return colors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Payment Methods</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Payment Methods */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Saved Cards</Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={handleAddCard}
            >
              <Plus size={16} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add Card</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardsContainer}>
            {paymentMethods.map((card) => {
              const CardIcon = getCardIcon(card.type);
              return (
                <View key={card.id} style={[styles.cardItem, { backgroundColor: colors.card }]}>
                  <View style={styles.cardLeft}>
                    <View style={[styles.cardIcon, { backgroundColor: colors.primary + '20' }]}>
                      <CardIcon size={20} color={colors.primary} />
                    </View>
                    <View style={styles.cardInfo}>
                      <View style={styles.cardHeader}>
                        <Text style={[styles.cardType, { color: colors.text }]}>
                          {getCardName(card.type)} •••• {card.last4}
                        </Text>
                        {card.isDefault && (
                          <View style={[styles.defaultBadge, { backgroundColor: colors.primary }]}>
                            <Text style={styles.defaultText}>Default</Text>
                          </View>
                        )}
                      </View>
                      <View style={styles.cardExpiry}>
                        <Calendar size={12} color={colors.textSecondary} />
                        <Text style={[styles.expiryText, { color: colors.textSecondary }]}>
                          Expires {card.expiryMonth.toString().padStart(2, '0')}/{card.expiryYear}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.cardOptions}
                    onPress={() => handleCardOptions(card.id)}
                  >
                    <MoreHorizontal size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>

        {/* Security Info */}
        <View style={[styles.securityCard, { backgroundColor: colors.card }]}>
          <View style={styles.securityHeader}>
            <Shield size={24} color={colors.primary} />
            <Text style={[styles.securityTitle, { color: colors.text }]}>Secure Payments</Text>
          </View>
          <Text style={[styles.securityText, { color: colors.textSecondary }]}>
            Your payment information is encrypted and secure. We never store your full card details on our servers.
          </Text>
        </View>

        {/* Payment History */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>     Recent Transactions</Text>
          <View style={[styles.historyContainer, { backgroundColor: colors.card }]}>
            {paymentHistory.map((transaction, index) => (
              <View key={transaction.id}>
                <View style={styles.transactionItem}>
                  <View style={styles.transactionInfo}>
                    <Text style={[styles.transactionDescription, { color: colors.text }]}>
                      {transaction.description}
                    </Text>
                    <Text style={[styles.transactionDate, { color: colors.textSecondary }]}>
                      {new Date(transaction.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <View style={styles.transactionRight}>
                    <Text style={[styles.transactionAmount, { color: colors.text }]}>
                      ${transaction.amount.toFixed(2)}
                    </Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(transaction.status) + '20' }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(transaction.status) }]}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>
                
                {index < paymentHistory.length - 1 && (
                  <View style={[styles.separator, { backgroundColor: colors.border }]} />
                )}
              </View>
            ))}
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
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom:5
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  cardsContainer: {
    paddingHorizontal: 20,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardType: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  defaultText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  cardExpiry: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  expiryText: {
    fontSize: 12,
    marginLeft: 4,
  },
  cardOptions: {
    padding: 8,
  },
  securityCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  securityText: {
    fontSize: 14,
    lineHeight: 20,
  },
  historyContainer: {
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 12,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  separator: {
    height: 1,
    marginHorizontal: 16,
  },
});