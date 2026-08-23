import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ResumeData, TemplateType } from '../types';
import { COLORS } from '../constants';
import { formatText } from '../utils/helpers';

interface ResumePreviewProps {
  data: ResumeData;
  template: TemplateType;
}

const SectionTitle: React.FC<{ children: string; style?: any }> = ({ children, style }) => (
  <Text style={[styles.sectionTitle, style]}>{children}</Text>
);

const ExtraSections: React.FC<{ data: ResumeData; titleColor?: string }> = ({ data, titleColor }) => (
  <>
    {data.projects && data.projects.length > 0 && (
      <View style={styles.section}>
        <SectionTitle style={{ color: titleColor }}>Projects</SectionTitle>
        {data.projects.map((proj) => (
          <View key={proj.id} style={styles.item}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>{proj.name}</Text>
              {proj.link ? <Text style={styles.itemLink}>{proj.link}</Text> : null}
            </View>
            <Text style={styles.itemDesc}>{formatText(proj.description)}</Text>
          </View>
        ))}
      </View>
    )}
    {data.certificates && data.certificates.length > 0 && (
      <View style={styles.section}>
        <SectionTitle style={{ color: titleColor }}>Certificates</SectionTitle>
        {data.certificates.map((cert) => (
          <View key={cert.id} style={[styles.item, { borderLeftWidth: 2, borderLeftColor: titleColor || COLORS.primary, paddingLeft: 12 }]}>
            <Text style={styles.itemTitle}>{cert.name}</Text>
            <Text style={styles.itemSub}>{cert.issuer} • {cert.date}</Text>
          </View>
        ))}
      </View>
    )}
    {data.awards && data.awards.length > 0 && (
      <View style={styles.section}>
        <SectionTitle style={{ color: titleColor }}>Awards</SectionTitle>
        {data.awards.map((award) => (
          <View key={award.id} style={styles.item}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>{award.name}</Text>
              <Text style={styles.itemDate}>{award.date}</Text>
            </View>
            <Text style={styles.itemSub}>{award.issuer}</Text>
            <Text style={styles.itemDesc}>{formatText(award.description)}</Text>
          </View>
        ))}
      </View>
    )}
    {((data.languages && data.languages.length > 0) || (data.interests && data.interests.length > 0)) && (
      <View style={styles.twoCol}>
        {data.languages && data.languages.length > 0 && (
          <View style={styles.half}>
            <SectionTitle style={{ color: titleColor }}>Languages</SectionTitle>
            <View style={styles.chips}>
              {data.languages.map(l => (
                <View key={l} style={[styles.chip, { borderColor: titleColor || COLORS.primary }]}>
                  <Text style={[styles.chipText, { color: titleColor || COLORS.primary }]}>{l}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        {data.interests && data.interests.length > 0 && (
          <View style={styles.half}>
            <SectionTitle style={{ color: titleColor }}>Interests</SectionTitle>
            <View style={styles.chips}>
              {data.interests.map(i => (
                <View key={i} style={[styles.chip, { borderColor: titleColor || COLORS.primary }]}>
                  <Text style={[styles.chipText, { color: titleColor || COLORS.primary }]}>{i}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    )}
    {data.customSections && data.customSections.length > 0 && data.customSections.map(section => (
      <View key={section.id} style={styles.section}>
        <SectionTitle style={{ color: titleColor }}>{section.title}</SectionTitle>
        <Text style={styles.itemDesc}>{formatText(section.content)}</Text>
      </View>
    ))}
  </>
);

// Modern Template
const ModernTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <View style={tStyles.modern.container}>
    <View style={tStyles.modern.header}>
      <Text style={tStyles.modern.name}>{data.personalInfo.fullName}</Text>
      <Text style={tStyles.modern.jobTitle}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.modern.contactRow}>
        {data.personalInfo.email ? <Text style={tStyles.modern.contact}>📧 {data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={tStyles.modern.contact}>📱 {data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={tStyles.modern.contact}>📍 {data.personalInfo.location}</Text> : null}
        {data.personalInfo.linkedin ? <Text style={tStyles.modern.contact}>💼 {data.personalInfo.linkedin}</Text> : null}
        {data.personalInfo.website ? <Text style={tStyles.modern.contact}>🌐 {data.personalInfo.website}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={styles.section}><SectionTitle style={{ color: COLORS.primary }}>Profile</SectionTitle><Text style={styles.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={styles.section}>
      <SectionTitle style={{ color: COLORS.primary }}>Experience</SectionTitle>
      {data.experience.map(exp => (
        <View key={exp.id} style={styles.item}>
          <View style={styles.itemHeader}><Text style={styles.itemTitle}>{exp.title}</Text><Text style={styles.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={styles.itemCompany}>{exp.company}</Text>
          <Text style={styles.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <SectionTitle style={{ color: COLORS.primary }}>Education</SectionTitle>
      {data.education.map(edu => (
        <View key={edu.id} style={styles.item}>
          <View style={styles.itemHeader}><Text style={styles.itemTitle}>{edu.school}</Text><Text style={styles.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={styles.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <SectionTitle style={{ color: COLORS.primary }}>Skills</SectionTitle>
      <View style={styles.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.modern.skillChip}><Text style={tStyles.modern.skillText}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor={COLORS.primary} />
  </View>
);

// Minimal Template
const MinimalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <View style={tStyles.min.container}>
    <View style={tStyles.min.header}>
      <Text style={tStyles.min.name}>{data.personalInfo.fullName}</Text>
      <Text style={tStyles.min.jobTitle}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.min.contactRow}>
        {data.personalInfo.email ? <Text style={tStyles.min.contact}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={tStyles.min.contact}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={tStyles.min.contact}>{data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={styles.section}><Text style={tStyles.min.secTitle}>PROFILE</Text><Text style={styles.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={styles.section}>
      <Text style={tStyles.min.secTitle}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={styles.item}>
          <View style={styles.itemHeader}><Text style={styles.itemTitle}>{exp.title}</Text><Text style={styles.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={styles.itemCompany}>{exp.company}</Text>
          <Text style={styles.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <Text style={tStyles.min.secTitle}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={styles.item}>
          <View style={styles.itemHeader}><Text style={styles.itemTitle}>{edu.school}</Text><Text style={styles.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={styles.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <Text style={tStyles.min.secTitle}>SKILLS</Text>
      <View style={styles.chips}>{data.skills.map(s => <View key={s} style={tStyles.min.skillChip}><Text style={tStyles.min.skillText}>{s}</Text></View>)}</View>
    </View>
    <ExtraSections data={data} />
  </View>
);

// ATS Template
const AtsTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <View style={tStyles.ats.container}>
    <View style={tStyles.ats.header}>
      <Text style={tStyles.ats.name}>{data.personalInfo.fullName}</Text>
      <Text style={tStyles.ats.jobTitle}>{data.personalInfo.jobTitle}</Text>
      <Text style={tStyles.ats.contactLine}>{[data.personalInfo.location, data.personalInfo.phone, data.personalInfo.email, data.personalInfo.linkedin, data.personalInfo.website].filter(Boolean).join(' | ')}</Text>
    </View>
    {data.summary ? <View style={styles.section}><Text style={tStyles.ats.secTitle}>SUMMARY</Text><Text style={styles.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={styles.section}><Text style={tStyles.ats.secTitle}>SKILLS</Text><Text style={styles.bodyText}>{data.skills.join(', ')}</Text></View>
    <View style={styles.section}>
      <Text style={tStyles.ats.secTitle}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={styles.item}>
          <View style={styles.itemHeader}><Text style={styles.itemTitle}>{exp.title}</Text><Text style={styles.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={styles.itemCompany}>{exp.company}, {exp.location}</Text>
          <Text style={styles.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <Text style={tStyles.ats.secTitle}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={styles.item}>
          <View style={styles.itemHeader}><Text style={styles.itemTitle}>{edu.school}</Text><Text style={styles.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={styles.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <ExtraSections data={data} />
  </View>
);

// Dark Template
const TechDarkTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <View style={tStyles.dark.container}>
    <View style={tStyles.dark.header}>
      <Text style={tStyles.dark.name}>&gt; {data.personalInfo.fullName}</Text>
      <Text style={tStyles.dark.jobTitle}>// {data.personalInfo.jobTitle}</Text>
      <View style={tStyles.dark.contactGrid}>
        <Text style={tStyles.dark.contact}>const email = "{data.personalInfo.email}"</Text>
        <Text style={tStyles.dark.contact}>const phone = "{data.personalInfo.phone}"</Text>
        <Text style={tStyles.dark.contact}>const loc = "{data.personalInfo.location}"</Text>
      </View>
    </View>
    {data.summary ? (
      <View style={styles.section}>
        <Text style={tStyles.dark.secTitle}>{'class Profile {'}</Text>
        <Text style={tStyles.dark.body}>{'  /* '}{formatText(data.summary)}{' */'}</Text>
        <Text style={tStyles.dark.secTitle}>{'}'}</Text>
      </View>
    ) : null}
    <View style={styles.section}>
      <Text style={tStyles.dark.secTitle}>{'function getExperience() {'}</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={tStyles.dark.item}>
          <Text style={tStyles.dark.itemTitle}>{exp.title} <Text style={{ color: '#64748b' }}>@ {exp.company}</Text></Text>
          <Text style={tStyles.dark.itemDate}>// {exp.startDate} to {exp.current ? 'NOW' : exp.endDate}</Text>
          <Text style={tStyles.dark.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
      <Text style={tStyles.dark.secTitle}>{'}'}</Text>
    </View>
    <View style={styles.section}>
      <Text style={[tStyles.dark.secTitle, { color: '#60a5fa' }]}>['Skills']</Text>
      <View style={styles.chips}>{data.skills.map(s => <View key={s} style={tStyles.dark.skillChip}><Text style={tStyles.dark.skillText}>{s}</Text></View>)}</View>
    </View>
    <View style={styles.section}>
      <Text style={[tStyles.dark.secTitle, { color: '#60a5fa' }]}>['Education']</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={styles.item}>
          <Text style={tStyles.dark.itemTitle}>{edu.school}</Text>
          <Text style={tStyles.dark.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <ExtraSections data={data} titleColor="#a78bfa" />
  </View>
);

// Creative Template
const CreativeTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <View style={tStyles.creative.container}>
    <View style={tStyles.creative.header}>
      <Text style={tStyles.creative.name}>{data.personalInfo.fullName}</Text>
      {data.personalInfo.jobTitle && <Text style={tStyles.creative.jobTitle}>{data.personalInfo.jobTitle}</Text>}
      <View style={tStyles.creative.contactRow}>
        {data.personalInfo.email ? <Text style={tStyles.creative.contact}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={tStyles.creative.contact}>{data.personalInfo.phone}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={styles.section}><Text style={tStyles.creative.secTitle}>About</Text><Text style={styles.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={styles.section}>
      <Text style={tStyles.creative.secTitle}>Experience</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={tStyles.creative.item}>
          <Text style={tStyles.creative.itemTitle}>{exp.title}</Text>
          <View style={tStyles.creative.badge}><Text style={tStyles.creative.badgeText}>{exp.company}</Text></View>
          <Text style={styles.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <Text style={tStyles.creative.secTitle}>Skills</Text>
      <View style={styles.chips}>{data.skills.map(s => <View key={s} style={tStyles.creative.skillChip}><Text style={tStyles.creative.skillText}>{s}</Text></View>)}</View>
    </View>
    <ExtraSections data={data} titleColor="#ec4899" />
  </View>
);

// Corporate Template
const CorporateTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <View style={tStyles.corp.container}>
    <View style={tStyles.corp.header}>
      <Text style={tStyles.corp.name}>{data.personalInfo.fullName}</Text>
      {data.personalInfo.jobTitle && <Text style={tStyles.corp.jobTitle}>{data.personalInfo.jobTitle}</Text>}
      <View style={tStyles.corp.contactRow}>
        <Text style={tStyles.corp.contact}>{data.personalInfo.email}</Text>
        <Text style={tStyles.corp.contact}>{data.personalInfo.phone}</Text>
        <Text style={tStyles.corp.contact}>{data.personalInfo.location}</Text>
      </View>
    </View>
    <View style={tStyles.corp.body}>
      <View style={{ flex: 2 }}>
        {data.summary ? <View style={styles.section}><Text style={tStyles.corp.secTitle}>Professional Summary</Text><Text style={styles.bodyText}>{data.summary}</Text></View> : null}
        <View style={styles.section}>
          <Text style={tStyles.corp.secTitle}>Experience</Text>
          {data.experience.map(exp => (
            <View key={exp.id} style={styles.item}>
              <Text style={styles.itemTitle}>{exp.title}</Text>
              <Text style={styles.itemCompany}>{exp.company} | {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</Text>
              <Text style={styles.itemDesc}>{formatText(exp.description)}</Text>
            </View>
          ))}
        </View>
        <ExtraSections data={data} />
      </View>
      <View style={tStyles.corp.sidebar}>
        <Text style={tStyles.corp.sideTitle}>Skills</Text>
        {data.skills.map(s => <Text key={s} style={tStyles.corp.skillItem}>• {s}</Text>)}
        <Text style={[tStyles.corp.sideTitle, { marginTop: 20 }]}>Education</Text>
        {data.education.map(edu => (
          <View key={edu.id} style={{ marginBottom: 12 }}>
            <Text style={tStyles.corp.eduSchool}>{edu.school}</Text>
            <Text style={tStyles.corp.eduDegree}>{edu.degree}</Text>
          </View>
        ))}
      </View>
    </View>
  </View>
);

// Swiss Template
const SwissTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <View style={tStyles.swiss.container}>
    <View style={tStyles.swiss.sidebar}>
      <Text style={tStyles.swiss.name}>{data.personalInfo.fullName}</Text>
      <Text style={tStyles.swiss.jobTitle}>{data.personalInfo.jobTitle}</Text>
      <View style={{ marginBottom: 16 }}>
        <Text style={tStyles.swiss.contact}>{data.personalInfo.email}</Text>
        <Text style={tStyles.swiss.contact}>{data.personalInfo.phone}</Text>
        <Text style={tStyles.swiss.contact}>{data.personalInfo.location}</Text>
      </View>
      <Text style={tStyles.swiss.sideTitle}>Skills</Text>
      {data.skills.map(s => <Text key={s} style={tStyles.swiss.skillItem}>{s}</Text>)}
      <Text style={[tStyles.swiss.sideTitle, { marginTop: 16 }]}>Education</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={{ marginBottom: 12 }}>
          <Text style={tStyles.swiss.eduSchool}>{edu.school}</Text>
          <Text style={tStyles.swiss.eduDegree}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={tStyles.swiss.main}>
      {data.summary ? <View style={styles.section}><Text style={styles.bodyText}>{data.summary}</Text></View> : null}
      <View style={styles.section}>
        <Text style={tStyles.swiss.secTitle}>Experience</Text>
        {data.experience.map(exp => (
          <View key={exp.id} style={tStyles.swiss.item}>
            <View style={tStyles.swiss.dateCol}>
              <Text style={tStyles.swiss.itemDate}>{exp.startDate}</Text>
              <Text style={tStyles.swiss.itemDate}>- {exp.current ? 'Present' : exp.endDate}</Text>
            </View>
            <View style={tStyles.swiss.contentCol}>
              <Text style={tStyles.swiss.itemTitle}>{exp.title}</Text>
              <Text style={tStyles.swiss.itemCompany}>{exp.company}</Text>
              <Text style={styles.bodyText}>{formatText(exp.description)}</Text>
            </View>
          </View>
        ))}
      </View>
      <ExtraSections data={data} titleColor="#dc2626" />
    </View>
  </View>
);

const templateMap: Record<string, React.FC<{ data: ResumeData }>> = {
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  ats: AtsTemplate,
  'tech-dark': TechDarkTemplate,
  creative: CreativeTemplate,
  corporate: CorporateTemplate,
  swiss: SwissTemplate,
};

export default function ResumePreview({ data, template }: ResumePreviewProps) {
  const TemplateComponent = templateMap[template] || ModernTemplate;
  return (
    <ScrollView style={styles.previewContainer} contentContainerStyle={styles.previewContent}>
      <TemplateComponent data={data} />
    </ScrollView>
  );
}

// Shared styles
const styles = StyleSheet.create({
  previewContainer: { flex: 1, backgroundColor: COLORS.gray100 },
  previewContent: { padding: 16 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, color: COLORS.primary },
  bodyText: { fontSize: 12, lineHeight: 20, color: COLORS.gray600 },
  item: { marginBottom: 12 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  itemTitle: { fontSize: 13, fontWeight: '700', color: COLORS.gray800, flex: 1 },
  itemDate: { fontSize: 11, color: COLORS.gray400 },
  itemCompany: { fontSize: 12, color: COLORS.primary, marginBottom: 4 },
  itemLink: { fontSize: 10, color: COLORS.gray400 },
  itemSub: { fontSize: 11, color: COLORS.gray400 },
  itemDesc: { fontSize: 12, lineHeight: 18, color: COLORS.gray600 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
  chipText: { fontSize: 10, fontWeight: '600' },
  twoCol: { flexDirection: 'row', gap: 16 },
  half: { flex: 1 },
});

const tStyles = {
  modern: StyleSheet.create({
    container: { backgroundColor: '#ffffff', borderRadius: 12, padding: 20, elevation: 4 },
    header: { borderBottomWidth: 2, borderBottomColor: COLORS.primary, paddingBottom: 16, marginBottom: 16 },
    name: { fontSize: 24, fontWeight: '800', color: COLORS.secondary, textTransform: 'uppercase', letterSpacing: 0.5 },
    jobTitle: { fontSize: 14, fontWeight: '700', color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 1, marginTop: 4, marginBottom: 12 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    contact: { fontSize: 11, color: COLORS.gray600 },
    skillChip: { backgroundColor: COLORS.primaryLight, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    skillText: { fontSize: 10, fontWeight: '600', color: COLORS.primaryDark },
  }),
  min: StyleSheet.create({
    container: { backgroundColor: '#ffffff', borderRadius: 12, padding: 20, elevation: 2 },
    header: { paddingBottom: 16, marginBottom: 16, borderBottomWidth: 1, borderBottomColor: COLORS.gray200 },
    name: { fontSize: 28, fontWeight: '800', color: '#000000' },
    jobTitle: { fontSize: 12, fontWeight: '700', color: '#000000', textTransform: 'uppercase', letterSpacing: 2, marginTop: 4, marginBottom: 12 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    contact: { fontSize: 11, color: COLORS.gray500 },
    secTitle: { fontSize: 12, fontWeight: '700', color: '#000000', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: COLORS.gray200, paddingBottom: 4 },
    skillChip: { borderWidth: 1, borderColor: '#000000', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
    skillText: { fontSize: 10, fontWeight: '600', color: '#000000' },
  }),
  ats: StyleSheet.create({
    container: { backgroundColor: '#ffffff', borderRadius: 12, padding: 20, elevation: 4 },
    header: { borderBottomWidth: 2, borderBottomColor: '#000000', paddingBottom: 12, marginBottom: 16 },
    name: { fontSize: 22, fontWeight: '800', color: '#000000', textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' },
    jobTitle: { fontSize: 12, fontWeight: '700', color: '#000000', textTransform: 'uppercase', letterSpacing: 2, textAlign: 'center', marginTop: 4, marginBottom: 8 },
    contactLine: { fontSize: 11, color: '#000000', textAlign: 'center' },
    secTitle: { fontSize: 14, fontWeight: '700', color: '#000000', textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: '#d1d5db', paddingBottom: 4, marginBottom: 8 },
  }),
  dark: StyleSheet.create({
    container: { backgroundColor: '#0f172a', borderRadius: 12, padding: 20 },
    header: { borderBottomWidth: 1, borderBottomColor: '#334155', paddingBottom: 16, marginBottom: 16 },
    name: { fontSize: 22, fontWeight: '800', color: '#4ade80', letterSpacing: -0.5 },
    jobTitle: { fontSize: 12, fontWeight: '700', color: '#64748b', marginTop: 4, marginBottom: 12 },
    contactGrid: { gap: 2 },
    contact: { fontSize: 11, color: '#64748b' },
    secTitle: { fontSize: 13, fontWeight: '700', color: '#c084fc', marginBottom: 8 },
    body: { fontSize: 12, lineHeight: 18, color: '#94a3b8' },
    item: { marginBottom: 12, paddingLeft: 12, borderLeftWidth: 1, borderLeftColor: '#334155' },
    itemTitle: { fontSize: 13, fontWeight: '700', color: '#fde68a' },
    itemDate: { fontSize: 11, color: '#64748b' },
    itemDesc: { fontSize: 12, lineHeight: 18, color: '#94a3b8' },
    skillChip: { backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
    skillText: { fontSize: 10, fontWeight: '600', color: '#4ade80' },
  }),
  creative: StyleSheet.create({
    container: { backgroundColor: '#fdf6e3', borderRadius: 12, padding: 20 },
    header: { marginBottom: 20 },
    name: { fontSize: 32, fontWeight: '900', color: COLORS.secondary },
    jobTitle: { fontSize: 16, fontWeight: '700', color: '#64748b', marginTop: 4, marginBottom: 12 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    contact: { fontSize: 12, color: '#64748b' },
    secTitle: { fontSize: 18, fontWeight: '800', color: '#14b8a6', marginBottom: 12, borderBottomWidth: 4, borderBottomColor: '#99f6e4', paddingBottom: 4 },
    item: { marginBottom: 16, backgroundColor: 'rgba(255,255,255,0.5)', padding: 12, borderRadius: 8 },
    itemTitle: { fontSize: 15, fontWeight: '800', color: COLORS.gray800, marginBottom: 4 },
    badge: { backgroundColor: '#fce7f3', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 8 },
    badgeText: { fontSize: 10, fontWeight: '700', color: '#ec4899' },
    skillChip: { borderWidth: 2, borderColor: COLORS.gray800, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
    skillText: { fontSize: 10, fontWeight: '700', color: COLORS.gray800 },
  }),
  corp: StyleSheet.create({
    container: { backgroundColor: '#ffffff', borderRadius: 12, overflow: 'hidden', elevation: 4 },
    header: { backgroundColor: '#1f2937', padding: 20 },
    name: { fontSize: 20, fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', letterSpacing: 2 },
    jobTitle: { fontSize: 11, fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 2, marginTop: 4 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 },
    contact: { fontSize: 10, color: '#cbd5e1' },
    body: { flexDirection: 'row', padding: 20, gap: 16 },
    secTitle: { fontSize: 14, fontWeight: '700', color: '#1f2937', textTransform: 'uppercase', borderBottomWidth: 2, borderBottomColor: '#1f2937', paddingBottom: 4, marginBottom: 8 },
    sidebar: { flex: 1, backgroundColor: '#f3f4f6', padding: 12, borderRadius: 8 },
    sideTitle: { fontSize: 11, fontWeight: '700', color: '#1f2937', textTransform: 'uppercase', marginBottom: 8 },
    skillItem: { fontSize: 11, color: '#475569', marginBottom: 4 },
    eduSchool: { fontSize: 12, fontWeight: '700', color: '#1f2937' },
    eduDegree: { fontSize: 11, color: '#64748b' },
  }),
  swiss: StyleSheet.create({
    container: { backgroundColor: '#ffffff', borderRadius: 12, flexDirection: 'row', overflow: 'hidden', elevation: 4 },
    sidebar: { width: 140, backgroundColor: '#ffffff', borderRightWidth: 4, borderRightColor: '#dc2626', padding: 16 },
    main: { flex: 1, padding: 16 },
    name: { fontSize: 22, fontWeight: '800', color: '#000000', marginBottom: 4 },
    jobTitle: { fontSize: 10, fontWeight: '700', color: '#dc2626', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
    contact: { fontSize: 10, color: '#000000', fontWeight: '700', marginBottom: 4 },
    sideTitle: { fontSize: 12, fontWeight: '800', color: '#000000', textTransform: 'uppercase', marginBottom: 8 },
    skillItem: { fontSize: 10, color: '#000000', marginBottom: 4 },
    eduSchool: { fontSize: 11, fontWeight: '700', color: '#000000' },
    eduDegree: { fontSize: 10, color: '#475569' },
    secTitle: { fontSize: 12, fontWeight: '800', color: '#000000', textTransform: 'uppercase', marginBottom: 12 },
    item: { flexDirection: 'row', marginBottom: 16, gap: 12 },
    dateCol: { width: 60 },
    itemDate: { fontSize: 10, fontWeight: '700', color: '#000000' },
    contentCol: { flex: 1 },
    itemTitle: { fontSize: 14, fontWeight: '800', color: '#000000' },
    itemCompany: { fontSize: 12, fontWeight: '700', color: '#475569', marginBottom: 4 },
  }),
};
