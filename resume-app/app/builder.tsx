import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import ResumePreview from '../components/ResumePreview';
import { ResumeData, TemplateType } from '../types';
import { INITIAL_RESUME, COLORS } from '../constants';

export default function BuilderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ template?: string; resumeData?: string }>();
  const template = (params.template || 'modern') as TemplateType;
  const [resumeData] = useState<ResumeData>(() => {
    if (params.resumeData) {
      try {
        return { ...INITIAL_RESUME, ...JSON.parse(params.resumeData) };
      } catch { return INITIAL_RESUME; }
    }
    return INITIAL_RESUME;
  });
  const [isExporting, setIsExporting] = useState(false);

  const generateHTML = (data: ResumeData): string => `
<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1e293b;line-height:1.5}
.page{padding:40px;max-width:800px;margin:0 auto}
h1{font-size:28px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px}
.job-title{font-size:14px;font-weight:700;color:#4f46e5;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px}
.contact{font-size:12px;color:#64748b;margin-bottom:20px}.contact span{margin-right:12px}
.section{margin-bottom:20px}
.section-title{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#4f46e5;border-bottom:2px solid #e5e7eb;padding-bottom:4px;margin-bottom:12px}
.item{margin-bottom:16px}.item-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:2px}
.item-title{font-weight:700;font-size:14px}.item-date{font-size:11px;color:#94a3b8}
.item-company{font-size:12px;color:#4f46e5;margin-bottom:4px}.item-desc{font-size:12px;color:#475569;white-space:pre-line}
.skills{display:flex;flex-wrap:wrap;gap:6px}
.skill-tag{background:#e0e7ff;color:#4338ca;padding:4px 10px;border-radius:12px;font-size:11px;font-weight:600}
.summary{font-size:12px;color:#475569}
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
</div></body></html>`;

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const html = generateHTML(resumeData);
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

  const handleShare = async () => {
    try {
      await Share.share({ message: 'Check out my resume created with Resume Hub!', title: 'My Resume' });
    } catch {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.gray700} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Resume Builder</Text>
          <Text style={styles.headerSubtitle}>Template: {template}</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={20} color={COLORS.gray600} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.headerButton, styles.exportButton]} onPress={handleExportPDF} disabled={isExporting}>
            <Ionicons name="document-text-outline" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ResumePreview data={resumeData} template={template} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.editButton} onPress={() => router.back()}>
          <Ionicons name="create-outline" size={18} color={COLORS.primary} />
          <Text style={styles.editButtonText}>Edit Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.exportBarButton, isExporting && styles.disabled]} onPress={handleExportPDF} disabled={isExporting}>
          <Ionicons name={isExporting ? 'hourglass-outline' : 'download-outline'} size={18} color={COLORS.white} />
          <Text style={styles.exportBarButtonText}>{isExporting ? 'Exporting...' : 'Export PDF'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray50 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.gray200, gap: 12 },
  backButton: { padding: 8 },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.secondary },
  headerSubtitle: { fontSize: 12, color: COLORS.gray500, textTransform: 'capitalize' },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerButton: { padding: 8, borderRadius: 8, backgroundColor: COLORS.gray100 },
  exportButton: { backgroundColor: COLORS.primary },
  scrollContent: { padding: 16, paddingBottom: 100 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', padding: 16, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.gray200, gap: 12 },
  editButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 12, borderWidth: 2, borderColor: COLORS.primary, gap: 8 },
  editButtonText: { color: COLORS.primary, fontWeight: '700', fontSize: 16 },
  exportBarButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: 12, gap: 8 },
  disabled: { backgroundColor: COLORS.gray400 },
  exportBarButtonText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
});
