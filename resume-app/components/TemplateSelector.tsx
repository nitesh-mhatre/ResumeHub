import React, { useState, useMemo, Component, ReactNode } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { TemplateType } from '../types';
import { COLORS, INITIAL_RESUME } from '../constants';

interface TemplateSelectorProps {
  currentTemplate: TemplateType;
  onSelect: (template: TemplateType) => void;
  onBack: () => void;
}

// Built-in hand-crafted templates (shown first)
const builtinTemplates = [
  { name: 'Hand-Crafted', templates: [
    { id: 'modern', name: 'Modern', colors: [COLORS.primary, COLORS.gray800, COLORS.gray100], category: 'Hand-Crafted' },
    { id: 'ats', name: 'ATS Optimized', colors: ['#000000', '#6b7280', '#ffffff'], category: 'Hand-Crafted' },
    { id: 'professional', name: 'Professional', colors: ['#374151', '#6b7280', '#f3f4f6'], category: 'Hand-Crafted' },
    { id: 'corporate', name: 'Corporate', colors: ['#1f2937', '#6b7280', '#f3f4f6'], category: 'Hand-Crafted' },
    { id: 'executive', name: 'Executive', colors: ['#111827', '#6b7280', '#f3f4f6'], category: 'Hand-Crafted' },
    { id: 'classic', name: 'Classic', colors: ['#111827', '#e5e7eb', '#ffffff'], category: 'Hand-Crafted' },
    { id: 'legal', name: 'Legal', colors: ['#111827', '#d1d5db', '#ffffff'], category: 'Hand-Crafted' },
    { id: 'minimal', name: 'Minimal', colors: ['#10b981', '#1e293b', '#f8fafc'], category: 'Hand-Crafted' },
    { id: 'creative', name: 'Creative', colors: ['#9333ea', '#f472b6', '#f3e8ff'], category: 'Hand-Crafted' },
    { id: 'artistic', name: 'Artistic', colors: ['#f97316', '#1f2937', '#f8fafc'], category: 'Hand-Crafted' },
    { id: 'playful', name: 'Playful', colors: ['#fb923c', '#fde047', '#fff7ed'], category: 'Hand-Crafted' },
    { id: 'elegant', name: 'Elegant', colors: ['#d97706', '#451a03', '#ffffff'], category: 'Hand-Crafted' },
    { id: 'compact', name: 'Compact', colors: ['#ea580c', '#1c1917', '#ffffff'], category: 'Hand-Crafted' },
    { id: 'technical', name: 'Technical', colors: ['#0891b2', '#1e293b', '#f8fafc'], category: 'Hand-Crafted' },
    { id: 'tech-dark', name: 'Dark Mode', colors: ['#0f172a', '#4ade80', '#c084fc'], category: 'Hand-Crafted' },
    { id: 'swiss', name: 'Swiss', colors: ['#dc2626', '#000000', '#ffffff'], category: 'Hand-Crafted' },
    { id: 'academic', name: 'Academic', colors: ['#374151', '#6b7280', '#ffffff'], category: 'Hand-Crafted' },
    { id: 'startup', name: 'Startup', colors: ['#ec4899', '#f97316', '#ffffff'], category: 'Hand-Crafted' },
    { id: 'medical', name: 'Medical', colors: ['#059669', '#d1fae5', '#ffffff'], category: 'Hand-Crafted' },
    { id: 'timeline', name: 'Timeline', colors: ['#2563eb', '#dbeafe', '#ffffff'], category: 'Hand-Crafted' },
    { id: 'urban', name: 'Urban', colors: ['#1f2937', '#facc15', '#f8fafc'], category: 'Hand-Crafted' },
    { id: 'nature', name: 'Nature', colors: ['#65a30d', '#166534', '#f7fee7'], category: 'Hand-Crafted' },
    { id: 'bold', name: 'Bold', colors: ['#7f1d1d', '#fca5a5', '#ffffff'], category: 'Hand-Crafted' },
    { id: 'monochrome', name: 'Monochrome', colors: ['#374151', '#9ca3af', '#ffffff'], category: 'Hand-Crafted' },
    { id: 'borderless', name: 'Borderless', colors: ['#ffffff', '#e2e8f0', '#f8fafc'], category: 'Hand-Crafted' },
  ]}
];

// Template factory loaded lazily inside component to avoid module-init crashes
let _getTemplatesByCategory: (() => Record<string, any[]>) | null = null;
let _factoryLoaded = false;
function loadTemplateFactory() {
  if (_factoryLoaded) return;
  _factoryLoaded = true;
  try {
    const tf = require('../utils/templateFactory');
    if (typeof tf.getTemplatesByCategory === 'function') {
      _getTemplatesByCategory = tf.getTemplatesByCategory;
    }
  } catch (e) {
    // Factory not available — using builtin templates only
  }
}

// Error Boundary to prevent render crashes from propagating
class TemplateErrorBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error) { console.warn('TemplateSelector error:', error.message); }
  render() { return this.state.hasError ? this.props.fallback : this.props.children; }
}

function TemplateSelectorInner({ currentTemplate, onSelect, onBack }: TemplateSelectorProps) {
  const [previewTemplate, setPreviewTemplate] = useState<TemplateType | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Load factory on first render only
  const factoryByCategory = useMemo(() => {
    try {
      loadTemplateFactory();
      if (_getTemplatesByCategory) {
        return _getTemplatesByCategory();
      }
    } catch (e) {
      // Silently ignore — builtin templates are always available
    }
    return {} as Record<string, any[]>;
  }, []);
  const categories = useMemo(() => ['All', 'Hand-Crafted', ...Object.keys(factoryByCategory)], [factoryByCategory]);

  const filteredTemplates = useMemo(() => {
    try {
      let results: { id: string; name: string; colors: string[]; category?: string }[] = [];

      if (activeCategory === 'All' || activeCategory === 'Hand-Crafted') {
        results = [...results, ...builtinTemplates[0].templates];
      }

      if (activeCategory === 'All') {
        for (const [cat, templates] of Object.entries(factoryByCategory)) {
          results = [...results, ...templates.map((t: any) => ({ id: t.id, name: t.name, colors: t.colors, category: cat }))];
        }
      } else if (factoryByCategory[activeCategory]) {
        results = [...results, ...factoryByCategory[activeCategory].map((t: any) => ({ id: t.id, name: t.name, colors: t.colors, category: t.category }))];
      }

      if (search.trim()) {
        const q = search.toLowerCase();
        results = results.filter(t => t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q));
      }

      return results;
    } catch (e) {
      console.warn('Failed to filter templates:', e);
      return builtinTemplates[0].templates;
    }
  }, [activeCategory, search, factoryByCategory]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={COLORS.gray700} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Choose Template</Text>
          <Text style={styles.headerSubtitle}>{filteredTemplates.length} templates available</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={16} color={COLORS.gray400} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search templates..."
          placeholderTextColor={COLORS.gray400}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={16} color={COLORS.gray400} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryBar} contentContainerStyle={styles.categoryBarContent}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryTab, activeCategory === cat && styles.categoryTabActive]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text style={[styles.categoryTabText, activeCategory === cat && styles.categoryTabTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Template Grid */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
        <View style={styles.templateGrid}>
          {filteredTemplates.map((template) => (
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
              <Text style={styles.templateName} numberOfLines={1}>{template.name}</Text>
              {template.category && <Text style={styles.templateCategory}>{template.category}</Text>}
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
        {filteredTemplates.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={COLORS.gray300} />
            <Text style={styles.emptyText}>No templates found</Text>
            <Text style={styles.emptySubtext}>Try a different search term</Text>
          </View>
        )}
      </ScrollView>

      {/* Preview Modal */}
      <Modal visible={previewTemplate !== null} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Template Preview</Text>
            <TouchableOpacity onPress={() => setPreviewTemplate(null)} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.gray700} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalContent} contentContainerStyle={{ padding: 16 }}>
            {previewTemplate && <LazyPreview template={previewTemplate} />}
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Lazy-loaded preview to avoid import crash
let _ResumePreview: any = null;
const LazyPreview: React.FC<{ template: TemplateType }> = ({ template }) => {
  if (!_ResumePreview) {
    try { _ResumePreview = require('./ResumePreview').default; } catch { return <View><Text>Preview unavailable</Text></View>; }
  }
  if (!_ResumePreview) return <View><Text>Preview unavailable</Text></View>;
  return <_ResumePreview data={INITIAL_RESUME} template={template} />;
};

// Fallback UI when component crashes
const ErrorFallback = ({ onBack }: { onBack: () => void }) => (
  <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={22} color={COLORS.gray700} />
      </TouchableOpacity>
      <View style={styles.headerText}>
        <Text style={styles.headerTitle}>Choose Template</Text>
        <Text style={styles.headerSubtitle}>Select a template to continue</Text>
      </View>
    </View>
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
      <View style={styles.templateGrid}>
        {builtinTemplates[0].templates.map((template) => (
          <TouchableOpacity
            key={template.id}
            style={[styles.templateCard]}
            onPress={() => {}}
            activeOpacity={0.7}
          >
            <View style={styles.templatePreview}>
              {template.colors.map((color, idx) => (
                <View key={idx} style={[styles.colorBar, { backgroundColor: color, flex: 1 }]} />
              ))}
            </View>
            <Text style={styles.templateName} numberOfLines={1}>{template.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  </SafeAreaView>
);

// Main export with error boundary
export default function TemplateSelector(props: TemplateSelectorProps) {
  return (
    <TemplateErrorBoundary fallback={<ErrorFallback onBack={props.onBack} />}>
      <TemplateSelectorInner {...props} />
    </TemplateErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray50 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 8, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.gray200, gap: 6 },
  backButton: { width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 15, fontWeight: '700', color: COLORS.secondary },
  headerSubtitle: { fontSize: 9, color: COLORS.gray500 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 12, marginTop: 10, marginBottom: 6, backgroundColor: COLORS.white, borderRadius: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: COLORS.gray200, gap: 8 },
  searchInput: { flex: 1, paddingVertical: 8, fontSize: 13, color: COLORS.gray800 },
  categoryBar: { maxHeight: 40 },
  categoryBarContent: { paddingHorizontal: 12, paddingBottom: 6, gap: 6 },
  categoryTab: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.gray200 },
  categoryTabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  categoryTabText: { fontSize: 11, fontWeight: '600', color: COLORS.gray600 },
  categoryTabTextActive: { color: COLORS.white },
  scrollContent: { padding: 12, paddingBottom: 40 },
  templateGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  templateCard: { width: '31%', backgroundColor: COLORS.white, borderRadius: 10, borderWidth: 2, borderColor: COLORS.gray100, padding: 8, position: 'relative' },
  templateCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  templatePreview: { flexDirection: 'row', height: 32, borderRadius: 6, overflow: 'hidden', marginBottom: 6, borderWidth: 1, borderColor: COLORS.gray100 },
  colorBar: {},
  templateName: { fontSize: 11, fontWeight: '600', color: COLORS.gray800 },
  templateCategory: { fontSize: 8, color: COLORS.gray400, marginTop: 1 },
  checkBadge: { position: 'absolute', top: 6, right: 6, width: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  previewButton: { position: 'absolute', bottom: 6, right: 6, padding: 4, backgroundColor: COLORS.gray50, borderRadius: 4, borderWidth: 1, borderColor: COLORS.gray200 },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyText: { fontSize: 16, fontWeight: '600', color: COLORS.gray500 },
  emptySubtext: { fontSize: 12, color: COLORS.gray400 },
  modalContainer: { flex: 1, backgroundColor: COLORS.white },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.gray200 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: COLORS.secondary },
  closeButton: { padding: 8 },
  modalContent: { flex: 1, backgroundColor: COLORS.gray100, padding: 16 },
});
