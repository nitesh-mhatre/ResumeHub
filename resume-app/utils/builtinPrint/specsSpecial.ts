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
    secTitle: secTitle || { fs: 14, w: 700, c: '#1f2937', up: true, borderB: [2, '#1f2937'], pb: 4, mb: 8 },
    item,
    coC,
    extra: { color: extraColor },
  };
}

function sideCss(bodyPx: number): string {
  const d = dynSizes(bodyPx);
  return `
.split{display:flex;gap:16px;align-items:flex-start}
.split .main{flex:2;min-width:0}
.split .side{flex:1;min-width:0}
.side{background:#f3f4f6;border-radius:8px;padding:12px}
.side .sd-title{font-size:11px;font-weight:700;color:#1f2937;text-transform:uppercase;margin-bottom:8px;page-break-after:avoid;break-after:avoid}
.side .sd-item{font-size:11px;color:#475569;margin-bottom:4px}
.side .ed-school{font-size:12px;font-weight:700;color:#1f2937}
.side .ed-degree{font-size:11px;color:#64748b}
.side .ed-block{margin-bottom:12px}
/* swiss / artistic / urban sidebars */
.sbar{border-right:4px solid #dc2626;padding:16px;width:140px;flex:none}
.sbar .nm{font-size:22px;font-weight:800;color:#000;margin-bottom:4px;display:block}
.sbar .sj{font-size:10px;font-weight:700;color:#dc2626;text-transform:uppercase;letter-spacing:1px;margin-bottom:16px;display:block}
.sbar .scon{font-size:10px;color:#000;font-weight:700;margin-bottom:4px;display:block}
.sbar .sd-title{font-size:12px;font-weight:800;color:#000;text-transform:uppercase;margin-bottom:8px;page-break-after:avoid;break-after:avoid}
.sbar .sd-item{font-size:10px;color:#000;margin-bottom:4px;display:block}
.sbar .ed-school{font-size:11px;font-weight:700;color:#000;display:block}
.sbar .ed-degree{font-size:10px;color:#475569;display:block}
.sbar .ed-block{margin-bottom:12px}
.main-col{flex:1;padding:16px;min-width:0}
.swiss-item{display:flex;gap:12px;margin-bottom:16px;page-break-inside:avoid;break-inside:avoid}
.swiss-item .dates{width:60px;flex:none;font-size:10px;font-weight:700;color:#000}
.swiss-item .content{flex:1;min-width:0}
.swiss-item .sjob{font-size:14px;font-weight:800;color:#000}
.swiss-item .scomp{font-size:12px;font-weight:700;color:#475569;margin:2px 0 4px}
.art-side{background:#f97316;padding:16px;width:130px;flex:none;color:#fff}
.art-side .nm{font-size:20px;font-weight:900;color:#fff;margin-bottom:4px;display:block}
.art-side .sj{font-size:10px;font-weight:700;color:#fed7aa;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;display:block}
.art-side .sd-title{font-size:11px;font-weight:800;color:#fff;text-transform:uppercase;letter-spacing:1px;margin:16px 0 6px;display:block}
.art-side .sd-title:first-of-type{margin-top:0}
.art-side .sd-item{font-size:10px;color:#fff7ed;margin-bottom:4px;display:block}
.art-item{display:flex;gap:8px;margin-bottom:14px;page-break-inside:avoid;break-inside:avoid}
.art-item .adot{width:8px;height:8px;border-radius:4px;background:#f97316;margin-top:5px;flex:none}
.art-item .acontent{flex:1;min-width:0}
.art-title{font-size:13px;font-weight:700;color:#1c1917}
.art-company{font-size:11px;color:#f97316;font-weight:600;margin-bottom:3px}
.urban-side{background:#1f2937;padding:16px;width:140px;flex:none}
.urban-side .av{width:50px;height:50px;border-radius:25px;background:#facc15;display:flex;align-items:center;justify-content:center;color:#1f2937;font-size:18px;font-weight:900;margin-bottom:10px}
.urban-side .nm{font-size:16px;font-weight:800;color:#fff;margin-bottom:2px;display:block}
.urban-side .sj{font-size:9px;font-weight:700;color:#facc15;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;display:block}
.urban-side .sd-title{font-size:10px;font-weight:800;color:#facc15;text-transform:uppercase;letter-spacing:1px;margin:16px 0 6px;display:block}
.urban-side .sd-item{font-size:9px;color:#d1d5db;margin-bottom:4px;display:block}
.urban-item{border-left:3px solid #facc15;padding-left:10px;margin-bottom:12px;page-break-inside:avoid;break-inside:avoid}
.urb-title{font-size:13px;font-weight:700;color:#1f2937}
.urb-company{font-size:12px;color:#facc15;font-weight:600;margin-bottom:3px}
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
    expHtml += `<div class="swiss-item"><div class="dates"><div>${escapeHTML(exp.startDate)}</div><div>- ${exp.current ? 'Present' : escapeHTML(exp.endDate)}</div></div><div class="content"><div class="sjob">${escapeHTML(exp.title)}</div><div class="scomp">${escapeHTML(exp.company)}</div><div class="bd">${nl2br(plain(exp.description))}</div></div></div>`;
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
    if (v) contactLines += `<div>const ${k} = &quot;${escapeHTML(v)}&quot;</div>`;
  }
  const css = `
.hd{border-bottom:1px solid #334155;padding-bottom:16px;margin-bottom:16px;page-break-after:avoid;break-after:avoid}
.hd .nm{font-size:22px;font-weight:800;color:#4ade80;letter-spacing:-0.5px;display:block}
.hd .jt{font-size:12px;font-weight:700;color:#64748b;margin-top:4px;margin-bottom:12px;display:block}
.hd .ctc{display:flex;flex-direction:column;gap:2px;font-size:11px;color:#64748b;white-space:nowrap}
.dsec{margin-bottom:16px}
.dcode{font-size:13px;font-weight:700;color:#c084fc;margin-bottom:8px;page-break-after:avoid;break-after:avoid}
.dcodeblue{font-size:13px;font-weight:700;color:#60a5fa;margin-bottom:8px;page-break-after:avoid;break-after:avoid}
.dbody{font-size:${d.bodyText.fs}px;line-height:${d.bodyText.lh}px;color:#94a3b8;white-space:pre-line}
.ditem{padding-left:12px;border-left:1px solid #334155;margin-bottom:12px;page-break-inside:avoid;break-inside:avoid}
.dtitle{font-size:13px;font-weight:700;color:#fde68a}
.ddate{font-size:11px;color:#64748b;margin-top:2px}
.ddesc{font-size:12px;line-height:18px;color:#94a3b8;white-space:pre-line;margin-top:2px}
.dskill{display:inline-block;background:#1e293b;border:1px solid #334155;border-radius:4px;padding:4px 8px;font-size:10px;font-weight:600;color:#4ade80;margin:0 6px 6px 0}
.dschool{font-size:13px;font-weight:700;color:#fde68a;display:block;margin-bottom:2px}
.xt{font-size:${d.secTitle.fs}px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#a78bfa;margin-bottom:8px;page-break-after:avoid;break-after:avoid}
.it{margin-bottom:12px;page-break-inside:avoid;break-inside:avoid}
.ih{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:2px}
.tt{font-size:${d.itemTitle}px;font-weight:700;color:#fde68a;flex:1;min-width:0}
.dt{font-size:${d.itemDate}px;color:#64748b;white-space:nowrap}
.id{font-size:${d.itemDesc.fs}px;line-height:${d.itemDesc.lh}px;color:#94a3b8;white-space:pre-line}
.xcert{border-left:2px solid #a78bfa;padding-left:12px;margin-bottom:12px;page-break-inside:avoid;break-inside:avoid}
.xl{font-size:${d.itemLink}px;color:#64748b}
.xsub{font-size:${d.itemSub}px;color:#64748b;margin-top:2px}
.xdate{font-size:${d.itemDate}px;color:#64748b;white-space:nowrap}
.chipb{display:inline-block;border:1px solid #a78bfa;border-radius:12px;padding:4px 10px;font-size:${d.chipText}px;font-weight:600;color:#a78bfa}
.two{display:flex;gap:16px}.half{flex:1;min-width:0}
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
  // Extra sections mirror ExtraSections with purple accent
  const extra = (data: ResumeData) => {
    let o = '';
    const sec = (t: string) => { o += `<div class="it-sec" style="margin-bottom:16px"><div class="xt">${escapeHTML(t)}</div>`; };
    const end = () => { o += '</div>'; };
    if (data.projects && data.projects.length) {
      sec('Projects');
      for (const p of data.projects) o += `<div class="it"><div class="ih"><span class="tt">${escapeHTML(p.name)}</span>${p.link ? `<span class="xl">${escapeHTML(p.link)}</span>` : ''}</div><div class="id">${nl2br(plain(p.description))}</div></div>`;
      end();
    }
    if (data.certificates && data.certificates.length) {
      sec('Certificates');
      for (const c of data.certificates) o += `<div class="xcert"><div class="tt">${escapeHTML(c.name)}</div><div class="xsub">${escapeHTML(c.issuer)} • ${escapeHTML(c.date)}</div></div>`;
      end();
    }
    if (data.awards && data.awards.length) {
      sec('Awards');
      for (const a of data.awards) o += `<div class="it"><div class="ih"><span class="tt">${escapeHTML(a.name)}</span><span class="xdate">${escapeHTML(a.date)}</span></div>${a.issuer ? `<div class="xsub">${escapeHTML(a.issuer)}</div>` : ''}<div class="id">${nl2br(plain(a.description))}</div></div>`;
      end();
    }
    const hasLang = !!(data.languages && data.languages.length);
    const hasInt = !!(data.interests && data.interests.length);
    if (hasLang || hasInt) {
      o += `<div class="it-sec" style="margin-bottom:16px"><div class="two">`;
      if (hasLang) o += `<div class="half"><div class="xt">Languages</div><div>${data.languages!.map(l => `<span class="chipb">${escapeHTML(l)}</span>`).join('')}</div></div>`;
      if (hasInt) o += `<div class="half"><div class="xt">Interests</div><div>${data.interests!.map(i => `<span class="chipb">${escapeHTML(i)}</span>`).join('')}</div></div>`;
      o += '</div></div>';
    }
    if (data.customSections && data.customSections.length) {
      for (const cs of data.customSections) {
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
};
