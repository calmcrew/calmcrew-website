/*
 * FLEETS PAGE SCRIPT — fleets.html only
 * =============================================================================
 * Two small jobs, progressive like site.js:
 *   1. The sample chart's tooltip: hover or tap a week to read its averages.
 *      (The chart's label already gives every value to screen readers.)
 *   2. The contact form. The site has no form back end, so Send writes the
 *      message out as an email to Libby and opens the visitor's own email
 *      app. Nothing is sent or stored by the page itself.
 * External file on purpose: the content security policy allows no inline JS.
 */
(function () {
  'use strict';

  var LIBBY = 'libby@calmcrewcoaching.com';

  /* ---------------------------------------------------------------------------
   * 1. Chart tooltip
   * ------------------------------------------------------------------------- */
  function initChart() {
    var panel = document.querySelector('.panel--trend');
    if (!panel) return;
    var svg = panel.querySelector('.chart svg');
    var tip = panel.querySelector('.tip');
    var cross = svg && svg.querySelector('.chart__cross');
    if (!svg || !tip || !cross) return;
    var view = svg.viewBox.baseVal;

    function show(hit) {
      var x = Number(hit.getAttribute('data-x'));
      var y = Number(hit.getAttribute('data-y'));
      cross.setAttribute('x1', x);
      cross.setAttribute('x2', x);
      cross.setAttribute('visibility', 'visible');

      var title = document.createElement('strong');
      title.textContent = 'Week ' + hit.getAttribute('data-week');
      tip.textContent = '';
      tip.appendChild(title);
      tip.appendChild(document.createElement('br'));
      tip.appendChild(document.createTextNode(
        'Mood ' + hit.getAttribute('data-mood') + ' · Energy ' + hit.getAttribute('data-energy')));
      tip.hidden = false;

      // Above the higher of the two points, kept inside the panel.
      var chartBox = svg.getBoundingClientRect();
      var panelBox = panel.getBoundingClientRect();
      var px = chartBox.left - panelBox.left + x * chartBox.width / view.width;
      var py = chartBox.top - panelBox.top + y * chartBox.height / view.height;
      var left = Math.min(Math.max(px - tip.offsetWidth / 2, 8), panelBox.width - tip.offsetWidth - 8);
      tip.style.left = left + 'px';
      tip.style.top = Math.max(py - tip.offsetHeight - 12, 8) + 'px';
    }

    function hide() {
      cross.setAttribute('visibility', 'hidden');
      tip.hidden = true;
    }

    Array.prototype.forEach.call(svg.querySelectorAll('.chart__hit'), function (hit) {
      hit.addEventListener('pointerenter', function () { show(hit); });
      hit.addEventListener('pointerleave', hide);
      hit.addEventListener('click', function () { show(hit); });
    });
  }

  /* ---------------------------------------------------------------------------
   * 2. Contact form → the visitor's email app
   * ------------------------------------------------------------------------- */
  function initForm() {
    var form = document.getElementById('enquiry');
    if (!form) return;
    var status = form.querySelector('.form__sent');

    // The browser checks the required fields first: this only runs once
    // Name and a valid Email are in.
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var value = function (name) {
        var field = form.elements[name];
        return field ? String(field.value).trim() : '';
      };
      var interest = value('interest');
      var lines = ['Name: ' + value('name'), 'Email: ' + value('email')];
      if (value('role')) lines.push('Role, yacht or organisation: ' + value('role'));
      lines.push('Interested in: ' + interest);
      if (value('message')) lines.push('', value('message'));

      window.location.href = 'mailto:' + LIBBY +
        '?subject=' + encodeURIComponent('Calm Crew: ' + interest) +
        '&body=' + encodeURIComponent(lines.join('\r\n'));

      if (status) {
        status.textContent = 'Your email app should now open with your message to Libby, ready to send. ' +
          'If it doesn’t, write to ' + LIBBY + '.';
      }
    });
  }

  function init() {
    initChart();
    initForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
