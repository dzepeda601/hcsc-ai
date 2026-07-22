/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-purpose. Base: cards.
 * Source: https://www.hcsc.com/ (#main-content .content-block .comp-content-block__grid-container)
 * Structure (from library-description.txt): 2 columns, multiple rows.
 *   Row 1: block name.
 *   Each card row: [image cell, text cell (title / description / optional CTA)].
 * This instance: 2 cards.
 *
 * Source DOM note: the grid markup is irregular.
 *  - A leading `.comp-content-block__textcta--top` block holds card 1's
 *    description paragraph + primary CTA.
 *  - Each card image lives in a `[class*="image-container"]` wrapper, and that
 *    same wrapper contains the card's title (h4) in a `.comp-text-cta`
 *    (and, for card 2, its CTA).
 * We anchor on each image, resolve its title/CTA from the enclosing
 * image-container, and fold the leading description/CTA into the first card.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Leading description + CTA that belong to the first card.
  const leadTextCta = element.querySelector(
    ':scope > [class*="textcta--top"] .comp-text-cta',
  );
  const leadParagraph = leadTextCta ? leadTextCta.querySelector('.comp-text p, p') : null;
  const leadCta = leadTextCta ? leadTextCta.querySelector('a[href]') : null;

  // Each card is anchored by an image.
  const images = Array.from(
    element.querySelectorAll('.cmp-image img[src], img.cmp-image__image[src]'),
  );

  images.forEach((img, index) => {
    // Resolve the card's title/CTA from the enclosing image-container wrapper.
    const wrapper = img.closest('[class*="image-container"]') || element;
    const textCta = wrapper.querySelector('.comp-text-cta');
    const heading = textCta ? textCta.querySelector('h1, h2, h3, h4, h5, h6') : null;
    const cardCta = textCta ? textCta.querySelector('a[href]') : null;

    const textCell = [];
    if (heading) textCell.push(heading);
    // Fold the leading description + CTA into the first card only.
    if (index === 0) {
      if (leadParagraph) textCell.push(leadParagraph);
      if (leadCta) textCell.push(leadCta);
    }
    if (cardCta) textCell.push(cardCta);

    cells.push([img, textCell]);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-purpose', cells });
  element.replaceWith(block);
}
