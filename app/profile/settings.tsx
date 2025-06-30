import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Moon, Sun, Globe, Bell, Shield, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  const settingsGroups = [
    {
      title: 'Appearance',
      items: [
        {
          id: 'theme',
          title: 'Dark Mode',
          icon: isDark ? Moon : Sun,
          type: 'toggle',
          value: isDark,
          onToggle: toggleTheme,
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          id: 'notifications',
          title: 'Push Notifications',
          icon: Bell,
          type: 'toggle',
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
      ],
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          id: 'location',
          title: 'Location Services',
          icon: Globe,
          type: 'toggle',
          value: locationEnabled,
          onToggle: setLocationEnabled,
        },
        {
          id: 'privacy',
          title: 'Privacy Settings',
          icon: Shield,
          type: 'navigation',
          onPress: () => router.push('/profile/privacy'),
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
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingsGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.group}>
            <Text style={[styles.groupTitle, { color: colors.text }]}>{group.title}</Text>
            <View style={[styles.groupContainer, { backgroundColor: colors.card }]}>
              {group.items.map((item, itemIndex) => (
                <View key={item.id}>
                  <TouchableOpacity
                    style={styles.settingItem}
                    onPress={item.onPress}
                    disabled={item.type === 'toggle'}
                  >
                    <View style={styles.settingLeft}>
                      <View style={[styles.settingIcon, { backgroundColor: colors.primary + '20' }]}>
                        <item.icon size={20} color={colors.primary} />
                      </View>
                      <Text style={[styles.settingTitle, { color: colors.text }]}>{item.title}</Text>
                    </View>
                    
                    {item.type === 'toggle' ? (
                      <Switch
                        value={item.value}
                        onValueChange={item.onToggle}
                        trackColor={{ false: colors.border, true: colors.primary }}
                        thumbColor="#FFFFFF"
                      />
                    ) : (
                      <ChevronRight size={20} color={colors.textSecondary} />
                    )}
                  </TouchableOpacity>
                  
                  {itemIndex < group.items.length - 1 && (
                    <View style={[styles.separator, { backgroundColor: colors.border }]} />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.group}>
          <Text style={[styles.groupTitle, { color: colors.text }]}>App Info</Text>
          <View style={[styles.groupContainer, { backgroundColor: colors.card }]}>
            <View style={styles.settingItem}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Version</Text>
              <Text style={[styles.versionText, { color: colors.textSecondary }]}>1.0.0</Text>
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  separator: {
    height: 1,
    marginLeft: 64,
  },
  versionText: {
    fontSize: 16,
  },
});