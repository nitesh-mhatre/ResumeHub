import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ResumeData, TemplateType } from '../types';
import { COLORS } from '../constants';
import { formatText } from '../utils/helpers';
import GenericTemplate from './GenericTemplate';
import { getTemplateConfig } from '../utils/templateFactory';

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

// Professional Template (Navy Blue)
const ProfessionalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <View style={tStyles.prof.container}>
    <View style={tStyles.prof.header}>
      <Text style={tStyles.prof.name}>{data.personalInfo.fullName}</Text>
      <Text style={tStyles.prof.jobTitle}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.prof.contactRow}>
        {data.personalInfo.email ? <Text style={tStyles.prof.contact}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={tStyles.prof.contact}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={tStyles.prof.contact}>{data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={styles.section}><SectionTitle style={{ color: '#1e3a5f' }}>Professional Summary</SectionTitle><Text style={styles.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={styles.section}>
      <SectionTitle style={{ color: '#1e3a5f' }}>Experience</SectionTitle>
      {data.experience.map(exp => (
        <View key={exp.id} style={styles.item}>
          <View style={styles.itemHeader}><Text style={styles.itemTitle}>{exp.title}</Text><Text style={styles.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={{ fontSize: 12, color: '#1e3a5f', fontWeight: '600', marginBottom: 4 }}>{exp.company}</Text>
          <Text style={styles.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <SectionTitle style={{ color: '#1e3a5f' }}>Education</SectionTitle>
      {data.education.map(edu => (
        <View key={edu.id} style={styles.item}>
          <View style={styles.itemHeader}><Text style={styles.itemTitle}>{edu.school}</Text><Text style={styles.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={styles.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <SectionTitle style={{ color: '#1e3a5f' }}>Skills</SectionTitle>
      <View style={styles.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.prof.skillChip}><Text style={tStyles.prof.skillText}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#1e3a5f" />
  </View>
);

// Executive Template
const ExecutiveTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <View style={tStyles.exec.container}>
    <View style={tStyles.exec.header}>
      <View style={tStyles.exec.nameRow}>
        <View style={tStyles.exec.nameAccent} />
        <Text style={tStyles.exec.name}>{data.personalInfo.fullName}</Text>
      </View>
      <Text style={tStyles.exec.jobTitle}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.exec.contactRow}>
        {data.personalInfo.email ? <Text style={tStyles.exec.contact}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={tStyles.exec.contact}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={tStyles.exec.contact}>{data.personalInfo.location}</Text> : null}
        {data.personalInfo.linkedin ? <Text style={tStyles.exec.contact}>{data.personalInfo.linkedin}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={styles.section}><Text style={tStyles.exec.secTitle}>EXECUTIVE SUMMARY</Text><Text style={styles.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={styles.section}>
      <Text style={tStyles.exec.secTitle}>PROFESSIONAL EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={tStyles.exec.item}>
          <View style={styles.itemHeader}><Text style={tStyles.exec.itemTitle}>{exp.title}</Text><Text style={tStyles.exec.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={tStyles.exec.itemCompany}>{exp.company}</Text>
          <Text style={styles.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <Text style={tStyles.exec.secTitle}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={styles.item}>
          <View style={styles.itemHeader}><Text style={tStyles.exec.itemTitle}>{edu.school}</Text><Text style={tStyles.exec.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={styles.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <Text style={tStyles.exec.secTitle}>CORE COMPETENCIES</Text>
      <View style={styles.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.exec.skillChip}><Text style={tStyles.exec.skillText}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#111827" />
  </View>
);

// Classic Template
const ClassicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <View style={tStyles.classic.container}>
    <View style={tStyles.classic.header}>
      <Text style={tStyles.classic.name}>{data.personalInfo.fullName}</Text>
      <View style={tStyles.classic.divider} />
      <Text style={tStyles.classic.jobTitle}>{data.personalInfo.jobTitle}</Text>
      <Text style={tStyles.classic.contactLine}>{[data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location].filter(Boolean).join('  •  ')}</Text>
    </View>
    {data.summary ? <View style={styles.section}><Text style={tStyles.classic.secTitle}>PROFILE</Text><Text style={styles.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={styles.section}>
      <Text style={tStyles.classic.secTitle}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={styles.item}>
          <View style={styles.itemHeader}><Text style={styles.itemTitle}>{exp.title}</Text><Text style={styles.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={styles.itemCompany}>{exp.company}</Text>
          <Text style={styles.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <Text style={tStyles.classic.secTitle}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={styles.item}>
          <View style={styles.itemHeader}><Text style={styles.itemTitle}>{edu.school}</Text><Text style={styles.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={styles.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <Text style={tStyles.classic.secTitle}>SKILLS</Text>
      <Text style={styles.bodyText}>{data.skills.join(' • ')}</Text>
    </View>
    <ExtraSections data={data} titleColor="#374151" />
  </View>
);

// Elegant Template (Gold accents)
const ElegantTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <View style={tStyles.elegant.container}>
    <View style={tStyles.elegant.header}>
      <Text style={tStyles.elegant.name}>{data.personalInfo.fullName}</Text>
      <Text style={tStyles.elegant.jobTitle}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.elegant.contactRow}>
        {data.personalInfo.email ? <Text style={tStyles.elegant.contact}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={tStyles.elegant.contact}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={tStyles.elegant.contact}>{data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={styles.section}><Text style={tStyles.elegant.secTitle}>PROFILE</Text><Text style={styles.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={styles.section}>
      <Text style={tStyles.elegant.secTitle}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={tStyles.elegant.item}>
          <View style={styles.itemHeader}><Text style={tStyles.elegant.itemTitle}>{exp.title}</Text><Text style={styles.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={tStyles.elegant.itemCompany}>{exp.company}</Text>
          <Text style={styles.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <Text style={tStyles.elegant.secTitle}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={styles.item}>
          <View style={styles.itemHeader}><Text style={tStyles.elegant.itemTitle}>{edu.school}</Text><Text style={styles.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={styles.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <Text style={tStyles.elegant.secTitle}>SKILLS</Text>
      <View style={styles.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.elegant.skillChip}><Text style={tStyles.elegant.skillText}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#92400e" />
  </View>
);

// Artistic Template
const ArtisticTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <View style={tStyles.artistic.container}>
    <View style={tStyles.artistic.sidebar}>
      <Text style={tStyles.artistic.name}>{data.personalInfo.fullName}</Text>
      <Text style={tStyles.artistic.jobTitle}>{data.personalInfo.jobTitle}</Text>
      <View style={{ marginTop: 16 }}>
        <Text style={tStyles.artistic.sideLabel}>Contact</Text>
        {data.personalInfo.email ? <Text style={tStyles.artistic.sideItem}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={tStyles.artistic.sideItem}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={tStyles.artistic.sideItem}>{data.personalInfo.location}</Text> : null}
      </View>
      <View style={{ marginTop: 20 }}>
        <Text style={tStyles.artistic.sideLabel}>Skills</Text>
        {data.skills.map(s => <Text key={s} style={tStyles.artistic.skillItem}>▹ {s}</Text>)}
      </View>
      {data.languages && data.languages.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={tStyles.artistic.sideLabel}>Languages</Text>
          {data.languages.map(l => <Text key={l} style={tStyles.artistic.sideItem}>{l}</Text>)}
        </View>
      )}
    </View>
    <View style={tStyles.artistic.main}>
      {data.summary ? <View style={styles.section}><Text style={tStyles.artistic.secTitle}>About Me</Text><Text style={styles.bodyText}>{formatText(data.summary)}</Text></View> : null}
      <View style={styles.section}>
        <Text style={tStyles.artistic.secTitle}>Experience</Text>
        {data.experience.map(exp => (
          <View key={exp.id} style={tStyles.artistic.item}>
            <View style={tStyles.artistic.dot} />
            <View style={{ flex: 1 }}>
              <Text style={tStyles.artistic.itemTitle}>{exp.title}</Text>
              <Text style={tStyles.artistic.itemCompany}>{exp.company} • {exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text>
              <Text style={styles.itemDesc}>{formatText(exp.description)}</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={tStyles.artistic.secTitle}>Education</Text>
        {data.education.map(edu => (
          <View key={edu.id} style={styles.item}>
            <Text style={tStyles.artistic.itemTitle}>{edu.school}</Text>
            <Text style={tStyles.artistic.itemCompany}>{edu.degree} • {edu.startDate} – {edu.endDate}</Text>
          </View>
        ))}
      </View>
      <ExtraSections data={data} titleColor="#f97316" />
    </View>
  </View>
);

// Compact Template
const CompactTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <View style={tStyles.compact.container}>
    <View style={tStyles.compact.header}>
      <View style={tStyles.compact.nameRow}>
        <Text style={tStyles.compact.name}>{data.personalInfo.fullName}</Text>
        <View style={tStyles.compact.badge}>
          <Text style={tStyles.compact.badgeText}>{data.personalInfo.jobTitle}</Text>
        </View>
      </View>
      <Text style={tStyles.compact.contactLine}>{[data.personalInfo.email, data.personalInfo.phone, data.personalInfo.location].filter(Boolean).join(' | ')}</Text>
    </View>
    {data.summary ? <View style={styles.section}><Text style={tStyles.compact.secTitle}>SUMMARY</Text><Text style={{ fontSize: 11, color: '#475569', lineHeight: 16 }}>{formatText(data.summary)}</Text></View> : null}
    <View style={styles.section}>
      <Text style={tStyles.compact.secTitle}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={{ marginBottom: 6 }}>
          <View style={styles.itemHeader}><Text style={{ fontSize: 12, fontWeight: '700', color: '#1e293b' }}>{exp.title}</Text><Text style={{ fontSize: 9, color: '#94a3b8' }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={{ fontSize: 10, color: '#f97316', fontWeight: '600' }}>{exp.company}</Text>
          <Text style={{ fontSize: 10, color: '#475569', lineHeight: 14 }}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <Text style={tStyles.compact.secTitle}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={{ marginBottom: 4 }}>
          <View style={styles.itemHeader}><Text style={{ fontSize: 12, fontWeight: '700', color: '#1e293b' }}>{edu.school}</Text><Text style={{ fontSize: 9, color: '#94a3b8' }}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={{ fontSize: 10, color: '#475569' }}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <Text style={tStyles.compact.secTitle}>SKILLS</Text>
      <Text style={{ fontSize: 10, color: '#475569' }}>{data.skills.join(' • ')}</Text>
    </View>
    <ExtraSections data={data} titleColor="#ea580c" />
  </View>
);

// Medical Template
const MedicalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <View style={tStyles.medical.container}>
    <View style={tStyles.medical.header}>
      <View style={tStyles.medical.headerTop}>
        <Ionicons name="medical" size={28} color="#ffffff" />
        <View style={{ marginLeft: 12 }}>
          <Text style={tStyles.medical.name}>{data.personalInfo.fullName}</Text>
          <Text style={tStyles.medical.jobTitle}>{data.personalInfo.jobTitle}</Text>
        </View>
      </View>
      <View style={tStyles.medical.contactRow}>
        {data.personalInfo.email ? <Text style={tStyles.medical.contact}>✉ {data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={tStyles.medical.contact}>☎ {data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={tStyles.medical.contact}>◉ {data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={styles.section}><Text style={tStyles.medical.secTitle}>Clinical Summary</Text><Text style={styles.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={styles.section}>
      <Text style={tStyles.medical.secTitle}>Professional Experience</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={tStyles.medical.item}>
          <View style={styles.itemHeader}><Text style={styles.itemTitle}>{exp.title}</Text><Text style={styles.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={{ fontSize: 12, color: '#059669', fontWeight: '600', marginBottom: 3 }}>{exp.company}</Text>
          <Text style={styles.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <Text style={tStyles.medical.secTitle}>Education & Certifications</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={styles.item}>
          <View style={styles.itemHeader}><Text style={styles.itemTitle}>{edu.school}</Text><Text style={styles.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={styles.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
      {data.certificates && data.certificates.length > 0 && data.certificates.map(cert => (
        <View key={cert.id} style={styles.item}>
          <Text style={styles.itemTitle}>{cert.name}</Text>
          <Text style={{ fontSize: 11, color: '#059669' }}>{cert.issuer} • {cert.date}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <Text style={tStyles.medical.secTitle}>Competencies</Text>
      <View style={styles.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.medical.skillChip}><Text style={tStyles.medical.skillText}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#059669" />
  </View>
);

// Academic Template
const AcademicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <View style={tStyles.academic.container}>
    <View style={tStyles.academic.header}>
      <Text style={tStyles.academic.name}>{data.personalInfo.fullName}</Text>
      <Text style={tStyles.academic.jobTitle}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.academic.contactRow}>
        {data.personalInfo.email ? <Text style={tStyles.academic.contact}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={tStyles.academic.contact}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={tStyles.academic.contact}>{data.personalInfo.location}</Text> : null}
        {data.personalInfo.linkedin ? <Text style={tStyles.academic.contact}>{data.personalInfo.linkedin}</Text> : null}
      </View>
    </View>
    {data.summary ? (
      <View style={styles.section}>
        <Text style={tStyles.academic.secTitle}>Research Interests</Text>
        <Text style={styles.bodyText}>{formatText(data.summary)}</Text>
      </View>
    ) : null}
    <View style={styles.section}>
      <Text style={tStyles.academic.secTitle}>Education</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={styles.item}>
          <View style={styles.itemHeader}><Text style={styles.itemTitle}>{edu.degree}</Text><Text style={styles.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={{ fontSize: 12, color: '#111827', fontWeight: '600' }}>{edu.school}</Text>
          {edu.location ? <Text style={{ fontSize: 11, color: '#6b7280' }}>{edu.location}</Text> : null}
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <Text style={tStyles.academic.secTitle}>Experience</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={styles.item}>
          <View style={styles.itemHeader}><Text style={styles.itemTitle}>{exp.title}</Text><Text style={styles.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={styles.itemCompany}>{exp.company}</Text>
          <Text style={styles.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <Text style={tStyles.academic.secTitle}>Skills & Tools</Text>
      <View style={styles.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.academic.skillChip}><Text style={tStyles.academic.skillText}>{s}</Text></View>)}
      </View>
    </View>

    <ExtraSections data={data} titleColor="#374151" />
  </View>
);

// Legal Template
const LegalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <View style={tStyles.legal.container}>
    <View style={tStyles.legal.header}>
      <Text style={tStyles.legal.name}>{data.personalInfo.fullName}, Esq.</Text>
      <Text style={tStyles.legal.jobTitle}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.legal.contactRow}>
        {data.personalInfo.email ? <Text style={tStyles.legal.contact}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={tStyles.legal.contact}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={tStyles.legal.contact}>{data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={styles.section}><Text style={tStyles.legal.secTitle}>PROFESSIONAL SUMMARY</Text><Text style={styles.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={styles.section}>
      <Text style={tStyles.legal.secTitle}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={styles.item}>
          <View style={styles.itemHeader}><Text style={styles.itemTitle}>{exp.title}</Text><Text style={styles.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={{ fontSize: 12, color: '#374151', fontWeight: '600', marginBottom: 3 }}>{exp.company}</Text>
          <Text style={styles.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <Text style={tStyles.legal.secTitle}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={styles.item}>
          <View style={styles.itemHeader}><Text style={styles.itemTitle}>{edu.school}</Text><Text style={styles.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={styles.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <Text style={tStyles.legal.secTitle}>AREAS OF PRACTICE</Text>
      <Text style={styles.bodyText}>{data.skills.join(' • ')}</Text>
    </View>
    <ExtraSections data={data} titleColor="#374151" />
  </View>
);

// Playful Template
const PlayfulTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <View style={tStyles.playful.container}>
    <View style={tStyles.playful.header}>
      <View style={tStyles.playful.avatar}>
        <Text style={tStyles.playful.avatarText}>{data.personalInfo.fullName.charAt(0)}</Text>
      </View>
      <Text style={tStyles.playful.name}>{data.personalInfo.fullName}</Text>
      <Text style={tStyles.playful.jobTitle}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.playful.contactRow}>
        {data.personalInfo.email ? <Text style={tStyles.playful.contact}>📧 {data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={tStyles.playful.contact}>📱 {data.personalInfo.phone}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={styles.section}><Text style={tStyles.playful.secTitle}>✨ About Me</Text><Text style={styles.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={styles.section}>
      <Text style={tStyles.playful.secTitle}>💼 Experience</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={tStyles.playful.item}>
          <View style={styles.itemHeader}><Text style={tStyles.playful.itemTitle}>{exp.title}</Text><Text style={styles.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={tStyles.playful.itemCompany}>{exp.company}</Text>
          <Text style={styles.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <Text style={tStyles.playful.secTitle}>🎓 Education</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={styles.item}>
          <View style={styles.itemHeader}><Text style={tStyles.playful.itemTitle}>{edu.school}</Text><Text style={styles.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={styles.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <Text style={tStyles.playful.secTitle}>🚀 Skills</Text>
      <View style={styles.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.playful.skillChip}><Text style={tStyles.playful.skillText}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#ea580c" />
  </View>
);

// Borderless Template
const BorderlessTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <View style={tStyles.borderless.container}>
    <View style={tStyles.borderless.header}>
      <Text style={tStyles.borderless.name}>{data.personalInfo.fullName}</Text>
      <Text style={tStyles.borderless.jobTitle}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.borderless.contactRow}>
        {data.personalInfo.email ? <Text style={tStyles.borderless.contact}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={tStyles.borderless.contact}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={tStyles.borderless.contact}>{data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={styles.section}><Text style={tStyles.borderless.secTitle}>Profile</Text><Text style={styles.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={styles.section}>
      <Text style={tStyles.borderless.secTitle}>Experience</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={styles.item}>
          <View style={styles.itemHeader}><Text style={styles.itemTitle}>{exp.title}</Text><Text style={styles.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={styles.itemCompany}>{exp.company}</Text>
          <Text style={styles.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <Text style={tStyles.borderless.secTitle}>Education</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={styles.item}>
          <View style={styles.itemHeader}><Text style={styles.itemTitle}>{edu.school}</Text><Text style={styles.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={styles.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <Text style={tStyles.borderless.secTitle}>Skills</Text>
      <View style={styles.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.borderless.skillChip}><Text style={tStyles.borderless.skillText}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#6b7280" />
  </View>
);

// Monochrome Template
const MonochromeTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <View style={tStyles.mono.container}>
    <View style={tStyles.mono.header}>
      <Text style={tStyles.mono.name}>{data.personalInfo.fullName}</Text>
      <Text style={tStyles.mono.jobTitle}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.mono.contactRow}>
        {data.personalInfo.email ? <Text style={tStyles.mono.contact}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={tStyles.mono.contact}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={tStyles.mono.contact}>{data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={styles.section}><Text style={tStyles.mono.secTitle}>PROFILE</Text><Text style={styles.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={styles.section}>
      <Text style={tStyles.mono.secTitle}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={styles.item}>
          <View style={styles.itemHeader}><Text style={styles.itemTitle}>{exp.title}</Text><Text style={styles.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={styles.itemCompany}>{exp.company}</Text>
          <Text style={styles.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <Text style={tStyles.mono.secTitle}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={styles.item}>
          <View style={styles.itemHeader}><Text style={styles.itemTitle}>{edu.school}</Text><Text style={styles.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={styles.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <Text style={tStyles.mono.secTitle}>SKILLS</Text>
      <View style={styles.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.mono.skillChip}><Text style={tStyles.mono.skillText}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#374151" />
  </View>
);

// Technical Template
const TechnicalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <View style={tStyles.tech.container}>
    <View style={tStyles.tech.header}>
      <View style={tStyles.tech.nameRow}>
        <View style={tStyles.tech.dot} />
        <Text style={tStyles.tech.name}>{data.personalInfo.fullName}</Text>
      </View>
      <Text style={tStyles.tech.jobTitle}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.tech.contactRow}>
        {data.personalInfo.email ? <Text style={tStyles.tech.contact}>📧 {data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={tStyles.tech.contact}>📱 {data.personalInfo.phone}</Text> : null}
        {data.personalInfo.website ? <Text style={tStyles.tech.contact}>🌐 {data.personalInfo.website}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={styles.section}><Text style={tStyles.tech.secTitle}>{'// SUMMARY'}</Text><Text style={{ fontSize: 11, color: '#334155', lineHeight: 18, fontFamily: 'monospace' }}>{formatText(data.summary)}</Text></View> : null}
    <View style={styles.section}>
      <Text style={tStyles.tech.secTitle}>{'// EXPERIENCE'}</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={tStyles.tech.item}>
          <View style={styles.itemHeader}><Text style={tStyles.tech.itemTitle}>{exp.title}</Text><Text style={styles.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={tStyles.tech.itemCompany}>{exp.company}</Text>
          <Text style={tStyles.tech.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <Text style={tStyles.tech.secTitle}>{'// SKILLS'}</Text>
      <View style={styles.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.tech.skillChip}><Text style={tStyles.tech.skillText}>{s}</Text></View>)}
      </View>
    </View>
    <View style={styles.section}>
      <Text style={tStyles.tech.secTitle}>{'// EDUCATION'}</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={styles.item}>
          <View style={styles.itemHeader}><Text style={tStyles.tech.itemTitle}>{edu.school}</Text><Text style={styles.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={tStyles.tech.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <ExtraSections data={data} titleColor="#0891b2" />
  </View>
);

// Startup Template
const StartupTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <View style={tStyles.startup.container}>
    <View style={tStyles.startup.header}>
      <Text style={tStyles.startup.name}>{data.personalInfo.fullName}</Text>
      <Text style={tStyles.startup.jobTitle}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.startup.contactRow}>
        {data.personalInfo.email ? <Text style={tStyles.startup.contact}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={tStyles.startup.contact}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={tStyles.startup.contact}>{data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={styles.section}><Text style={tStyles.startup.secTitle}>WHY ME</Text><Text style={styles.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={styles.section}>
      <Text style={tStyles.startup.secTitle}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={tStyles.startup.item}>
          <View style={styles.itemHeader}><Text style={tStyles.startup.itemTitle}>{exp.title}</Text><Text style={styles.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={tStyles.startup.itemCompany}>{exp.company}</Text>
          <Text style={styles.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <Text style={tStyles.startup.secTitle}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={styles.item}>
          <View style={styles.itemHeader}><Text style={tStyles.startup.itemTitle}>{edu.school}</Text><Text style={styles.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={styles.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <Text style={tStyles.startup.secTitle}>TECH STACK</Text>
      <View style={styles.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.startup.skillChip}><Text style={tStyles.startup.skillText}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#ec4899" />
  </View>
);

// Timeline Template
const TimelineTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <View style={tStyles.timeline.container}>
    <View style={tStyles.timeline.header}>
      <Text style={tStyles.timeline.name}>{data.personalInfo.fullName}</Text>
      <Text style={tStyles.timeline.jobTitle}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.timeline.contactRow}>
        {data.personalInfo.email ? <Text style={tStyles.timeline.contact}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={tStyles.timeline.contact}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={tStyles.timeline.contact}>{data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={styles.section}><Text style={tStyles.timeline.secTitle}>PROFILE</Text><Text style={styles.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={styles.section}>
      <Text style={tStyles.timeline.secTitle}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={tStyles.timeline.timelineItem}>
          <View style={tStyles.timeline.timelineDot} />
          <View style={tStyles.timeline.timelineLine} />
          <View style={tStyles.timeline.timelineContent}>
            <Text style={tStyles.timeline.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text>
            <Text style={tStyles.timeline.itemTitle}>{exp.title}</Text>
            <Text style={tStyles.timeline.itemCompany}>{exp.company}</Text>
            <Text style={styles.itemDesc}>{formatText(exp.description)}</Text>
          </View>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <Text style={tStyles.timeline.secTitle}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={tStyles.timeline.timelineItem}>
          <View style={tStyles.timeline.timelineDot} />
          <View style={tStyles.timeline.timelineLine} />
          <View style={tStyles.timeline.timelineContent}>
            <Text style={tStyles.timeline.itemDate}>{edu.startDate} – {edu.endDate}</Text>
            <Text style={tStyles.timeline.itemTitle}>{edu.school}</Text>
            <Text style={styles.itemDesc}>{edu.degree}</Text>
          </View>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <Text style={tStyles.timeline.secTitle}>SKILLS</Text>
      <View style={styles.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.timeline.skillChip}><Text style={tStyles.timeline.skillText}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#2563eb" />
  </View>
);

// Urban Template
const UrbanTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <View style={tStyles.urban.container}>
    <View style={tStyles.urban.sidebar}>
      <View style={tStyles.urban.avatar}>
        <Text style={tStyles.urban.avatarText}>{data.personalInfo.fullName.split(' ').map(n => n.charAt(0)).join('')}</Text>
      </View>
      <Text style={tStyles.urban.name}>{data.personalInfo.fullName}</Text>
      <Text style={tStyles.urban.jobTitle}>{data.personalInfo.jobTitle}</Text>
      <View style={{ marginTop: 16 }}>
        <Text style={tStyles.urban.sideLabel}>Contact</Text>
        {data.personalInfo.email ? <Text style={tStyles.urban.sideItem}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={tStyles.urban.sideItem}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={tStyles.urban.sideItem}>{data.personalInfo.location}</Text> : null}
      </View>
      <View style={{ marginTop: 20 }}>
        <Text style={tStyles.urban.sideLabel}>Skills</Text>
        {data.skills.map(s => <Text key={s} style={tStyles.urban.skillItem}>• {s}</Text>)}
      </View>
      {data.languages && data.languages.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={tStyles.urban.sideLabel}>Languages</Text>
          {data.languages.map(l => <Text key={l} style={tStyles.urban.sideItem}>{l}</Text>)}
        </View>
      )}
    </View>
    <View style={tStyles.urban.main}>
      {data.summary ? <View style={styles.section}><Text style={tStyles.urban.secTitle}>PROFILE</Text><Text style={styles.bodyText}>{formatText(data.summary)}</Text></View> : null}
      <View style={styles.section}>
        <Text style={tStyles.urban.secTitle}>EXPERIENCE</Text>
        {data.experience.map(exp => (
          <View key={exp.id} style={tStyles.urban.item}>
            <View style={styles.itemHeader}><Text style={tStyles.urban.itemTitle}>{exp.title}</Text><Text style={styles.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
            <Text style={tStyles.urban.itemCompany}>{exp.company}</Text>
            <Text style={styles.itemDesc}>{formatText(exp.description)}</Text>
          </View>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={tStyles.urban.secTitle}>EDUCATION</Text>
        {data.education.map(edu => (
          <View key={edu.id} style={styles.item}>
            <View style={styles.itemHeader}><Text style={tStyles.urban.itemTitle}>{edu.school}</Text><Text style={styles.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
            <Text style={styles.itemDesc}>{edu.degree}</Text>
          </View>
        ))}
      </View>
      <ExtraSections data={data} titleColor="#facc15" />
    </View>
  </View>
);

// Nature Template
const NatureTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <View style={tStyles.nature.container}>
    <View style={tStyles.nature.header}>
      <Text style={tStyles.nature.name}>{data.personalInfo.fullName}</Text>
      <Text style={tStyles.nature.jobTitle}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.nature.contactRow}>
        {data.personalInfo.email ? <Text style={tStyles.nature.contact}>📧 {data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={tStyles.nature.contact}>📱 {data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={tStyles.nature.contact}>📍 {data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={styles.section}><Text style={tStyles.nature.secTitle}>🌿 About Me</Text><Text style={styles.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={styles.section}>
      <Text style={tStyles.nature.secTitle}>🌱 Experience</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={tStyles.nature.item}>
          <View style={styles.itemHeader}><Text style={tStyles.nature.itemTitle}>{exp.title}</Text><Text style={styles.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={tStyles.nature.itemCompany}>{exp.company}</Text>
          <Text style={styles.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <Text style={tStyles.nature.secTitle}>📚 Education</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={styles.item}>
          <View style={styles.itemHeader}><Text style={tStyles.nature.itemTitle}>{edu.school}</Text><Text style={styles.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={styles.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <Text style={tStyles.nature.secTitle}>🍃 Skills</Text>
      <View style={styles.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.nature.skillChip}><Text style={tStyles.nature.skillText}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#16a34a" />
  </View>
);

// Bold Template
const BoldTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <View style={tStyles.bold.container}>
    <View style={tStyles.bold.header}>
      <Text style={tStyles.bold.name}>{data.personalInfo.fullName}</Text>
      <Text style={tStyles.bold.jobTitle}>{data.personalInfo.jobTitle}</Text>
      <View style={tStyles.bold.contactRow}>
        {data.personalInfo.email ? <Text style={tStyles.bold.contact}>{data.personalInfo.email}</Text> : null}
        {data.personalInfo.phone ? <Text style={tStyles.bold.contact}>{data.personalInfo.phone}</Text> : null}
        {data.personalInfo.location ? <Text style={tStyles.bold.contact}>{data.personalInfo.location}</Text> : null}
      </View>
    </View>
    {data.summary ? <View style={styles.section}><Text style={tStyles.bold.secTitle}>PROFILE</Text><Text style={styles.bodyText}>{formatText(data.summary)}</Text></View> : null}
    <View style={styles.section}>
      <Text style={tStyles.bold.secTitle}>EXPERIENCE</Text>
      {data.experience.map(exp => (
        <View key={exp.id} style={styles.item}>
          <View style={styles.itemHeader}><Text style={tStyles.bold.itemTitle}>{exp.title}</Text><Text style={styles.itemDate}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text></View>
          <Text style={tStyles.bold.itemCompany}>{exp.company}</Text>
          <Text style={styles.itemDesc}>{formatText(exp.description)}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <Text style={tStyles.bold.secTitle}>EDUCATION</Text>
      {data.education.map(edu => (
        <View key={edu.id} style={styles.item}>
          <View style={styles.itemHeader}><Text style={tStyles.bold.itemTitle}>{edu.school}</Text><Text style={styles.itemDate}>{edu.startDate} – {edu.endDate}</Text></View>
          <Text style={styles.itemDesc}>{edu.degree}</Text>
        </View>
      ))}
    </View>
    <View style={styles.section}>
      <Text style={tStyles.bold.secTitle}>SKILLS</Text>
      <View style={styles.chips}>
        {data.skills.map(s => <View key={s} style={tStyles.bold.skillChip}><Text style={tStyles.bold.skillText}>{s}</Text></View>)}
      </View>
    </View>
    <ExtraSections data={data} titleColor="#b91c1c" />
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
};

export default function ResumePreview({ data, template }: ResumePreviewProps) {
  // Check if this is a built-in template first
  const TemplateComponent = templateMap[template];
  
  // Otherwise, check the factory configs
  const factoryConfig = getTemplateConfig(template);

  return (
    <View style={styles.previewContent}>
      {TemplateComponent ? (
        <TemplateComponent data={data} />
      ) : factoryConfig ? (
        <GenericTemplate data={data} config={factoryConfig} />
      ) : (
        <ModernTemplate data={data} />
      )}
    </View>
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
};
