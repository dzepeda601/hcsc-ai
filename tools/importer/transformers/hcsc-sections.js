/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: HCSC section boundaries.
 *
 * Establishes EDS section breaks and Section Metadata blocks from the template's
 * `sections` definition in tools/importer/page-templates.json.
 *
 * Runs in afterTransform only (block parsing has completed; we only add <hr> and
 * Section Metadata tables). Driven entirely by payload.template.sections so it
 * stays template-agnostic.
 *
 * For the homepage template there are 5 sections:
 *   hero, content-block, content-spotlight (light-blue), value-prop-carousel (green), article-list
 * Expected result: 4 <hr> (sections.length - 1) and 2 Section Metadata blocks
 * (content-spotlight -> light-blue, value-prop-carousel -> green).
 *
 * Section selectors are taken verbatim from page-templates.json (which were
 * derived from the captured DOM), e.g.:
 *   #main-content > div.aem-Grid... > div.contentspotlight.styles__background--light-blue-100...
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const template = payload && payload.template;
    const sections = template && Array.isArray(template.sections) ? template.sections : [];
    if (sections.length < 2) return;

    const doc = (payload && payload.document) || element.ownerDocument || document;

    // Process in reverse so earlier insertions do not shift later section elements.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section || !section.selector) continue;

      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue;

      // Section Metadata block for sections that declare a style.
      if (section.style) {
        const metadataBlock = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(metadataBlock);
      }

      // Section break before every section except the first.
      if (i > 0) {
        sectionEl.before(doc.createElement('hr'));
      }
    }
  }
}
