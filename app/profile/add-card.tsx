import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CreditCard, Lock, Info } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function AddCardScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    country: '',
  });
  const [isDefault, setIsDefault] = useState(false);
  const [saveCard, setSaveCard] = useState(true);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const getCardType = (number: string) => {
    const num = number.replace(/\s/g, '');
    if (num.startsWith('4')) return 'Visa';
    if (num.startsWith('5') || num.startsWith('2')) return 'Mastercard';
    if (num.startsWith('3')) return 'American Express';
    return 'Card';
  };

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }
    
    if (!formData.expiryDate || formData.expiryDate.length !== 5) {
      newErrors.expiryDate = 'Please enter a valid expiry date';
    }
    
    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV';
    }
    
    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }
    
    if (!formData.billingAddress.trim()) {
      newErrors.billingAddress = 'Billing address is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }
    
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Card Added Successfully',
        'Your payment method has been saved securely.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add card. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/[^0-9]/g, '').substring(0, 4);
    }
    
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Add Payment Card</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Card Preview */}
        <View style={[styles.cardPreview, { backgroundColor: colors.primary }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardType}>{getCardType(formData.cardNumber)}</Text>
            <CreditCard size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.cardNumber}>
            {formData.cardNumber || '•••• •••• •••• ••••'}
          </Text>
          <View style={styles.cardFooter}>
            <View>
              <Text style={styles.cardLabel}>CARDHOLDER</Text>
              <Text style={styles.cardName}>
                {formData.cardholderName.toUpperCase() || 'YOUR NAME'}
              </Text>
            </View>
            <View>
              <Text style={styles.cardLabel}>EXPIRES</Text>
              <Text style={styles.cardExpiry}>{formData.expiryDate || 'MM/YY'}</Text>
            </View>
          </View>
        </View>

        {/* Security Notice */}
        <View style={[styles.securityNotice, { backgroundColor: colors.card }]}>
          <Lock size={20} color={colors.primary} />
          <Text style={[styles.securityText, { color: colors.textSecondary }]}>
            Your card information is encrypted and secure
          </Text>
        </View>

        {/* Card Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Card Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Card Number</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: colors.inputBackground, 
                  color: colors.text, 
                  borderColor: errors.cardNumber ? '#EF4444' : colors.border 
                }
              ]}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor={colors.textSecondary}
              value={formData.cardNumber}
              onChangeText={(value) => updateFormData('cardNumber', value)}
              keyboardType="numeric"
              maxLength={19}
            />
            {errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber}</Text>}
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={[styles.label, { color: colors.text }]}>Expiry Date</Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: colors.inputBackground, 
                    color: colors.text, 
                    borderColor: errors.expiryDate ? '#EF4444' : colors.border 
                  }
                ]}
                placeholder="MM/YY"
                placeholderTextColor={colors.textSecondary}
                value={formData.expiryDate}
                onChangeText={(value) => updateFormData('expiryDate', value)}
                keyboardType="numeric"
                maxLength={5}
              />
              {errors.expiryDate && <Text style={styles.errorText}>{errors.expiryDate}</Text>}
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <View style={styles.labelWithInfo}>
                <Text style={[styles.label, { color: colors.text }]}>CVV</Text>
                <TouchableOpacity>
                  <Info size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: colors.inputBackground, 
                    color: colors.text, 
                    borderColor: errors.cvv ? '#EF4444' : colors.border 
                  }
                ]}
                placeholder="123"
                placeholderTextColor={colors.textSecondary}
                value={formData.cvv}
                onChangeText={(value) => updateFormData('cvv', value)}
                keyboardType="numeric"
                maxLength={4}
                secureTextEntry
              />
              {errors.cvv && <Text style={styles.errorText}>{errors.cvv}</Text>}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Cardholder Name</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: colors.inputBackground, 
                  color: colors.text, 
                  borderColor: errors.cardholderName ? '#EF4444' : colors.border 
                }
              ]}
              placeholder="John Doe"
              placeholderTextColor={colors.textSecondary}
              value={formData.cardholderName}
              onChangeText={(value) => updateFormData('cardholderName', value)}
              autoCapitalize="words"
            />
            {errors.cardholderName && <Text style={styles.errorText}>{errors.cardholderName}</Text>}
          </View>
        </View>

        {/* Billing Address */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Billing Address</Text>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Address</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: colors.inputBackground, 
                  color: colors.text, 
                  borderColor: errors.billingAddress ? '#EF4444' : colors.border 
                }
              ]}
              placeholder="123 Main Street"
              placeholderTextColor={colors.textSecondary}
              value={formData.billingAddress}
              onChangeText={(value) => updateFormData('billingAddress', value)}
            />
            {errors.billingAddress && <Text style={styles.errorText}>{errors.billingAddress}</Text>}
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={[styles.label, { color: colors.text }]}>City</Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: colors.inputBackground, 
                    color: colors.text, 
                    borderColor: errors.city ? '#EF4444' : colors.border 
                  }
                ]}
                placeholder="New York"
                placeholderTextColor={colors.textSecondary}
                value={formData.city}
                onChangeText={(value) => updateFormData('city', value)}
              />
              {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}
            </View>

            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={[styles.label, { color: colors.text }]}>ZIP Code</Text>
              <TextInput
                style={[
                  styles.input,
                  { 
                    backgroundColor: colors.inputBackground, 
                    color: colors.text, 
                    borderColor: errors.zipCode ? '#EF4444' : colors.border 
                  }
                ]}
                placeholder="10001"
                placeholderTextColor={colors.textSecondary}
                value={formData.zipCode}
                onChangeText={(value) => updateFormData('zipCode', value)}
                keyboardType="numeric"
              />
              {errors.zipCode && <Text style={styles.errorText}>{errors.zipCode}</Text>}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Country</Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: colors.inputBackground, 
                  color: colors.text, 
                  borderColor: errors.country ? '#EF4444' : colors.border 
                }
              ]}
              placeholder="United States"
              placeholderTextColor={colors.textSecondary}
              value={formData.country}
              onChangeText={(value) => updateFormData('country', value)}
            />
            {errors.country && <Text style={styles.errorText}>{errors.country}</Text>}
          </View>
        </View>

        {/* Options */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => setSaveCard(!saveCard)}
          >
            <View style={[styles.checkbox, { borderColor: colors.border }]}>
              {saveCard && <View style={[styles.checkmark, { backgroundColor: colors.primary }]} />}
            </View>
            <Text style={[styles.optionText, { color: colors.text }]}>Save card for future use</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionRow}
            onPress={() => setIsDefault(!isDefault)}
          >
            <View style={[styles.checkbox, { borderColor: colors.border }]}>
              {isDefault && <View style={[styles.checkmark, { backgroundColor: colors.primary }]} />}
            </View>
            <Text style={[styles.optionText, { color: colors.text }]}>Set as default payment method</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Adding Card...' : 'Add Card'}
          </Text>
        </TouchableOpacity>
      </View>
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
  cardPreview: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    height: 200,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardType: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cardNumber: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 2,
    marginTop: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 10,
    marginBottom: 4,
  },
  cardName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  cardExpiry: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
  },
  securityText: {
    fontSize: 14,
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  inputContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  halfWidth: {
    flex: 1,
    paddingHorizontal: 0,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  labelWithInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  optionText: {
    fontSize: 16,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});