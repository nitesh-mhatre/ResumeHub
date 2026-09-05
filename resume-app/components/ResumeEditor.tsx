import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ResumeData } from '../types';
import { COLORS } from '../constants';
import { generateId } from '../utils/helpers';

interface ResumeEditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ResumeEditor({ data, onChange, onNext, onBack }: ResumeEditorProps) {
  const [activeSection, setActiveSection] = useState<string | null>('personal');

  const toggleSection = (section: string) => setActiveSection(activeSection === section ? null : section);

  const handleInfoChange = (field: keyof ResumeData['personalInfo'], value: string) => {
    onChange({ ...data, personalInfo: { ...data.personalInfo, [field]: value } });
  };

  const handleArrayChange = (section: 'experience' | 'education' | 'projects' | 'certificates' | 'awards', id: string, field: string, value: any) => {
    const list = data[section] as any[];
    onChange({ ...data, [section]: list.map(item => item.id === id ? { ...item, [field]: value } : item) });
  };

  const addItem = (section: 'experience' | 'education' | 'projects' | 'certificates' | 'awards') => {
    const id = generateId();
    let newItem: any;
    if (section === 'experience') newItem = { id, title: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' };
    else if (section === 'education') newItem = { id, degree: '', school: '', location: '', startDate: '', endDate: '' };
    else if (section === 'projects') newItem = { id, name: '', description: '', link: '' };
    else if (section === 'certificates') newItem = { id, name: '', issuer: '', date: '', link: '' };
    else newItem = { id, name: '', issuer: '', date: '', description: '' };
    onChange({ ...data, [section]: [...data[section], newItem] });
    setActiveSection(section);
  };

  const removeItem = (section: 'experience' | 'education' | 'projects' | 'certificates' | 'awards', id: string) => {
    onChange({ ...data, [section]: (data[section] as any[]).filter(item => item.id !== id) });
  };

  const renderSectionHeader = (title: string, section: string, icon: string) => (
    <TouchableOpacity style={styles.sectionHeader} onPress={() => toggleSection(section)} activeOpacity={0.7}>
      <View style={styles.sectionHeaderLeft}>
        <Ionicons name={icon as any} size={18} color={COLORS.primary} />
        <Text style={styles.sectionHeaderText}>{title}</Text>
      </View>
      <Ionicons name={activeSection === section ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.gray400} />
    </TouchableOpacity>
  );

  const renderInput = (placeholder: string, value: string, onChangeText: (text: string) => void, options?: { multiline?: boolean; numberOfLines?: number }) => (
    <TextInput
      style={[styles.input, options?.multiline && styles.inputMultiline]}
      placeholder={placeholder}
      placeholderTextColor={COLORS.gray400}
      value={value}
      onChangeText={onChangeText}
      multiline={options?.multiline}
      numberOfLines={options?.numberOfLines}
      textAlignVertical={options?.multiline ? 'top' : 'center'}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Your Details</Text>
          <Text style={styles.headerSubtitle}>Fill in your professional information</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scrollContent}>
        {/* Personal Info */}
        <View style={styles.section}>
          {renderSectionHeader('Personal Information', 'personal', 'person-outline')}
          {activeSection === 'personal' && (
            <View style={styles.sectionContent}>
              {renderInput('Full Name', data.personalInfo.fullName, (v) => handleInfoChange('fullName', v))}
              {renderInput('Email', data.personalInfo.email, (v) => handleInfoChange('email', v))}
              {renderInput('Phone', data.personalInfo.phone, (v) => handleInfoChange('phone', v))}
              {renderInput('Location', data.personalInfo.location, (v) => handleInfoChange('location', v))}
              {renderInput('LinkedIn URL', data.personalInfo.linkedin, (v) => handleInfoChange('linkedin', v))}
              {renderInput('Website / Portfolio', data.personalInfo.website, (v) => handleInfoChange('website', v))}
              {renderInput('Job Title', data.personalInfo.jobTitle, (v) => handleInfoChange('jobTitle', v))}
            </View>
          )}
        </View>

        {/* Summary */}
        <View style={styles.section}>
          {renderSectionHeader('Professional Summary', 'summary', 'document-text-outline')}
          {activeSection === 'summary' && (
            <View style={styles.sectionContent}>
              {renderInput('Brief professional summary...', data.summary, (v) => onChange({ ...data, summary: v }), { multiline: true, numberOfLines: 4 })}
            </View>
          )}
        </View>

        {/* Experience */}
        <View style={styles.section}>
          {renderSectionHeader('Experience', 'experience', 'briefcase-outline')}
          {activeSection === 'experience' && (
            <View style={styles.sectionContent}>
              {data.experience.map((exp) => (
                <View key={exp.id} style={styles.itemCard}>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => removeItem('experience', exp.id)}>
                    <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
                  </TouchableOpacity>
                  {renderInput('Job Title', exp.title, (v) => handleArrayChange('experience', exp.id, 'title', v))}
                  {renderInput('Company', exp.company, (v) => handleArrayChange('experience', exp.id, 'company', v))}
                  {renderInput('Location', exp.location, (v) => handleArrayChange('experience', exp.id, 'location', v))}
                  {renderInput('Start Date (YYYY-MM)', exp.startDate, (v) => handleArrayChange('experience', exp.id, 'startDate', v))}
                  {renderInput('End Date (YYYY-MM or Present)', exp.endDate, (v) => handleArrayChange('experience', exp.id, 'endDate', v))}
                  <View style={styles.switchRow}>
                    <Text style={styles.switchLabel}>I currently work here</Text>
                    <Switch value={exp.current} onValueChange={(v) => handleArrayChange('experience', exp.id, 'current', v)} trackColor={{ false: COLORS.gray200, true: COLORS.primaryLight }} thumbColor={exp.current ? COLORS.primary : COLORS.gray400} />
                  </View>
                  {renderInput('Description / Bullets', exp.description, (v) => handleArrayChange('experience', exp.id, 'description', v), { multiline: true, numberOfLines: 4 })}
                </View>
              ))}
              <TouchableOpacity style={styles.addButton} onPress={() => addItem('experience')}>
                <Ionicons name="add" size={18} color={COLORS.primary} />
                <Text style={styles.addButtonText}>Add Experience</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Skills */}
        <View style={styles.section}>
          {renderSectionHeader('Skills', 'skills', 'code-outline')}
          {activeSection === 'skills' && (
            <View style={styles.sectionContent}>
              {renderInput('Comma separated skills (e.g. React, Node.js)', data.skills.join(', '), (v) => onChange({ ...data, skills: v.split(',').map(s => s.trim()).filter(Boolean) }), { multiline: true, numberOfLines: 2 })}
            </View>
          )}
        </View>

        {/* Education */}
        <View style={styles.section}>
          {renderSectionHeader('Education', 'education', 'school-outline')}
          {activeSection === 'education' && (
            <View style={styles.sectionContent}>
              {data.education.map((edu) => (
                <View key={edu.id} style={styles.itemCard}>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => removeItem('education', edu.id)}>
                    <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
                  </TouchableOpacity>
                  {renderInput('Degree / Major', edu.degree, (v) => handleArrayChange('education', edu.id, 'degree', v))}
                  {renderInput('School / University', edu.school, (v) => handleArrayChange('education', edu.id, 'school', v))}
                  {renderInput('Location', edu.location, (v) => handleArrayChange('education', edu.id, 'location', v))}
                  {renderInput('Start Date', edu.startDate, (v) => handleArrayChange('education', edu.id, 'startDate', v))}
                  {renderInput('End Date', edu.endDate, (v) => handleArrayChange('education', edu.id, 'endDate', v))}
                </View>
              ))}
              <TouchableOpacity style={styles.addButton} onPress={() => addItem('education')}>
                <Ionicons name="add" size={18} color={COLORS.primary} />
                <Text style={styles.addButtonText}>Add Education</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Projects */}
        <View style={styles.section}>
          {renderSectionHeader('Projects', 'projects', 'folder-outline')}
          {activeSection === 'projects' && (
            <View style={styles.sectionContent}>
              {data.projects.map((proj) => (
                <View key={proj.id} style={styles.itemCard}>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => removeItem('projects', proj.id)}>
                    <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
                  </TouchableOpacity>
                  {renderInput('Project Name', proj.name, (v) => handleArrayChange('projects', proj.id, 'name', v))}
                  {renderInput('Project Link', proj.link, (v) => handleArrayChange('projects', proj.id, 'link', v))}
                  {renderInput('Project Description', proj.description, (v) => handleArrayChange('projects', proj.id, 'description', v), { multiline: true, numberOfLines: 3 })}
                </View>
              ))}
              <TouchableOpacity style={styles.addButton} onPress={() => addItem('projects')}>
                <Ionicons name="add" size={18} color={COLORS.primary} />
                <Text style={styles.addButtonText}>Add Project</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Certificates */}
        <View style={styles.section}>
          {renderSectionHeader('Certificates', 'certificates', 'ribbon-outline')}
          {activeSection === 'certificates' && (
            <View style={styles.sectionContent}>
              {data.certificates.map((cert) => (
                <View key={cert.id} style={styles.itemCard}>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => removeItem('certificates', cert.id)}>
                    <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
                  </TouchableOpacity>
                  {renderInput('Certificate Name', cert.name, (v) => handleArrayChange('certificates', cert.id, 'name', v))}
                  {renderInput('Issuer', cert.issuer, (v) => handleArrayChange('certificates', cert.id, 'issuer', v))}
                  {renderInput('Date', cert.date, (v) => handleArrayChange('certificates', cert.id, 'date', v))}
                  {renderInput('Link (URL)', cert.link, (v) => handleArrayChange('certificates', cert.id, 'link', v))}
                </View>
              ))}
              <TouchableOpacity style={styles.addButton} onPress={() => addItem('certificates')}>
                <Ionicons name="add" size={18} color={COLORS.primary} />
                <Text style={styles.addButtonText}>Add Certificate</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Awards */}
        <View style={styles.section}>
          {renderSectionHeader('Awards', 'awards', 'trophy-outline')}
          {activeSection === 'awards' && (
            <View style={styles.sectionContent}>
              {data.awards.map((award) => (
                <View key={award.id} style={styles.itemCard}>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => removeItem('awards', award.id)}>
                    <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
                  </TouchableOpacity>
                  {renderInput('Award Name', award.name, (v) => handleArrayChange('awards', award.id, 'name', v))}
                  {renderInput('Issuer', award.issuer, (v) => handleArrayChange('awards', award.id, 'issuer', v))}
                  {renderInput('Date', award.date, (v) => handleArrayChange('awards', award.id, 'date', v))}
                  {renderInput('Description', award.description, (v) => handleArrayChange('awards', award.id, 'description', v), { multiline: true, numberOfLines: 2 })}
                </View>
              ))}
              <TouchableOpacity style={styles.addButton} onPress={() => addItem('awards')}>
                <Ionicons name="add" size={18} color={COLORS.primary} />
                <Text style={styles.addButtonText}>Add Award</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Languages */}
        <View style={styles.section}>
          {renderSectionHeader('Languages', 'languages', 'globe-outline')}
          {activeSection === 'languages' && (
            <View style={styles.sectionContent}>
              {renderInput('Comma separated (e.g. English, Spanish)', data.languages.join(', '), (v) => onChange({ ...data, languages: v.split(',').map(s => s.trim()).filter(Boolean) }), { multiline: true, numberOfLines: 2 })}
            </View>
          )}
        </View>

        {/* Interests */}
        <View style={styles.section}>
          {renderSectionHeader('Interests', 'interests', 'heart-outline')}
          {activeSection === 'interests' && (
            <View style={styles.sectionContent}>
              {renderInput('Comma separated (e.g. Hiking, Photography)', data.interests.join(', '), (v) => onChange({ ...data, interests: v.split(',').map(s => s.trim()).filter(Boolean) }), { multiline: true, numberOfLines: 2 })}
            </View>
          )}
        </View>

        {/* Custom Sections */}
        <View style={styles.section}>
          {renderSectionHeader('Custom Sections', 'custom', 'options-outline')}
          {activeSection === 'custom' && (
            <View style={styles.sectionContent}>
              {data.customSections?.map((section) => (
                <View key={section.id} style={styles.itemCard}>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => onChange({ ...data, customSections: data.customSections?.filter(s => s.id !== section.id) })}>
                    <Ionicons name="trash-outline" size={18} color={COLORS.danger} />
                  </TouchableOpacity>
                  {renderInput('Section Title', section.title, (v) => {
                    onChange({ ...data, customSections: data.customSections?.map(s => s.id === section.id ? { ...s, title: v } : s) });
                  })}
                  <View style={styles.typeRow}>
                    <TouchableOpacity style={[styles.typeButton, section.type === 'text' && styles.typeButtonActive]} onPress={() => {
                      onChange({ ...data, customSections: data.customSections?.map(s => s.id === section.id ? { ...s, type: 'text' as const } : s) });
                    }}>
                      <Text style={[styles.typeButtonText, section.type === 'text' && styles.typeButtonTextActive]}>Text</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.typeButton, section.type === 'list' && styles.typeButtonActive]} onPress={() => {
                      onChange({ ...data, customSections: data.customSections?.map(s => s.id === section.id ? { ...s, type: 'list' as const } : s) });
                    }}>
                      <Text style={[styles.typeButtonText, section.type === 'list' && styles.typeButtonTextActive]}>List</Text>
                    </TouchableOpacity>
                  </View>
                  {renderInput(section.type === 'list' ? 'Enter list items (one per line)...' : 'Enter text content...', section.content, (v) => {
                    onChange({ ...data, customSections: data.customSections?.map(s => s.id === section.id ? { ...s, content: v } : s) });
                  }, { multiline: true, numberOfLines: 4 })}
                </View>
              ))}
              <TouchableOpacity style={styles.addButton} onPress={() => {
                const id = `custom-${generateId()}`;
                onChange({ ...data, customSections: [...(data.customSections || []), { id, title: 'New Section', content: '', type: 'text' as const }] });
              }}>
                <Ionicons name="add" size={18} color={COLORS.primary} />
                <Text style={styles.addButtonText}>Add Custom Section</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>Next: Preview Resume</Text>
          <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.gray50 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 10, backgroundColor: COLORS.primary, gap: 6, elevation: 3, shadowColor: COLORS.primaryDark, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 6 },
  backButton: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexShrink: 0, backgroundColor: 'rgba(255,255,255,0.12)' },
  headerText: { flex: 1, minWidth: 60 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: COLORS.white },
  headerSubtitle: { fontSize: 10, color: 'rgba(255,255,255,0.75)' },
  scrollContent: { padding: 16, paddingBottom: 24 },
  section: { marginBottom: 12, backgroundColor: COLORS.white, borderRadius: 12, borderWidth: 1, borderColor: COLORS.gray200, overflow: 'hidden' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: COLORS.gray50 },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionHeaderText: { fontSize: 15, fontWeight: '600', color: COLORS.gray700 },
  sectionContent: { padding: 16, gap: 12 },
  input: { borderWidth: 1, borderColor: COLORS.gray200, borderRadius: 8, padding: 12, fontSize: 14, color: COLORS.gray800, backgroundColor: COLORS.white },
  inputMultiline: { minHeight: 80, textAlignVertical: 'top' },
  itemCard: { borderWidth: 1, borderColor: COLORS.gray200, borderRadius: 8, padding: 12, backgroundColor: COLORS.gray50, gap: 8 },
  deleteButton: { position: 'absolute', top: 8, right: 8, padding: 4, zIndex: 1 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  switchLabel: { fontSize: 13, color: COLORS.gray600 },
  addButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderWidth: 2, borderColor: COLORS.gray200, borderStyle: 'dashed', borderRadius: 8, gap: 8 },
  addButtonText: { fontSize: 14, fontWeight: '500', color: COLORS.gray500 },
  typeRow: { flexDirection: 'row', gap: 8 },
  typeButton: { flex: 1, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: COLORS.gray200, alignItems: 'center' },
  typeButtonActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  typeButtonText: { fontSize: 12, fontWeight: '600', color: COLORS.gray600 },
  typeButtonTextActive: { color: COLORS.white },
  bottomBar: { padding: 12, paddingBottom: 28, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.gray200 },
  nextButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, paddingVertical: 14, borderRadius: 12, gap: 8 },
  nextButtonText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
});
