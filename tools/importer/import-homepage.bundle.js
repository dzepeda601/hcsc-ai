/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-home.js
  function parse(element, { document: document2 }) {
    const bgImage = element.querySelector(
      '.comp-hero-banner__background-img img, .comp-hero-banner__img-container img[src]:not([src^="data:"])'
    );
    const heading = element.querySelector(
      'h1, .comp-hero-banner__headline, [class*="headline"]'
    );
    const description = element.querySelector(
      ".comp-hero-banner__supporting-copy, .comp-hero-banner__content--subcontent p, p"
    );
    const ctaLinks = Array.from(
      element.querySelectorAll(
        ".comp-hero-banner__content a[href], a.comp-cta[href]"
      )
    );
    if (!heading && !description && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) cells.push([bgImage]);
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    contentCell.push(...ctaLinks);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-home", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-purpose.js
  function parse2(element, { document: document2 }) {
    const cells = [];
    const leadTextCta = element.querySelector(
      ':scope > [class*="textcta--top"] .comp-text-cta'
    );
    const leadParagraph = leadTextCta ? leadTextCta.querySelector(".comp-text p, p") : null;
    const leadCta = leadTextCta ? leadTextCta.querySelector("a[href]") : null;
    const images = Array.from(
      element.querySelectorAll(".cmp-image img[src], img.cmp-image__image[src]")
    );
    images.forEach((img, index) => {
      const wrapper = img.closest('[class*="image-container"]') || element;
      const textCta = wrapper.querySelector(".comp-text-cta");
      const heading = textCta ? textCta.querySelector("h1, h2, h3, h4, h5, h6") : null;
      const cardCta = textCta ? textCta.querySelector("a[href]") : null;
      const textCell = [];
      if (heading) textCell.push(heading);
      if (index === 0) {
        if (leadParagraph) textCell.push(leadParagraph);
        if (leadCta) textCell.push(leadCta);
      }
      if (cardCta) textCell.push(cardCta);
      cells.push([img, textCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-purpose", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-spotlight.js
  function parse3(element, { document: document2 }) {
    const image = element.querySelector(
      ".comp-content-spotlight__image-wrapper img[src], .comp-content-spotlight__image--desktop img[src], img[src]"
    );
    const heading = element.querySelector(
      ".comp-content-spotlight__text, .comp-content-spotlight__content-wrapper h1, .comp-content-spotlight__content-wrapper h2, .comp-content-spotlight__content-wrapper h3, .comp-content-spotlight__content-wrapper h4, h1, h2, h3, h4"
    );
    const cta = element.querySelector(
      "a.comp-content-spotlight__cta[href], a.comp-cta[href], .comp-content-spotlight__content-wrapper a[href]"
    );
    if (!image && !heading && !cta) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const textColumn = [];
    if (heading) textColumn.push(heading);
    if (cta) textColumn.push(cta);
    const cells = [[image || "", textColumn]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "columns-spotlight", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-stats.js
  function parse4(element, { document: document2 }) {
    const cells = [];
    const slides = Array.from(
      element.querySelectorAll(".comp-value-prop__slide, li.splide__slide")
    );
    slides.forEach((slide) => {
      const statEl = slide.querySelector('.comp-value-prop__stat, [class*="__stat"]');
      const descEl = slide.querySelector('.comp-value-prop__description, [class*="__description"]');
      const textCell = [];
      if (statEl) {
        const heading = document2.createElement("h3");
        heading.textContent = statEl.textContent.trim();
        textCell.push(heading);
      }
      if (descEl) {
        const p = document2.createElement("p");
        p.textContent = descEl.textContent.trim();
        textCell.push(p);
      }
      if (textCell.length) cells.push(["", textCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-stats", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-news.js
  function parse5(element, { document: document2 }) {
    const cells = [];
    const items = Array.from(
      element.querySelectorAll(":scope > ul > li, li")
    );
    items.forEach((li) => {
      const anchor = li.querySelector("a.comp-article-list__item-container[href], a[href]");
      const href = anchor ? anchor.getAttribute("href") : null;
      const img = li.querySelector(".comp-article-list__item-image img[src], img[src]");
      const category = li.querySelector('.comp-article-list__item-category, [class*="item-category"]');
      const date = li.querySelector('.comp-article-list__item-date, [class*="item-date"]:not([class*="date-container"])');
      const h3 = li.querySelector(".comp-article-list__item-description h3, h3");
      const textCell = [];
      if (category) {
        const p = document2.createElement("p");
        p.textContent = category.textContent.trim();
        textCell.push(p);
      }
      if (date) {
        const p = document2.createElement("p");
        p.textContent = date.textContent.trim();
        textCell.push(p);
      }
      if (h3) {
        const heading = document2.createElement("h3");
        const titleText = h3.textContent.replace(/\s+/g, " ").trim();
        if (href) {
          const a = document2.createElement("a");
          a.setAttribute("href", href);
          a.textContent = titleText;
          heading.appendChild(a);
        } else {
          heading.textContent = titleText;
        }
        textCell.push(heading);
      }
      if (img || textCell.length) {
        cells.push([img || "", textCell]);
      }
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-news", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/hcsc-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        // Adobe Target cloud service placeholder (body-level noise).
        "div.cloudservice.testandtarget",
        // Splide carousel duplicate/clone slides (aria-hidden clones).
        ".splide__slide.is-clone"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        // Skip-to-main-content accessibility link.
        "a.basepage__skip-nav",
        // Header/footer experience fragments (handled by standard EDS nav/footer).
        ".experiencefragment",
        ".cmp-experiencefragment",
        "header.comp-header",
        "footer.comp-footer",
        // Decorative swoop SVG containers.
        ".comp-hero-banner__svg-container",
        ".comp-section__svg-container",
        // Non-authorable embedded frames (Adobe ID syncing, etc.).
        "iframe"
      ]);
    }
  }

  // tools/importer/transformers/hcsc-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const template = payload && payload.template;
      const sections = template && Array.isArray(template.sections) ? template.sections : [];
      if (sections.length < 2) return;
      const doc = payload && payload.document || element.ownerDocument || document;
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section || !section.selector) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const metadataBlock = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metadataBlock);
        }
        if (i > 0) {
          sectionEl.before(doc.createElement("hr"));
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-home": parse,
    "cards-purpose": parse2,
    "columns-spotlight": parse3,
    "carousel-stats": parse4,
    "cards-news": parse5
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "HCSC corporate homepage with hero banner, content block, content spotlight, value-prop stats carousel, and news/insights article list",
    urls: ["https://www.hcsc.com/"],
    blocks: [
      {
        name: "hero-home",
        instances: ["#main-content .herobanner section.comp-hero-banner"]
      },
      {
        name: "cards-purpose",
        instances: ["#main-content .content-block .comp-content-block__grid-container"]
      },
      {
        name: "columns-spotlight",
        instances: ["#main-content .contentspotlight section.comp-content-spotlight"]
      },
      {
        name: "carousel-stats",
        instances: ["#main-content .section .comp-value-prop__carousel-container"]
      },
      {
        name: "cards-news",
        instances: ["#main-content .articlelist .comp-article-list__articles-container"]
      },
      {
        name: "section-content-spotlight",
        instances: ["#main-content > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.contentspotlight.styles__background--light-blue-100.aem-GridColumn.aem-GridColumn--default--12"],
        section: "light-blue"
      },
      {
        name: "section-value-prop-carousel",
        instances: ["#main-content > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.section.styles__background--green-100.aem-GridColumn.aem-GridColumn--default--12"],
        section: "green"
      }
    ],
    sections: [
      {
        id: "rc2",
        name: "hero",
        selector: "#main-content > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.herobanner.styles__background--light-blue-100.aem-GridColumn.aem-GridColumn--default--12",
        style: null,
        blocks: ["hero-home"],
        defaultContent: []
      },
      {
        id: "rc3",
        name: "content-block",
        selector: "#main-content > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.content-block.aem-GridColumn.aem-GridColumn--default--12",
        style: null,
        blocks: ["cards-purpose"],
        defaultContent: ["#main-content .content-block .comp-content-block__header"]
      },
      {
        id: "rc4",
        name: "content-spotlight",
        selector: "#main-content > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.contentspotlight.styles__background--light-blue-100.aem-GridColumn.aem-GridColumn--default--12",
        style: "light-blue",
        blocks: ["columns-spotlight"],
        defaultContent: []
      },
      {
        id: "rc5",
        name: "value-prop-carousel",
        selector: "#main-content > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.section.styles__background--green-100.aem-GridColumn.aem-GridColumn--default--12",
        style: "green",
        blocks: ["carousel-stats"],
        defaultContent: ["#main-content .section .comp-value-prop .comp-value-prop__eyebrow"]
      },
      {
        id: "rc6",
        name: "article-list",
        selector: "#main-content > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.articlelist.aem-GridColumn.aem-GridColumn--default--12",
        style: null,
        blocks: ["cards-news"],
        defaultContent: [
          "#main-content .articlelist .comp-article-list__eyebrow",
          "#main-content .articlelist .comp-article-list__headline",
          "#main-content .articlelist .comp-article-list__cta-container"
        ]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      if (blockDef.name.startsWith("section-")) return;
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
