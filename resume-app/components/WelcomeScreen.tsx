import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { COLORS } from '../constants';
import { ResumeData, SavedResume } from '../types';
import { useAuth } from '../context/AuthContext';

interface WelcomeScreenProps {
  onStartFresh: () => void;
  onDuplicate: () => void;
  onUploadData: (data: ResumeData) => void;
  savedResumes: SavedResume[];
  onLoadSaved: (resume: SavedResume) => void;
  onDeleteSaved: (id: string) => void;
}

export default function WelcomeScreen({ onStartFresh, onDuplicate, onUploadData, savedResumes, onLoadSaved, onDeleteSaved }: WelcomeScreenProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Delete Resume',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => onDeleteSaved(id) },
      ]
    );
  };

  const handleUpload = async () => {
    try {
      setIsUploading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        setIsUploading(false);
        return;
      }

      const fileUri = result.assets[0].uri;
      const response = await fetch(fileUri);
      const text = await response.text();
      const parsed = JSON.parse(text);

      if (parsed.personalInfo && Array.isArray(parsed.experience)) {
        onUploadData(parsed);
      } else {
        Alert.alert('Invalid File', 'The JSON file does not contain valid resume data. It must have "personalInfo" and "experience" fields.');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Upload Failed', 'Could not read the JSON file. Make sure it is valid JSON.');
    } finally {
      setIsUploading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Top Header Bar */}
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <View style={styles.logoSmall}>
            <Ionicons name="document-text" size={18} color={COLORS.white} />
          </View>
          <Text style={styles.topBarTitle}>Resume Hub</Text>
        </View>
        <View style={styles.topBarRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push('/settings')}
          >
            <Ionicons name="settings-outline" size={20} color={COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push('/profile')}
          >
            {user?.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.profileAvatar} />
            ) : (
              <View style={[styles.profileAvatar, styles.profileAvatarPlaceholder]}>
                <Ionicons name="person" size={16} color={COLORS.white} />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <LinearGradient
          colors={['#6366f1', COLORS.primary, '#7c3aed']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroSection}
        >
          <View style={[styles.heroBlob, styles.heroBlobTop]} />
          <View style={[styles.heroBlob, styles.heroBlobBottom]} />
          <View style={styles.heroBackground}>
            <Text style={styles.heroEmoji}>🚀</Text>
          </View>
          <Text style={styles.greeting}>
            {user ? `${getGreeting()}, ${user.displayName?.split(' ')[0] || 'there'}!` : getGreeting() + '!'}
          </Text>
          <Text style={styles.heroTitle}>Build Your Perfect Resume</Text>
          <Text style={styles.heroSubtitle}>
            {user
              ? 'Choose a template and create a professional resume in minutes.'
              : 'Sign in to save your resumes and access them anywhere.'}
          </Text>
          {!user && (
            <TouchableOpacity style={styles.heroSignInButton} onPress={() => router.push('/login')}>
              <Text style={styles.heroSignInText}>Sign in with Google</Text>
            </TouchableOpacity>
          )}
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard} onPress={onStartFresh} activeOpacity={0.8}>
              <View style={[styles.actionIcon, { backgroundColor: COLORS.primaryLight }]}>
                <Ionicons name="add-circle" size={28} color={COLORS.primary} />
              </View>
              <Text style={styles.actionTitle}>Start Fresh</Text>
              <Text style={styles.actionDesc}>Create new</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={handleUpload}
              activeOpacity={0.8}
              disabled={isUploading}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#d1fae5' }]}>
                {isUploading ? (
                  <ActivityIndicator size="small" color={COLORS.success} />
                ) : (
                  <Ionicons name="cloud-upload" size={28} color={COLORS.success} />
                )}
              </View>
              <Text style={styles.actionTitle}>{isUploading ? 'Uploading...' : 'Upload JSON'}</Text>
              <Text style={styles.actionDesc}>Import data</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionCard, savedResumes.length === 0 && { opacity: 0.4 }]}
              onPress={onDuplicate}
              activeOpacity={0.8}
              disabled={savedResumes.length === 0}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="copy" size={28} color={COLORS.warning} />
              </View>
              <Text style={styles.actionTitle}>Duplicate</Text>
              <Text style={styles.actionDesc}>{savedResumes.length > 0 ? 'Clone latest' : 'No drafts yet'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Resumes */}
        {savedResumes.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Drafts</Text>
              <Text style={styles.sectionCount}>{savedResumes.length} saved</Text>
            </View>
            {savedResumes.map((resume) => (
              <TouchableOpacity
                key={resume.id}
                style={styles.resumeCard}
                onPress={() => onLoadSaved(resume)}
                activeOpacity={0.7}
              >
                <View style={styles.resumeCardLeft}>
                  <View style={styles.resumeIcon}>
                    <Ionicons name="document-text" size={22} color={COLORS.primary} />
                  </View>
                  <View style={styles.resumeInfo}>
                    <Text style={styles.resumeName} numberOfLines={1}>{resume.name}</Text>
                    <View style={styles.resumeMeta}>
                      <View style={[styles.templateBadge, { backgroundColor: COLORS.primaryLight }]}>
                        <Text style={styles.templateBadgeText}>{resume.template}</Text>
                      </View>
                      <Text style={styles.resumeDate}>
                        {new Date(resume.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => handleDelete(resume.id, resume.name)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={18} color={COLORS.gray400} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Resume Hub?</Text>
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: COLORS.primaryLight }]}>
                <Ionicons name="color-palette" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>25+ Templates</Text>
                <Text style={styles.featureDesc}>Professional designs for every industry</Text>
              </View>
            </View>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#d1fae5' }]}>
                <Ionicons name="download" size={20} color={COLORS.success} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Export to PDF</Text>
                <Text style={styles.featureDesc}>Download print-ready resumes instantly</Text>
              </View>
            </View>
            <View style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="phone-portrait" size={20} color={COLORS.warning} />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Mobile First</Text>
                <Text style={styles.featureDesc}>Build resumes on any device, anywhere</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ for job seekers</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray50 },
  
  // Top Bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.primary,
    elevation: 3,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  topBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoSmall: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarTitle: { fontSize: 18, fontWeight: '700', color: COLORS.white },
  topBarRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButton: { padding: 2 },
  profileAvatar: { width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)' },
  profileAvatarPlaceholder: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Scroll
  scrollContent: { paddingBottom: 40 },

  // Hero
  heroSection: {
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 32,
    paddingHorizontal: 24,
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  heroBlob: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.08)' },
  heroBlobTop: { width: 200, height: 200, top: -80, right: -60 },
  heroBlobBottom: { width: 160, height: 160, bottom: -70, left: -50 },
  heroBackground: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  heroEmoji: { fontSize: 34 },
  greeting: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginBottom: 6, fontWeight: '500', letterSpacing: 0.3 },
  heroTitle: { fontSize: 26, fontWeight: '800', color: COLORS.white, letterSpacing: -0.5, marginBottom: 8, textAlign: 'center' },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 21, paddingHorizontal: 12 },
  heroSignInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 22,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  heroSignInText: { color: COLORS.primary, fontWeight: '700', fontSize: 15 },

  // Sections
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.secondary, marginBottom: 12 },
  sectionCount: { fontSize: 12, color: COLORS.gray400, fontWeight: '500' },

  // Quick Actions Grid
  actionsGrid: { flexDirection: 'row', gap: 10 },
  actionCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.gray100,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: { fontSize: 13, fontWeight: '600', color: COLORS.secondary, marginBottom: 2 },
  actionDesc: { fontSize: 11, color: COLORS.gray400 },

  // Resume Cards
  resumeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.gray100,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  resumeCardLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  resumeIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resumeInfo: { flex: 1 },
  resumeName: { fontSize: 15, fontWeight: '600', color: COLORS.secondary, marginBottom: 4 },
  resumeMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  templateBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  templateBadgeText: { fontSize: 10, fontWeight: '600', color: COLORS.primary, textTransform: 'capitalize' },
  resumeDate: { fontSize: 11, color: COLORS.gray400 },
  deleteButton: { padding: 8 },

  // Features
  featuresList: { gap: 12 },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.gray100,
    gap: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureContent: { flex: 1 },
  featureTitle: { fontSize: 14, fontWeight: '600', color: COLORS.secondary, marginBottom: 2 },
  featureDesc: { fontSize: 12, color: COLORS.gray500 },

  // Footer
  footer: { alignItems: 'center', marginTop: 8 },
  footerText: { fontSize: 12, color: COLORS.gray400 },
});
