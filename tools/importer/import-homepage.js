/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroHomeParser from './parsers/hero-home.js';
import cardsPurposeParser from './parsers/cards-purpose.js';
import columnsSpotlightParser from './parsers/columns-spotlight.js';
import carouselStatsParser from './parsers/carousel-stats.js';
import cardsNewsParser from './parsers/cards-news.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/hcsc-cleanup.js';
import sectionsTransformer from './transformers/hcsc-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-home': heroHomeParser,
  'cards-purpose': cardsPurposeParser,
  'columns-spotlight': columnsSpotlightParser,
  'carousel-stats': carouselStatsParser,
  'cards-news': cardsNewsParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'HCSC corporate homepage with hero banner, content block, content spotlight, value-prop stats carousel, and news/insights article list',
  urls: ['https://www.hcsc.com/'],
  blocks: [
    {
      name: 'hero-home',
      instances: ['#main-content .herobanner section.comp-hero-banner'],
    },
    {
      name: 'cards-purpose',
      instances: ['#main-content .content-block .comp-content-block__grid-container'],
    },
    {
      name: 'columns-spotlight',
      instances: ['#main-content .contentspotlight section.comp-content-spotlight'],
    },
    {
      name: 'carousel-stats',
      instances: ['#main-content .section .comp-value-prop__carousel-container'],
    },
    {
      name: 'cards-news',
      instances: ['#main-content .articlelist .comp-article-list__articles-container'],
    },
    {
      name: 'section-content-spotlight',
      instances: ['#main-content > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.contentspotlight.styles__background--light-blue-100.aem-GridColumn.aem-GridColumn--default--12'],
      section: 'light-blue',
    },
    {
      name: 'section-value-prop-carousel',
      instances: ['#main-content > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.section.styles__background--green-100.aem-GridColumn.aem-GridColumn--default--12'],
      section: 'green',
    },
  ],
  sections: [
    {
      id: 'rc2',
      name: 'hero',
      selector: '#main-content > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.herobanner.styles__background--light-blue-100.aem-GridColumn.aem-GridColumn--default--12',
      style: null,
      blocks: ['hero-home'],
      defaultContent: [],
    },
    {
      id: 'rc3',
      name: 'content-block',
      selector: '#main-content > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.content-block.aem-GridColumn.aem-GridColumn--default--12',
      style: null,
      blocks: ['cards-purpose'],
      defaultContent: ['#main-content .content-block .comp-content-block__header'],
    },
    {
      id: 'rc4',
      name: 'content-spotlight',
      selector: '#main-content > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.contentspotlight.styles__background--light-blue-100.aem-GridColumn.aem-GridColumn--default--12',
      style: 'light-blue',
      blocks: ['columns-spotlight'],
      defaultContent: [],
    },
    {
      id: 'rc5',
      name: 'value-prop-carousel',
      selector: '#main-content > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.section.styles__background--green-100.aem-GridColumn.aem-GridColumn--default--12',
      style: 'green',
      blocks: ['carousel-stats'],
      defaultContent: ['#main-content .section .comp-value-prop .comp-value-prop__eyebrow'],
    },
    {
      id: 'rc6',
      name: 'article-list',
      selector: '#main-content > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.articlelist.aem-GridColumn.aem-GridColumn--default--12',
      style: null,
      blocks: ['cards-news'],
      defaultContent: [
        '#main-content .articlelist .comp-article-list__eyebrow',
        '#main-content .articlelist .comp-article-list__headline',
        '#main-content .articlelist .comp-article-list__cta-container',
      ],
    },
  ],
};

// TRANSFORMER REGISTRY - cleanup first, sections last (afterTransform)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    // Skip section-* pseudo blocks - handled by the sections transformer
    if (blockDef.name.startsWith('section-')) return;

    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
