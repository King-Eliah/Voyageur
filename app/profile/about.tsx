import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ExternalLink, Shield, FileText, Users, Heart } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function AboutScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const aboutSections = [
    {
      title: 'App Information',
      items: [
        { label: 'Version', value: '1.0.0' },
        { label: 'Build', value: '2024.01.15' },
        { label: 'Platform', value: 'React Native' },
      ],
    },
    {
      title: 'Company',
      items: [
        { label: 'Developer', value: 'Voyageur Inc.' },
        { label: 'Founded', value: '2024' },
        { label: 'Location', value: 'Ghana, KNUST' },
      ],
    },
  ];

  const legalLinks = [
    {
      id: 'terms',
      title: 'Terms of Service',
      icon: FileText,
      onPress: () => Linking.openURL('https://Voyageur.com/terms'),
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: Shield,
      onPress: () => Linking.openURL('https://Voyageur.com/privacy'),
    },
    {
      id: 'licenses',
      title: 'Open Source Licenses',
      icon: ExternalLink,
      onPress: () => Linking.openURL('https://Voyageur.com/licenses'),
    },
  ];

  const teamMembers = [
    { name: 'Eliah Abormegah', role: 'PM' },
    { name: 'Jude', role: 'Frontend' },
    { name: 'Humphrey', role: 'Frontend' },
    { name: 'Hanaan', role: 'Frontend' },
    { name: 'Jenson', role: 'Backend' },
    { name: 'Prince', role: 'Backend' },
    { name: 'Malcom', role: 'Backend' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>About</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Description */}
        <View style={[styles.descriptionCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.appName, { color: colors.text }]}>Voyageur</Text>
          <Text style={[styles.tagline, { color: colors.primary }]}>Your Adventure Awaits</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            Voyageur is your ultimate travel companion, designed to make planning and booking your perfect trip effortless. 
            From discovering new destinations to booking hotels, flights, and activities, we've got everything you need in one place.
          </Text>
        </View>

        {/* App Information */}
        {aboutSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
            <View style={[styles.infoContainer, { backgroundColor: colors.card }]}>
              {section.items.map((item, itemIndex) => (
                <View key={itemIndex}>
                  <View style={styles.infoItem}>
                    <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{item.label}</Text>
                    <Text style={[styles.infoValue, { color: colors.text }]}>{item.value}</Text>
                  </View>
                  {itemIndex < section.items.length - 1 && (
                    <View style={[styles.separator, { backgroundColor: colors.border }]} />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Legal Links */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Legal</Text>
          <View style={[styles.legalContainer, { backgroundColor: colors.card }]}>
            {legalLinks.map((link, index) => (
              <View key={link.id}>
                <TouchableOpacity style={styles.legalItem} onPress={link.onPress}>
                  <View style={styles.legalLeft}>
                    <View style={[styles.legalIcon, { backgroundColor: colors.primary + '20' }]}>
                      <link.icon size={20} color={colors.primary} />
                    </View>
                    <Text style={[styles.legalTitle, { color: colors.text }]}>{link.title}</Text>
                  </View>
                  <ExternalLink size={16} color={colors.textSecondary} />
                </TouchableOpacity>
                
                {index < legalLinks.length - 1 && (
                  <View style={[styles.separator, { backgroundColor: colors.border }]} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Team */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Team</Text>
          <View style={[styles.teamContainer, { backgroundColor: colors.card }]}>
            <View style={styles.teamHeader}>
              <Users size={24} color={colors.primary} />
              <Text style={[styles.teamHeaderText, { color: colors.text }]}>Meet the Team</Text>
            </View>
            {teamMembers.map((member, index) => (
              <View key={index} style={styles.teamMember}>
                <Text style={[styles.memberName, { color: colors.text }]}>{member.name}</Text>
                <Text style={[styles.memberRole, { color: colors.textSecondary }]}>{member.role}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <Heart size={16} color={colors.primary} />
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              Made with love for travelers worldwide
            </Text>
          </View>
          <Text style={[styles.copyright, { color: colors.textSecondary }]}>
            © 2024 Voyageur Inc. All rights reserved.
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
  descriptionCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  infoContainer: {
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  infoLabel: {
    fontSize: 16,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    marginHorizontal: 16,
  },
  legalContainer: {
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  legalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  legalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  legalIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  legalTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  teamContainer: {
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 16,
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  teamHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  teamMember: {
    marginBottom: 12,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  footerText: {
    fontSize: 14,
    marginLeft: 8,
  },
  copyright: {
    fontSize: 12,
    textAlign: 'center',
  },
});