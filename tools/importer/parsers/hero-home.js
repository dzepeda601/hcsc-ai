/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-home. Base: hero.
 * Source: https://www.hcsc.com/ (#main-content .herobanner section.comp-hero-banner)
 * Structure (from library-description.txt): 1 column, 3 rows.
 *   Row 1: block name.
 *   Row 2: background image (optional).
 *   Row 3: title (heading) + subheading + optional CTA.
 * This instance: full-bleed background photo + H1 title + supporting paragraph. No CTA.
 */
export default function parse(element, { document }) {
  // Background image: the hero banner background photo (exclude decorative SVG swoop).
  const bgImage = element.querySelector(
    '.comp-hero-banner__background-img img, .comp-hero-banner__img-container img[src]:not([src^="data:"])',
  );

  // Title: main headline.
  const heading = element.querySelector(
    'h1, .comp-hero-banner__headline, [class*="headline"]',
  );

  // Supporting copy / subheading.
  const description = element.querySelector(
    '.comp-hero-banner__supporting-copy, .comp-hero-banner__content--subcontent p, p',
  );

  // Optional CTA (none expected for this instance, handled defensively).
  const ctaLinks = Array.from(
    element.querySelectorAll(
      '.comp-hero-banner__content a[href], a.comp-cta[href]',
    ),
  );

  // Empty-block guard.
  if (!heading && !description && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background image (optional).
  if (bgImage) cells.push([bgImage]);

  // Row 3: single content cell holding heading + subheading + optional CTA.
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  contentCell.push(...ctaLinks);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-home', cells });
  element.replaceWith(block);
}
