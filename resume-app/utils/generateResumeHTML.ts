import { ResumeData, PaperSize, CustomTemplateConfig, SectionOrderItem, HeaderLayoutType } from '../types';
import { PAPER_SIZES, COLORS } from '../constants';
import { getTemplateConfig, TemplateConfig } from './templateFactory';

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

interface FontOptions {
  fontSize?: string;
  fontFamily?: string;
}

const DEFAULT_FONT_SIZE = '12px';
const DEFAULT_FONT_FAMILY = 'System';

function generateCustomTemplateHTML(
  data: ResumeData,
  paper: { widthMm: number; heightMm: number; widthPx: number; heightPx: number; css: string },
  config: CustomTemplateConfig,
  fontOptions?: FontOptions,
): string {
  const gs = config.globalStyles;
  const bodyFontSize = fontOptions?.fontSize || gs.bodySize || '12px';
  const rawFontFamily = fontOptions?.fontFamily || gs.fontFamily || 'System';

  const parsePx = (val: string): number => {
    const m = val.match(/^(\d+)(px)?$/);
    return m ? parseInt(m[1], 10) : 12;
  };
  const bodyPx = parsePx(bodyFontSize);
  const headerFontSize = `${bodyPx + 10}px`;
  const jobTitleFontSize = `${Math.round(bodyPx * 1.1)}px`;
  const contactFontSize = `${Math.max(9, bodyPx - 1)}px`;
  const sectionTitleFontSize = `${bodyPx + 1}px`;
  const itemTitleFontSize = `${bodyPx + 1}px`;
  const itemDescFontSize = `${bodyPx}px`;
  const itemDateFontSize = `${Math.max(8, bodyPx - 2)}px`;
  const skillFontSize = `${Math.max(8, bodyPx - 2)}px`;

  const accent = gs.accentColor;
  const textColor = gs.textColor;
  const subtext = gs.subtextColor;
  const border = gs.borderColor;
  const bg = gs.backgroundColor;

  const FONT_CSS_FALLBACKS: Record<string, string> = {
    'System': '-apple-system, BlinkMacSystemFont, sans-serif',
    'Helvetica': 'Helvetica, Arial, sans-serif',
    'Arial': 'Arial, sans-serif',
    'Georgia': 'Georgia, serif',
    'TimesNewRomanPSMT': 'Times New Roman, serif',
    'CourierNewPSMT': 'Courier New, monospace',
    'Courier': 'Courier, monospace',
    'TrebuchetMS': 'Trebuchet MS, sans-serif',
    'Palatino': 'Palatino Linotype, serif',
    'Garamond': 'Garamond, serif',
    'Verdana': 'Verdana, sans-serif',
  };
  const bodyFontFamily = FONT_CSS_FALLBACKS[rawFontFamily] || rawFontFamily;
  // Uniform page margin, implemented with the .page box's own padding:
  // @page margins and the print width/height options are ignored (or applied
  // inconsistently) by expo-print on Android, so margins must come from CSS.
  const marginPx = 45; // ~12mm at 96dpi

  // Build header HTML
  const h = config.header;
  let headerHtml = '';
  const contactColor = h.textColor + 'cc';
  const contactHtml = h.showContactRow
    ? `<div style="margin-top:10px;font-size:${contactFontSize};color:${contactColor};">
        ${data.personalInfo.email ? `<span style="margin-right:10px;">${escapeHTML(data.personalInfo.email)}</span>` : ''}
        ${data.personalInfo.phone ? `<span style="margin-right:10px;">${escapeHTML(data.personalInfo.phone)}</span>` : ''}
        ${data.personalInfo.location ? `<span style="margin-right:10px;">${escapeHTML(data.personalInfo.location)}</span>` : ''}
        ${data.personalInfo.linkedin ? `<span style="margin-right:10px;">${escapeHTML(data.personalInfo.linkedin)}</span>` : ''}
        ${data.personalInfo.website ? `<span style="margin-right:10px;">${escapeHTML(data.personalInfo.website)}</span>` : ''}
       </div>`
    : '';
  const jobTitleHtml = h.showJobTitle && data.personalInfo.jobTitle
    ? `<div style="font-size:${jobTitleFontSize};font-weight:700;color:${h.accentColor};text-transform:uppercase;letter-spacing:1.5px;margin-top:4px;">${escapeHTML(data.personalInfo.jobTitle)}</div>`
    : '';
  const nameHtml = `<h1 style="font-size:${headerFontSize};font-weight:900;color:${h.textColor};text-transform:uppercase;letter-spacing:.5px;margin:0;">${escapeHTML(data.personalInfo.fullName)}</h1>`;

  switch (h.layout) {
    case 'split':
      headerHtml = `<div style="display:flex;background:${h.backgroundColor};border-radius:12px;margin-bottom:16px;overflow:hidden;">`;
      headerHtml += `<div style="flex:1;padding:16px;">${nameHtml}${jobTitleHtml}</div>`;
      headerHtml += `<div style="background:${h.accentColor};width:3px;"></div>`;
      headerHtml += `<div style="flex:1;padding:16px;display:flex;flex-direction:column;justify-content:center;font-size:${contactFontSize};color:${contactColor};">`;
      if (data.personalInfo.email) headerHtml += `<div style="margin-bottom:4px;">${escapeHTML(data.personalInfo.email)}</div>`;
      if (data.personalInfo.phone) headerHtml += `<div style="margin-bottom:4px;">${escapeHTML(data.personalInfo.phone)}</div>`;
      if (data.personalInfo.location) headerHtml += `<div>${escapeHTML(data.personalInfo.location)}</div>`;
      headerHtml += `</div></div>`;
      break;
    case 'centered':
      headerHtml = `<div style="text-align:center;padding-bottom:14px;margin-bottom:16px;border-bottom:2px solid ${h.accentColor};">${nameHtml}${jobTitleHtml}${contactHtml}</div>`;
      break;
    case 'left-accent':
      headerHtml = `<div style="border-left:4px solid ${h.accentColor};padding-left:14px;padding-bottom:14px;margin-bottom:16px;border-bottom:1px solid ${border};">${nameHtml}${jobTitleHtml}${contactHtml}</div>`;
      break;
    case 'boxed':
      headerHtml = `<div style="background:${h.backgroundColor};border:2px solid ${h.accentColor};border-radius:12px;padding:16px;margin-bottom:16px;text-align:center;">${nameHtml}${jobTitleHtml}${contactHtml}</div>`;
      break;
    case 'gradient':
      headerHtml = `<div style="background:${h.backgroundColor};padding:16px;border-radius:12px;margin-bottom:16px;">${nameHtml}${jobTitleHtml}${contactHtml}</div>`;
      break;
    case 'minimal':
      headerHtml = `<div style="padding-bottom:14px;margin-bottom:16px;">${nameHtml}${jobTitleHtml}${contactHtml}</div>`;
      break;
    case 'full-width':
    default:
      const fwBorder = h.borderColor ? `;border-bottom:2px solid ${h.borderColor}` : '';
      headerHtml = `<div style="background:${h.backgroundColor};padding:16px;border-radius:12px;margin-bottom:16px${fwBorder};">${nameHtml}${jobTitleHtml}${contactHtml}</div>`;
      break;
  }

  // Section title styles
  const sectionTitleHtml = (title: string, index: number): string => {
    const base = `font-size:${sectionTitleFontSize};font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;page-break-after:avoid;`;
    switch (config.sectionStyle) {
      case 'underline': return `<div style="${base}color:${accent};border-bottom:2px solid ${accent};padding-bottom:4px;margin-bottom:8px;">${escapeHTML(title)}</div>`;
      case 'background': return `<div style="background:${accent}15;padding:8px 12px;border-radius:6px;margin-bottom:8px;"><span style="${base}color:${accent};margin:0;">${escapeHTML(title)}</span></div>`;
      case 'border-left': return `<div style="border-left:3px solid ${accent};padding-left:10px;margin-bottom:8px;"><span style="${base}color:${accent};margin:0;">${escapeHTML(title)}</span></div>`;
      case 'pill': return `<div style="background:${accent};padding:5px 14px;border-radius:20px;display:inline-block;margin-bottom:10px;"><span style="${base}color:#fff;margin:0;font-size:${skillFontSize};">${escapeHTML(title)}</span></div>`;
      case 'minimal': return `<div style="${base}color:${subtext};border-bottom:1px solid ${border};padding-bottom:4px;letter-spacing:3px;font-size:${skillFontSize};">${escapeHTML(title)}</div>`;
      case 'numbered': return `<div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;"><span style="width:22px;height:22px;border-radius:11px;background:${accent};color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:${skillFontSize};font-weight:800;">${index + 1}</span><span style="${base}color:${accent};margin:0;">${escapeHTML(title)}</span></div>`;
      default: return `<div style="${base}color:${accent};border-bottom:1px solid ${border};padding-bottom:4px;">${escapeHTML(title)}</div>`;
    }
  };

  // Skill chip styles
  const skillChipHtml = (skill: string): string => {
    switch (config.chipStyle) {
      case 'rounded': return `<span style="background:${accent}20;color:${accent};padding:3px 10px;border-radius:12px;font-size:${skillFontSize};font-weight:600;display:inline-block;margin:2px 4px 2px 0;">${escapeHTML(skill)}</span>`;
      case 'square': return `<span style="background:${accent}20;color:${accent};padding:3px 10px;border-radius:4px;font-size:${skillFontSize};font-weight:600;display:inline-block;margin:2px 4px 2px 0;">${escapeHTML(skill)}</span>`;
      case 'pill': return `<span style="background:${accent};color:#fff;padding:3px 10px;border-radius:20px;font-size:${skillFontSize};font-weight:600;display:inline-block;margin:2px 4px 2px 0;">${escapeHTML(skill)}</span>`;
      case 'outlined': return `<span style="border:1px solid ${accent};color:${accent};padding:3px 10px;border-radius:8px;font-size:${skillFontSize};font-weight:600;display:inline-block;margin:2px 4px 2px 0;">${escapeHTML(skill)}</span>`;
      case 'filled': return `<span style="background:${accent}15;color:${accent};padding:3px 10px;border-radius:6px;font-size:${skillFontSize};font-weight:600;display:inline-block;margin:2px 4px 2px 0;">${escapeHTML(skill)}</span>`;
      default: return `<span style="background:${accent}20;color:${accent};padding:3px 10px;border-radius:12px;font-size:${skillFontSize};font-weight:600;display:inline-block;margin:2px 4px 2px 0;">${escapeHTML(skill)}</span>`;
    }
  };

  // Build body sections
  const visibleSections = config.sections.filter(s => s.visible);
  let bodyHtml = '';

  for (let i = 0; i < visibleSections.length; i++) {
    const section = visibleSections[i];
    const title = section.customTitle || section.label;
    switch (section.type) {
      case 'header': bodyHtml += headerHtml; break;
      case 'summary':
        if (data.summary) bodyHtml += `<div style="margin-bottom:12px;">${sectionTitleHtml(title, i)}<div style="font-size:${itemDescFontSize};color:${subtext};white-space:pre-line;">${escapeHTML(data.summary)}</div></div>`;
        break;
      case 'experience':
        bodyHtml += `<div style="margin-bottom:12px;page-break-inside:avoid;">${sectionTitleHtml(title, i)}`;
        for (const exp of data.experience) {
          bodyHtml += `<div style="margin-bottom:8px;"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;"><span style="font-weight:700;font-size:${itemTitleFontSize};color:${textColor};">${escapeHTML(exp.title)}</span><span style="font-size:${itemDateFontSize};color:${subtext};">${escapeHTML(exp.startDate)} – ${exp.current ? 'Present' : escapeHTML(exp.endDate)}</span></div><div style="font-size:${itemDescFontSize};color:${accent};margin-bottom:3px;">${escapeHTML(exp.company)}</div><div style="font-size:${itemDescFontSize};color:${subtext};white-space:pre-line;">${nl2br(exp.description)}</div></div>`;
        }
        bodyHtml += `</div>`;
        break;
      case 'education':
        bodyHtml += `<div style="margin-bottom:12px;page-break-inside:avoid;">${sectionTitleHtml(title, i)}`;
        for (const edu of data.education) {
          bodyHtml += `<div style="margin-bottom:8px;"><div style="display:flex;justify-content:space-between;align-items:center;"><span style="font-weight:700;font-size:${itemTitleFontSize};color:${textColor};">${escapeHTML(edu.school)}</span><span style="font-size:${itemDateFontSize};color:${subtext};">${escapeHTML(edu.startDate)} – ${escapeHTML(edu.endDate)}</span></div><div style="font-size:${itemDescFontSize};color:${subtext};">${escapeHTML(edu.degree)}</div></div>`;
        }
        bodyHtml += `</div>`;
        break;
      case 'skills':
        bodyHtml += `<div style="margin-bottom:12px;">${sectionTitleHtml(title, i)}<div style="display:flex;flex-wrap:wrap;gap:4px;">${data.skills.map(s => skillChipHtml(s)).join('')}</div></div>`;
        break;
      case 'projects':
        if (data.projects && data.projects.length > 0) {
          bodyHtml += `<div style="margin-bottom:12px;page-break-inside:avoid;">${sectionTitleHtml(title, i)}`;
          for (const p of data.projects) {
            bodyHtml += `<div style="margin-bottom:8px;"><span style="font-weight:700;font-size:${itemTitleFontSize};color:${textColor};">${escapeHTML(p.name)}</span><div style="font-size:${itemDescFontSize};color:${subtext};white-space:pre-line;">${nl2br(p.description)}</div></div>`;
          }
          bodyHtml += `</div>`;
        }
        break;
      case 'certificates':
        if (data.certificates && data.certificates.length > 0) {
          bodyHtml += `<div style="margin-bottom:12px;page-break-inside:avoid;">${sectionTitleHtml(title, i)}`;
          for (const c of data.certificates) {
            bodyHtml += `<div style="margin-bottom:6px;"><span style="font-weight:700;font-size:${itemTitleFontSize};color:${textColor};">${escapeHTML(c.name)}</span><div style="font-size:${itemDescFontSize};color:${accent};">${escapeHTML(c.issuer)} • ${escapeHTML(c.date)}</div></div>`;
          }
          bodyHtml += `</div>`;
        }
        break;
      case 'awards':
        if (data.awards && data.awards.length > 0) {
          bodyHtml += `<div style="margin-bottom:12px;page-break-inside:avoid;">${sectionTitleHtml(title, i)}`;
          for (const a of data.awards) {
            bodyHtml += `<div style="margin-bottom:6px;"><div style="display:flex;justify-content:space-between;"><span style="font-weight:700;font-size:${itemTitleFontSize};color:${textColor};">${escapeHTML(a.name)}</span><span style="font-size:${itemDateFontSize};color:${subtext};">${escapeHTML(a.date)}</span></div><div style="font-size:${itemDescFontSize};color:${subtext};">${escapeHTML(a.description)}</div></div>`;
          }
          bodyHtml += `</div>`;
        }
        break;
      case 'languages':
        if (data.languages && data.languages.length > 0) {
          bodyHtml += `<div style="margin-bottom:12px;">${sectionTitleHtml(title, i)}<div style="display:flex;flex-wrap:wrap;gap:4px;">${data.languages.map(l => skillChipHtml(l)).join('')}</div></div>`;
        }
        break;
      case 'interests':
        if (data.interests && data.interests.length > 0) {
          bodyHtml += `<div style="margin-bottom:12px;">${sectionTitleHtml(title, i)}<div style="display:flex;flex-wrap:wrap;gap:4px;">${data.interests.map(i => skillChipHtml(i)).join('')}</div></div>`;
        }
        break;
      case 'custom':
        if (data.customSections && data.customSections.length > 0) {
          const custom = data.customSections.find(cs => cs.id === section.id) || data.customSections[0];
          if (custom) {
            bodyHtml += `<div style="margin-bottom:12px;">${sectionTitleHtml(title, i)}<div style="font-size:${itemDescFontSize};color:${subtext};white-space:pre-line;">${nl2br(custom.content)}</div></div>`;
          }
        }
        break;
    }
  }

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
${paper.css}
/* Top margin on every page: the .page box's padding-top only applies on the
   first printed page, so continuation pages need a @page margin instead. */
@page { margin: ${marginPx}px 0 0 0; }
@page :first { margin-top: 0; }
*{margin:0;padding:0;box-sizing:border-box}
/* Keep theme background colors (dark pages, colored header blocks, skill chips)
   when Chromium/WebView renders the PDF — otherwise they print as white. */
*{-webkit-print-color-adjust:exact;print-color-adjust:exact}
html, body { margin: 0; padding: 0; }
body{font-family:${bodyFontFamily};color:${textColor};line-height:1.5;font-size:${bodyFontSize};background:#fff;}
.page{width:${paper.widthPx}px;min-height:${paper.heightPx}px;padding:${marginPx}px;margin:0 auto;background:${bg}}
</style>
</head>
<body>
<div class="page">
${bodyHtml}
</div>
</body>
</html>`;
}

export function generateResumeHTML(data: ResumeData, templateId: string, paperSize: PaperSize, fontOptions?: FontOptions, customConfig?: CustomTemplateConfig): string {
  const paper = PAPER_SIZES.find(p => p.id === paperSize) || PAPER_SIZES[0];

  // If a custom template config is provided, use it directly
  if (customConfig) {
    return generateCustomTemplateHTML(data, paper, customConfig, fontOptions);
  }

  // Try to get a factory template config — if found, render through the same
  // rich HTML path used for custom templates so the PDF matches the on-screen
  // GenericTemplate preview pixel-for-pixel.
  const factoryConfig = getTemplateConfig(templateId);
  if (factoryConfig) {
    return renderViaCustomHTML(data, paper, factoryConfig, fontOptions);
  }

  // Built-in templates (modern, minimal, ats, tech-dark, etc.) don't have
  // factory configs but DO have dedicated rich RN preview components in
  // ResumePreview.templateMap. Build a matching config for each so the PDF
  // goes through generateCustomTemplateHTML and matches the preview.
  const builtinConfig = getBuiltInTemplateConfig(templateId, data, fontOptions);
  if (builtinConfig) {
    return generateCustomTemplateHTML(data, paper, builtinConfig, fontOptions);
  }

  // Ultimate fallback: generic HTML with just the theme colors applied.
  // Only reached for completely unknown template IDs.
  const c = getTemplateColors(templateId);
  return generateFallbackHTML(data, paper, c, fontOptions);
}

// ─── Helper: route a factory TemplateConfig through generateCustomTemplateHTML ───
function renderViaCustomHTML(
  data: ResumeData,
  paper: { widthMm: number; heightMm: number; widthPx: number; heightPx: number; css: string },
  factoryConfig: TemplateConfig,
  fontOptions?: FontOptions,
): string {
  const safeCustomSections = data.customSections ?? [];
  const sectionStyle: CustomTemplateConfig['sectionStyle'] = mapFactorySectionStyle(factoryConfig.sectionStyle) as CustomTemplateConfig['sectionStyle'];
  const chipStyle: CustomTemplateConfig['chipStyle'] = mapFactoryChipStyle(factoryConfig.chipStyle) as CustomTemplateConfig['chipStyle'];
  const itemStyle: CustomTemplateConfig['itemStyle'] = mapFactoryItemStyle(factoryConfig.itemStyle) as CustomTemplateConfig['itemStyle'];
  const wrappedConfig: CustomTemplateConfig = {
    id: factoryConfig.id,
    name: factoryConfig.name,
    globalStyles: {
      fontFamily: fontOptions?.fontFamily || DEFAULT_FONT_FAMILY,
      bodySize: fontOptions?.fontSize || DEFAULT_FONT_SIZE,
      accentColor: factoryConfig.accentColor,
      backgroundColor: factoryConfig.bg,
      textColor: factoryConfig.textColor,
      subtextColor: factoryConfig.subtextColor,
      borderColor: factoryConfig.borderColor,
    },
    header: {
      layout: pickHeaderLayout(factoryConfig) as HeaderLayoutType,
      backgroundColor: factoryConfig.headerBg,
      textColor: factoryConfig.headerColor,
      accentColor: factoryConfig.accentColor,
      showPhoto: false,
      showJobTitle: true,
      showContactRow: true,
      contactLayout: 'row',
    },
    sections: [
      { id: 'header', type: 'header', visible: true, label: 'Header' },
      { id: 'summary', type: 'summary', visible: !!data.summary, label: 'Profile' },
      { id: 'experience', type: 'experience', visible: data.experience.length > 0, label: 'Experience' },
      { id: 'education', type: 'education', visible: data.education.length > 0, label: 'Education' },
      { id: 'skills', type: 'skills', visible: data.skills.length > 0, label: 'Skills' },
      { id: 'projects', type: 'projects', visible: data.projects.length > 0, label: 'Projects' },
      { id: 'certificates', type: 'certificates', visible: data.certificates.length > 0, label: 'Certificates' },
      { id: 'awards', type: 'awards', visible: data.awards.length > 0, label: 'Awards' },
      { id: 'languages', type: 'languages', visible: data.languages.length > 0, label: 'Languages' },
      { id: 'interests', type: 'interests', visible: data.interests.length > 0, label: 'Interests' },
      ...safeCustomSections.map(cs => ({ id: cs.id, type: 'custom' as const, visible: true, label: cs.title })),
    ],
    sectionStyle,
    chipStyle,
    itemStyle,
  };
  return generateCustomTemplateHTML(data, paper, wrappedConfig, fontOptions);
}

// ─── Built-in template configs ───────────────────────────────────────────
// Each built-in template has a dedicated RN preview component in
// ResumePreview.templateMap. These configs map each template to the
// closest matching CustomTemplateConfig so the PDF resembles the preview.

function getBuiltInTemplateConfig(
  templateId: string,
  data: ResumeData,
  fontOptions?: FontOptions,
): CustomTemplateConfig | null {
  const c = BUILTIN_COLORS[templateId];
  if (!c) return null;

  // Per-template layout and style overrides based on the RN component
  // inspected in ResumePreview.tsx.
  const spec = BUILTIN_TEMPLATE_SPECS[templateId];

  const safeCustomSections = data.customSections ?? [];

  const sections: SectionOrderItem[] = [
    { id: 'header', type: 'header', visible: true, label: 'Header' },
    { id: 'summary', type: 'summary', visible: !!data.summary, label: spec?.summaryLabel || 'Profile' },
    { id: 'experience', type: 'experience', visible: data.experience.length > 0, label: 'Experience' },
    { id: 'education', type: 'education', visible: data.education.length > 0, label: 'Education' },
    { id: 'skills', type: 'skills', visible: data.skills.length > 0, label: 'Skills' },
    { id: 'projects', type: 'projects', visible: data.projects.length > 0, label: 'Projects' },
    { id: 'certificates', type: 'certificates', visible: data.certificates.length > 0, label: 'Certificates' },
    { id: 'awards', type: 'awards', visible: data.awards.length > 0, label: 'Awards' },
    { id: 'languages', type: 'languages', visible: data.languages.length > 0, label: 'Languages' },
    { id: 'interests', type: 'interests', visible: data.interests.length > 0, label: 'Interests' },
    ...safeCustomSections.map(cs => ({ id: cs.id, type: 'custom' as const, visible: true, label: cs.title })),
  ];

  const headerLayout = (spec?.headerLayout || 'full-width') as HeaderLayoutType;
  const sectionStyle = (spec?.sectionStyle || 'underline') as CustomTemplateConfig['sectionStyle'];
  const chipStyle = (spec?.chipStyle || 'rounded') as CustomTemplateConfig['chipStyle'];
  const itemStyle = (spec?.itemStyle || 'default') as CustomTemplateConfig['itemStyle'];
  const headerBorderColor = spec?.headerBorderColor || null;

  return {
    id: templateId,
    name: templateId.charAt(0).toUpperCase() + templateId.slice(1),
    globalStyles: {
      fontFamily: fontOptions?.fontFamily || DEFAULT_FONT_FAMILY,
      bodySize: fontOptions?.fontSize || DEFAULT_FONT_SIZE,
      accentColor: c.accent,
      backgroundColor: c.bg,
      textColor: c.text,
      subtextColor: c.subtext,
      borderColor: c.border,
    },
    header: {
      layout: headerLayout,
      backgroundColor: c.headerBg,
      textColor: c.headerColor,
      accentColor: c.accent,
      borderColor: headerBorderColor || undefined,
      showPhoto: false,
      showJobTitle: true,
      showContactRow: true,
      contactLayout: 'row',
    },
    sections,
    sectionStyle,
    chipStyle,
    itemStyle,
  };
}

// ─── Per-template style specs ──────────────────────────────────────────────
// These approximate the RN preview components in ResumePreview.templateMap.
// headerLayout: which HTML header layout best matches the RN header.
// sectionStyle: how section titles are rendered in the RN component.
// chipStyle: how skill chips look in the RN component.
// itemStyle: how experience/education items are laid out.
// summaryLabel: optional custom label for the summary section.

interface BuiltInTemplateSpec {
  headerLayout?: string;
  sectionStyle?: string;
  chipStyle?: string;
  itemStyle?: string;
  summaryLabel?: string;
  headerBorderColor?: string;
}

const BUILTIN_TEMPLATE_SPECS: Record<string, BuiltInTemplateSpec> = {
  // ── modern: underline header border, standard items ──
  modern: {
    headerBorderColor: '#4f46e5',
  },

  // ── minimal: light header border, compact items ──
  minimal: {
    headerLayout: 'minimal',
    headerBorderColor: '#e5e7eb',
    sectionStyle: 'minimal',
    chipStyle: 'square',
    itemStyle: 'compact',
  },

  // ── ats: simple centered header, clean sections, inline skills ──
  ats: {
    headerLayout: 'centered',
    headerBorderColor: '#000000',
    sectionStyle: 'underline',
    chipStyle: 'rounded',
    itemStyle: 'default',
  },

  // ── tech-dark: dark bg, green header text, purple accents ──
  'tech-dark': {
    headerLayout: 'full-width',
    sectionStyle: 'underline',
    chipStyle: 'rounded',
    itemStyle: 'default',
  },

  // ── creative: warm bg, teal section titles, bordered items ──
  creative: {
    headerLayout: 'full-width',
    headerBorderColor: '#14b8a6',
    sectionStyle: 'underline',
    chipStyle: 'square',
    itemStyle: 'bordered',
  },

  // ── corporate: dark header bg, two-column body, sidebar skills ──
  corporate: {
    headerLayout: 'boxed',
    sectionStyle: 'underline',
    chipStyle: 'rounded',
    itemStyle: 'default',
  },

  // ── swiss: red accents, sidebar layout, date column ──
  swiss: {
    headerLayout: 'split',
    headerBorderColor: '#dc2626',
    sectionStyle: 'underline',
    chipStyle: 'rounded',
    itemStyle: 'default',
  },

  // ── professional: navy underline, blue accents, pill-like chips ──
  professional: {
    headerLayout: 'full-width',
    headerBorderColor: '#1e3a5f',
    sectionStyle: 'underline',
    chipStyle: 'rounded',
    itemStyle: 'default',
  },

  // ── executive: left accent bar on name, bold section titles ──
  executive: {
    headerLayout: 'left-accent',
    headerBorderColor: '#e5e7eb',
    sectionStyle: 'underline',
    chipStyle: 'rounded',
    itemStyle: 'default',
  },

  // ── classic: divider line between name/job, inline skills ──
  classic: {
    headerLayout: 'full-width',
    headerBorderColor: '#374151',
    sectionStyle: 'underline',
    chipStyle: 'rounded',
    itemStyle: 'default',
  },

  // ── elegant: gold accents, specific item styling ──
  elegant: {
    headerLayout: 'full-width',
    headerBorderColor: '#d97706',
    sectionStyle: 'underline',
    chipStyle: 'outlined',
    itemStyle: 'default',
  },

  // ── artistic: orange sidebar, dot timeline items ──
  artistic: {
    headerLayout: 'split',
    headerBorderColor: '#f97316',
    sectionStyle: 'underline',
    chipStyle: 'rounded',
    itemStyle: 'timeline',
  },

  // ── compact: badge-style job title, inline skills ──
  compact: {
    headerLayout: 'full-width',
    headerBorderColor: '#ea580c',
    sectionStyle: 'underline',
    chipStyle: 'rounded',
    itemStyle: 'compact',
  },

  // ── medical: green header bg, icon header, green accents ──
  medical: {
    headerLayout: 'boxed',
    sectionStyle: 'underline',
    chipStyle: 'outlined',
    itemStyle: 'default',
  },

  // ── academic: clean header, normal sections ──
  academic: {
    headerLayout: 'minimal',
    sectionStyle: 'underline',
    chipStyle: 'rounded',
    itemStyle: 'default',
  },

  // ── legal: minimal styling ──
  legal: {
    headerLayout: 'minimal',
    sectionStyle: 'underline',
    chipStyle: 'rounded',
    itemStyle: 'default',
  },

  // ── playful: warm bg, orange accents ──
  playful: {
    headerLayout: 'full-width',
    headerBorderColor: '#fb923c',
    sectionStyle: 'underline',
    chipStyle: 'rounded',
    itemStyle: 'default',
  },

  // ── borderless: clean, no borders ──
  borderless: {
    headerLayout: 'minimal',
    sectionStyle: 'minimal',
    chipStyle: 'rounded',
    itemStyle: 'default',
  },

  // ── monochrome: grayscale ──
  monochrome: {
    headerLayout: 'minimal',
    headerBorderColor: '#374151',
    sectionStyle: 'underline',
    chipStyle: 'rounded',
    itemStyle: 'default',
  },

  // ── technical: light bg, cyan accents ──
  technical: {
    headerLayout: 'full-width',
    headerBorderColor: '#0891b2',
    sectionStyle: 'underline',
    chipStyle: 'rounded',
    itemStyle: 'default',
  },

  // ── startup: pink accents ──
  startup: {
    headerLayout: 'full-width',
    headerBorderColor: '#ec4899',
    sectionStyle: 'underline',
    chipStyle: 'rounded',
    itemStyle: 'default',
  },

  // ── timeline: blue accents, timeline items ──
  timeline: {
    headerLayout: 'full-width',
    headerBorderColor: '#2563eb',
    sectionStyle: 'underline',
    chipStyle: 'rounded',
    itemStyle: 'timeline',
  },

  // ── urban: dark header, yellow accents ──
  urban: {
    headerLayout: 'boxed',
    sectionStyle: 'underline',
    chipStyle: 'rounded',
    itemStyle: 'default',
  },

  // ── nature: green theme ──
  nature: {
    headerLayout: 'full-width',
    headerBorderColor: '#65a30d',
    sectionStyle: 'underline',
    chipStyle: 'rounded',
    itemStyle: 'default',
  },

  // ── bold: dark red header, bold text ──
  bold: {
    headerLayout: 'boxed',
    sectionStyle: 'underline',
    chipStyle: 'rounded',
    itemStyle: 'default',
  },
};

// ─── Mappers: translate factory TemplateConfig values to CustomTemplateConfig values ───

function pickHeaderLayout(config: TemplateConfig): string {
  // Combine layout + headerStyle to pick the best matching HTML header layout.
  const layout = config.layout;
  const style = config.headerStyle;

  // Sidebar layouts always render as full-width in the HTML path
  if (layout === 'sidebar-left' || layout === 'sidebar-right') return 'full-width';

  // Centered layout stays centered regardless of header style
  if (layout === 'centered') return 'centered';

  // For standard layout, headerStyle decides
  switch (style) {
    case 'background': return 'boxed';
    case 'accent-bar': return 'left-accent';
    case 'double-line': return 'minimal';
    case 'gradient': return 'gradient';
    case 'pill': return 'centered';
    case 'bordered': return 'boxed';
    case 'none':
    case 'underline':
    default: return 'full-width';
  }
}

function mapFactoryLayout(layout: string): string {
  // Factory layouts: standard, sidebar-left, sidebar-right, centered,
  // two-column, timeline, card-based
  // CustomTemplateConfig header layouts: full-width, centered, left-accent,
  // split, boxed, gradient, minimal
  switch (layout) {
    case 'centered': return 'centered';
    case 'two-column': return 'split';
    case 'timeline': return 'left-accent';
    case 'card-based': return 'boxed';
    case 'sidebar-left':
    case 'sidebar-right':
      return 'full-width';
    default:
      return 'full-width';
  }
}

function mapFactoryHeaderStyle(headerStyle: string): string {
  // Factory header styles: underline, background, accent-bar, none,
  // double-line, gradient, pill, bordered
  // CustomTemplateConfig header layouts map to visual styles internally —
  // we pick the closest matching layout.
  switch (headerStyle) {
    case 'background': return 'boxed';
    case 'accent-bar': return 'left-accent';
    case 'double-line': return 'minimal';
    case 'gradient': return 'gradient';
    case 'pill': return 'centered';
    case 'bordered': return 'boxed';
    case 'none':
    case 'underline':
    default:
      return 'full-width';
  }
}

function mapFactorySectionStyle(style: string): string {
  // Factory: underline, background, border-left, pill, minimal, numbered, icon
  // CustomTemplateConfig: underline, background, border-left, pill, minimal, numbered
  switch (style) {
    case 'icon': return 'minimal';
    default: return style;
  }
}

function mapFactoryChipStyle(style: string): string {
  // Factory: rounded, square, pill, outlined, filled
  // CustomTemplateConfig: rounded, square, pill, outlined, filled
  return style;
}

function mapFactoryItemStyle(style: string): string {
  // Factory: default, bordered, card, timeline, compact
  // CustomTemplateConfig: default, bordered, card, timeline, compact
  return style;
}

// ─── Fallback HTML generator for built-in templates without a factory config ───
function generateFallbackHTML(
  data: ResumeData,
  paper: { widthMm: number; heightMm: number; widthPx: number; heightPx: number; css: string },
  c: TemplateColors,
  fontOptions?: FontOptions,
): string {
  const bodyFontSize = fontOptions?.fontSize || DEFAULT_FONT_SIZE;
  const rawFontFamily = fontOptions?.fontFamily || DEFAULT_FONT_FAMILY;

  const FONT_CSS_FALLBACKS: Record<string, string> = {
    'System': '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
    'Helvetica': 'Helvetica, Arial, sans-serif',
    'HelveticaNeue': 'Helvetica Neue, Helvetica, Arial, sans-serif',
    'Arial': 'Arial, Helvetica, sans-serif',
    'Georgia': 'Georgia, serif',
    'TimesNewRomanPSMT': 'Times New Roman, Times, serif',
    'CourierNewPSMT': 'Courier New, Courier, monospace',
    'Courier': 'Courier, monospace',
    'TrebuchetMS': 'Trebuchet MS, sans-serif',
    'Palatino': 'Palatino Linotype, Palatino, serif',
    'Garamond': 'Garamond, Georgia, serif',
    'Verdana': 'Verdana, Geneva, sans-serif',
    'Tahoma': 'Tahoma, Geneva, sans-serif',
    'Futura': 'Futura, sans-serif',
    'Avenir': 'Avenir, sans-serif',
    'Didot': 'Didot, serif',
    'Baskerville': 'Baskerville, serif',
    'Cochin': 'Cochin, serif',
    'AmericanTypewriter': 'American Typewriter, monospace',
    'Menlo': 'Menlo, monospace',
    'Monaco': 'Monaco, monospace',
    'Optima': 'Optima, sans-serif',
    'Rockwell': 'Rockwell, serif',
    'SnellRoundhand': 'Snell Roundhand, cursive',
  };
  const bodyFontFamily = FONT_CSS_FALLBACKS[rawFontFamily] || rawFontFamily;

  const parsePx = (val: string): number => {
    const m = val.match(/^(\d+)(px)?$/);
    return m ? parseInt(m[1], 10) : 12;
  };
  const bodyPx = parsePx(bodyFontSize);
  const headerFontSize = `${bodyPx + 10}px`;
  const jobTitleFontSize = `${Math.round(bodyPx * 1.1)}px`;
  const contactFontSize = `${Math.max(9, bodyPx - 1)}px`;
  const sectionTitleFontSize = `${bodyPx + 1}px`;
  const itemTitleFontSize = `${bodyPx + 1}px`;
  const itemDescFontSize = `${bodyPx}px`;
  const itemDateFontSize = `${Math.max(8, bodyPx - 2)}px`;
  const skillFontSize = `${Math.max(8, bodyPx - 2)}px`;

  const textColor = c.text;
  const subtextColor = c.subtext;
  const contactColor = c.isDark ? '#cbd5e1' : c.subtext;

  const marginPx = 45;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
${paper.css}
@page { margin: ${marginPx}px 0 0 0; }
@page :first { margin-top: 0; }
*{margin:0;padding:0;box-sizing:border-box}
*{-webkit-print-color-adjust:exact;print-color-adjust:exact}
html, body { margin: 0; padding: 0; }
body{font-family:${bodyFontFamily};color:${textColor};line-height:1.5;font-size:${bodyFontSize};background:#fff;orphans:3;widows:3}
.page{width:${paper.widthPx}px;min-height:${paper.heightPx}px;padding:${marginPx}px;margin:0 auto;background:${c.bg}}
h1{font-size:${headerFontSize};font-weight:800;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;page-break-after:avoid;break-after:avoid}
.job-title{font-size:${jobTitleFontSize};font-weight:700;color:${c.accent};text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;page-break-after:avoid;break-after:avoid}
.contact{font-size:${contactFontSize};color:${contactColor};margin-bottom:16px;page-break-after:avoid;break-after:avoid}.contact span{margin-right:10px}
.section{margin-bottom:12px;page-break-inside:avoid;break-inside:avoid}
.section-title{font-size:${sectionTitleFontSize};font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${c.accent};border-bottom:2px solid ${c.border};padding-bottom:2px;margin-bottom:6px;page-break-after:avoid;break-after:avoid}
.item{margin-bottom:8px}.item-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:2px}
.item-title{font-weight:700;font-size:${itemTitleFontSize};color:${textColor}}.item-date{font-size:${itemDateFontSize};color:${c.date}}
.item-company{font-size:${itemDescFontSize};color:${c.accent};margin-bottom:3px}.item-desc{font-size:${itemDescFontSize};color:${subtextColor};white-space:pre-line}
.skills{display:flex;flex-wrap:wrap;gap:4px}
.skill-tag{background:${c.chipBg};color:${c.chipText};padding:3px 8px;border-radius:10px;font-size:${skillFontSize};font-weight:600}
.summary{font-size:${itemDescFontSize};color:${subtextColor}}
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
