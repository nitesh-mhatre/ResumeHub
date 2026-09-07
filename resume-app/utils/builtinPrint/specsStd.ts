// Per-template descriptors for the standard single-column hand-crafted
// templates. Values mirror the RN components + tStyles in ResumePreview.tsx.
import { StdSpec } from './engine';

const INDIGO = '#4f46e5';

// ─── Color-theme templates (ocean … indigo) ────────────────────────────────
// Each Color Theme renders in the preview (ResumePreview.templateMap) as a
// light pastel page with a solid colored header band and ABOUT/EXPERIENCE/
// EDUCATION/SKILLS sections. These specs are generated from one palette table
// so the exported PDF mirrors the on-screen component 1:1.
interface BandedThemePalette {
  id: string;
  pageBg: string;
  band: string;       // header band background + section-title color
  jobTint: string;    // job title inside the band
  contactTint: string;// contact text inside the band
  border: string;     // section/item/chip border tint
  itemTitle: string;  // experience/education title color
  company: string;    // company text color
  chipBg: string;
  chipTxt: string;
  extra: string;      // ExtraSections title color
}

const BANDED_THEME_PALETTES: BandedThemePalette[] = [
  { id: 'ocean', pageBg: '#f0f9ff', band: '#0369a1', jobTint: '#bae6fd', contactTint: '#e0f2fe', border: '#7dd3fc', itemTitle: '#0c4a6e', company: '#0284c7', chipBg: '#e0f2fe', chipTxt: '#0369a1', extra: '#0369a1' },
  { id: 'forest', pageBg: '#f0fdf4', band: '#166534', jobTint: '#bbf7d0', contactTint: '#dcfce7', border: '#86efac', itemTitle: '#14532d', company: '#15803d', chipBg: '#dcfce7', chipTxt: '#166534', extra: '#166534' },
  { id: 'sunset', pageBg: '#fff7ed', band: '#c2410c', jobTint: '#fed7aa', contactTint: '#fed7aa', border: '#fdba74', itemTitle: '#9a3412', company: '#ea580c', chipBg: '#ffedd5', chipTxt: '#c2410c', extra: '#ea580c' },
  { id: 'lavender', pageBg: '#f5f3ff', band: '#6d28d9', jobTint: '#ddd6fe', contactTint: '#ede9fe', border: '#c4b5fd', itemTitle: '#5b21b6', company: '#7c3aed', chipBg: '#ede9fe', chipTxt: '#6d28d9', extra: '#7c3aed' },
  { id: 'slate', pageBg: '#f8fafc', band: '#475569', jobTint: '#cbd5e1', contactTint: '#e2e8f0', border: '#94a3b8', itemTitle: '#1e293b', company: '#64748b', chipBg: '#f1f5f9', chipTxt: '#475569', extra: '#475569' },
  { id: 'charcoal', pageBg: '#fafafa', band: '#1e293b', jobTint: '#cbd5e1', contactTint: '#e2e8f0', border: '#475569', itemTitle: '#0f172a', company: '#334155', chipBg: '#f1f5f9', chipTxt: '#1e293b', extra: '#1e293b' },
  { id: 'midnight', pageBg: '#eef2ff', band: '#312e81', jobTint: '#c7d2fe', contactTint: '#ddd6fe', border: '#a5b4fc', itemTitle: '#1e1b4b', company: '#4338ca', chipBg: '#e0e7ff', chipTxt: '#312e81', extra: '#1e1b4b' },
  { id: 'ruby', pageBg: '#fef2f2', band: '#991b1b', jobTint: '#fecaca', contactTint: '#fce7f3', border: '#fca5a5', itemTitle: '#7f1d1d', company: '#dc2626', chipBg: '#fce7f3', chipTxt: '#991b1b', extra: '#991b1b' },
  { id: 'emerald', pageBg: '#ecfdf5', band: '#047857', jobTint: '#a7f3d0', contactTint: '#d1fae5', border: '#6ee7b7', itemTitle: '#064e3b', company: '#059669', chipBg: '#d1fae5', chipTxt: '#047857', extra: '#047857' },
  { id: 'cobalt', pageBg: '#eff6ff', band: '#1e3a8a', jobTint: '#bfdbfe', contactTint: '#dbeafe', border: '#93c5fd', itemTitle: '#172554', company: '#2563eb', chipBg: '#dbeafe', chipTxt: '#1e3a8a', extra: '#1e3a8a' },
  { id: 'gold', pageBg: '#fffbeb', band: '#b45309', jobTint: '#fde68a', contactTint: '#fef3c7', border: '#fcd34d', itemTitle: '#92400e', company: '#d97706', chipBg: '#fef3c7', chipTxt: '#b45309', extra: '#b45309' },
  { id: 'pink', pageBg: '#fdf2f8', band: '#be185d', jobTint: '#fbcfe8', contactTint: '#fce7f3', border: '#f9a8d4', itemTitle: '#9d174d', company: '#db2777', chipBg: '#fce7f3', chipTxt: '#be185d', extra: '#be185d' },
  { id: 'teal', pageBg: '#f0fdfa', band: '#0f766e', jobTint: '#99f6e4', contactTint: '#ccfbf1', border: '#5eead4', itemTitle: '#134e4a', company: '#0d9488', chipBg: '#ccfbf1', chipTxt: '#0f766e', extra: '#0f766e' },
  { id: 'indigo', pageBg: '#eef2ff', band: '#3730a3', jobTint: '#c7d2fe', contactTint: '#ddd6fe', border: '#a5b4fc', itemTitle: '#1e1b4b', company: '#4f46e5', chipBg: '#e0e7ff', chipTxt: '#3730a3', extra: '#3730a3' },
];

function makeBandedColorThemeSpec(p: BandedThemePalette): StdSpec {
  return {
    pageBg: p.pageBg,
    head: {
      band: p.band,
      bandRadius: 8,
      bandPad: 20,
      mgB: 16,
      name: { fs: 24, w: 800, c: '#ffffff', up: true, ls: 0.5 },
      job: { fs: 13, w: 700, c: p.jobTint, up: true, ls: 1, mt: 4, mb: 12 },
      contact: { keys: ['email', 'phone', 'location'], fs: 11, c: p.contactTint, gap: 12 },
    },
    secs: [
      { t: 'sum', label: 'ABOUT' },
      { t: 'exp', label: 'EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
      { t: 'skill', label: 'SKILLS' },
    ],
    secTitle: { fs: 13, w: 800, c: p.band, up: true, ls: 1.5, borderB: [2, p.border], pb: 4, mb: 8 },
    item: { cont: `padding-left:10px;border-left:2px solid ${p.border};`, titleC: p.itemTitle, titleFs: 13, companyC: p.company, companyFs: 12 },
    coC: p.company,
    chip: { bg: p.chipBg, bdC: p.border, bdW: 1, radius: 12, txtC: p.chipTxt, padH: 10, padV: 4 },
    extra: { color: p.extra },
  };
}

function makeBandedColorThemeSpecs(): Record<string, StdSpec> {
  const out: Record<string, StdSpec> = {};
  for (const p of BANDED_THEME_PALETTES) out[p.id] = makeBandedColorThemeSpec(p);
  return out;
}

export const STD_SPECS: Record<string, StdSpec> = {
  // ─── Modern ─────────────────────────────────────────────────────────────
  modern: {
    pageBg: '#ffffff',
    head: {
      borderB: [3, INDIGO],
      padB: 18,
      mgB: 18,
      name: { fs: 26, w: 800, c: '#0f172a', up: true, ls: 0.5 },
      job: { fs: 14, w: 700, c: INDIGO, up: true, ls: 1.5, mt: 6, mb: 14 },
      contact: {
        keys: ['email', 'phone', 'location', 'linkedin', 'website'],
        icons: { email: '📧', phone: '📱', location: '📍', linkedin: '💼', website: '🌐' },
        fs: 11, c: '#64748b', gap: 10,
      },
    },
    secs: [
      { t: 'sum', label: 'Profile' },
      { t: 'exp', label: 'Experience' },
      { t: 'edu', label: 'Education' },
      { t: 'skill', label: 'Skills' },
    ],
    secTitle: {},
    secTitleDyn: INDIGO,
    item: { cont: 'padding-left:12px;border-left:3px solid #e0e7ff;', titleC: '#1e293b', titleFs: 14, companyC: '#4f46e5', companyFs: 12 },
    coC: '#4f46e5',
    chip: { bg: '#e0e7ff', txtC: '#4338ca', radius: 12, padH: 12, padV: 5 },
    extra: { color: INDIGO },
  },

  // ─── Minimal ────────────────────────────────────────────────────────────
  minimal: {
    pageBg: '#ffffff',
    head: {
      borderB: [1, '#e2e8f0'],
      padB: 18,
      mgB: 18,
      name: { fs: 30, w: 800, c: '#000000' },
      job: { fs: 13, w: 700, c: '#000000', up: true, ls: 2.5, mt: 6, mb: 14 },
      contact: { keys: ['email', 'phone', 'location'], fs: 11, c: '#64748b', gap: 14 },
    },
    secs: [
      { t: 'sum', label: 'PROFILE' },
      { t: 'exp', label: 'EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
      { t: 'skill', label: 'SKILLS' },
    ],
    secTitle: { fs: 13, w: 700, c: '#000000', ls: 3, borderB: [1, '#e2e8f0'], pb: 5, mb: 10 },
    item: { cont: 'padding-left:12px;border-left:2px solid #e2e8f0;', titleC: '#0f172a', titleFs: 14, companyC: '#374151', companyFs: 12 },
    coC: '#374151',
    chip: { bdC: '#000000', bdW: 1.5, radius: 4, txtC: '#000000', padH: 12, padV: 5 },
    extra: { color: '#000000' },
  },

  // ─── ATS Optimized ──────────────────────────────────────────────────────
  ats: {
    pageBg: '#ffffff',
    head: {
      alignC: true,
      borderB: [3, '#000000'],
      padB: 16,
      mgB: 18,
      name: { fs: 24, w: 800, c: '#000000', up: true, ls: 1.5 },
      job: { fs: 13, w: 700, c: '#000000', up: true, ls: 2, mt: 6, mb: 10 },
      contact: { keys: ['location', 'phone', 'email', 'linkedin', 'website'], sep: ' | ', fs: 11, c: '#000000', alignC: true },
    },
    secs: [
      { t: 'sum', label: 'SUMMARY' },
      { t: 'skill', label: 'SKILLS' },
      { t: 'exp', label: 'EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
    ],
    secTitle: { fs: 15, w: 700, c: '#000000', up: true, borderB: [2, '#000000'], pb: 5, mb: 10 },
    item: { titleC: '#111827', titleFs: 14, companyC: '#374151', companyFs: 12 },
    coLoc: true,
    skillsSep: ', ',
    extra: { color: '#000000' },
  },

  // ─── Professional ───────────────────────────────────────────────────────
  professional: {
    pageBg: '#ffffff',
    head: {
      borderB: [4, '#1e3a5f'],
      padB: 18,
      mgB: 18,
      name: { fs: 26, w: 800, c: '#1e3a5f', up: true, ls: 1 },
      job: { fs: 14, w: 700, c: '#2563eb', up: true, ls: 2, mt: 6, mb: 14 },
      contact: { keys: ['email', 'phone', 'location'], fs: 11, c: '#475569', gap: 12 },
    },
    secs: [
      { t: 'sum', label: 'Professional Summary' },
      { t: 'exp', label: 'Experience' },
      { t: 'edu', label: 'Education' },
      { t: 'skill', label: 'Skills' },
    ],
    secTitle: {},
    secTitleDyn: '#1e3a5f',
    item: { cont: 'padding-left:14px;border-left:4px solid #bfdbfe;', titleC: '#1e3a5f', titleFs: 14, companyC: '#1e3a5f', companyFs: 12 },
    coC: '#1e3a5f',
    chip: { bg: '#eff6ff', bdC: '#bfdbfe', bdW: 1.5, radius: 8, txtC: '#1e40af', padH: 12, padV: 5 },
    extra: { color: '#1e3a5f' },
  },

  // ─── Executive ──────────────────────────────────────────────────────────
  executive: {
    pageBg: '#ffffff',
    head: {
      borderB: [2, '#d1d5db'],
      padB: 18,
      mgB: 18,
      deco: 'accent',
      decoColor: '#111827',
      name: { fs: 26, w: 900, c: '#111827', ls: -0.5 },
      job: { fs: 14, w: 600, c: '#4b5563', up: true, ls: 2.5, mt: 6, mb: 14 },
      contact: { keys: ['email', 'phone', 'location', 'linkedin'], fs: 11, c: '#6b7280', gap: 14, ml: 16 },
    },
    secs: [
      { t: 'sum', label: 'EXECUTIVE SUMMARY' },
      { t: 'exp', label: 'PROFESSIONAL EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
      { t: 'skill', label: 'CORE COMPETENCIES' },
    ],
    secTitle: { fs: 13, w: 800, c: '#111827', ls: 2.5, borderB: [3, '#111827'], pb: 5, mb: 12 },
    item: {
      cont: 'padding-left:14px;border-left:3px solid #111827;',
      titleC: '#111827', titleFs: 14, titleW: 700,
      dateC: '#9ca3af', dateFs: 10,
      companyC: '#4b5563', companyFs: 12,
    },
    coC: '#4b5563',
    chip: { bg: '#f9fafb', bdC: '#d1d5db', bdW: 1, radius: 4, txtC: '#374151', padH: 12, padV: 5 },
    extra: { color: '#111827' },
    extraCss: '.hd .jt{margin-left:16px}',
  },

  // ─── Classic ────────────────────────────────────────────────────────────
  classic: {
    pageBg: '#ffffff',
    head: {
      alignC: true,
      borderB: [2, '#d1d5db'],
      padB: 18,
      mgB: 18,
      name: { fs: 28, w: 900, c: '#111827', ls: 2.5 },
      centerDiv: { h: 3, c: '#374151', mt: 10, mb: 10 },
      job: { fs: 13, w: 600, c: '#6b7280', up: true, ls: 3, mb: 12 },
      contact: { keys: ['email', 'phone', 'location'], sep: ' • ', fs: 11, c: '#6b7280', alignC: true, gap: 8 },
    },
    secs: [
      { t: 'sum', label: 'PROFILE' },
      { t: 'exp', label: 'EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
      { t: 'skill', label: 'SKILLS' },
    ],
    secTitle: { fs: 14, w: 800, c: '#374151', ls: 2, borderB: [2, '#e5e7eb'], pb: 5, mb: 10 },
    skillsSep: ' • ',
    item: { titleC: '#1f2937', titleFs: 14, companyC: '#4b5563', companyFs: 12 },
    coC: '#4b5563',
    extra: { color: '#374151' },
  },

  // ─── Elegant ────────────────────────────────────────────────────────────
  elegant: {
    pageBg: '#ffffff',
    head: {
      borderB: [3, '#d97706'],
      padB: 18,
      mgB: 18,
      name: { fs: 26, w: 800, c: '#451a03', ls: 0.5 },
      job: { fs: 14, w: 700, c: '#92400e', up: true, ls: 2, mt: 6, mb: 14 },
      contact: { keys: ['email', 'phone', 'location'], fs: 11, c: '#78716c', gap: 12 },
    },
    secs: [
      { t: 'sum', label: 'PROFILE' },
      { t: 'exp', label: 'EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
      { t: 'skill', label: 'SKILLS' },
    ],
    secTitle: { fs: 13, w: 800, c: '#92400e', ls: 2, borderB: [3, '#fde68a'], pb: 5, mb: 10 },
    item: {
      cont: 'padding-left:14px;border-left:3px solid #fbbf24;',
      titleC: '#451a03', titleFs: 14,
      companyC: '#92400e', companyFs: 12,
    },
    coC: '#92400e',
    chip: { bg: '#fffbeb', bdC: '#fde68a', bdW: 1.5, radius: 14, txtC: '#92400e', padH: 12, padV: 5 },
    extra: { color: '#92400e' },
  },

  // ─── Monochrome ─────────────────────────────────────────────────────────
  monochrome: {
    pageBg: '#ffffff',
    head: {
      borderB: [3, '#374151'],
      padB: 18,
      mgB: 18,
      name: { fs: 26, w: 800, c: '#1f2937', up: true, ls: 1 },
      job: { fs: 14, w: 600, c: '#6b7280', up: true, ls: 2, mt: 6, mb: 14 },
      contact: { keys: ['email', 'phone', 'location'], fs: 11, c: '#9ca3af', gap: 12 },
    },
    secs: [
      { t: 'sum', label: 'PROFILE' },
      { t: 'exp', label: 'EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
      { t: 'skill', label: 'SKILLS' },
    ],
    secTitle: { fs: 13, w: 800, c: '#374151', ls: 2, borderB: [2, '#d1d5db'], pb: 5, mb: 10 },
    chip: { bg: '#f9fafb', bdC: '#e5e7eb', bdW: 1, radius: 4, txtC: '#374151', padH: 12, padV: 5 },
    item: { titleC: '#1f2937', titleFs: 14, companyC: '#4b5563', companyFs: 12 },
    coC: '#4b5563',
    extra: { color: '#374151' },
  },

  // ─── Legal ──────────────────────────────────────────────────────────────
  legal: {
    pageBg: '#ffffff',
    head: {
      borderB: [4, '#1f2937'],
      padB: 18,
      mgB: 18,
      name: { fs: 24, w: 800, c: '#1f2937', up: true, ls: 2 },
      nameSuffix: ', Esq.',
      job: { fs: 13, w: 600, c: '#6b7280', up: true, ls: 2.5, mt: 6, mb: 14 },
      contact: { keys: ['email', 'phone', 'location'], fs: 11, c: '#6b7280', gap: 12 },
    },
    secs: [
      { t: 'sum', label: 'PROFESSIONAL SUMMARY' },
      { t: 'exp', label: 'EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
      { t: 'skill', label: 'AREAS OF PRACTICE' },
    ],
    secTitle: { fs: 13, w: 800, c: '#1f2937', ls: 2, borderB: [3, '#1f2937'], pb: 5, mb: 10 },
    item: { companyC: '#374151', companyFs: 12, titleC: '#1f2937', titleFs: 14 },
    coC: '#374151',
    skillsSep: ' • ',
    extra: { color: '#374151' },
  },

  // ─── Academic ───────────────────────────────────────────────────────────
  academic: {
    pageBg: '#ffffff',
    head: {
      borderB: [3, '#374151'],
      padB: 18,
      mgB: 18,
      name: { fs: 26, w: 800, c: '#111827', ls: 0.5 },
      job: { fs: 14, w: 600, c: '#4b5563', mt: 6, mb: 14 },
      contact: { keys: ['email', 'phone', 'location', 'linkedin'], fs: 11, c: '#6b7280', gap: 12 },
    },
    secs: [
      { t: 'sum', label: 'Research Interests' },
      { t: 'edu', label: 'Education', degreeFirst: true },
      { t: 'exp', label: 'Experience' },
      { t: 'skill', label: 'Skills & Tools' },
    ],
    secTitle: { fs: 14, w: 800, c: '#374151', up: true, ls: 2, borderB: [2, '#d1d5db'], pb: 5, mb: 10 },
    chip: { bg: '#f3f4f6', bdC: '#d1d5db', bdW: 1.5, radius: 6, txtC: '#374151', padH: 12, padV: 5 },
    item: { titleC: '#111827', titleFs: 14, companyC: '#4b5563', companyFs: 12 },
    coC: '#4b5563',
    extra: { color: '#374151' },
  },

  // ─── Medical ────────────────────────────────────────────────────────────
  medical: {
    pageBg: '#ffffff',
    head: {
      band: '#059669',
      bandPad: 22,
      bandRadius: 10,
      avatar: { char: 'symbol', symbol: '✚', inline: true, size: 44, bg: '#059669', color: '#ffffff', fs: 30, nameColor: '#ffffff' },
      name: { fs: 24, w: 800, c: '#ffffff' },
      job: { fs: 13, w: 700, c: '#d1fae5', up: true, ls: 1.5, mt: 4, mb: 14 },
      contact: {
        keys: ['email', 'phone', 'location'],
        icons: { email: '✉', phone: '☎', location: '◉' },
        fs: 10, c: '#d1fae5', gap: 14,
      },
    },
    secs: [
      { t: 'sum', label: 'Clinical Summary' },
      { t: 'exp', label: 'Professional Experience' },
      { t: 'eduCert', label: 'Education & Certifications' },
      { t: 'skill', label: 'Competencies' },
    ],
    secTitle: { fs: 14, w: 700, c: '#059669', up: true, borderB: [3, '#a7f3d0'], pb: 5, mb: 10 },
    item: { companyC: '#059669', companyFs: 12, titleC: '#064e3b', titleFs: 14 },
    coC: '#059669',
    chip: { bg: '#ecfdf5', bdC: '#a7f3d0', bdW: 1.5, radius: 8, txtC: '#047857', padH: 12, padV: 5 },
    extra: { color: '#059669' },
  },

  // ─── Nature ─────────────────────────────────────────────────────────────
  nature: {
    pageBg: '#f7fee7',
    head: {
      borderB: [4, '#65a30d'],
      padB: 18,
      mgB: 18,
      name: { fs: 26, w: 800, c: '#166534' },
      job: { fs: 14, w: 700, c: '#65a30d', up: true, ls: 1.5, mt: 6, mb: 14 },
      contact: { keys: ['email', 'phone', 'location'], icons: { email: '📧', phone: '📱', location: '📍' }, fs: 11, c: '#4d7c0f', gap: 12 },
    },
    secs: [
      { t: 'sum', label: '🌿 About Me' },
      { t: 'exp', label: '🌱 Experience' },
      { t: 'edu', label: '📚 Education' },
      { t: 'skill', label: '🍃 Skills' },
    ],
    secTitle: { fs: 15, w: 800, c: '#166534', up: true, ls: 1.5, borderB: [3, '#86efac'], pb: 5, mb: 10 },
    item: { cont: 'padding-left:14px;border-left:3px solid #86efac;', titleC: '#166534', titleFs: 14, companyC: '#15803d', companyFs: 12 },
    coC: '#15803d',
    chip: { bg: '#ecfccb', bdC: '#bef264', bdW: 1.5, radius: 14, txtC: '#3f6212', padH: 12, padV: 5 },
    extra: { color: '#16a34a' },
  },

  // ─── Startup ────────────────────────────────────────────────────────────
  startup: {
    pageBg: '#ffffff',
    head: {
      borderB: [4, '#ec4899'],
      padB: 18,
      mgB: 18,
      name: { fs: 26, w: 900, c: '#111827', ls: -0.5 },
      job: { fs: 14, w: 700, c: '#ec4899', up: true, ls: 1.5, mt: 6, mb: 14 },
      contact: { keys: ['email', 'phone', 'location'], fs: 11, c: '#6b7280', gap: 12 },
    },
    secs: [
      { t: 'sum', label: 'WHY ME' },
      { t: 'exp', label: 'EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
      { t: 'skill', label: 'TECH STACK' },
    ],
    secTitle: { fs: 14, w: 800, c: '#ec4899', ls: 1.5, borderB: [2, '#fbcfe8'], pb: 5, mb: 10 },
    item: { cont: 'padding-left:14px;border-left:3px solid #f97316;', titleC: '#111827', titleFs: 14, companyC: '#f97316', companyFs: 12 },
    coC: '#f97316',
    chip: { bg: '#fdf2f8', bdC: '#fbcfe8', bdW: 1.5, radius: 14, txtC: '#be185d', padH: 12, padV: 5 },
    extra: { color: '#ec4899' },
  },

  // ─── Timeline ───────────────────────────────────────────────────────────
  timeline: {
    pageBg: '#ffffff',
    head: {
      borderB: [3, '#2563eb'],
      padB: 18,
      mgB: 18,
      name: { fs: 26, w: 800, c: '#1e3a5f' },
      job: { fs: 14, w: 700, c: '#2563eb', up: true, ls: 1.5, mt: 6, mb: 14 },
      contact: { keys: ['email', 'phone', 'location'], fs: 11, c: '#64748b', gap: 12 },
    },
    secs: [
      { t: 'sum', label: 'PROFILE' },
      { t: 'exp', label: 'EXPERIENCE', timeline: true },
      { t: 'edu', label: 'EDUCATION', timeline: true },
      { t: 'skill', label: 'SKILLS' },
    ],
    secTitle: { fs: 14, w: 800, c: '#2563eb', ls: 2, borderB: [2, '#bfdbfe'], pb: 5, mb: 14 },
    item: { titleC: '#1e3a5f', titleFs: 14, companyC: '#64748b', companyFs: 12 },
    coC: '#64748b',
    chip: { bg: '#eff6ff', bdC: '#bfdbfe', bdW: 1.5, radius: 10, txtC: '#1d4ed8', padH: 12, padV: 5 },
    extra: { color: '#2563eb' },
  },

  // ─── Compact ────────────────────────────────────────────────────────────
  compact: {
    pageBg: '#ffffff',
    head: {
      borderB: [3, '#ea580c'],
      padB: 14,
      mgB: 14,
      name: { fs: 22, w: 800, c: '#1c1917' },
      job: { badge: true, fs: 10, w: 700, badgeBg: '#ea580c', badgeC: '#ffffff' },
      contact: { keys: ['email', 'phone', 'location'], sep: ' | ', fs: 10, c: '#6b7280', gap: 6 },
    },
    secs: [
      { t: 'sum', label: 'SUMMARY' },
      { t: 'exp', label: 'EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
      { t: 'skill', label: 'SKILLS' },
    ],
    secTitle: { fs: 11, w: 800, c: '#ea580c', ls: 2, mb: 8 },
    item: { titleC: '#1e293b', titleFs: 13, dateC: '#94a3b8', dateFs: 10, companyC: '#f97316', companyFs: 11 },
    coC: '#f97316',
    skillsSep: ' • ',
    chip: { bg: '#fff7ed', bdC: '#fed7aa', bdW: 1, radius: 6, txtC: '#c2410c', padH: 10, padV: 4 },
    extra: { color: '#ea580c' },
  },

  // ─── Bold ───────────────────────────────────────────────────────────────
  bold: {
    pageBg: '#ffffff',
    head: {
      band: '#7f1d1d',
      bandPad: 22,
      bandRadius: 12,
      mgB: 18,
      name: { fs: 28, w: 900, c: '#ffffff', up: true, ls: 1 },
      job: { fs: 14, w: 700, c: '#fca5a5', up: true, ls: 2, mt: 6, mb: 14 },
      contact: { keys: ['email', 'phone', 'location'], fs: 11, c: '#fecaca', gap: 12 },
    },
    secs: [
      { t: 'sum', label: 'PROFILE' },
      { t: 'exp', label: 'EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
      { t: 'skill', label: 'SKILLS' },
    ],
    secTitle: { fs: 15, w: 800, c: '#7f1d1d', ls: 2.5, borderB: [4, '#7f1d1d'], pb: 6, mb: 10 },
    item: { cont: 'padding-left:14px;border-left:4px solid #fecaca;', titleC: '#7f1d1d', titleFs: 15, titleW: 800, companyC: '#dc2626', companyFs: 12 },
    coC: '#dc2626',
    chip: { bg: '#fef2f2', bdC: '#fecaca', bdW: 2, radius: 8, txtC: '#991b1b', padH: 12, padV: 5 },
    extra: { color: '#b91c1c' },
  },

  // ─── Playful ────────────────────────────────────────────────────────────
  playful: {
    pageBg: '#fff7ed',
    head: {
      alignC: true,
      borderB: [4, '#fb923c', 'dashed'],
      padB: 18,
      mgB: 18,
      avatar: { char: 'first', size: 64, bg: '#f97316', color: '#ffffff', fs: 26 },
      name: { fs: 24, w: 900, c: '#1c1917' },
      job: { fs: 15, w: 700, c: '#f97316', up: true, ls: 1.5, mt: 6, mb: 14 },
      contact: { keys: ['email', 'phone'], icons: { email: '📧', phone: '📱' }, fs: 11, c: '#78716c', gap: 12, alignC: true },
    },
    secs: [
      { t: 'sum', label: '✨ About Me' },
      { t: 'exp', label: '💼 Experience' },
      { t: 'edu', label: '🎓 Education' },
      { t: 'skill', label: '🚀 Skills' },
    ],
    secTitle: { fs: 17, w: 800, c: '#ea580c', mb: 12 },
    item: { cont: 'background:rgba(255,255,255,0.7);border-radius:12px;padding:12px;border:1px solid #fed7aa;', titleC: '#1c1917', titleFs: 14, companyC: '#f97316', companyFs: 12 },
    coC: '#f97316',
    chip: { bg: '#fed7aa', radius: 20, txtC: '#c2410c', padH: 12, padV: 6 },
    extra: { color: '#ea580c' },
  },

  // ─── Borderless ─────────────────────────────────────────────────────────
  borderless: {
    pageBg: '#ffffff',
    head: {
      padB: 18,
      mgB: 18,
      name: { fs: 28, w: 800, c: '#1f293b' },
      job: { fs: 14, w: 600, c: '#64748b', mt: 6, mb: 14 },
      contact: { keys: ['email', 'phone', 'location'], fs: 11, c: '#94a3b8', gap: 14 },
    },
    secs: [
      { t: 'sum', label: 'Profile' },
      { t: 'exp', label: 'Experience' },
      { t: 'edu', label: 'Education' },
      { t: 'skill', label: 'Skills' },
    ],
    secTitle: { fs: 15, w: 700, c: '#64748b', up: true, ls: 1.5, mb: 10 },
    item: { titleC: '#1f293b', titleFs: 14, companyC: '#4b5563', companyFs: 12 },
    coC: '#4b5563',
    chip: { bg: '#f8fafc', radius: 10, txtC: '#475569', padH: 12, padV: 5 },
    extra: { color: '#6b7280' },
  },

  // ─── Technical ──────────────────────────────────────────────────────────
  technical: {
    pageBg: '#f8fafc',
    mono: true,
    bodyC: '#475569',
    head: {
      borderB: [3, '#0891b2'],
      padB: 18,
      mgB: 18,
      deco: 'dot',
      decoColor: '#0891b2',
      name: { fs: 26, w: 800, c: '#0f172a', ls: -0.5 },
      job: { fs: 14, w: 700, c: '#0891b2', up: true, ls: 1.5, mt: 6, mb: 14 },
      contact: { keys: ['email', 'phone', 'website'], icons: { email: '📧', phone: '📱', website: '🌐' }, fs: 11, c: '#64748b', gap: 12, ml: 20 },
    },
    secs: [
      { t: 'sum', label: '// SUMMARY' },
      { t: 'exp', label: '// EXPERIENCE' },
      { t: 'skill', label: '// SKILLS' },
      { t: 'edu', label: '// EDUCATION' },
    ],
    secTitle: { fs: 13, w: 800, c: '#0891b2', ls: 1.5, borderB: [2, '#a5f3fc'], pb: 4, mb: 10 },
    item: { cont: 'padding-left:14px;border-left:3px solid #e0f2fe;', titleC: '#0f172a', titleFs: 14, companyC: '#0891b2', companyFs: 12 },
    coC: '#0891b2',
    chip: { bg: '#ecfeff', bdC: '#a5f3fc', bdW: 1.5, radius: 8, txtC: '#0e7490', padH: 12, padV: 5 },
    extra: { color: '#0891b2' },
    extraCss: '.hd .jt{margin-left:20px}',
  },

  // ─── Ocean (blue professional) ───────────────────────────────────────────
  ocean: {
    pageBg: '#f0f9ff',
    head: {
      borderB: [4, '#0284c7'],
      padB: 18,
      mgB: 18,
      name: { fs: 26, w: 800, c: '#0369a1', up: true, ls: 1 },
      job: { fs: 14, w: 700, c: '#0284c7', up: true, ls: 2, mt: 6, mb: 14 },
      contact: { keys: ['email', 'phone', 'location', 'linkedin'], fs: 11, c: '#0c4a6e', gap: 12 },
    },
    secs: [
      { t: 'sum', label: 'PROFILE' },
      { t: 'exp', label: 'EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
      { t: 'skill', label: 'SKILLS' },
    ],
    secTitle: { fs: 14, w: 800, c: '#0284c7', ls: 2, borderB: [3, '#bae6fd'], pb: 5, mb: 10 },
    item: { cont: 'padding-left:14px;border-left:3px solid #7dd3fc;', titleC: '#0369a1', titleFs: 14, companyC: '#0284c7', companyFs: 12 },
    coC: '#0284c7',
    chip: { bg: '#e0f2fe', bdC: '#7dd3fc', bdW: 1.5, radius: 8, txtC: '#0369a1', padH: 12, padV: 5 },
    extra: { color: '#0284c7' },
  },

  // ─── Forest (green professional) ────────────────────────────────────────
  forest: {
    pageBg: '#f0fdf4',
    head: {
      borderB: [4, '#16a34a'],
      padB: 18,
      mgB: 18,
      name: { fs: 26, w: 800, c: '#14532d', up: true, ls: 1 },
      job: { fs: 14, w: 700, c: '#16a34a', up: true, ls: 2, mt: 6, mb: 14 },
      contact: { keys: ['email', 'phone', 'location'], icons: { email: '📧', phone: '📱', location: '📍' }, fs: 11, c: '#166534', gap: 12 },
    },
    secs: [
      { t: 'sum', label: 'PROFILE' },
      { t: 'exp', label: 'EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
      { t: 'skill', label: 'SKILLS' },
    ],
    secTitle: { fs: 14, w: 800, c: '#16a34a', ls: 2, borderB: [3, '#bbf7d0'], pb: 5, mb: 10 },
    item: { cont: 'padding-left:14px;border-left:3px solid #86efac;', titleC: '#14532d', titleFs: 14, companyC: '#16a34a', companyFs: 12 },
    coC: '#16a34a',
    chip: { bg: '#dcfce7', bdC: '#86efac', bdW: 1.5, radius: 8, txtC: '#14532d', padH: 12, padV: 5 },
    extra: { color: '#16a34a' },
  },

  // ─── Sunset (warm professional) ─────────────────────────────────────────
  sunset: {
    pageBg: '#fff7ed',
    head: {
      borderB: [4, '#ea580c'],
      padB: 18,
      mgB: 18,
      name: { fs: 26, w: 800, c: '#9a3412', up: true, ls: 1 },
      job: { fs: 14, w: 700, c: '#ea580c', up: true, ls: 2, mt: 6, mb: 14 },
      contact: { keys: ['email', 'phone', 'location'], fs: 11, c: '#9a3412', gap: 12 },
    },
    secs: [
      { t: 'sum', label: 'PROFILE' },
      { t: 'exp', label: 'EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
      { t: 'skill', label: 'SKILLS' },
    ],
    secTitle: { fs: 14, w: 800, c: '#ea580c', ls: 2, borderB: [3, '#fed7aa'], pb: 5, mb: 10 },
    item: { cont: 'padding-left:14px;border-left:3px solid #fdba74;', titleC: '#9a3412', titleFs: 14, companyC: '#ea580c', companyFs: 12 },
    coC: '#ea580c',
    chip: { bg: '#ffedd5', bdC: '#fdba74', bdW: 1.5, radius: 8, txtC: '#9a3412', padH: 12, padV: 5 },
    extra: { color: '#ea580c' },
  },

  // ─── Lavender (soft professional) ───────────────────────────────────────
  lavender: {
    pageBg: '#faf5ff',
    head: {
      borderB: [4, '#a855f7'],
      padB: 18,
      mgB: 18,
      name: { fs: 26, w: 800, c: '#6b21a8', up: true, ls: 1 },
      job: { fs: 14, w: 700, c: '#a855f7', up: true, ls: 2, mt: 6, mb: 14 },
      contact: { keys: ['email', 'phone', 'location'], fs: 11, c: '#7e22ce', gap: 12 },
    },
    secs: [
      { t: 'sum', label: 'PROFILE' },
      { t: 'exp', label: 'EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
      { t: 'skill', label: 'SKILLS' },
    ],
    secTitle: { fs: 14, w: 800, c: '#a855f7', ls: 2, borderB: [3, '#e9d5ff'], pb: 5, mb: 10 },
    item: { cont: 'padding-left:14px;border-left:3px solid #d8b4fe;', titleC: '#6b21a8', titleFs: 14, companyC: '#a855f7', companyFs: 12 },
    coC: '#a855f7',
    chip: { bg: '#f3e8ff', bdC: '#d8b4fe', bdW: 1.5, radius: 8, txtC: '#6b21a8', padH: 12, padV: 5 },
    extra: { color: '#a855f7' },
  },

  // ─── Slate (dark professional) ──────────────────────────────────────────
  slate: {
    pageBg: '#1e293b',
    head: {
      band: '#334155',
      bandPad: 22,
      bandRadius: 12,
      mgB: 18,
      name: { fs: 28, w: 900, c: '#f8fafc', up: true, ls: 1 },
      job: { fs: 14, w: 700, c: '#cbd5e1', up: true, ls: 2, mt: 6, mb: 14 },
      contact: { keys: ['email', 'phone', 'location', 'linkedin'], fs: 11, c: '#94a3b8', gap: 12 },
    },
    secs: [
      { t: 'sum', label: 'PROFILE' },
      { t: 'exp', label: 'EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
      { t: 'skill', label: 'SKILLS' },
    ],
    secTitle: { fs: 14, w: 800, c: '#e2e8f0', ls: 2, borderB: [3, '#475569'], pb: 5, mb: 10 },
    item: { cont: 'padding-left:14px;border-left:3px solid #475569;', titleC: '#f1f5f9', titleFs: 14, companyC: '#94a3b8', companyFs: 12 },
    coC: '#94a3b8',
    chip: { bg: '#334155', bdC: '#475569', bdW: 1.5, radius: 8, txtC: '#e2e8f0', padH: 12, padV: 5 },
    extra: { color: '#cbd5e1' },
  },

  // ─── Charcoal (dark elegant) ────────────────────────────────────────────
  charcoal: {
    pageBg: '#18181b',
    head: {
      band: '#27272a',
      bandPad: 22,
      bandRadius: 12,
      mgB: 18,
      name: { fs: 28, w: 900, c: '#fafafa', up: true, ls: 1 },
      job: { fs: 14, w: 700, c: '#a1a1aa', up: true, ls: 2, mt: 6, mb: 14 },
      contact: { keys: ['email', 'phone', 'location'], fs: 11, c: '#71717a', gap: 12 },
    },
    secs: [
      { t: 'sum', label: 'PROFILE' },
      { t: 'exp', label: 'EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
      { t: 'skill', label: 'SKILLS' },
    ],
    secTitle: { fs: 14, w: 800, c: '#e4e4e7', ls: 2, borderB: [3, '#3f3f46'], pb: 5, mb: 10 },
    item: { cont: 'padding-left:14px;border-left:3px solid #3f3f46;', titleC: '#fafafa', titleFs: 14, companyC: '#a1a1aa', companyFs: 12 },
    coC: '#a1a1aa',
    chip: { bg: '#27272a', bdC: '#3f3f46', bdW: 1.5, radius: 8, txtC: '#e4e4e7', padH: 12, padV: 5 },
    extra: { color: '#d4d4d8' },
  },

  // ─── Midnight (very dark) ──────────────────────────────────────────────
  midnight: {
    pageBg: '#0f172a',
    head: {
      band: '#1e293b',
      bandPad: 22,
      bandRadius: 12,
      mgB: 18,
      name: { fs: 28, w: 900, c: '#f8fafc', up: true, ls: 1 },
      job: { fs: 14, w: 700, c: '#38bdf8', up: true, ls: 2, mt: 6, mb: 14 },
      contact: { keys: ['email', 'phone', 'location', 'linkedin'], fs: 11, c: '#94a3b8', gap: 12 },
    },
    secs: [
      { t: 'sum', label: 'PROFILE' },
      { t: 'exp', label: 'EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
      { t: 'skill', label: 'SKILLS' },
    ],
    secTitle: { fs: 14, w: 800, c: '#38bdf8', ls: 2, borderB: [3, '#0c4a6e'], pb: 5, mb: 10 },
    item: { cont: 'padding-left:14px;border-left:3px solid #0284c7;', titleC: '#f1f5f9', titleFs: 14, companyC: '#38bdf8', companyFs: 12 },
    coC: '#38bdf8',
    chip: { bg: '#1e293b', bdC: '#0284c7', bdW: 1.5, radius: 8, txtC: '#7dd3fc', padH: 12, padV: 5 },
    extra: { color: '#7dd3fc' },
  },

  // ─── Ruby (elegant dark) ────────────────────────────────────────────────
  ruby: {
    pageBg: '#450a0a',
    head: {
      band: '#7f1d1d',
      bandPad: 22,
      bandRadius: 12,
      mgB: 18,
      name: { fs: 28, w: 900, c: '#fce7f3', up: true, ls: 1 },
      job: { fs: 14, w: 700, c: '#f43f5e', up: true, ls: 2, mt: 6, mb: 14 },
      contact: { keys: ['email', 'phone', 'location'], fs: 11, c: '#fda4af', gap: 12 },
    },
    secs: [
      { t: 'sum', label: 'PROFILE' },
      { t: 'exp', label: 'EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
      { t: 'skill', label: 'SKILLS' },
    ],
    secTitle: { fs: 14, w: 800, c: '#f43f5e', ls: 2, borderB: [3, '#be123c'], pb: 5, mb: 10 },
    item: { cont: 'padding-left:14px;border-left:3px solid #e11d48;', titleC: '#fce7f3', titleFs: 14, companyC: '#f43f5e', companyFs: 12 },
    coC: '#f43f5e',
    chip: { bg: '#450a0a', bdC: '#e11d48', bdW: 1.5, radius: 8, txtC: '#fecdd3', padH: 12, padV: 5 },
    extra: { color: '#fda4af' },
  },

  // ─── Emerald (luxury dark) ──────────────────────────────────────────────
  emerald: {
    pageBg: '#022c22',
    head: {
      band: '#065f46',
      bandPad: 22,
      bandRadius: 12,
      mgB: 18,
      name: { fs: 28, w: 900, c: '#d1fae5', up: true, ls: 1 },
      job: { fs: 14, w: 700, c: '#10b981', up: true, ls: 2, mt: 6, mb: 14 },
      contact: { keys: ['email', 'phone', 'location'], fs: 11, c: '#6ee7b7', gap: 12 },
    },
    secs: [
      { t: 'sum', label: 'PROFILE' },
      { t: 'exp', label: 'EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
      { t: 'skill', label: 'SKILLS' },
    ],
    secTitle: { fs: 14, w: 800, c: '#10b981', ls: 2, borderB: [3, '#065f46'], pb: 5, mb: 10 },
    item: { cont: 'padding-left:14px;border-left:3px solid #059669;', titleC: '#d1fae5', titleFs: 14, companyC: '#10b981', companyFs: 12 },
    coC: '#10b981',
    chip: { bg: '#022c22', bdC: '#059669', bdW: 1.5, radius: 8, txtC: '#6ee7b7', padH: 12, padV: 5 },
    extra: { color: '#6ee7b7' },
  },

  // ─── Cobalt (tech blue dark) ───────────────────────────────────────────
  cobalt: {
    pageBg: '#0c1929',
    head: {
      band: '#1e3a5f',
      bandPad: 22,
      bandRadius: 12,
      mgB: 18,
      name: { fs: 28, w: 900, c: '#e0f2fe', up: true, ls: 1 },
      job: { fs: 14, w: 700, c: '#38bdf8', up: true, ls: 2, mt: 6, mb: 14 },
      contact: { keys: ['email', 'phone', 'location'], fs: 11, c: '#7dd3fc', gap: 12 },
    },
    secs: [
      { t: 'sum', label: 'PROFILE' },
      { t: 'exp', label: 'EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
      { t: 'skill', label: 'SKILLS' },
    ],
    secTitle: { fs: 14, w: 800, c: '#38bdf8', ls: 2, borderB: [3, '#1e3a5f'], pb: 5, mb: 10 },
    item: { cont: 'padding-left:14px;border-left:3px solid #0284c7;', titleC: '#e0f2fe', titleFs: 14, companyC: '#38bdf8', companyFs: 12 },
    coC: '#38bdf8',
    chip: { bg: '#0c1929', bdC: '#0284c7', bdW: 1.5, radius: 8, txtC: '#7dd3fc', padH: 12, padV: 5 },
    extra: { color: '#7dd3fc' },
  },

  // ─── Gold (premium) ────────────────────────────────────────────────────
  gold: {
    pageBg: '#fffbeb',
    head: {
      band: '#f59e0b',
      bandPad: 22,
      bandRadius: 12,
      mgB: 18,
      name: { fs: 28, w: 900, c: '#ffffff', up: true, ls: 1 },
      job: { fs: 14, w: 700, c: '#fbbf24', up: true, ls: 2, mt: 6, mb: 14 },
      contact: { keys: ['email', 'phone', 'location'], fs: 11, c: '#fde68a', gap: 12 },
    },
    secs: [
      { t: 'sum', label: 'PROFILE' },
      { t: 'exp', label: 'EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
      { t: 'skill', label: 'SKILLS' },
    ],
    secTitle: { fs: 14, w: 800, c: '#f59e0b', ls: 2, borderB: [3, '#fcd34d'], pb: 5, mb: 10 },
    item: { cont: 'padding-left:14px;border-left:3px solid #fcd34d;', titleC: '#92400e', titleFs: 14, companyC: '#f59e0b', companyFs: 12 },
    coC: '#f59e0b',
    chip: { bg: '#fef3c7', bdC: '#fcd34d', bdW: 1.5, radius: 8, txtC: '#92400e', padH: 12, padV: 5 },
    extra: { color: '#f59e0b' },
  },

  // ─── Pink (creative bold) ──────────────────────────────────────────────
  pink: {
    pageBg: '#fdf2f8',
    head: {
      borderB: [4, '#ec4899'],
      padB: 18,
      mgB: 18,
      name: { fs: 26, w: 800, c: '#9d174d', up: true, ls: 1 },
      job: { fs: 14, w: 700, c: '#ec4899', up: true, ls: 2, mt: 6, mb: 14 },
      contact: { keys: ['email', 'phone', 'location'], fs: 11, c: '#be185d', gap: 12 },
    },
    secs: [
      { t: 'sum', label: 'PROFILE' },
      { t: 'exp', label: 'EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
      { t: 'skill', label: 'SKILLS' },
    ],
    secTitle: { fs: 14, w: 800, c: '#ec4899', ls: 2, borderB: [3, '#fbcfe8'], pb: 5, mb: 10 },
    item: { cont: 'padding-left:14px;border-left:3px solid #f9a8d4;', titleC: '#9d174d', titleFs: 14, companyC: '#ec4899', companyFs: 12 },
    coC: '#ec4899',
    chip: { bg: '#fce7f3', bdC: '#f9a8d4', bdW: 1.5, radius: 8, txtC: '#9d174d', padH: 12, padV: 5 },
    extra: { color: '#ec4899' },
  },

  // ─── Teal (modern professional) ────────────────────────────────────────
  teal: {
    pageBg: '#f0fdfa',
    head: {
      borderB: [4, '#0d9488'],
      padB: 18,
      mgB: 18,
      name: { fs: 26, w: 800, c: '#115e59', up: true, ls: 1 },
      job: { fs: 14, w: 700, c: '#0d9488', up: true, ls: 2, mt: 6, mb: 14 },
      contact: { keys: ['email', 'phone', 'location'], fs: 11, c: '#0f766e', gap: 12 },
    },
    secs: [
      { t: 'sum', label: 'PROFILE' },
      { t: 'exp', label: 'EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
      { t: 'skill', label: 'SKILLS' },
    ],
    secTitle: { fs: 14, w: 800, c: '#0d9488', ls: 2, borderB: [3, '#99f6e4'], pb: 5, mb: 10 },
    item: { cont: 'padding-left:14px;border-left:3px solid #5eead4;', titleC: '#115e59', titleFs: 14, companyC: '#0d9488', companyFs: 12 },
    coC: '#0d9488',
    chip: { bg: '#ccfbf1', bdC: '#5eead4', bdW: 1.5, radius: 8, txtC: '#115e59', padH: 12, padV: 5 },
    extra: { color: '#0d9488' },
  },

  // ─── Indigo (corporate professional) ────────────────────────────────────
  indigo: {
    pageBg: '#eef2ff',
    head: {
      borderB: [4, '#4f46e5'],
      padB: 18,
      mgB: 18,
      name: { fs: 26, w: 800, c: '#312e81', up: true, ls: 1 },
      job: { fs: 14, w: 700, c: '#4f46e5', up: true, ls: 2, mt: 6, mb: 14 },
      contact: { keys: ['email', 'phone', 'location', 'linkedin'], fs: 11, c: '#4338ca', gap: 12 },
    },
    secs: [
      { t: 'sum', label: 'PROFILE' },
      { t: 'exp', label: 'EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
      { t: 'skill', label: 'SKILLS' },
    ],
    secTitle: { fs: 14, w: 800, c: '#4f46e5', ls: 2, borderB: [3, '#c7d2fe'], pb: 5, mb: 10 },
    item: { cont: 'padding-left:14px;border-left:3px solid #a5b4fc;', titleC: '#312e81', titleFs: 14, companyC: '#4f46e5', companyFs: 12 },
    coC: '#4f46e5',
    chip: { bg: '#e0e7ff', bdC: '#a5b4fc', bdW: 1.5, radius: 8, txtC: '#312e81', padH: 12, padV: 5 },
    extra: { color: '#4f46e5' },
  },
  // The color-theme entries below are intentionally generated from
  // BANDED_THEME_PALETTES so the PDF matches the ResumePreview components.
  ...makeBandedColorThemeSpecs(),
};
