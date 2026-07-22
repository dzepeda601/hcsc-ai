/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-stats. Base: carousel.
 * Source: https://www.hcsc.com/ (#main-content .section .comp-value-prop__carousel-container)
 * Structure (from library-description.txt): 2 columns, multiple rows.
 *   Row 1: block name.
 *   Each slide row: [image cell, text cell (title / description / optional CTA)].
 * This instance: 3 text-only stat slides (no images). Each slide = stat number
 * (as title) + description. The mandatory image cell is left empty so every row
 * keeps a consistent 2-column shape.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Each slide is a splide list item.
  const slides = Array.from(
    element.querySelectorAll('.comp-value-prop__slide, li.splide__slide'),
  );

  slides.forEach((slide) => {
    // Stat number -> title (styled as a heading).
    const statEl = slide.querySelector('.comp-value-prop__stat, [class*="__stat"]');
    // Description text.
    const descEl = slide.querySelector('.comp-value-prop__description, [class*="__description"]');

    const textCell = [];
    if (statEl) {
      // Promote the stat number to a heading so it renders as the slide title.
      const heading = document.createElement('h3');
      heading.textContent = statEl.textContent.trim();
      textCell.push(heading);
    }
    if (descEl) {
      const p = document.createElement('p');
      p.textContent = descEl.textContent.trim();
      textCell.push(p);
    }

    // Only add a slide row if it has content; keep 2-column shape (empty image cell).
    if (textCell.length) cells.push(['', textCell]);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-stats', cells });
  element.replaceWith(block);
}
