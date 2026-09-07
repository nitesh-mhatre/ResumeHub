// Registry for faithful PDF rendering of every hand-crafted built-in template.
import { ResumeData } from '../../types';
import { PaperBox, FontOptions } from './engine';
import { renderStd } from './renderStd';
import { STD_SPECS } from './specsStd';
import { BESPOKE_RENDERERS } from './specsSpecial';

/**
 * Renders a hand-crafted built-in template as static HTML mirroring its RN
 * preview component in ResumePreview.templateMap. Returns null for ids that
 * don't have a faithful renderer here (custom/factory templates).
 */
export function renderBuiltInHTML(
  templateId: string,
  data: ResumeData,
  paper: PaperBox,
  fontOptions?: FontOptions,
): string | null {
  if (STD_SPECS[templateId]) {
    return renderStd(data, paper, fontOptions, STD_SPECS[templateId]);
  }
  const bespoke = BESPOKE_RENDERERS[templateId];
  if (bespoke) {
    return bespoke(data, paper, fontOptions);
  }
  return null;
}
