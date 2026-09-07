// ─── Shared HTML print engine for hand-crafted built-in templates ─────────
// The on-screen preview renders each hand-crafted template with a dedicated
// RN component in ResumePreview.templateMap (fonts derived from
// data.globalStyles / builder fontOptions). This module mirrors that layout
// system in static HTML so the exported PDF matches the preview 1:1.
//
// A per-template spec drives the CSS (header decorations, section titles,
// items, chips) while the markup skeleton is shared, so every template keeps
// its own colors/casing/layout instead of degrading to one generic document.

import { ResumeData } from '../../types';

export interface PaperBox {
  widthMm: number;
  heightMm: number;
  widthPx: number;
  heightPx: number;
  css: string;
}

export interface FontOptions {
  fontSize?: string;
  fontFamily?: string;
}

export const DEFAULT_FONT_SIZE = '12px';
export const DEFAULT_FONT_FAMILY = 'System';

// CSS font stacks for the RN font-family names offered in the app.
export const FONT_CSS_FALLBACKS: Record<string, string> = {
  'System': '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  'Helvetica': 'Helvetica, Arial, sans-serif',
  'Helvetica Neue': 'Helvetica Neue, Helvetica, Arial, sans-serif',
  'HelveticaNeue': 'Helvetica Neue, Helvetica, Arial, sans-serif',
  'Arial': 'Arial, Helvetica, sans-serif',
  'Georgia': 'Georgia, serif',
  'Times New Roman': 'Times New Roman, Times, serif',
  'TimesNewRomanPSMT': 'Times New Roman, Times, serif',
  'Courier New': 'Courier New, Courier, monospace',
  'CourierNewPSMT': 'Courier New, Courier, monospace',
  'Courier': 'Courier, monospace',
  'Trebuchet MS': 'Trebuchet MS, sans-serif',
  'TrebuchetMS': 'Trebuchet MS, sans-serif',
  'Palatino': 'Palatino Linotype, Palatino, serif',
  'Garamond': 'Garamond, serif',
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

export function cssFontFamily(rawFontFamily?: string): string {
  const raw = rawFontFamily || DEFAULT_FONT_FAMILY;
  return FONT_CSS_FALLBACKS[raw] || raw;
}

export function bodyPxFrom(fontOptions?: FontOptions): number {
  const size = fontOptions?.fontSize || DEFAULT_FONT_SIZE;
  const m = size.match(/^(\d+)(px)?$/);
  return m ? parseInt(m[1], 10) : 12;
}

/** Sizes that scale with the body size like the preview's dyn.* styles. */
export function dynSizes(bodyPx: number) {
  const off = bodyPx - 12;
  return {
    off,
    // dyn.sectionTitle
    secTitle: { fs: 13 + off, w: 700, mb: 8 },
    // dyn.bodyText
    bodyText: { fs: 12 + off, lh: 20 + off },
    // dyn.itemTitle / itemDate / itemLink / itemSub / itemDesc / itemCompany
    itemTitle: 13 + off,
    itemDate: 11 + off,
    itemLink: 10 + off,
    itemSub: 11 + off,
    itemDesc: { fs: 12 + off, lh: 18 + off },
    itemCompany: 12 + off,
    chipText: 10 + off,
    // core section headers that inherit the fixed body-size
    coreTitle: { fs: 13 + off, w: 700, mb: 8 },
  };
}

export function escapeHTML(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function nl2br(str: string): string {
  return escapeHTML(str).replace(/\n/g, '<br/>');
}

/** Removes **markers the way the preview's formatText does. */
/**
 * Converts **bold** markers to <strong> tags so the HTML renderer can
 * highlight specific words inside keypoints/descriptions. The preview JSX
 * already interprets ** identically, so this keeps the PDF faithful to the
 * on-screen text.
 */
export function plain(str: string): string {
  const s = str || '';
  return s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').trim();
}

export function wrapDoc(opts: {
  paper: PaperBox;
  css: string;
  fontFamily: string;
  pageBg: string;
  body: string;
}): string {
  // The resume is a single continuous flow that the PDF engine paginates into
  // ${paper.heightMm}mm sheets. Page 1 stays edge-to-edge (the header starts at the
  // very top edge). box-decoration-break: clone makes the engine re-apply
  // .content's top padding at the start of every later page fragment, giving
  // content that overflows onto page 2+ a clean 12mm top margin instead of
  // starting flush against the top edge.
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
${opts.paper.css}
/* Whole document: zero @page margins; page size is set by the print call */
@page { margin: 0; size: ${opts.paper.widthMm}mm ${opts.paper.heightMm}mm; }
*{margin:0;padding:0;box-sizing:border-box}
*{-webkit-print-color-adjust:exact;print-color-adjust:exact}
html, body { margin: 0; padding: 0; background:${opts.pageBg}; }
body{font-family:${opts.fontFamily};color:#475569;line-height:1.5;}
/* .content flows continuously; the PDF engine cuts it into
   ${opts.paper.heightMm}mm pages. box-decoration-break: clone makes the engine
   re-apply .content's top padding at the start of every page fragment, so
   content that overflows onto page 2+ starts 12mm below the page edge. */
.content{
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  padding-top:12mm;
}
/* Keep page 1 edge-to-edge: pull the header (first child) back over that
   padding so it still begins flush at the very top of the first page. */
.content > :first-child{ margin-top:-12mm; }
strong{font-weight:800;}
${opts.css}
</style>
</head>
<body>
<div class="content">
${opts.body}
</div>
</body>
</html>`;
}

// ─── Contact helper ────────────────────────────────────────────────────────
export type ContactKey = 'email' | 'phone' | 'location' | 'linkedin' | 'website';

export interface ContactRowCfg {
  keys: ContactKey[];
  /** prefix glyphs per key (emoji or symbol) */
  icons?: Partial<Record<ContactKey, string>>;
  /** plain separator used for single-line (pipe) mode */
  sep?: string;
  fs?: number;
  /** text color (shorthand `c` is also accepted) */
  color?: string;
  c?: string;
  gap?: number;
  ml?: number;
  alignC?: boolean;
}

export function pickContact(pi: ResumeData['personalInfo'], key: ContactKey): string {
  const v = pi[key];
  return v ? v.trim() : '';
}

export function contactSpans(pi: ResumeData['personalInfo'], cfg: ContactRowCfg, mode: 'wrap' | 'line'): string {
  let out = '';
  for (const k of cfg.keys) {
    const v = pickContact(pi, k);
    if (!v) continue;
    const prefix = cfg.icons?.[k] ? `${cfg.icons[k]} ` : '';
    if (mode === 'wrap') {
      out += `<span>${escapeHTML(prefix + v)}</span>`;
    } else {
      out += out ? `<span>${escapeHTML(prefix + v)}</span>` : `<span>${escapeHTML(prefix + v)}</span>`;
    }
  }
  return out;
}

// ─── Spec knobs ────────────────────────────────────────────────────────────
export interface F {
  fs?: number;      // font-size px
  w?: number;       // font-weight
  c?: string;       // color
  ls?: number;      // letter-spacing px
  up?: boolean;     // text-transform uppercase
  mt?: number;
  mb?: number;
  lh?: number;      // line-height px
}

export interface ContactCodeCfg {
  keys: ContactKey[];
  fs?: number;
  color?: string;
  /** variable names used for the `const x = "…"` lines */
  vars?: Partial<Record<ContactKey, string>>;
}

export interface HeadCfg {
  /** solid band behind the header (corporate / medical / bold) */
  band?: string;
  bandRadius?: number;
  bandPad?: number;
  alignC?: boolean;
  /** bottom border under the header block: [width, color, style?] */
  borderB?: [number, string, string?];
  padB?: number;
  mgB?: number;
  /** decor inside the name row: 'accent' vertical bar, 'dot' before name, 'plain' */
  deco?: 'accent' | 'dot';
  decoColor?: string;
  /** avatar shown above the name (playful: initial; medical: symbol + inline) */
  avatar?: { char: 'first' | 'initials' | 'symbol'; symbol?: string; size?: number; bg?: string; color?: string; fs?: number; inline?: boolean; nameColor?: string };
  name: F;
  /** literal text appended to the name (e.g. ', Esq.') */
  nameSuffix?: string;
  /** small centered divider under the name (classic) */
  centerDiv?: { w?: number; h: number; c: string; mt?: number; mb?: number };
  job: F & { badge?: boolean; badgeBg?: string; badgeC?: string };
  contact?: ContactRowCfg;
  contactCode?: ContactCodeCfg;
}

export interface SecTitleCfg extends F {
  /** bottom border under the section title: [width, color] */
  borderB?: [number, string];
  pb?: number;
}

export interface ChipCfg {
  bg?: string;
  bdC?: string;
  bdW?: number;
  txtC?: string;
  radius?: number;
  fs?: number;
  padH?: number;
  padV?: number;
  display?: 'inline-block';
}

export interface ItemCfg {
  /** extra declarations for the item container (left border, background, padding…) */
  cont?: string;
  titleC?: string;
  titleFs?: number;
  titleW?: number;
  companyC?: string;
  companyFs?: number;
  dateC?: string;
  dateFs?: number;
}

export type SectionKind = 'sum' | 'exp' | 'edu' | 'eduCert' | 'skill';

export interface BodySec {
  t: SectionKind;
  /** authored label (kept exactly as the preview JSX passes it) */
  label?: string;
  /** render items as a vertical timeline (timeline template) */
  timeline?: boolean;
  /** education: degree on the title row, school as the secondary line */
  degreeFirst?: boolean;
}

export interface ExtraCfg {
  color: string; // ExtraSections titleColor (chips border too)
}

export interface StdSpec {
  pageBg: string;
  /** apply a monospace family to descriptive text (technical) */
  mono?: boolean;
  /** body text color override when the template uses non-gray body color */
  bodyC?: string;
  head: HeadCfg;
  secs: BodySec[];
  secTitle: SecTitleCfg;
  /** core section titles use the shared dyn.sectionTitle style with this color */
  secTitleDyn?: string;
  chip?: ChipCfg;
  /** extra declarations for core experience/education items */
  item?: ItemCfg;
  /** company shown inside a separate styled line color — shorthand */
  coC?: string;
  /** append ', <location>' to experience company lines (ATS) */
  coLoc?: boolean;
  /** separator used when skills render as joined plain text (no chips) */
  skillsSep?: string;
  extra: ExtraCfg;
  /** optional extra CSS appended after generated rules */
  extraCss?: string;
}
