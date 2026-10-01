/*
 * SITE SCRIPT — Calm Crew one-page website
 * =============================================================================
 * Three small jobs, all progressive: the page works without this file.
 *   1. The Menu button that the header collapses to on smaller screens.
 *   2. Calls to action carrying `data-interest` preselect the form's
 *      "I'm interested in" option and put focus on the Name field.
 *   3. Form problems are written under each field and stay there until fixed,
 *      instead of the browser's short-lived bubbles.
 *
 * Loaded in <head> without `defer`, so the `js` class is on <html> before the
 * first paint and the collapsed menu never flashes open. The rest waits for
 * the DOM. No external requests, no storage, no analytics.
 */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  // Mirror the breakpoints in site.css: the full header nav from 1280px, and
  // two-column sections (the contact form beside its heading) above 1080px.
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

  /* ---------------------------------------------------------------------------
   * 2. Calls to action that preselect the form
   * The interest comes from the clicked link's data attribute, never from the
   * URL, so a shared link cannot arrive with a choice already made.
   * ------------------------------------------------------------------------- */
  function initInterestLinks() {
    var select = document.getElementById('interest');
    var nameField = document.getElementById('name');
    var contact = document.getElementById('contact');
    if (!select || !nameField || !contact) return;

    document.addEventListener('click', function (event) {
      var link = event.target.closest('a[data-interest]');
      if (!link) return;

      // Leave modified clicks (new tab, new window) to the browser.
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      event.preventDefault();
      select.value = link.getAttribute('data-interest');
      // Let the form's own listeners (the error messages) see the new value.
      select.dispatchEvent(new Event('change', { bubbles: true }));

      // Side by side, the section's top shows the heading and the Name field
      // together. Stacked, the heading pushes the form down, so bring the form
      // itself to the top (the html scroll-padding keeps it below the header).
      var target = stacked.matches ? select.form : contact;
      target.scrollIntoView({
        behavior: reduceMotion.matches ? 'auto' : 'smooth',
        block: 'start'
      });

      // Keep the address bar and the Back button honest about where we are.
      if (window.location.hash !== '#contact' && window.history.pushState) {
        window.history.pushState(null, '', '#contact');
      }

      // Focus without a second jump; the scroll above brings the field into view.
      nameField.focus({ preventScroll: true });
    });
  }

  /* ---------------------------------------------------------------------------
   * 3. Form problems that stay on the page
   * Without this script the browser checks `required` and `type=email` itself.
   * With it, the browser's own check still decides what is wrong, and its own
   * message (validationMessage) is written under the field, so the page adds
   * no wording of its own. The message stays until the field is fixed.
   * ------------------------------------------------------------------------- */
  function initFormErrors() {
    var form = document.querySelector('form[name="contact"]');
    if (!form) return;

    form.setAttribute('novalidate', '');

    function errorFor(field) {
      return document.getElementById(field.id + '-error');
    }

    function describedBy(field, id, add) {
      var ids = (field.getAttribute('aria-describedby') || '').split(/\s+/).filter(function (value) {
        return value && value !== id;
      });
      if (add) ids.push(id);
      if (ids.length) {
        field.setAttribute('aria-describedby', ids.join(' '));
      } else {
        field.removeAttribute('aria-describedby');
      }
    }

    function showError(field) {
      var error = errorFor(field);
      if (!error) {
        error = document.createElement('p');
        error.className = 'field__error';
        error.id = field.id + '-error';
        field.closest('.field').appendChild(error);
        describedBy(field, error.id, true);
      }
      error.textContent = field.validationMessage;
      field.setAttribute('aria-invalid', 'true');
    }

    function clearError(field) {
      var error = errorFor(field);
      if (error) {
        describedBy(field, error.id, false);
        error.parentNode.removeChild(error);
      }
      field.removeAttribute('aria-invalid');
    }

    // The visible fields the browser would check (the honeypot has no id).
    function checkedFields() {
      return Array.prototype.filter.call(form.elements, function (element) {
        return element.willValidate && element.id && element.closest('.field');
      });
    }

    form.addEventListener('submit', function (event) {
      var firstInvalid = null;
      checkedFields().forEach(function (field) {
        if (field.checkValidity()) {
          clearError(field);
        } else {
          showError(field);
          if (!firstInvalid) firstInvalid = field;
        }
      });
      if (firstInvalid) {
        event.preventDefault();
        firstInvalid.focus();
      }
    });

    // Once a field has been flagged, keep its message current as it changes,
    // and remove it as soon as the field is fine.
    function recheck(event) {
      var field = event.target;
      if (!field.id || field.getAttribute('aria-invalid') !== 'true') return;
      if (field.checkValidity()) {
        clearError(field);
      } else {
        showError(field);
      }
    }

    form.addEventListener('input', recheck);
    form.addEventListener('change', recheck);
  }

  function init() {
    initMenu();
    initInterestLinks();
    initFormErrors();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
