import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Share,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { File as ExpoFile, Paths as ExpoPaths } from 'expo-file-system';

import ResumePreview from '../components/ResumePreview';
import AdModal from '../components/AdModal';
import { useAds } from '../components/AdMobProvider';
import { ResumeData, TemplateType, PaperSize } from '../types';
import { INITIAL_RESUME, COLORS, PAPER_SIZES } from '../constants';
import { generateResumeHTML } from '../utils/generateResumeHTML';

export default function BuilderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ template?: string; resumeData?: string }>();
  const template = (params.template || 'modern') as TemplateType;
  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    if (params.resumeData) {
      try {
        return { ...INITIAL_RESUME, ...JSON.parse(params.resumeData) };
      } catch { return INITIAL_RESUME; }
    }
    return INITIAL_RESUME;
  });
  const [isExporting, setIsExporting] = useState(false);
  const [paperSize, setPaperSize] = useState<PaperSize>('a4');
  const [showPaperPicker, setShowPaperPicker] = useState(false);
  const { showInterstitial, nativeAdsReady, BannerAdComponent } = useAds();
  const [showAdModal, setShowAdModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<'pdf' | 'json' | null>(null);

  const currentPaper = PAPER_SIZES.find(p => p.id === paperSize) || PAPER_SIZES[0];

  const generateHTML = (data: ResumeData, size: PaperSize): string => {
    return generateResumeHTML(data, template, size);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const html = generateHTML(resumeData, paperSize);
      console.log('PDF template:', template);
      const { uri } = await Print.printToFileAsync({ html, base64: false });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Export Resume as PDF', UTI: '.pdf' });
      } else {
        Alert.alert('Export Complete', `PDF saved to: ${uri}`);
      }
    } catch (error) {
      Alert.alert('Export Failed', 'Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveJSON = async () => {
    try {
      const jsonString = JSON.stringify(resumeData, null, 2);
      const fileName = `${resumeData.personalInfo.fullName.replace(/[^a-zA-Z0-9]/g, '_')}_Resume.json`;
      const fileUri = ExpoPaths.document.uri + fileName;
      const file = new ExpoFile(fileUri);
      file.write(jsonString, { encoding: 'utf8' });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Save Resume JSON',
          UTI: '.json',
        });
      } else {
        Alert.alert('File Saved', `JSON saved to: ${fileUri}`);
      }
    } catch (error) {
      Alert.alert('Save Failed', 'Could not save JSON file.');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: 'Check out my resume created with Resume Hub!', title: 'My Resume' });
    } catch {}
  };

  const handlePDFPress = async () => {
    if (nativeAdsReady) {
      // Native ads available — show real interstitial directly
      try {
        await showInterstitial();
      } catch {}
      handleExportPDF();
    } else {
      // Fallback — show the custom AdModal
      setPendingAction('pdf');
      setShowAdModal(true);
    }
  };

  const handleJSONPress = async () => {
    if (nativeAdsReady) {
      try {
        await showInterstitial();
      } catch {}
      handleSaveJSON();
    } else {
      setPendingAction('json');
      setShowAdModal(true);
    }
  };

  const handleAdClose = () => {
    setShowAdModal(false);
    if (pendingAction === 'pdf') {
      handleExportPDF();
    } else if (pendingAction === 'json') {
      handleSaveJSON();
    }
    setPendingAction(null);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={COLORS.gray700} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Resume Builder</Text>
          <Text style={styles.headerSubtitle}>Template: {template}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={18} color={COLORS.gray600} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.exportBtn} onPress={handlePDFPress} disabled={isExporting}>
            <Ionicons name="document-text-outline" size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Paper Size Selector */}
      <TouchableOpacity style={styles.paperSelector} onPress={() => setShowPaperPicker(true)} activeOpacity={0.7}>
        <Ionicons name="document-outline" size={16} color={COLORS.primary} />
        <Text style={styles.paperSelectorText}>Paper: {currentPaper.name}</Text>
        <Text style={styles.paperSelectorSize}>{currentPaper.widthMm}×{currentPaper.heightMm}mm</Text>
        <Ionicons name="chevron-down" size={14} color={COLORS.gray400} />
      </TouchableOpacity>

      {/* Resume Preview */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <ResumePreview data={resumeData} template={template} />
      </ScrollView>

      {/* Banner Ad */}
      <View style={styles.bannerAdContainer}>
        <BannerAdComponent style={styles.bannerAd} />
      </View>

      {/* Bottom Bar - NOT absolute, part of normal flow */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.editButton} onPress={() => router.back()}>
          <Ionicons name="create-outline" size={16} color={COLORS.primary} />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.jsonButton} onPress={handleJSONPress}>
          <Ionicons name="document-outline" size={16} color={COLORS.white} />
          <Text style={styles.jsonButtonText}>JSON</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.exportBarButton, isExporting && styles.disabled]} onPress={handlePDFPress} disabled={isExporting}>
          <Ionicons name={isExporting ? 'hourglass-outline' : 'download-outline'} size={16} color={COLORS.white} />
          <Text style={styles.exportBarButtonText}>{isExporting ? 'Exporting...' : 'PDF'}</Text>
        </TouchableOpacity>
      </View>

      {/* Ad Modal */}
      <AdModal
        visible={showAdModal}
        onClose={handleAdClose}
        title={pendingAction === 'pdf' ? 'Download PDF' : 'Save JSON'}
      />

      {/* Paper Size Picker Modal */}
      <Modal visible={showPaperPicker} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowPaperPicker(false)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Select Paper Size</Text>
            {PAPER_SIZES.map((size) => (
              <TouchableOpacity
                key={size.id}
                style={[styles.paperOption, paperSize === size.id && styles.paperOptionActive]}
                onPress={() => { setPaperSize(size.id); setShowPaperPicker(false); }}
              >
                <View style={styles.paperOptionLeft}>
                  <Text style={[styles.paperOptionName, paperSize === size.id && styles.paperOptionNameActive]}>{size.name}</Text>
                  <Text style={styles.paperOptionDimensions}>{size.widthMm} × {size.heightMm} mm</Text>
                </View>
                {paperSize === size.id && <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray50 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 8, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.gray200, gap: 6 },
  backButton: { width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  headerText: { flex: 1, minWidth: 60 },
  headerTitle: { fontSize: 15, fontWeight: '700', color: COLORS.secondary },
  headerSubtitle: { fontSize: 9, color: COLORS.gray500, textTransform: 'capitalize' },
  headerActions: { flexDirection: 'row', gap: 4, flexShrink: 0 },
  headerButton: { width: 32, height: 32, borderRadius: 6, backgroundColor: COLORS.gray100, justifyContent: 'center', alignItems: 'center' },
  exportBtn: { width: 32, height: 32, borderRadius: 6, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  paperSelector: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 12, backgroundColor: COLORS.primaryLight, gap: 6 },
  paperSelectorText: { fontSize: 11, fontWeight: '600', color: COLORS.primary, flex: 1 },
  paperSelectorSize: { fontSize: 10, color: COLORS.gray500 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 12 },
  bannerAdContainer: { alignItems: 'center', backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.gray200, minHeight: 50 },
  bannerAd: { width: '100%', height: 50 },
  bottomBar: { flexDirection: 'row', padding: 10, paddingBottom: 28, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.gray200, gap: 8 },
  editButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 44, borderRadius: 8, borderWidth: 2, borderColor: COLORS.primary, gap: 4 },
  editButtonText: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },
  jsonButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 44, backgroundColor: COLORS.gray700, borderRadius: 8, gap: 4 },
  jsonButtonText: { color: COLORS.white, fontWeight: '700', fontSize: 13 },
  exportBarButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 44, backgroundColor: COLORS.primary, borderRadius: 8, gap: 4 },
  disabled: { backgroundColor: COLORS.gray400 },
  exportBarButtonText: { color: COLORS.white, fontWeight: '700', fontSize: 13 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, width: '100%', maxWidth: 340, elevation: 8 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: COLORS.secondary, marginBottom: 16, textAlign: 'center' },
  paperOption: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 2, borderColor: COLORS.gray200, marginBottom: 10 },
  paperOptionActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  paperOptionLeft: { flex: 1 },
  paperOptionName: { fontSize: 15, fontWeight: '600', color: COLORS.gray800 },
  paperOptionNameActive: { color: COLORS.primary },
  paperOptionDimensions: { fontSize: 12, color: COLORS.gray400, marginTop: 2 },
});
