import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TemplateType } from '../types';
import { COLORS, INITIAL_RESUME } from '../constants';
import ResumePreview from './ResumePreview';

interface TemplateSelectorProps {
  currentTemplate: TemplateType;
  onSelect: (template: TemplateType) => void;
  onBack: () => void;
}

const templateGroups = [
  {
    name: 'Special',
    templates: [
      { id: 'customizable', name: 'Drag & Drop Builder', colors: [COLORS.primary, '#818cf8', '#c7d2fe'], description: 'Fully customizable layout' },
    ]
  },
  {
    name: 'Professional',
    templates: [
      { id: 'modern', name: 'Modern', colors: [COLORS.primary, COLORS.gray800, COLORS.gray100] },
      { id: 'ats', name: 'ATS Optimized', colors: ['#000000', '#6b7280', '#ffffff'] },
      { id: 'professional', name: 'Professional', colors: ['#374151', '#6b7280', '#f3f4f6'] },
      { id: 'corporate', name: 'Corporate', colors: ['#1f2937', '#6b7280', '#f3f4f6'] },
      { id: 'executive', name: 'Executive', colors: ['#111827', '#6b7280', '#f3f4f6'] },
      { id: 'classic', name: 'Classic', colors: ['#111827', '#e5e7eb', '#ffffff'] },
      { id: 'legal', name: 'Legal', colors: ['#111827', '#d1d5db', '#ffffff'] },
    ]
  },
  {
    name: 'Creative',
    templates: [
      { id: 'creative', name: 'Creative', colors: ['#9333ea', '#f472b6', '#f3e8ff'] },
      { id: 'artistic', name: 'Artistic', colors: ['#14b8a6', '#ec4899', '#fefce8'] },
      { id: 'playful', name: 'Playful', colors: ['#fb923c', '#fde047', '#fff7ed'] },
    ]
  },
  {
    name: 'Modern & Minimal',
    templates: [
      { id: 'minimal', name: 'Minimal', colors: ['#10b981', '#1e293b', '#f8fafc'] },
      { id: 'borderless', name: 'Borderless', colors: ['#ffffff', '#e2e8f0', '#f8fafc'] },
      { id: 'monochrome', name: 'Monochrome', colors: ['#1f2937', '#9ca3af', '#ffffff'] },
      { id: 'elegant', name: 'Elegant', colors: ['#111827', '#fef3c7', '#ffffff'] },
      { id: 'compact', name: 'Compact', colors: ['#f97316', '#1e293b', '#f8fafc'] },
      { id: 'technical', name: 'Technical', colors: ['#0891b2', '#1e293b', '#f8fafc'] },
      { id: 'tech-dark', name: 'Dark Mode', colors: ['#000000', '#4ade80', '#c084fc'] },
    ]
  },
  {
    name: 'Themed',
    templates: [
      { id: 'swiss', name: 'Swiss', colors: ['#dc2626', '#000000', '#ffffff'] },
      { id: 'academic', name: 'Academic', colors: ['#111827', '#6b7280', '#ffffff'] },
      { id: 'startup', name: 'Startup', colors: ['#ec4899', '#f97316', '#ffffff'] },
      { id: 'medical', name: 'Medical', colors: ['#059669', '#d1fae5', '#ffffff'] },
      { id: 'timeline', name: 'Timeline', colors: ['#2563eb', '#dbeafe', '#ffffff'] },
      { id: 'urban', name: 'Urban', colors: ['#1f2937', '#facc15', '#f8fafc'] },
      { id: 'nature', name: 'Nature', colors: ['#65a30d', '#166534', '#f7fee7'] },
    ]
  }
];

export default function TemplateSelector({ currentTemplate, onSelect, onBack }: TemplateSelectorProps) {
  const [previewTemplate, setPreviewTemplate] = useState<TemplateType | null>(null);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.gray700} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Choose Template</Text>
          <Text style={styles.headerSubtitle}>Select a style for your resume</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {templateGroups.map((group) => (
          <View key={group.name} style={styles.group}>
            <Text style={styles.groupTitle}>{group.name.toUpperCase()}</Text>
            <View style={styles.templateGrid}>
              {group.templates.map((template) => (
                <TouchableOpacity
                  key={template.id}
                  style={[styles.templateCard, currentTemplate === template.id && styles.templateCardActive]}
                  onPress={() => onSelect(template.id as TemplateType)}
                  activeOpacity={0.7}
                >
                  <View style={styles.templatePreview}>
                    {template.colors.map((color, idx) => (
                      <View key={idx} style={[styles.colorBar, { backgroundColor: color, flex: 1 }]} />
                    ))}
                  </View>
                  <Text style={styles.templateName}>{template.name}</Text>
                  {(template as any).description && (
                    <Text style={styles.templateDescription}>{(template as any).description}</Text>
                  )}
                  {currentTemplate === template.id && (
                    <View style={styles.checkBadge}>
                      <Ionicons name="checkmark" size={12} color={COLORS.white} />
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.previewButton}
                    onPress={() => setPreviewTemplate(template.id as TemplateType)}
                  >
                    <Ionicons name="eye" size={14} color={COLORS.gray400} />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={previewTemplate !== null} animationType="slide" presentationStyle="pageSheet" style={{ marginTop: 50 }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Template Preview</Text>
            <TouchableOpacity onPress={() => setPreviewTemplate(null)} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.gray700} />
            </TouchableOpacity>
          </View>
          <View style={styles.modalContent}>
            {previewTemplate && <ResumePreview data={INITIAL_RESUME} template={previewTemplate} />}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray50 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.gray200, gap: 12 },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.secondary },
  headerSubtitle: { fontSize: 12, color: COLORS.gray500 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  group: { marginBottom: 24 },
  groupTitle: { fontSize: 11, fontWeight: '700', color: COLORS.gray400, letterSpacing: 1, marginBottom: 12, paddingLeft: 4 },
  templateGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  templateCard: { width: '47%', backgroundColor: COLORS.white, borderRadius: 12, borderWidth: 2, borderColor: COLORS.gray100, padding: 12, position: 'relative' },
  templateCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  templatePreview: { flexDirection: 'row', height: 40, borderRadius: 8, overflow: 'hidden', marginBottom: 8, borderWidth: 1, borderColor: COLORS.gray100 },
  colorBar: {},
  templateName: { fontSize: 13, fontWeight: '600', color: COLORS.gray800 },
  templateDescription: { fontSize: 10, color: COLORS.gray500, marginTop: 2 },
  checkBadge: { position: 'absolute', top: 8, right: 8, width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  previewButton: { position: 'absolute', bottom: 8, right: 8, padding: 6, backgroundColor: COLORS.gray50, borderRadius: 6, borderWidth: 1, borderColor: COLORS.gray200 },
  modalContainer: { flex: 1, backgroundColor: COLORS.white },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.gray200 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: COLORS.secondary },
  closeButton: { padding: 8 },
  modalContent: { flex: 1, backgroundColor: COLORS.gray100, padding: 16 },
});
