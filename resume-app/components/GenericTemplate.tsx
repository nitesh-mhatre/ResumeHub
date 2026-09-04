import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ResumeData } from '../types';
import { formatText } from '../utils/helpers';
import { TemplateConfig, FONT_MAP } from '../utils/templateFactory';
import { GlobalStyle } from '../types';

// Helper to extract first font name for React Native
function getRNFontFamily(cssStack?: string): string | undefined {
  if (!cssStack) return undefined;
  const first = cssStack.split(',')[0].trim().replace(/^['"]|['"]$/g, '');
  return first || undefined;
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

interface GenericTemplateProps {
  data: ResumeData;
  config: TemplateConfig;
}

// ─── Contact Row ───
const ContactRow: React.FC<{ data: ResumeData; color: string }> = ({ data, color }) => (
  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
    {data.personalInfo.email ? <Text style={{ fontSize: 10, color }}>{data.personalInfo.email}</Text> : null}
    {data.personalInfo.phone ? <Text style={{ fontSize: 10, color }}>{data.personalInfo.phone}</Text> : null}
    {data.personalInfo.location ? <Text style={{ fontSize: 10, color }}>{data.personalInfo.location}</Text> : null}
    {data.personalInfo.linkedin ? <Text style={{ fontSize: 10, color }}>{data.personalInfo.linkedin}</Text> : null}
    {data.personalInfo.website ? <Text style={{ fontSize: 10, color }}>{data.personalInfo.website}</Text> : null}
  </View>
);

// ─── Section Title ───
const SectionTitleText: React.FC<{ title: string; config: TemplateConfig; index: number }> = ({ title, config, index }) => {
  const baseStyle: any = { fontSize: 12, fontWeight: '800', textTransform: 'uppercase' as const, letterSpacing: 1.5, marginBottom: 8 };
  switch (config.sectionStyle) {
    case 'underline':
      return <Text style={{ ...baseStyle, color: config.sectionTitleColor, borderBottomWidth: 2, borderBottomColor: config.accentColor, paddingBottom: 4 }}>{title}</Text>;
    case 'background':
      return <View style={{ backgroundColor: config.accentLight, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, marginBottom: 8 }}><Text style={{ ...baseStyle, color: config.accentColor, marginBottom: 0 }}>{title}</Text></View>;
    case 'border-left':
      return <View style={{ borderLeftWidth: 3, borderLeftColor: config.accentColor, paddingLeft: 10, marginBottom: 8 }}><Text style={{ ...baseStyle, color: config.sectionTitleColor, marginBottom: 0 }}>{title}</Text></View>;
    case 'pill':
      return <View style={{ backgroundColor: config.accentColor, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, alignSelf: 'flex-start', marginBottom: 10 }}><Text style={{ ...baseStyle, color: '#ffffff', marginBottom: 0, fontSize: 10 }}>{title}</Text></View>;
    case 'minimal':
      return <Text style={{ ...baseStyle, color: config.subtextColor, borderBottomWidth: 1, borderBottomColor: config.borderColor, paddingBottom: 4, letterSpacing: 3, fontSize: 10 }}>{title}</Text>;
    case 'numbered':
      return <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}><View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: config.accentColor, justifyContent: 'center', alignItems: 'center' }}><Text style={{ fontSize: 10, fontWeight: '800', color: '#ffffff' }}>{index + 1}</Text></View><Text style={{ ...baseStyle, color: config.sectionTitleColor, marginBottom: 0 }}>{title}</Text></View>;
    default:
      return <Text style={{ ...baseStyle, color: config.sectionTitleColor, borderBottomWidth: 1, borderBottomColor: config.borderColor, paddingBottom: 4 }}>{title}</Text>;
  }
};

// ─── Skill Chip ───
// Helper: pick a text color that contrasts against a background
function contrastText(bg: string, light: string, dark: string): string {
  const clean = bg.replace('#', '');
  if (clean.length < 6) return dark;
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? dark : light;
}

const SkillChip: React.FC<{ skill: string; config: TemplateConfig }> = ({ skill, config }) => {
  const baseStyle: any = { paddingHorizontal: 8, paddingVertical: 3, marginRight: 6, marginBottom: 6 };
  const textStyle: any = { fontSize: 9, fontWeight: '600' };
  // Pick chip text color that contrasts with chip background
  const chipTextColor = contrastText(config.chipBg, '#ffffff', config.textColor);
  switch (config.chipStyle) {
    case 'rounded':
      return <View style={{ ...baseStyle, backgroundColor: config.chipBg, borderRadius: 12 }}><Text style={{ ...textStyle, color: chipTextColor }}>{skill}</Text></View>;
    case 'square':
      return <View style={{ ...baseStyle, backgroundColor: config.chipBg, borderRadius: 4 }}><Text style={{ ...textStyle, color: chipTextColor }}>{skill}</Text></View>;
    case 'pill':
      return <View style={{ ...baseStyle, backgroundColor: config.accentColor, borderRadius: 20 }}><Text style={{ ...textStyle, color: '#ffffff' }}>{skill}</Text></View>;
    case 'outlined':
      return <View style={{ ...baseStyle, borderWidth: 1, borderColor: config.accentColor, borderRadius: 8 }}><Text style={{ ...textStyle, color: chipTextColor }}>{skill}</Text></View>;
    case 'filled':
      return <View style={{ ...baseStyle, backgroundColor: config.accentColor + '20', borderRadius: 6 }}><Text style={{ ...textStyle, color: chipTextColor }}>{skill}</Text></View>;
    default:
      return <View style={{ ...baseStyle, backgroundColor: config.chipBg, borderRadius: 12 }}><Text style={{ ...textStyle, color: chipTextColor }}>{skill}</Text></View>;
  }
};

// ─── Experience Item ───
const ExperienceItem: React.FC<{ exp: any; config: TemplateConfig }> = ({ exp, config }) => {
  const fontFamily = FONT_MAP[config.fontStyle] || FONT_MAP.modern;
  const itemBase: any = { marginBottom: 12 };
  switch (config.itemStyle) {
    case 'bordered':
      return <View style={{ ...itemBase, borderWidth: 1, borderColor: config.borderColor, borderRadius: 8, padding: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: config.textColor, fontFamily }}>{exp.title}</Text>
          <Text style={{ fontSize: 9, color: config.dateColor }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text>
        </View>
        <Text style={{ fontSize: 11, color: config.accentColor, fontWeight: '600', marginBottom: 3, fontFamily }}>{exp.company}</Text>
        <Text style={{ fontSize: 10, color: config.subtextColor, lineHeight: 16, fontFamily }}>{formatText(exp.description)}</Text>
      </View>;
    case 'card':
      return <View style={{ ...itemBase, backgroundColor: config.accentLight + '40', borderRadius: 8, padding: 10, borderLeftWidth: 3, borderLeftColor: config.accentColor }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: config.textColor, fontFamily }}>{exp.title}</Text>
          <Text style={{ fontSize: 9, color: config.dateColor }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text>
        </View>
        <Text style={{ fontSize: 11, color: config.accentColor, fontWeight: '600', marginBottom: 3, fontFamily }}>{exp.company}</Text>
        <Text style={{ fontSize: 10, color: config.subtextColor, lineHeight: 16, fontFamily }}>{formatText(exp.description)}</Text>
      </View>;
    case 'timeline':
      return <View style={{ ...itemBase, flexDirection: 'row', gap: 10 }}>
        <View style={{ width: 10, alignItems: 'center' }}>
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: config.accentColor, marginTop: 4 }} />
          <View style={{ flex: 1, width: 2, backgroundColor: config.borderColor, marginTop: 4 }} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 9, color: config.accentColor, fontWeight: '600', marginBottom: 2 }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text>
          <Text style={{ fontSize: 12, fontWeight: '700', color: config.textColor, fontFamily }}>{exp.title}</Text>
          <Text style={{ fontSize: 11, color: config.subtextColor, fontWeight: '600', marginBottom: 3, fontFamily }}>{exp.company}</Text>
          <Text style={{ fontSize: 10, color: config.subtextColor, lineHeight: 16, fontFamily }}>{formatText(exp.description)}</Text>
        </View>
      </View>;
    case 'compact':
      return <View style={{ ...itemBase, marginBottom: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: config.textColor, fontFamily }}>{exp.title}</Text>
          <Text style={{ fontSize: 8, color: config.dateColor }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text>
        </View>
        <Text style={{ fontSize: 10, color: config.accentColor, fontWeight: '600', fontFamily }}>{exp.company}</Text>
        <Text style={{ fontSize: 9, color: config.subtextColor, lineHeight: 14, fontFamily }}>{formatText(exp.description)}</Text>
      </View>;
    default:
      return <View style={itemBase}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: config.textColor, fontFamily }}>{exp.title}</Text>
          <Text style={{ fontSize: 9, color: config.dateColor }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text>
        </View>
        <Text style={{ fontSize: 11, color: config.accentColor, fontWeight: '600', marginBottom: 3, fontFamily }}>{exp.company}</Text>
        <Text style={{ fontSize: 10, color: config.subtextColor, lineHeight: 16, fontFamily }}>{formatText(exp.description)}</Text>
      </View>;
  }
};

// ─── Main GenericTemplate ───
export default function GenericTemplate({ data, config }: GenericTemplateProps) {
  const userFontFamily = getRNFontFamily(data.globalStyles?.fontFamily);
  const fontFamily = userFontFamily || FONT_MAP[config.fontStyle] || FONT_MAP.modern;
  const bodyPx = bodySizeToPx(data.globalStyles?.bodySize);
  const off = bodyPx - 12;

  // Header rendering based on config.headerStyle
  const renderHeader = () => {
    switch (config.headerStyle) {
      case 'background': {
        const hdrTextColor = contrastText(config.headerBg, '#ffffff', config.textColor);
        return (
          <View style={{ backgroundColor: config.headerBg, padding: 16, borderBottomLeftRadius: 12, borderBottomRightRadius: 12, marginBottom: 16 }}>
            <Text style={{ fontSize: 22, fontWeight: '900', color: hdrTextColor, textTransform: 'uppercase', letterSpacing: 1, fontFamily }}>{data.personalInfo.fullName}</Text>
            {data.personalInfo.jobTitle ? <Text style={{ fontSize: 12, fontWeight: '700', color: config.accentColor, textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 3, fontFamily }}>{data.personalInfo.jobTitle}</Text> : null}
            <View style={{ marginTop: 10 }}><ContactRow data={data} color={config.headerColor === config.headerBg ? '#ffffff' : config.subtextColor} /></View>
          </View>
        );
      }
      case 'accent-bar':
        return (
          <View style={{ borderLeftWidth: 4, borderLeftColor: config.accentColor, paddingLeft: 14, paddingBottom: 14, marginBottom: 16, borderBottomWidth: 1, borderBottomColor: config.borderColor }}>
            <Text style={{ fontSize: 22, fontWeight: '900', color: config.textColor, fontFamily }}>{data.personalInfo.fullName}</Text>
            {data.personalInfo.jobTitle ? <Text style={{ fontSize: 12, fontWeight: '700', color: config.accentColor, textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 3, fontFamily }}>{data.personalInfo.jobTitle}</Text> : null}
            <View style={{ marginTop: 10 }}><ContactRow data={data} color={config.subtextColor} /></View>
          </View>
        );
      case 'double-line':
        return (
          <View style={{ paddingBottom: 14, marginBottom: 16, borderBottomWidth: 3, borderBottomColor: config.accentColor }}>
            <Text style={{ fontSize: 22, fontWeight: '900', color: config.textColor, textTransform: 'uppercase', letterSpacing: 2, fontFamily }}>{data.personalInfo.fullName}</Text>
            <View style={{ height: 1, backgroundColor: config.borderColor, marginVertical: 6 }} />
            {data.personalInfo.jobTitle ? <Text style={{ fontSize: 12, fontWeight: '600', color: config.subtextColor, textTransform: 'uppercase', letterSpacing: 2, fontFamily }}>{data.personalInfo.jobTitle}</Text> : null}
            <View style={{ marginTop: 10 }}><ContactRow data={data} color={config.subtextColor} /></View>
          </View>
        );
      case 'gradient':
        return (
          <View style={{ backgroundColor: config.accentColor, padding: 16, borderRadius: 12, marginBottom: 16 }}>
            <Text style={{ fontSize: 22, fontWeight: '900', color: '#ffffff', fontFamily }}>{data.personalInfo.fullName}</Text>
            {data.personalInfo.jobTitle ? <Text style={{ fontSize: 12, fontWeight: '700', color: '#ffffffcc', textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 3, fontFamily }}>{data.personalInfo.jobTitle}</Text> : null}
            <View style={{ marginTop: 10 }}><ContactRow data={data} color="#ffffffbb" /></View>
          </View>
        );
      case 'pill':
        return (
          <View style={{ paddingBottom: 14, marginBottom: 16 }}>
            <Text style={{ fontSize: 22, fontWeight: '900', color: config.textColor, fontFamily }}>{data.personalInfo.fullName}</Text>
            {data.personalInfo.jobTitle ? <View style={{ backgroundColor: config.accentColor, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12, alignSelf: 'flex-start', marginTop: 6 }}><Text style={{ fontSize: 11, fontWeight: '700', color: '#ffffff', fontFamily }}>{data.personalInfo.jobTitle}</Text></View> : null}
            <View style={{ marginTop: 10 }}><ContactRow data={data} color={config.subtextColor} /></View>
          </View>
        );
      case 'bordered':
        return (
          <View style={{ borderWidth: 2, borderColor: config.accentColor, borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <Text style={{ fontSize: 22, fontWeight: '900', color: config.textColor, textAlign: 'center', fontFamily }}>{data.personalInfo.fullName}</Text>
            {data.personalInfo.jobTitle ? <Text style={{ fontSize: 12, fontWeight: '700', color: config.accentColor, textTransform: 'uppercase', letterSpacing: 2, textAlign: 'center', marginTop: 4, fontFamily }}>{data.personalInfo.jobTitle}</Text> : null}
            <View style={{ marginTop: 10 }}><ContactRow data={data} color={config.subtextColor} /></View>
          </View>
        );
      case 'underline':
      default:
        return (
          <View style={{ paddingBottom: 14, marginBottom: 16, borderBottomWidth: 2, borderBottomColor: config.accentColor }}>
            <Text style={{ fontSize: 22, fontWeight: '900', color: config.textColor, fontFamily }}>{data.personalInfo.fullName}</Text>
            {data.personalInfo.jobTitle ? <Text style={{ fontSize: 12, fontWeight: '700', color: config.accentColor, textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 3, fontFamily }}>{data.personalInfo.jobTitle}</Text> : null}
            <View style={{ marginTop: 10 }}><ContactRow data={data} color={config.subtextColor} /></View>
          </View>
        );
    }
  };

  // Sidebar layout
  if (config.layout === 'sidebar-left' || config.layout === 'sidebar-right') {
    const isLeft = config.layout === 'sidebar-left';
    const sidebar = (
      <View style={{ width: 120, backgroundColor: config.headerBg, padding: 14, borderRightWidth: isLeft ? 3 : 0, borderRightColor: config.accentColor, borderLeftWidth: isLeft ? 0 : 3, borderLeftColor: config.accentColor }}>
        <Text style={{ fontSize: 16, fontWeight: '900', color: contrastText(config.headerBg, '#ffffff', config.textColor), fontFamily }}>{data.personalInfo.fullName.split(' ')[0]}</Text>
        <Text style={{ fontSize: 9, color: config.accentColor, textTransform: 'uppercase', letterSpacing: 1, marginTop: 2, fontFamily }}>{data.personalInfo.jobTitle}</Text>
        <View style={{ marginTop: 12 }}>
          <Text style={{ fontSize: 9, fontWeight: '800', color: config.accentColor, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Contact</Text>
          {data.personalInfo.email ? <Text style={{ fontSize: 8, color: config.headerColor === config.headerBg ? '#ffffffcc' : config.subtextColor, marginBottom: 3 }}>{data.personalInfo.email}</Text> : null}
          {data.personalInfo.phone ? <Text style={{ fontSize: 8, color: config.headerColor === config.headerBg ? '#ffffffcc' : config.subtextColor, marginBottom: 3 }}>{data.personalInfo.phone}</Text> : null}
          {data.personalInfo.location ? <Text style={{ fontSize: 8, color: config.headerColor === config.headerBg ? '#ffffffcc' : config.subtextColor, marginBottom: 3 }}>{data.personalInfo.location}</Text> : null}
        </View>
        <View style={{ marginTop: 14 }}>
          <Text style={{ fontSize: 9, fontWeight: '800', color: config.accentColor, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Skills</Text>
          {data.skills.map(s => <Text key={s} style={{ fontSize: 8, color: config.headerColor === config.headerBg ? '#ffffffbb' : config.subtextColor, marginBottom: 3 }}>• {s}</Text>)}
        </View>
        {data.languages && data.languages.length > 0 && (
          <View style={{ marginTop: 14 }}>
            <Text style={{ fontSize: 9, fontWeight: '800', color: config.accentColor, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Languages</Text>
            {data.languages.map(l => <Text key={l} style={{ fontSize: 8, color: config.headerColor === config.headerBg ? '#ffffffbb' : config.subtextColor, marginBottom: 3 }}>{l}</Text>)}
          </View>
        )}
      </View>
    );
    const main = (
      <View style={{ flex: 1, padding: 14 }}>
        {data.summary ? <View style={{ marginBottom: 14 }}><SectionTitleText title="Profile" config={config} index={0} /><Text style={{ fontSize: 10, color: config.subtextColor, lineHeight: 16, fontFamily }}>{formatText(data.summary)}</Text></View> : null}
        <View style={{ marginBottom: 14 }}><SectionTitleText title="Experience" config={config} index={1} />{data.experience.map(exp => <ExperienceItem key={exp.id} exp={exp} config={config} />)}</View>
        <View style={{ marginBottom: 14 }}><SectionTitleText title="Education" config={config} index={2} />{data.education.map(edu => <View key={edu.id} style={{ marginBottom: 8 }}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ fontSize: 11, fontWeight: '700', color: config.textColor, fontFamily }}>{edu.school}</Text><Text style={{ fontSize: 8, color: config.dateColor }}>{edu.startDate} – {edu.endDate}</Text></View><Text style={{ fontSize: 10, color: config.subtextColor, fontFamily }}>{edu.degree}</Text></View>)}</View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{data.skills.map(s => <SkillChip key={s} skill={s} config={config} />)}</View>
      </View>
    );
    return (
      <View style={{ backgroundColor: config.bg, borderRadius: 12, flexDirection: 'row', overflow: 'hidden', elevation: 4 }}>
        {isLeft ? sidebar : main}
        {isLeft ? main : sidebar}
      </View>
    );
  }

  // Standard / centered / timeline / card-based layouts
  const bodyContent = (
    <>
      {data.summary ? <View style={{ marginBottom: 14 }}><SectionTitleText title="Profile" config={config} index={0} /><Text style={{ fontSize: 10, color: config.subtextColor, lineHeight: 16, fontFamily }}>{formatText(data.summary)}</Text></View> : null}
      <View style={{ marginBottom: 14 }}><SectionTitleText title="Experience" config={config} index={1} />{data.experience.map(exp => <ExperienceItem key={exp.id} exp={exp} config={config} />)}</View>
      <View style={{ marginBottom: 14 }}><SectionTitleText title="Education" config={config} index={2} />{data.education.map(edu => <View key={edu.id} style={{ marginBottom: 8 }}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ fontSize: 11, fontWeight: '700', color: config.textColor, fontFamily }}>{edu.school}</Text><Text style={{ fontSize: 8, color: config.dateColor }}>{edu.startDate} – {edu.endDate}</Text></View><Text style={{ fontSize: 10, color: config.subtextColor, fontFamily }}>{edu.degree}</Text></View>)}</View>
      <View style={{ marginBottom: 14 }}><SectionTitleText title="Skills" config={config} index={3} /><View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{data.skills.map(s => <SkillChip key={s} skill={s} config={config} />)}</View></View>
      {data.projects && data.projects.length > 0 && <View style={{ marginBottom: 14 }}><SectionTitleText title="Projects" config={config} index={4} />{data.projects.map(p => <View key={p.id} style={{ marginBottom: 8 }}><Text style={{ fontSize: 11, fontWeight: '700', color: config.textColor, fontFamily }}>{p.name}</Text><Text style={{ fontSize: 10, color: config.subtextColor, lineHeight: 16, fontFamily }}>{formatText(p.description)}</Text></View>)}</View>}
      {data.certificates && data.certificates.length > 0 && <View style={{ marginBottom: 14 }}><SectionTitleText title="Certificates" config={config} index={5} />{data.certificates.map(c => <View key={c.id} style={{ marginBottom: 6 }}><Text style={{ fontSize: 11, fontWeight: '700', color: config.textColor, fontFamily }}>{c.name}</Text><Text style={{ fontSize: 9, color: config.accentColor }}>{c.issuer} • {c.date}</Text></View>)}</View>}
      {data.awards && data.awards.length > 0 && <View style={{ marginBottom: 14 }}><SectionTitleText title="Awards" config={config} index={6} />{data.awards.map(a => <View key={a.id} style={{ marginBottom: 6 }}><View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><Text style={{ fontSize: 11, fontWeight: '700', color: config.textColor, fontFamily }}>{a.name}</Text><Text style={{ fontSize: 8, color: config.dateColor }}>{a.date}</Text></View><Text style={{ fontSize: 10, color: config.subtextColor, fontFamily }}>{formatText(a.description)}</Text></View>)}</View>}
      {data.languages && data.languages.length > 0 && <View style={{ marginBottom: 14 }}><SectionTitleText title="Languages" config={config} index={7} /><View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{data.languages.map(l => <SkillChip key={l} skill={l} config={config} />)}</View></View>}
      {data.interests && data.interests.length > 0 && <View style={{ marginBottom: 14 }}><SectionTitleText title="Interests" config={config} index={8} /><View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>{data.interests.map(i => <SkillChip key={i} skill={i} config={config} />)}</View></View>}
      {data.customSections && data.customSections.length > 0 && data.customSections.map(cs => <View key={cs.id} style={{ marginBottom: 14 }}><SectionTitleText title={cs.title} config={config} index={9} /><Text style={{ fontSize: 10, color: config.subtextColor, lineHeight: 16, fontFamily }}>{formatText(cs.content)}</Text></View>)}
    </>
  );

  const centeredAlign = config.layout === 'centered' ? { alignItems: 'center' as const } : {};

  return (
    <View style={{ backgroundColor: config.bg, borderRadius: 12, padding: 16, elevation: 4, ...centeredAlign }}>
      {renderHeader()}
      {bodyContent}
    </View>
  );
}
