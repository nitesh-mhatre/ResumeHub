import React, { useState, useEffect } from 'react';
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
import { ResumeData, TemplateType, PaperSize, CustomTemplateConfig } from '../types';
import { INITIAL_RESUME, COLORS, PAPER_SIZES, FONT_SIZE_OPTIONS, FONT_FAMILY_OPTIONS, FontSizeOption, FontFamilyOption } from '../constants';
import { generateResumeHTML } from '../utils/generateResumeHTML';
import { saveResume } from '../utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BuilderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ template?: string; resumeData?: string; savedId?: string; customConfigKey?: string }>();
  const template = (params.template || 'modern') as TemplateType;
  const [customTemplateConfig, setCustomTemplateConfig] = useState<CustomTemplateConfig | null>(null);

  // Load custom template config from AsyncStorage
  useEffect(() => {
    if (params.customConfigKey) {
      AsyncStorage.getItem(params.customConfigKey).then(json => {
        if (json) {
          try { setCustomTemplateConfig(JSON.parse(json)); } catch {}
        }
      });
    }
  }, [params.customConfigKey]);
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
  const [isSaving, setIsSaving] = useState(false);
  const [fontSize, setFontSize] = useState<FontSizeOption>('12px');
  const [customFontSize, setCustomFontSize] = useState('12');
  const [fontFamily, setFontFamily] = useState<FontFamilyOption>(FONT_FAMILY_OPTIONS[0].value);
  const [showFontSizePicker, setShowFontSizePicker] = useState(false);
  const [showFontFamilyPicker, setShowFontFamilyPicker] = useState(false);

  const currentPaper = PAPER_SIZES.find(p => p.id === paperSize) || PAPER_SIZES[0];

  const generateHTML = (data: ResumeData, size: PaperSize): string => {
    return generateResumeHTML(data, template, size, { fontSize, fontFamily }, customTemplateConfig ?? undefined);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const html = generateHTML(resumeData, paperSize);
      // Convert mm to points (1mm = 2.835pt)
      const mmToPoint = 72 / 25.4;
      const pdfWidth = currentPaper.widthMm * mmToPoint;
      const pdfHeight = currentPaper.heightMm * mmToPoint;
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
        width: pdfWidth,
        height: pdfHeight,
        margins: { left: 0, right: 0, top: 0, bottom: 0 },
      });
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

  const handleSaveToStorage = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      await saveResume(resumeData, template, params.savedId);
      Alert.alert('Saved', 'Resume saved locally. You can access it from the home screen.');
    } catch (error: any) {
      Alert.alert('Save Failed', error?.message || 'Could not save resume.');
    } finally {
      setIsSaving(false);
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
          <Text style={styles.headerTitle}>Preview</Text>
          <Text style={styles.headerSubtitle}>{customTemplateConfig ? customTemplateConfig.name : template + ' template'}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.headerButton, isSaving && styles.headerButtonDisabled]} onPress={handleSaveToStorage} disabled={isSaving}>
            <Ionicons name={isSaving ? 'checkmark' : 'bookmark-outline'} size={18} color={isSaving ? COLORS.success : COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={18} color={COLORS.gray600} />
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

      {/* Font Size Selector */}
      <TouchableOpacity style={styles.paperSelector} onPress={() => setShowFontSizePicker(true)} activeOpacity={0.7}>
        <Ionicons name="text-outline" size={16} color={COLORS.primary} />
        <Text style={styles.paperSelectorText}>Font Size: {fontSize.replace('px', '')}px</Text>
        <Text style={styles.paperSelectorSize}>{fontSize}</Text>
        <Ionicons name="chevron-down" size={14} color={COLORS.gray400} />
      </TouchableOpacity>

      {/* Font Family Selector */}
      <TouchableOpacity style={styles.paperSelector} onPress={() => setShowFontFamilyPicker(true)} activeOpacity={0.7}>
        <Ionicons name="color-fill-outline" size={16} color={COLORS.primary} />
        <Text style={styles.paperSelectorText}>Font: {FONT_FAMILY_OPTIONS.find(f => f.value === fontFamily)?.label || fontFamily}</Text>
        <Ionicons name="chevron-down" size={14} color={COLORS.gray400} />
      </TouchableOpacity>

      {/* Resume Preview */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <ResumePreview data={{ ...resumeData, globalStyles: { ...resumeData.globalStyles, fontFamily, bodySize: fontSize.replace('px', '') } }} template={template} customTemplateConfig={customTemplateConfig} />
      </ScrollView>

      {/* Banner Ad */}
      <View style={styles.bannerAdContainer}>
        <BannerAdComponent style={styles.bannerAd} />
      </View>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.editButton} onPress={() => router.back()}>
          <Ionicons name="create-outline" size={18} color={COLORS.primary} />
          <Text style={styles.editButtonText}>Edit Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.jsonButton} onPress={handleJSONPress}>
          <Ionicons name="document-text-outline" size={18} color={COLORS.white} />
          <Text style={styles.jsonButtonText}>Save JSON</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.exportBarButton, isExporting && styles.disabled]}
          onPress={handlePDFPress}
          disabled={isExporting}
        >
          <Ionicons name={isExporting ? 'hourglass-outline' : 'download-outline'} size={18} color={COLORS.white} />
          <Text style={styles.exportBarButtonText}>{isExporting ? 'Generating...' : 'Export PDF'}</Text>
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

      {/* Font Size Picker Modal */}
      <Modal visible={showFontSizePicker} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowFontSizePicker(false)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Select Font Size</Text>
            {/* Custom font size input */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, borderWidth: 2, borderColor: COLORS.gray200, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.gray700, marginRight: 8 }}>Custom:</Text>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ fontSize: 16, color: COLORS.secondary, paddingVertical: 4 }}
                    numberOfLines={1}
                  >{customFontSize}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <TouchableOpacity
                    onPress={() => {
                      const num = parseInt(customFontSize) || 12;
                      const newSize = Math.max(6, Math.min(36, num - 1));
                      setCustomFontSize(String(newSize));
                    }}
                    style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: COLORS.gray100, justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Ionicons name="remove" size={18} color={COLORS.gray600} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      const num = parseInt(customFontSize) || 12;
                      const newSize = Math.max(6, Math.min(36, num + 1));
                      setCustomFontSize(String(newSize));
                    }}
                    style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: COLORS.gray100, justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Ionicons name="add" size={18} color={COLORS.gray600} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      const num = parseInt(customFontSize) || 12;
                      if (num >= 6 && num <= 36) {
                        setFontSize(`${num}px`);
                        setShowFontSizePicker(false);
                      }
                    }}
                    style={{ marginLeft: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: COLORS.primary }}
                  >
                    <Text style={{ color: COLORS.white, fontWeight: '600', fontSize: 13 }}>Apply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {/* Preset options */}
            {FONT_SIZE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[styles.paperOption, fontSize === option.value && styles.paperOptionActive]}
                onPress={() => { setFontSize(option.value); setCustomFontSize(String(option.bodyPx)); setShowFontSizePicker(false); }}
              >
                <View style={styles.paperOptionLeft}>
                  <Text style={[styles.paperOptionName, fontSize === option.value && styles.paperOptionNameActive]}>{option.label}</Text>
                  <Text style={styles.paperOptionDimensions}>{option.value} body / {option.headerPx}px header</Text>
                </View>
                {fontSize === option.value && <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Font Family Picker Modal */}
      <Modal visible={showFontFamilyPicker} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowFontFamilyPicker(false)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Select Font Family</Text>
            <ScrollView style={{ maxHeight: 400 }}>
              {FONT_FAMILY_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.paperOption, fontFamily === option.value && styles.paperOptionActive]}
                  onPress={() => { setFontFamily(option.value); setShowFontFamilyPicker(false); }}
                >
                  <View style={styles.paperOptionLeft}>
                    <Text style={[styles.paperOptionName, fontFamily === option.value && styles.paperOptionNameActive, { fontFamily: option.rnValue }]}>{option.label}</Text>
                    <Text style={[styles.paperOptionDimensions, { fontFamily: option.rnValue }]}>Aa Bb Cc 123</Text>
                  </View>
                  {fontFamily === option.value && <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
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
  headerButton: { width: 36, height: 36, borderRadius: 8, backgroundColor: COLORS.gray100, justifyContent: 'center', alignItems: 'center' },
  headerButtonDisabled: { backgroundColor: '#d1fae5' },
  paperSelector: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 12, backgroundColor: COLORS.primaryLight, gap: 6 },
  paperSelectorText: { fontSize: 11, fontWeight: '600', color: COLORS.primary, flex: 1 },
  paperSelectorSize: { fontSize: 10, color: COLORS.gray500 },
  scrollView: { flex: 1 },
  scrollContent: { padding: 12 },
  bannerAdContainer: { alignItems: 'center', backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.gray200, minHeight: 50 },
  bannerAd: { width: '100%', height: 50 },
  bottomBar: { flexDirection: 'row', padding: 10, paddingBottom: 28, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.gray200, gap: 8 },
  editButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 48, borderRadius: 12, borderWidth: 2, borderColor: COLORS.primary, gap: 6 },
  editButtonText: { color: COLORS.primary, fontWeight: '600', fontSize: 14 },
  jsonButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 48, backgroundColor: COLORS.gray700, borderRadius: 12, gap: 6 },
  jsonButtonText: { color: COLORS.white, fontWeight: '600', fontSize: 14 },
  exportBarButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 48, backgroundColor: COLORS.primary, borderRadius: 12, gap: 6 },
  disabled: { backgroundColor: COLORS.gray400 },
  exportBarButtonText: { color: COLORS.white, fontWeight: '600', fontSize: 14 },
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
