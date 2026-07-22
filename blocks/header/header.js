import { getMetadata } from '../../scripts/aem.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

function closeAllPanels(navSections, exceptTrigger = null) {
  navSections.querySelectorAll('.nav-drop[aria-expanded="true"]').forEach((li) => {
    const trigger = li.querySelector(':scope > button');
    if (trigger === exceptTrigger) return;
    li.setAttribute('aria-expanded', 'false');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  });
}

function closeSearch(navTools) {
  const search = navTools.querySelector('.nav-search');
  if (search) search.setAttribute('aria-expanded', 'false');
}

/**
 * Build the utility bar (top row) from the first nav section.
 */
function decorateUtility(section) {
  section.classList.add('nav-utility');
  return section;
}

/**
 * Build the brand/logo (second nav section).
 */
function decorateBrand(section) {
  section.classList.add('nav-brand');
  const link = section.querySelector('a');
  if (link) link.setAttribute('aria-label', 'Health Care Service Corporation home');
  return section;
}

/**
 * Build the megamenu sections (third nav section).
 * Each top-level <li> becomes a click-triggered dropdown panel.
 */
function decorateSections(section) {
  section.classList.add('nav-sections');
  const topList = section.querySelector(':scope > ul');
  if (!topList) return section;

  topList.querySelectorAll(':scope > li').forEach((li) => {
    li.classList.add('nav-drop');
    li.setAttribute('aria-expanded', 'false');

    // First <p> is the trigger label; convert to a button.
    const labelEl = li.querySelector(':scope > p');
    const label = labelEl ? labelEl.textContent.trim() : '';
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-haspopup', 'true');
    if (labelEl) labelEl.replaceWith(button);

    // Wrap the remaining content (heading, description, links, image) in a panel.
    const panel = document.createElement('div');
    panel.className = 'nav-panel';
    while (button.nextElementSibling) panel.append(button.nextElementSibling);
    li.append(panel);

    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const expanded = li.getAttribute('aria-expanded') === 'true';
      closeAllPanels(section, button);
      li.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      button.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
  });

  return section;
}

/**
 * Build the search tool: an expandable icon that reveals an input.
 */
function buildSearch() {
  const tools = document.createElement('div');
  tools.className = 'nav-tools';

  const search = document.createElement('div');
  search.className = 'nav-search';
  search.setAttribute('aria-expanded', 'false');

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'nav-search-toggle';
  toggle.setAttribute('aria-label', 'Toggle search bar');

  const form = document.createElement('form');
  form.className = 'nav-search-form';
  form.setAttribute('role', 'search');
  form.action = '/search';
  const input = document.createElement('input');
  input.type = 'search';
  input.name = 'q';
  input.placeholder = 'Search HCSC.com';
  input.setAttribute('aria-label', 'Input for site search');
  form.append(input);

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const expanded = search.getAttribute('aria-expanded') === 'true';
    search.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    if (!expanded) input.focus();
  });

  search.append(toggle, form);
  tools.append(search);
  return tools;
}

function buildHamburger(nav, navSections) {
  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger';
  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('aria-controls', 'nav');
  button.setAttribute('aria-label', 'Open navigation');
  button.innerHTML = '<span class="nav-hamburger-icon"></span>';
  button.addEventListener('click', () => {
    const expanded = nav.getAttribute('aria-expanded') === 'true';
    nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
    document.body.style.overflowY = expanded || isDesktop.matches ? '' : 'hidden';
    // Reset any open sub-panel when closing the drawer
    if (expanded && navSections) closeAllPanels(navSections);
  });
  hamburger.append(button);
  return hamburger;
}

/**
 * On mobile, each nav-drop panel gets a "Back" control that returns to the
 * top-level list. The slide-in effect is CSS-driven via [aria-expanded].
 */
function addMobileBackButtons(navSections) {
  navSections.querySelectorAll('.nav-drop').forEach((li) => {
    if (li.querySelector(':scope > .nav-panel > .nav-back')) return;
    const panel = li.querySelector(':scope > .nav-panel');
    if (!panel) return;
    const back = document.createElement('button');
    back.type = 'button';
    back.className = 'nav-back';
    back.textContent = 'Back';
    back.addEventListener('click', (e) => {
      e.stopPropagation();
      li.setAttribute('aria-expanded', 'false');
      const trigger = li.querySelector(':scope > button');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
    panel.prepend(back);
  });
}

/**
 * loads and decorates the header nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/content/nav';

  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch(`${navPath}.plain.html`);
  if (!resp.ok) return;
  const html = await resp.text();

  const fragment = document.createElement('div');
  fragment.innerHTML = html;

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-expanded', 'false');

  const sections = [...fragment.children];
  const utility = sections[0] ? decorateUtility(sections[0]) : null;
  const brand = sections[1] ? decorateBrand(sections[1]) : null;
  const navSections = sections[2] ? decorateSections(sections[2]) : null;
  const tools = buildSearch();
  const hamburger = buildHamburger(nav, navSections);
  if (navSections) addMobileBackButtons(navSections);

  // Top utility row
  if (utility) nav.append(utility);

  // Main row: hamburger + brand + sections + tools
  const mainRow = document.createElement('div');
  mainRow.className = 'nav-main';
  mainRow.append(hamburger);
  if (brand) mainRow.append(brand);
  if (navSections) mainRow.append(navSections);
  mainRow.append(tools);
  nav.append(mainRow);

  // Mobile: relocate utility links into the sections drawer so they appear
  // in the hamburger menu (source hides them from the top bar on mobile).
  if (utility && navSections) {
    const utilClone = utility.cloneNode(true);
    utilClone.classList.remove('nav-utility');
    utilClone.classList.add('nav-utility-mobile');
    navSections.append(utilClone);
  }

  // Close panels/search on outside click
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
      if (navSections) closeAllPanels(navSections);
      closeSearch(tools);
    }
  });
  // Close on escape
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
      if (navSections) closeAllPanels(navSections);
      closeSearch(tools);
    }
  });

  // Reset state when crossing breakpoints
  isDesktop.addEventListener('change', () => {
    nav.setAttribute('aria-expanded', 'false');
    const hb = hamburger.querySelector('button');
    if (hb) hb.setAttribute('aria-label', 'Open navigation');
    document.body.style.overflowY = '';
    if (navSections) closeAllPanels(navSections);
    closeSearch(tools);
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
