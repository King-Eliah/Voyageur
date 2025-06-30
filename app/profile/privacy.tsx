// app/profile/privacy.tsx
import { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function PrivacyScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  
  const [privacySettings, setPrivacySettings] = useState({
    showProfile: true,
    showTrips: false,
    showLocation: false,
    dataCollection: true,
    personalizedAds: false,
    activityTracking: true,
  });

  const toggleSetting = (setting: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Privacy Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Profile Visibility</Text>
        
        <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <View style={styles.settingText}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>Show my profile</Text>
            <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
              Allow others to see your profile information
            </Text>
          </View>
          <Switch
            value={privacySettings.showProfile}
            onValueChange={() => toggleSetting('showProfile')}
            thumbColor={privacySettings.showProfile ? colors.primary : colors.textSecondary}
            trackColor={{ false: colors.border, true: colors.primary + '80' }}
          />
        </View>

        <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <View style={styles.settingText}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>Show my trips</Text>
            <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
              Allow others to see your travel history
            </Text>
          </View>
          <Switch
            value={privacySettings.showTrips}
            onValueChange={() => toggleSetting('showTrips')}
            thumbColor={privacySettings.showTrips ? colors.primary : colors.textSecondary}
            trackColor={{ false: colors.border, true: colors.primary + '80' }}
          />
        </View>

        <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <View style={styles.settingText}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>Share location</Text>
            <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
              Allow the app to access your location
            </Text>
          </View>
          <Switch
            value={privacySettings.showLocation}
            onValueChange={() => toggleSetting('showLocation')}
            thumbColor={privacySettings.showLocation ? colors.primary : colors.textSecondary}
            trackColor={{ false: colors.border, true: colors.primary + '80' }}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>Data & Privacy</Text>
        
        <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <View style={styles.settingText}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>Data collection</Text>
            <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
              Allow us to collect usage data to improve the app
            </Text>
          </View>
          <Switch
            value={privacySettings.dataCollection}
            onValueChange={() => toggleSetting('dataCollection')}
            thumbColor={privacySettings.dataCollection ? colors.primary : colors.textSecondary}
            trackColor={{ false: colors.border, true: colors.primary + '80' }}
          />
        </View>

        <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <View style={styles.settingText}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>Personalized ads</Text>
            <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
              Show ads based on your travel preferences
            </Text>
          </View>
          <Switch
            value={privacySettings.personalizedAds}
            onValueChange={() => toggleSetting('personalizedAds')}
            thumbColor={privacySettings.personalizedAds ? colors.primary : colors.textSecondary}
            trackColor={{ false: colors.border, true: colors.primary + '80' }}
          />
        </View>

        <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
          <View style={styles.settingText}>
            <Text style={[styles.settingTitle, { color: colors.text }]}>Activity tracking</Text>
            <Text style={[styles.settingDesc, { color: colors.textSecondary }]}>
              Track your activity to provide better recommendations
            </Text>
          </View>
          <Switch
            value={privacySettings.activityTracking}
            onValueChange={() => toggleSetting('activityTracking')}
            thumbColor={privacySettings.activityTracking ? colors.primary : colors.textSecondary}
            trackColor={{ false: colors.border, true: colors.primary + '80' }}
          />
        </View>
      </ScrollView>
    </View>
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
    paddingTop: 70,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingText: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  manageButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  manageButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});