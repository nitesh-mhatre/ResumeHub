import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants';
import { getSavedResumes } from '../utils/storage';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [resumeCount, setResumeCount] = useState(0);
  const [memberSince, setMemberSince] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const resumes = await getSavedResumes();
    setResumeCount(resumes.length);
    if (user?.metadata?.creationTime) {
      const date = new Date(user.metadata.creationTime);
      setMemberSince(date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
    }
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

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={COLORS.gray700} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Ionicons name="person" size={40} color={COLORS.white} />
              </View>
            )}
          </View>
          <Text style={styles.userName}>{user?.displayName || 'Guest User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'Not signed in'}</Text>
          {user && (
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={14} color={COLORS.success} />
              <Text style={styles.verifiedText}>Verified Account</Text>
            </View>
          )}
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: COLORS.primaryLight }]}>
              <Ionicons name="document-text" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.statValue}>{resumeCount}</Text>
            <Text style={styles.statLabel}>Resumes</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#d1fae5' }]}>
              <Ionicons name="calendar" size={20} color={COLORS.success} />
            </View>
            <Text style={styles.statValue}>{resumeCount > 0 ? resumeCount : '0'}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="time" size={20} color={COLORS.warning} />
            </View>
            <Text style={styles.statValue}>{memberSince || 'N/A'}</Text>
            <Text style={styles.statLabel}>Member Since</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.replace('/')}>
            <View style={[styles.menuIcon, { backgroundColor: COLORS.primaryLight }]}>
              <Ionicons name="home" size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.menuText}>Home</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.gray300} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.replace('/')}>
            <View style={[styles.menuIcon, { backgroundColor: '#d1fae5' }]}>
              <Ionicons name="add-circle" size={20} color={COLORS.success} />
            </View>
            <Text style={styles.menuText}>New Resume</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.gray300} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/settings')}>
            <View style={[styles.menuIcon, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="settings" size={20} color={COLORS.warning} />
            </View>
            <Text style={styles.menuText}>Settings</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.gray300} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: '#e0e7ff' }]}>
              <Ionicons name="help-circle" size={20} color="#6366f1" />
            </View>
            <Text style={styles.menuText}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.gray300} />
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
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
    paddingVertical: 8,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  backButton: { width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.secondary },
  scrollContent: { padding: 20, paddingBottom: 40 },
  profileCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 4,
    borderWidth: 1,
    borderColor: COLORS.gray100,
    marginBottom: 20,
  },
  avatarContainer: { marginBottom: 16 },
  avatar: { width: 88, height: 88, borderRadius: 44 },
  avatarPlaceholder: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: { fontSize: 22, fontWeight: '700', color: COLORS.secondary, marginBottom: 4 },
  userEmail: { fontSize: 14, color: COLORS.gray500, marginBottom: 8 },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  verifiedText: { fontSize: 12, fontWeight: '600', color: COLORS.success },
  statsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.gray100,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: { fontSize: 16, fontWeight: '700', color: COLORS.secondary, marginBottom: 2 },
  statLabel: { fontSize: 11, color: COLORS.gray400 },
  menuSection: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.gray100,
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
    gap: 12,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: { flex: 1, fontSize: 15, fontWeight: '500', color: COLORS.gray700 },
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
  footer: { alignItems: 'center', gap: 4 },
  footerText: { fontSize: 12, color: COLORS.gray400 },
});
