import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  HeaderConfig,
  HeaderLayoutType,
  SectionOrderItem,
  CustomTemplateConfig,
  ResumeData,
} from '../types';
import { COLORS, INITIAL_RESUME, FONT_FAMILY_OPTIONS, FONT_SIZE_OPTIONS } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Default Section Order ───
const DEFAULT_SECTIONS: SectionOrderItem[] = [
  { id: 'header', type: 'header', label: 'Header', visible: true },
  { id: 'summary', type: 'summary', label: 'Profile Summary', visible: true },
  { id: 'experience', type: 'experience', label: 'Experience', visible: true },
  { id: 'education', type: 'education', label: 'Education', visible: true },
  { id: 'skills', type: 'skills', label: 'Skills', visible: true },
  { id: 'projects', type: 'projects', label: 'Projects', visible: true },
  { id: 'certificates', type: 'certificates', label: 'Certificates', visible: false },
  { id: 'awards', type: 'awards', label: 'Awards', visible: false },
  { id: 'languages', type: 'languages', label: 'Languages', visible: false },
  { id: 'interests', type: 'interests', label: 'Interests', visible: false },
];

const HEADER_LAYOUTS: { id: HeaderLayoutType; name: string; icon: string; desc: string }[] = [
  { id: 'full-width', name: 'Full Width', icon: '📐', desc: 'Wide header spanning the full page' },
  { id: 'centered', name: 'Centered', icon: '🎯', desc: 'Center-aligned with symmetrical design' },
  { id: 'left-accent', name: 'Left Accent', icon: '⬅️', desc: 'Left border accent stripe' },
  { id: 'split', name: 'Split', icon: '🔀', desc: 'Two-column layout with info split' },
  { id: 'boxed', name: 'Boxed', icon: '📦', desc: 'Bordered box with padding' },
  { id: 'gradient', name: 'Gradient', icon: '🌈', desc: 'Bold colored background header' },
  { id: 'minimal', name: 'Minimal', icon: '✨', desc: 'Clean, simple text-only header' },
];

const SECTION_ICONS: Record<string, string> = {
  header: 'person',
  summary: 'document-text',
  experience: 'briefcase',
  education: 'school',
  skills: 'flash',
  projects: 'rocket',
  certificates: 'ribbon',
  awards: 'trophy',
  languages: 'globe',
  interests: 'heart',
  custom: 'create',
};

// ─── Color Presets ───
const COLOR_PRESETS = [
  { name: 'Indigo', accent: '#4f46e5', bg: '#ffffff', text: '#1e293b', subtext: '#64748b', border: '#e2e8f0' },
  { name: 'Blue', accent: '#2563eb', bg: '#ffffff', text: '#0f172a', subtext: '#475569', border: '#e2e8f0' },
  { name: 'Emerald', accent: '#059669', bg: '#ffffff', text: '#064e3b', subtext: '#047857', border: '#d1fae5' },
  { name: 'Rose', accent: '#e11d48', bg: '#ffffff', text: '#881337', subtext: '#be123c', border: '#fecdd3' },
  { name: 'Amber', accent: '#d97706', bg: '#ffffff', text: '#78350f', subtext: '#b45309', border: '#fef3c7' },
  { name: 'Purple', accent: '#7c3aed', bg: '#ffffff', text: '#3b0764', subtext: '#6b21a8', border: '#ede9fe' },
  { name: 'Teal', accent: '#0d9488', bg: '#ffffff', text: '#134e4a', subtext: '#0f766e', border: '#ccfbf1' },
  { name: 'Dark', accent: '#4ade80', bg: '#0f172a', text: '#e2e8f0', subtext: '#94a3b8', border: '#334155' },
  { name: 'Slate', accent: '#64748b', bg: '#ffffff', text: '#1e293b', subtext: '#475569', border: '#e2e8f0' },
  { name: 'Sunset', accent: '#f97316', bg: '#fff7ed', text: '#7c2d12', subtext: '#c2410c', border: '#fed7aa' },
];

// ─── Color Palette for picker ───
const COLOR_PALETTE = [
  // Reds
  '#ef4444', '#dc2626', '#b91c1c', '#e11d48', '#be123c', '#f43f5e',
  // Oranges
  '#f97316', '#ea580c', '#d97706', '#c2410c', '#fb923c', '#f59e0b',
  // Yellows
  '#eab308', '#facc15', '#fde047', '#fbbf24', '#f59e0b', '#ca8a04',
  // Greens
  '#22c55e', '#16a34a', '#059669', '#10b981', '#14b8a6', '#0d9488',
  // Teals/Cyans
  '#06b6d4', '#0891b2', '#0ea5e9', '#0284c7', '#2563eb', '#3b82f6',
  // Blues
  '#2563eb', '#1d4ed8', '#3b82f6', '#60a5fa', '#6366f1', '#4f46e5',
  // Indigos/Purples
  '#6366f1', '#4f46e5', '#7c3aed', '#8b5cf6', '#a855f7', '#9333ea',
  // Pinks
  '#ec4899', '#db2777', '#c026d3', '#d946ef', '#f472b6', '#e879f9',
  // Neutrals
  '#000000', '#111827', '#1e293b', '#334155', '#475569', '#64748b',
  '#94a3b8', '#cbd5e1', '#e2e8f0', '#f1f5f9', '#f8fafc', '#ffffff',
];

const BUILDER_STORAGE_KEY = '@resume_hub_custom_templates';

// ─── Full Preview Renderer ───
let _ResumePreview: any = null;
function getResumePreview() {
  if (!_ResumePreview) {
    try { _ResumePreview = require('../components/ResumePreview').default; } catch { return null; }
  }
  return _ResumePreview;
}

function PreviewRenderer({
  resumeData, headerConfig, sections, fontFamily, bodySize, accentColor,
  backgroundColor, textColor, subtextColor, borderColor, sectionStyle, chipStyle, itemStyle,
}: {
  resumeData: ResumeData;
  headerConfig: HeaderConfig;
  sections: SectionOrderItem[];
  fontFamily: string;
  bodySize: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  subtextColor: string;
  borderColor: string;
  sectionStyle: CustomTemplateConfig['sectionStyle'];
  chipStyle: CustomTemplateConfig['chipStyle'];
  itemStyle: CustomTemplateConfig['itemStyle'];
}) {
  const ResumePreview = getResumePreview();
  if (!ResumePreview) {
    return <View style={{ padding: 20, alignItems: 'center' }}><Text style={{ color: COLORS.gray400 }}>Preview unavailable</Text></View>;
  }

  const config: CustomTemplateConfig = {
    id: 'preview',
    name: 'Preview',
    header: headerConfig,
    sections,
    globalStyles: { fontFamily, bodySize, accentColor, backgroundColor, textColor, subtextColor, borderColor },
    sectionStyle,
    chipStyle,
    itemStyle,
  };

  return <ResumePreview data={resumeData} template="custom" customTemplateConfig={config} />;
}

// ─── Color Picker Modal ───
function ColorPickerModal({
  visible,
  onClose,
  onSelect,
  currentColor,
  title,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (color: string) => void;
  currentColor: string;
  title: string;
}) {
  const [hexInput, setHexInput] = useState(currentColor);

  useEffect(() => {
    setHexInput(currentColor);
  }, [currentColor]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={styles.cpOverlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.cpContent} onStartShouldSetResponder={() => true}>
          <View style={styles.cpHeader}>
            <Text style={styles.cpTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={22} color={COLORS.gray600} />
            </TouchableOpacity>
          </View>

          {/* Current color preview */}
          <View style={styles.cpCurrentRow}>
            <Text style={styles.cpCurrentLabel}>Current</Text>
            <View style={[styles.cpCurrentSwatch, { backgroundColor: currentColor }]} />
            <TextInput
              style={styles.cpHexInput}
              value={hexInput}
              onChangeText={setHexInput}
              placeholder="#000000"
              placeholderTextColor={COLORS.gray400}
              autoCapitalize="none"
              maxLength={7}
            />
            <TouchableOpacity
              style={styles.cpApplyBtn}
              onPress={() => {
                if (/^#[0-9a-fA-F]{6}$/.test(hexInput)) {
                  onSelect(hexInput);
                  onClose();
                } else {
                  Alert.alert('Invalid Color', 'Please enter a valid hex color (e.g. #4f46e5)');
                }
              }}
            >
              <Text style={styles.cpApplyText}>Apply</Text>
            </TouchableOpacity>
          </View>

          {/* Color grid */}
          <ScrollView style={{ maxHeight: 320 }} showsVerticalScrollIndicator={false}>
            <View style={styles.cpGrid}>
              {COLOR_PALETTE.map((color, idx) => (
                <TouchableOpacity
                  key={`${color}-${idx}`}
                  style={[
                    styles.cpSwatch,
                    { backgroundColor: color },
                    currentColor === color && styles.cpSwatchActive,
                  ]}
                  onPress={() => {
                    onSelect(color);
                    onClose();
                  }}
                >
                  {currentColor === color && (
                    <Ionicons name="checkmark" size={14} color={isLightColor(color) ? '#000000' : '#ffffff'} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

function isLightColor(hex: string): boolean {
  const clean = hex.replace('#', '');
  if (clean.length < 6) return true;
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5;
}

// ─── Color Row with Picker ───
function ColorPickerRow({
  label,
  color,
  onColorChange,
  onPress,
}: {
  label: string;
  color: string;
  onColorChange: (v: string) => void;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.colorRow} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.colorLabel}>{label}</Text>
      <View style={styles.colorInputRow}>
        <TouchableOpacity
          style={[styles.colorSwatch, { backgroundColor: color }]}
          onPress={onPress}
        />
        <TextInput
          style={styles.colorInput}
          value={color}
          onChangeText={onColorChange}
          placeholder="#000000"
          placeholderTextColor={COLORS.gray400}
        />
        <Ionicons name="color-fill" size={16} color={COLORS.gray400} />
      </View>
    </TouchableOpacity>
  );
}

export default function TemplateBuilderScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    resumeData?: string;
    template?: string;
    savedId?: string;
    editingConfigId?: string;
  }>();

  const [resumeData] = useState<ResumeData>(() => {
    if (params.resumeData) {
      try { return { ...INITIAL_RESUME, ...JSON.parse(params.resumeData) }; } catch { return INITIAL_RESUME; }
    }
    return INITIAL_RESUME;
  });

  // ─── Active Tab ───
  const [activeTab, setActiveTab] = useState<'header' | 'sections' | 'style'>('header');
  const scrollViewRef = useRef<ScrollView>(null);

  // ─── Header Config ───
  const [headerConfig, setHeaderConfig] = useState<HeaderConfig>({
    layout: 'full-width',
    backgroundColor: '#1e293b',
    textColor: '#ffffff',
    accentColor: '#4f46e5',
    showPhoto: false,
    showJobTitle: true,
    showContactRow: true,
    contactLayout: 'row',
  });

  // ─── Sections ───
  const [sections, setSections] = useState<SectionOrderItem[]>(DEFAULT_SECTIONS);

  // ─── Global Styles ───
  const [fontFamily, setFontFamily] = useState('System');
  const [bodySize, setBodySize] = useState('12px');
  const [accentColor, setAccentColor] = useState('#4f46e5');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#1e293b');
  const [subtextColor, setSubtextColor] = useState('#64748b');
  const [borderColor, setBorderColor] = useState('#e2e8f0');
  const [sectionStyle, setSectionStyle] = useState<CustomTemplateConfig['sectionStyle']>('underline');
  const [chipStyle, setChipStyle] = useState<CustomTemplateConfig['chipStyle']>('rounded');
  const [itemStyle, setItemStyle] = useState<CustomTemplateConfig['itemStyle']>('default');
  const [templateName, setTemplateName] = useState('My Custom Template');

  // ─── Load editing config if provided ───
  useEffect(() => {
    if (params.editingConfigId) {
      AsyncStorage.getItem(BUILDER_STORAGE_KEY).then(json => {
        if (json) {
          const configs: CustomTemplateConfig[] = JSON.parse(json);
          const editing = configs.find(c => c.id === params.editingConfigId);
          if (editing) {
            setTemplateName(editing.name);
            setHeaderConfig(editing.header);
            setSections(editing.sections);
            setFontFamily(editing.globalStyles.fontFamily);
            setBodySize(editing.globalStyles.bodySize);
            setAccentColor(editing.globalStyles.accentColor);
            setBackgroundColor(editing.globalStyles.backgroundColor);
            setTextColor(editing.globalStyles.textColor);
            setSubtextColor(editing.globalStyles.subtextColor);
            setBorderColor(editing.globalStyles.borderColor);
            setSectionStyle(editing.sectionStyle);
            setChipStyle(editing.chipStyle);
            setItemStyle(editing.itemStyle);
          }
        }
      });
    }
  }, [params.editingConfigId]);

  // ─── Color Picker state ───
  const [colorPickerTarget, setColorPickerTarget] = useState<string | null>(null);
  const [colorPickerTitle, setColorPickerTitle] = useState('');
  const [colorPickerCurrent, setColorPickerCurrent] = useState('#000000');

  const openColorPicker = useCallback((target: string, title: string, current: string) => {
    setColorPickerTarget(target);
    setColorPickerTitle(title);
    setColorPickerCurrent(current);
  }, []);

  const handleColorSelect = useCallback((color: string) => {
    setColorPickerCurrent(color);
    switch (colorPickerTarget) {
      case 'headerBg': setHeaderConfig(prev => ({ ...prev, backgroundColor: color })); break;
      case 'headerText': setHeaderConfig(prev => ({ ...prev, textColor: color })); break;
      case 'headerAccent': setHeaderConfig(prev => ({ ...prev, accentColor: color })); break;
      case 'accent': setAccentColor(color); break;
      case 'bg': setBackgroundColor(color); break;
      case 'text': setTextColor(color); break;
      case 'subtext': setSubtextColor(color); break;
      case 'border': setBorderColor(color); break;
    }
  }, [colorPickerTarget]);

  // ─── Modals ───
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [showHeaderLayoutPicker, setShowHeaderLayoutPicker] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [customSectionTitle, setCustomSectionTitle] = useState('');

  // ─── Move section up ───
  const moveSectionUp = useCallback((index: number) => {
    if (index === 0) return;
    setSections(prev => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }, []);

  // ─── Move section down ───
  const moveSectionDown = useCallback((index: number) => {
    setSections(prev => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }, []);

  // ─── Toggle section visibility ───
  const toggleSection = useCallback((id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s));
  }, []);

  // ─── Save template ───
  const handleSave = async () => {
    try {
      const config: CustomTemplateConfig = {
        id: `custom-${Date.now()}`,
        name: templateName || 'My Custom Template',
        header: headerConfig,
        sections,
        globalStyles: {
          fontFamily,
          bodySize,
          accentColor,
          backgroundColor,
          textColor,
          subtextColor,
          borderColor,
        },
        sectionStyle,
        chipStyle,
        itemStyle,
      };

      // Store config in AsyncStorage with a known key for the builder to pick up
      const configKey = `@resume_hub_active_custom_config`;
      await AsyncStorage.setItem(configKey, JSON.stringify(config));

      // Also save to the templates collection
      const existingJson = await AsyncStorage.getItem(BUILDER_STORAGE_KEY);
      const existing: CustomTemplateConfig[] = existingJson ? JSON.parse(existingJson) : [];
      existing.push(config);
      await AsyncStorage.setItem(BUILDER_STORAGE_KEY, JSON.stringify(existing));

      // Navigate to builder — pass only the config key (not the full JSON)
      router.push({
        pathname: '/builder',
        params: {
          template: 'custom',
          resumeData: JSON.stringify(resumeData),
          customConfigKey: configKey,
          ...(params.savedId ? { savedId: params.savedId } : {}),
        },
      });
    } catch (error) {
      Alert.alert('Save Failed', 'Could not save custom template.\n' + String(error));
    }
  };

  // ─── Apply color preset ───
  const applyPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setAccentColor(preset.accent);
    setBackgroundColor(preset.bg);
    setTextColor(preset.text);
    setSubtextColor(preset.subtext);
    setBorderColor(preset.border);
    // Also update header colors based on preset
    setHeaderConfig(prev => ({
      ...prev,
      backgroundColor: preset.text,
      textColor: preset.bg === '#ffffff' ? '#ffffff' : preset.text,
      accentColor: preset.accent,
    }));
    setShowPresets(false);
  };

  // ─── Section title editing ───
  const openSectionEditor = (section: SectionOrderItem) => {
    setEditingSection(section.id);
    setCustomSectionTitle(section.customTitle || section.label);
  };

  const saveSectionTitle = () => {
    if (editingSection) {
      setSections(prev => prev.map(s =>
        s.id === editingSection ? { ...s, customTitle: customSectionTitle || s.label } : s
      ));
    }
    setEditingSection(null);
  };

  const getSectionLabel = (section: SectionOrderItem) => section.customTitle || section.label;

  // ─── Delete custom section ───
  const deleteSection = useCallback((id: string) => {
    Alert.alert(
      'Delete Section',
      'Are you sure you want to remove this section?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => setSections(prev => prev.filter(s => s.id !== id)),
        },
      ],
    );
  }, []);

  // ─── Reset to defaults ───
  const resetToDefaults = useCallback(() => {
    Alert.alert(
      'Reset Template',
      'This will reset all style settings to defaults. Header layout and section order will be kept.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setFontFamily('System');
            setBodySize('12px');
            setAccentColor('#4f46e5');
            setBackgroundColor('#ffffff');
            setTextColor('#1e293b');
            setSubtextColor('#64748b');
            setBorderColor('#e2e8f0');
            setSectionStyle('underline');
            setChipStyle('rounded');
            setItemStyle('default');
            setHeaderConfig({
              layout: 'full-width',
              backgroundColor: '#1e293b',
              textColor: '#ffffff',
              accentColor: '#4f46e5',
              showPhoto: false,
              showJobTitle: true,
              showContactRow: true,
              contactLayout: 'row',
            });
          },
        },
      ],
    );
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Template Builder</Text>
          <Text style={styles.headerSubtitle}>Customize your resume layout</Text>
        </View>
        <TouchableOpacity style={styles.resetButton} onPress={resetToDefaults}>
          <Ionicons name="refresh" size={16} color={COLORS.white} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="checkmark" size={20} color={COLORS.primary} />
          <Text style={styles.saveButtonText}>Done</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Template Name */}
      <View style={styles.nameContainer}>
        <Ionicons name="pencil" size={14} color={COLORS.gray400} />
        <TextInput
          style={styles.nameInput}
          value={templateName}
          onChangeText={setTemplateName}
          placeholder="Template Name"
          placeholderTextColor={COLORS.gray400}
        />
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {(['header', 'sections', 'style'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Ionicons
              name={tab === 'header' ? 'person' : tab === 'sections' ? 'reorder-three' : 'color-palette'}
              size={16}
              color={activeTab === tab ? COLORS.white : COLORS.gray500}
            />
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Always-visible Live Preview ── */}
      <View style={styles.livePreviewContainer}>
        <View style={styles.livePreviewHeader}>
          <View style={styles.livePreviewDot} />
          <Text style={styles.livePreviewLabel}>Live Preview</Text>
          <Text style={styles.livePreviewCount}>
            {sections.filter(s => s.visible).length} sections
          </Text>
        </View>
        <ScrollView
          style={styles.livePreviewScroll}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
        >
          <PreviewRenderer
            resumeData={resumeData}
            headerConfig={headerConfig}
            sections={sections}
            fontFamily={fontFamily}
            bodySize={bodySize}
            accentColor={accentColor}
            backgroundColor={backgroundColor}
            textColor={textColor}
            subtextColor={subtextColor}
            borderColor={borderColor}
            sectionStyle={sectionStyle}
            chipStyle={chipStyle}
            itemStyle={itemStyle}
          />
        </ScrollView>
      </View>

      {/* ── Tab Controls (scrollable) ── */}
      <ScrollView ref={scrollViewRef} style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
        {/* ═══ HEADER TAB ═══ */}
        {activeTab === 'header' && (
          <View style={styles.sectionGroup}>
            {/* Header Layout Picker */}
            <Text style={styles.groupTitle}>Header Layout</Text>
            <Text style={styles.groupHint}>Choose how the top section of your resume looks.</Text>
            <View style={styles.layoutGrid}>
              {HEADER_LAYOUTS.map(layout => (
                <TouchableOpacity
                  key={layout.id}
                  style={[
                    styles.layoutCard,
                    headerConfig.layout === layout.id && styles.layoutCardActive,
                  ]}
                  onPress={() => setHeaderConfig(prev => ({ ...prev, layout: layout.id }))}
                  activeOpacity={0.7}
                >
                  <Text style={styles.layoutIcon}>{layout.icon}</Text>
                  <Text style={[
                    styles.layoutName,
                    headerConfig.layout === layout.id && styles.layoutNameActive,
                  ]}>{layout.name}</Text>
                  <Text style={styles.layoutDesc}>{layout.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Header Colors */}
            <Text style={styles.groupTitle}>Header Colors</Text>
            <ColorPickerRow
              label="Background"
              color={headerConfig.backgroundColor}
              onColorChange={v => setHeaderConfig(prev => ({ ...prev, backgroundColor: v }))}
              onPress={() => openColorPicker('headerBg', 'Header Background', headerConfig.backgroundColor)}
            />
            <ColorPickerRow
              label="Text Color"
              color={headerConfig.textColor}
              onColorChange={v => setHeaderConfig(prev => ({ ...prev, textColor: v }))}
              onPress={() => openColorPicker('headerText', 'Header Text', headerConfig.textColor)}
            />
            <ColorPickerRow
              label="Accent Color"
              color={headerConfig.accentColor}
              onColorChange={v => setHeaderConfig(prev => ({ ...prev, accentColor: v }))}
              onPress={() => openColorPicker('headerAccent', 'Header Accent', headerConfig.accentColor)}
            />

            {/* Header Toggles */}
            <Text style={styles.groupTitle}>Header Elements</Text>
            <ToggleRow
              label="Show Profile Photo"
              value={headerConfig.showPhoto}
              onToggle={() => setHeaderConfig(prev => ({ ...prev, showPhoto: !prev.showPhoto }))}
            />
            <ToggleRow
              label="Show Job Title"
              value={headerConfig.showJobTitle}
              onToggle={() => setHeaderConfig(prev => ({ ...prev, showJobTitle: !prev.showJobTitle }))}
            />
            <ToggleRow
              label="Show Contact Info"
              value={headerConfig.showContactRow}
              onToggle={() => setHeaderConfig(prev => ({ ...prev, showContactRow: !prev.showContactRow }))}
            />

            {/* Contact Layout */}
            {headerConfig.showContactRow && (
              <>
                <Text style={styles.subgroupTitle}>Contact Layout</Text>
                <View style={styles.optionRow}>
                  {(['row', 'grid', 'icons'] as const).map(cl => (
                    <TouchableOpacity
                      key={cl}
                      style={[styles.optionChip, headerConfig.contactLayout === cl && styles.optionChipActive]}
                      onPress={() => setHeaderConfig(prev => ({ ...prev, contactLayout: cl }))}
                    >
                      <Text style={[styles.optionChipText, headerConfig.contactLayout === cl && styles.optionChipTextActive]}>
                        {cl.charAt(0).toUpperCase() + cl.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}
          </View>
        )}

        {/* ═══ SECTIONS TAB ═══ */}
        {activeTab === 'sections' && (
          <View style={styles.sectionGroup}>
            <View style={styles.sectionGroupHeader}>
              <View>
                <Text style={styles.groupTitle}>Reorder Sections</Text>
                <Text style={styles.groupHint}>Tap arrows to reorder. Eye to show/hide.</Text>
              </View>
              <View style={styles.sectionCountBadge}>
                <Text style={styles.sectionCountText}>
                  {sections.filter(s => s.visible).length}/{sections.length}
                </Text>
              </View>
            </View>

            {sections.map((section, index) => (
              <View
                key={section.id}
                style={[styles.sectionRow, !section.visible && styles.sectionRowHidden]}
              >
                <View style={styles.sectionRowLeft}>
                  <View style={[styles.sectionIconWrap, { backgroundColor: section.visible ? COLORS.primaryLight : COLORS.gray100 }]}>
                    <Ionicons
                      name={(SECTION_ICONS[section.type] || 'ellipse') as any}
                      size={16}
                      color={section.visible ? COLORS.primary : COLORS.gray400}
                    />
                  </View>
                  <View style={styles.sectionInfo}>
                    <Text style={[styles.sectionLabel, !section.visible && styles.sectionLabelHidden]}>
                      {getSectionLabel(section)}
                    </Text>
                    {section.customTitle && (
                      <Text style={styles.sectionCustomLabel}>Custom title</Text>
                    )}
                  </View>
                </View>

                <View style={styles.sectionRowRight}>
                  {/* Edit title */}
                  <TouchableOpacity
                    style={styles.sectionActionBtn}
                    onPress={() => openSectionEditor(section)}
                  >
                    <Ionicons name="pencil" size={14} color={COLORS.gray400} />
                  </TouchableOpacity>

                  {/* Toggle visibility */}
                  <TouchableOpacity
                    style={styles.sectionActionBtn}
                    onPress={() => toggleSection(section.id)}
                  >
                    <Ionicons
                      name={section.visible ? 'eye' : 'eye-off'}
                      size={16}
                      color={section.visible ? COLORS.primary : COLORS.gray400}
                    />
                  </TouchableOpacity>

                  {/* Move up */}
                  <TouchableOpacity
                    style={[styles.sectionActionBtn, index === 0 && styles.sectionActionBtnDisabled]}
                    onPress={() => moveSectionUp(index)}
                    disabled={index === 0}
                  >
                    <Ionicons name="chevron-up" size={16} color={index === 0 ? COLORS.gray300 : COLORS.gray600} />
                  </TouchableOpacity>

                  {/* Move down */}
                  <TouchableOpacity
                    style={[styles.sectionActionBtn, index === sections.length - 1 && styles.sectionActionBtnDisabled]}
                    onPress={() => moveSectionDown(index)}
                    disabled={index === sections.length - 1}
                  >
                    <Ionicons name="chevron-down" size={16} color={index === sections.length - 1 ? COLORS.gray300 : COLORS.gray600} />
                  </TouchableOpacity>

                  {/* Delete (custom sections only) */}
                  {section.type === 'custom' && (
                    <TouchableOpacity
                      style={[styles.sectionActionBtn, styles.sectionDeleteBtn]}
                      onPress={() => deleteSection(section.id)}
                    >
                      <Ionicons name="trash-outline" size={14} color={COLORS.danger} />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}

            {/* Add Custom Section */}
            <TouchableOpacity
              style={styles.addSectionButton}
              onPress={() => {
                const newId = `custom-${Date.now()}`;
                setSections(prev => [
                  ...prev,
                  { id: newId, type: 'custom', label: 'New Custom Section', visible: true },
                ]);
              }}
            >
              <Ionicons name="add-circle-outline" size={18} color={COLORS.primary} />
              <Text style={styles.addSectionText}>Add Custom Section</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ═══ STYLE TAB ═══ */}
        {activeTab === 'style' && (
          <View style={styles.sectionGroup}>
            {/* Color Presets */}
            <Text style={styles.groupTitle}>Quick Presets</Text>
            <Text style={styles.groupHint}>Tap a preset to instantly apply a coordinated color scheme.</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.presetScroll}>
              {COLOR_PRESETS.map(preset => (
                <TouchableOpacity
                  key={preset.name}
                  style={styles.presetCard}
                  onPress={() => applyPreset(preset)}
                  activeOpacity={0.7}
                >
                  <View style={styles.presetSwatches}>
                    <View style={[styles.presetSwatch, { backgroundColor: preset.accent }]} />
                    <View style={[styles.presetSwatch, { backgroundColor: preset.text }]} />
                    <View style={[styles.presetSwatch, { backgroundColor: preset.bg, borderWidth: 1, borderColor: '#e2e8f0' }]} />
                  </View>
                  <Text style={styles.presetName}>{preset.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Custom Colors */}
            <Text style={styles.groupTitle}>Custom Colors</Text>
            <Text style={styles.groupHint}>Fine-tune each color individually. Tap the swatch for a color picker.</Text>
            <ColorPickerRow
              label="Accent"
              color={accentColor}
              onColorChange={setAccentColor}
              onPress={() => openColorPicker('accent', 'Accent Color', accentColor)}
            />
            <ColorPickerRow
              label="Background"
              color={backgroundColor}
              onColorChange={setBackgroundColor}
              onPress={() => openColorPicker('bg', 'Background Color', backgroundColor)}
            />
            <ColorPickerRow
              label="Text"
              color={textColor}
              onColorChange={setTextColor}
              onPress={() => openColorPicker('text', 'Text Color', textColor)}
            />
            <ColorPickerRow
              label="Subtext"
              color={subtextColor}
              onColorChange={setSubtextColor}
              onPress={() => openColorPicker('subtext', 'Subtext Color', subtextColor)}
            />
            <ColorPickerRow
              label="Border"
              color={borderColor}
              onColorChange={setBorderColor}
              onPress={() => openColorPicker('border', 'Border Color', borderColor)}
            />

            {/* Font */}
            <Text style={styles.groupTitle}>Font</Text>
            <TouchableOpacity style={styles.pickerButton} onPress={() => setShowFontPicker(true)}>
              <Text style={styles.pickerButtonText}>{fontFamily}</Text>
              <Ionicons name="chevron-down" size={16} color={COLORS.gray400} />
            </TouchableOpacity>

            <Text style={styles.groupTitle}>Body Size</Text>
            <TouchableOpacity style={styles.pickerButton} onPress={() => setShowSizePicker(true)}>
              <Text style={styles.pickerButtonText}>{bodySize}</Text>
              <Ionicons name="chevron-down" size={16} color={COLORS.gray400} />
            </TouchableOpacity>

            {/* Section Title Style */}
            <Text style={styles.groupTitle}>Section Titles</Text>
            <Text style={styles.groupHint}>Style applied to section headings throughout the resume.</Text>
            <View style={styles.optionRow}>
              {([
                { value: 'underline', label: 'Underline', icon: '—' },
                { value: 'background', label: 'Background', icon: '▮' },
                { value: 'border-left', label: 'Left Bar', icon: '▎' },
                { value: 'pill', label: 'Pill', icon: '⬭' },
                { value: 'minimal', label: 'Minimal', icon: '·' },
                { value: 'numbered', label: 'Numbered', icon: '#' },
              ] as const).map(s => (
                <TouchableOpacity
                  key={s.value}
                  style={[styles.optionChip, sectionStyle === s.value && styles.optionChipActive]}
                  onPress={() => setSectionStyle(s.value)}
                >
                  <Text style={[styles.optionChipIcon, sectionStyle === s.value && styles.optionChipTextActive]}>
                    {s.icon}
                  </Text>
                  <Text style={[styles.optionChipText, sectionStyle === s.value && styles.optionChipTextActive]}>
                    {s.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Chip Style */}
            <Text style={styles.groupTitle}>Skill Chips</Text>
            <Text style={styles.groupHint}>How skill tags and badges are displayed.</Text>
            <View style={styles.optionRow}>
              {([
                { value: 'rounded', label: 'Rounded' },
                { value: 'square', label: 'Square' },
                { value: 'pill', label: 'Pill' },
                { value: 'outlined', label: 'Outlined' },
                { value: 'filled', label: 'Filled' },
              ] as const).map(s => (
                <TouchableOpacity
                  key={s.value}
                  style={[styles.optionChip, chipStyle === s.value && styles.optionChipActive]}
                  onPress={() => setChipStyle(s.value)}
                >
                  <Text style={[styles.optionChipText, chipStyle === s.value && styles.optionChipTextActive]}>
                    {s.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Item Style */}
            <Text style={styles.groupTitle}>Experience Items</Text>
            <Text style={styles.groupHint}>How each experience/education entry is styled.</Text>
            <View style={styles.optionRow}>
              {([
                { value: 'default', label: 'Default' },
                { value: 'bordered', label: 'Bordered' },
                { value: 'card', label: 'Card' },
                { value: 'timeline', label: 'Timeline' },
                { value: 'compact', label: 'Compact' },
              ] as const).map(s => (
                <TouchableOpacity
                  key={s.value}
                  style={[styles.optionChip, itemStyle === s.value && styles.optionChipActive]}
                  onPress={() => setItemStyle(s.value)}
                >
                  <Text style={[styles.optionChipText, itemStyle === s.value && styles.optionChipTextActive]}>
                    {s.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

      </ScrollView>

      {/* ── Bottom Save Bar ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomSaveButton} onPress={handleSave} activeOpacity={0.8}>
          <Ionicons name="checkmark-circle" size={22} color={COLORS.white} />
          <Text style={styles.bottomSaveText}>Save & Apply Template</Text>
        </TouchableOpacity>
      </View>

      {/* ═══ Color Picker Modal ═══ */}
      <ColorPickerModal
        visible={colorPickerTarget !== null}
        onClose={() => setColorPickerTarget(null)}
        onSelect={handleColorSelect}
        currentColor={colorPickerCurrent}
        title={colorPickerTitle}
      />

      {/* ═══ Font Picker Modal ═══ */}
      <Modal visible={showFontPicker} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowFontPicker(false)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Select Font</Text>
            <ScrollView style={{ maxHeight: 350 }}>
              {FONT_FAMILY_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.paperOption, fontFamily === option.value && styles.paperOptionActive]}
                  onPress={() => { setFontFamily(option.value); setShowFontPicker(false); }}
                >
                  <Text style={[styles.paperOptionName, fontFamily === option.value && styles.paperOptionNameActive, { fontFamily: option.rnValue }]}>
                    {option.label}
                  </Text>
                  <Text style={styles.paperOptionSub}>Aa Bb Cc 123</Text>
                  {fontFamily === option.value && <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ═══ Size Picker Modal ═══ */}
      <Modal visible={showSizePicker} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowSizePicker(false)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Select Body Size</Text>
            {FONT_SIZE_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[styles.paperOption, bodySize === option.value && styles.paperOptionActive]}
                onPress={() => { setBodySize(option.value); setShowSizePicker(false); }}
              >
                <Text style={[styles.paperOptionName, bodySize === option.value && styles.paperOptionNameActive]}>
                  {option.label}
                </Text>
                <Text style={styles.paperOptionSub}>{option.value}</Text>
                {bodySize === option.value && <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ═══ Section Title Editor Modal ═══ */}
      <Modal visible={editingSection !== null} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setEditingSection(null)}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Edit Section Title</Text>
            <TextInput
              style={styles.modalInput}
              value={customSectionTitle}
              onChangeText={setCustomSectionTitle}
              placeholder="Section title"
              placeholderTextColor={COLORS.gray400}
              autoFocus
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setEditingSection(null)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={saveSectionTitle}>
                <Text style={styles.modalSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Toggle Row Component ───
function ToggleRow({ label, value, onToggle }: { label: string; value: boolean; onToggle: () => void }) {
  return (
    <TouchableOpacity style={styles.toggleRow} onPress={onToggle} activeOpacity={0.7}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <View style={[styles.toggleTrack, value && styles.toggleTrackOn]}>
        <View style={[styles.toggleThumb, value && styles.toggleThumbOn]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray50 },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 10,
    backgroundColor: COLORS.primary, gap: 6, elevation: 3,
    shadowColor: COLORS.primaryDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 6,
  },
  backButton: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexShrink: 0, backgroundColor: 'rgba(255,255,255,0.12)' },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: COLORS.white },
  headerSubtitle: { fontSize: 10, color: 'rgba(255,255,255,0.75)' },
  resetButton: {
    width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  saveButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, gap: 4,
  },
  saveButtonText: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },

  // Template name
  nameContainer: {
    flexDirection: 'row', alignItems: 'center', marginHorizontal: 12, marginTop: 8,
    backgroundColor: COLORS.white, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6,
    borderWidth: 1, borderColor: COLORS.gray200, gap: 6,
  },
  nameInput: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.secondary },

  // Tab bar
  tabBar: {
    flexDirection: 'row', marginHorizontal: 12, marginTop: 10, gap: 6,
    backgroundColor: COLORS.gray100, borderRadius: 10, padding: 3,
  },
  tab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 8, borderRadius: 8, gap: 4,
  },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 12, fontWeight: '600', color: COLORS.gray500 },
  tabTextActive: { color: COLORS.white },

  // Live preview area (always visible, improved styling)
  livePreviewContainer: {
    marginHorizontal: 12, marginTop: 8, backgroundColor: COLORS.white,
    borderRadius: 12, borderWidth: 1, borderColor: COLORS.gray200, overflow: 'hidden', elevation: 3,
    height: 260,
  },
  livePreviewHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 10, paddingTop: 6, paddingBottom: 4,
    backgroundColor: COLORS.gray50, borderBottomWidth: 1, borderBottomColor: COLORS.gray100,
  },
  livePreviewDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.success },
  livePreviewLabel: {
    fontSize: 9, fontWeight: '700', color: COLORS.gray400, textTransform: 'uppercase',
    letterSpacing: 1, flex: 1,
  },
  livePreviewCount: {
    fontSize: 9, fontWeight: '600', color: COLORS.gray300,
  },
  livePreviewScroll: { flex: 1 },

  // Bottom save bar
  bottomBar: {
    padding: 10, paddingBottom: 24, backgroundColor: COLORS.white,
    borderTopWidth: 1, borderTopColor: COLORS.gray200,
  },
  bottomSaveButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: 12, gap: 8,
  },
  bottomSaveText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },

  // Scroll
  scrollContent: { flex: 1 },
  scrollContentContainer: { padding: 12, paddingBottom: 20 },

  // Section groups
  sectionGroup: { marginBottom: 20 },
  sectionGroupHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: 8, marginTop: 8,
  },
  groupTitle: {
    fontSize: 14, fontWeight: '700', color: COLORS.secondary, marginBottom: 2, marginTop: 8,
  },
  groupHint: { fontSize: 11, color: COLORS.gray400, marginBottom: 10, marginTop: 2 },
  sectionCountBadge: {
    backgroundColor: COLORS.primaryLight, paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 10, marginTop: 2,
  },
  sectionCountText: {
    fontSize: 11, fontWeight: '700', color: COLORS.primary,
  },

  // Layout grid
  layoutGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  layoutCard: {
    width: '31%', backgroundColor: COLORS.white, borderRadius: 10, padding: 10,
    borderWidth: 2, borderColor: COLORS.gray100, alignItems: 'center',
  },
  layoutCardActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  layoutIcon: { fontSize: 20, marginBottom: 4 },
  layoutName: { fontSize: 11, fontWeight: '600', color: COLORS.gray700, textAlign: 'center' },
  layoutNameActive: { color: COLORS.primary },
  layoutDesc: { fontSize: 8, color: COLORS.gray400, textAlign: 'center', marginTop: 2 },

  // Colors
  colorRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 8, backgroundColor: COLORS.white, borderRadius: 8, padding: 10,
    borderWidth: 1, borderColor: COLORS.gray100,
  },
  colorLabel: { fontSize: 13, fontWeight: '500', color: COLORS.gray700 },
  colorInputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  colorSwatch: { width: 28, height: 28, borderRadius: 8, borderWidth: 1, borderColor: COLORS.gray200 },
  colorInput: {
    width: 80, fontSize: 12, fontFamily: 'monospace', color: COLORS.gray700,
    backgroundColor: COLORS.gray50, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4,
    borderWidth: 1, borderColor: COLORS.gray200,
  },

  // Toggles
  toggleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 10, paddingHorizontal: 12, backgroundColor: COLORS.white,
    borderRadius: 8, marginBottom: 6, borderWidth: 1, borderColor: COLORS.gray100,
  },
  toggleLabel: { fontSize: 13, fontWeight: '500', color: COLORS.gray700 },
  toggleTrack: {
    width: 44, height: 24, borderRadius: 12, backgroundColor: COLORS.gray300,
    justifyContent: 'center', paddingHorizontal: 2,
  },
  toggleTrackOn: { backgroundColor: COLORS.primary },
  toggleThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.white, elevation: 2 },
  toggleThumbOn: { alignSelf: 'flex-end' },

  // Section reorder list
  sectionRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.white, borderRadius: 10, padding: 10, marginBottom: 6,
    borderWidth: 1, borderColor: COLORS.gray100,
  },
  sectionRowHidden: { opacity: 0.5 },
  sectionRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  sectionIconWrap: {
    width: 32, height: 32, borderRadius: 8, justifyContent: 'center', alignItems: 'center',
  },
  sectionInfo: { flex: 1 },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: COLORS.gray800 },
  sectionLabelHidden: { color: COLORS.gray400 },
  sectionCustomLabel: { fontSize: 10, color: COLORS.primary, marginTop: 1 },
  sectionRowRight: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  sectionActionBtn: {
    width: 30, height: 30, borderRadius: 6, justifyContent: 'center', alignItems: 'center',
  },
  sectionActionBtnDisabled: { opacity: 0.3 },
  sectionDeleteBtn: { marginLeft: 2 },

  addSectionButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 12, borderRadius: 10, borderWidth: 1.5, borderColor: COLORS.primary,
    borderStyle: 'dashed', marginTop: 8, gap: 6,
  },
  addSectionText: { fontSize: 13, fontWeight: '600', color: COLORS.primary },

  // Option chips
  subgroupTitle: { fontSize: 12, fontWeight: '600', color: COLORS.gray500, marginTop: 10, marginBottom: 6 },
  optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  optionChip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16,
    backgroundColor: COLORS.white, borderWidth: 1.5, borderColor: COLORS.gray200, gap: 4,
  },
  optionChipIcon: {
    fontSize: 11, fontWeight: '700', color: COLORS.gray500,
  },
  optionChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  optionChipText: { fontSize: 11, fontWeight: '600', color: COLORS.gray600, textTransform: 'capitalize' },
  optionChipTextActive: { color: COLORS.white },

  // Presets
  presetScroll: { marginBottom: 10 },
  presetCard: {
    width: 72, alignItems: 'center', marginRight: 8, backgroundColor: COLORS.white,
    borderRadius: 10, padding: 8, borderWidth: 1, borderColor: COLORS.gray100,
  },
  presetSwatches: { flexDirection: 'row', gap: 2, marginBottom: 6 },
  presetSwatch: { width: 16, height: 16, borderRadius: 4 },
  presetName: { fontSize: 9, fontWeight: '600', color: COLORS.gray600 },

  // Picker button
  pickerButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.white, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
    borderWidth: 1, borderColor: COLORS.gray200, marginBottom: 8,
  },
  pickerButtonText: { fontSize: 13, fontWeight: '500', color: COLORS.gray700 },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalContent: { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, width: '100%', maxWidth: 340, elevation: 8 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: COLORS.secondary, marginBottom: 16, textAlign: 'center' },
  modalInput: {
    backgroundColor: COLORS.gray50, borderWidth: 1, borderColor: COLORS.gray200,
    borderRadius: 8, padding: 12, fontSize: 15, color: COLORS.gray800, marginBottom: 16,
  },
  modalActions: { flexDirection: 'row', gap: 10 },
  modalCancelBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: COLORS.gray100, alignItems: 'center' },
  modalCancelText: { fontSize: 14, fontWeight: '600', color: COLORS.gray600 },
  modalSaveBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: COLORS.primary, alignItems: 'center' },
  modalSaveText: { fontSize: 14, fontWeight: '600', color: COLORS.white },
  paperOption: {
    flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 10,
    borderWidth: 1.5, borderColor: COLORS.gray200, marginBottom: 8,
  },
  paperOptionActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLight },
  paperOptionName: { flex: 1, fontSize: 14, fontWeight: '600', color: COLORS.gray800 },
  paperOptionNameActive: { color: COLORS.primary },
  paperOptionSub: { fontSize: 11, color: COLORS.gray400, marginRight: 8 },

  // Color Picker Modal
  cpOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  cpContent: {
    backgroundColor: COLORS.white, borderRadius: 16, padding: 16, width: '100%', maxWidth: 360, elevation: 8,
  },
  cpHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cpTitle: { fontSize: 16, fontWeight: '700', color: COLORS.secondary },
  cpCurrentRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12,
    backgroundColor: COLORS.gray50, borderRadius: 10, padding: 10,
  },
  cpCurrentLabel: { fontSize: 11, fontWeight: '600', color: COLORS.gray500 },
  cpCurrentSwatch: { width: 32, height: 32, borderRadius: 8, borderWidth: 1, borderColor: COLORS.gray200 },
  cpHexInput: {
    flex: 1, fontSize: 13, fontFamily: 'monospace', color: COLORS.gray700,
    backgroundColor: COLORS.white, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 6,
    borderWidth: 1, borderColor: COLORS.gray200,
  },
  cpApplyBtn: {
    backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8,
  },
  cpApplyText: { color: COLORS.white, fontWeight: '700', fontSize: 12 },
  cpGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 6,
  },
  cpSwatch: {
    width: 42, height: 42, borderRadius: 8, borderWidth: 1, borderColor: COLORS.gray200,
    justifyContent: 'center', alignItems: 'center',
  },
  cpSwatchActive: {
    borderWidth: 3, borderColor: COLORS.primary, elevation: 2,
  },
});
