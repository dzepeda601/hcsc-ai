/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-spotlight. Base: columns.
 * Source: https://www.hcsc.com/ (#main-content .contentspotlight section.comp-content-spotlight)
 * Structure (from library-description.txt): multiple columns, rows.
 *   Row 1: block name.
 *   Row 2: cells rendered as columns. This instance: [image | heading + CTA].
 * This instance: one feature image side-by-side with an H4 heading + "Learn more" CTA.
 */
export default function parse(element, { document }) {
  // Left column: the feature image.
  const image = element.querySelector(
    '.comp-content-spotlight__image-wrapper img[src], .comp-content-spotlight__image--desktop img[src], img[src]',
  );

  // Right column: heading + CTA.
  const heading = element.querySelector(
    '.comp-content-spotlight__text, .comp-content-spotlight__content-wrapper h1, .comp-content-spotlight__content-wrapper h2, .comp-content-spotlight__content-wrapper h3, .comp-content-spotlight__content-wrapper h4, h1, h2, h3, h4',
  );
  const cta = element.querySelector(
    'a.comp-content-spotlight__cta[href], a.comp-cta[href], .comp-content-spotlight__content-wrapper a[href]',
  );

  // Empty-block guard.
  if (!image && !heading && !cta) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Right (text) column contents.
  const textColumn = [];
  if (heading) textColumn.push(heading);
  if (cta) textColumn.push(cta);

  // Single content row with two columns: image | text.
  const cells = [[image || '', textColumn]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-spotlight', cells });
  element.replaceWith(block);
}
