import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants';

const SETTINGS_KEY = '@resume_hub_settings';

interface AppSettings {
  darkMode: boolean;
  autoSave: boolean;
  defaultPaperSize: string;
  showOnboardingTips: boolean;
}

const defaultSettings: AppSettings = {
  darkMode: false,
  autoSave: true,
  defaultPaperSize: 'a4',
  showOnboardingTips: true,
};

export default function SettingsScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const json = await AsyncStorage.getItem(SETTINGS_KEY);
      if (json) {
        setSettings({ ...defaultSettings, ...JSON.parse(json) });
      }
    } catch {}
  };

  const saveSettings = async (newSettings: AppSettings) => {
    setSettings(newSettings);
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    } catch {}
  };

  const toggleSetting = (key: keyof AppSettings) => {
    saveSettings({ ...settings, [key]: !settings[key] });
  };

  const handleResetOnboarding = () => {
    Alert.alert(
      'Reset Onboarding',
      'Show the onboarding walkthrough again on next launch?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          onPress: async () => {
            await AsyncStorage.removeItem('@resume_hub_onboarding_done');
            Alert.alert('Done', 'Onboarding will show again on next launch.');
          },
        },
      ]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will delete all saved resumes. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('@resume_hub_saved_resumes');
              Alert.alert('Done', 'All saved resumes have been cleared.');
            } catch {
              Alert.alert('Error', 'Failed to clear data.');
            }
          },
        },
      ]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/');
          },
        },
      ]
    );
  };

  const renderToggleRow = (
    icon: string,
    iconBg: string,
    iconColor: string,
    label: string,
    description: string,
    value: boolean,
    onToggle: () => void
  ) => (
    <View style={styles.settingRow}>
      <View style={[styles.settingIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon as any} size={18} color={iconColor} />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: COLORS.gray200, true: COLORS.primaryLight }}
        thumbColor={value ? COLORS.primary : COLORS.gray400}
      />
    </View>
  );

  const renderActionRow = (
    icon: string,
    iconBg: string,
    iconColor: string,
    label: string,
    description: string,
    onPress: () => void,
    danger?: boolean
  ) => (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.settingIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon as any} size={18} color={iconColor} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingLabel, danger && { color: COLORS.danger }]}>{label}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={COLORS.gray300} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Account Section */}
        {user && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.accountCard}>
              {user.photoURL ? (
                <Image source={{ uri: user.photoURL }} style={styles.accountAvatar} />
              ) : (
                <View style={[styles.accountAvatar, styles.accountAvatarPlaceholder]}>
                  <Ionicons name="person" size={24} color={COLORS.white} />
                </View>
              )}
              <View style={styles.accountInfo}>
                <Text style={styles.accountName}>{user.displayName || 'User'}</Text>
                <Text style={styles.accountEmail}>{user.email}</Text>
              </View>
            </View>
          </View>
        )}

        {/* General Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          <View style={styles.settingsCard}>
            {renderToggleRow(
              'moon', '#e0e7ff', '#6366f1',
              'Dark Mode', 'Use dark theme throughout the app',
              settings.darkMode, () => toggleSetting('darkMode')
            )}
            {renderToggleRow(
              'save', '#d1fae5', COLORS.success,
              'Auto Save', 'Automatically save resume while editing',
              settings.autoSave, () => toggleSetting('autoSave')
            )}
            {renderToggleRow(
              'paper-plane', '#fef3c7', COLORS.warning,
              'Default Paper Size', 'A4 paper for new resumes',
              settings.defaultPaperSize === 'a4', () =>
                saveSettings({ ...settings, defaultPaperSize: settings.defaultPaperSize === 'a4' ? 'letter' : 'a4' })
            )}
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <View style={styles.settingsCard}>
            {renderActionRow(
              'refresh', '#d1fae5', COLORS.success,
              'Reset Onboarding', 'Show the welcome walkthrough again',
              handleResetOnboarding
            )}
            {renderActionRow(
              'trash', '#fee2e2', COLORS.danger,
              'Clear All Resumes', 'Delete all saved resumes from this device',
              handleClearData, true
            )}
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.settingsCard}>
            {renderActionRow(
              'information-circle', '#e0e7ff', COLORS.primary,
              'App Version', 'Resume Hub v1.0.0',
              () => {}
            )}
            {renderActionRow(
              'star', '#fef3c7', COLORS.warning,
              'Rate Us', 'Leave a review on the app store',
              () => {}
            )}
            {renderActionRow(
              'mail', '#d1fae5', COLORS.success,
              'Contact Support', 'Get help or send feedback',
              () => {}
            )}
          </View>
        </View>

        {/* Sign Out */}
        {user && (
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Ionicons name="log-out" size={20} color={COLORS.danger} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Resume Hub v1.0.0</Text>
          <Text style={styles.footerText}>Made with ❤️ for job seekers</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray50 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: COLORS.primary,
    elevation: 3,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  backButton: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.12)' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.white },
  scrollContent: { padding: 20, paddingBottom: 40 },

  // Sections
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: COLORS.gray400, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 },

  // Account Card
  accountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.gray100,
    gap: 12,
  },
  accountAvatar: { width: 52, height: 52, borderRadius: 26 },
  accountAvatarPlaceholder: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountInfo: { flex: 1 },
  accountName: { fontSize: 16, fontWeight: '600', color: COLORS.secondary },
  accountEmail: { fontSize: 13, color: COLORS.gray400, marginTop: 2 },

  // Settings Card
  settingsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.gray100,
    overflow: 'hidden',
  },

  // Setting Row
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
    gap: 12,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingContent: { flex: 1 },
  settingLabel: { fontSize: 15, fontWeight: '500', color: COLORS.gray700 },
  settingDescription: { fontSize: 12, color: COLORS.gray400, marginTop: 2 },

  // Sign Out
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
    gap: 8,
    marginBottom: 24,
  },
  signOutText: { fontSize: 16, fontWeight: '600', color: COLORS.danger },

  // Footer
  footer: { alignItems: 'center', gap: 4 },
  footerText: { fontSize: 12, color: COLORS.gray400 },
});
