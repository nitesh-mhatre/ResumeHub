// Standard single-column renderer for hand-crafted templates.
// Mirrors the RN template components in ResumePreview.templateMap.
import { ResumeData } from '../../types';
import {
  PaperBox, FontOptions, StdSpec, F, ContactRowCfg, HeadCfg, SecTitleCfg, ChipCfg,
  bodyPxFrom, dynSizes, cssFontFamily, escapeHTML, nl2br, plain,
  pickContact, contactSpans, wrapDoc, ContactKey, DEFAULT_FONT_SIZE, DEFAULT_FONT_FAMILY,
} from './engine';

function range(start: string, end: string, current?: boolean): string {
  return `${start} – ${current ? 'Present' : end}`;
}

function cssF(f: F | undefined): string {
  if (!f) return '';
  const parts: string[] = [];
  if (f.fs) parts.push(`font-size:${f.fs}px`);
  if (f.w) parts.push(`font-weight:${f.w}`);
  if (f.c) parts.push(`color:${f.c}`);
  if (f.ls !== undefined) parts.push(`letter-spacing:${f.ls}px`);
  if (f.up) parts.push('text-transform:uppercase');
  if (f.mt !== undefined) parts.push(`margin-top:${f.mt}px`);
  if (f.mb !== undefined) parts.push(`margin-bottom:${f.mb}px`);
  if (f.lh) parts.push(`line-height:${f.lh}px`);
  return parts.join(';');
}

// ─── CSS sheet ─────────────────────────────────────────────────────────────
export function stdSheet(spec: StdSpec, bodyPx: number): string {
  const d = dynSizes(bodyPx);
  const h = spec.head;
  const s = spec.secTitle;
  const out: string[] = [];

  // Header wrapper
  let hd = '';
  if (h.band) hd += `background:${h.band};`;
  if (h.bandRadius !== undefined) hd += `border-radius:${h.bandRadius}px;`;
  if (h.bandPad !== undefined) hd += `padding:${h.bandPad}px;`;
  if (h.borderB) hd += `border-bottom:${h.borderB[0]}px ${h.borderB[2] || 'solid'} ${h.borderB[1]};`;
  if (h.padB !== undefined) hd += `padding-bottom:${h.padB}px;`;
  if (h.mgB !== undefined) hd += `margin-bottom:${h.mgB}px;`;
  if (h.alignC) hd += 'text-align:center;';
  out.push(`.hd{${hd}page-break-after:avoid;break-after:avoid}`);

  // Avatar
  if (h.avatar) {
    const a = h.avatar;
    if (a.inline) {
      out.push(`.hd-top{display:flex;align-items:center;margin-bottom:12px}`);
      out.push(`.av{width:${a.size || 44}px;height:${a.size || 44}px;border-radius:${(a.size || 44) / 2}px;background:${a.bg || '#fff'};display:flex;align-items:center;justify-content:center;margin-right:12px;color:${a.color || '#059669'};font-size:${a.fs || 24}px;font-weight:800;flex:none}`);
    } else {
      out.push(`.av{width:${a.size || 60}px;height:${a.size || 60}px;border-radius:${(a.size || 60) / 2}px;background:${a.bg || '#f97316'};display:flex;align-items:center;justify-content:center;margin:0 auto ${h.alignC ? 12 : 0}px;color:${a.color || '#fff'};font-size:${a.fs || 24}px;font-weight:900}`);
    }
  }

  // Name row
  let nrowCss = '';
  if (h.deco === 'accent') nrowCss += 'display:flex;align-items:center;';
  if (h.deco === 'accent') {
    out.push(`.nbar{width:4px;height:30px;background:${h.decoColor || '#111827'};border-radius:2px;margin-right:10px;flex:none}`);
  }
  if (h.deco === 'dot') nrowCss += 'display:flex;align-items:center;margin-bottom:4px;';
  if (h.deco === 'dot') {
    out.push(`.ndot{width:10px;height:10px;border-radius:5px;background:${h.decoColor || '#0891b2'};margin-right:8px;flex:none}`);
  }
  if (nrowCss) out.push(`.nrow{${nrowCss}}`);
  out.push(`.nm{${cssF(h.name)}display:block}`);

  // Compact job badge next to name
  if (h.job.badge) {
    out.push(`.nrow2{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px}`);
    out.push(`.nbt{background:${h.job.badgeBg || '#ea580c'};padding:3px 8px;border-radius:8px;color:${h.job.badgeC || '#fff'};font-size:${h.job.fs || 9}px;font-weight:${h.job.w || 700};font-style:normal}`);
  }

  // Center divider
  if (h.centerDiv) {
    const cd = h.centerDiv;
    out.push(`.ndiv{width:${cd.w || 60}px;height:${cd.h}px;background:${cd.c};margin:${cd.mt !== undefined ? cd.mt : 8}px auto ${cd.mb !== undefined ? cd.mb : 8}px;`);
  }
  // Job title
  if (!h.job.badge) {
    out.push(`.jt{${cssF(h.job)}display:block}`);
  }
  // Contacts
  if (h.contact) {
    const ct = h.contact;
    const ccol = ct.color || ct.c;
    let row = `display:flex;flex-wrap:wrap;`;
    row += ct.alignC ? 'justify-content:center;' : '';
    row += ct.gap !== undefined ? `gap:${ct.gap}px;` : 'gap:8px;';
    if (ct.ml) row += `margin-left:${ct.ml}px;`;
    if (ct.fs) row += `font-size:${ct.fs}px;`;
    if (ccol) row += `color:${ccol};`;
    out.push(`.ct{${row}}`);
    out.push(`.ct span{${ct.fs ? `font-size:${ct.fs}px;` : ''}${ccol ? `color:${ccol};` : ''}}`);
  }
  if (h.contactCode) {
    const cc = h.contactCode;
    out.push(`.ctc{display:flex;flex-direction:column;gap:2px}`);
    out.push(`.ctc div{font-size:${cc.fs || 11}px;color:${cc.color || '#64748b'};white-space:nowrap}`);
  }

  // Section title
  const titleFromDyn = !!spec.secTitleDyn;
  let st = '';
  if (titleFromDyn) {
    st = `font-size:${d.secTitle.fs}px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${spec.secTitleDyn};margin-bottom:${d.secTitle.mb}px;`;
  } else {
    st = cssF({ fs: s.fs, w: s.w, c: s.c, ls: s.ls, up: s.up, mb: s.mb });
    if (s.borderB) {
      st += `border-bottom:${s.borderB[0]}px solid ${s.borderB[1]};`;
      st += s.pb !== undefined ? `padding-bottom:${s.pb}px;` : '';
    }
  }
  out.push(`.st{${st}page-break-after:avoid;break-after:avoid}`);

  // Extra section title = dyn.sectionTitle with the template accent color
  const extraC = spec.extra.color;
  out.push(`.xt{font-size:${d.secTitle.fs}px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:${extraC};margin-bottom:${d.secTitle.mb}px;page-break-after:avoid;break-after:avoid}`);

  // Body / summary / description text
  const bodyC = spec.bodyC || '#475569';
  out.push(`.bd{font-size:${d.bodyText.fs}px;line-height:${d.bodyText.lh}px;color:${bodyC};white-space:pre-line}${spec.mono ? 'font-family:Courier New,monospace;' : ''}`);
  out.push(`.id{font-size:${d.itemDesc.fs}px;line-height:${d.itemDesc.lh}px;color:${bodyC};white-space:pre-line}${spec.mono ? 'font-family:Courier New,monospace;' : ''}`);

  // Section blocks
  out.push(`.sec{margin-bottom:16px;page-break-inside:auto}`);
  // Plain items (education + extra sections)
  out.push(`.it{margin-bottom:12px;page-break-inside:avoid;break-inside:avoid}`);
  out.push(`.ih{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:2px}`);
  out.push(`.tt{font-size:${d.itemTitle}px;font-weight:700;color:#1e293b;flex:1;min-width:0}`);
  out.push(`.dt{font-size:${d.itemDate}px;color:#94a3b8;white-space:nowrap}`);
  out.push(`.dd{font-size:${d.itemDesc.fs}px;line-height:${d.itemDesc.lh}px;color:#475569}`);

  // Experience items (may carry template-specific container decoration)
  let eit = `margin-bottom:12px;page-break-inside:avoid;break-inside:avoid;`;
  if (spec.item?.cont) eit += spec.item.cont;
  out.push(`.eit{${eit}}`);
  out.push(`.eit .ih{${''}}`);
  const tC = spec.item?.titleC;
  const tFs = spec.item?.titleFs;
  const tW = spec.item?.titleW;
  out.push(`.eit .tt{font-size:${tFs || d.itemTitle}px;font-weight:${tW || 700};color:${tC || '#1e293b'};flex:1;min-width:0}`);
  const dC = spec.item?.dateC;
  const dFs = spec.item?.dateFs;
  out.push(`.eit .dt{font-size:${dFs || d.itemDate}px;color:${dC || '#94a3b8'};white-space:nowrap}`);
  const coC = spec.coC || spec.item?.companyC || '#4f46e5';
  const coFs = spec.item?.companyFs;
  out.push(`.co{font-size:${coFs || d.itemCompany}px;color:${coC};margin-bottom:4px;font-weight:600}`);
  out.push(`.eit .id{font-size:${d.itemDesc.fs}px;line-height:${d.itemDesc.lh}px;color:${bodyC};white-space:pre-line}${spec.mono ? 'font-family:Courier New,monospace;' : ''}`);

  // Timeline item style
  out.push(`.tli{position:relative;margin-bottom:16px;padding-left:24px;page-break-inside:avoid;break-inside:avoid}`);
  out.push(`.tli::before{content:'';position:absolute;left:5px;top:20px;bottom:-14px;width:2px;background:#dbeafe}`);
  out.push(`.tldot{position:absolute;left:0;top:4px;width:12px;height:12px;border-radius:6px;background:${spec.secTitle.c || '#2563eb'};}`);
  out.push(`.tl-date{font-size:${d.itemDate}px;font-weight:600;color:${spec.secTitle.c || '#2563eb'};margin-bottom:2px}`);
  out.push(`.tli .tt{font-size:${spec.item?.titleFs || 14}px;font-weight:${spec.item?.titleW || 700};color:${spec.item?.titleC || spec.secTitle.c || '#1e293b'};display:block;margin-bottom:2px}`);
  out.push(`.tli .co{font-size:${d.itemCompany}px;color:${coC};font-weight:600;margin-bottom:4px}`);

  // Skill chips
  if (spec.chip) {
    const cp = spec.chip;
    let ch: string[] = [];
    if (cp.bg) ch.push(`background:${cp.bg}`);
    if (cp.bdC) ch.push(`border:${cp.bdW || 1}px solid ${cp.bdC}`);
    if (cp.radius !== undefined) ch.push(`border-radius:${cp.radius}px`);
    ch.push(`padding:${cp.padV !== undefined ? cp.padV : 4}px ${cp.padH !== undefined ? cp.padH : 10}px`);
    ch.push(`font-size:${cp.fs || d.chipText}px`);
    ch.push(`font-weight:${cp.bdW ? '600' : '600'}`);
    ch.push(`color:${cp.txtC || '#1e293b'}`);
    out.push(`.chip{display:inline-block;${ch.join(';')}}`);
    out.push(`.chips{display:flex;flex-wrap:wrap;gap:6px}`);
  }
  // Extras chips (bordered, accent-colored — preview dyn.chip with titleColor)
  out.push(`.chipb{display:inline-block;border:1px solid ${extraC};border-radius:12px;padding:4px 10px;font-size:${d.chipText}px;font-weight:600;color:${extraC}}`);
  out.push(`.two{display:flex;gap:16px}.half{flex:1;min-width:0}`);
  out.push(`.xcert{border-left:2px solid ${extraC};padding-left:12px;margin-bottom:12px;page-break-inside:avoid;break-inside:avoid}`);
  out.push(`.xl{font-size:${d.itemLink}px;color:#94a3b8}`);
  out.push(`.xsub{font-size:${d.itemSub}px;color:#94a3b8;margin-top:2px}`);
  out.push(`.xdate{font-size:${d.itemDate}px;color:#94a3b8;white-space:nowrap}`);
  out.push(`.co2{font-size:${d.itemSub}px;color:${spec.coC || coC};font-weight:600;margin:2px 0 4px}`);
  // Academic education extra line
  out.push(`.skl{font-size:12px;color:#111827;font-weight:600}`);
  out.push(`.skl2{font-size:11px;color:#6b7280}`);
  if (spec.extraCss) out.push(spec.extraCss);
  return out.join('\n');
}

// ─── Header markup ─────────────────────────────────────────────────────────
export function stdHeaderHtml(data: ResumeData, spec: StdSpec): string {
  const h = spec.head;
  const pi = data.personalInfo;
  let html = '<header class="hd">';

  // Avatar variants
  if (h.avatar) {
    const a = h.avatar;
    let chars = '';
    if (a.char === 'first') chars = pi.fullName.charAt(0) || '';
    else if (a.char === 'initials') chars = pi.fullName.split(' ').map(n => n.charAt(0)).join('');
    else chars = a.symbol || '✚';
    if (a.inline) {
      html += `<div class="hd-top"><div class="av"><span>${escapeHTML(chars)}</span></div><div style="margin-left:12px">`;
      html += `<div class="nm" style="${a.nameColor ? `color:${a.nameColor};` : ''}">${escapeHTML(pi.fullName)}${h.nameSuffix ? escapeHTML(h.nameSuffix) : ''}</div>`;
      const jobOnly = { ...h.job } as { fs?: number; w?: number; c?: string; ls?: number; up?: boolean; mt?: number; mb?: number; lh?: number };
      const jb = cssF({ ...jobOnly, c: a.nameColor === '#ffffff' ? '#d1fae5' : (jobOnly.c || '#d1fae5') });
      if (pi.jobTitle) html += `<div class="jt" style="${jb}">${escapeHTML(pi.jobTitle)}</div>`;
      html += '</div></div>';
    } else {
      html += `<div class="av"><span>${escapeHTML(chars)}</span></div>`;
      html += `<div class="nm">${escapeHTML(pi.fullName)}${h.nameSuffix ? escapeHTML(h.nameSuffix) : ''}</div>`;
      if (pi.jobTitle) {
        const jb = cssF(h.job);
        html += `<div class="jt" style="${jb}">${escapeHTML(pi.jobTitle)}</div>`;
      }
    }
  } else {
    const deco = h.deco === 'accent' ? `<span class="nbar"></span>` : h.deco === 'dot' ? `<span class="ndot"></span>` : '';
    if (deco || h.job.badge) {
      html += `<div class="${h.job.badge ? 'nrow2' : 'nrow'}">`;
      html += `<div style="display:flex;align-items:center">${deco}<span class="nm">${escapeHTML(pi.fullName)}${h.nameSuffix ? escapeHTML(h.nameSuffix) : ''}</span></div>`;
      if (h.job.badge && pi.jobTitle) html += `<span class="nbt">${escapeHTML(pi.jobTitle)}</span>`;
      html += '</div>';
    } else {
      html += `<div class="nm">${escapeHTML(pi.fullName)}${h.nameSuffix ? escapeHTML(h.nameSuffix) : ''}</div>`;
    }
    if (h.centerDiv) html += '<div class="ndiv"></div>';
    if (!h.job.badge && pi.jobTitle) {
      html += `<div class="jt">${escapeHTML(pi.jobTitle)}</div>`;
    }
  }

  if (h.contact) {
    const ct = h.contact;
    let items = '';
    if (ct.sep) {
      // Single-line contact list joined with a separator (ATS / classic / compact)
      const parts: string[] = [];
      for (const k of ct.keys) {
        const v = pickContact(pi, k);
        if (v) parts.push(escapeHTML(v));
      }
      if (parts.length) items = parts.join(escapeHTML(ct.sep));
    } else {
      for (const k of ct.keys) {
        const v = pickContact(pi, k);
        if (!v) continue;
        const prefix = ct.icons?.[k] ? `${ct.icons[k]} ` : '';
        items += `<span>${escapeHTML(prefix + v)}</span>`;
      }
    }
    if (items) html += `<div class="ct">${items}</div>`;
  }
  if (h.contactCode) {
    const cc = h.contactCode;
    let lines = '';
    for (const k of cc.keys) {
      const v = pickContact(pi, k);
      if (!v) continue;
      const varName = cc.vars?.[k] || k;
      lines += `<div>const ${varName} = &quot;${escapeHTML(v)}&quot;</div>`;
    }
    if (lines) html += `<div class="ctc">${lines}</div>`;
  }
  html += '</header>';
  return html;
}

// ─── Section builders ──────────────────────────────────────────────────────
function expItemsHtml(data: ResumeData, timeline: boolean, coLoc: boolean): string {
  let out = '';
  for (const exp of data.experience) {
    const company = exp.company + (coLoc && exp.location ? `, ${exp.location}` : '');
    if (timeline) {
      out += `<div class="tli"><span class="tldot"></span><div class="tl-date">${escapeHTML(exp.startDate)} – ${exp.current ? 'Present' : escapeHTML(exp.endDate)}</div><div class="tt">${escapeHTML(exp.title)}</div><div class="co">${escapeHTML(company)}</div><div class="id">${nl2br(plain(exp.description))}</div></div>`;
    } else {
      out += `<div class="eit"><div class="ih"><span class="tt">${escapeHTML(exp.title)}</span><span class="dt">${escapeHTML(range(exp.startDate, exp.endDate, exp.current))}</span></div><div class="co">${escapeHTML(company)}</div><div class="id">${nl2br(plain(exp.description))}</div></div>`;
    }
  }
  return out;
}

function eduItemsHtml(data: ResumeData, spec: StdSpec, timeline: boolean): string {
  let out = '';
  const degreeFirst = spec.secs.find(s2 => s2.t === 'edu')?.degreeFirst;
  for (const edu of data.education) {
    if (degreeFirst) {
      if (timeline) {
        out += `<div class="tli"><span class="tldot"></span><div class="tl-date">${escapeHTML(range(edu.startDate, edu.endDate))}</div><div class="tt">${escapeHTML(edu.degree)}</div><div class="skl">${escapeHTML(edu.school)}</div>${edu.location ? `<div class="skl2">${escapeHTML(edu.location)}</div>` : ''}</div>`;
      } else {
        out += `<div class="it"><div class="ih"><span class="tt">${escapeHTML(edu.degree)}</span><span class="dt">${escapeHTML(range(edu.startDate, edu.endDate))}</span></div><div class="skl">${escapeHTML(edu.school)}</div>${edu.location ? `<div class="skl2">${escapeHTML(edu.location)}</div>` : ''}</div>`;
      }
    } else {
      if (timeline) {
        out += `<div class="tli"><span class="tldot"></span><div class="tl-date">${escapeHTML(range(edu.startDate, edu.endDate))}</div><div class="tt">${escapeHTML(edu.school)}</div><div class="id">${escapeHTML(edu.degree)}</div></div>`;
      } else {
        out += `<div class="it"><div class="ih"><span class="tt">${escapeHTML(edu.school)}</span><span class="dt">${escapeHTML(range(edu.startDate, edu.endDate))}</span></div><div class="dd">${escapeHTML(edu.degree)}</div></div>`;
      }
    }
  }
  return out;
}

// ExtraSections — mirrors the shared component, tinted with spec.extra.color
export function stdExtraHtml(data: ResumeData, spec: StdSpec): string {
  let out = '';
  const pushSec = (title: string) => { out += `<div class="sec"><div class="xt">${escapeHTML(title)}</div>`; };
  const closeSec = () => { out += '</div>'; };
  const d = dynSizes(bodyPxFrom(undefined)); // extra titles use same computed sizes as preview default

  if (data.projects && data.projects.length > 0) {
    pushSec('Projects');
    for (const p of data.projects) {
      out += `<div class="it"><div class="ih"><span class="tt">${escapeHTML(p.name)}</span>${p.link ? `<span class="xl">${escapeHTML(p.link)}</span>` : ''}</div><div class="id">${nl2br(plain(p.description))}</div></div>`;
    }
    closeSec();
  }
  if (data.certificates && data.certificates.length > 0) {
    pushSec('Certificates');
    for (const c of data.certificates) {
      out += `<div class="xcert"><div class="tt">${escapeHTML(c.name)}</div><div class="xsub">${escapeHTML(c.issuer)} • ${escapeHTML(c.date)}</div></div>`;
    }
    closeSec();
  }
  if (data.awards && data.awards.length > 0) {
    pushSec('Awards');
    for (const a of data.awards) {
      out += `<div class="it"><div class="ih"><span class="tt">${escapeHTML(a.name)}</span><span class="xdate">${escapeHTML(a.date)}</span></div>${a.issuer ? `<div class="xsub">${escapeHTML(a.issuer)}</div>` : ''}<div class="id">${nl2br(plain(a.description))}</div></div>`;
    }
    closeSec();
  }
  const hasLang = !!(data.languages && data.languages.length > 0);
  const hasInt = !!(data.interests && data.interests.length > 0);
  if (hasLang || hasInt) {
    out += `<div class="sec"><div class="two">`;
    if (hasLang) {
      out += `<div class="half"><div class="xt">Languages</div><div class="chips">${data.languages!.map(l => `<span class="chipb">${escapeHTML(l)}</span>`).join('')}</div></div>`;
    }
    if (hasInt) {
      out += `<div class="half"><div class="xt">Interests</div><div class="chips">${data.interests!.map(i => `<span class="chipb">${escapeHTML(i)}</span>`).join('')}</div></div>`;
    }
    out += '</div></div>';
  }
  if (data.customSections && data.customSections.length > 0) {
    for (const cs of data.customSections) {
      pushSec(cs.title);
      out += `<div class="id">${nl2br(plain(cs.content))}</div>`;
      closeSec();
    }
  }
  return out;
}

export function stdSectionHtml(data: ResumeData, spec: StdSpec, sec: { t: SectionKind; label?: string; timeline?: boolean }): string {
  switch (sec.t) {
    case 'sum': {
      if (!data.summary) return '';
      return `<div class="sec"><div class="st">${escapeHTML(sec.label || '')}</div><div class="bd">${nl2br(plain(data.summary))}</div></div>`;
    }
    case 'exp': {
      return `<div class="sec"><div class="st">${escapeHTML(sec.label || '')}</div>${expItemsHtml(data, !!sec.timeline, !!spec.coLoc)}</div>`;
    }
    case 'edu': {
      return `<div class="sec"><div class="st">${escapeHTML(sec.label || '')}</div>${eduItemsHtml(data, spec, !!sec.timeline)}</div>`;
    }
    case 'eduCert': {
      let out = `<div class="sec"><div class="st">${escapeHTML(sec.label || '')}</div>`;
      out += eduItemsHtml(data, spec, false);
      if (data.certificates && data.certificates.length > 0) {
        for (const c of data.certificates) {
          out += `<div class="it"><div class="tt">${escapeHTML(c.name)}</div><div class="co2">${escapeHTML(c.issuer)} • ${escapeHTML(c.date)}</div></div>`;
        }
      }
      out += '</div>';
      return out;
    }
    case 'skill': {
      if (!(data.skills && data.skills.length > 0)) return '';
      let out = `<div class="sec"><div class="st">${escapeHTML(sec.label || '')}</div>`;
      if (spec.chip) {
        out += `<div class="chips">${data.skills.map(s => `<span class="chip">${escapeHTML(s)}</span>`).join('')}</div>`;
      } else {
        out += `<div class="bd">${escapeHTML(data.skills.join(spec.skillsSep || ', '))}</div>`;
      }
      return out + '</div>';
    }
  }
}

import { SectionKind } from './engine';

export function stdBodyHtml(data: ResumeData, spec: StdSpec): string {
  let out = '';
  for (const sec of spec.secs) {
    out += stdSectionHtml(data, spec, sec);
  }
  // ExtraSections always closes the main flow (some templates omit education/summary instead)
  out += stdExtraHtml(data, spec);
  return out;
}

export function renderStd(
  data: ResumeData,
  paper: PaperBox,
  fontOptions: FontOptions | undefined,
  spec: StdSpec,
): string {
  const bodyPx = bodyPxFrom(fontOptions);
  const css = stdSheet(spec, bodyPx);
  const header = stdHeaderHtml(data, spec);
  const body = stdBodyHtml(data, spec);
  return wrapDoc({
    paper,
    css,
    fontFamily: cssFontFamily(fontOptions?.fontFamily),
    pageBg: spec.pageBg,
    body: header + body,
  });
}
