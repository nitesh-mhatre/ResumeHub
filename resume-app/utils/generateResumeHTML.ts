import { ResumeData, PaperSize } from '../types';
import { PAPER_SIZES, COLORS } from '../constants';
import { getTemplateConfig } from './templateFactory';

interface TemplateColors {
  bg: string;
  headerBg: string;
  headerColor: string;
  accent: string;
  accentLight: string;
  text: string;
  subtext: string;
  date: string;
  border: string;
  chipBg: string;
  chipText: string;
  isDark: boolean;
}

// Built-in template color mappings
const BUILTIN_COLORS: Record<string, TemplateColors> = {
  modern: { bg: '#ffffff', headerBg: '#ffffff', headerColor: '#0f172a', accent: '#4f46e5', accentLight: '#e0e7ff', text: '#0f172a', subtext: '#475569', date: '#94a3b8', border: '#e2e8f0', chipBg: '#e0e7ff', chipText: '#4338ca', isDark: false },
  minimal: { bg: '#ffffff', headerBg: '#ffffff', headerColor: '#000000', accent: '#000000', accentLight: '#f8fafc', text: '#1e293b', subtext: '#475569', date: '#94a3b8', border: '#e2e8f0', chipBg: '#f1f5f9', chipText: '#000000', isDark: false },
  ats: { bg: '#ffffff', headerBg: '#ffffff', headerColor: '#000000', accent: '#000000', accentLight: '#f9fafb', text: '#0f172a', subtext: '#475569', date: '#94a3b8', border: '#d1d5db', chipBg: '#f3f4f6', chipText: '#374151', isDark: false },
  'tech-dark': { bg: '#0f172a', headerBg: '#0f172a', headerColor: '#4ade80', accent: '#c084fc', accentLight: '#1e293b', text: '#e2e8f0', subtext: '#94a3b8', date: '#64748b', border: '#334155', chipBg: '#1e293b', chipText: '#4ade80', isDark: true },
  creative: { bg: '#fdf6e3', headerBg: '#fdf6e3', headerColor: '#1e293b', accent: '#14b8a6', accentLight: '#99f6e4', text: '#1e293b', subtext: '#64748b', date: '#94a3b8', border: '#e2e8f0', chipBg: '#e0f2fe', chipText: '#1e293b', isDark: false },
  corporate: { bg: '#ffffff', headerBg: '#1f2937', headerColor: '#ffffff', accent: '#1f2937', accentLight: '#f3f4f6', text: '#1f2937', subtext: '#475569', date: '#9ca3af', border: '#e5e7eb', chipBg: '#f3f4f6', chipText: '#1f2937', isDark: false },
  swiss: { bg: '#ffffff', headerBg: '#ffffff', headerColor: '#000000', accent: '#dc2626', accentLight: '#fee2e2', text: '#000000', subtext: '#475569', date: '#000000', border: '#e5e7eb', chipBg: '#f1f5f9', chipText: '#000000', isDark: false },
  professional: { bg: '#ffffff', headerBg: '#ffffff', headerColor: '#1e3a5f', accent: '#1e3a5f', accentLight: '#dbeafe', text: '#0f172a', subtext: '#475569', date: '#94a3b8', border: '#e2e8f0', chipBg: '#dbeafe', chipText: '#1e40af', isDark: false },
  executive: { bg: '#ffffff', headerBg: '#ffffff', headerColor: '#111827', accent: '#111827', accentLight: '#f9fafb', text: '#111827', subtext: '#6b7280', date: '#9ca3af', border: '#e5e7eb', chipBg: '#f9fafb', chipText: '#374151', isDark: false },
  classic: { bg: '#ffffff', headerBg: '#ffffff', headerColor: '#111827', accent: '#374151', accentLight: '#f3f4f6', text: '#1e293b', subtext: '#475569', date: '#94a3b8', border: '#d1d5db', chipBg: '#f9fafb', chipText: '#374151', isDark: false },
  elegant: { bg: '#ffffff', headerBg: '#ffffff', headerColor: '#451a03', accent: '#d97706', accentLight: '#fef3c7', text: '#451a03', subtext: '#78716c', date: '#b45309', border: '#fef3c7', chipBg: '#fffbeb', chipText: '#92400e', isDark: false },
  artistic: { bg: '#ffffff', headerBg: '#f97316', headerColor: '#ffffff', accent: '#f97316', accentLight: '#ffedd5', text: '#1c1917', subtext: '#475569', date: '#f97316', border: '#ffedd5', chipBg: '#fff7ed', chipText: '#c2410c', isDark: false },
  compact: { bg: '#ffffff', headerBg: '#ffffff', headerColor: '#1c1917', accent: '#ea580c', accentLight: '#fff7ed', text: '#1c1917', subtext: '#6b7280', date: '#94a3b8', border: '#e2e8f0', chipBg: '#fff7ed', chipText: '#ea580c', isDark: false },
  medical: { bg: '#ffffff', headerBg: '#059669', headerColor: '#ffffff', accent: '#059669', accentLight: '#d1fae5', text: '#064e3b', subtext: '#047857', date: '#6ee7b7', border: '#a7f3d0', chipBg: '#ecfdf5', chipText: '#047857', isDark: false },
  academic: { bg: '#ffffff', headerBg: '#ffffff', headerColor: '#111827', accent: '#374151', accentLight: '#f3f4f6', text: '#111827', subtext: '#6b7280', date: '#9ca3af', border: '#d1d5db', chipBg: '#f3f4f6', chipText: '#374151', isDark: false },
  legal: { bg: '#ffffff', headerBg: '#ffffff', headerColor: '#1f2937', accent: '#1f2937', accentLight: '#f3f4f6', text: '#1f2937', subtext: '#6b7280', date: '#9ca3af', border: '#d1d5db', chipBg: '#f1f5f9', chipText: '#1f2937', isDark: false },
  playful: { bg: '#fff7ed', headerBg: '#fff7ed', headerColor: '#1c1917', accent: '#ea580c', accentLight: '#fed7aa', text: '#1c1917', subtext: '#78716c', date: '#f97316', border: '#fed7aa', chipBg: '#fed7aa', chipText: '#c2410c', isDark: false },
  borderless: { bg: '#ffffff', headerBg: '#ffffff', headerColor: '#1f293b', accent: '#64748b', accentLight: '#f8fafc', text: '#1f293b', subtext: '#64748b', date: '#94a3b8', border: '#e2e8f0', chipBg: '#f8fafc', chipText: '#475569', isDark: false },
  monochrome: { bg: '#ffffff', headerBg: '#ffffff', headerColor: '#1f2937', accent: '#374151', accentLight: '#f9fafb', text: '#1f2937', subtext: '#6b7280', date: '#9ca3af', border: '#e5e7eb', chipBg: '#f9fafb', chipText: '#374151', isDark: false },
  technical: { bg: '#f8fafc', headerBg: '#f8fafc', headerColor: '#0f172a', accent: '#0891b2', accentLight: '#cffafe', text: '#0f172a', subtext: '#475569', date: '#94a3b8', border: '#e0f2fe', chipBg: '#ecfeff', chipText: '#0e7490', isDark: false },
  startup: { bg: '#ffffff', headerBg: '#ffffff', headerColor: '#111827', accent: '#ec4899', accentLight: '#fdf2f8', text: '#111827', subtext: '#6b7280', date: '#94a3b8', border: '#e5e7eb', chipBg: '#fdf2f8', chipText: '#be185d', isDark: false },
  timeline: { bg: '#ffffff', headerBg: '#ffffff', headerColor: '#1e3a5f', accent: '#2563eb', accentLight: '#dbeafe', text: '#1e3a5f', subtext: '#64748b', date: '#2563eb', border: '#dbeafe', chipBg: '#eff6ff', chipText: '#1d4ed8', isDark: false },
  urban: { bg: '#ffffff', headerBg: '#1f2937', headerColor: '#ffffff', accent: '#facc15', accentLight: '#fef3c7', text: '#1f2937', subtext: '#4b5563', date: '#9ca3af', border: '#f3f4f6', chipBg: '#fef3c7', chipText: '#1f2937', isDark: false },
  nature: { bg: '#f7fee7', headerBg: '#f7fee7', headerColor: '#166534', accent: '#65a30d', accentLight: '#ecfccb', text: '#166534', subtext: '#4d7c0f', date: '#86efac', border: '#bef264', chipBg: '#ecfccb', chipText: '#3f6212', isDark: false },
  bold: { bg: '#ffffff', headerBg: '#7f1d1d', headerColor: '#ffffff', accent: '#7f1d1d', accentLight: '#fef2f2', text: '#1e293b', subtext: '#475569', date: '#94a3b8', border: '#fecaca', chipBg: '#fef2f2', chipText: '#991b1b', isDark: false },
};

function getTemplateColors(templateId: string): TemplateColors {
  // Check built-in templates first
  if (BUILTIN_COLORS[templateId]) {
    return BUILTIN_COLORS[templateId];
  }

  // Check factory templates
  const config = getTemplateConfig(templateId);
  if (config) {
    const isDark = config.bg === config.headerBg && isColorDark(config.bg);
    // Ensure chipText has contrast against chipBg
    let chipTextColor = config.chipText;
    if (chipTextColor === config.chipBg || !chipTextColor) {
      chipTextColor = isColorDark(config.chipBg) ? '#ffffff' : config.textColor;
    }
    // Ensure headerColor has contrast against headerBg
    let headerTextColor = config.headerColor;
    if (headerTextColor === config.headerBg || !headerTextColor) {
      headerTextColor = isColorDark(config.headerBg) ? '#ffffff' : '#1e293b';
    }
    return {
      bg: config.bg,
      headerBg: config.headerBg,
      headerColor: headerTextColor,
      accent: config.accentColor,
      accentLight: config.accentLight,
      text: config.textColor,
      subtext: config.subtextColor,
      date: config.dateColor,
      border: config.borderColor,
      chipBg: config.chipBg,
      chipText: chipTextColor,
      isDark,
    };
  }

  // Default fallback
  return BUILTIN_COLORS.modern;
}

function isColorDark(hex: string): boolean {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

function escapeHTML(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function nl2br(str: string): string {
  return escapeHTML(str).replace(/\n/g, '<br/>');
}

export function generateResumeHTML(data: ResumeData, templateId: string, paperSize: PaperSize): string {
  const paper = PAPER_SIZES.find(p => p.id === paperSize) || PAPER_SIZES[0];
  const c = getTemplateColors(templateId);

  const textColor = c.text;
  const subtextColor = c.subtext;
  const contactColor = c.isDark ? '#cbd5e1' : c.subtext;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
${paper.css}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:${textColor};line-height:1.5;font-size:12px}
.page{padding:32px;width:${paper.widthPx}px;margin:0 auto;background:${c.bg}}
h1{font-size:24px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px}
.job-title{font-size:13px;font-weight:700;color:${c.accent};text-transform:uppercase;letter-spacing:1px;margin-bottom:10px}
.contact{font-size:11px;color:${contactColor};margin-bottom:16px}.contact span{margin-right:10px}
.section{margin-bottom:16px}
.section-title{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${c.accent};border-bottom:2px solid ${c.border};padding-bottom:3px;margin-bottom:8px}
.item{margin-bottom:12px}.item-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:2px}
.item-title{font-weight:700;font-size:13px;color:${textColor}}.item-date{font-size:10px;color:${c.date}}
.item-company{font-size:11px;color:${c.accent};margin-bottom:3px}.item-desc{font-size:11px;color:${subtextColor};white-space:pre-line}
.skills{display:flex;flex-wrap:wrap;gap:4px}
.skill-tag{background:${c.chipBg};color:${c.chipText};padding:3px 8px;border-radius:10px;font-size:10px;font-weight:600}
.summary{font-size:11px;color:${subtextColor}}
</style>
</head>
<body>
<div class="page">

<h1 style="color:${c.headerColor}">${escapeHTML(data.personalInfo.fullName)}</h1>
<div class="job-title">${escapeHTML(data.personalInfo.jobTitle)}</div>
<div class="contact">
${data.personalInfo.email ? `<span>📧 ${escapeHTML(data.personalInfo.email)}</span>` : ''}
${data.personalInfo.phone ? `<span>📱 ${escapeHTML(data.personalInfo.phone)}</span>` : ''}
${data.personalInfo.location ? `<span>📍 ${escapeHTML(data.personalInfo.location)}</span>` : ''}
${data.personalInfo.linkedin ? `<span>💼 ${escapeHTML(data.personalInfo.linkedin)}</span>` : ''}
${data.personalInfo.website ? `<span>🌐 ${escapeHTML(data.personalInfo.website)}</span>` : ''}
</div>

${data.summary ? `<div class="section"><div class="section-title">Profile</div><div class="summary">${escapeHTML(data.summary)}</div></div>` : ''}

<div class="section"><div class="section-title">Experience</div>
${data.experience.map(exp => `<div class="item"><div class="item-header"><span class="item-title">${escapeHTML(exp.title)}</span><span class="item-date">${escapeHTML(exp.startDate)} – ${exp.current ? 'Present' : escapeHTML(exp.endDate)}</span></div><div class="item-company">${escapeHTML(exp.company)}</div><div class="item-desc">${nl2br(exp.description)}</div></div>`).join('\n')}
</div>

<div class="section"><div class="section-title">Education</div>
${data.education.map(edu => `<div class="item"><div class="item-header"><span class="item-title">${escapeHTML(edu.school)}</span><span class="item-date">${escapeHTML(edu.startDate)} – ${escapeHTML(edu.endDate)}</span></div><div class="item-desc">${escapeHTML(edu.degree)}</div></div>`).join('\n')}
</div>

<div class="section"><div class="section-title">Skills</div><div class="skills">${data.skills.map(s => `<span class="skill-tag">${escapeHTML(s)}</span>`).join('')}</div></div>

${data.projects.length > 0 ? `<div class="section"><div class="section-title">Projects</div>${data.projects.map(p => `<div class="item"><div class="item-title">${escapeHTML(p.name)}</div><div class="item-desc">${nl2br(p.description)}</div></div>`).join('\n')}</div>` : ''}

${data.certificates.length > 0 ? `<div class="section"><div class="section-title">Certificates</div>${data.certificates.map(c => `<div class="item"><div class="item-title">${escapeHTML(c.name)}</div><div class="item-desc">${escapeHTML(c.issuer)} • ${escapeHTML(c.date)}</div></div>`).join('\n')}</div>` : ''}

${data.awards.length > 0 ? `<div class="section"><div class="section-title">Awards</div>${data.awards.map(a => `<div class="item"><div class="item-header"><span class="item-title">${escapeHTML(a.name)}</span><span class="item-date">${escapeHTML(a.date)}</span></div><div class="item-desc">${nl2br(a.description)}</div></div>`).join('\n')}</div>` : ''}

${data.languages.length > 0 ? `<div class="section"><div class="section-title">Languages</div><div class="skills">${data.languages.map(l => `<span class="skill-tag">${escapeHTML(l)}</span>`).join('')}</div></div>` : ''}

${data.interests.length > 0 ? `<div class="section"><div class="section-title">Interests</div><div class="skills">${data.interests.map(i => `<span class="skill-tag">${escapeHTML(i)}</span>`).join('')}</div></div>` : ''}

${data.customSections && data.customSections.length > 0 ? data.customSections.map(s => `<div class="section"><div class="section-title">${escapeHTML(s.title)}</div><div class="item-desc">${nl2br(s.content)}</div></div>`).join('\n') : ''}

</div>
</body>
</html>`;
}
