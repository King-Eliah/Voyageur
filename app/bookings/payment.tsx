import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CreditCard, Plus, MoveHorizontal as MoreHorizontal, Calendar, Shield, X, Smartphone } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { MaskedTextInput } from "react-native-mask-text";
import { Picker } from '@react-native-picker/picker';

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
    {
      id: '3',
      type: 'mobile_money',
      provider: 'MTN',
      phoneNumber: '*******7890',
      isDefault: false,
    },
  ]);

  const [showAddCardForm, setShowAddCardForm] = useState(false);
  const [showAddMobileMoneyForm, setShowAddMobileMoneyForm] = useState(false);
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });
  const [mobileMoneyForm, setMobileMoneyForm] = useState({
    provider: 'MTN',
    phoneNumber: '',
  });

  const mobileMoneyProviders = [
    { label: 'MTN Mobile Money', value: 'MTN' },
    { label: 'Vodafone Cash', value: 'Vodafone' },
    { label: 'AirtelTigo Money', value: 'AirtelTigo' },
    { label: 'Telecel Money', value: 'Telecel' },
  ];

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

  const handleInputChange = (name: string, value: string) => {
    setCardForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMobileMoneyInputChange = (name: string, value: string) => {
    setMobileMoneyForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCardSubmit = () => {
    if (!cardForm.cardNumber || !cardForm.expiryDate || !cardForm.cvv || !cardForm.cardholderName) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const last4 = cardForm.cardNumber.replace(/\s/g, '').slice(-4);
    const [expiryMonth, expiryYear] = cardForm.expiryDate.split('/');
    
    const cardType = cardForm.cardNumber.startsWith('4') ? 'visa' : 
                    cardForm.cardNumber.startsWith('5') ? 'mastercard' : 'other';

    const newCard = {
      id: Date.now().toString(),
      type: cardType,
      last4,
      expiryMonth: parseInt(expiryMonth),
      expiryYear: 2000 + parseInt(expiryYear),
      isDefault: paymentMethods.length === 0,
    };

    setPaymentMethods(prev => [...prev, newCard]);
    setShowAddCardForm(false);
    setCardForm({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
    });
  };

  const handleAddMobileMoneySubmit = () => {
    if (!mobileMoneyForm.phoneNumber) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    const newMobileMoney = {
      id: Date.now().toString(),
      type: 'mobile_money',
      provider: mobileMoneyForm.provider,
      phoneNumber: mobileMoneyForm.phoneNumber.slice(-4).padStart(mobileMoneyForm.phoneNumber.length, '*'),
      isDefault: false,
    };

    setPaymentMethods(prev => [...prev, newMobileMoney]);
    setShowAddMobileMoneyForm(false);
    setMobileMoneyForm({
      provider: 'MTN',
      phoneNumber: '',
    });
  };

  const getCardIcon = (type: string) => {
    return type === 'mobile_money' ? Smartphone : CreditCard;
  };

  const getCardName = (type: string, provider?: string) => {
    switch (type) {
      case 'visa':
        return 'Visa';
      case 'mastercard':
        return 'Mastercard';
      case 'amex':
        return 'American Express';
      case 'mobile_money':
        return provider || 'Mobile Money';
      default:
        return 'Card';
    }
  };

  const handleAddPaymentMethod = () => {
    Alert.alert(
      'Add Payment Method',
      'Select payment method type',
      [
        {
          text: 'Credit/Debit Card',
          onPress: () => setShowAddCardForm(true)
        },
        {
          text: 'Mobile Money',
          onPress: () => setShowAddMobileMoneyForm(true)
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const handleCardOptions = (cardId: string) => {
    Alert.alert(
      'Payment Options',
      'Choose an action',
      [
        { text: 'Set as Default', onPress: () => setDefaultCard(cardId) },
        { text: 'Remove', style: 'destructive', onPress: () => removeCard(cardId) },
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

  const handleReserveBooking = () => {
    Alert.alert(
      'Reserve Booking',
      'This will hold your booking without payment for 24 hours. Continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Reserve',
          onPress: () => {
            // In a real app, you would call your API to reserve the booking
            Alert.alert(
              'Booking Reserved',
              'Your booking has been reserved for 24 hours. Complete payment to confirm.',
              [
                {
                  text: 'OK',
                  onPress: () => router.push('/bookings')
                }
              ]
            );
          }
        }
      ]
    );
  };

  const handleConfirmPayment = () => {
    const defaultMethod = paymentMethods.find(method => method.isDefault);
    
    if (!defaultMethod) {
      Alert.alert('Error', 'Please select a default payment method');
      return;
    }

    // In a real app, you would process the payment here
    // For demo purposes, we'll simulate a successful payment
    router.push({
      pathname: '/bookings/confirmation',
      params: {
        id: Date.now().toString(),
        title: 'Hotel Booking - Santorini Resort',
        type: 'hotel',
        price: '299.00',
        location: 'Santorini, Greece',
        checkInDate: '2024-06-15',
        checkOutDate: '2024-06-20',
        guests: '2'
      }
    });
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

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Payment Methods */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Saved Methods</Text>
            {!showAddCardForm && !showAddMobileMoneyForm && (
              <TouchableOpacity
                style={[styles.addButton, { backgroundColor: colors.primary }]}
                onPress={handleAddPaymentMethod}
              >
                <Plus size={16} color="#FFFFFF" />
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>

          {showAddCardForm ? (
            <View style={[styles.cardFormContainer, { backgroundColor: colors.card }]}>
              <View style={styles.cardFormHeader}>
                <Text style={[styles.cardFormTitle, { color: colors.text }]}>Add New Card</Text>
                <TouchableOpacity onPress={() => setShowAddCardForm(false)}>
                  <X size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Card Number</Text>
                <MaskedTextInput
                  style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="numeric"
                  mask="9999 9999 9999 9999"
                  value={cardForm.cardNumber}
                  onChangeText={(text) => handleInputChange('cardNumber', text)}
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Expiry Date</Text>
                  <MaskedTextInput
                    style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                    placeholder="MM/YY"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                    mask="99/99"
                    value={cardForm.expiryDate}
                    onChangeText={(text) => handleInputChange('expiryDate', text)}
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>CVV</Text>
                  <MaskedTextInput
                    style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                    placeholder="123"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="numeric"
                    mask="999"
                    value={cardForm.cvv}
                    onChangeText={(text) => handleInputChange('cvv', text)}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Cardholder Name</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                  placeholder="John Doe"
                  placeholderTextColor={colors.textSecondary}
                  value={cardForm.cardholderName}
                  onChangeText={(text) => handleInputChange('cardholderName', text)}
                />
              </View>

              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: colors.primary }]}
                onPress={handleAddCardSubmit}
              >
                <Text style={styles.submitButtonText}>Add Card</Text>
              </TouchableOpacity>
            </View>
          ) : showAddMobileMoneyForm ? (
            <View style={[styles.cardFormContainer, { backgroundColor: colors.card }]}>
              <View style={styles.cardFormHeader}>
                <Text style={[styles.cardFormTitle, { color: colors.text }]}>Add Mobile Money</Text>
                <TouchableOpacity onPress={() => setShowAddMobileMoneyForm(false)}>
                  <X size={20} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Provider</Text>
                <View style={[styles.pickerContainer, { backgroundColor: colors.inputBackground }]}>
                  <Picker
                    selectedValue={mobileMoneyForm.provider}
                    onValueChange={(itemValue) => handleMobileMoneyInputChange('provider', itemValue)}
                    style={{ color: colors.text }}
                    dropdownIconColor={colors.textSecondary}
                  >
                    {mobileMoneyProviders.map((provider) => (
                      <Picker.Item 
                        key={provider.value} 
                        label={provider.label} 
                        value={provider.value} 
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Phone Number</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.text }]}
                  placeholder="050*****44"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="phone-pad"
                  value={mobileMoneyForm.phoneNumber}
                  onChangeText={(text) => handleMobileMoneyInputChange('phoneNumber', text)}
                />
              </View>

              <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: colors.primary }]}
                onPress={handleAddMobileMoneySubmit}
              >
                <Text style={styles.submitButtonText}>Add Mobile Money</Text>
              </TouchableOpacity>
            </View>
          ) : (
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
                            {card.type === 'mobile_money' 
                              ? `${getCardName(card.type, card.provider)} •••• ${card.phoneNumber}` 
                              : `${getCardName(card.type)} •••• ${card.last4}`}
                          </Text>
                          {card.isDefault && (
                            <View style={[styles.defaultBadge, { backgroundColor: colors.primary }]}>
                              <Text style={styles.defaultText}>Default</Text>
                            </View>
                          )}
                        </View>
                        {card.type !== 'mobile_money' && (
                          <View style={styles.cardExpiry}>
                            <Calendar size={12} color={colors.textSecondary} />
                            <Text style={[styles.expiryText, { color: colors.textSecondary }]}>
                              Expires {card.expiryMonth.toString().padStart(2, '0')}/{card.expiryYear}
                            </Text>
                          </View>
                        )}
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
          )}
        </View>

        {/* Security Info */}
        <View style={[styles.securityCard, { backgroundColor: colors.card }]}>
          <View style={styles.securityHeader}>
            <Shield size={24} color={colors.primary} />
            <Text style={[styles.securityTitle, { color: colors.text }]}>Secure Payments</Text>
          </View>
          <Text style={[styles.securityText, { color: colors.textSecondary }]}>
            Your payment information is encrypted and secure. We never store your full payment details on our servers.
          </Text>
        </View>

        {/* Payment History */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Transactions</Text>
          <View style={[styles.historyContainer, { backgroundColor: colors.card }]}>
            {paymentHistory.map((transaction, index) => (
              <View key={transaction.id}>
                <View style={styles.transactionItem}>
                  <View style={styles.transactionLeft}>
                    <Text style={[styles.transactionDescription, { color: colors.text }]}>
                      {transaction.description}
                    </Text>
                    <View style={styles.transactionDetails}>
                      <Text style={[styles.transactionDate, { color: colors.textSecondary }]}>
                        {new Date(transaction.date).toLocaleDateString()}
                      </Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(transaction.status) + '20' }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(transaction.status) }]}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Text style={[styles.transactionAmount, { color: colors.text }]}>
                    ${transaction.amount.toFixed(2)}
                  </Text>
                </View>
                
                {index < paymentHistory.length - 1 && (
                  <View style={[styles.separator, { backgroundColor: colors.border }]} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.reserveButton, { borderColor: colors.primary }]}
            onPress={handleReserveBooking}
          >
            <Text style={[styles.reserveButtonText, { color: colors.primary }]}>Reserve Booking</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.confirmButton, { backgroundColor: colors.primary }]}
            onPress={handleConfirmPayment}
          >
            <Text style={styles.confirmButtonText}>Confirm Payment</Text>
          </TouchableOpacity>
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
  scrollContent: {
    paddingBottom: 20,
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
    marginBottom: 15
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
  transactionLeft: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  transactionDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionDate: {
    fontSize: 12,
    marginRight: 8,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
  cardFormContainer: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
  },
  cardFormHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardFormTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    padding: 12,
    paddingLeft: 0,
    borderRadius: 8,
    fontSize: 16,
  },
  pickerContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
  submitButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 30,
    gap: 12,
  },
  reserveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  reserveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});