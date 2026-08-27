/**
 * Template Factory — generates 100+ resume template configurations
 * Each config defines colors, layout variant, and visual styling.
 */

export interface TemplateConfig {
  id: string;
  name: string;
  category: string;
  colors: string[]; // 3 color swatches for the preview card
  // Template rendering config
  bg: string;
  headerBg: string;
  headerColor: string;
  accentColor: string;
  accentLight: string;
  textColor: string;
  subtextColor: string;
  dateColor: string;
  borderColor: string;
  chipBg: string;
  chipBorder: string;
  chipText: string;
  sectionTitleColor: string;
  layout: 'standard' | 'sidebar-left' | 'sidebar-right' | 'centered' | 'two-column' | 'timeline' | 'card-based';
  headerStyle: 'underline' | 'background' | 'accent-bar' | 'none' | 'double-line' | 'gradient' | 'pill' | 'bordered';
  sectionStyle: 'underline' | 'background' | 'border-left' | 'pill' | 'minimal' | 'numbered' | 'icon';
  chipStyle: 'rounded' | 'square' | 'pill' | 'outlined' | 'filled';
  itemStyle: 'default' | 'bordered' | 'card' | 'timeline' | 'compact';
  fontStyle: 'modern' | 'classic' | 'mono' | 'serif';
}

const FONT_MAP: Record<string, string> = {
  modern: '-apple-system, BlinkMacSystemFont, sans-serif',
  classic: 'Georgia, Times New Roman, serif',
  mono: 'SF Mono, Courier New, monospace',
  serif: 'Georgia, Palatino, serif',
};

// ─── Category: Professional (navy, dark, corporate) ───
const professionalColors: [string, string, string, string, string, string, string, string, string, string, string][] = [
  ['#1e3a5f', '#ffffff', '#1e3a5f', '#2563eb', '#eff6ff', '#0f172a', '#475569', '#94a3b8', '#e2e8f0', '#2563eb', '#dbeafe'],
  ['#0f172a', '#ffffff', '#0f172a', '#6366f1', '#eef2ff', '#0f172a', '#475569', '#94a3b8', '#e2e8f0', '#6366f1', '#e0e7ff'],
  ['#1e293b', '#ffffff', '#1e293b', '#0ea5e9', '#f0f9ff', '#0f172a', '#475569', '#94a3b8', '#e2e8f0', '#0ea5e9', '#e0f2fe'],
  ['#334155', '#ffffff', '#334155', '#8b5cf6', '#f5f3ff', '#1e293b', '#475569', '#94a3b8', '#e2e8f0', '#8b5cf6', '#ede9fe'],
  ['#111827', '#ffffff', '#111827', '#2563eb', '#eff6ff', '#111827', '#4b5563', '#9ca3af', '#e5e7eb', '#2563eb', '#dbeafe'],
  ['#1f2937', '#ffffff', '#1f2937', '#dc2626', '#fef2f2', '#111827', '#4b5563', '#9ca3af', '#e5e7eb', '#dc2626', '#fee2e2'],
  ['#0c4a6e', '#ffffff', '#0c4a6e', '#0284c7', '#f0f9ff', '#0c4a6e', '#475569', '#94a3b8', '#e2e8f0', '#0284c7', '#e0f2fe'],
  ['#1e3a5f', '#ffffff', '#1e3a5f', '#059669', '#ecfdf5', '#0f172a', '#475569', '#94a3b8', '#e2e8f0', '#059669', '#d1fae5'],
  ['#1a1a2e', '#ffffff', '#1a1a2e', '#e94560', '#fff1f2', '#1a1a2e', '#4a4a68', '#9ca3af', '#e2e8f0', '#e94560', '#ffe4e6'],
  ['#16213e', '#ffffff', '#16213e', '#0f3460', '#e8f4f8', '#16213e', '#4a5568', '#94a3b8', '#e2e8f0', '#0f3460', '#dbeafe'],
];

// ─── Category: Creative (purple, pink, orange) ───
const creativeColors: [string, string, string, string, string, string, string, string, string, string, string][] = [
  ['#7c3aed', '#ffffff', '#7c3aed', '#a78bfa', '#ede9fe', '#1e1b4b', '#4c1d95', '#a78bfa', '#ddd6fe', '#7c3aed', '#ede9fe'],
  ['#db2777', '#ffffff', '#db2777', '#f472b6', '#fdf2f8', '#831843', '#9d174d', '#f9a8d4', '#fce7f3', '#db2777', '#fdf2f8'],
  ['#ea580c', '#ffffff', '#ea580c', '#fb923c', '#fff7ed', '#7c2d12', '#9a3412', '#fdba74', '#ffedd5', '#ea580c', '#fff7ed'],
  ['#9333ea', '#ffffff', '#9333ea', '#c084fc', '#faf5ff', '#3b0764', '#6b21a8', '#d8b4fe', '#f3e8ff', '#9333ea', '#faf5ff'],
  ['#e11d48', '#ffffff', '#e11d48', '#fb7185', '#fff1f2', '#881337', '#be123c', '#fda4af', '#ffe4e6', '#e11d48', '#fff1f2'],
  ['#c026d3', '#ffffff', '#c026d3', '#e879f9', '#fdf4ff', '#701a75', '#a21caf', '#f0abfc', '#fae8ff', '#c026d3', '#fdf4ff'],
  ['#f97316', '#ffffff', '#f97316', '#fb923c', '#fff7ed', '#7c2d12', '#c2410c', '#fdba74', '#ffedd5', '#f97316', '#fff7ed'],
  ['#d946ef', '#ffffff', '#d946ef', '#f0abfc', '#fdf4ff', '#701a75', '#a21caf', '#e879f9', '#fae8ff', '#d946ef', '#fdf4ff'],
  ['#f43f5e', '#ffffff', '#f43f5e', '#fb7185', '#fff1f2', '#881337', '#be123c', '#fda4af', '#ffe4e6', '#f43f5e', '#fff1f2'],
  ['#a855f7', '#ffffff', '#a855f7', '#c084fc', '#faf5ff', '#3b0764', '#7e22ce', '#d8b4fe', '#f3e8ff', '#a855f7', '#faf5ff'],
];

// ─── Category: Modern (green, teal, blue) ───
const modernColors: [string, string, string, string, string, string, string, string, string, string, string][] = [
  ['#059669', '#ffffff', '#059669', '#34d399', '#ecfdf5', '#064e3b', '#047857', '#6ee7b7', '#d1fae5', '#059669', '#ecfdf5'],
  ['#0891b2', '#ffffff', '#0891b2', '#22d3ee', '#ecfeff', '#164e63', '#0e7490', '#67e8f9', '#cffafe', '#0891b2', '#ecfeff'],
  ['#0d9488', '#ffffff', '#0d9488', '#2dd4bf', '#f0fdfa', '#134e4a', '#0f766e', '#5eead4', '#ccfbf1', '#0d9488', '#f0fdfa'],
  ['#0284c7', '#ffffff', '#0284c7', '#38bdf8', '#f0f9ff', '#0c4a6e', '#0369a1', '#7dd3fc', '#e0f2fe', '#0284c7', '#f0f9ff'],
  ['#10b981', '#ffffff', '#10b981', '#34d399', '#ecfdf5', '#064e3b', '#047857', '#6ee7b7', '#d1fae5', '#10b981', '#ecfdf5'],
  ['#14b8a6', '#ffffff', '#14b8a6', '#2dd4bf', '#f0fdfa', '#134e4a', '#0d9488', '#5eead4', '#ccfbf1', '#14b8a6', '#f0fdfa'],
  ['#0ea5e9', '#ffffff', '#0ea5e9', '#38bdf8', '#f0f9ff', '#0c4a6e', '#0284c7', '#7dd3fc', '#e0f2fe', '#0ea5e9', '#f0f9ff'],
  ['#22c55e', '#ffffff', '#22c55e', '#4ade80', '#f0fdf4', '#14532d', '#16a34a', '#86efac', '#dcfce7', '#22c55e', '#f0fdf4'],
  ['#06b6d4', '#ffffff', '#06b6d4', '#22d3ee', '#ecfeff', '#164e63', '#0891b2', '#67e8f9', '#cffafe', '#06b6d4', '#ecfeff'],
  ['#16a34a', '#ffffff', '#16a34a', '#4ade80', '#f0fdf4', '#14532d', '#15803d', '#86efac', '#dcfce7', '#16a34a', '#f0fdf4'],
];

// ─── Category: Warm (gold, amber, yellow) ───
const warmColors: [string, string, string, string, string, string, string, string, string, string, string][] = [
  ['#d97706', '#ffffff', '#d97706', '#fbbf24', '#fffbeb', '#78350f', '#b45309', '#fcd34d', '#fef3c7', '#d97706', '#fffbeb'],
  ['#ca8a04', '#ffffff', '#ca8a04', '#facc15', '#fefce8', '#713f12', '#a16207', '#fde047', '#fef9c3', '#ca8a04', '#fefce8'],
  ['#b45309', '#ffffff', '#b45309', '#f59e0b', '#fffbeb', '#78350f', '#92400e', '#fbbf24', '#fef3c7', '#b45309', '#fffbeb'],
  ['#ea580c', '#ffffff', '#ea580c', '#fb923c', '#fff7ed', '#7c2d12', '#c2410c', '#fdba74', '#ffedd5', '#ea580c', '#fff7ed'],
  ['#dc2626', '#ffffff', '#dc2626', '#f87171', '#fef2f2', '#7f1d1d', '#b91c1c', '#fca5a5', '#fee2e2', '#dc2626', '#fef2f2'],
  ['#e11d48', '#ffffff', '#e11d48', '#fb7185', '#fff1f2', '#881337', '#be123c', '#fda4af', '#ffe4e6', '#e11d48', '#fff1f2'],
  ['#92400e', '#ffffff', '#92400e', '#d97706', '#fffbeb', '#78350f', '#b45309', '#fbbf24', '#fef3c7', '#92400e', '#fffbeb'],
  ['#c2410c', '#ffffff', '#c2410c', '#f97316', '#fff7ed', '#7c2d12', '#ea580c', '#fb923c', '#ffedd5', '#c2410c', '#fff7ed'],
  ['#b91c1c', '#ffffff', '#b91c1c', '#ef4444', '#fef2f2', '#7f1d1d', '#dc2626', '#f87171', '#fee2e2', '#b91c1c', '#fef2f2'],
  ['#9a3412', '#ffffff', '#9a3412', '#ea580c', '#fff7ed', '#7c2d12', '#c2410c', '#fb923c', '#ffedd5', '#9a3412', '#fff7ed'],
];

// ─── Category: Neutral (gray, slate, zinc) ───
const neutralColors: [string, string, string, string, string, string, string, string, string, string, string][] = [
  ['#374151', '#ffffff', '#374151', '#6b7280', '#f9fafb', '#111827', '#4b5563', '#9ca3af', '#f3f4f6', '#374151', '#f9fafb'],
  ['#1f2937', '#ffffff', '#1f2937', '#6b7280', '#f9fafb', '#111827', '#374151', '#9ca3af', '#f3f4f6', '#1f2937', '#f9fafb'],
  ['#4b5563', '#ffffff', '#4b5563', '#9ca3af', '#f9fafb', '#1f2937', '#6b7280', '#d1d5db', '#f3f4f6', '#4b5563', '#f9fafb'],
  ['#334155', '#ffffff', '#334155', '#94a3b8', '#f8fafc', '#0f172a', '#475569', '#cbd5e1', '#f1f5f9', '#334155', '#f8fafc'],
  ['#1e293b', '#ffffff', '#1e293b', '#64748b', '#f8fafc', '#0f172a', '#334155', '#94a3b8', '#f1f5f9', '#1e293b', '#f8fafc'],
  ['#44403c', '#ffffff', '#44403c', '#a8a29e', '#fafaf9', '#1c1917', '#57534e', '#d6d3d1', '#f5f5f4', '#44403c', '#fafaf9'],
  ['#3f3f46', '#ffffff', '#3f3f46', '#a1a1aa', '#fafafa', '#18181b', '#52525b', '#d4d4d8', '#f4f4f5', '#3f3f46', '#fafafa'],
  ['#525252', '#ffffff', '#525252', '#a3a3a3', '#fafafa', '#171717', '#737373', '#d4d4d4', '#f5f5f5', '#525252', '#fafafa'],
  ['#27272a', '#ffffff', '#27272a', '#71717a', '#fafafa', '#18181b', '#3f3f46', '#a1a1aa', '#f4f4f5', '#27272a', '#fafafa'],
  ['#57534e', '#ffffff', '#57534e', '#a8a29e', '#fafaf9', '#292524', '#78716c', '#d6d3d1', '#f5f5f4', '#57534e', '#fafaf9'],
];

// ─── Category: Dark (dark mode) ───
const darkColors: [string, string, string, string, string, string, string, string, string, string, string][] = [
  ['#0f172a', '#0f172a', '#4ade80', '#4ade80', '#1e293b', '#e2e8f0', '#94a3b8', '#475569', '#1e293b', '#4ade80', '#1e293b'],
  ['#111827', '#111827', '#60a5fa', '#60a5fa', '#1f2937', '#f9fafb', '#9ca3af', '#6b7280', '#1f2937', '#60a5fa', '#1f2937'],
  ['#030712', '#030712', '#f472b6', '#f472b6', '#111827', '#f9fafb', '#9ca3af', '#6b7280', '#111827', '#f472b6', '#111827'],
  ['#0c0a09', '#0c0a09', '#fb923c', '#fb923c', '#1c1917', '#fafaf9', '#a8a29e', '#78716c', '#1c1917', '#fb923c', '#1c1917'],
  ['#18181b', '#18181b', '#a78bfa', '#a78bfa', '#27272a', '#fafafa', '#a1a1aa', '#71717a', '#27272a', '#a78bfa', '#27272a'],
  ['#1a1a2e', '#1a1a2e', '#e94560', '#e94560', '#16213e', '#eaeaea', '#a0a0b8', '#6a6a80', '#16213e', '#e94560', '#16213e'],
  ['#0d1117', '#0d1117', '#58a6ff', '#58a6ff', '#161b22', '#c9d1d9', '#8b949e', '#484f58', '#161b22', '#58a6ff', '#161b22'],
  ['#101820', '#101820', '#00d4aa', '#00d4aa', '#1a2332', '#e0e6ed', '#8899aa', '#556677', '#1a2332', '#00d4aa', '#1a2332'],
  ['#191919', '#191919', '#ff6b6b', '#ff6b6b', '#222222', '#e0e0e0', '#999999', '#666666', '#222222', '#ff6b6b', '#222222'],
  ['#0a0a0a', '#0a0a0a', '#22d3ee', '#22d3ee', '#171717', '#e5e5e5', '#a3a3a3', '#737373', '#171717', '#22d3ee', '#171717'],
];

// ─── Category: Elegant (gold, cream, rose) ───
const elegantColors: [string, string, string, string, string, string, string, string, string, string, string][] = [
  ['#451a03', '#ffffff', '#451a03', '#d97706', '#fffbeb', '#451a03', '#78350f', '#b45309', '#fef3c7', '#d97706', '#fffbeb'],
  ['#581c87', '#ffffff', '#581c87', '#a855f7', '#faf5ff', '#3b0764', '#7e22ce', '#c084fc', '#f3e8ff', '#a855f7', '#faf5ff'],
  ['#701a75', '#ffffff', '#701a75', '#d946ef', '#fdf4ff', '#4a044e', '#86198f', '#e879f9', '#fae8ff', '#d946ef', '#fdf4ff'],
  ['#4c1d95', '#ffffff', '#4c1d95', '#8b5cf6', '#f5f3ff', '#2e1065', '#6d28d9', '#a78bfa', '#ede9fe', '#8b5cf6', '#f5f3ff'],
  ['#7f1d1d', '#ffffff', '#7f1d1d', '#ef4444', '#fef2f2', '#450a0a', '#b91c1c', '#f87171', '#fee2e2', '#ef4444', '#fef2f2'],
  ['#78350f', '#ffffff', '#78350f', '#f59e0b', '#fffbeb', '#451a03', '#b45309', '#fbbf24', '#fef3c7', '#f59e0b', '#fffbeb'],
  ['#1e3a5f', '#ffffff', '#1e3a5f', '#3b82f6', '#eff6ff', '#172554', '#1d4ed8', '#60a5fa', '#dbeafe', '#3b82f6', '#eff6ff'],
  ['#134e4a', '#ffffff', '#134e4a', '#14b8a6', '#f0fdfa', '#042f2e', '#0d9488', '#2dd4bf', '#ccfbf1', '#14b8a6', '#f0fdfa'],
  ['#365314', '#ffffff', '#365314', '#84cc16', '#f7fee7', '#1a2e05', '#4d7c0f', '#a3e635', '#ecfccb', '#84cc16', '#f7fee7'],
  ['#713f12', '#ffffff', '#713f12', '#eab308', '#fefce8', '#422006', '#a16207', '#facc15', '#fef9c3', '#eab308', '#fefce8'],
];

// ─── Category: Sidebar (two-tone layouts) ───
const sidebarColors: [string, string, string, string, string, string, string, string, string, string, string][] = [
  ['#1e3a5f', '#ffffff', '#1e3a5f', '#60a5fa', '#dbeafe', '#0f172a', '#475569', '#94a3b8', '#f1f5f9', '#2563eb', '#eff6ff'],
  ['#111827', '#ffffff', '#111827', '#f59e0b', '#fef3c7', '#111827', '#4b5563', '#9ca3af', '#f3f4f6', '#d97706', '#fffbeb'],
  ['#0f172a', '#ffffff', '#0f172a', '#22d3ee', '#cffafe', '#0f172a', '#475569', '#94a3b8', '#f1f5f9', '#06b6d4', '#ecfeff'],
  ['#1f2937', '#ffffff', '#1f2937', '#10b981', '#d1fae5', '#1f2937', '#4b5563', '#9ca3af', '#f3f4f6', '#059669', '#ecfdf5'],
  ['#1a1a2e', '#ffffff', '#1a1a2e', '#e94560', '#ffe4e6', '#1a1a2e', '#4a4a68', '#9ca3af', '#f1f5f9', '#e11d48', '#fff1f2'],
  ['#0c4a6e', '#ffffff', '#0c4a6e', '#0ea5e9', '#e0f2fe', '#0c4a6e', '#0369a1', '#7dd3fc', '#f0f9ff', '#0284c7', '#f0f9ff'],
  ['#3b0764', '#ffffff', '#3b0764', '#a855f7', '#f3e8ff', '#3b0764', '#6b21a8', '#c084fc', '#faf5ff', '#7c3aed', '#ede9fe'],
  ['#7f1d1d', '#ffffff', '#7f1d1d', '#f87171', '#fee2e2', '#7f1d1d', '#b91c1c', '#fca5a5', '#fef2f2', '#dc2626', '#fef2f2'],
  ['#064e3b', '#ffffff', '#064e3b', '#34d399', '#d1fae5', '#064e3b', '#047857', '#6ee7b7', '#ecfdf5', '#059669', '#ecfdf5'],
  ['#422006', '#ffffff', '#422006', '#d97706', '#fef3c7', '#422006', '#92400e', '#fbbf24', '#fffbeb', '#b45309', '#fffbeb'],
];

// Helper to generate template names
function makeName(base: string, variant: number, category: string): string {
  const suffixes = ['', ' Pro', ' Plus', ' Elite', ' Lite', ' V2', ' V3', ' X', ' Ultra', ' Max'];
  return `${base}${suffixes[variant % suffixes.length]}`;
}

// Helper to pick layout
function pickLayout(idx: number): TemplateConfig['layout'] {
  const layouts: TemplateConfig['layout'][] = ['standard', 'sidebar-left', 'sidebar-right', 'centered', 'two-column', 'timeline', 'card-based'];
  return layouts[idx % layouts.length];
}

// Helper to pick header style
function pickHeaderStyle(idx: number): TemplateConfig['headerStyle'] {
  const styles: TemplateConfig['headerStyle'][] = ['underline', 'background', 'accent-bar', 'double-line', 'gradient', 'pill', 'bordered'];
  return styles[idx % styles.length];
}

// Helper to pick section style
function pickSectionStyle(idx: number): TemplateConfig['sectionStyle'] {
  const styles: TemplateConfig['sectionStyle'][] = ['underline', 'background', 'border-left', 'pill', 'minimal', 'numbered'];
  return styles[idx % styles.length];
}

// Helper to pick chip style
function pickChipStyle(idx: number): TemplateConfig['chipStyle'] {
  const styles: TemplateConfig['chipStyle'][] = ['rounded', 'square', 'pill', 'outlined', 'filled'];
  return styles[idx % styles.length];
}

// Helper to pick item style
function pickItemStyle(idx: number): TemplateConfig['itemStyle'] {
  const styles: TemplateConfig['itemStyle'][] = ['default', 'bordered', 'card', 'timeline', 'compact'];
  return styles[idx % styles.length];
}

// Helper to pick font style
function pickFontStyle(idx: number): TemplateConfig['fontStyle'] {
  const fonts: TemplateConfig['fontStyle'][] = ['modern', 'classic', 'mono', 'serif'];
  return fonts[idx % fonts.length];
}

function generateCategory(
  category: string,
  baseName: string,
  colorSets: [string, string, string, string, string, string, string, string, string, string, string][],
  startIdx: number
): TemplateConfig[] {
  return colorSets.map((c, i) => {
    const globalIdx = startIdx + i;
    return {
      id: `${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${i + 1}`,
      name: makeName(baseName, i, category),
      category,
      colors: [c[0], c[1], c[2]],
      bg: c[1],
      headerBg: c[0],
      headerColor: c[2],
      accentColor: c[3],
      accentLight: c[4],
      textColor: c[5],
      subtextColor: c[6],
      dateColor: c[7],
      borderColor: c[8],
      chipBg: c[9],
      chipBorder: c[9] + '33',
      chipText: c[1] === '#ffffff' ? '#ffffff' : c[5],
      sectionTitleColor: c[3],
      layout: pickLayout(globalIdx),
      headerStyle: pickHeaderStyle(globalIdx),
      sectionStyle: pickSectionStyle(globalIdx),
      chipStyle: pickChipStyle(globalIdx),
      itemStyle: pickItemStyle(globalIdx),
      fontStyle: pickFontStyle(globalIdx),
    };
  });
}

// Generate all templates
const allTemplates: TemplateConfig[] = [
  ...generateCategory('Professional', 'Corporate', professionalColors, 0),
  ...generateCategory('Creative', 'Creative', creativeColors, 10),
  ...generateCategory('Modern', 'Modern', modernColors, 20),
  ...generateCategory('Warm', 'Warm', warmColors, 30),
  ...generateCategory('Neutral', 'Neutral', neutralColors, 40),
  ...generateCategory('Dark', 'Dark Mode', darkColors, 50),
  ...generateCategory('Elegant', 'Elegant', elegantColors, 60),
  ...generateCategory('Sidebar', 'Sidebar', sidebarColors, 70),
  ...generateCategory('Professional', 'Executive', professionalColors.map(c => [c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7], c[8], c[3], c[4]] as any), 80),
  ...generateCategory('Modern', 'Minimal', modernColors.map(c => [c[0], c[1], c[2], c[3], c[4], c[5], c[6], c[7], c[8], c[3], c[4]] as any), 90),
];

export const TEMPLATE_CONFIGS: TemplateConfig[] = allTemplates;

export function getTemplateConfig(id: string): TemplateConfig | undefined {
  return allTemplates.find(t => t.id === id);
}

export function getTemplatesByCategory(): Record<string, TemplateConfig[]> {
  const groups: Record<string, TemplateConfig[]> = {};
  for (const t of allTemplates) {
    if (!groups[t.category]) groups[t.category] = [];
    groups[t.category].push(t);
  }
  return groups;
}

export { FONT_MAP };
