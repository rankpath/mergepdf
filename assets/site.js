/* Mergepdftool shared script: page language and mobile menu.
 *
 * English pages live at /, Thai pages at /th/. The Thai pages are made by
 * scripts/build-th.mjs from the English pages and i18n/th.json, so all
 * static text is already in the HTML. Page scripts read window.MPT.lang
 * ('en' or 'th') for text they build while the page runs.
 */
(function () {
  'use strict';

  var lang = document.documentElement.lang === 'th' ? 'th' : 'en';
  var MENU = {
    en: { open: 'Open menu', close: 'Close menu' },
    th: { open: 'เปิดเมนู', close: 'ปิดเมนู' }
  };

  var menuBtn = document.querySelector('.menu-btn');
  var menu = document.getElementById('mobile-menu');

  function setMenu(open) {
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', MENU[lang][open ? 'close' : 'open']);
    menu.hidden = !open;
  }

  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () {
      setMenu(menuBtn.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { setMenu(false); menuBtn.focus(); }
    });
  }

  window.MPT = { lang: lang };
})();
