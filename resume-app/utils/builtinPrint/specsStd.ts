// Per-template descriptors for the standard single-column hand-crafted
// templates. Values mirror the RN components + tStyles in ResumePreview.tsx.
import { StdSpec } from './engine';

const INDIGO = '#4f46e5';

export const STD_SPECS: Record<string, StdSpec> = {
  // ─── Modern ─────────────────────────────────────────────────────────────
  modern: {
    pageBg: '#ffffff',
    head: {
      borderB: [2, INDIGO],
      padB: 16,
      mgB: 16,
      name: { fs: 24, w: 800, c: '#0f172a', up: true, ls: 0.5 },
      job: { fs: 14, w: 700, c: INDIGO, up: true, ls: 1, mt: 4, mb: 12 },
      contact: {
        keys: ['email', 'phone', 'location', 'linkedin', 'website'],
        icons: { email: '📧', phone: '📱', location: '📍', linkedin: '💼', website: '🌐' },
        fs: 11, c: '#64748b', gap: 8,
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
    chip: { bg: '#e0e7ff', txtC: '#4338ca', radius: 12 },
    extra: { color: INDIGO },
  },

  // ─── Minimal ────────────────────────────────────────────────────────────
  minimal: {
    pageBg: '#ffffff',
    head: {
      borderB: [1, '#e2e8f0'],
      padB: 16,
      mgB: 16,
      name: { fs: 28, w: 800, c: '#000000' },
      job: { fs: 12, w: 700, c: '#000000', up: true, ls: 2, mt: 4, mb: 12 },
      contact: { keys: ['email', 'phone', 'location'], fs: 11, c: '#64748b', gap: 12 },
    },
    secs: [
      { t: 'sum', label: 'PROFILE' },
      { t: 'exp', label: 'EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
      { t: 'skill', label: 'SKILLS' },
    ],
    secTitle: { fs: 12, w: 700, c: '#000000', ls: 3, borderB: [1, '#e2e8f0'], pb: 4, mb: 8 },
    chip: { bdC: '#000000', bdW: 1, radius: 4, txtC: '#000000', padH: 10, padV: 4 },
    extra: { color: INDIGO },
  },

  // ─── ATS Optimized ──────────────────────────────────────────────────────
  ats: {
    pageBg: '#ffffff',
    head: {
      alignC: true,
      borderB: [2, '#000000'],
      padB: 12,
      mgB: 16,
      name: { fs: 22, w: 800, c: '#000000', up: true, ls: 1 },
      job: { fs: 12, w: 700, c: '#000000', up: true, ls: 2, mt: 4, mb: 8 },
      contact: { keys: ['location', 'phone', 'email', 'linkedin', 'website'], sep: ' | ', fs: 11, c: '#000000', alignC: true },
    },
    secs: [
      { t: 'sum', label: 'SUMMARY' },
      { t: 'skill', label: 'SKILLS' },
      { t: 'exp', label: 'EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
    ],
    secTitle: { fs: 14, w: 700, c: '#000000', up: true, borderB: [1, '#d1d5db'], pb: 4, mb: 8 },
    skillsSep: ', ',
    coLoc: true,
    extra: { color: INDIGO },
  },

  // ─── Professional ───────────────────────────────────────────────────────
  professional: {
    pageBg: '#ffffff',
    head: {
      borderB: [3, '#1e3a5f'],
      padB: 16,
      mgB: 16,
      name: { fs: 24, w: 800, c: '#1e3a5f', up: true, ls: 1 },
      job: { fs: 13, w: 700, c: '#2563eb', up: true, ls: 1.5, mt: 4, mb: 12 },
      contact: { keys: ['email', 'phone', 'location'], fs: 11, c: '#475569', gap: 10 },
    },
    secs: [
      { t: 'sum', label: 'Professional Summary' },
      { t: 'exp', label: 'Experience' },
      { t: 'edu', label: 'Education' },
      { t: 'skill', label: 'Skills' },
    ],
    secTitle: {},
    secTitleDyn: '#1e3a5f',
    item: { companyC: '#1e3a5f', companyFs: 12 },
    coC: '#1e3a5f',
    chip: { bg: '#eff6ff', bdC: '#bfdbfe', bdW: 1, radius: 6, txtC: '#1e40af' },
    extra: { color: '#1e3a5f' },
  },

  // ─── Executive ──────────────────────────────────────────────────────────
  executive: {
    pageBg: '#ffffff',
    head: {
      borderB: [1, '#e5e7eb'],
      padB: 16,
      mgB: 16,
      deco: 'accent',
      decoColor: '#111827',
      name: { fs: 24, w: 900, c: '#111827', ls: -0.5 },
      job: { fs: 13, w: 600, c: '#6b7280', up: true, ls: 2, mt: 4, mb: 12 },
      contact: { keys: ['email', 'phone', 'location', 'linkedin'], fs: 11, c: '#6b7280', gap: 12, ml: 14 },
    },
    secs: [
      { t: 'sum', label: 'EXECUTIVE SUMMARY' },
      { t: 'exp', label: 'PROFESSIONAL EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
      { t: 'skill', label: 'CORE COMPETENCIES' },
    ],
    secTitle: { fs: 12, w: 800, c: '#111827', ls: 2, borderB: [2, '#111827'], pb: 4, mb: 10 },
    item: {
      cont: 'padding-left:12px;border-left:2px solid #e5e7eb;',
      titleC: '#111827', titleFs: 14,
      dateC: '#9ca3af', dateFs: 10,
      companyC: '#6b7280', companyFs: 12,
    },
    coC: '#6b7280',
    chip: { bg: '#f9fafb', bdC: '#d1d5db', bdW: 1, radius: 4, txtC: '#374151' },
    extra: { color: '#111827' },
    extraCss: '.hd .jt{margin-left:14px}',
  },

  // ─── Classic ────────────────────────────────────────────────────────────
  classic: {
    pageBg: '#ffffff',
    head: {
      alignC: true,
      borderB: [1, '#d1d5db'],
      padB: 16,
      mgB: 16,
      name: { fs: 26, w: 900, c: '#111827', ls: 2 },
      centerDiv: { h: 2, c: '#374151', mt: 8, mb: 8 },
      job: { fs: 12, w: 600, c: '#6b7280', up: true, ls: 3, mb: 10 },
      contact: { keys: ['email', 'phone', 'location'], sep: ' • ', fs: 11, c: '#6b7280', alignC: true },
    },
    secs: [
      { t: 'sum', label: 'PROFILE' },
      { t: 'exp', label: 'EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
      { t: 'skill', label: 'SKILLS' },
    ],
    secTitle: { fs: 13, w: 800, c: '#374151', ls: 2, borderB: [1, '#e5e7eb'], pb: 4, mb: 8 },
    skillsSep: ' • ',
    extra: { color: '#374151' },
  },

  // ─── Elegant ────────────────────────────────────────────────────────────
  elegant: {
    pageBg: '#ffffff',
    head: {
      borderB: [2, '#d97706'],
      padB: 16,
      mgB: 16,
      name: { fs: 24, w: 800, c: '#451a03', ls: 0.5 },
      job: { fs: 13, w: 700, c: '#92400e', up: true, ls: 1.5, mt: 4, mb: 12 },
      contact: { keys: ['email', 'phone', 'location'], fs: 11, c: '#78716c', gap: 10 },
    },
    secs: [
      { t: 'sum', label: 'PROFILE' },
      { t: 'exp', label: 'EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
      { t: 'skill', label: 'SKILLS' },
    ],
    secTitle: { fs: 12, w: 800, c: '#92400e', ls: 2, borderB: [1, '#fde68a'], pb: 4, mb: 8 },
    item: {
      cont: 'padding-left:10px;border-left:2px solid #fbbf24;',
      titleC: '#451a03',
      companyC: '#92400e', companyFs: 12,
    },
    coC: '#92400e',
    chip: { bg: '#fffbeb', bdC: '#fde68a', bdW: 1, radius: 12, txtC: '#92400e' },
    extra: { color: '#92400e' },
  },

  // ─── Monochrome ─────────────────────────────────────────────────────────
  monochrome: {
    pageBg: '#ffffff',
    head: {
      borderB: [2, '#374151'],
      padB: 16,
      mgB: 16,
      name: { fs: 24, w: 800, c: '#1f2937', up: true, ls: 1 },
      job: { fs: 13, w: 600, c: '#6b7280', up: true, ls: 2, mt: 4, mb: 12 },
      contact: { keys: ['email', 'phone', 'location'], fs: 11, c: '#9ca3af', gap: 10 },
    },
    secs: [
      { t: 'sum', label: 'PROFILE' },
      { t: 'exp', label: 'EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
      { t: 'skill', label: 'SKILLS' },
    ],
    secTitle: { fs: 13, w: 800, c: '#374151', ls: 2, borderB: [1, '#e5e7eb'], pb: 4, mb: 8 },
    chip: { bg: '#f9fafb', bdC: '#e5e7eb', bdW: 1, radius: 4, txtC: '#374151' },
    extra: { color: '#374151' },
  },

  // ─── Legal ──────────────────────────────────────────────────────────────
  legal: {
    pageBg: '#ffffff',
    head: {
      borderB: [3, '#1f2937'],
      padB: 16,
      mgB: 16,
      name: { fs: 22, w: 800, c: '#1f2937', up: true, ls: 1.5 },
      nameSuffix: ', Esq.',
      job: { fs: 12, w: 600, c: '#6b7280', up: true, ls: 2, mt: 4, mb: 12 },
      contact: { keys: ['email', 'phone', 'location'], fs: 11, c: '#6b7280', gap: 10 },
    },
    secs: [
      { t: 'sum', label: 'PROFESSIONAL SUMMARY' },
      { t: 'exp', label: 'EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
      { t: 'skill', label: 'AREAS OF PRACTICE' },
    ],
    secTitle: { fs: 12, w: 800, c: '#1f2937', ls: 2, borderB: [1, '#d1d5db'], pb: 4, mb: 8 },
    item: { companyC: '#374151', companyFs: 12 },
    coC: '#374151',
    skillsSep: ' • ',
    extra: { color: '#374151' },
  },

  // ─── Academic ───────────────────────────────────────────────────────────
  academic: {
    pageBg: '#ffffff',
    head: {
      borderB: [2, '#374151'],
      padB: 16,
      mgB: 16,
      name: { fs: 24, w: 800, c: '#111827', ls: 0.5 },
      job: { fs: 13, w: 600, c: '#6b7280', mt: 4, mb: 12 },
      contact: { keys: ['email', 'phone', 'location', 'linkedin'], fs: 11, c: '#6b7280', gap: 10 },
    },
    secs: [
      { t: 'sum', label: 'Research Interests' },
      { t: 'edu', label: 'Education', degreeFirst: true },
      { t: 'exp', label: 'Experience' },
      { t: 'skill', label: 'Skills & Tools' },
    ],
    secTitle: { fs: 13, w: 800, c: '#374151', up: true, ls: 2, borderB: [1, '#d1d5db'], pb: 4, mb: 8 },
    chip: { bg: '#f3f4f6', bdC: '#d1d5db', bdW: 1, radius: 4, txtC: '#374151' },
    extra: { color: '#374151' },
  },

  // ─── Medical ────────────────────────────────────────────────────────────
  medical: {
    pageBg: '#ffffff',
    head: {
      band: '#059669',
      bandPad: 20,
      avatar: { char: 'symbol', symbol: '✚', inline: true, size: 40, bg: '#059669', color: '#ffffff', fs: 28, nameColor: '#ffffff' },
      name: { fs: 22, w: 800, c: '#ffffff' },
      job: { fs: 12, w: 700, c: '#d1fae5', up: true, ls: 1, mt: 2, mb: 12 },
      contact: {
        keys: ['email', 'phone', 'location'],
        icons: { email: '✉', phone: '☎', location: '◉' },
        fs: 10, c: '#d1fae5', gap: 12,
      },
    },
    secs: [
      { t: 'sum', label: 'Clinical Summary' },
      { t: 'exp', label: 'Professional Experience' },
      { t: 'eduCert', label: 'Education & Certifications' },
      { t: 'skill', label: 'Competencies' },
    ],
    secTitle: { fs: 13, w: 700, c: '#059669', up: true, borderB: [2, '#d1fae5'], pb: 4, mb: 8 },
    item: { companyC: '#059669', companyFs: 12 },
    coC: '#059669',
    chip: { bg: '#ecfdf5', bdC: '#a7f3d0', bdW: 1, radius: 6, txtC: '#047857' },
    extra: { color: '#059669' },
  },

  // ─── Nature ─────────────────────────────────────────────────────────────
  nature: {
    pageBg: '#f7fee7',
    head: {
      borderB: [3, '#65a30d'],
      padB: 16,
      mgB: 16,
      name: { fs: 24, w: 800, c: '#166534' },
      job: { fs: 13, w: 700, c: '#65a30d', up: true, ls: 1, mt: 4, mb: 12 },
      contact: { keys: ['email', 'phone', 'location'], icons: { email: '📧', phone: '📱', location: '📍' }, fs: 11, c: '#4d7c0f', gap: 10 },
    },
    secs: [
      { t: 'sum', label: '🌿 About Me' },
      { t: 'exp', label: '🌱 Experience' },
      { t: 'edu', label: '📚 Education' },
      { t: 'skill', label: '🍃 Skills' },
    ],
    secTitle: { fs: 14, w: 800, c: '#166534', up: true, ls: 1, mb: 8 },
    item: { cont: 'padding-left:10px;border-left:2px solid #86efac;', titleC: '#166534', companyC: '#15803d', companyFs: 12 },
    coC: '#15803d',
    chip: { bg: '#ecfccb', bdC: '#bef264', bdW: 1, radius: 12, txtC: '#3f6212' },
    extra: { color: '#16a34a' },
  },

  // ─── Startup ────────────────────────────────────────────────────────────
  startup: {
    pageBg: '#ffffff',
    head: {
      borderB: [3, '#ec4899'],
      padB: 16,
      mgB: 16,
      name: { fs: 24, w: 900, c: '#111827', ls: -0.5 },
      job: { fs: 14, w: 700, c: '#ec4899', up: true, ls: 1, mt: 4, mb: 12 },
      contact: { keys: ['email', 'phone', 'location'], fs: 11, c: '#6b7280', gap: 10 },
    },
    secs: [
      { t: 'sum', label: 'WHY ME' },
      { t: 'exp', label: 'EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
      { t: 'skill', label: 'TECH STACK' },
    ],
    secTitle: { fs: 13, w: 800, c: '#ec4899', ls: 1.5, mb: 8 },
    item: { cont: 'padding-left:10px;border-left:3px solid #fce7f3;', titleC: '#111827', titleFs: 14, companyC: '#f97316', companyFs: 12 },
    coC: '#f97316',
    chip: { bg: '#fdf2f8', bdC: '#fbcfe8', bdW: 1, radius: 12, txtC: '#be185d' },
    extra: { color: '#ec4899' },
  },

  // ─── Timeline ───────────────────────────────────────────────────────────
  timeline: {
    pageBg: '#ffffff',
    head: {
      borderB: [2, '#2563eb'],
      padB: 16,
      mgB: 16,
      name: { fs: 24, w: 800, c: '#1e3a5f' },
      job: { fs: 13, w: 700, c: '#2563eb', up: true, ls: 1, mt: 4, mb: 12 },
      contact: { keys: ['email', 'phone', 'location'], fs: 11, c: '#64748b', gap: 10 },
    },
    secs: [
      { t: 'sum', label: 'PROFILE' },
      { t: 'exp', label: 'EXPERIENCE', timeline: true },
      { t: 'edu', label: 'EDUCATION', timeline: true },
      { t: 'skill', label: 'SKILLS' },
    ],
    secTitle: { fs: 13, w: 800, c: '#2563eb', ls: 2, mb: 12 },
    item: { titleC: '#1e3a5f', titleFs: 14, companyC: '#64748b', companyFs: 12 },
    coC: '#64748b',
    chip: { bg: '#eff6ff', bdC: '#bfdbfe', bdW: 1, radius: 8, txtC: '#1d4ed8' },
    extra: { color: '#2563eb' },
  },

  // ─── Compact ────────────────────────────────────────────────────────────
  compact: {
    pageBg: '#ffffff',
    head: {
      borderB: [2, '#ea580c'],
      padB: 12,
      mgB: 12,
      name: { fs: 20, w: 800, c: '#1c1917' },
      job: { badge: true, fs: 9, w: 700, badgeBg: '#ea580c', badgeC: '#ffffff' },
      contact: { keys: ['email', 'phone', 'location'], sep: ' | ', fs: 10, c: '#6b7280' },
    },
    secs: [
      { t: 'sum', label: 'SUMMARY' },
      { t: 'exp', label: 'EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
      { t: 'skill', label: 'SKILLS' },
    ],
    secTitle: { fs: 10, w: 800, c: '#ea580c', ls: 2, mb: 6 },
    item: { titleC: '#1e293b', titleFs: 12, dateC: '#94a3b8', dateFs: 9, companyC: '#f97316', companyFs: 10 },
    coC: '#f97316',
    skillsSep: ' • ',
    extra: { color: '#ea580c' },
  },

  // ─── Bold ───────────────────────────────────────────────────────────────
  bold: {
    pageBg: '#ffffff',
    head: {
      band: '#7f1d1d',
      bandPad: 20,
      bandRadius: 8,
      mgB: 16,
      name: { fs: 26, w: 900, c: '#ffffff', up: true, ls: 1 },
      job: { fs: 13, w: 700, c: '#fca5a5', up: true, ls: 1.5, mt: 4, mb: 12 },
      contact: { keys: ['email', 'phone', 'location'], fs: 11, c: '#fecaca', gap: 10 },
    },
    secs: [
      { t: 'sum', label: 'PROFILE' },
      { t: 'exp', label: 'EXPERIENCE' },
      { t: 'edu', label: 'EDUCATION' },
      { t: 'skill', label: 'SKILLS' },
    ],
    secTitle: { fs: 14, w: 800, c: '#7f1d1d', ls: 2, borderB: [3, '#7f1d1d'], pb: 4, mb: 8 },
    item: { cont: 'padding-left:10px;border-left:3px solid #fecaca;', titleC: '#7f1d1d', titleFs: 14, titleW: 800, companyC: '#dc2626', companyFs: 12 },
    coC: '#dc2626',
    chip: { bg: '#fef2f2', bdC: '#fecaca', bdW: 2, radius: 6, txtC: '#991b1b' },
    extra: { color: '#b91c1c' },
  },

  // ─── Playful ────────────────────────────────────────────────────────────
  playful: {
    pageBg: '#fff7ed',
    head: {
      alignC: true,
      borderB: [3, '#fb923c', 'dashed'],
      padB: 16,
      mgB: 16,
      avatar: { char: 'first', size: 60, bg: '#f97316', color: '#ffffff', fs: 24 },
      name: { fs: 22, w: 900, c: '#1c1917' },
      job: { fs: 14, w: 700, c: '#f97316', up: true, ls: 1, mt: 4, mb: 12 },
      contact: { keys: ['email', 'phone'], icons: { email: '📧', phone: '📱' }, fs: 11, c: '#78716c', gap: 10, alignC: true },
    },
    secs: [
      { t: 'sum', label: '✨ About Me' },
      { t: 'exp', label: '💼 Experience' },
      { t: 'edu', label: '🎓 Education' },
      { t: 'skill', label: '🚀 Skills' },
    ],
    secTitle: { fs: 16, w: 800, c: '#ea580c', mb: 10 },
    item: { cont: 'background:rgba(255,255,255,0.6);border-radius:10px;padding:10px;', titleC: '#1c1917', titleFs: 13, companyC: '#f97316', companyFs: 12 },
    coC: '#f97316',
    chip: { bg: '#fed7aa', radius: 16, txtC: '#c2410c' },
    extra: { color: '#ea580c' },
  },

  // ─── Borderless ─────────────────────────────────────────────────────────
  borderless: {
    pageBg: '#ffffff',
    head: {
      padB: 16,
      mgB: 16,
      name: { fs: 26, w: 800, c: '#1f293b' },
      job: { fs: 13, w: 600, c: '#64748b', mt: 4, mb: 12 },
      contact: { keys: ['email', 'phone', 'location'], fs: 11, c: '#94a3b8', gap: 12 },
    },
    secs: [
      { t: 'sum', label: 'Profile' },
      { t: 'exp', label: 'Experience' },
      { t: 'edu', label: 'Education' },
      { t: 'skill', label: 'Skills' },
    ],
    secTitle: { fs: 14, w: 700, c: '#64748b', up: true, ls: 1, mb: 8 },
    chip: { bg: '#f8fafc', radius: 8, txtC: '#475569' },
    extra: { color: '#6b7280' },
  },

  // ─── Technical ──────────────────────────────────────────────────────────
  technical: {
    pageBg: '#f8fafc',
    mono: true,
    bodyC: '#475569',
    head: {
      borderB: [2, '#0891b2'],
      padB: 16,
      mgB: 16,
      deco: 'dot',
      decoColor: '#0891b2',
      name: { fs: 24, w: 800, c: '#0f172a', ls: -0.5 },
      job: { fs: 13, w: 700, c: '#0891b2', up: true, ls: 1, mt: 4, mb: 12 },
      contact: { keys: ['email', 'phone', 'website'], icons: { email: '📧', phone: '📱', website: '🌐' }, fs: 11, c: '#64748b', gap: 10, ml: 18 },
    },
    secs: [
      { t: 'sum', label: '// SUMMARY' },
      { t: 'exp', label: '// EXPERIENCE' },
      { t: 'skill', label: '// SKILLS' },
      { t: 'edu', label: '// EDUCATION' },
    ],
    secTitle: { fs: 12, w: 800, c: '#0891b2', ls: 1, mb: 8 },
    item: { cont: 'padding-left:10px;border-left:2px solid #e0f2fe;', titleC: '#0f172a', titleFs: 13, companyC: '#0891b2', companyFs: 12 },
    coC: '#0891b2',
    chip: { bg: '#ecfeff', bdC: '#a5f3fc', bdW: 1, radius: 6, txtC: '#0e7490' },
    extra: { color: '#0891b2' },
    extraCss: '.hd .jt{margin-left:18px}',
  },
};
