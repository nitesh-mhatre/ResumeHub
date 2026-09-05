import React, { useState, useMemo, useEffect, useCallback, Component, ReactNode } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TemplateType, CustomTemplateConfig } from '../types';
import { COLORS, INITIAL_RESUME } from '../constants';

const BUILDER_STORAGE_KEY = '@resume_hub_custom_templates';

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
  const router = useRouter();
  const [previewTemplate, setPreviewTemplate] = useState<TemplateType | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [showCustomTemplate, setShowCustomTemplate] = useState(false);
  const [customName, setCustomName] = useState('My Custom Template');
  const [customBg, setCustomBg] = useState('#ffffff');
  const [customHeaderBg, setCustomHeaderBg] = useState('#1f2937');
  const [customHeaderColor, setCustomHeaderColor] = useState('#ffffff');
  const [customAccent, setCustomAccent] = useState('#2563eb');
  const [customText, setCustomText] = useState('#1f2937');
  const [customSubtext, setCustomSubtext] = useState('#64748b');

  // ─── Saved Custom Templates ───
  const [savedTemplates, setSavedTemplates] = useState<CustomTemplateConfig[]>([]);

  const loadSavedTemplates = useCallback(async () => {
    try {
      const json = await AsyncStorage.getItem(BUILDER_STORAGE_KEY);
      if (json) {
        const parsed: CustomTemplateConfig[] = JSON.parse(json);
        setSavedTemplates(parsed);
      }
    } catch (e) {
      console.warn('Failed to load saved templates:', e);
    }
  }, []);

  useEffect(() => {
    loadSavedTemplates();
  }, [loadSavedTemplates]);

  // Reload saved templates on mount and when navigating back
  useEffect(() => {
    loadSavedTemplates();
  }, [loadSavedTemplates]);

  const handleDeleteSavedTemplate = useCallback((templateId: string) => {
    Alert.alert(
      'Delete Template',
      'Are you sure you want to delete this custom template?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updated = savedTemplates.filter(t => t.id !== templateId);
              setSavedTemplates(updated);
              await AsyncStorage.setItem(BUILDER_STORAGE_KEY, JSON.stringify(updated));
            } catch (e) {
              console.warn('Failed to delete template:', e);
            }
          },
        },
      ]
    );
  }, [savedTemplates]);

  const handleUseSavedTemplate = useCallback((config: CustomTemplateConfig) => {
    // Save to active config key and navigate to builder
    const configKey = '@resume_hub_active_custom_config';
    AsyncStorage.setItem(configKey, JSON.stringify(config)).then(() => {
      router.push({
        pathname: '/builder',
        params: {
          template: 'custom',
          resumeData: JSON.stringify(INITIAL_RESUME),
          customConfigKey: configKey,
        },
      });
    });
  }, [router]);

  const handleEditSavedTemplate = useCallback((config: CustomTemplateConfig) => {
    router.push({
      pathname: '/templateBuilder',
      params: {
        editingConfigId: config.id,
        resumeData: JSON.stringify(INITIAL_RESUME),
      },
    });
  }, [router]);

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
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Choose Template</Text>
          <Text style={styles.headerSubtitle}>{filteredTemplates.length} templates available</Text>
        </View>
      </LinearGradient>

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
        {/* Build Custom Template with Drag & Drop */}
        <TouchableOpacity
          style={styles.buildCustomButton}
          onPress={() => router.push('/templateBuilder')}
        >
          <View style={styles.buildCustomIconWrap}>
            <Ionicons name="construct" size={20} color={COLORS.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.buildCustomTitle}>Build Custom Template</Text>
            <Text style={styles.buildCustomSubtitle}>Drag & drop sections, create headers, full control</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.white} />
        </TouchableOpacity>

        {/* Quick Custom Template (simple color picker) */}
        <TouchableOpacity style={styles.createCustomButton} onPress={() => setShowCustomTemplate(true)}>
          <Ionicons name="color-palette-outline" size={18} color={COLORS.primary} />
          <Text style={styles.createCustomText}>Quick Custom (Colors Only)</Text>
        </TouchableOpacity>

        {/* ═══ Saved Custom Templates ═══ */}
        {savedTemplates.length > 0 && (
          <View style={styles.savedSection}>
            <View style={styles.savedSectionHeader}>
              <Ionicons name="bookmark" size={16} color={COLORS.primary} />
              <Text style={styles.savedSectionTitle}>My Custom Templates</Text>
              <Text style={styles.savedCount}>{savedTemplates.length}</Text>
            </View>
            {savedTemplates.map((config) => {
              const colors = [
                config.globalStyles.accentColor,
                config.header.backgroundColor,
                config.globalStyles.backgroundColor,
              ];
              return (
                <TouchableOpacity
                  key={config.id}
                  style={styles.savedCard}
                  onPress={() => handleUseSavedTemplate(config)}
                  activeOpacity={0.7}
                >
                  <View style={styles.savedPreview}>
                    {colors.map((color, idx) => (
                      <View key={idx} style={[styles.savedColorBar, { backgroundColor: color, flex: 1 }]} />
                    ))}
                  </View>
                  <View style={styles.savedInfo}>
                    <Text style={styles.savedName} numberOfLines={1}>{config.name}</Text>
                    <Text style={styles.savedMeta}>
                      {config.sectionStyle} · {config.chipStyle} · {config.globalStyles.fontFamily}
                    </Text>
                  </View>
                  <View style={styles.savedActions}>
                    <TouchableOpacity
                      style={styles.savedActionBtn}
                      onPress={() => handleEditSavedTemplate(config)}
                    >
                      <Ionicons name="pencil" size={14} color={COLORS.gray500} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.savedActionBtn}
                      onPress={() => handleDeleteSavedTemplate(config.id)}
                    >
                      <Ionicons name="trash-outline" size={14} color={COLORS.danger} />
                    </TouchableOpacity>
                  </View>
                  {currentTemplate === 'custom' && (
                    <View style={styles.savedCheckBadge}>
                      <Ionicons name="checkmark" size={12} color={COLORS.white} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

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
        {filteredTemplates.length === 0 && savedTemplates.length === 0 && (
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
          <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Template Preview</Text>
            <TouchableOpacity onPress={() => setPreviewTemplate(null)} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </LinearGradient>
          <ScrollView style={styles.modalContent} contentContainerStyle={{ padding: 16 }}>
            {previewTemplate && <LazyPreview template={previewTemplate} />}
          </ScrollView>
        </View>
      </Modal>

      {/* Custom Template Modal */}
      <Modal visible={showCustomTemplate} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCustomTemplate(false)}>
              <Ionicons name="close" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Create Custom Template</Text>
            <TouchableOpacity onPress={() => {
              const customId = `custom-${Date.now()}`;
              onSelect(customId as TemplateType);
              setShowCustomTemplate(false);
            }}>
              <Text style={{ color: COLORS.white, fontWeight: '700', fontSize: 14 }}>Save</Text>
            </TouchableOpacity>
          </LinearGradient>
          <ScrollView style={styles.modalContent} contentContainerStyle={{ padding: 16, gap: 16 }}>
            {/* Template Name */}
            <View>
              <Text style={styles.customLabel}>Template Name</Text>
              <TextInput
                style={styles.customInput}
                value={customName}
                onChangeText={setCustomName}
                placeholder="My Custom Template"
              />
            </View>

            {/* Color Pickers */}
            <View>
              <Text style={styles.customLabel}>Background Color</Text>
              <TextInput style={styles.customInput} value={customBg} onChangeText={setCustomBg} placeholder="#ffffff" />
            </View>
            <View>
              <Text style={styles.customLabel}>Header Background</Text>
              <TextInput style={styles.customInput} value={customHeaderBg} onChangeText={setCustomHeaderBg} placeholder="#1f2937" />
            </View>
            <View>
              <Text style={styles.customLabel}>Header Text Color</Text>
              <TextInput style={styles.customInput} value={customHeaderColor} onChangeText={setCustomHeaderColor} placeholder="#ffffff" />
            </View>
            <View>
              <Text style={styles.customLabel}>Accent Color</Text>
              <TextInput style={styles.customInput} value={customAccent} onChangeText={setCustomAccent} placeholder="#2563eb" />
            </View>
            <View>
              <Text style={styles.customLabel}>Body Text Color</Text>
              <TextInput style={styles.customInput} value={customText} onChangeText={setCustomText} placeholder="#1f2937" />
            </View>
            <View>
              <Text style={styles.customLabel}>Subtext Color</Text>
              <TextInput style={styles.customInput} value={customSubtext} onChangeText={setCustomSubtext} placeholder="#64748b" />
            </View>

            {/* Preview */}
            <View style={{ marginTop: 10 }}>
              <Text style={styles.customLabel}>Preview</Text>
              <View style={[styles.customPreview, { backgroundColor: customBg }]}>
                <View style={[styles.customPreviewHeader, { backgroundColor: customHeaderBg }]}>
                  <Text style={[styles.customPreviewName, { color: customHeaderColor }]}>John Doe</Text>
                  <Text style={[styles.customPreviewJob, { color: customAccent }]}>Software Engineer</Text>
                </View>
                <View style={styles.customPreviewBody}>
                  <Text style={[styles.customPreviewSection, { color: customAccent }]}>EXPERIENCE</Text>
                  <Text style={[styles.customPreviewText, { color: customText }]}>Senior Developer at Tech Co.</Text>
                  <Text style={[styles.customPreviewSubtext, { color: customSubtext }]}>2020 - Present</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
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
const ErrorFallback = ({ onBack }: { onBack: () => void }) => {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Choose Template</Text>
          <Text style={styles.headerSubtitle}>Select a template to continue</Text>
        </View>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
        <View style={{ alignItems: 'center', paddingTop: 40, gap: 12 }}>
          <Ionicons name="alert-circle-outline" size={48} color={COLORS.gray300} />
          <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.gray600 }}>Some templates couldn't load</Text>
          <Text style={{ fontSize: 13, color: COLORS.gray400, textAlign: 'center', paddingHorizontal: 40 }}>Below are the built-in templates. Try refreshing the app if templates are missing.</Text>
        </View>
        <View style={[styles.templateGrid, { marginTop: 20 }]}>
          {builtinTemplates[0].templates.map((template) => (
            <TouchableOpacity
              key={template.id}
              style={[styles.templateCard]}
              onPress={() => router.push({ pathname: '/builder', params: { template: template.id, resumeData: JSON.stringify(INITIAL_RESUME) } })}
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
};

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
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 10, backgroundColor: COLORS.primary, gap: 6, elevation: 3, shadowColor: COLORS.primaryDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 6 },
  backButton: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexShrink: 0, backgroundColor: 'rgba(255,255,255,0.12)' },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: COLORS.white },
  headerSubtitle: { fontSize: 10, color: 'rgba(255,255,255,0.75)' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 12, marginTop: 12, marginBottom: 8, backgroundColor: COLORS.white, borderRadius: 12, paddingHorizontal: 12, borderWidth: 1, borderColor: COLORS.gray200, gap: 8, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4 },
  searchInput: { flex: 1, paddingVertical: 9, fontSize: 13, color: COLORS.gray800 },
  categoryBar: { maxHeight: 40 },
  categoryBarContent: { paddingHorizontal: 12, paddingBottom: 6, gap: 6 },
  categoryTab: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.gray200 },
  categoryTabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary, elevation: 1 },
  categoryTabText: { fontSize: 11, fontWeight: '600', color: COLORS.gray600 },
  categoryTabTextActive: { color: COLORS.white },
  scrollContent: { padding: 12, paddingBottom: 40 },
  templateGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  templateCard: { width: '31%', backgroundColor: COLORS.white, borderRadius: 14, borderWidth: 2, borderColor: COLORS.gray100, padding: 8, position: 'relative', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 },
  templateCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  templatePreview: { flexDirection: 'row', height: 44, borderRadius: 9, overflow: 'hidden', marginBottom: 6, borderWidth: 1, borderColor: COLORS.gray100 },
  colorBar: {},
  templateName: { fontSize: 11, fontWeight: '600', color: COLORS.gray800 },
  templateCategory: { fontSize: 8, color: COLORS.gray400, marginTop: 1 },
  checkBadge: { position: 'absolute', top: 6, right: 6, width: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.white },
  previewButton: { position: 'absolute', bottom: 6, right: 6, padding: 4, backgroundColor: COLORS.gray50, borderRadius: 6, borderWidth: 1, borderColor: COLORS.gray200 },
  emptyState: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyText: { fontSize: 16, fontWeight: '600', color: COLORS.gray500 },
  emptySubtext: { fontSize: 12, color: COLORS.gray400 },
  modalContainer: { flex: 1, backgroundColor: COLORS.white },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, elevation: 3, shadowColor: COLORS.primaryDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 6 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: COLORS.white },
  closeButton: { padding: 8 },
  modalContent: { flex: 1, backgroundColor: COLORS.gray100, padding: 16 },
  buildCustomButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.secondary,
    padding: 14, borderRadius: 12, marginBottom: 10, gap: 12, elevation: 3,
  },
  buildCustomIconWrap: {
    width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },
  buildCustomTitle: { fontSize: 14, fontWeight: '700', color: COLORS.white },
  buildCustomSubtitle: { fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  createCustomButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primaryLight, padding: 12, borderRadius: 10, marginBottom: 12, gap: 8, borderWidth: 1, borderColor: COLORS.primary + '30' },
  createCustomText: { fontSize: 13, fontWeight: '600', color: COLORS.primary },
  // Saved custom templates
  savedSection: { marginBottom: 12 },
  savedSectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8, marginTop: 4 },
  savedSectionTitle: { fontSize: 13, fontWeight: '700', color: COLORS.secondary, flex: 1 },
  savedCount: { fontSize: 11, fontWeight: '700', color: COLORS.white, backgroundColor: COLORS.primary, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, overflow: 'hidden' },
  savedCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
    borderRadius: 10, borderWidth: 2, borderColor: COLORS.gray100, padding: 8, marginBottom: 8, position: 'relative',
  },
  savedPreview: { flexDirection: 'row', width: 48, height: 36, borderRadius: 6, overflow: 'hidden', marginRight: 10, borderWidth: 1, borderColor: COLORS.gray100 },
  savedColorBar: {},
  savedInfo: { flex: 1 },
  savedName: { fontSize: 12, fontWeight: '700', color: COLORS.gray800 },
  savedMeta: { fontSize: 9, color: COLORS.gray400, marginTop: 1, textTransform: 'capitalize' },
  savedActions: { flexDirection: 'row', gap: 2 },
  savedActionBtn: { width: 30, height: 30, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
  savedCheckBadge: { position: 'absolute', top: 6, right: 6, width: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  // Quick custom modal
  customLabel: { fontSize: 13, fontWeight: '600', color: COLORS.gray700, marginBottom: 6 },
  customInput: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.gray200, borderRadius: 8, padding: 10, fontSize: 14, color: COLORS.gray800 },
  customPreview: { borderRadius: 8, borderWidth: 1, borderColor: COLORS.gray200, overflow: 'hidden' },
  customPreviewHeader: { padding: 12 },
  customPreviewName: { fontSize: 16, fontWeight: '800' },
  customPreviewJob: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  customPreviewBody: { padding: 10 },
  customPreviewSection: { fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 4 },
  customPreviewText: { fontSize: 11, fontWeight: '600' },
  customPreviewSubtext: { fontSize: 9, marginTop: 2 },
});
