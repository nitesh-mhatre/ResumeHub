// Per-template descriptors for the standard single-column hand-crafted
// templates. Values mirror the RN components + tStyles in ResumePreview.tsx.
import { StdSpec } from './engine';

const INDIGO = '#4f46e5';

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
};
