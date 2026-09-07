// Bespoke faithful renderers for two-column / special hand-crafted templates.
import { ResumeData } from '../../types';
import {
  PaperBox, FontOptions, StdSpec,
  bodyPxFrom, dynSizes, cssFontFamily, escapeHTML, nl2br, plain, wrapDoc,
} from './engine';
import { stdSheet, stdExtraHtml, stdSectionHtml } from './renderStd';

const INDIGO = '#4f46e5';

function dynScale(bodyPx: number) {
  const d = dynSizes(bodyPx);
  return d;
}

function minimalSpec(extraColor: string, secTitle?: StdSpec['secTitle'], item?: StdSpec['item'], coC?: string): StdSpec {
  return {
    pageBg: '#ffffff',
    head: { name: {}, job: {} },
    secs: [],
    secTitle: secTitle || { fs: 15, w: 700, c: '#1f2937', up: true, borderB: [3, '#1f2937'], pb: 5, mb: 10 },
    item,
    coC,
    extra: { color: extraColor },
  };
}

function sideCss(bodyPx: number): string {
  const d = dynSizes(bodyPx);
  return `
.split{display:flex;gap:20px;align-items:flex-start}
.split .main{flex:1.7;min-width:0}
.split .side{flex:1.15;min-width:0}
.side{background:#f3f4f6;border-radius:12px;padding:16px}
.side .sd-title{font-size:12px;font-weight:700;color:#1f2937;text-transform:uppercase;margin-bottom:10px;page-break-after:avoid;break-after:avoid}
.side .sd-item{font-size:11px;color:#475569;margin-bottom:5px}
.side .ed-school{font-size:13px;font-weight:700;color:#1f2937}
.side .ed-degree{font-size:11px;color:#64748b}
.side .ed-block{margin-bottom:14px}
/* swiss / artistic / urban sidebars */
.sbar{border-right:5px solid #dc2626;padding:20px;width:250px;flex:none}
.sbar .nm{font-size:24px;font-weight:800;color:#000;margin-bottom:6px;display:block}
.sbar .sj{font-size:11px;font-weight:700;color:#dc2626;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:20px;display:block}
.sbar .scon{font-size:11px;color:#000;font-weight:700;margin-bottom:5px;display:block}
.sbar .sd-title{font-size:13px;font-weight:800;color:#000;text-transform:uppercase;margin-bottom:10px;page-break-after:avoid;break-after:avoid}
.sbar .sd-item{font-size:11px;color:#000;margin-bottom:5px;display:block}
.sbar .ed-school{font-size:12px;font-weight:700;color:#000;display:block}
.sbar .ed-degree{font-size:11px;color:#475569;display:block}
.sbar .ed-block{margin-bottom:14px}
.main-col{flex:1;padding:20px;min-width:0}
.swiss-item{display:flex;gap:14px;margin-bottom:18px;page-break-inside:avoid;break-inside:avoid;padding:10px;background:#fff;border-radius:8px;border-left:3px solid #fca5a5}
.swiss-item .dates{width:70px;flex:none;font-size:11px;font-weight:700;color:#000}
.swiss-item .item-content{flex:1;min-width:0}
.swiss-item .sjob{font-size:15px;font-weight:800;color:#111827}
.swiss-item .scomp{font-size:13px;font-weight:700;color:#475569;margin:3px 0 5px}
.art-side{background:#f97316;padding:20px;width:265px;flex:none;color:#fff}
.art-side .nm{font-size:22px;font-weight:900;color:#fff;margin-bottom:6px;display:block}
.art-side .sj{font-size:11px;font-weight:700;color:#fed7aa;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;display:block}
.art-side .sd-title{font-size:12px;font-weight:800;color:#fff;text-transform:uppercase;letter-spacing:1.5px;margin:20px 0 8px;display:block}
.art-side .sd-title:first-of-type{margin-top:0}
.art-side .sd-item{font-size:11px;color:#fff7ed;margin-bottom:5px;display:block}
.art-item{display:flex;gap:10px;margin-bottom:16px;page-break-inside:avoid;break-inside:avoid;padding:10px;background:#fff;border-radius:8px;border-left:3px solid #fbbf24}
.art-item .adot{width:10px;height:10px;border-radius:5px;background:#f97316;margin-top:6px;flex:none}
.art-item .acontent{flex:1;min-width:0}
.art-title{font-size:14px;font-weight:700;color:#1c1917}
.art-company{font-size:12px;color:#f97316;font-weight:600;margin-bottom:4px}
.urban-side{background:#1f2937;padding:20px;width:265px;flex:none;border-radius:12px}
.urban-side .av{width:56px;height:56px;border-radius:28px;background:#facc15;display:flex;align-items:center;justify-content:center;color:#1f2937;font-size:20px;font-weight:900;margin-bottom:12px}
.urban-side .nm{font-size:18px;font-weight:800;color:#fff;margin-bottom:3px;display:block}
.urban-side .sj{font-size:10px;font-weight:700;color:#facc15;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:14px;display:block}
.urban-side .sd-title{font-size:11px;font-weight:800;color:#facc15;text-transform:uppercase;letter-spacing:1.5px;margin:20px 0 8px;display:block}
.urban-side .sd-item{font-size:10px;color:#d1d5db;margin-bottom:5px;display:block}
.urban-item{border-left:4px solid #facc15;padding-left:14px;margin-bottom:14px;page-break-inside:avoid;break-inside:avoid;padding:10px;background:#fff;border-radius:8px}
.urb-title{font-size:14px;font-weight:700;color:#1f2937}
.urb-company{font-size:13px;color:#facc15;font-weight:600;margin-bottom:4px}
`;
}

function rowHeaderHtml(parts: string[], inline: string, className?: string): string {
  return `<div class="${className || ''}" style="${inline}">${parts.join('')}</div>`;
}

// ─── Corporate ─────────────────────────────────────────────────────────────
function renderCorporate(data: ResumeData, paper: PaperBox, font: FontOptions | undefined): string {
  const bodyPx = bodyPxFrom(font);
  const d = dynSizes(bodyPx);
  const pi = data.personalInfo;
  const spec = minimalSpec(INDIGO);
  const css = stdSheet(spec, bodyPx) + '\n' + sideCss(bodyPx) + `
.band{background:#1f2937;padding:20px;border-radius:8px;margin-bottom:20px;page-break-after:avoid;break-after:avoid}
.band .nm{font-size:20px;font-weight:800;color:#fff;text-transform:uppercase;letter-spacing:2px;display:block}
.band .jt{font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;letter-spacing:2px;margin-top:4px;display:block}
.band .ct{display:flex;flex-wrap:wrap;gap:12px;margin-top:12px;font-size:10px;color:#cbd5e1}
`;
  let contact = '';
  for (const k of ['email', 'phone', 'location'] as const) {
    const v = (pi as any)[k];
    if (v) contact += `<span>${escapeHTML(v)}</span>`;
  }
  let expHtml = '';
  for (const exp of data.experience) {
    expHtml += `<div class="eit"><div class="tt">${escapeHTML(exp.title)}</div><div class="co">${escapeHTML(exp.company)} | ${escapeHTML(exp.startDate)} - ${exp.current ? 'Present' : escapeHTML(exp.endDate)}</div><div class="id">${nl2br(plain(exp.description))}</div></div>`;
  }
  const main = `
<div class="sec"><div class="st">Professional Summary</div><div class="bd">${nl2br(plain(data.summary))}</div></div>
<div class="sec"><div class="st">Experience</div>${expHtml}</div>
${stdExtraHtml(data, spec)}`;
  let side = `<div class="sd-title">Skills</div>`;
  for (const s of data.skills) side += `<div class="sd-item">• ${escapeHTML(s)}</div>`;
  side += `<div class="sd-title" style="margin-top:20px">Education</div>`;
  for (const e of data.education) {
    side += `<div class="ed-block"><span class="ed-school">${escapeHTML(e.school)}</span><span class="ed-degree">${escapeHTML(e.degree)}</span></div>`;
  }
  const body = `
<div class="band"><div class="nm">${escapeHTML(pi.fullName)}</div>${pi.jobTitle ? `<div class="jt">${escapeHTML(pi.jobTitle)}</div>` : ''}${contact ? `<div class="ct">${contact}</div>` : ''}</div>
<div class="split"><div class="main">${main}</div><div class="side">${side}</div></div>`;
  return wrapDoc({ paper, css, fontFamily: cssFontFamily(font?.fontFamily), pageBg: '#ffffff', body });
}

// ─── Swiss ────────────────────────────────────────────────────────────────
function renderSwiss(data: ResumeData, paper: PaperBox, font: FontOptions | undefined): string {
  const bodyPx = bodyPxFrom(font);
  const pi = data.personalInfo;
  const spec = minimalSpec('#dc2626', { fs: 12, w: 800, c: '#000000', up: true, mb: 12 }, undefined, '#dc2626');
  const css = stdSheet(spec, bodyPx) + '\n' + sideCss(bodyPx);
  let contacts = '';
  for (const k of ['email', 'phone', 'location'] as const) {
    const v = (pi as any)[k];
    if (v) contacts += `<span class="scon">${escapeHTML(v)}</span>`;
  }
  let expHtml = '';
  for (const exp of data.experience) {
    expHtml += `<div class="swiss-item"><div class="dates"><div>${escapeHTML(exp.startDate)}</div><div>- ${exp.current ? 'Present' : escapeHTML(exp.endDate)}</div></div><div class="item-content"><div class="sjob">${escapeHTML(exp.title)}</div><div class="scomp">${escapeHTML(exp.company)}</div><div class="bd">${nl2br(plain(exp.description))}</div></div></div>`;
  }
  const main = `${data.summary ? `<div class="bd" style="margin-bottom:16px">${nl2br(plain(data.summary))}</div>` : ''}
<div class="sec"><div class="st">Experience</div>${expHtml}</div>
${stdExtraHtml(data, spec)}`;
  let side = contacts;
  side += `<div class="sd-title">Skills</div>`;
  for (const s of data.skills) side += `<span class="sd-item">${escapeHTML(s)}</span>`;
  side += `<div class="sd-title" style="margin-top:16px">Education</div>`;
  for (const e of data.education) {
    side += `<div class="ed-block"><span class="ed-school">${escapeHTML(e.school)}</span><span class="ed-degree">${escapeHTML(e.degree)}</span></div>`;
  }
  const body = `
<div style="display:flex;align-items:stretch">
<div class="sbar"><span class="nm">${escapeHTML(pi.fullName)}</span>${pi.jobTitle ? `<span class="sj">${escapeHTML(pi.jobTitle)}</span>` : ''}${side}</div>
<div class="main-col">${main}</div>
</div>`;
  return wrapDoc({ paper, css, fontFamily: cssFontFamily(font?.fontFamily), pageBg: '#ffffff', body });
}

// ─── Artistic ──────────────────────────────────────────────────────────────
function renderArtistic(data: ResumeData, paper: PaperBox, font: FontOptions | undefined): string {
  const bodyPx = bodyPxFrom(font);
  const pi = data.personalInfo;
  const spec = minimalSpec('#f97316', { fs: 14, w: 800, c: '#f97316', up: true, mb: 10 }, undefined, '#f97316');
  const css = stdSheet(spec, bodyPx) + '\n' + sideCss(bodyPx);
  let expHtml = '';
  for (const exp of data.experience) {
    expHtml += `<div class="art-item"><span class="adot"></span><div class="acontent"><div class="art-title">${escapeHTML(exp.title)}</div><div class="art-company">${escapeHTML(exp.company)} • ${escapeHTML(exp.startDate)} – ${exp.current ? 'Present' : escapeHTML(exp.endDate)}</div><div class="id">${nl2br(plain(exp.description))}</div></div></div>`;
  }
  let eduHtml = '';
  for (const e of data.education) {
    eduHtml += `<div class="art-item"><span class="adot"></span><div class="acontent"><div class="art-title">${escapeHTML(e.school)}</div><div class="art-company">${escapeHTML(e.degree)} • ${escapeHTML(e.startDate)} – ${escapeHTML(e.endDate)}</div></div></div>`;
  }
  const main = `${data.summary ? `<div class="sec"><div class="st">About Me</div><div class="bd">${nl2br(plain(data.summary))}</div></div>` : ''}
<div class="sec"><div class="st">Experience</div>${expHtml}</div>
<div class="sec"><div class="st">Education</div>${eduHtml}</div>
${stdExtraHtml(data, spec)}`;
  let side = `<span class="nm">${escapeHTML(pi.fullName)}</span>${pi.jobTitle ? `<span class="sj">${escapeHTML(pi.jobTitle)}</span>` : ''}`;
  side += `<span class="sd-title">Contact</span>`;
  for (const k of ['email', 'phone', 'location'] as const) {
    const v = (pi as any)[k];
    if (v) side += `<span class="sd-item">${escapeHTML(v)}</span>`;
  }
  side += `<span class="sd-title">Skills</span>`;
  for (const s of data.skills) side += `<span class="sd-item">▹ ${escapeHTML(s)}</span>`;
  if (data.languages && data.languages.length) {
    side += `<span class="sd-title">Languages</span>`;
    for (const l of data.languages) side += `<span class="sd-item">${escapeHTML(l)}</span>`;
  }
  const body = `
<div style="display:flex;align-items:stretch">
<div class="art-side">${side}</div>
<div class="main-col">${main}</div>
</div>`;
  return wrapDoc({ paper, css, fontFamily: cssFontFamily(font?.fontFamily), pageBg: '#ffffff', body });
}

// ─── Urban ─────────────────────────────────────────────────────────────────
function renderUrban(data: ResumeData, paper: PaperBox, font: FontOptions | undefined): string {
  const bodyPx = bodyPxFrom(font);
  const pi = data.personalInfo;
  const initials = pi.fullName.split(' ').map(n => n.charAt(0)).join('');
  const spec = minimalSpec('#facc15', { fs: 13, w: 800, c: '#1f2937', up: true, ls: 1.5, mb: 10 }, undefined, '#facc15');
  const css = stdSheet(spec, bodyPx) + '\n' + sideCss(bodyPx);
  let expHtml = '';
  for (const exp of data.experience) {
    expHtml += `<div class="urban-item"><div class="ih"><span class="urb-title">${escapeHTML(exp.title)}</span><span class="dt">${escapeHTML(exp.startDate)} – ${exp.current ? 'Present' : escapeHTML(exp.endDate)}</span></div><div class="urb-company">${escapeHTML(exp.company)}</div><div class="id">${nl2br(plain(exp.description))}</div></div>`;
  }
  let eduHtml = '';
  for (const e of data.education) {
    eduHtml += `<div class="it"><div class="ih"><span class="urb-title">${escapeHTML(e.school)}</span><span class="dt">${escapeHTML(e.startDate)} – ${escapeHTML(e.endDate)}</span></div><div class="dd">${escapeHTML(e.degree)}</div></div>`;
  }
  const main = `${data.summary ? `<div class="sec"><div class="st">PROFILE</div><div class="bd">${nl2br(plain(data.summary))}</div></div>` : ''}
<div class="sec"><div class="st">EXPERIENCE</div>${expHtml}</div>
<div class="sec"><div class="st">EDUCATION</div>${eduHtml}</div>
${stdExtraHtml(data, spec)}`;
  let side = `<div class="av"><span>${escapeHTML(initials)}</span></div><span class="nm">${escapeHTML(pi.fullName)}</span>${pi.jobTitle ? `<span class="sj">${escapeHTML(pi.jobTitle)}</span>` : ''}`;
  side += `<span class="sd-title">Contact</span>`;
  for (const k of ['email', 'phone', 'location'] as const) {
    const v = (pi as any)[k];
    if (v) side += `<span class="sd-item">${escapeHTML(v)}</span>`;
  }
  side += `<span class="sd-title">Skills</span>`;
  for (const s of data.skills) side += `<span class="sd-item">• ${escapeHTML(s)}</span>`;
  if (data.languages && data.languages.length) {
    side += `<span class="sd-title">Languages</span>`;
    for (const l of data.languages) side += `<span class="sd-item">${escapeHTML(l)}</span>`;
  }
  const body = `
<div style="display:flex;align-items:stretch">
<div class="urban-side">${side}</div>
<div class="main-col">${main}</div>
</div>`;
  return wrapDoc({ paper, css, fontFamily: cssFontFamily(font?.fontFamily), pageBg: '#ffffff', body });
}

// ─── Tech Dark (code terminal style) ───────────────────────────────────────
function renderTechDark(data: ResumeData, paper: PaperBox, font: FontOptions | undefined): string {
  const bodyPx = bodyPxFrom(font);
  const d = dynSizes(bodyPx);
  const pi = data.personalInfo;
  let contactLines = '';
  for (const k of ['email', 'phone', 'location'] as const) {
    const v = (pi as any)[k];
    if (v) contactLines += `<div style="padding:2px 0">const ${k} = &quot;${escapeHTML(v)}&quot;</div>`;
  }
  const css = `
.hd{border-bottom:2px solid #334155;padding-bottom:20px;margin-bottom:20px;page-break-after:avoid;break-after:avoid}
.hd .nm{font-size:24px;font-weight:800;color:#4ade80;letter-spacing:-0.5px;display:block;text-shadow:0 0 20px rgba(74,222,128,0.3)}
.hd .jt{font-size:13px;font-weight:700;color:#94a3b8;margin-top:6px;margin-bottom:14px;display:block}
.hd .ctc{display:flex;flex-direction:column;gap:3px;font-size:11px;color:#64748b;white-space:nowrap;font-family:'Courier New',monospace}
.dsec{margin-bottom:18px}
.dcode{font-size:14px;font-weight:800;color:#c084fc;margin-bottom:10px;page-break-after:avoid;break-after:avoid;letter-spacing:-0.3px}
.dcodeblue{font-size:14px;font-weight:800;color:#60a5fa;margin-bottom:10px;page-break-after:avoid;break-after:avoid;letter-spacing:-0.3px}
.dbody{font-size:${d.bodyText.fs}px;line-height:${d.bodyText.lh}px;color:#94a3b8;white-space:pre-line;padding-left:16px;border-left:2px solid #334155}
.ditem{padding:12px;background:#1e293b;border-radius:6px;margin-bottom:14px;border-left:3px solid #4ade80;page-break-inside:avoid;break-inside:avoid}
.dtitle{font-size:14px;font-weight:700;color:#fde68a}
.ddate{font-size:12px;color:#64748b;margin-top:3px;font-family:'Courier New',monospace}
.ddesc{font-size:13px;line-height:19px;color:#94a3b8;white-space:pre-line;margin-top:4px}
.dskill{display:inline-block;background:#1e293b;border:1px solid #4ade80;border-radius:6px;padding:5px 10px;font-size:11px;font-weight:600;color:#4ade80;margin:0 8px 8px 0;text-shadow:0 0 10px rgba(74,222,128,0.2)}
.dschool{font-size:14px;font-weight:700;color:#fde68a;display:block;margin-bottom:3px}
.xt{font-size:${d.secTitle.fs}px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:#a78bfa;margin-bottom:10px;page-break-after:avoid;break-after:avoid;padding-bottom:4px;border-bottom:2px solid #4c1d95}
.it{margin-bottom:14px;page-break-inside:avoid;break-inside:avoid}
.ih{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:3px}
.tt{font-size:${d.itemTitle}px;font-weight:700;color:#fde68a;flex:1;min-width:0}
.dt{font-size:${d.itemDate}px;color:#64748b;white-space:nowrap;font-family:'Courier New',monospace}
.id{font-size:${d.itemDesc.fs}px;line-height:${d.itemDesc.lh}px;color:#94a3b8;white-space:pre-line}
.xcert{border-left:3px solid #a78bfa;padding-left:14px;margin-bottom:14px;page-break-inside:avoid;break-inside:avoid;padding:10px;background:#1e293b;border-radius:6px}
.xl{font-size:${d.itemLink}px;color:#64748b;font-family:'Courier New',monospace}
.xsub{font-size:${d.itemSub}px;color:#64748b;margin-top:3px}
.xdate{font-size:${d.itemDate}px;color:#64748b;white-space:nowrap;font-family:'Courier New',monospace}
.chipb{display:inline-block;border:1px solid #a78bfa;background:#1e293b;border-radius:14px;padding:5px 12px;font-size:${d.chipText}px;font-weight:600;color:#a78bfa;margin:0 8px 8px 0}  .two{display:flex;gap:20px}.half{flex:1;min-width:0;padding:12px;background:#1e293b;border-radius:8px}
strong{color:#fde68a;font-weight:800;}
`;
  let body = '';
  if (data.summary) {
    body += `<div class="dsec"><div class="dcode">class Profile {</div><div class="dbody">  /* ${escapeHTML(plain(data.summary))} */</div><div class="dcode" style="margin-top:4px">}</div></div>`;
  }
  body += `<div class="dsec"><div class="dcode">function getExperience() {</div>`;
  for (const exp of data.experience) {
    body += `<div class="ditem"><div class="dtitle">${escapeHTML(exp.title)} <span style="color:#64748b">@ ${escapeHTML(exp.company)}</span></div><div class="ddate">// ${escapeHTML(exp.startDate)} to ${exp.current ? 'NOW' : escapeHTML(exp.endDate)}</div><div class="ddesc">${nl2br(plain(exp.description))}</div></div>`;
  }
  body += `<div class="dcode" style="margin-top:4px">}</div></div>`;
  body += `<div class="dsec"><div class="dcodeblue">['Skills']</div><div>${data.skills.map(s => `<span class="dskill">${escapeHTML(s)}</span>`).join('')}</div></div>`;
  body += `<div class="dsec"><div class="dcodeblue">['Education']</div>`;
  for (const e of data.education) {
    body += `<div class="ditem"><span class="dschool">${escapeHTML(e.school)}</span><div class="ddesc">${escapeHTML(e.degree)}</div></div>`;
  }
  body += '</div>';
  const extra = (d: ResumeData) => {
    let o = '';
    const sec = (t: string) => { o += `<div class="it-sec" style="margin-bottom:16px"><div class="xt">${escapeHTML(t)}</div>`; };
    const end = () => { o += '</div>'; };
    if (d.projects && d.projects.length) {
      sec('Projects');
      for (const p of d.projects) o += `<div class="it"><div class="ih"><span class="tt">${escapeHTML(p.name)}</span>${p.link ? `<span class="xl">${escapeHTML(p.link)}</span>` : ''}</div><div class="id">${nl2br(plain(p.description))}</div></div>`;
      end();
    }
    if (d.certificates && d.certificates.length) {
      sec('Certificates');
      for (const c of d.certificates) o += `<div class="xcert"><div class="tt">${escapeHTML(c.name)}</div><div class="xsub">${escapeHTML(c.issuer)} • ${escapeHTML(c.date)}</div></div>`;
      end();
    }
    if (d.awards && d.awards.length) {
      sec('Awards');
      for (const a of d.awards) o += `<div class="it"><div class="ih"><span class="tt">${escapeHTML(a.name)}</span><span class="xdate">${escapeHTML(a.date)}</span></div>${a.issuer ? `<div class="xsub">${escapeHTML(a.issuer)}</div>` : ''}<div class="id">${nl2br(plain(a.description))}</div></div>`;
      end();
    }
    const hasLang = !!(d.languages && d.languages.length);
    const hasInt = !!(d.interests && d.interests.length);
    if (hasLang || hasInt) {
      o += `<div class="it-sec" style="margin-bottom:16px"><div class="two">`;
      if (hasLang) o += `<div class="half"><div class="xt">Languages</div><div>${d.languages!.map(l => `<span class="chipb">${escapeHTML(l)}</span>`).join('')}</div></div>`;
      if (hasInt) o += `<div class="half"><div class="xt">Interests</div><div>${d.interests!.map(i => `<span class="chipb">${escapeHTML(i)}</span>`).join('')}</div></div>`;
      o += '</div></div>';
    }
    if (d.customSections && d.customSections.length) {
      for (const cs of d.customSections) {
        sec(cs.title);
        o += `<div class="id">${nl2br(plain(cs.content))}</div>`;
        end();
      }
    }
    return o;
  };
  body += extra(data);
  const htmlBody = `<header class="hd"><div class="nm">&gt; ${escapeHTML(pi.fullName)}</div><div class="jt">// ${escapeHTML(pi.jobTitle)}</div>${contactLines ? `<div class="ctc">${contactLines}</div>` : ''}</header>${body}`;
  return wrapDoc({ paper, css, fontFamily: cssFontFamily(font?.fontFamily), pageBg: '#0f172a', body: htmlBody });
}

export const BESPOKE_RENDERERS: Record<string, (data: ResumeData, paper: PaperBox, font: FontOptions | undefined) => string> = {
  corporate: renderCorporate,
  swiss: renderSwiss,
  artistic: renderArtistic,
  urban: renderUrban,
  'tech-dark': renderTechDark,
  'double-column': renderDoubleColumn,
  'single-column': renderSingleColumn,
};

// ─── Double Column Template (two-column layout) ─────────────────────────────
function renderDoubleColumn(data: ResumeData, paper: PaperBox, font: FontOptions | undefined): string {
  const bodyPx = bodyPxFrom(font);
  const d = dynSizes(bodyPx);
  const pi = data.personalInfo;
  const ff = cssFontFamily(font?.fontFamily);
  
  const css = `
.dc-container{display:flex;gap:0;align-items:stretch;width:100%;overflow:hidden;min-width:0}
.dc-left{min-width:230px;max-width:320px;width:max-content;max-width:320px;background:#1f2937;padding:16px;color:#fff;flex-shrink:0}
.dc-right{flex:1;padding:16px;min-width:0}
.dc-header{padding-bottom:12px;margin-bottom:12px;border-bottom:2px solid #334155;word-wrap:break-word;overflow-wrap:break-word}
.dc-name{font-size:16px;font-weight:800;color:#fff;display:block;word-wrap:break-word;overflow-wrap:break-word;white-space:normal;line-height:1.3;max-width:100%;word-break:break-all}
.dc-job{font-size:9px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:1px;margin-top:2px;display:block;word-wrap:break-word;overflow-wrap:break-word;max-width:100%;word-break:break-all}
.dc-contact{display:flex;flex-direction:column;gap:2px;margin-top:8px;max-width:100%;overflow-wrap:break-word;word-break:break-all;line-height:1.3}
.dc-contact span{font-size:9px;color:#d1d5db;display:block;word-wrap:break-word;overflow-wrap:break-word;white-space:normal;line-height:1.3;max-width:100%;word-break:break-all}
.dc-section{margin-bottom:14px}
.dc-sec-title{font-size:11px;font-weight:800;color:#fff;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;display:block}
.dc-school{font-size:12px;font-weight:700;color:#fff;display:block;word-wrap:break-word;overflow-wrap:break-word;word-break:break-all}
.dc-degree{font-size:10px;color:#9ca3af;display:block;word-wrap:break-word;overflow-wrap:break-word;word-break:break-all}
.dc-item{margin-bottom:6px}
.dc-item-title{font-size:13px;font-weight:700;color:#1f2937;display:block;word-wrap:break-word;overflow-wrap:break-word;word-break:break-all}
.dc-item-date{font-size:10px;color:#94a3b8;display:block;margin-top:2px;word-wrap:break-word;overflow-wrap:break-word;word-break:break-all}
.dc-item-company{font-size:11px;color:#374151;font-weight:600;display:block;margin-top:2px;word-wrap:break-word;overflow-wrap:break-word;word-break:break-all}
.dc-item-desc{font-size:11px;color:#475569;line-height:14px;white-space:pre-line;display:block;margin-top:2px;word-wrap:break-word;overflow-wrap:break-word;word-break:break-all;max-width:100%;overflow:hidden}
.dc-left-body{font-size:11px;color:#cbd5e1;line-height:16px;display:block;margin-top:2px;word-wrap:break-word;overflow-wrap:break-word;word-break:break-word;max-width:100%}
.dc-exp-section{margin-bottom:14px}
.dc-exp-title{font-size:13px;font-weight:700;color:#111827;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;display:block}
.dc-extra-sec-title{font-size:${d.secTitle.fs}px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#111827;margin-bottom:8px;display:block}
.dc-chip{display:inline-block;background:#f3f4f6;border-radius:4px;padding:2px 8px;font-size:10px;color:#475569;margin:2px 4px 2px 0}
.dc-skills{display:flex;flex-wrap:wrap;gap:4px}
.dc-divider{width:50px;height:2px;background:#374151;margin:8px auto}
.dc-contact-row{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}
.dc-contact-text{font-size:11px;color:#6b7280}
${sideCss(bodyPx)}
`;

  // Left column content
  let leftHtml = `
    <div class="dc-header">
      <span class="dc-name">${escapeHTML(pi.fullName)}</span>
      ${pi.jobTitle ? `<span class="dc-job">${escapeHTML(pi.jobTitle)}</span>` : ''}
      <div class="dc-contact">
        ${pi.email ? `<span>${escapeHTML(pi.email)}</span>` : ''}
        ${pi.phone ? `<span>${escapeHTML(pi.phone)}</span>` : ''}
        ${pi.location ? `<span>${escapeHTML(pi.location)}</span>` : ''}
      </div>
    </div>
    <div class="dc-section">
      <span class="dc-sec-title">SUMMARY</span>
      <div class="dc-left-body">${nl2br(plain(data.summary))}</div>
    </div>
    <div class="dc-section">
      <span class="dc-sec-title">SKILLS</span>
      <div class="dc-left-body">${data.skills.map(s => escapeHTML(s)).join(' • ')}</div>
    </div>
    <div class="dc-section">
      <span class="dc-sec-title">EDUCATION</span>
      ${data.education.map(edu => `
        <div class="dc-item">
          <span class="dc-school">${escapeHTML(edu.school)}</span>
          <span class="dc-degree">${escapeHTML(edu.degree)} • ${escapeHTML(edu.startDate)} – ${escapeHTML(edu.endDate)}</span>
        </div>
      `).join('')}
    </div>
  `;

  // Right column content
  let rightHtml = `
    <div class="dc-exp-section">
      <span class="dc-exp-title">EXPERIENCE</span>
      ${data.experience.map(exp => `
        <div class="dc-item">
          <span class="dc-item-title">${escapeHTML(exp.title)}</span>
          <span class="dc-item-date">${escapeHTML(exp.startDate)} – ${exp.current ? 'Present' : escapeHTML(exp.endDate)}</span>
          <span class="dc-item-company">${escapeHTML(exp.company)}</span>
          <span class="dc-item-desc">${nl2br(plain(exp.description))}</span>
        </div>
      `).join('')}
    </div>
    ${stdExtraHtml(data, minimalSpec('#111827'))}
  `;

  const body = `
<div class="dc-container">
  <div class="dc-left">${leftHtml}</div>
  <div class="dc-right">${rightHtml}</div>
</div>
  `;

  return wrapDoc({ paper, css, fontFamily: ff, pageBg: '#ffffff', body });
}

// ─── Single Column Template ─────────────────────────────────────────────────
function renderSingleColumn(data: ResumeData, paper: PaperBox, font: FontOptions | undefined): string {
  const bodyPx = bodyPxFrom(font);
  const d = dynSizes(bodyPx);
  const pi = data.personalInfo;
  const ff = cssFontFamily(font?.fontFamily);
  
  const css = `
.sc-container{background:#fff;padding:20px;border-radius:12px}
.sc-header{text-align:center;padding-bottom:12px;margin-bottom:8px}
.sc-name{font-size:26px;font-weight:900;color:#111827;letter-spacing:0.5px;display:block}
.sc-job{font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:2px;margin-top:4px;display:block}
.sc-divider{width:50px;height:2px;background:#374151;margin:8px auto}
.sc-contact-row{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}
.sc-contact{font-size:11px;color:#6b7280;word-wrap:break-word;overflow-wrap:break-word;word-break:break-all;max-width:100%;overflow:hidden}
.sc-section{margin-bottom:14px}
.sc-sec-title{font-size:12px;font-weight:800;color:#1e3a5f;text-transform:uppercase;letter-spacing:2px;margin-bottom:6px;border-bottom:1px solid #d1d5db;padding-bottom:4px;display:block}
.sc-item{margin-bottom:8px}
.sc-item-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:2px}
.sc-item-title{font-size:13px;font-weight:700;color:#111827;flex:1}
.sc-item-date{font-size:10px;color:#94a3b8}
.sc-item-company{font-size:12px;color:#1e3a5f;font-weight:600;margin-top:2px}
.sc-item-desc{font-size:12px;color:#475569;line-height:18px;white-space:pre-line;margin-top:2px;word-wrap:break-word;overflow-wrap:break-word;word-break:break-all;max-width:100%;overflow:hidden}
.sc-skills-text{font-size:12px;color:#475569}
${sideCss(bodyPx)}
`;

  let html = `
<div class="sc-container">
  <div class="sc-header">
    <span class="sc-name">${escapeHTML(pi.fullName)}</span>
    <span class="sc-job">${escapeHTML(pi.jobTitle)}</span>
    <div class="sc-divider"></div>
    <div class="sc-contact-row">
      ${pi.email ? `<span class="sc-contact">${escapeHTML(pi.email)}</span>` : ''}
      ${pi.phone ? `<span class="sc-contact">${escapeHTML(pi.phone)}</span>` : ''}
      ${pi.location ? `<span class="sc-contact">${escapeHTML(pi.location)}</span>` : ''}
    </div>
  </div>
  ${data.summary ? `
    <div class="sc-section">
      <span class="sc-sec-title">PROFILE</span>
      <div class="sc-item-desc">${nl2br(plain(data.summary))}</div>
    </div>
  ` : ''}
  <div class="sc-section">
    <span class="sc-sec-title">EXPERIENCE</span>
    ${data.experience.map(exp => `
      <div class="sc-item">
        <div class="sc-item-header">
          <span class="sc-item-title">${escapeHTML(exp.title)}</span>
          <span class="sc-item-date">${escapeHTML(exp.startDate)} – ${exp.current ? 'Present' : escapeHTML(exp.endDate)}</span>
        </div>
        <div class="sc-item-company">${escapeHTML(exp.company)}</div>
        <div class="sc-item-desc">${nl2br(plain(exp.description))}</div>
      </div>
    `).join('')}
  </div>
  <div class="sc-section">
    <span class="sc-sec-title">EDUCATION</span>
    ${data.education.map(edu => `
      <div class="sc-item">
        <div class="sc-item-header">
          <span class="sc-item-title">${escapeHTML(edu.school)}</span>
          <span class="sc-item-date">${escapeHTML(edu.startDate)} – ${escapeHTML(edu.endDate)}</span>
        </div>
        <div class="sc-item-desc">${escapeHTML(edu.degree)}</div>
      </div>
    `).join('')}
  </div>
  <div class="sc-section">
    <span class="sc-sec-title">SKILLS</span>
    <div class="sc-skills-text">${data.skills.join('  •  ')}</div>
  </div>
  ${stdExtraHtml(data, minimalSpec('#374151'))}
</div>
  `;

  return wrapDoc({ paper, css, fontFamily: ff, pageBg: '#ffffff', body: html });
}
