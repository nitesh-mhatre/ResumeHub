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

import ResumePreview from '../components/ResumePreview';
import { ResumeData, TemplateType, PaperSize } from '../types';
import { INITIAL_RESUME, COLORS, PAPER_SIZES } from '../constants';

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

  const currentPaper = PAPER_SIZES.find(p => p.id === paperSize) || PAPER_SIZES[0];

  const generateHTML = (data: ResumeData, size: PaperSize): string => {
    const paper = PAPER_SIZES.find(p => p.id === size) || PAPER_SIZES[0];
    return `
<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
${paper.css}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1e293b;line-height:1.5;font-size:12px}
.page{padding:32px;width:${paper.widthPx}px;margin:0 auto;background:#fff}
h1{font-size:24px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px}
.job-title{font-size:13px;font-weight:700;color:#4f46e5;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px}
.contact{font-size:11px;color:#64748b;margin-bottom:16px}.contact span{margin-right:10px}
.section{margin-bottom:16px}
.section-title{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#4f46e5;border-bottom:2px solid #e5e7eb;padding-bottom:3px;margin-bottom:8px}
.item{margin-bottom:12px}.item-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:2px}
.item-title{font-weight:700;font-size:13px}.item-date{font-size:10px;color:#94a3b8}
.item-company{font-size:11px;color:#4f46e5;margin-bottom:3px}.item-desc{font-size:11px;color:#475569;white-space:pre-line}
.skills{display:flex;flex-wrap:wrap;gap:4px}
.skill-tag{background:#e0e7ff;color:#4338ca;padding:3px 8px;border-radius:10px;font-size:10px;font-weight:600}
.summary{font-size:11px;color:#475569}
</style></head><body><div class="page">
<h1>${data.personalInfo.fullName}</h1>
<div class="job-title">${data.personalInfo.jobTitle}</div>
<div class="contact">
${data.personalInfo.email ? `<span>📧 ${data.personalInfo.email}</span>` : ''}
${data.personalInfo.phone ? `<span>📱 ${data.personalInfo.phone}</span>` : ''}
${data.personalInfo.location ? `<span>📍 ${data.personalInfo.location}</span>` : ''}
${data.personalInfo.linkedin ? `<span>💼 ${data.personalInfo.linkedin}</span>` : ''}
${data.personalInfo.website ? `<span>🌐 ${data.personalInfo.website}</span>` : ''}
</div>
${data.summary ? `<div class="section"><div class="section-title">Profile</div><div class="summary">${data.summary}</div></div>` : ''}
<div class="section"><div class="section-title">Experience</div>
${data.experience.map(exp => `<div class="item"><div class="item-header"><span class="item-title">${exp.title}</span><span class="item-date">${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}</span></div><div class="item-company">${exp.company}</div><div class="item-desc">${exp.description}</div></div>`).join('')}
</div>
<div class="section"><div class="section-title">Education</div>
${data.education.map(edu => `<div class="item"><div class="item-header"><span class="item-title">${edu.school}</span><span class="item-date">${edu.startDate} – ${edu.endDate}</span></div><div class="item-desc">${edu.degree}</div></div>`).join('')}
</div>
<div class="section"><div class="section-title">Skills</div><div class="skills">${data.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}</div></div>
${data.projects.length > 0 ? `<div class="section"><div class="section-title">Projects</div>${data.projects.map(p => `<div class="item"><div class="item-title">${p.name}</div><div class="item-desc">${p.description}</div></div>`).join('')}</div>` : ''}
${data.certificates.length > 0 ? `<div class="section"><div class="section-title">Certificates</div>${data.certificates.map(c => `<div class="item"><div class="item-title">${c.name}</div><div class="item-desc">${c.issuer} • ${c.date}</div></div>`).join('')}</div>` : ''}
${data.awards.length > 0 ? `<div class="section"><div class="section-title">Awards</div>${data.awards.map(a => `<div class="item"><div class="item-header"><span class="item-title">${a.name}</span><span class="item-date">${a.date}</span></div><div class="item-desc">${a.description}</div></div>`).join('')}</div>` : ''}
${data.languages.length > 0 ? `<div class="section"><div class="section-title">Languages</div><div class="skills">${data.languages.map(l => `<span class="skill-tag">${l}</span>`).join('')}</div></div>` : ''}
${data.interests.length > 0 ? `<div class="section"><div class="section-title">Interests</div><div class="skills">${data.interests.map(i => `<span class="skill-tag">${i}</span>`).join('')}</div></div>` : ''}
${data.customSections && data.customSections.length > 0 ? data.customSections.map(s => `<div class="section"><div class="section-title">${s.title}</div><div class="item-desc">${s.content}</div></div>`).join('') : ''}
</div></body></html>`;
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const html = generateHTML(resumeData, paperSize);
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
      await Share.share({
        message: jsonString,
        title: `${resumeData.personalInfo.fullName}_Resume.json`,
      });
    } catch (error) {
      Alert.alert('Save Failed', 'Could not share JSON file.');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({ message: 'Check out my resume created with Resume Hub!', title: 'My Resume' });
    } catch {}
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.gray700} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Resume Builder</Text>
          <Text style={styles.headerSubtitle}>Template: {template}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleSaveJSON}>
            <Ionicons name="save-outline" size={20} color={COLORS.gray600} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={20} color={COLORS.gray600} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerButton, styles.exportButton]} onPress={handleExportPDF} disabled={isExporting}>
            <Ionicons name="document-text-outline" size={20} color={COLORS.white} />
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ResumePreview data={resumeData} template={template} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.editButton} onPress={() => router.back()}>
          <Ionicons name="create-outline" size={18} color={COLORS.primary} />
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.jsonButton} onPress={handleSaveJSON}>
          <Ionicons name="document-outline" size={18} color={COLORS.white} />
          <Text style={styles.jsonButtonText}>JSON</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.exportBarButton, isExporting && styles.disabled]} onPress={handleExportPDF} disabled={isExporting}>
          <Ionicons name={isExporting ? 'hourglass-outline' : 'download-outline'} size={18} color={COLORS.white} />
          <Text style={styles.exportBarButtonText}>{isExporting ? 'Exporting...' : 'PDF'}</Text>
        </TouchableOpacity>
      </View>

      {/* Paper Size Picker Modal */}
      <Modal visible={showPaperPicker} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowPaperPicker(false)}>
          <View style={styles.modalContent}>
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
  header: { flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.gray200, gap: 8 },
  backButton: { padding: 6 },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: COLORS.secondary },
  headerSubtitle: { fontSize: 11, color: COLORS.gray500, textTransform: 'capitalize' },
  headerActions: { flexDirection: 'row', gap: 6 },
  headerButton: { padding: 7, borderRadius: 8, backgroundColor: COLORS.gray100 },
  exportButton: { backgroundColor: COLORS.primary },
  paperSelector: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 16, backgroundColor: COLORS.primaryLight, gap: 6 },
  paperSelectorText: { fontSize: 12, fontWeight: '600', color: COLORS.primary, flex: 1 },
  paperSelectorSize: { fontSize: 11, color: COLORS.gray500 },
  scrollContent: { padding: 12, paddingBottom: 90 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 12, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.gray200, gap: 8 },
  editButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 10, borderWidth: 2, borderColor: COLORS.primary, gap: 6 },
  editButtonText: { color: COLORS.primary, fontWeight: '700', fontSize: 14 },
  jsonButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.gray700, paddingVertical: 12, borderRadius: 10, gap: 6 },
  jsonButtonText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
  exportBarButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, paddingVertical: 12, borderRadius: 10, gap: 6 },
  disabled: { backgroundColor: COLORS.gray400 },
  exportBarButtonText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
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
