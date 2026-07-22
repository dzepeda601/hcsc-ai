/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-news. Base: cards.
 * Source: https://www.hcsc.com/ (#main-content .articlelist .comp-article-list__articles-container)
 * Structure (from library-description.txt): 2 columns, multiple rows.
 *   Row 1: block name.
 *   Each card row: [image cell, text cell (title / description / optional CTA)].
 * This instance: 5 news article cards. Each card = thumbnail image + text cell
 * (category, date, linked H3 title). The whole source item is an anchor to the
 * article; we preserve that link by wrapping the title text in a link (title as
 * the card's clickable CTA), and keep the category + date as supporting text.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Each card is a list item.
  const items = Array.from(
    element.querySelectorAll(':scope > ul > li, li'),
  );

  items.forEach((li) => {
    const anchor = li.querySelector('a.comp-article-list__item-container[href], a[href]');
    const href = anchor ? anchor.getAttribute('href') : null;

    // Thumbnail image.
    const img = li.querySelector('.comp-article-list__item-image img[src], img[src]');

    // Metadata: category + date.
    const category = li.querySelector('.comp-article-list__item-category, [class*="item-category"]');
    const date = li.querySelector('.comp-article-list__item-date, [class*="item-date"]:not([class*="date-container"])');

    // Title heading (strip trailing decorative icon markup, keep text).
    const h3 = li.querySelector('.comp-article-list__item-description h3, h3');

    const textCell = [];
    if (category) {
      const p = document.createElement('p');
      p.textContent = category.textContent.trim();
      textCell.push(p);
    }
    if (date) {
      const p = document.createElement('p');
      p.textContent = date.textContent.trim();
      textCell.push(p);
    }
    if (h3) {
      const heading = document.createElement('h3');
      const titleText = h3.textContent.replace(/\s+/g, ' ').trim();
      if (href) {
        // Preserve the whole-card link by making the title a link.
        const a = document.createElement('a');
        a.setAttribute('href', href);
        a.textContent = titleText;
        heading.appendChild(a);
      } else {
        heading.textContent = titleText;
      }
      textCell.push(heading);
    }

    // Only add a card row if it has an image (mandatory) or some content.
    if (img || textCell.length) {
      cells.push([img || '', textCell]);
    }
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-news', cells });
  element.replaceWith(block);
}
