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
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
  // Double Column layout: sidebar width as a "1 : x" ratio (x = main parts).
  // Supports decimal values like 33.6755 for custom ratios.
  const [colRatioX, setColRatioX] = useState<number>(3); // default 1:3 → 25% sidebar
  const [showRatioPicker, setShowRatioPicker] = useState(false);
  const colShare = Math.max(0.06, Math.min(0.5, 1 / (1 + (Number(colRatioX) || 3))));

  const currentPaper = PAPER_SIZES.find(p => p.id === paperSize) || PAPER_SIZES[0];

  // Validate resume data before PDF generation — catch missing critical fields
  const validateResumeData = (data: ResumeData): { valid: boolean; message?: string } => {
    const name = (data.personalInfo?.fullName || '').trim();
    if (!name || name.length < 2) {
      return { valid: false, message: 'Please enter your full name before exporting.' };
    }
    // At least one contact method should be present
    const hasContact = !!(data.personalInfo?.email || data.personalInfo?.phone || data.personalInfo?.location);
    if (!hasContact) {
      return { valid: false, message: 'Please add at least one contact method (email, phone, or location).' };
    }
    return { valid: true };
  };

  const generateHTML = (data: ResumeData, size: PaperSize): string => {
    // Carry the Double Column ratio through to the PDF renderer via globalStyles.
    const exportData = template === 'double-column'
      ? { ...data, globalStyles: { ...data.globalStyles, columnRatio: colShare } }
      : data;
    return generateResumeHTML(exportData, template, size, { fontSize, fontFamily }, customTemplateConfig ?? undefined);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      // Validate before generating — catch missing critical data early
      const validation = validateResumeData(resumeData);
      if (!validation.valid) {
        Alert.alert('Export Validation', validation.message || 'Please fix the issues before exporting.');
        return;
      }
      const html = generateHTML(resumeData, paperSize);
      // Convert mm to points (1mm = 2.835pt) for expo-print
      const mmToPoint = 72 / 25.4;
      const pdfWidth = currentPaper.widthMm * mmToPoint;
      const pdfHeight = currentPaper.heightMm * mmToPoint;
      const printOptions: any = {
        html,
        width: pdfWidth,
        height: pdfHeight,
        // Margins must be 0 because the HTML handles page sizing internally
        // (page 1 is edge-to-edge; overflow pages get their top spacing from
        // the CSS). Without this, expo-print may add its own margins that
        // shift content.
        margins: { left: 0, right: 0, top: 0, bottom: 0 },
      };
      // Ask expo-print for the PDF as base64: on Android/Expo Go the file URI
      // it returns lives outside the sandbox that expo-sharing/expo-file-system
      // can read, so we re-write the bytes into our own cache before sharing.
      printOptions.base64 = true;
      const { uri, base64 } = await Print.printToFileAsync(printOptions);

      const baseName = (resumeData.personalInfo.fullName || 'Resume').replace(/[^a-zA-Z0-9]/g, '_') || 'Resume';
      const shareFile = new ExpoFile(ExpoPaths.cache.uri + `${baseName}_Resume.pdf`);
      let shareUri = uri;
      if (base64) {
        try {
          if (shareFile.exists) {
            shareFile.delete();
          }
          shareFile.write(base64, { encoding: 'base64' });
          shareUri = shareFile.uri;
        } catch (writeError) {
          console.warn('Could not write PDF into app cache, sharing original file:', writeError);
        }
      }

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(shareUri, { mimeType: 'application/pdf', dialogTitle: 'Export Resume as PDF', UTI: '.pdf' });
      } else {
        Alert.alert('Export Complete', `PDF saved to: ${shareUri}`);
      }
    } catch (error: any) {
      console.error('PDF export error:', error);
      Alert.alert('Export Failed', error?.message || 'Failed to generate PDF. Please try again.');
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
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Preview</Text>
          <Text style={styles.headerSubtitle}>{customTemplateConfig ? customTemplateConfig.name : template + ' template'}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={[styles.headerButton, isSaving && styles.headerButtonDisabled]} onPress={handleSaveToStorage} disabled={isSaving}>
            <Ionicons name={isSaving ? 'checkmark' : 'bookmark-outline'} size={18} color={isSaving ? COLORS.success : COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Paper / Font Selectors */}
      <View style={styles.selectorCard}>
        <TouchableOpacity style={styles.paperSelector} onPress={() => setShowPaperPicker(true)} activeOpacity={0.6}>
          <View style={styles.selectorIcon}>
            <Ionicons name="document-outline" size={16} color={COLORS.primary} />
          </View>
          <Text style={styles.paperSelectorText}>Paper Size</Text>
          <Text style={styles.paperSelectorValue}>{currentPaper.name} · {currentPaper.widthMm}×{currentPaper.heightMm}mm</Text>
          <Ionicons name="chevron-down" size={14} color={COLORS.gray400} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.paperSelector} onPress={() => setShowFontSizePicker(true)} activeOpacity={0.6}>
          <View style={styles.selectorIcon}>
            <Ionicons name="text-outline" size={16} color={COLORS.primary} />
          </View>
          <Text style={styles.paperSelectorText}>Font Size</Text>
          <Text style={styles.paperSelectorValue}>{fontSize.replace('px', '')}px</Text>
          <Ionicons name="chevron-down" size={14} color={COLORS.gray400} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.paperSelector, template === 'double-column' ? {} : styles.selectorLast]} onPress={() => setShowFontFamilyPicker(true)} activeOpacity={0.6}>
          <View style={styles.selectorIcon}>
            <Ionicons name="color-fill-outline" size={16} color={COLORS.primary} />
          </View>
          <Text style={styles.paperSelectorText}>Font Family</Text>
          <Text style={styles.paperSelectorValue}>{FONT_FAMILY_OPTIONS.find(f => f.value === fontFamily)?.label || fontFamily}</Text>
          <Ionicons name="chevron-down" size={14} color={COLORS.gray400} />
        </TouchableOpacity>

        {template === 'double-column' && (
          <TouchableOpacity style={[styles.paperSelector, styles.selectorLast]} onPress={() => setShowRatioPicker(true)} activeOpacity={0.6}>
            <View style={styles.selectorIcon}>
              <Ionicons name="resize-outline" size={16} color={COLORS.primary} />
            </View>
            <Text style={styles.paperSelectorText}>Column Ratio</Text>
            <Text style={styles.paperSelectorValue}>1 : {colRatioX} · {Math.round(colShare * 100)}% sidebar</Text>
            <Ionicons name="chevron-down" size={14} color={COLORS.gray400} />
          </TouchableOpacity>
        )}
      </View>

      {/* Resume Preview */}
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <ResumePreview data={{ ...resumeData, globalStyles: { ...resumeData.globalStyles, fontFamily, bodySize: fontSize.replace('px', ''), columnRatio: template === 'double-column' ? colShare : undefined } }} template={template} customTemplateConfig={customTemplateConfig} />
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

      {/* Column Ratio Picker Modal (Double Column only) */}
      <Modal visible={showRatioPicker} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowRatioPicker(false)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Column Ratio</Text>
            <Text style={styles.ratioHint}>Colored sidebar : main content width. Smaller sidebars (1:3, 1:4) leave more room for the main column.</Text>
            {/* Presets: 1 : 2 → 33%, 1 : 3 → 25%, 1 : 4 → 20% */}
            {[{ label: '1 : 2', x: 2 }, { label: '1 : 3', x: 3 }, { label: '1 : 4', x: 4 }].map(preset => (
              <TouchableOpacity
                key={preset.label}
                style={[styles.paperOption, colRatioX === preset.x && styles.paperOptionActive]}
                onPress={() => { setColRatioX(preset.x); setShowRatioPicker(false); }}
              >
                <View style={styles.paperOptionLeft}>
                  <Text style={[styles.paperOptionName, colRatioX === preset.x && styles.paperOptionNameActive]}>{preset.label}</Text>
                  <Text style={styles.paperOptionDimensions}>{Math.round((1 / (1 + preset.x)) * 100)}% sidebar · {(1 - 1 / (1 + preset.x)) * 100}% main</Text>
                </View>
                {colRatioX === preset.x && <Ionicons name="checkmark-circle" size={22} color={COLORS.primary} />}
              </TouchableOpacity>
            ))}
            {/* Custom ratio: 1 : N (supports decimal values) */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, borderWidth: 2, borderColor: COLORS.gray200, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.gray700, marginRight: 8 }}>Custom 1:</Text>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ fontSize: 16, color: COLORS.secondary, paddingVertical: 4 }}
                    numberOfLines={1}
                  >{typeof colRatioX === 'number' && !Number.isInteger(colRatioX) ? colRatioX.toFixed(4) : colRatioX}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <TouchableOpacity
                    onPress={() => setColRatioX(prev => Math.max(1, Math.min(50, (Number(prev) || 3) - 0.1)))}
                    style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: COLORS.gray100, justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Ionicons name="remove" size={18} color={COLORS.gray600} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setColRatioX(prev => Math.max(1, Math.min(50, (Number(prev) || 3) + 0.1)))}
                    style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: COLORS.gray100, justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Ionicons name="add" size={18} color={COLORS.gray600} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setShowRatioPicker(false)}
                    style={{ marginLeft: 4, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: COLORS.primary }}
                  >
                    <Text style={{ color: COLORS.white, fontWeight: '600', fontSize: 13 }}>Apply</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <Text style={styles.ratioHint}>Larger numbers make the colored column narrower ({Math.round(colShare * 100)}% of the page width now). Use +/− buttons for fine-tuning with decimals (e.g., 1:33.6755).</Text>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray50 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 10, backgroundColor: COLORS.primary, gap: 6, elevation: 3, shadowColor: COLORS.primaryDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 6 },
  backButton: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexShrink: 0, backgroundColor: 'rgba(255,255,255,0.12)' },
  headerText: { flex: 1, minWidth: 60 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: COLORS.white },
  headerSubtitle: { fontSize: 10, color: 'rgba(255,255,255,0.75)', textTransform: 'capitalize' },
  headerActions: { flexDirection: 'row', gap: 8, flexShrink: 0 },
  headerButton: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.12)', justifyContent: 'center', alignItems: 'center' },
  headerButtonDisabled: { backgroundColor: 'rgba(255,255,255,0.4)' },
  selectorCard: { margin: 12, backgroundColor: COLORS.white, borderRadius: 16, borderWidth: 1, borderColor: COLORS.gray100, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  paperSelector: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: COLORS.gray100, gap: 10 },
  selectorIcon: { width: 30, height: 30, borderRadius: 9, backgroundColor: COLORS.primaryLight, justifyContent: 'center', alignItems: 'center' },
  paperSelectorText: { fontSize: 13, fontWeight: '600', color: COLORS.gray700, flexShrink: 0 },
  paperSelectorValue: { fontSize: 11, color: COLORS.gray500, flex: 1, textAlign: 'right' },
  selectorLast: { borderBottomWidth: 0 },
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
  ratioHint: { fontSize: 11, color: COLORS.gray400, marginBottom: 12, textAlign: 'center', lineHeight: 15 },
});
