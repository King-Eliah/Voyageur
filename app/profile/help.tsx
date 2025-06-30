import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, MessageCircle, Phone, Mail, ChevronDown, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function HelpScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const faqData = [
    {
      id: '1',
      question: 'How do I book a trip?',
      answer: 'To book a trip, go to the Explore tab, select your destination, choose your dates, and follow the booking process. You can book hotels, flights, and activities all in one place.',
    },
    {
      id: '2',
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel most bookings. Cancellation policies vary by provider. Check your booking details for specific cancellation terms and deadlines.',
    },
    {
      id: '3',
      question: 'How do I add a trip to my itinerary?',
      answer: 'Tap the "+" button on the My Trips tab, fill in your trip details including destination, dates, and description, then save your trip.',
    },
    {
      id: '4',
      question: 'Is my payment information secure?',
      answer: 'Yes, we use industry-standard encryption to protect your payment information. We never store your full credit card details on our servers.',
    },
    {
      id: '5',
      question: 'How do I change my profile information?',
      answer: 'Go to the Profile tab, tap "Edit Profile", make your changes, and save. You can update your name, email, phone number, and profile photo.',
    },
    {
      id: '6',
      question: 'What if I need help during my trip?',
      answer: 'Our 24/7 support team is available to help you during your travels. Use the in-app chat feature or call our emergency support line.',
    },
  ];

  const contactOptions = [
    {
      id: 'chat',
      title: 'Live Chat',
      description: 'Chat with our support team',
      icon: MessageCircle,
      action: () => Alert.alert('Live Chat', 'Starting chat with support...'),
    },
    {
      id: 'phone',
      title: 'Phone Support',
      description: '+233 534 652 144',
      icon: Phone,
      action: () => Alert.alert('Phone Support', 'Calling support...'),
    },
    {
      id: 'email',
      title: 'Email Support',
      description: 'support@Voyageur.com',
      icon: Mail,
      action: () => Alert.alert('Email Support', 'Opening email...'),
    },
  ];

  const filteredFAQs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Contact Options */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Us</Text>
          <View style={[styles.contactContainer, { backgroundColor: colors.card }]}>
            {contactOptions.map((option, index) => (
              <View key={option.id}>
                <TouchableOpacity style={styles.contactOption} onPress={option.action}>
                  <View style={styles.contactLeft}>
                    <View style={[styles.contactIcon, { backgroundColor: colors.primary + '20' }]}>
                      <option.icon size={20} color={colors.primary} />
                    </View>
                    <View>
                      <Text style={[styles.contactTitle, { color: colors.text }]}>{option.title}</Text>
                      <Text style={[styles.contactDescription, { color: colors.textSecondary }]}>
                        {option.description}
                      </Text>
                    </View>
                  </View>
                  <ChevronRight size={20} color={colors.textSecondary} />
                </TouchableOpacity>
                
                {index < contactOptions.length - 1 && (
                  <View style={[styles.separator, { backgroundColor: colors.border }]} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* FAQ Search */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Frequently Asked Questions</Text>
          <View style={[styles.searchContainer, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
            <Search size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search FAQs..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* FAQ List */}
        <View style={styles.section}>
          <View style={[styles.faqContainer, { backgroundColor: colors.card }]}>
            {filteredFAQs.map((faq, index) => (
              <View key={faq.id}>
                <TouchableOpacity style={styles.faqItem} onPress={() => toggleFAQ(faq.id)}>
                  <Text style={[styles.faqQuestion, { color: colors.text }]}>{faq.question}</Text>
                  {expandedFAQ === faq.id ? (
                    <ChevronDown size={20} color={colors.textSecondary} />
                  ) : (
                    <ChevronRight size={20} color={colors.textSecondary} />
                  )}
                </TouchableOpacity>
                
                {expandedFAQ === faq.id && (
                  <View style={styles.faqAnswer}>
                    <Text style={[styles.faqAnswerText, { color: colors.textSecondary }]}>{faq.answer}</Text>
                  </View>
                )}
                
                {index < filteredFAQs.length - 1 && (
                  <View style={[styles.separator, { backgroundColor: colors.border }]} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Emergency Contact */}
        <View style={[styles.emergencyBox, { backgroundColor: colors.card }]}>
          <Text style={[styles.emergencyTitle, { color: colors.text }]}>Emergency Support</Text>
          <Text style={[styles.emergencyText, { color: colors.textSecondary }]}>
            If you need immediate assistance during your trip, call our 24/7 emergency hotline:
          </Text>
          <TouchableOpacity style={[styles.emergencyButton, { backgroundColor: colors.primary }]}>
            <Phone size={20} color="#FFFFFF" />
            <Text style={styles.emergencyButtonText}>+233 534 652 144</Text>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  contactContainer: {
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  contactDescription: {
    fontSize: 14,
  },
  separator: {
    height: 1,
    marginLeft: 68,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  faqContainer: {
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  faqAnswerText: {
    fontSize: 14,
    lineHeight: 20,
  },
  emergencyBox: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emergencyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});