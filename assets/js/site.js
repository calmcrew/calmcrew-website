/*
 * SITE SCRIPT — Calm Crew one-page website
 * =============================================================================
 * One small job, progressive: the page works without this file.
 *   The Menu button that the header collapses to on smaller screens.
 * (The contact form and its helpers were removed on 3 Oct 2026: calmcrew.app is
 * published with Figma Sites, which has no forms, so the page links to email.)
 *
 * Loaded in <head> without `defer`, so the `js` class is on <html> before the
 * first paint and the collapsed menu never flashes open. The rest waits for
 * the DOM. No external requests, no storage, no analytics.
 */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Mirror the breakpoint in site.css: the full header nav from 1280px.
  var wideHeader = window.matchMedia('(min-width: 1280px)');
  var stacked = window.matchMedia('(max-width: 1080px)');

  // Safari before 14 only knows addListener on MediaQueryList.
  function onMediaChange(query, handler) {
    if (query.addEventListener) {
      query.addEventListener('change', handler);
    } else if (query.addListener) {
      query.addListener(handler);
    }
  }

  /* ---------------------------------------------------------------------------
   * 1. Menu disclosure
   * ------------------------------------------------------------------------- */
  function initMenu() {
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.getElementById('site-menu');
    if (!toggle || !menu) return;
    var header = toggle.closest('.site-header');

    // The button is `hidden` in the HTML so no-JS visitors never see a dead one.
    toggle.hidden = false;

    function isOpen() {
      return toggle.getAttribute('aria-expanded') === 'true';
    }

    function setOpen(open, returnFocus) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      menu.classList.toggle('is-open', open);
      if (!open && returnFocus) toggle.focus();
    }

    toggle.addEventListener('click', function () {
      setOpen(!isOpen(), false);
    });

    // Escape closes the menu and hands focus back to the button.
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen()) {
        setOpen(false, true);
      }
    });

    // Choosing a link closes the menu; the link's own jump still happens.
    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false, false);
    });

    // A click anywhere outside the header closes it too.
    document.addEventListener('click', function (event) {
      if (isOpen() && !event.target.closest('.site-header')) setOpen(false, false);
    });

    // Tabbing out of the open menu closes it, so focus never lands on content
    // the menu covers.
    header.addEventListener('focusout', function (event) {
      var next = event.relatedTarget;
      if (isOpen() && next && !next.closest('.site-header')) setOpen(false, false);
    });

    // Zooming in (or narrowing the window) past 1280px hides the full nav. If
    // focus was on one of its links, the browser drops it to the page before
    // the media-query event below arrives, and may not say so. So remember
    // whether focus is in the menu, and forget it only when it really leaves:
    // to another element, or to nowhere while the menu is still showing (a
    // click on plain text, another window).
    var focusInMenu = false;
    document.addEventListener('focusin', function (event) {
      focusInMenu = menu.contains(event.target);
    });
    menu.addEventListener('focusout', function (event) {
      if (!event.relatedTarget && menu.getClientRects().length) focusInMenu = false;
    });
    menu.addEventListener('click', function (event) {
      if (event.target.closest('a')) focusInMenu = false;
    });

    // Crossing between the wide and the collapsed header resets the state, and
    // focus lost with the hidden nav goes to the Menu button that replaces it.
    onMediaChange(wideHeader, function () {
      var active = document.activeElement;
      var lost = focusInMenu && (!active || active === document.body);
      setOpen(false, false);
      if (lost && !wideHeader.matches) toggle.focus();
    });
  }

  function init() {
    initMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
