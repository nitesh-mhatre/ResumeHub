import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ResumeData, TemplateType, CustomTemplateConfig, SectionOrderItem } from '../types';
import { COLORS } from '../constants';
import { formatText } from '../utils/helpers';
import GenericTemplate from './GenericTemplate';
import { getTemplateConfig } from '../utils/templateFactory';
import { GlobalStyle } from '../types';

// ─── Font Override Helpers ───
function getRNFontFamily(fontName?: string): string | undefined {
  if (!fontName) return undefined;
  // Handle CSS font stacks (comma-separated)
  if (fontName.includes(',')) {
    const first = fontName.split(',')[0].trim().replace(/^['"]|['"]$/g, '');
    return first || undefined;
  }
  // Single font name — return as-is (React Native expects single names)
  return fontName || undefined;
}

function bodySizeToPx(size?: string): number {
  if (!size) return 12;
  // Handle legacy named sizes
  switch (size) {
    case 'xs': return 11;
    case 'sm': return 12;
    case 'base': return 13;
    case 'lg': return 14;
  }
  // Handle numeric pixel values (e.g., '9', '10', '12', etc.)
  const num = parseInt(size, 10);
  if (!isNaN(num) && num >= 6 && num <= 36) return num;
  return 12;
}

interface FontOverrides {
  fontFamily?: string;
  offset: number;
  dyn: Record<string, any>;
}

const defaultDyn: Record<string, any> = {};
const FontContext = React.createContext<FontOverrides>({ offset: 0, dyn: defaultDyn });

function useFont() {
  return React.useContext(FontContext);
}

interface ResumePreviewProps {
  data: ResumeData;
  template: TemplateType;
  customTemplateConfig?: CustomTemplateConfig | null;
}

const SectionTitle: React.FC<{ children: string; style?: any }> = ({ children, style }) => {
  const { dyn } = useFont();
  return <Text style={[dyn.sectionTitle, style]}>{children}</Text>;
};

const ExtraSections: React.FC<{ data: ResumeData; titleColor?: string }> = ({ data, titleColor }) => {
  const { dyn } = useFont();
  return (
  <>
    {data.projects && data.projects.length > 0 && (
      <View style={dyn.section}>
        <SectionTitle style={{ color: titleColor }}>Projects</SectionTitle>
        {data.projects.map((proj) => (
          <View key={proj.id} style={dyn.item}>
            <View style={dyn.itemHeader}>
              <Text style={dyn.itemTitle}>{proj.name}</Text>
              {proj.link ? <Text style={dyn.itemLink}>{proj.link}</Text> : null}
            </View>
            <Text style={dyn.itemDesc}>{formatText(proj.description)}</Text>
          </View>
        ))}
      </View>
    )}
    {data.certificates && data.certificates.length > 0 && (
      <View style={dyn.section}>
        <SectionTitle style={{ color: titleColor }}>Certificates</SectionTitle>
        {data.certificates.map((cert) => (
          <View key={cert.id} style={[dyn.item, { borderLeftWidth: 2, borderLeftColor: titleColor || COLORS.primary, paddingLeft: 12 }]}>
            <Text style={dyn.itemTitle}>{cert.name}</Text>
            <Text style={dyn.itemSub}>{cert.issuer} • {cert.date}</Text>
          </View>
        ))}
      </View>
    )}
    {data.awards && data.awards.length > 0 && (
      <View style={dyn.section}>
        <SectionTitle style={{ color: titleColor }}>Awards</SectionTitle>
        {data.awards.map((award) => (
          <View key={award.id} style={dyn.item}>
            <View style={dyn.itemHeader}>
              <Text style={dyn.itemTitle}>{award.name}</Text>
              <Text style={dyn.itemDate}>{award.date}</Text>
            </View>
            <Text style={dyn.itemSub}>{award.issuer}</Text>
            <Text style={dyn.itemDesc}>{formatText(award.description)}</Text>
          </View>
        ))}
      </View>
    )}
    {((data.languages && data.languages.length > 0) || (data.interests && data.interests.length > 0)) && (
      <View style={dyn.twoCol}>
        {data.languages && data.languages.length > 0 && (
          <View style={dyn.half}>
            <SectionTitle style={{ color: titleColor }}>Languages</SectionTitle>
            <View style={dyn.chips}>
              {data.languages.map(l => (
                <View key={l} style={[dyn.chip, { borderColor: titleColor || COLORS.primary }]}>
                  <Text style={[dyn.chipText, { color: titleColor || COLORS.primary }]}>{l}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        {data.interests && data.interests.length > 0 && (
          <View style={dyn.half}>
            <SectionTitle style={{ color: titleColor }}>Interests</SectionTitle>
            <View style={dyn.chips}>
              {data.interests.map(i => (
                <View key={i} style={[dyn.chip, { borderColor: titleColor || COLORS.primary }]}>
                  <Text style={[dyn.chipText, { color: titleColor || COLORS.primary }]}>{i}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    )}
    {data.customSections && data.customSections.length > 0 && data.customSections.map(section => (
      <View key={section.id} style={dyn.section}>
        <SectionTitle style={{ color: titleColor }}>{section.title}</SectionTitle>
        <Text style={dyn.itemDesc}>{formatText(section.content)}</Text>
      </View>
    ))}
  </>
  );
};

// Modern Template
const ModernTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.modern.container}>
    <View style={tStyles.modern.header}>
      <Text style={[tStyles.modern.name, ff]}>{data.personalInfo.fullName}</Text>
      <Text style={[tStyles.modern.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.modern.contactRow}>
        {data.personalInfo.email ? <Text style={[tStyles.modern.contact, ff]}>📧 {data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={[tStyles.modern.contact, ff]}>📱 {data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={[tStyles.modern.contact, ff]}>📍 {data.personalInfo.location}</Text> : null}
        {data.personalInfo.linkedin ? <Text style={[tStyles.modern.contact, ff]}>💼 {data.personalInfo.linkedin}</Text> : null}
        {data.personalInfo.website ? <Text style={[tStyles.modern.contact, ff]}>🌐 {data.personalInfo.website}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={dyn.section}><SectionTitle style={{ color: COLORS.primary }}>Profile</SectionTitle><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}>
      <SectionTitle style={{ color: COLORS.primary }}>Experience</SectionTitle>
      {data.experience.map(exp => (
        <View key={exp.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={dyn.itemTitle}>{exp.title}</Text><Text style={dyn.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={dyn.itemCompany}>{exp.company}</Text>
          <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <SectionTitle style={{ color: COLORS.primary }}>Education</SectionTitle>
      {data.education.map(edu => (
        <View key={edu.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={dyn.itemTitle}>{edu.school}</Text><Text style={dyn.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={dyn.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <SectionTitle style={{ color: COLORS.primary }}>Skills</SectionTitle>
      <View style={dyn.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.modern.skillChip}><Text style={[tStyles.modern.skillText, ff]}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor={COLORS.primary} />
  </View>
  );
};

// Minimal Template
const MinimalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.min.container}>
    <View style={tStyles.min.header}>
      <Text style={[tStyles.min.name, ff]}>{data.personalInfo.fullName}</Text>
      <Text style={[tStyles.min.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.min.contactRow}>
        {data.personalInfo.email ? <Text style={[tStyles.min.contact, ff]}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={[tStyles.min.contact, ff]}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={[tStyles.min.contact, ff]}>{data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={dyn.section}><Text style={[tStyles.min.secTitle, ff]}>PROFILE</Text><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}>
      <Text style={[tStyles.min.secTitle, ff]}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={dyn.itemTitle}>{exp.title}</Text><Text style={dyn.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={dyn.itemCompany}>{exp.company}</Text>
          <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.min.secTitle, ff]}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={dyn.itemTitle}>{edu.school}</Text><Text style={dyn.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={dyn.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.min.secTitle, ff]}>SKILLS</Text>
      <View style={dyn.chips}>{data.skills.map(s => <View key={s} style={tStyles.min.skillChip}><Text style={[tStyles.min.skillText, ff]}>{s}</Text></View>)}</View>
    </View>
    <ExtraSections data={data} />
  </View>
  );
};

// ATS Template
const AtsTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.ats.container}>
    <View style={tStyles.ats.header}>
      <Text style={[tStyles.ats.name, ff]}>{data.personalInfo.fullName}</Text>
      <Text style={[tStyles.ats.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <Text style={[tStyles.ats.contactLine, ff]}>{[data.personalInfo.location, data.personalInfo.phone, data.personalInfo.email, data.personalInfo.linkedin, data.personalInfo.website].filter(Boolean).join(' | ')}</Text>
    </View>
    {data.summary ? <View style={dyn.section}><Text style={[tStyles.ats.secTitle, ff]}>SUMMARY</Text><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}><Text style={[tStyles.ats.secTitle, ff]}>SKILLS</Text><Text style={dyn.bodyText}>{data.skills.join(', ')}</Text></View>
    <View style={dyn.section}>
      <Text style={[tStyles.ats.secTitle, ff]}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={dyn.itemTitle}>{exp.title}</Text><Text style={dyn.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={dyn.itemCompany}>{exp.company}, {exp.location}</Text>
          <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.ats.secTitle, ff]}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={dyn.itemTitle}>{edu.school}</Text><Text style={dyn.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={dyn.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <ExtraSections data={data} />
  </View>
  );
};

// Dark Template
const TechDarkTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.dark.container}>
    <View style={tStyles.dark.header}>
      <Text style={[tStyles.dark.name, ff]}>&gt; {data.personalInfo.fullName}</Text>
      <Text style={[tStyles.dark.jobTitle, ff]}>// {data.personalInfo.jobTitle}</Text>
      <View style={tStyles.dark.contactGrid}>
        <Text style={[tStyles.dark.contact, ff]}>const email = "{data.personalInfo.email}"</Text>
        <Text style={[tStyles.dark.contact, ff]}>const phone = "{data.personalInfo.phone}"</Text>
        <Text style={[tStyles.dark.contact, ff]}>const loc = "{data.personalInfo.location}"</Text>
      </View>
    </View>
    {data.summary ? (
      <View style={dyn.section}>
        <Text style={[tStyles.dark.secTitle, ff]}>{'class Profile {'}</Text>
        <Text style={[tStyles.dark.body, ff]}>{'  /* '}{formatText(data.summary)}{' */'}</Text>
        <Text style={[tStyles.dark.secTitle, ff]}>{'}'}</Text>
      </View>
    ) : null}
    <View style={dyn.section}>
      <Text style={[tStyles.dark.secTitle, ff]}>{'function getExperience() {'}</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={tStyles.dark.item}>
          <Text style={[tStyles.dark.itemTitle, ff]}>{exp.title} <Text style={{ color: '#64748b' }}>@ {exp.company}</Text></Text>
          <Text style={[tStyles.dark.itemDate, ff]}>// {exp.startDate} to {exp.current ? 'NOW' : exp.endDate}</Text>
          <Text style={[tStyles.dark.itemDesc, ff]}>{formatText(exp.description)}</Text>
        </View>
      ))}
      <Text style={[tStyles.dark.secTitle, ff]}>{'}'}</Text>
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.dark.secTitle, { color: '#60a5fa' }, ff]}>['Skills']</Text>
      <View style={dyn.chips}>{data.skills.map(s => <View key={s} style={tStyles.dark.skillChip}><Text style={[tStyles.dark.skillText, ff]}>{s}</Text></View>)}</View>
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.dark.secTitle, { color: '#60a5fa' }, ff]}>['Education']</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={dyn.item}>
          <Text style={[tStyles.dark.itemTitle, ff]}>{edu.school}</Text>
          <Text style={[tStyles.dark.itemDesc, ff]}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <ExtraSections data={data} titleColor="#a78bfa" />
  </View>
  );
};

// Creative Template
const CreativeTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.creative.container}>
    <View style={tStyles.creative.header}>
      <Text style={[tStyles.creative.name, ff]}>{data.personalInfo.fullName}</Text>
      {data.personalInfo.jobTitle && <Text style={[tStyles.creative.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>}
      <View style={tStyles.creative.contactRow}>
        {data.personalInfo.email ? <Text style={[tStyles.creative.contact, ff]}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={[tStyles.creative.contact, ff]}>{data.personalInfo.phone}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={dyn.section}><Text style={[tStyles.creative.secTitle, ff]}>About</Text><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}>
      <Text style={[tStyles.creative.secTitle, ff]}>Experience</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={tStyles.creative.item}>
          <Text style={[tStyles.creative.itemTitle, ff]}>{exp.title}</Text>
          <View style={tStyles.creative.badge}><Text style={[tStyles.creative.badgeText, ff]}>{exp.company}</Text></View>
          <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.creative.secTitle, ff]}>Skills</Text>
      <View style={dyn.chips}>{data.skills.map(s => <View key={s} style={tStyles.creative.skillChip}><Text style={[tStyles.creative.skillText, ff]}>{s}</Text></View>)}</View>
    </View>
    <ExtraSections data={data} titleColor="#ec4899" />
  </View>
  );
};

// Corporate Template
const CorporateTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.corp.container}>
    <View style={tStyles.corp.header}>
      <Text style={[tStyles.corp.name, ff]}>{data.personalInfo.fullName}</Text>
      {data.personalInfo.jobTitle && <Text style={[tStyles.corp.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>}
      <View style={tStyles.corp.contactRow}>
        <Text style={[tStyles.corp.contact, ff]}>{data.personalInfo.email}</Text>
        <Text style={[tStyles.corp.contact, ff]}>{data.personalInfo.phone}</Text>
        <Text style={[tStyles.corp.contact, ff]}>{data.personalInfo.location}</Text>
      </View>
    </View>
    <View style={tStyles.corp.body}>
      <View style={{ flex: 2 }}>
        {data.summary ? <View style={dyn.section}><Text style={[tStyles.corp.secTitle, ff]}>Professional Summary</Text><Text style={dyn.bodyText}>{data.summary}</Text></View> : null}
        <View style={dyn.section}>
          <Text style={[tStyles.corp.secTitle, ff]}>Experience</Text>
          {data.experience.map(exp => (
            <View key={exp.id} style={dyn.item}>
              <Text style={dyn.itemTitle}>{exp.title}</Text>
              <Text style={dyn.itemCompany}>{exp.company} | {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</Text>
              <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
            </View>
          ))}
        </View>
        <ExtraSections data={data} />
      </View>
      <View style={tStyles.corp.sidebar}>
        <Text style={[tStyles.corp.sideTitle, ff]}>Skills</Text>
        {data.skills.map(s => <Text key={s} style={[tStyles.corp.skillItem, ff]}>• {s}</Text>)}
        <Text style={[tStyles.corp.sideTitle, { marginTop: 20 }, ff]}>Education</Text>
        {data.education.map(edu => (
          <View key={edu.id} style={{ marginBottom: 12 }}>
            <Text style={[tStyles.corp.eduSchool, ff]}>{edu.school}</Text>
            <Text style={[tStyles.corp.eduDegree, ff]}>{edu.degree}</Text>
          </View>
        ))}
      </View>
    </View>
  </View>
  );
};

// Swiss Template
const SwissTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.swiss.container}>
    <View style={tStyles.swiss.sidebar}>
      <Text style={[tStyles.swiss.name, ff]}>{data.personalInfo.fullName}</Text>
      <Text style={[tStyles.swiss.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <View style={{ marginBottom: 16 }}>
        <Text style={[tStyles.swiss.contact, ff]}>{data.personalInfo.email}</Text>
        <Text style={[tStyles.swiss.contact, ff]}>{data.personalInfo.phone}</Text>
        <Text style={[tStyles.swiss.contact, ff]}>{data.personalInfo.location}</Text>
      </View>
      <Text style={[tStyles.swiss.sideTitle, ff]}>Skills</Text>
      {data.skills.map(s => <Text key={s} style={[tStyles.swiss.skillItem, ff]}>{s}</Text>)}
      <Text style={[tStyles.swiss.sideTitle, { marginTop: 16 }, ff]}>Education</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={{ marginBottom: 12 }}>
          <Text style={[tStyles.swiss.eduSchool, ff]}>{edu.school}</Text>
          <Text style={[tStyles.swiss.eduDegree, ff]}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={tStyles.swiss.main}>
      {data.summary ? <View style={dyn.section}><Text style={dyn.bodyText}>{data.summary}</Text></View> : null}
      <View style={dyn.section}>
        <Text style={[tStyles.swiss.secTitle, ff]}>Experience</Text>
        {data.experience.map(exp => (
          <View key={exp.id} style={tStyles.swiss.item}>
            <View style={tStyles.swiss.dateCol}>
              <Text style={[tStyles.swiss.itemDate, ff]}>{exp.startDate}</Text>
              <Text style={[tStyles.swiss.itemDate, ff]}>- {exp.current ? 'Present' : exp.endDate}</Text>
            </View>
            <View style={tStyles.swiss.contentCol}>
              <Text style={[tStyles.swiss.itemTitle, ff]}>{exp.title}</Text>
              <Text style={[tStyles.swiss.itemCompany, ff]}>{exp.company}</Text>
              <Text style={dyn.bodyText}>{formatText(exp.description)}</Text>
            </View>
          </View>
        ))}
      </View>
      <ExtraSections data={data} titleColor="#dc2626" />
    </View>
  </View>
  );
};

// Professional Template (Navy Blue)
const ProfessionalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.prof.container}>
    <View style={tStyles.prof.header}>
      <Text style={[tStyles.prof.name, ff]}>{data.personalInfo.fullName}</Text>
      <Text style={[tStyles.prof.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.prof.contactRow}>
        {data.personalInfo.email ? <Text style={[tStyles.prof.contact, ff]}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={[tStyles.prof.contact, ff]}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={[tStyles.prof.contact, ff]}>{data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={dyn.section}><SectionTitle style={{ color: '#1e3a5f' }}>Professional Summary</SectionTitle><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}>
      <SectionTitle style={{ color: '#1e3a5f' }}>Experience</SectionTitle>
      {data.experience.map(exp => (
        <View key={exp.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={dyn.itemTitle}>{exp.title}</Text><Text style={dyn.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={{ fontSize: 12, color: '#1e3a5f', fontWeight: '600', marginBottom: 4, ...ff }}>{exp.company}</Text>
          <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <SectionTitle style={{ color: '#1e3a5f' }}>Education</SectionTitle>
      {data.education.map(edu => (
        <View key={edu.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={dyn.itemTitle}>{edu.school}</Text><Text style={dyn.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={dyn.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <SectionTitle style={{ color: '#1e3a5f' }}>Skills</SectionTitle>
      <View style={dyn.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.prof.skillChip}><Text style={[tStyles.prof.skillText, ff]}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#1e3a5f" />
  </View>
  );
};

// Executive Template
const ExecutiveTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.exec.container}>
    <View style={tStyles.exec.header}>
      <View style={tStyles.exec.nameRow}>
        <View style={tStyles.exec.nameAccent} />
        <Text style={[tStyles.exec.name, ff]}>{data.personalInfo.fullName}</Text>
      </View>
      <Text style={[tStyles.exec.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.exec.contactRow}>
        {data.personalInfo.email ? <Text style={[tStyles.exec.contact, ff]}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={[tStyles.exec.contact, ff]}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={[tStyles.exec.contact, ff]}>{data.personalInfo.location}</Text> : null}
        {data.personalInfo.linkedin ? <Text style={[tStyles.exec.contact, ff]}>{data.personalInfo.linkedin}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={dyn.section}><Text style={[tStyles.exec.secTitle, ff]}>EXECUTIVE SUMMARY</Text><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}>
      <Text style={[tStyles.exec.secTitle, ff]}>PROFESSIONAL EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={tStyles.exec.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.exec.itemTitle, ff]}>{exp.title}</Text><Text style={[tStyles.exec.itemDate, ff]}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={[tStyles.exec.itemCompany, ff]}>{exp.company}</Text>
          <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.exec.secTitle, ff]}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.exec.itemTitle, ff]}>{edu.school}</Text><Text style={[tStyles.exec.itemDate, ff]}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={dyn.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.exec.secTitle, ff]}>CORE COMPETENCIES</Text>
      <View style={dyn.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.exec.skillChip}><Text style={[tStyles.exec.skillText, ff]}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#111827" />
  </View>
  );
};

// Classic Template
const ClassicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.classic.container}>
    <View style={tStyles.classic.header}>
      <Text style={[tStyles.classic.name, ff]}>{data.personalInfo.fullName}</Text>
      <View style={tStyles.classic.divider} />
      <Text style={[tStyles.classic.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <Text style={[tStyles.classic.contactLine, ff]}>{[data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location].filter(Boolean).join('  •  ')}</Text>
    </View>
    {data.summary ? <View style={dyn.section}><Text style={[tStyles.classic.secTitle, ff]}>PROFILE</Text><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}>
      <Text style={[tStyles.classic.secTitle, ff]}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={dyn.itemTitle}>{exp.title}</Text><Text style={dyn.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={dyn.itemCompany}>{exp.company}</Text>
          <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.classic.secTitle, ff]}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={dyn.itemTitle}>{edu.school}</Text><Text style={dyn.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={dyn.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.classic.secTitle, ff]}>SKILLS</Text>
      <Text style={dyn.bodyText}>{data.skills.join(' • ')}</Text>
    </View>
    <ExtraSections data={data} titleColor="#374151" />
  </View>
  );
};

// Elegant Template (Gold accents)
const ElegantTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.elegant.container}>
    <View style={tStyles.elegant.header}>
      <Text style={[tStyles.elegant.name, ff]}>{data.personalInfo.fullName}</Text>
      <Text style={[tStyles.elegant.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.elegant.contactRow}>
        {data.personalInfo.email ? <Text style={[tStyles.elegant.contact, ff]}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={[tStyles.elegant.contact, ff]}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={[tStyles.elegant.contact, ff]}>{data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={dyn.section}><Text style={[tStyles.elegant.secTitle, ff]}>PROFILE</Text><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}>
      <Text style={[tStyles.elegant.secTitle, ff]}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={tStyles.elegant.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.elegant.itemTitle, ff]}>{exp.title}</Text><Text style={dyn.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={[tStyles.elegant.itemCompany, ff]}>{exp.company}</Text>
          <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.elegant.secTitle, ff]}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.elegant.itemTitle, ff]}>{edu.school}</Text><Text style={dyn.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={dyn.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.elegant.secTitle, ff]}>SKILLS</Text>
      <View style={dyn.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.elegant.skillChip}><Text style={[tStyles.elegant.skillText, ff]}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#92400e" />
  </View>
  );
};

// Artistic Template
const ArtisticTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.artistic.container}>
    <View style={tStyles.artistic.sidebar}>
      <Text style={[tStyles.artistic.name, ff]}>{data.personalInfo.fullName}</Text>
      <Text style={[tStyles.artistic.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <View style={{ marginTop: 16 }}>
        <Text style={[tStyles.artistic.sideLabel, ff]}>Contact</Text>
        {data.personalInfo.email ? <Text style={[tStyles.artistic.sideItem, ff]}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={[tStyles.artistic.sideItem, ff]}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={[tStyles.artistic.sideItem, ff]}>{data.personalInfo.location}</Text> : null}
      </View>
      <View style={{ marginTop: 20 }}>
        <Text style={[tStyles.artistic.sideLabel, ff]}>Skills</Text>
        {data.skills.map(s => <Text key={s} style={[tStyles.artistic.skillItem, ff]}>▹ {s}</Text>)}
      </View>
      {data.languages && data.languages.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={[tStyles.artistic.sideLabel, ff]}>Languages</Text>
          {data.languages.map(l => <Text key={l} style={[tStyles.artistic.sideItem, ff]}>{l}</Text>)}
        </View>
      )}
    </View>
    <View style={tStyles.artistic.main}>
      {data.summary ? <View style={dyn.section}><Text style={[tStyles.artistic.secTitle, ff]}>About Me</Text><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
      <View style={dyn.section}>
        <Text style={[tStyles.artistic.secTitle, ff]}>Experience</Text>
        {data.experience.map(exp => (
          <View key={exp.id} style={tStyles.artistic.item}>
            <View style={tStyles.artistic.dot} />
            <View style={{ flex: 1 }}>
              <Text style={[tStyles.artistic.itemTitle, ff]}>{exp.title}</Text>
              <Text style={[tStyles.artistic.itemCompany, ff]}>{exp.company} • {exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text>
              <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={dyn.section}>
        <Text style={[tStyles.artistic.secTitle, ff]}>Education</Text>
        {data.education.map(edu => (
          <View key={edu.id} style={dyn.item}>
            <Text style={[tStyles.artistic.itemTitle, ff]}>{edu.school}</Text>
            <Text style={[tStyles.artistic.itemCompany, ff]}>{edu.degree} • {edu.startDate} – {edu.endDate}</Text>
          </View>
        ))}
      </View>
      <ExtraSections data={data} titleColor="#f97316" />
    </View>
  </View>
  );
};

// Compact Template
const CompactTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  const off = dyn.bodyText.fontSize - 12;
  return (
  <View style={tStyles.compact.container}>
    <View style={tStyles.compact.header}>
      <View style={tStyles.compact.nameRow}>
        <Text style={[tStyles.compact.name, ff]}>{data.personalInfo.fullName}</Text>
        <View style={tStyles.compact.badge}>
          <Text style={[tStyles.compact.badgeText, ff]}>{data.personalInfo.jobTitle}</Text>
        </View>
      </View>
      <Text style={[tStyles.compact.contactLine, ff]}>{[data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location].filter(Boolean).join(' | ')}</Text>
    </View>
    {data.summary ? <View style={dyn.section}><Text style={[tStyles.compact.secTitle, ff]}>SUMMARY</Text><Text style={{ fontSize: 11 + off, color: '#475569', lineHeight: 16, ...ff }}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}>
      <Text style={[tStyles.compact.secTitle, ff]}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={{ marginBottom: 6 }}>
          <View style={dyn.itemHeader}><Text style={{ fontSize: 12 + off, fontWeight: '700', color: '#1e293b', ...ff }}>{exp.title}</Text><Text style={{ fontSize: 9 + off, color: '#94a3b8' }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={{ fontSize: 10 + off, color: '#f97316', fontWeight: '600', ...ff }}>{exp.company}</Text>
          <Text style={{ fontSize: 10 + off, color: '#475569', lineHeight: 14, ...ff }}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.compact.secTitle, ff]}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={{ marginBottom: 4 }}>
          <View style={dyn.itemHeader}><Text style={{ fontSize: 12 + off, fontWeight: '700', color: '#1e293b', ...ff }}>{edu.school}</Text><Text style={{ fontSize: 9 + off, color: '#94a3b8' }}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={{ fontSize: 10 + off, color: '#475569', ...ff }}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.compact.secTitle, ff]}>SKILLS</Text>
      <Text style={{ fontSize: 10 + off, color: '#475569', ...ff }}>{data.skills.join(' • ')}</Text>
    </View>
    <ExtraSections data={data} titleColor="#ea580c" />
  </View>
  );
};

// Medical Template
const MedicalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.medical.container}>
    <View style={tStyles.medical.header}>
      <View style={tStyles.medical.headerTop}>
        <Ionicons name="medical" size={28} color="#ffffff" />
        <View style={{ marginLeft: 12 }}>
          <Text style={[tStyles.medical.name, ff]}>{data.personalInfo.fullName}</Text>
          <Text style={[tStyles.medical.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
        </View>
      </View>
      <View style={tStyles.medical.contactRow}>
        {data.personalInfo.email ? <Text style={[tStyles.medical.contact, ff]}>✉ {data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={[tStyles.medical.contact, ff]}>☎ {data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={[tStyles.medical.contact, ff]}>◉ {data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={dyn.section}><Text style={[tStyles.medical.secTitle, ff]}>Clinical Summary</Text><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}>
      <Text style={[tStyles.medical.secTitle, ff]}>Professional Experience</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={tStyles.medical.item}>
          <View style={dyn.itemHeader}><Text style={dyn.itemTitle}>{exp.title}</Text><Text style={dyn.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={{ fontSize: 12, color: '#059669', fontWeight: '600', marginBottom: 3, ...ff }}>{exp.company}</Text>
          <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.medical.secTitle, ff]}>Education & Certifications</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={dyn.itemTitle}>{edu.school}</Text><Text style={dyn.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={dyn.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
      {data.certificates && data.certificates.length > 0 && data.certificates.map(cert => (
        <View key={cert.id} style={dyn.item}>
          <Text style={dyn.itemTitle}>{cert.name}</Text>
          <Text style={{ fontSize: 11, color: '#059669', ...ff }}>{cert.issuer} • {cert.date}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.medical.secTitle, ff]}>Competencies</Text>
      <View style={dyn.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.medical.skillChip}><Text style={[tStyles.medical.skillText, ff]}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#059669" />
  </View>
  );
};

// Academic Template
const AcademicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.academic.container}>
    <View style={tStyles.academic.header}>
      <Text style={[tStyles.academic.name, ff]}>{data.personalInfo.fullName}</Text>
      <Text style={[tStyles.academic.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.academic.contactRow}>
        {data.personalInfo.email ? <Text style={[tStyles.academic.contact, ff]}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={[tStyles.academic.contact, ff]}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={[tStyles.academic.contact, ff]}>{data.personalInfo.location}</Text> : null}
        {data.personalInfo.linkedin ? <Text style={[tStyles.academic.contact, ff]}>{data.personalInfo.linkedin}</Text> : null}
      </View>
    </View>
    {data.summary ? (
      <View style={dyn.section}>
        <Text style={[tStyles.academic.secTitle, ff]}>Research Interests</Text>
        <Text style={dyn.bodyText}>{formatText(data.summary)}</Text>
      </View>
    ) : null}
    <View style={dyn.section}>
      <Text style={[tStyles.academic.secTitle, ff]}>Education</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={dyn.itemTitle}>{edu.degree}</Text><Text style={dyn.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={{ fontSize: 12, color: '#111827', fontWeight: '600', ...ff }}>{edu.school}</Text>
          {edu.location ? <Text style={{ fontSize: 11, color: '#6b7280', ...ff }}>{edu.location}</Text> : null}
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.academic.secTitle, ff]}>Experience</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={dyn.itemTitle}>{exp.title}</Text><Text style={dyn.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={dyn.itemCompany}>{exp.company}</Text>
          <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.academic.secTitle, ff]}>Skills & Tools</Text>
      <View style={dyn.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.academic.skillChip}><Text style={[tStyles.academic.skillText, ff]}>{s}</Text></View>)}
      </View>
    </View>

    <ExtraSections data={data} titleColor="#374151" />
  </View>
  );
};

// Legal Template
const LegalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.legal.container}>
    <View style={tStyles.legal.header}>
      <Text style={[tStyles.legal.name, ff]}>{data.personalInfo.fullName}, Esq.</Text>
      <Text style={[tStyles.legal.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.legal.contactRow}>
        {data.personalInfo.email ? <Text style={[tStyles.legal.contact, ff]}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={[tStyles.legal.contact, ff]}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={[tStyles.legal.contact, ff]}>{data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={dyn.section}><Text style={[tStyles.legal.secTitle, ff]}>PROFESSIONAL SUMMARY</Text><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}>
      <Text style={[tStyles.legal.secTitle, ff]}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={dyn.itemTitle}>{exp.title}</Text><Text style={dyn.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={{ fontSize: 12, color: '#374151', fontWeight: '600', marginBottom: 3, ...ff }}>{exp.company}</Text>
          <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.legal.secTitle, ff]}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={dyn.itemTitle}>{edu.school}</Text><Text style={dyn.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={dyn.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.legal.secTitle, ff]}>AREAS OF PRACTICE</Text>
      <Text style={dyn.bodyText}>{data.skills.join(' • ')}</Text>
    </View>
    <ExtraSections data={data} titleColor="#374151" />
  </View>
  );
};

// Playful Template
const PlayfulTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.playful.container}>
    <View style={tStyles.playful.header}>
      <View style={tStyles.playful.avatar}>
        <Text style={[tStyles.playful.avatarText, ff]}>{data.personalInfo.fullName.charAt(0)}</Text>
      </View>
      <Text style={[tStyles.playful.name, ff]}>{data.personalInfo.fullName}</Text>
      <Text style={[tStyles.playful.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.playful.contactRow}>
        {data.personalInfo.email ? <Text style={[tStyles.playful.contact, ff]}>📧 {data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={[tStyles.playful.contact, ff]}>📱 {data.personalInfo.phone}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={dyn.section}><Text style={[tStyles.playful.secTitle, ff]}>✨ About Me</Text><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}>
      <Text style={[tStyles.playful.secTitle, ff]}>💼 Experience</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={tStyles.playful.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.playful.itemTitle, ff]}>{exp.title}</Text><Text style={dyn.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={[tStyles.playful.itemCompany, ff]}>{exp.company}</Text>
          <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.playful.secTitle, ff]}>🎓 Education</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.playful.itemTitle, ff]}>{edu.school}</Text><Text style={dyn.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={dyn.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.playful.secTitle, ff]}>🚀 Skills</Text>
      <View style={dyn.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.playful.skillChip}><Text style={[tStyles.playful.skillText, ff]}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#ea580c" />
  </View>
  );
};

// Borderless Template
const BorderlessTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.borderless.container}>
    <View style={tStyles.borderless.header}>
      <Text style={[tStyles.borderless.name, ff]}>{data.personalInfo.fullName}</Text>
      <Text style={[tStyles.borderless.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.borderless.contactRow}>
        {data.personalInfo.email ? <Text style={[tStyles.borderless.contact, ff]}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={[tStyles.borderless.contact, ff]}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={[tStyles.borderless.contact, ff]}>{data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={dyn.section}><Text style={[tStyles.borderless.secTitle, ff]}>Profile</Text><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}>
      <Text style={[tStyles.borderless.secTitle, ff]}>Experience</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={dyn.itemTitle}>{exp.title}</Text><Text style={dyn.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={dyn.itemCompany}>{exp.company}</Text>
          <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.borderless.secTitle, ff]}>Education</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={dyn.itemTitle}>{edu.school}</Text><Text style={dyn.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={dyn.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.borderless.secTitle, ff]}>Skills</Text>
      <View style={dyn.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.borderless.skillChip}><Text style={[tStyles.borderless.skillText, ff]}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#6b7280" />
  </View>
  );
};


// Indigo Template
const IndigoTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.indigo.container}>
    <View style={tStyles.indigo.header}>
      <Text style={[tStyles.indigo.name, ff]}>{data.personalInfo.fullName}</Text>
      <Text style={[tStyles.indigo.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.indigo.contactRow}>
        {data.personalInfo.email ? <Text style={[tStyles.indigo.contact, ff]}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={[tStyles.indigo.contact, ff]}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={[tStyles.indigo.contact, ff]}>{data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={dyn.section}><Text style={[tStyles.indigo.secTitle, ff]}>ABOUT</Text><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}>
      <Text style={[tStyles.indigo.secTitle, ff]}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.indigo.itemTitle, ff]}>{exp.title}</Text><Text style={dyn.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={[tStyles.indigo.itemCompany, ff]}>{exp.company}</Text>
          <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.indigo.secTitle, ff]}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.indigo.itemTitle, ff]}>{edu.school}</Text><Text style={dyn.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={dyn.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.indigo.secTitle, ff]}>SKILLS</Text>
      <View style={dyn.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.indigo.skillChip}><Text style={[tStyles.indigo.skillText, ff]}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#3730a3" />
  </View>
  );
};

// Monochrome Template
const MonochromeTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.mono.container}>
    <View style={tStyles.mono.header}>
      <Text style={[tStyles.mono.name, ff]}>{data.personalInfo.fullName}</Text>
      <Text style={[tStyles.mono.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.mono.contactRow}>
        {data.personalInfo.email ? <Text style={[tStyles.mono.contact, ff]}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={[tStyles.mono.contact, ff]}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={[tStyles.mono.contact, ff]}>{data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={dyn.section}><Text style={[tStyles.mono.secTitle, ff]}>PROFILE</Text><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}>
      <Text style={[tStyles.mono.secTitle, ff]}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={dyn.itemTitle}>{exp.title}</Text><Text style={dyn.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={dyn.itemCompany}>{exp.company}</Text>
          <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.mono.secTitle, ff]}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={dyn.itemTitle}>{edu.school}</Text><Text style={dyn.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={dyn.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.mono.secTitle, ff]}>SKILLS</Text>
      <View style={dyn.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.mono.skillChip}><Text style={[tStyles.mono.skillText, ff]}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#374151" />
  </View>
  );
};

// Ocean Template
const OceanTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.ocean.container}>
    <View style={tStyles.ocean.header}>
      <Text style={[tStyles.ocean.name, ff]}>{data.personalInfo.fullName}</Text>
      <Text style={[tStyles.ocean.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.ocean.contactRow}>
        {data.personalInfo.email ? <Text style={[tStyles.ocean.contact, ff]}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={[tStyles.ocean.contact, ff]}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={[tStyles.ocean.contact, ff]}>{data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={dyn.section}><Text style={[tStyles.ocean.secTitle, ff]}>ABOUT</Text><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}>
      <Text style={[tStyles.ocean.secTitle, ff]}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.ocean.itemTitle, ff]}>{exp.title}</Text><Text style={dyn.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={[tStyles.ocean.itemCompany, ff]}>{exp.company}</Text>
          <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.ocean.secTitle, ff]}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.ocean.itemTitle, ff]}>{edu.school}</Text><Text style={dyn.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={dyn.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.ocean.secTitle, ff]}>SKILLS</Text>
      <View style={dyn.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.ocean.skillChip}><Text style={[tStyles.ocean.skillText, ff]}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#0369a1" />
  </View>
  );
};

// Forest Template
const ForestTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.forest.container}>
    <View style={tStyles.forest.header}>
      <Text style={[tStyles.forest.name, ff]}>{data.personalInfo.fullName}</Text>
      <Text style={[tStyles.forest.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.forest.contactRow}>
        {data.personalInfo.email ? <Text style={[tStyles.forest.contact, ff]}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={[tStyles.forest.contact, ff]}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={[tStyles.forest.contact, ff]}>{data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={dyn.section}><Text style={[tStyles.forest.secTitle, ff]}>ABOUT</Text><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}>
      <Text style={[tStyles.forest.secTitle, ff]}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.forest.itemTitle, ff]}>{exp.title}</Text><Text style={dyn.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={[tStyles.forest.itemCompany, ff]}>{exp.company}</Text>
          <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.forest.secTitle, ff]}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.forest.itemTitle, ff]}>{edu.school}</Text><Text style={dyn.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={dyn.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.forest.secTitle, ff]}>SKILLS</Text>
      <View style={dyn.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.forest.skillChip}><Text style={[tStyles.forest.skillText, ff]}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#166534" />
  </View>
  );
};

// Sunset Template
const SunsetTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.sunset.container}>
    <View style={tStyles.sunset.header}>
      <Text style={[tStyles.sunset.name, ff]}>{data.personalInfo.fullName}</Text>
      <Text style={[tStyles.sunset.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.sunset.contactRow}>
        {data.personalInfo.email ? <Text style={[tStyles.sunset.contact, ff]}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={[tStyles.sunset.contact, ff]}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={[tStyles.sunset.contact, ff]}>{data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={dyn.section}><Text style={[tStyles.sunset.secTitle, ff]}>ABOUT</Text><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}>
      <Text style={[tStyles.sunset.secTitle, ff]}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.sunset.itemTitle, ff]}>{exp.title}</Text><Text style={dyn.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={[tStyles.sunset.itemCompany, ff]}>{exp.company}</Text>
          <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.sunset.secTitle, ff]}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.sunset.itemTitle, ff]}>{edu.school}</Text><Text style={dyn.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={dyn.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.sunset.secTitle, ff]}>SKILLS</Text>
      <View style={dyn.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.sunset.skillChip}><Text style={[tStyles.sunset.skillText, ff]}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#ea580c" />
  </View>
  );
};

// Lavender Template
const LavenderTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.lavender.container}>
    <View style={tStyles.lavender.header}>
      <Text style={[tStyles.lavender.name, ff]}>{data.personalInfo.fullName}</Text>
      <Text style={[tStyles.lavender.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.lavender.contactRow}>
        {data.personalInfo.email ? <Text style={[tStyles.lavender.contact, ff]}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={[tStyles.lavender.contact, ff]}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={[tStyles.lavender.contact, ff]}>{data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={dyn.section}><Text style={[tStyles.lavender.secTitle, ff]}>ABOUT</Text><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}>
      <Text style={[tStyles.lavender.secTitle, ff]}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.lavender.itemTitle, ff]}>{exp.title}</Text><Text style={dyn.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={[tStyles.lavender.itemCompany, ff]}>{exp.company}</Text>
          <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.lavender.secTitle, ff]}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.lavender.itemTitle, ff]}>{edu.school}</Text><Text style={dyn.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={dyn.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.lavender.secTitle, ff]}>SKILLS</Text>
      <View style={dyn.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.lavender.skillChip}><Text style={[tStyles.lavender.skillText, ff]}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#7c3aed" />
  </View>
  );
};

// Slate Template
const SlateTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.slate.container}>
    <View style={tStyles.slate.header}>
      <Text style={[tStyles.slate.name, ff]}>{data.personalInfo.fullName}</Text>
      <Text style={[tStyles.slate.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.slate.contactRow}>
        {data.personalInfo.email ? <Text style={[tStyles.slate.contact, ff]}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={[tStyles.slate.contact, ff]}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={[tStyles.slate.contact, ff]}>{data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={dyn.section}><Text style={[tStyles.slate.secTitle, ff]}>ABOUT</Text><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}>
      <Text style={[tStyles.slate.secTitle, ff]}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.slate.itemTitle, ff]}>{exp.title}</Text><Text style={dyn.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={[tStyles.slate.itemCompany, ff]}>{exp.company}</Text>
          <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.slate.secTitle, ff]}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.slate.itemTitle, ff]}>{edu.school}</Text><Text style={dyn.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={dyn.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.slate.secTitle, ff]}>SKILLS</Text>
      <View style={dyn.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.slate.skillChip}><Text style={[tStyles.slate.skillText, ff]}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#475569" />
  </View>
  );
};

// Charcoal Template
const CharcoalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.charcoal.container}>
    <View style={tStyles.charcoal.header}>
      <Text style={[tStyles.charcoal.name, ff]}>{data.personalInfo.fullName}</Text>
      <Text style={[tStyles.charcoal.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.charcoal.contactRow}>
        {data.personalInfo.email ? <Text style={[tStyles.charcoal.contact, ff]}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={[tStyles.charcoal.contact, ff]}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={[tStyles.charcoal.contact, ff]}>{data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={dyn.section}><Text style={[tStyles.charcoal.secTitle, ff]}>ABOUT</Text><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}>
      <Text style={[tStyles.charcoal.secTitle, ff]}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.charcoal.itemTitle, ff]}>{exp.title}</Text><Text style={dyn.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={[tStyles.charcoal.itemCompany, ff]}>{exp.company}</Text>
          <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.charcoal.secTitle, ff]}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.charcoal.itemTitle, ff]}>{edu.school}</Text><Text style={dyn.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={dyn.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.charcoal.secTitle, ff]}>SKILLS</Text>
      <View style={dyn.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.charcoal.skillChip}><Text style={[tStyles.charcoal.skillText, ff]}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#1e293b" />
  </View>
  );
};

// Midnight Template
const MidnightTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.midnight.container}>
    <View style={tStyles.midnight.header}>
      <Text style={[tStyles.midnight.name, ff]}>{data.personalInfo.fullName}</Text>
      <Text style={[tStyles.midnight.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.midnight.contactRow}>
        {data.personalInfo.email ? <Text style={[tStyles.midnight.contact, ff]}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={[tStyles.midnight.contact, ff]}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={[tStyles.midnight.contact, ff]}>{data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={dyn.section}><Text style={[tStyles.midnight.secTitle, ff]}>ABOUT</Text><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}>
      <Text style={[tStyles.midnight.secTitle, ff]}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.midnight.itemTitle, ff]}>{exp.title}</Text><Text style={dyn.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={[tStyles.midnight.itemCompany, ff]}>{exp.company}</Text>
          <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.midnight.secTitle, ff]}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.midnight.itemTitle, ff]}>{edu.school}</Text><Text style={dyn.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={dyn.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.midnight.secTitle, ff]}>SKILLS</Text>
      <View style={dyn.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.midnight.skillChip}><Text style={[tStyles.midnight.skillText, ff]}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#1e1b4b" />
  </View>
  );
};

// Ruby Template
const RubyTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.ruby.container}>
    <View style={tStyles.ruby.header}>
      <Text style={[tStyles.ruby.name, ff]}>{data.personalInfo.fullName}</Text>
      <Text style={[tStyles.ruby.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.ruby.contactRow}>
        {data.personalInfo.email ? <Text style={[tStyles.ruby.contact, ff]}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={[tStyles.ruby.contact, ff]}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={[tStyles.ruby.contact, ff]}>{data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={dyn.section}><Text style={[tStyles.ruby.secTitle, ff]}>ABOUT</Text><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}>
      <Text style={[tStyles.ruby.secTitle, ff]}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.ruby.itemTitle, ff]}>{exp.title}</Text><Text style={dyn.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={[tStyles.ruby.itemCompany, ff]}>{exp.company}</Text>
          <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.ruby.secTitle, ff]}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.ruby.itemTitle, ff]}>{edu.school}</Text><Text style={dyn.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={dyn.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.ruby.secTitle, ff]}>SKILLS</Text>
      <View style={dyn.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.ruby.skillChip}><Text style={[tStyles.ruby.skillText, ff]}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#991b1b" />
  </View>
  );
};

// Emerald Template
const EmeraldTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.emerald.container}>
    <View style={tStyles.emerald.header}>
      <Text style={[tStyles.emerald.name, ff]}>{data.personalInfo.fullName}</Text>
      <Text style={[tStyles.emerald.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.emerald.contactRow}>
        {data.personalInfo.email ? <Text style={[tStyles.emerald.contact, ff]}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={[tStyles.emerald.contact, ff]}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={[tStyles.emerald.contact, ff]}>{data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={dyn.section}><Text style={[tStyles.emerald.secTitle, ff]}>ABOUT</Text><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}>
      <Text style={[tStyles.emerald.secTitle, ff]}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.emerald.itemTitle, ff]}>{exp.title}</Text><Text style={dyn.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={[tStyles.emerald.itemCompany, ff]}>{exp.company}</Text>
          <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.emerald.secTitle, ff]}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.emerald.itemTitle, ff]}>{edu.school}</Text><Text style={dyn.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={dyn.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.emerald.secTitle, ff]}>SKILLS</Text>
      <View style={dyn.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.emerald.skillChip}><Text style={[tStyles.emerald.skillText, ff]}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#047857" />
  </View>
  );
};

// Cobalt Template
const CobaltTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.cobalt.container}>
    <View style={tStyles.cobalt.header}>
      <Text style={[tStyles.cobalt.name, ff]}>{data.personalInfo.fullName}</Text>
      <Text style={[tStyles.cobalt.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.cobalt.contactRow}>
        {data.personalInfo.email ? <Text style={[tStyles.cobalt.contact, ff]}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={[tStyles.cobalt.contact, ff]}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={[tStyles.cobalt.contact, ff]}>{data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={dyn.section}><Text style={[tStyles.cobalt.secTitle, ff]}>ABOUT</Text><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}>
      <Text style={[tStyles.cobalt.secTitle, ff]}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.cobalt.itemTitle, ff]}>{exp.title}</Text><Text style={dyn.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={[tStyles.cobalt.itemCompany, ff]}>{exp.company}</Text>
          <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.cobalt.secTitle, ff]}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.cobalt.itemTitle, ff]}>{edu.school}</Text><Text style={dyn.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={dyn.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.cobalt.secTitle, ff]}>SKILLS</Text>
      <View style={dyn.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.cobalt.skillChip}><Text style={[tStyles.cobalt.skillText, ff]}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#1e3a8a" />
  </View>
  );
};

// Gold Template
const GoldTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.gold.container}>
    <View style={tStyles.gold.header}>
      <Text style={[tStyles.gold.name, ff]}>{data.personalInfo.fullName}</Text>
      <Text style={[tStyles.gold.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.gold.contactRow}>
        {data.personalInfo.email ? <Text style={[tStyles.gold.contact, ff]}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={[tStyles.gold.contact, ff]}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={[tStyles.gold.contact, ff]}>{data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={dyn.section}><Text style={[tStyles.gold.secTitle, ff]}>ABOUT</Text><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}>
      <Text style={[tStyles.gold.secTitle, ff]}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.gold.itemTitle, ff]}>{exp.title}</Text><Text style={dyn.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={[tStyles.gold.itemCompany, ff]}>{exp.company}</Text>
          <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.gold.secTitle, ff]}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.gold.itemTitle, ff]}>{edu.school}</Text><Text style={dyn.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={dyn.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.gold.secTitle, ff]}>SKILLS</Text>
      <View style={dyn.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.gold.skillChip}><Text style={[tStyles.gold.skillText, ff]}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#b45309" />
  </View>
  );
};

// Pink Template
const PinkTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.pink.container}>
    <View style={tStyles.pink.header}>
      <Text style={[tStyles.pink.name, ff]}>{data.personalInfo.fullName}</Text>
      <Text style={[tStyles.pink.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.pink.contactRow}>
        {data.personalInfo.email ? <Text style={[tStyles.pink.contact, ff]}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={[tStyles.pink.contact, ff]}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={[tStyles.pink.contact, ff]}>{data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={dyn.section}><Text style={[tStyles.pink.secTitle, ff]}>ABOUT</Text><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}>
      <Text style={[tStyles.pink.secTitle, ff]}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.pink.itemTitle, ff]}>{exp.title}</Text><Text style={dyn.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={[tStyles.pink.itemCompany, ff]}>{exp.company}</Text>
          <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.pink.secTitle, ff]}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.pink.itemTitle, ff]}>{edu.school}</Text><Text style={dyn.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={dyn.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.pink.secTitle, ff]}>SKILLS</Text>
      <View style={dyn.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.pink.skillChip}><Text style={[tStyles.pink.skillText, ff]}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#be185d" />
  </View>
  );
};

// Teal Template
const TealTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.teal.container}>
    <View style={tStyles.teal.header}>
      <Text style={[tStyles.teal.name, ff]}>{data.personalInfo.fullName}</Text>
      <Text style={[tStyles.teal.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.teal.contactRow}>
        {data.personalInfo.email ? <Text style={[tStyles.teal.contact, ff]}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={[tStyles.teal.contact, ff]}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={[tStyles.teal.contact, ff]}>{data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={dyn.section}><Text style={[tStyles.teal.secTitle, ff]}>ABOUT</Text><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}>
      <Text style={[tStyles.teal.secTitle, ff]}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.teal.itemTitle, ff]}>{exp.title}</Text><Text style={dyn.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={[tStyles.teal.itemCompany, ff]}>{exp.company}</Text>
          <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.teal.secTitle, ff]}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.teal.itemTitle, ff]}>{edu.school}</Text><Text style={dyn.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={dyn.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.teal.secTitle, ff]}>SKILLS</Text>
      <View style={dyn.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.teal.skillChip}><Text style={[tStyles.teal.skillText, ff]}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#0f766e" />
  </View>
  );
};

// Double Column Template (two-column layout)
const DoubleColumnTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.doubleCol.container}>
    <View style={tStyles.doubleCol.leftCol}>
      <View style={tStyles.doubleCol.header}>
        <Text style={[tStyles.doubleCol.name, ff]}>{data.personalInfo.fullName}</Text>
        <Text style={[tStyles.doubleCol.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
        <View style={tStyles.doubleCol.contactRow}>
          {data.personalInfo.email ? <Text style={[tStyles.doubleCol.contact, ff]}>{data.personalInfo.email}</Text> : null}
          {data.personalInfo.phone ? <Text style={[tStyles.doubleCol.contact, ff]}>{data.personalInfo.phone}</Text> : null}
          {data.personalInfo.location ? <Text style={[tStyles.doubleCol.contact, ff]}>{data.personalInfo.location}</Text> : null}
        </View>
      </View>
      <View style={tStyles.doubleCol.section}>
        <Text style={[tStyles.doubleCol.secTitle, ff]}>SUMMARY</Text>
        <Text style={dyn.bodyText}>{formatText(data.summary)}</Text>
      </View>
      <View style={tStyles.doubleCol.section}>
        <Text style={[tStyles.doubleCol.secTitle, ff]}>SKILLS</Text>
        <Text style={dyn.bodyText}>{data.skills.join(' • ')}</Text>
      </View>
      <View style={tStyles.doubleCol.section}>
        <Text style={[tStyles.doubleCol.secTitle, ff]}>EDUCATION</Text>
        {data.education.map(edu => (
          <View key={edu.id} style={{ marginBottom: 6 }}>
            <Text style={[tStyles.doubleCol.eduSchool, ff]}>{edu.school}</Text>
            <Text style={[tStyles.doubleCol.eduDegree, ff]}>{edu.degree} • {edu.startDate} – {edu.endDate}</Text>
          </View>
        ))}
      </View>
    </View>
    <View style={tStyles.doubleCol.rightCol}>
      <View style={tStyles.doubleCol.section}>
        <Text style={[tStyles.doubleCol.secTitle, ff]}>EXPERIENCE</Text>
        {data.experience.map(exp => (
          <View key={exp.id} style={{ marginBottom: 8 }}>
            <View style={dyn.itemHeader}><Text style={[tStyles.doubleCol.itemTitle, ff]}>{exp.title}</Text><Text style={dyn.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
            <Text style={[tStyles.doubleCol.itemCompany, ff]}>{exp.company}</Text>
            <Text style={{ fontSize: 11, color: '#475569', lineHeight: 14, ...ff }}>{formatText(exp.description)}</Text>
          </View>
        ))}
      </View>
      <ExtraSections data={data} titleColor="#111827" />
    </View>
  </View>
  );
};

// Single Column Template (clean single column)
const SingleColumnTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.singleCol.container}>
    <View style={tStyles.singleCol.header}>
      <Text style={[tStyles.singleCol.name, ff]}>{data.personalInfo.fullName}</Text>
      <Text style={[tStyles.singleCol.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
    </View>
    <View style={tStyles.singleCol.divider} />
    <View style={tStyles.singleCol.contactRow}>
      {data.personalInfo.email ? <Text style={[tStyles.singleCol.contact, ff]}>{data.personalInfo.email}</Text> : null}
      {data.personalInfo.phone ? <Text style={[tStyles.singleCol.contact, ff]}>{data.personalInfo.phone}</Text> : null}
      {data.personalInfo.location ? <Text style={[tStyles.singleCol.contact, ff]}>{data.personalInfo.location}</Text> : null}
    </View>
    {data.summary ? <View style={dyn.section}><Text style={[tStyles.singleCol.secTitle, ff]}>PROFILE</Text><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}>
      <Text style={[tStyles.singleCol.secTitle, ff]}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.singleCol.itemTitle, ff]}>{exp.title}</Text><Text style={dyn.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={{ fontSize: 12, color: '#1e3a5f', fontWeight: '600', marginBottom: 3, ...ff }}>{exp.company}</Text>
          <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.singleCol.secTitle, ff]}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={dyn.itemTitle}>{edu.school}</Text><Text style={dyn.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={dyn.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.singleCol.secTitle, ff]}>SKILLS</Text>
      <Text style={dyn.bodyText}>{data.skills.join('  •  ')}</Text>
    </View>
    <ExtraSections data={data} titleColor="#374151" />
  </View>
  );
};

// Technical Template
const TechnicalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.tech.container}>
    <View style={tStyles.tech.header}>
      <View style={tStyles.tech.nameRow}>
        <View style={tStyles.tech.dot} />
        <Text style={[tStyles.tech.name, ff]}>{data.personalInfo.fullName}</Text>
      </View>
      <Text style={[tStyles.tech.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.tech.contactRow}>
        {data.personalInfo.email ? <Text style={[tStyles.tech.contact, ff]}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={[tStyles.tech.contact, ff]}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.website ? <Text style={[tStyles.tech.contact, ff]}>{data.personalInfo.website}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={dyn.section}><Text style={[tStyles.tech.secTitle, ff]}>{'// SUMMARY'}</Text><Text style={{ fontSize: 11, color: '#334155', lineHeight: 18, fontFamily: 'monospace', ...ff }}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}>
      <Text style={[tStyles.tech.secTitle, ff]}>{'// EXPERIENCE'}</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={tStyles.tech.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.tech.itemTitle, ff]}>{exp.title}</Text><Text style={dyn.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={[tStyles.tech.itemCompany, ff]}>{exp.company}</Text>
          <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.tech.secTitle, ff]}>{'// SKILLS'}</Text>
      <View style={dyn.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.tech.skillChip}><Text style={[tStyles.tech.skillText, ff]}>{s}</Text></View>)}
      </View>
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.tech.secTitle, ff]}>{'// EDUCATION'}</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.tech.itemTitle, ff]}>{edu.school}</Text><Text style={dyn.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={[tStyles.tech.itemDesc, ff]}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <ExtraSections data={data} titleColor="#0891b2" />
  </View>
  );
};

// Startup Template
const StartupTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.startup.container}>
    <View style={tStyles.startup.header}>
      <Text style={[tStyles.startup.name, ff]}>{data.personalInfo.fullName}</Text>
      <Text style={[tStyles.startup.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.startup.contactRow}>
        {data.personalInfo.email ? <Text style={[tStyles.startup.contact, ff]}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={[tStyles.startup.contact, ff]}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={[tStyles.startup.contact, ff]}>{data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={dyn.section}><Text style={[tStyles.startup.secTitle, ff]}>WHY ME</Text><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}>
      <Text style={[tStyles.startup.secTitle, ff]}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={tStyles.startup.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.startup.itemTitle, ff]}>{exp.title}</Text><Text style={dyn.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={[tStyles.startup.itemCompany, ff]}>{exp.company}</Text>
          <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.startup.secTitle, ff]}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.startup.itemTitle, ff]}>{edu.school}</Text><Text style={dyn.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={dyn.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.startup.secTitle, ff]}>TECH STACK</Text>
      <View style={dyn.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.startup.skillChip}><Text style={[tStyles.startup.skillText, ff]}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#ec4899" />
  </View>
  );
};

// Timeline Template
const TimelineTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.timeline.container}>
    <View style={tStyles.timeline.header}>
      <Text style={[tStyles.timeline.name, ff]}>{data.personalInfo.fullName}</Text>
      <Text style={[tStyles.timeline.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.timeline.contactRow}>
        {data.personalInfo.email ? <Text style={[tStyles.timeline.contact, ff]}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={[tStyles.timeline.contact, ff]}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={[tStyles.timeline.contact, ff]}>{data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={dyn.section}><Text style={[tStyles.timeline.secTitle, ff]}>PROFILE</Text><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}>
      <Text style={[tStyles.timeline.secTitle, ff]}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={tStyles.timeline.timelineItem}>
          <View style={tStyles.timeline.timelineDot} />
          <View style={tStyles.timeline.timelineLine} />
          <View style={tStyles.timeline.timelineContent}>
            <Text style={[tStyles.timeline.itemDate, ff]}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text>
            <Text style={[tStyles.timeline.itemTitle, ff]}>{exp.title}</Text>
            <Text style={[tStyles.timeline.itemCompany, ff]}>{exp.company}</Text>
            <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
          </View>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.timeline.secTitle, ff]}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={tStyles.timeline.timelineItem}>
          <View style={tStyles.timeline.timelineDot} />
          <View style={tStyles.timeline.timelineLine} />
          <View style={tStyles.timeline.timelineContent}>
            <Text style={[tStyles.timeline.itemDate, ff]}>{edu.startDate} – {edu.endDate}</Text>
            <Text style={[tStyles.timeline.itemTitle, ff]}>{edu.school}</Text>
            <Text style={dyn.itemDesc}>{edu.degree}</Text>
          </View>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.timeline.secTitle, ff]}>SKILLS</Text>
      <View style={dyn.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.timeline.skillChip}><Text style={[tStyles.timeline.skillText, ff]}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#2563eb" />
  </View>
  );
};

// Urban Template
const UrbanTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.urban.container}>
    <View style={tStyles.urban.sidebar}>
      <View style={tStyles.urban.avatar}>
        <Text style={[tStyles.urban.avatarText, ff]}>{data.personalInfo.fullName.split(' ').map(n => n.charAt(0)).join('')}</Text>
      </View>
      <Text style={[tStyles.urban.name, ff]}>{data.personalInfo.fullName}</Text>
      <Text style={[tStyles.urban.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <View style={{ marginTop: 16 }}>
        <Text style={[tStyles.urban.sideLabel, ff]}>Contact</Text>
        {data.personalInfo.email ? <Text style={[tStyles.urban.sideItem, ff]}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={[tStyles.urban.sideItem, ff]}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={[tStyles.urban.sideItem, ff]}>{data.personalInfo.location}</Text> : null}
      </View>
      <View style={{ marginTop: 20 }}>
        <Text style={[tStyles.urban.sideLabel, ff]}>Skills</Text>
        {data.skills.map(s => <Text key={s} style={[tStyles.urban.skillItem, ff]}>• {s}</Text>)}
      </View>
    </View>
    <View style={tStyles.urban.main}>
      {data.summary ? <View style={dyn.section}><Text style={[tStyles.urban.secTitle, ff]}>PROFILE</Text><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
      <View style={dyn.section}>
        <Text style={[tStyles.urban.secTitle, ff]}>EXPERIENCE</Text>
        {data.experience.map(exp => (
          <View key={exp.id} style={tStyles.urban.item}>
            <View style={dyn.itemHeader}><Text style={[tStyles.urban.itemTitle, ff]}>{exp.title}</Text><Text style={dyn.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
            <Text style={[tStyles.urban.itemCompany, ff]}>{exp.company}</Text>
            <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
          </View>
        ))}
      </View>
      <View style={dyn.section}>
        <Text style={[tStyles.urban.secTitle, ff]}>EDUCATION</Text>
        {data.education.map(edu => (
          <View key={edu.id} style={dyn.item}>
            <View style={dyn.itemHeader}><Text style={[tStyles.urban.itemTitle, ff]}>{edu.school}</Text><Text style={dyn.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
            <Text style={dyn.itemDesc}>{edu.degree}</Text>
          </View>
        ))}
      </View>
      <ExtraSections data={data} titleColor="#facc15" />
    </View>
  </View>
  );
};

// Nature Template
const NatureTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.nature.container}>
    <View style={tStyles.nature.header}>
      <Text style={[tStyles.nature.name, ff]}>{data.personalInfo.fullName}</Text>
      <Text style={[tStyles.nature.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.nature.contactRow}>
        {data.personalInfo.email ? <Text style={[tStyles.nature.contact, ff]}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={[tStyles.nature.contact, ff]}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={[tStyles.nature.contact, ff]}>{data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={dyn.section}><Text style={[tStyles.nature.secTitle, ff]}>ABOUT</Text><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}>
      <Text style={[tStyles.nature.secTitle, ff]}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={tStyles.nature.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.nature.itemTitle, ff]}>{exp.title}</Text><Text style={dyn.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={[tStyles.nature.itemCompany, ff]}>{exp.company}</Text>
          <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.nature.secTitle, ff]}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.nature.itemTitle, ff]}>{edu.school}</Text><Text style={dyn.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={dyn.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.nature.secTitle, ff]}>SKILLS</Text>
      <View style={dyn.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.nature.skillChip}><Text style={[tStyles.nature.skillText, ff]}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#16a34a" />
  </View>
  );
};

// Bold Template
const BoldTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { fontFamily, dyn } = useFont();
  const ff = fontFamily ? { fontFamily } : {};
  return (
  <View style={tStyles.bold.container}>
    <View style={tStyles.bold.header}>
      <Text style={[tStyles.bold.name, ff]}>{data.personalInfo.fullName}</Text>
      <Text style={[tStyles.bold.jobTitle, ff]}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.bold.contactRow}>
        {data.personalInfo.email ? <Text style={[tStyles.bold.contact, ff]}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={[tStyles.bold.contact, ff]}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={[tStyles.bold.contact, ff]}>{data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={dyn.section}><Text style={[tStyles.bold.secTitle, ff]}>PROFILE</Text><Text style={dyn.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={dyn.section}>
      <Text style={[tStyles.bold.secTitle, ff]}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.bold.itemTitle, ff]}>{exp.title}</Text><Text style={dyn.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={[tStyles.bold.itemCompany, ff]}>{exp.company}</Text>
          <Text style={dyn.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.bold.secTitle, ff]}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={dyn.item}>
          <View style={dyn.itemHeader}><Text style={[tStyles.bold.itemTitle, ff]}>{edu.school}</Text><Text style={dyn.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={dyn.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={dyn.section}>
      <Text style={[tStyles.bold.secTitle, ff]}>SKILLS</Text>
      <View style={dyn.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.bold.skillChip}><Text style={[tStyles.bold.skillText, ff]}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#b91c1c" />
  </View>
  );
};

const templateMap: Record<string, React.FC<{ data: ResumeData }>> = {
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  ats: AtsTemplate,
  'tech-dark': TechDarkTemplate,
  creative: CreativeTemplate,
  corporate: CorporateTemplate,
  swiss: SwissTemplate,
  professional: ProfessionalTemplate,
  executive: ExecutiveTemplate,
  classic: ClassicTemplate,
  elegant: ElegantTemplate,
  artistic: ArtisticTemplate,
  compact: CompactTemplate,
  medical: MedicalTemplate,
  academic: AcademicTemplate,
  legal: LegalTemplate,
  playful: PlayfulTemplate,
  borderless: BorderlessTemplate,
  monochrome: MonochromeTemplate,
  technical: TechnicalTemplate,
  startup: StartupTemplate,
  timeline: TimelineTemplate,
  urban: UrbanTemplate,
  nature: NatureTemplate,
  bold: BoldTemplate,
  // Color variant templates
  ocean: OceanTemplate,
  forest: ForestTemplate,
  sunset: SunsetTemplate,
  lavender: LavenderTemplate,
  slate: SlateTemplate,
  charcoal: CharcoalTemplate,
  midnight: MidnightTemplate,
  ruby: RubyTemplate,
  emerald: EmeraldTemplate,
  cobalt: CobaltTemplate,
  gold: GoldTemplate,
  pink: PinkTemplate,
  teal: TealTemplate,
  indigo: IndigoTemplate,
};

// ─── Custom Template Renderer ───
const CustomTemplateRenderer: React.FC<{ data: ResumeData; config: CustomTemplateConfig }> = ({ data, config }) => {
  const fontFamily = config.globalStyles.fontFamily || 'System';
  const ff = getRNFontFamily(fontFamily) ? { fontFamily: getRNFontFamily(fontFamily) } : {};
  const bodyPx = bodySizeToPx(config.globalStyles.bodySize);
  const offset = bodyPx - 12;
  const accent = config.globalStyles.accentColor;
  const bg = config.globalStyles.backgroundColor;
  const text = config.globalStyles.textColor;
  const subtext = config.globalStyles.subtextColor;
  const border = config.globalStyles.borderColor;

  // Section title style mapping
  const getSectionTitleStyle = (title: string, index: number): React.ReactNode => {
    const baseStyle: any = { fontSize: 13 + offset, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, ...ff };
    switch (config.sectionStyle) {
      case 'underline':
        return <Text style={{ ...baseStyle, color: accent, borderBottomWidth: 2, borderBottomColor: accent, paddingBottom: 4 }}>{title}</Text>;
      case 'background':
        return <View style={{ backgroundColor: accent + '15', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, marginBottom: 8 }}><Text style={{ ...baseStyle, color: accent, marginBottom: 0 }}>{title}</Text></View>;
      case 'border-left':
        return <View style={{ borderLeftWidth: 3, borderLeftColor: accent, paddingLeft: 10, marginBottom: 8 }}><Text style={{ ...baseStyle, color: accent, marginBottom: 0 }}>{title}</Text></View>;
      case 'pill':
        return <View style={{ backgroundColor: accent, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 10 }}><Text style={{ ...baseStyle, color: '#ffffff', marginBottom: 0, fontSize: 11 }}>{title}</Text></View>;
      case 'minimal':
        return <Text style={{ ...baseStyle, color: subtext, borderBottomWidth: 1, borderBottomColor: border, paddingBottom: 4, letterSpacing: 3, fontSize: 11 }}>{title}</Text>;
      case 'numbered':
        return <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}><View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: accent, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 10, fontWeight: '800', color: '#ffffff' }}>{index + 1}</Text></View><Text style={{ ...baseStyle, color: accent, marginBottom: 0 }}>{title}</Text></View>;
      default:
        return <Text style={{ ...baseStyle, color: accent, borderBottomWidth: 1, borderBottomColor: border, paddingBottom: 4 }}>{title}</Text>;
    }
  };

  // Chip style mapping
  const getSkillChip = (skill: string): React.ReactNode => {
    const chipStyle: any = { paddingHorizontal: 8, paddingVertical: 3, marginRight: 6, marginBottom: 6 };
    const textStyle: any = { fontSize: 10 + offset, fontWeight: '600', ...ff };
    switch (config.chipStyle) {
      case 'rounded': return <View style={{ ...chipStyle, backgroundColor: accent + '20', borderRadius: 12 }}><Text style={{ ...textStyle, color: accent }}>{skill}</Text></View>;
      case 'square': return <View style={{ ...chipStyle, backgroundColor: accent + '20', borderRadius: 4 }}><Text style={{ ...textStyle, color: accent }}>{skill}</Text></View>;
      case 'pill': return <View style={{ ...chipStyle, backgroundColor: accent, borderRadius: 20 }}><Text style={{ ...textStyle, color: '#ffffff' }}>{skill}</Text></View>;
      case 'outlined': return <View style={{ ...chipStyle, borderWidth: 1, borderColor: accent, borderRadius: 8 }}><Text style={{ ...textStyle, color: accent }}>{skill}</Text></View>;
      case 'filled': return <View style={{ ...chipStyle, backgroundColor: accent + '15', borderRadius: 6 }}><Text style={{ ...textStyle, color: accent }}>{skill}</Text></View>;
      default: return <View style={{ ...chipStyle, backgroundColor: accent + '20', borderRadius: 12 }}><Text style={{ ...textStyle, color: accent }}>{skill}</Text></View>;
    }
  };

  // Header renderer
  const renderHeader = () => {
    const h = config.header;
    const contactInfo = [
      data.personalInfo.email,
      data.personalInfo.phone,
      data.personalInfo.location,
      data.personalInfo.linkedin,
      data.personalInfo.website,
    ].filter(Boolean);

    const contactEl = h.showContactRow && (
      <View style={{ flexDirection: h.contactLayout === 'grid' ? 'column' : 'row', flexWrap: 'wrap', gap: h.contactLayout === 'row' ? 12 : 4, marginTop: 10 }}>
        {data.personalInfo.email ? <Text style={{ fontSize: 10 + offset, color: h.textColor + 'cc', ...ff }}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={{ fontSize: 10 + offset, color: h.textColor + 'cc', ...ff }}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={{ fontSize: 10 + offset, color: h.textColor + 'cc', ...ff }}>{data.personalInfo.location}</Text> : null}
        {data.personalInfo.linkedin ? <Text style={{ fontSize: 10 + offset, color: h.textColor + 'cc', ...ff }}>{data.personalInfo.linkedin}</Text> : null}
        {data.personalInfo.website ? <Text style={{ fontSize: 10 + offset, color: h.textColor + 'cc', ...ff }}>{data.personalInfo.website}</Text> : null}
      </View>
    );

    switch (h.layout) {
      case 'centered':
        return (
          <View style={{ alignItems: 'center', paddingBottom: 14, marginBottom: 16, borderBottomWidth: 2, borderBottomColor: h.accentColor }}>
            <Text style={{ fontSize: 24 + offset, fontWeight: '900', color: h.textColor, textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center', ...ff }}>{data.personalInfo.fullName}</Text>
            {h.showJobTitle && data.personalInfo.jobTitle ? <Text style={{ fontSize: 13 + offset, fontWeight: '700', color: h.accentColor, textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 4, textAlign: 'center', ...ff }}>{data.personalInfo.jobTitle}</Text> : null}
            {contactEl}
          </View>
        );
      case 'left-accent':
        return (
          <View style={{ borderLeftWidth: 4, borderLeftColor: h.accentColor, paddingLeft: 14, paddingBottom: 14, marginBottom: 16, borderBottomWidth: 1, borderBottomColor: border }}>
            <Text style={{ fontSize: 24 + offset, fontWeight: '900', color: h.textColor, ...ff }}>{data.personalInfo.fullName}</Text>
            {h.showJobTitle && data.personalInfo.jobTitle ? <Text style={{ fontSize: 13 + offset, fontWeight: '700', color: h.accentColor, textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 4, ...ff }}>{data.personalInfo.jobTitle}</Text> : null}
            {contactEl}
          </View>
        );
      case 'gradient':
        return (
          <View style={{ backgroundColor: h.backgroundColor, padding: 16, borderRadius: 12, marginBottom: 16 }}>
            <Text style={{ fontSize: 24 + offset, fontWeight: '900', color: h.textColor, ...ff }}>{data.personalInfo.fullName}</Text>
            {h.showJobTitle && data.personalInfo.jobTitle ? <Text style={{ fontSize: 13 + offset, fontWeight: '700', color: h.accentColor, textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 4, ...ff }}>{data.personalInfo.jobTitle}</Text> : null}
            {h.showContactRow && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 10 }}>
                {data.personalInfo.email ? <Text style={{ fontSize: 10, color: h.textColor + 'bb', ...ff }}>{data.personalInfo.email}</Text> : null}
                {data.personalInfo.phone ? <Text style={{ fontSize: 10, color: h.textColor + 'bb', ...ff }}>{data.personalInfo.phone}</Text> : null}
              </View>
            )}
          </View>
        );
      case 'boxed':
        return (
          <View style={{ borderWidth: 2, borderColor: h.accentColor, borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <Text style={{ fontSize: 24 + offset, fontWeight: '900', color: h.textColor, textAlign: 'center', ...ff }}>{data.personalInfo.fullName}</Text>
            {h.showJobTitle && data.personalInfo.jobTitle ? <Text style={{ fontSize: 13 + offset, fontWeight: '700', color: h.accentColor, textTransform: 'uppercase', letterSpacing: 2, textAlign: 'center', marginTop: 4, ...ff }}>{data.personalInfo.jobTitle}</Text> : null}
            {contactEl}
          </View>
        );
      case 'split':
        return (
          <View style={{ flexDirection: 'row', backgroundColor: h.backgroundColor, borderRadius: 12, marginBottom: 16, overflow: 'hidden' }}>
            <View style={{ flex: 1, padding: 16 }}>
              <Text style={{ fontSize: 20 + offset, fontWeight: '900', color: h.textColor, ...ff }}>{data.personalInfo.fullName}</Text>
              {h.showJobTitle && data.personalInfo.jobTitle ? <Text style={{ fontSize: 11 + offset, fontWeight: '700', color: h.accentColor, marginTop: 4, ...ff }}>{data.personalInfo.jobTitle}</Text> : null}
            </View>
            <View style={{ backgroundColor: h.accentColor, width: 3 }} />
            <View style={{ flex: 1, padding: 16, justifyContent: 'center' }}>
              {data.personalInfo.email ? <Text style={{ fontSize: 10, color: h.textColor + 'cc', marginBottom: 4, ...ff }}>{data.personalInfo.email}</Text> : null}
              {data.personalInfo.phone ? <Text style={{ fontSize: 10, color: h.textColor + 'cc', marginBottom: 4, ...ff }}>{data.personalInfo.phone}</Text> : null}
              {data.personalInfo.location ? <Text style={{ fontSize: 10, color: h.textColor + 'cc', ...ff }}>{data.personalInfo.location}</Text> : null}
            </View>
          </View>
        );
      case 'minimal':
        return (
          <View style={{ paddingBottom: 14, marginBottom: 16 }}>
            <Text style={{ fontSize: 28 + offset, fontWeight: '800', color: h.textColor, ...ff }}>{data.personalInfo.fullName}</Text>
            {h.showJobTitle && data.personalInfo.jobTitle ? <Text style={{ fontSize: 13 + offset, fontWeight: '600', color: subtext, textTransform: 'uppercase', letterSpacing: 3, marginTop: 4, ...ff }}>{data.personalInfo.jobTitle}</Text> : null}
            {contactEl}
          </View>
        );
      case 'full-width':
      default:
        return (
          <View style={{ backgroundColor: h.backgroundColor, padding: 16, borderRadius: 12, marginBottom: 16 }}>
            <Text style={{ fontSize: 24 + offset, fontWeight: '900', color: h.textColor, textTransform: 'uppercase', letterSpacing: 0.5, ...ff }}>{data.personalInfo.fullName}</Text>
            {h.showJobTitle && data.personalInfo.jobTitle ? <Text style={{ fontSize: 13 + offset, fontWeight: '700', color: h.accentColor, textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 4, ...ff }}>{data.personalInfo.jobTitle}</Text> : null}
            {h.showContactRow && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 10 }}>
                {data.personalInfo.email ? <Text style={{ fontSize: 10, color: h.textColor + 'bb', ...ff }}>{data.personalInfo.email}</Text> : null}
                {data.personalInfo.phone ? <Text style={{ fontSize: 10, color: h.textColor + 'bb', ...ff }}>{data.personalInfo.phone}</Text> : null}
                {data.personalInfo.location ? <Text style={{ fontSize: 10, color: h.textColor + 'bb', ...ff }}>{data.personalInfo.location}</Text> : null}
                {data.personalInfo.linkedin ? <Text style={{ fontSize: 10, color: h.textColor + 'bb', ...ff }}>{data.personalInfo.linkedin}</Text> : null}
                {data.personalInfo.website ? <Text style={{ fontSize: 10, color: h.textColor + 'bb', ...ff }}>{data.personalInfo.website}</Text> : null}
              </View>
            )}
          </View>
        );
    }
  };

  // Item style mapping
  const renderItem = (item: { title: string; subtitle?: string; date?: string; desc?: string }, style?: any): React.ReactNode => {
    const itemM: any = { marginBottom: 12, ...style };
    const headerRow = (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <Text style={{ fontSize: 13 + offset, fontWeight: '700', color: text, flex: 1, ...ff }}>{item.title}</Text>
        {item.date ? <Text style={{ fontSize: 11 + offset, color: subtext, ...ff }}>{item.date}</Text> : null}
      </View>
    );
    switch (config.itemStyle) {
      case 'bordered':
        return <View style={{ ...itemM, borderWidth: 1, borderColor: border, borderRadius: 8, padding: 10 }}>{headerRow}{item.subtitle ? <Text style={{ fontSize: 12 + offset, color: accent, fontWeight: '600', marginBottom: 3, ...ff }}>{item.subtitle}</Text> : null}{item.desc ? <Text style={{ fontSize: 12 + offset, color: subtext, lineHeight: 18 + offset, ...ff }}>{item.desc}</Text> : null}</View>;
      case 'card':
        return <View style={{ ...itemM, backgroundColor: accent + '08', borderRadius: 8, padding: 10, borderLeftWidth: 3, borderLeftColor: accent }}>{headerRow}{item.subtitle ? <Text style={{ fontSize: 12 + offset, color: accent, fontWeight: '600', marginBottom: 3, ...ff }}>{item.subtitle}</Text> : null}{item.desc ? <Text style={{ fontSize: 12 + offset, color: subtext, lineHeight: 18 + offset, ...ff }}>{item.desc}</Text> : null}</View>;
      case 'timeline':
        return <View style={{ ...itemM, flexDirection: 'row', gap: 10 }}><View style={{ width: 10, alignItems: 'center' }}><View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: accent, marginTop: 4 }} /><View style={{ flex: 1, width: 2, backgroundColor: border, marginTop: 4 }} /></View><View style={{ flex: 1 }}>{headerRow}{item.subtitle ? <Text style={{ fontSize: 12 + offset, color: accent, fontWeight: '600', marginBottom: 3, ...ff }}>{item.subtitle}</Text> : null}{item.desc ? <Text style={{ fontSize: 12 + offset, color: subtext, lineHeight: 18 + offset, ...ff }}>{item.desc}</Text> : null}</View></View>;
      case 'compact':
        return <View style={{ ...itemM, marginBottom: 8 }}>{headerRow}{item.subtitle ? <Text style={{ fontSize: 11 + offset, color: accent, fontWeight: '600', ...ff }}>{item.subtitle}</Text> : null}{item.desc ? <Text style={{ fontSize: 11 + offset, color: subtext, lineHeight: 16, ...ff }}>{item.desc}</Text> : null}</View>;
      default:
        return <View style={itemM}>{headerRow}{item.subtitle ? <Text style={{ fontSize: 12 + offset, color: accent, fontWeight: '600', marginBottom: 3, ...ff }}>{item.subtitle}</Text> : null}{item.desc ? <Text style={{ fontSize: 12 + offset, color: subtext, lineHeight: 18 + offset, ...ff }}>{item.desc}</Text> : null}</View>;
    }
  };

  // Render sections in order
  const visibleSections = config.sections.filter(s => s.visible);

  return (
    <View style={{ backgroundColor: bg, borderRadius: 12, padding: 16, elevation: 4 }}>
      {visibleSections.map((section, index) => {
        const title = section.customTitle || section.label;
        switch (section.type) {
          case 'header': return <React.Fragment key={section.id}>{renderHeader()}</React.Fragment>;
          case 'summary':
            if (!data.summary) return null;
            return <View key={section.id} style={{ marginBottom: 16 }}>{getSectionTitleStyle(title, index)}<Text style={{ fontSize: 12 + offset, color: subtext, lineHeight: 18 + offset, ...ff }}>{data.summary}</Text></View>;
          case 'experience':
            return <View key={section.id} style={{ marginBottom: 16 }}>{getSectionTitleStyle(title, index)}{data.experience.map(exp => <React.Fragment key={exp.id}>{renderItem({ title: exp.title, subtitle: exp.company, date: `${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}`, desc: exp.description })}</React.Fragment>)}</View>;
          case 'education':
            return <View key={section.id} style={{ marginBottom: 16 }}>{getSectionTitleStyle(title, index)}{data.education.map(edu => <React.Fragment key={edu.id}>{renderItem({ title: edu.school, subtitle: edu.degree, date: `${edu.startDate} – ${edu.endDate}` })}</React.Fragment>)}</View>;
          case 'skills':
            return <View key={section.id} style={{ marginBottom: 16 }}>{getSectionTitleStyle(title, index)}<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{data.skills.map(s => <React.Fragment key={s}>{getSkillChip(s)}</React.Fragment>)}</View></View>;
          case 'projects':
            if (!data.projects || data.projects.length === 0) return null;
            return <View key={section.id} style={{ marginBottom: 16 }}>{getSectionTitleStyle(title, index)}{data.projects.map(p => <React.Fragment key={p.id}>{renderItem({ title: p.name, desc: p.description })}</React.Fragment>)}</View>;
          case 'certificates':
            if (!data.certificates || data.certificates.length === 0) return null;
            return <View key={section.id} style={{ marginBottom: 16 }}>{getSectionTitleStyle(title, index)}{data.certificates.map(c => <React.Fragment key={c.id}>{renderItem({ title: c.name, subtitle: `${c.issuer} • ${c.date}` })}</React.Fragment>)}</View>;
          case 'awards':
            if (!data.awards || data.awards.length === 0) return null;
            return <View key={section.id} style={{ marginBottom: 16 }}>{getSectionTitleStyle(title, index)}{data.awards.map(a => <React.Fragment key={a.id}>{renderItem({ title: a.name, subtitle: a.issuer, date: a.date, desc: a.description })}</React.Fragment>)}</View>;
          case 'languages':
            if (!data.languages || data.languages.length === 0) return null;
            return <View key={section.id} style={{ marginBottom: 16 }}>{getSectionTitleStyle(title, index)}<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{data.languages.map(l => <React.Fragment key={l}>{getSkillChip(l)}</React.Fragment>)}</View></View>;
          case 'interests':
            if (!data.interests || data.interests.length === 0) return null;
            return <View key={section.id} style={{ marginBottom: 16 }}>{getSectionTitleStyle(title, index)}<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{data.interests.map(i => <React.Fragment key={i}>{getSkillChip(i)}</React.Fragment>)}</View></View>;
          case 'custom':
            if (!data.customSections || data.customSections.length === 0) return null;
            const custom = data.customSections.find(cs => cs.id === section.id) || data.customSections[0];
            if (!custom) return null;
            return <View key={section.id} style={{ marginBottom: 16 }}>{getSectionTitleStyle(title, index)}<Text style={{ fontSize: 12 + offset, color: subtext, lineHeight: 18 + offset, ...ff }}>{custom.content}</Text></View>;
          default:
            return null;
        }
      })}
    </View>
  );
};

export default function ResumePreview({ data, template, customTemplateConfig }: ResumePreviewProps) {
  const fontFamily = getRNFontFamily(data.globalStyles?.fontFamily);
  const bodyPx = bodySizeToPx(data.globalStyles?.bodySize);
  const offset = bodyPx - 12;
  const font = fontFamily ? { fontFamily } : {};

  const dyn: Record<string, any> = {
    sectionTitle: { fontSize: 13 + offset, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, color: COLORS.primary, ...font },
    bodyText: { fontSize: 12 + offset, lineHeight: 20 + offset, color: COLORS.gray600, ...font },
    item: { marginBottom: 12 },
    itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
    itemTitle: { fontSize: 13 + offset, fontWeight: '700', color: COLORS.gray800, flex: 1, ...font },
    itemDate: { fontSize: 11 + offset, color: COLORS.gray400, ...font },
    itemCompany: { fontSize: 12 + offset, color: COLORS.primary, marginBottom: 4, ...font },
    itemLink: { fontSize: 10 + offset, color: COLORS.gray400, ...font },
    itemSub: { fontSize: 11 + offset, color: COLORS.gray400, ...font },
    itemDesc: { fontSize: 12 + offset, lineHeight: 18 + offset, color: COLORS.gray600, ...font },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
    chip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1 },
    chipText: { fontSize: 10 + offset, fontWeight: '600', ...font },
    twoCol: { flexDirection: 'row', gap: 16 },
    half: { flex: 1 },
    previewContent: { padding: 12 },
    section: { marginBottom: 16 },
  };

  const ctxValue: FontOverrides = { fontFamily, offset, dyn };

  // Custom template config takes priority
  if (customTemplateConfig) {
    return (
      <View style={dyn.previewContent}>
        <CustomTemplateRenderer data={data} config={customTemplateConfig} />
      </View>
    );
  }

  // Check if this is a built-in template first
  const TemplateComponent = templateMap[template];
  
  // Otherwise, check the factory configs
  const factoryConfig = getTemplateConfig(template);

  return (
    <FontContext.Provider value={ctxValue}>
      <View style={dyn.previewContent}>
        {TemplateComponent ? (
          <TemplateComponent data={data} />
        ) : factoryConfig ? (
          <GenericTemplate data={data} config={factoryConfig} />
        ) : (
          <ModernTemplate data={data} />
        )}
      </View>
    </FontContext.Provider>
  );
}

// Shared styles
const styles = StyleSheet.create({
  previewContent: { padding: 12 },
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
  prof: StyleSheet.create({
    container: { backgroundColor: '#ffffff', borderRadius: 12, padding: 20, elevation: 4 },
    header: { borderBottomWidth: 3, borderBottomColor: '#1e3a5f', paddingBottom: 16, marginBottom: 16 },
    name: { fontSize: 24, fontWeight: '800', color: '#1e3a5f', textTransform: 'uppercase', letterSpacing: 1 },
    jobTitle: { fontSize: 13, fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 4, marginBottom: 12 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    contact: { fontSize: 11, color: '#475569' },
    skillChip: { backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#bfdbfe', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    skillText: { fontSize: 10, fontWeight: '600', color: '#1e40af' },
  }),
  exec: StyleSheet.create({
    container: { backgroundColor: '#ffffff', borderRadius: 12, padding: 20, elevation: 4 },
    header: { paddingBottom: 16, marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
    nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    nameAccent: { width: 4, height: 30, backgroundColor: '#111827', borderRadius: 2, marginRight: 10 },
    name: { fontSize: 24, fontWeight: '900', color: '#111827', letterSpacing: -0.5 },
    jobTitle: { fontSize: 13, fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12, marginLeft: 14 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginLeft: 14 },
    contact: { fontSize: 11, color: '#6b7280' },
    secTitle: { fontSize: 12, fontWeight: '800', color: '#111827', textTransform: 'uppercase', letterSpacing: 2, borderBottomWidth: 2, borderBottomColor: '#111827', paddingBottom: 4, marginBottom: 10 },
    item: { marginBottom: 14, paddingLeft: 12, borderLeftWidth: 2, borderLeftColor: '#e5e7eb' },
    itemTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
    itemDate: { fontSize: 10, color: '#9ca3af' },
    itemCompany: { fontSize: 12, color: '#6b7280', fontWeight: '600', marginBottom: 3 },
    skillChip: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#d1d5db', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
    skillText: { fontSize: 10, fontWeight: '600', color: '#374151' },
  }),
  classic: StyleSheet.create({
    container: { backgroundColor: '#ffffff', borderRadius: 12, padding: 20, elevation: 4 },
    header: { alignItems: 'center', paddingBottom: 16, marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#d1d5db' },
    name: { fontSize: 26, fontWeight: '900', color: '#111827', letterSpacing: 2 },
    divider: { width: 60, height: 2, backgroundColor: '#374151', marginTop: 8, marginBottom: 8 },
    jobTitle: { fontSize: 12, fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 10 },
    contactLine: { fontSize: 11, color: '#6b7280', textAlign: 'center' },
    secTitle: { fontSize: 13, fontWeight: '800', color: '#374151', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingBottom: 4 },
  }),
  elegant: StyleSheet.create({
    container: { backgroundColor: '#ffffff', borderRadius: 12, padding: 20, elevation: 4 },
    header: { borderBottomWidth: 2, borderBottomColor: '#d97706', paddingBottom: 16, marginBottom: 16 },
    name: { fontSize: 24, fontWeight: '800', color: '#451a03', letterSpacing: 0.5 },
    jobTitle: { fontSize: 13, fontWeight: '700', color: '#92400e', textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 4, marginBottom: 12 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    contact: { fontSize: 11, color: '#78716c' },
    secTitle: { fontSize: 12, fontWeight: '800', color: '#92400e', textTransform: 'uppercase', letterSpacing: 2, borderBottomWidth: 1, borderBottomColor: '#fde68a', paddingBottom: 4, marginBottom: 8 },
    item: { marginBottom: 12, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: '#fbbf24' },
    itemTitle: { fontSize: 13, fontWeight: '700', color: '#451a03' },
    itemCompany: { fontSize: 12, color: '#92400e', fontWeight: '600', marginBottom: 3 },
    skillChip: { backgroundColor: '#fffbeb', borderWidth: 1, borderColor: '#fde68a', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    skillText: { fontSize: 10, fontWeight: '600', color: '#92400e' },
  }),
  artistic: StyleSheet.create({
    container: { backgroundColor: '#ffffff', borderRadius: 12, flexDirection: 'row', overflow: 'hidden', elevation: 4 },
    sidebar: { width: 130, backgroundColor: '#f97316', padding: 16 },
    main: { flex: 1, padding: 16 },
    name: { fontSize: 20, fontWeight: '900', color: '#ffffff', marginBottom: 4 },
    jobTitle: { fontSize: 10, fontWeight: '700', color: '#fed7aa', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
    sideLabel: { fontSize: 11, fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
    sideItem: { fontSize: 10, color: '#fff7ed', marginBottom: 4 },
    skillItem: { fontSize: 10, color: '#fff7ed', marginBottom: 3 },
    secTitle: { fontSize: 14, fontWeight: '800', color: '#f97316', textTransform: 'uppercase', marginBottom: 10 },
    item: { flexDirection: 'row', marginBottom: 14, gap: 8 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#f97316', marginTop: 5 },
    itemTitle: { fontSize: 13, fontWeight: '700', color: '#1c1917' },
    itemCompany: { fontSize: 11, color: '#f97316', fontWeight: '600', marginBottom: 3 },
  }),
  compact: StyleSheet.create({
    container: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, elevation: 4 },
    header: { paddingBottom: 12, marginBottom: 12, borderBottomWidth: 2, borderBottomColor: '#ea580c' },
    nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
    name: { fontSize: 20, fontWeight: '800', color: '#1c1917' },
    badge: { backgroundColor: '#ea580c', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
    badgeText: { fontSize: 9, fontWeight: '700', color: '#ffffff' },
    contactLine: { fontSize: 10, color: '#6b7280' },
    secTitle: { fontSize: 10, fontWeight: '800', color: '#ea580c', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 },
  }),
  medical: StyleSheet.create({
    container: { backgroundColor: '#ffffff', borderRadius: 12, padding: 0, elevation: 4, overflow: 'hidden' },
    header: { backgroundColor: '#059669', padding: 20 },
    headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    name: { fontSize: 22, fontWeight: '800', color: '#ffffff' },
    jobTitle: { fontSize: 12, fontWeight: '700', color: '#d1fae5', textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    contact: { fontSize: 10, color: '#d1fae5' },
    secTitle: { fontSize: 13, fontWeight: '700', color: '#059669', textTransform: 'uppercase', borderBottomWidth: 2, borderBottomColor: '#d1fae5', paddingBottom: 4, marginBottom: 8 },
    item: { marginBottom: 12 },
    skillChip: { backgroundColor: '#ecfdf5', borderWidth: 1, borderColor: '#a7f3d0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    skillText: { fontSize: 10, fontWeight: '600', color: '#047857' },
  }),
  academic: StyleSheet.create({
    container: { backgroundColor: '#ffffff', borderRadius: 12, padding: 20, elevation: 4 },
    header: { paddingBottom: 16, marginBottom: 16, borderBottomWidth: 2, borderBottomColor: '#374151' },
    name: { fontSize: 24, fontWeight: '800', color: '#111827', letterSpacing: 0.5 },
    jobTitle: { fontSize: 13, fontWeight: '600', color: '#6b7280', marginTop: 4, marginBottom: 12 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    contact: { fontSize: 11, color: '#6b7280' },
    secTitle: { fontSize: 13, fontWeight: '800', color: '#374151', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#d1d5db', paddingBottom: 4 },
    skillChip: { backgroundColor: '#f3f4f6', borderWidth: 1, borderColor: '#d1d5db', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
    skillText: { fontSize: 10, fontWeight: '600', color: '#374151' },
  }),
  legal: StyleSheet.create({
    container: { backgroundColor: '#ffffff', borderRadius: 12, padding: 20, elevation: 4 },
    header: { borderBottomWidth: 3, borderBottomColor: '#1f2937', paddingBottom: 16, marginBottom: 16 },
    name: { fontSize: 22, fontWeight: '800', color: '#1f2937', textTransform: 'uppercase', letterSpacing: 1.5 },
    jobTitle: { fontSize: 12, fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: 2, marginTop: 4, marginBottom: 12 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    contact: { fontSize: 11, color: '#6b7280' },
    secTitle: { fontSize: 12, fontWeight: '800', color: '#1f2937', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#d1d5db', paddingBottom: 4 },
  }),
  playful: StyleSheet.create({
    container: { backgroundColor: '#fff7ed', borderRadius: 12, padding: 20, elevation: 4 },
    header: { alignItems: 'center', paddingBottom: 16, marginBottom: 16, borderBottomWidth: 3, borderBottomColor: '#fb923c', borderStyle: 'dashed' },
    avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#f97316', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    avatarText: { fontSize: 24, fontWeight: '900', color: '#ffffff' },
    name: { fontSize: 22, fontWeight: '900', color: '#1c1917' },
    jobTitle: { fontSize: 14, fontWeight: '700', color: '#f97316', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4, marginBottom: 12 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
    contact: { fontSize: 11, color: '#78716c' },
    secTitle: { fontSize: 16, fontWeight: '800', color: '#ea580c', marginBottom: 10 },
    item: { marginBottom: 12, backgroundColor: 'rgba(255,255,255,0.6)', padding: 10, borderRadius: 10 },
    itemTitle: { fontSize: 13, fontWeight: '700', color: '#1c1917' },
    itemCompany: { fontSize: 12, color: '#f97316', fontWeight: '600', marginBottom: 3 },
    skillChip: { backgroundColor: '#fed7aa', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16 },
    skillText: { fontSize: 10, fontWeight: '600', color: '#c2410c' },
  }),
  borderless: StyleSheet.create({
    container: { backgroundColor: '#ffffff', borderRadius: 12, padding: 20, elevation: 2 },
    header: { paddingBottom: 16, marginBottom: 16 },
    name: { fontSize: 26, fontWeight: '800', color: '#1f293b' },
    jobTitle: { fontSize: 13, fontWeight: '600', color: '#64748b', marginTop: 4, marginBottom: 12 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    contact: { fontSize: 11, color: '#94a3b8' },
    secTitle: { fontSize: 14, fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
    skillChip: { backgroundColor: '#f8fafc', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    skillText: { fontSize: 10, fontWeight: '600', color: '#475569' },
  }),
  mono: StyleSheet.create({
    container: { backgroundColor: '#ffffff', borderRadius: 12, padding: 20, elevation: 4 },
    header: { borderBottomWidth: 2, borderBottomColor: '#374151', paddingBottom: 16, marginBottom: 16 },
    name: { fontSize: 24, fontWeight: '800', color: '#1f2937', textTransform: 'uppercase', letterSpacing: 1 },
    jobTitle: { fontSize: 13, fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: 2, marginTop: 4, marginBottom: 12 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    contact: { fontSize: 11, color: '#9ca3af' },
    secTitle: { fontSize: 13, fontWeight: '800', color: '#374151', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingBottom: 4 },
    skillChip: { backgroundColor: '#f9fafb', borderWidth: 1, borderColor: '#e5e7eb', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
    skillText: { fontSize: 10, fontWeight: '600', color: '#374151' },
  }),
  tech: StyleSheet.create({
    container: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 20, elevation: 4 },
    header: { borderBottomWidth: 2, borderBottomColor: '#0891b2', paddingBottom: 16, marginBottom: 16 },
    nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#0891b2', marginRight: 8 },
    name: { fontSize: 24, fontWeight: '800', color: '#0f172a', letterSpacing: -0.5 },
    jobTitle: { fontSize: 13, fontWeight: '700', color: '#0891b2', textTransform: 'uppercase', letterSpacing: 1, marginLeft: 18, marginBottom: 12 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginLeft: 18 },
    contact: { fontSize: 11, color: '#64748b' },
    secTitle: { fontSize: 12, fontWeight: '800', color: '#0891b2', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
    item: { marginBottom: 12, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: '#e0f2fe' },
    itemTitle: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
    itemCompany: { fontSize: 12, color: '#0891b2', fontWeight: '600', marginBottom: 3 },
    itemDesc: { fontSize: 11, color: '#475569', lineHeight: 16, fontFamily: 'monospace' },
    skillChip: { backgroundColor: '#ecfeff', borderWidth: 1, borderColor: '#a5f3fc', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    skillText: { fontSize: 10, fontWeight: '600', color: '#0e7490' },
  }),
  startup: StyleSheet.create({
    container: { backgroundColor: '#ffffff', borderRadius: 12, padding: 20, elevation: 4 },
    header: { paddingBottom: 16, marginBottom: 16, borderBottomWidth: 3, borderBottomColor: '#ec4899' },
    name: { fontSize: 24, fontWeight: '900', color: '#111827', letterSpacing: -0.5 },
    jobTitle: { fontSize: 14, fontWeight: '700', color: '#ec4899', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4, marginBottom: 12 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    contact: { fontSize: 11, color: '#6b7280' },
    secTitle: { fontSize: 13, fontWeight: '800', color: '#ec4899', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 },
    item: { marginBottom: 14, paddingLeft: 10, borderLeftWidth: 3, borderLeftColor: '#fce7f3' },
    itemTitle: { fontSize: 14, fontWeight: '700', color: '#111827' },
    itemCompany: { fontSize: 12, color: '#f97316', fontWeight: '600', marginBottom: 3 },
    skillChip: { backgroundColor: '#fdf2f8', borderWidth: 1, borderColor: '#fbcfe8', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    skillText: { fontSize: 10, fontWeight: '600', color: '#be185d' },
  }),
  timeline: StyleSheet.create({
    container: { backgroundColor: '#ffffff', borderRadius: 12, padding: 20, elevation: 4 },
    header: { borderBottomWidth: 2, borderBottomColor: '#2563eb', paddingBottom: 16, marginBottom: 16 },
    name: { fontSize: 24, fontWeight: '800', color: '#1e3a5f' },
    jobTitle: { fontSize: 13, fontWeight: '700', color: '#2563eb', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4, marginBottom: 12 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    contact: { fontSize: 11, color: '#64748b' },
    secTitle: { fontSize: 13, fontWeight: '800', color: '#2563eb', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 },
    timelineItem: { flexDirection: 'row', marginBottom: 16 },
    timelineDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#2563eb', marginTop: 4, marginRight: 12, zIndex: 1 },
    timelineLine: { position: 'absolute', left: 5, top: 16, bottom: -8, width: 2, backgroundColor: '#dbeafe' },
    timelineContent: { flex: 1 },
    itemDate: { fontSize: 11, fontWeight: '600', color: '#2563eb', marginBottom: 2 },
    itemTitle: { fontSize: 14, fontWeight: '700', color: '#1e3a5f' },
    itemCompany: { fontSize: 12, color: '#64748b', fontWeight: '600', marginBottom: 4 },
    skillChip: { backgroundColor: '#eff6ff', borderWidth: 1, borderColor: '#bfdbfe', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    skillText: { fontSize: 10, fontWeight: '600', color: '#1d4ed8' },
  }),
  urban: StyleSheet.create({
    container: { backgroundColor: '#ffffff', borderRadius: 12, flexDirection: 'row', overflow: 'hidden', elevation: 4 },
    sidebar: { width: 140, backgroundColor: '#1f2937', padding: 16 },
    main: { flex: 1, padding: 16 },
    avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#facc15', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    avatarText: { fontSize: 18, fontWeight: '900', color: '#1f2937' },
    name: { fontSize: 16, fontWeight: '800', color: '#ffffff', marginBottom: 2 },
    jobTitle: { fontSize: 9, fontWeight: '700', color: '#facc15', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
    sideLabel: { fontSize: 10, fontWeight: '800', color: '#facc15', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
    sideItem: { fontSize: 9, color: '#d1d5db', marginBottom: 4 },
    skillItem: { fontSize: 9, color: '#d1d5db', marginBottom: 3 },
    secTitle: { fontSize: 13, fontWeight: '800', color: '#1f2937', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 },
    item: { marginBottom: 12, paddingLeft: 10, borderLeftWidth: 3, borderLeftColor: '#facc15' },
    itemTitle: { fontSize: 13, fontWeight: '700', color: '#1f2937' },
    itemCompany: { fontSize: 12, color: '#facc15', fontWeight: '600', marginBottom: 3 },
  }),
  nature: StyleSheet.create({
    container: { backgroundColor: '#f7fee7', borderRadius: 12, padding: 20, elevation: 4 },
    header: { borderBottomWidth: 3, borderBottomColor: '#65a30d', paddingBottom: 16, marginBottom: 16 },
    name: { fontSize: 24, fontWeight: '800', color: '#166534' },
    jobTitle: { fontSize: 13, fontWeight: '700', color: '#65a30d', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4, marginBottom: 12 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    contact: { fontSize: 11, color: '#4d7c0f' },
    secTitle: { fontSize: 14, fontWeight: '800', color: '#166534', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
    item: { marginBottom: 12, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: '#86efac' },
    itemTitle: { fontSize: 13, fontWeight: '700', color: '#166534' },
    itemCompany: { fontSize: 12, color: '#15803d', fontWeight: '600', marginBottom: 3 },
    skillChip: { backgroundColor: '#ecfccb', borderWidth: 1, borderColor: '#bef264', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    skillText: { fontSize: 10, fontWeight: '600', color: '#3f6212' },
  }),
  bold: StyleSheet.create({
    container: { backgroundColor: '#ffffff', borderRadius: 12, padding: 20, elevation: 4 },
    header: { backgroundColor: '#7f1d1d', borderRadius: 8, padding: 20, marginBottom: 16 },
    name: { fontSize: 26, fontWeight: '900', color: '#ffffff', textTransform: 'uppercase', letterSpacing: 1 },
    jobTitle: { fontSize: 13, fontWeight: '700', color: '#fca5a5', textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 4, marginBottom: 12 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    contact: { fontSize: 11, color: '#fecaca' },
    secTitle: { fontSize: 14, fontWeight: '800', color: '#7f1d1d', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8, borderBottomWidth: 3, borderBottomColor: '#7f1d1d', paddingBottom: 4 },
    item: { marginBottom: 14, paddingLeft: 10, borderLeftWidth: 3, borderLeftColor: '#fecaca' },
    itemTitle: { fontSize: 14, fontWeight: '800', color: '#7f1d1d' },
    itemCompany: { fontSize: 12, color: '#dc2626', fontWeight: '600', marginBottom: 3 },
    skillChip: { backgroundColor: '#fef2f2', borderWidth: 2, borderColor: '#fecaca', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    skillText: { fontSize: 10, fontWeight: '700', color: '#991b1b' },
  }),
  // Color variant template styles
  ocean: StyleSheet.create({
    container: { backgroundColor: '#f0f9ff', borderRadius: 12, padding: 20, elevation: 4 },
    header: { backgroundColor: '#0369a1', borderRadius: 8, padding: 20, marginBottom: 16 },
    name: { fontSize: 24, fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', letterSpacing: 0.5 },
    jobTitle: { fontSize: 13, fontWeight: '700', color: '#bae6fd', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4, marginBottom: 12 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    contact: { fontSize: 11, color: '#e0f2fe' },
    secTitle: { fontSize: 13, fontWeight: '800', color: '#0369a1', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, borderBottomWidth: 2, borderBottomColor: '#7dd3fc', paddingBottom: 4 },
    item: { marginBottom: 12, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: '#7dd3fc' },
    itemTitle: { fontSize: 13, fontWeight: '700', color: '#0c4a6e' },
    itemCompany: { fontSize: 12, color: '#0284c7', fontWeight: '600', marginBottom: 3 },
    skillChip: { backgroundColor: '#e0f2fe', borderWidth: 1, borderColor: '#7dd3fc', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    skillText: { fontSize: 10, fontWeight: '600', color: '#0369a1' },
  }),
  forest: StyleSheet.create({
    container: { backgroundColor: '#f0fdf4', borderRadius: 12, padding: 20, elevation: 4 },
    header: { backgroundColor: '#166534', borderRadius: 8, padding: 20, marginBottom: 16 },
    name: { fontSize: 24, fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', letterSpacing: 0.5 },
    jobTitle: { fontSize: 13, fontWeight: '700', color: '#bbf7d0', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4, marginBottom: 12 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    contact: { fontSize: 11, color: '#dcfce7' },
    secTitle: { fontSize: 13, fontWeight: '800', color: '#166534', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, borderBottomWidth: 2, borderBottomColor: '#86efac', paddingBottom: 4 },
    item: { marginBottom: 12, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: '#86efac' },
    itemTitle: { fontSize: 13, fontWeight: '700', color: '#14532d' },
    itemCompany: { fontSize: 12, color: '#15803d', fontWeight: '600', marginBottom: 3 },
    skillChip: { backgroundColor: '#dcfce7', borderWidth: 1, borderColor: '#86efac', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    skillText: { fontSize: 10, fontWeight: '600', color: '#166534' },
  }),
  sunset: StyleSheet.create({
    container: { backgroundColor: '#fff7ed', borderRadius: 12, padding: 20, elevation: 4 },
    header: { backgroundColor: '#c2410c', borderRadius: 8, padding: 20, marginBottom: 16 },
    name: { fontSize: 24, fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', letterSpacing: 0.5 },
    jobTitle: { fontSize: 13, fontWeight: '700', color: '#fed7aa', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4, marginBottom: 12 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    contact: { fontSize: 11, color: '#fed7aa' },
    secTitle: { fontSize: 13, fontWeight: '800', color: '#c2410c', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, borderBottomWidth: 2, borderBottomColor: '#fdba74', paddingBottom: 4 },
    item: { marginBottom: 12, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: '#fdba74' },
    itemTitle: { fontSize: 13, fontWeight: '700', color: '#9a3412' },
    itemCompany: { fontSize: 12, color: '#ea580c', fontWeight: '600', marginBottom: 3 },
    skillChip: { backgroundColor: '#ffedd5', borderWidth: 1, borderColor: '#fdba74', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    skillText: { fontSize: 10, fontWeight: '600', color: '#c2410c' },
  }),
  lavender: StyleSheet.create({
    container: { backgroundColor: '#f5f3ff', borderRadius: 12, padding: 20, elevation: 4 },
    header: { backgroundColor: '#6d28d9', borderRadius: 8, padding: 20, marginBottom: 16 },
    name: { fontSize: 24, fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', letterSpacing: 0.5 },
    jobTitle: { fontSize: 13, fontWeight: '700', color: '#ddd6fe', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4, marginBottom: 12 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    contact: { fontSize: 11, color: '#ede9fe' },
    secTitle: { fontSize: 13, fontWeight: '800', color: '#6d28d9', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, borderBottomWidth: 2, borderBottomColor: '#c4b5fd', paddingBottom: 4 },
    item: { marginBottom: 12, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: '#c4b5fd' },
    itemTitle: { fontSize: 13, fontWeight: '700', color: '#5b21b6' },
    itemCompany: { fontSize: 12, color: '#7c3aed', fontWeight: '600', marginBottom: 3 },
    skillChip: { backgroundColor: '#ede9fe', borderWidth: 1, borderColor: '#c4b5fd', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    skillText: { fontSize: 10, fontWeight: '600', color: '#6d28d9' },
  }),
  slate: StyleSheet.create({
    container: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 20, elevation: 4 },
    header: { backgroundColor: '#475569', borderRadius: 8, padding: 20, marginBottom: 16 },
    name: { fontSize: 24, fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', letterSpacing: 0.5 },
    jobTitle: { fontSize: 13, fontWeight: '700', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4, marginBottom: 12 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    contact: { fontSize: 11, color: '#e2e8f0' },
    secTitle: { fontSize: 13, fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, borderBottomWidth: 2, borderBottomColor: '#94a3b8', paddingBottom: 4 },
    item: { marginBottom: 12, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: '#94a3b8' },
    itemTitle: { fontSize: 13, fontWeight: '700', color: '#1e293b' },
    itemCompany: { fontSize: 12, color: '#64748b', fontWeight: '600', marginBottom: 3 },
    skillChip: { backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#94a3b8', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    skillText: { fontSize: 10, fontWeight: '600', color: '#475569' },
  }),
  charcoal: StyleSheet.create({
    container: { backgroundColor: '#fafafa', borderRadius: 12, padding: 20, elevation: 4 },
    header: { backgroundColor: '#1e293b', borderRadius: 8, padding: 20, marginBottom: 16 },
    name: { fontSize: 24, fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', letterSpacing: 0.5 },
    jobTitle: { fontSize: 13, fontWeight: '700', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4, marginBottom: 12 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    contact: { fontSize: 11, color: '#e2e8f0' },
    secTitle: { fontSize: 13, fontWeight: '800', color: '#1e293b', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, borderBottomWidth: 2, borderBottomColor: '#475569', paddingBottom: 4 },
    item: { marginBottom: 12, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: '#475569' },
    itemTitle: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
    itemCompany: { fontSize: 12, color: '#334155', fontWeight: '600', marginBottom: 3 },
    skillChip: { backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#475569', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    skillText: { fontSize: 10, fontWeight: '600', color: '#1e293b' },
  }),
  midnight: StyleSheet.create({
    container: { backgroundColor: '#eef2ff', borderRadius: 12, padding: 20, elevation: 4 },
    header: { backgroundColor: '#312e81', borderRadius: 8, padding: 20, marginBottom: 16 },
    name: { fontSize: 24, fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', letterSpacing: 0.5 },
    jobTitle: { fontSize: 13, fontWeight: '700', color: '#c7d2fe', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4, marginBottom: 12 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    contact: { fontSize: 11, color: '#ddd6fe' },
    secTitle: { fontSize: 13, fontWeight: '800', color: '#312e81', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, borderBottomWidth: 2, borderBottomColor: '#a5b4fc', paddingBottom: 4 },
    item: { marginBottom: 12, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: '#a5b4fc' },
    itemTitle: { fontSize: 13, fontWeight: '700', color: '#1e1b4b' },
    itemCompany: { fontSize: 12, color: '#4338ca', fontWeight: '600', marginBottom: 3 },
    skillChip: { backgroundColor: '#e0e7ff', borderWidth: 1, borderColor: '#a5b4fc', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    skillText: { fontSize: 10, fontWeight: '600', color: '#312e81' },
  }),
  ruby: StyleSheet.create({
    container: { backgroundColor: '#fef2f2', borderRadius: 12, padding: 20, elevation: 4 },
    header: { backgroundColor: '#991b1b', borderRadius: 8, padding: 20, marginBottom: 16 },
    name: { fontSize: 24, fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', letterSpacing: 0.5 },
    jobTitle: { fontSize: 13, fontWeight: '700', color: '#fecaca', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4, marginBottom: 12 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    contact: { fontSize: 11, color: '#fce7f3' },
    secTitle: { fontSize: 13, fontWeight: '800', color: '#991b1b', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, borderBottomWidth: 2, borderBottomColor: '#fca5a5', paddingBottom: 4 },
    item: { marginBottom: 12, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: '#fca5a5' },
    itemTitle: { fontSize: 13, fontWeight: '700', color: '#7f1d1d' },
    itemCompany: { fontSize: 12, color: '#dc2626', fontWeight: '600', marginBottom: 3 },
    skillChip: { backgroundColor: '#fce7f3', borderWidth: 1, borderColor: '#fca5a5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    skillText: { fontSize: 10, fontWeight: '600', color: '#991b1b' },
  }),
  emerald: StyleSheet.create({
    container: { backgroundColor: '#ecfdf5', borderRadius: 12, padding: 20, elevation: 4 },
    header: { backgroundColor: '#047857', borderRadius: 8, padding: 20, marginBottom: 16 },
    name: { fontSize: 24, fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', letterSpacing: 0.5 },
    jobTitle: { fontSize: 13, fontWeight: '700', color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4, marginBottom: 12 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    contact: { fontSize: 11, color: '#d1fae5' },
    secTitle: { fontSize: 13, fontWeight: '800', color: '#047857', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, borderBottomWidth: 2, borderBottomColor: '#6ee7b7', paddingBottom: 4 },
    item: { marginBottom: 12, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: '#6ee7b7' },
    itemTitle: { fontSize: 13, fontWeight: '700', color: '#064e3b' },
    itemCompany: { fontSize: 12, color: '#059669', fontWeight: '600', marginBottom: 3 },
    skillChip: { backgroundColor: '#d1fae5', borderWidth: 1, borderColor: '#6ee7b7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    skillText: { fontSize: 10, fontWeight: '600', color: '#047857' },
  }),
  cobalt: StyleSheet.create({
    container: { backgroundColor: '#eff6ff', borderRadius: 12, padding: 20, elevation: 4 },
    header: { backgroundColor: '#1e3a8a', borderRadius: 8, padding: 20, marginBottom: 16 },
    name: { fontSize: 24, fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', letterSpacing: 0.5 },
    jobTitle: { fontSize: 13, fontWeight: '700', color: '#bfdbfe', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4, marginBottom: 12 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    contact: { fontSize: 11, color: '#dbeafe' },
    secTitle: { fontSize: 13, fontWeight: '800', color: '#1e3a8a', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, borderBottomWidth: 2, borderBottomColor: '#93c5fd', paddingBottom: 4 },
    item: { marginBottom: 12, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: '#93c5fd' },
    itemTitle: { fontSize: 13, fontWeight: '700', color: '#172554' },
    itemCompany: { fontSize: 12, color: '#2563eb', fontWeight: '600', marginBottom: 3 },
    skillChip: { backgroundColor: '#dbeafe', borderWidth: 1, borderColor: '#93c5fd', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    skillText: { fontSize: 10, fontWeight: '600', color: '#1e3a8a' },
  }),
  gold: StyleSheet.create({
    container: { backgroundColor: '#fffbeb', borderRadius: 12, padding: 20, elevation: 4 },
    header: { backgroundColor: '#b45309', borderRadius: 8, padding: 20, marginBottom: 16 },
    name: { fontSize: 24, fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', letterSpacing: 0.5 },
    jobTitle: { fontSize: 13, fontWeight: '700', color: '#fde68a', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4, marginBottom: 12 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    contact: { fontSize: 11, color: '#fef3c7' },
    secTitle: { fontSize: 13, fontWeight: '800', color: '#b45309', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, borderBottomWidth: 2, borderBottomColor: '#fcd34d', paddingBottom: 4 },
    item: { marginBottom: 12, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: '#fcd34d' },
    itemTitle: { fontSize: 13, fontWeight: '700', color: '#92400e' },
    itemCompany: { fontSize: 12, color: '#d97706', fontWeight: '600', marginBottom: 3 },
    skillChip: { backgroundColor: '#fef3c7', borderWidth: 1, borderColor: '#fcd34d', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    skillText: { fontSize: 10, fontWeight: '600', color: '#b45309' },
  }),
  pink: StyleSheet.create({
    container: { backgroundColor: '#fdf2f8', borderRadius: 12, padding: 20, elevation: 4 },
    header: { backgroundColor: '#be185d', borderRadius: 8, padding: 20, marginBottom: 16 },
    name: { fontSize: 24, fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', letterSpacing: 0.5 },
    jobTitle: { fontSize: 13, fontWeight: '700', color: '#fbcfe8', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4, marginBottom: 12 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    contact: { fontSize: 11, color: '#fce7f3' },
    secTitle: { fontSize: 13, fontWeight: '800', color: '#be185d', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, borderBottomWidth: 2, borderBottomColor: '#f9a8d4', paddingBottom: 4 },
    item: { marginBottom: 12, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: '#f9a8d4' },
    itemTitle: { fontSize: 13, fontWeight: '700', color: '#9d174d' },
    itemCompany: { fontSize: 12, color: '#db2777', fontWeight: '600', marginBottom: 3 },
    skillChip: { backgroundColor: '#fce7f3', borderWidth: 1, borderColor: '#f9a8d4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    skillText: { fontSize: 10, fontWeight: '600', color: '#be185d' },
  }),
  teal: StyleSheet.create({
    container: { backgroundColor: '#f0fdfa', borderRadius: 12, padding: 20, elevation: 4 },
    header: { backgroundColor: '#0f766e', borderRadius: 8, padding: 20, marginBottom: 16 },
    name: { fontSize: 24, fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', letterSpacing: 0.5 },
    jobTitle: { fontSize: 13, fontWeight: '700', color: '#99f6e4', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4, marginBottom: 12 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    contact: { fontSize: 11, color: '#ccfbf1' },
    secTitle: { fontSize: 13, fontWeight: '800', color: '#0f766e', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, borderBottomWidth: 2, borderBottomColor: '#5eead4', paddingBottom: 4 },
    item: { marginBottom: 12, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: '#5eead4' },
    itemTitle: { fontSize: 13, fontWeight: '700', color: '#134e4a' },
    itemCompany: { fontSize: 12, color: '#0d9488', fontWeight: '600', marginBottom: 3 },
    skillChip: { backgroundColor: '#ccfbf1', borderWidth: 1, borderColor: '#5eead4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    skillText: { fontSize: 10, fontWeight: '600', color: '#0f766e' },
  }),
  indigo: StyleSheet.create({
    container: { backgroundColor: '#eef2ff', borderRadius: 12, padding: 20, elevation: 4 },
    header: { backgroundColor: '#3730a3', borderRadius: 8, padding: 20, marginBottom: 16 },
    name: { fontSize: 24, fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', letterSpacing: 0.5 },
    jobTitle: { fontSize: 13, fontWeight: '700', color: '#c7d2fe', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4, marginBottom: 12 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    contact: { fontSize: 11, color: '#ddd6fe' },
    secTitle: { fontSize: 13, fontWeight: '800', color: '#3730a3', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8, borderBottomWidth: 2, borderBottomColor: '#a5b4fc', paddingBottom: 4 },
    item: { marginBottom: 12, paddingLeft: 10, borderLeftWidth: 2, borderLeftColor: '#a5b4fc' },
    itemTitle: { fontSize: 13, fontWeight: '700', color: '#1e1b4b' },
    itemCompany: { fontSize: 12, color: '#4f46e5', fontWeight: '600', marginBottom: 3 },
    skillChip: { backgroundColor: '#e0e7ff', borderWidth: 1, borderColor: '#a5b4fc', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
    skillText: { fontSize: 10, fontWeight: '600', color: '#3730a3' },
  }),
  doubleCol: StyleSheet.create({
    container: { backgroundColor: '#ffffff', borderRadius: 12, flexDirection: 'row', overflow: 'hidden', elevation: 4 },
    leftCol: { width: 140, backgroundColor: '#1f2937', padding: 16 },
    rightCol: { flex: 1, padding: 16 },
    header: { paddingBottom: 12, marginBottom: 12, borderBottomWidth: 2, borderBottomColor: '#334155' },
    name: { fontSize: 16, fontWeight: '800', color: '#ffffff' },
    jobTitle: { fontSize: 9, fontWeight: '600', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginTop: 2 },
    contactRow: { flexDirection: 'column', gap: 2 },
    contact: { fontSize: 9, color: '#d1d5db' },
    section: { marginBottom: 16 },
    secTitle: { fontSize: 11, fontWeight: '800', color: '#ffffff', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
    eduSchool: { fontSize: 12, fontWeight: '700', color: '#ffffff' },
    eduDegree: { fontSize: 10, color: '#9ca3af' },
    itemTitle: { fontSize: 13, fontWeight: '700', color: '#1f2937' },
    itemCompany: { fontSize: 11, color: '#374151', fontWeight: '600', marginBottom: 2 },
  }),
  singleCol: StyleSheet.create({
    container: { backgroundColor: '#ffffff', borderRadius: 12, padding: 20, elevation: 4 },
    header: { alignItems: 'center', paddingBottom: 12, marginBottom: 8 },
    name: { fontSize: 26, fontWeight: '900', color: '#111827', letterSpacing: 0.5 },
    jobTitle: { fontSize: 12, fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: 2, marginTop: 4 },
    divider: { width: 50, height: 2, backgroundColor: COLORS.primary, marginTop: 8, marginBottom: 8 },
    contactRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
    contact: { fontSize: 11, color: '#6b7280' },
    secTitle: { fontSize: 12, fontWeight: '800', color: COLORS.primary, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8, borderBottomWidth: 1, borderBottomColor: '#d1d5db', paddingBottom: 4 },
    itemTitle: { fontSize: 13, fontWeight: '700', color: '#111827' },
  }),
};
