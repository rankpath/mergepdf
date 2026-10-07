/* Mergepdftool shared script: EN/TH language switch and mobile menu.
 *
 * English lives in the HTML. Each page can add its own Thai copy and page
 * titles before loading this file:
 *   window.MPT_PAGE = { th: { key: 'ข้อความ' }, meta: { en: {title, desc}, th: {title, desc} } };
 * Page scripts read window.MPT.lang and re-render with window.MPT.onLang(fn).
 */
(function () {
  'use strict';

  /* Thai copy shared by every page: header, footer, tool names, categories */
  var COMMON_TH = {
    'skip': 'ข้ามไปยังเนื้อหา',
    'nav.convert': 'แปลงไฟล์',
    'nav.all': 'เครื่องมือทั้งหมด',
    'nav.cta': 'รวมไฟล์ PDF',

    'f.all': 'ทั้งหมด', 'f.workflow': 'เวิร์กโฟลว์', 'f.organize': 'จัดหน้า', 'f.optimize': 'ปรับแต่งไฟล์',
    'f.convert': 'แปลงไฟล์', 'f.edit': 'แก้ไข', 'f.security': 'ความปลอดภัย', 'f.ai': 'เครื่องมือ AI',

    't.merge': 'รวม PDF',
    't.split': 'แยก PDF',
    't.organize': 'จัดเรียงหน้า PDF',
    't.rotate': 'หมุน PDF',
    't.scan': 'สแกนเป็น PDF',
    't.compress': 'บีบอัด PDF',
    't.repair': 'ซ่อม PDF',
    't.ocr': 'OCR PDF',
    't.pdf2word': 'PDF เป็น Word',
    't.word2pdf': 'Word เป็น PDF',
    't.pdf2excel': 'PDF เป็น Excel',
    't.jpg2pdf': 'JPG เป็น PDF',
    't.pdf2jpg': 'PDF เป็น JPG',
    't.edit': 'แก้ไข PDF',
    't.pagenum': 'ใส่เลขหน้า',
    't.watermark': 'ใส่ลายน้ำ',
    't.sign': 'เซ็น PDF',
    't.protect': 'ใส่รหัส PDF',
    't.unlock': 'ปลดรหัส PDF',
    't.redact': 'ปิดทับข้อมูลลับ',
    't.summarize': 'สรุป PDF',
    't.chat': 'ถามตอบกับ PDF',
    't.translate': 'แปลภาษา PDF',
    't.workflow': 'สร้างเวิร์กโฟลว์',

    'foot.tag': 'เครื่องมือ PDF ใช้ง่าย สำหรับงานทุกวัน',
    'foot.built': 'พัฒนาโดย',
    'foot.company': 'บริษัท',
    'foot.about': 'เกี่ยวกับเรา',
    'foot.contact': 'ติดต่อเรา',
    'foot.privacy': 'นโยบายความเป็นส่วนตัว',
    'foot.terms': 'ข้อกำหนดการใช้งาน',
    'foot.rights': '© 2026 Mergepdftool สงวนลิขสิทธิ์'
  };

  var ARIA = {
    en: { 'aria.nav': 'Main', 'aria.lang': 'Language', 'aria.filters': 'Filter tools by task', open: 'Open menu', close: 'Close menu' },
    th: { 'aria.nav': 'เมนูหลัก', 'aria.lang': 'ภาษา', 'aria.filters': 'กรองเครื่องมือตามหมวดงาน', open: 'เปิดเมนู', close: 'ปิดเมนู' }
  };

  var page = window.MPT_PAGE || {};
  var TH = Object.assign({}, COMMON_TH, page.th || {});
  var META = page.meta || null;

  var root = document.documentElement;
  var textNodes = Array.prototype.slice.call(document.querySelectorAll('[data-i18n]'));
  var ariaNodes = Array.prototype.slice.call(document.querySelectorAll('[data-i18n-aria]'));
  var langBtns = Array.prototype.slice.call(document.querySelectorAll('[data-lang]'));
  var menuBtn = document.querySelector('.menu-btn');
  var menu = document.getElementById('mobile-menu');
  var metaDesc = document.querySelector('meta[name="description"]');

  var english = new Map();
  textNodes.forEach(function (el) { english.set(el, el.innerHTML); });

  var listeners = [];
  var lang = 'en';

  function setLang(next) {
    lang = next === 'th' ? 'th' : 'en';
    root.lang = lang;
    textNodes.forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      el.innerHTML = (lang === 'th' && TH[key] != null) ? TH[key] : english.get(el);
    });
    ariaNodes.forEach(function (el) {
      var label = ARIA[lang][el.getAttribute('data-i18n-aria')];
      if (label) el.setAttribute('aria-label', label);
    });
    langBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang)); });
    setMenuLabel();
    if (META && META[lang]) {
      document.title = META[lang].title;
      if (metaDesc) metaDesc.setAttribute('content', META[lang].desc);
    }
    try { localStorage.setItem('mpt-lang', lang); } catch (e) {}
    listeners.forEach(function (fn) { fn(lang); });
  }

  function setMenuLabel() {
    if (!menuBtn) return;
    var open = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-label', ARIA[lang][open ? 'close' : 'open']);
  }

  function setMenu(open) {
    if (!menuBtn || !menu) return;
    menuBtn.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    setMenuLabel();
  }

  langBtns.forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });

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

  /* Start language: ?lang= in the URL, then saved choice, then browser language */
  function startLang() {
    var param = new URLSearchParams(location.search).get('lang');
    if (param === 'th' || param === 'en') return param;
    var saved = null;
    try { saved = localStorage.getItem('mpt-lang'); } catch (e) {}
    if (saved === 'th' || saved === 'en') return saved;
    return (navigator.language || '').toLowerCase().indexOf('th') === 0 ? 'th' : 'en';
  }

  window.MPT = {
    get lang() { return lang; },
    setLang: setLang,
    onLang: function (fn) { listeners.push(fn); }
  };

  setLang(startLang());
})();
