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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { COLORS } from '../constants';
import { ResumeData } from '../types';

interface WelcomeScreenProps {
  onStartFresh: () => void;
  onUploadData: (data: ResumeData) => void;
}

export default function WelcomeScreen({ onStartFresh, onUploadData }: WelcomeScreenProps) {
  const [isUploading, setIsUploading] = React.useState(false);

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

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="document-text" size={40} color={COLORS.white} />
          </View>
          <Text style={styles.title}>Resume Hub</Text>
          <Text style={styles.subtitle}>Professional Resume Builder</Text>
          <Text style={styles.version}>v1.0.0</Text>
        </View>

        <View style={styles.cardsContainer}>
          <TouchableOpacity style={styles.card} onPress={onStartFresh} activeOpacity={0.8}>
            <View style={[styles.iconCircle, { backgroundColor: COLORS.primaryLight }]}>
              <Ionicons name="add-circle" size={40} color={COLORS.primary} />
            </View>
            <Text style={styles.cardTitle}>Get Started</Text>
            <Text style={styles.cardDescription}>
              Create a brand new professional resume from scratch. Choose from multiple templates.
            </Text>
            <View style={[styles.button, { backgroundColor: COLORS.primary }]}>
              <Text style={styles.buttonText}>Start Fresh</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={handleUpload}
            activeOpacity={0.8}
            disabled={isUploading}
          >
            <View style={[styles.iconCircle, { backgroundColor: '#d1fae5' }]}>
              {isUploading ? (
                <ActivityIndicator size="large" color={COLORS.success} />
              ) : (
                <Ionicons name="cloud-upload" size={40} color={COLORS.success} />
              )}
            </View>
            <Text style={styles.cardTitle}>Upload Data</Text>
            <Text style={styles.cardDescription}>
              Already have a resume JSON file? Upload it to continue where you left off.
            </Text>
            <View style={[styles.button, { backgroundColor: COLORS.success }]}>
              <Text style={styles.buttonText}>{isUploading ? 'Uploading...' : 'Upload JSON'}</Text>
            </View>
          </TouchableOpacity>
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
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  header: { alignItems: 'center', marginBottom: 40 },
  logoContainer: { width: 80, height: 80, borderRadius: 20, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 16, elevation: 8 },
  title: { fontSize: 32, fontWeight: '800', color: COLORS.secondary, letterSpacing: -0.5 },
  subtitle: { fontSize: 16, color: COLORS.gray500, marginTop: 4 },
  version: { fontSize: 12, color: COLORS.gray400, marginTop: 8 },
  cardsContainer: { gap: 16 },
  card: { backgroundColor: COLORS.white, borderRadius: 20, padding: 24, alignItems: 'center', elevation: 4, borderWidth: 1, borderColor: COLORS.gray100 },
  iconCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 22, fontWeight: '700', color: COLORS.secondary, marginBottom: 8 },
  cardDescription: { fontSize: 14, color: COLORS.gray500, textAlign: 'center', lineHeight: 20, marginBottom: 16, paddingHorizontal: 16 },
  button: { paddingVertical: 14, paddingHorizontal: 32, borderRadius: 12, width: '100%', alignItems: 'center', elevation: 3 },
  buttonText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
  footer: { alignItems: 'center', marginTop: 40 },
  footerText: { fontSize: 12, color: COLORS.gray400 },
});
