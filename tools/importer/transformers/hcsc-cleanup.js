/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: HCSC site-wide cleanup.
 *
 * Removes non-authorable site chrome and known noise elements so the import
 * contains only page-level authorable content under #main-content.
 *
 * All selectors verified against migration-work/cleaned.html:
 *  - a.basepage__skip-nav                      -> line 2  (skip-to-main-content link)
 *  - div.cloudservice.testandtarget            -> line 1038 (Adobe Target placeholder)
 *  - .experiencefragment                       -> lines 6 & 764 (header/footer XF wrappers)
 *  - .cmp-experiencefragment                   -> lines 7 & 765 (XF containers)
 *  - header.comp-header                         -> line 10 (header XF; handled by EDS nav)
 *  - footer.comp-footer                         -> line 768 (footer XF; handled by EDS footer)
 *  - iframe (e.g. Adobe ID Syncing iFrame)      -> line 1036
 *  - .comp-hero-banner__svg-container           -> line 481 (decorative swoop SVG)
 *  - .comp-section__svg-container               -> line 637 (decorative swoop SVG)
 *  - .splide__slide.is-clone                    -> splide carousel aria-hidden clone slides
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  // Only WebImporter global is available in the validation/import runtime.
  if (hookName === TransformHook.beforeTransform) {
    // Remove elements that could interfere with block parsing/matching.
    WebImporter.DOMUtils.remove(element, [
      // Adobe Target cloud service placeholder (body-level noise).
      'div.cloudservice.testandtarget',
      // Splide carousel duplicate/clone slides (aria-hidden clones).
      '.splide__slide.is-clone',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable site chrome and leftover noise (post block parsing).
    WebImporter.DOMUtils.remove(element, [
      // Skip-to-main-content accessibility link.
      'a.basepage__skip-nav',
      // Header/footer experience fragments (handled by standard EDS nav/footer).
      '.experiencefragment',
      '.cmp-experiencefragment',
      'header.comp-header',
      'footer.comp-footer',
      // Decorative swoop SVG containers.
      '.comp-hero-banner__svg-container',
      '.comp-section__svg-container',
      // Non-authorable embedded frames (Adobe ID syncing, etc.).
      'iframe',
    ]);
  }
}
