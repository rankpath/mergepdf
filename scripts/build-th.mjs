#!/usr/bin/env node
/* Builds the Thai pages in /th/ and refreshes sitemap.xml.
 *
 * Source of truth: the English pages (index.html, merge-pdf/index.html, ...)
 * and the Thai text in i18n/th.json. Every element with data-i18n="key" gets
 * the Thai text for that key; data-i18n-aria="key" does the same for aria-label.
 *
 * Run after you change an English page or the Thai text:
 *   node scripts/build-th.mjs
 * It stops without writing if any key has no Thai text.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://mergepdftool.rank-path.com';
const th = JSON.parse(readFileSync(join(ROOT, 'i18n/th.json'), 'utf8'));

const escAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const escText = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const urlPath = (file) => '/' + file.replace(/index\.html$/, '');

function buildPage(file, page) {
  const text = { ...th.common, ...page.text };
  const enPath = urlPath(file);
  const thPath = '/th' + enPath;
  const missing = new Set();
  const used = new Set();
  let html = readFileSync(join(ROOT, file), 'utf8');

  // 1. Text inside elements marked data-i18n (these never nest)
  const marked = (html.match(/\sdata-i18n="/g) || []).length;
  let replaced = 0;
  html = html.replace(
    /<([a-z][a-z0-9]*)\b([^>]*?)\sdata-i18n="([^"]+)"([^>]*)>([\s\S]*?)<\/\1>/g,
    (match, tag, before, key, after) => {
      replaced++;
      if (!(key in text)) { missing.add(key); return match; }
      used.add(key);
      return `<${tag}${before} data-i18n="${key}"${after}>${text[key]}</${tag}>`;
    }
  );
  if (replaced !== marked) throw new Error(`${file}: found ${marked} data-i18n but replaced ${replaced}`);

  // 2. aria-label on elements marked data-i18n-aria
  html = html.replace(/<[a-z][^>]*\sdata-i18n-aria="([^"]+)"[^>]*>/g, (tag, key) => {
    if (!(key in text)) { missing.add(key); return tag; }
    used.add(key);
    return tag.replace(/aria-label="[^"]*"/, `aria-label="${escAttr(text[key])}"`);
  });

  if (missing.size) throw new Error(`${file}: no Thai text for ${[...missing].join(', ')}`);
  const unused = Object.keys(page.text).filter((k) => !used.has(k));
  if (unused.length) console.warn(`  note: ${file} has Thai text that the page does not use: ${unused.join(', ')}`);

  // 3. Head: language, title, description, Open Graph, canonical
  const m = page.meta;
  const set = (re, value) => {
    if (!re.test(html)) throw new Error(`${file}: missing ${re}`);
    html = html.replace(re, value);
  };
  set(/<html lang="en">/, '<html lang="th">');
  set(/<title>[\s\S]*?<\/title>/, `<title>${escText(m.title)}</title>`);
  set(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escAttr(m.description)}">`);
  set(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escAttr(m.ogTitle)}">`);
  set(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escAttr(m.ogDescription)}">`);
  set(/<meta property="og:locale" content="en_US">\n<meta property="og:locale:alternate" content="th_TH">/,
    '<meta property="og:locale" content="th_TH">\n<meta property="og:locale:alternate" content="en_US">');
  set(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${SITE}${thPath}">`);
  set(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${SITE}${thPath}">`);

  // 4. Links: keep visitors on Thai pages; the EN/TH switch points at both versions
  html = html.replace(/<a\b[^>]*>/g, (tag) => {
    const lang = (tag.match(/data-lang-link="(en|th)"/) || [])[1];
    if (lang === 'en') return tag.replace(/\saria-current="true"/, '');
    if (lang === 'th') return tag.includes('aria-current') ? tag : tag.replace('data-lang-link="th"', 'data-lang-link="th" aria-current="true"');
    return tag.replace(/href="\/(?!assets\/|th\/)([^"]*)"/, 'href="/th/$1"');
  });

  // 5. FAQ structured data in Thai
  html = html.replace(/(<script type="application\/ld\+json">\n)([\s\S]*?)(\n<\/script>)/, (all, open, json, close) => {
    const data = JSON.parse(json);
    if (data['@type'] !== 'FAQPage') return all;
    data.mainEntity.forEach((q, i) => {
      const qKey = `q${i + 1}`, aKey = `a${i + 1}`;
      if (!(qKey in text) || !(aKey in text)) throw new Error(`${file}: FAQ needs Thai ${qKey}/${aKey}`);
      q.name = text[qKey];
      q.acceptedAnswer.text = text[aKey];
    });
    return open + JSON.stringify(data, null, 2) + close;
  });

  html = html.replace('<!doctype html>\n',
    `<!doctype html>\n<!-- Thai page made by scripts/build-th.mjs from /${file} and i18n/th.json. Edit those, not this file. -->\n`);

  const out = join(ROOT, 'th', file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  console.log(`  th/${file}  (${used.size} Thai strings)`);
  return enPath;
}

function buildSitemap(paths) {
  const today = new Date().toISOString().slice(0, 10);
  const alt = (p) => [
    `    <xhtml:link rel="alternate" hreflang="en" href="${SITE}${p}"/>`,
    `    <xhtml:link rel="alternate" hreflang="th" href="${SITE}/th${p}"/>`,
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${p}"/>`
  ].join('\n');
  const urls = paths.flatMap((p) => [p, '/th' + p]).map((loc) => {
    const enPath = loc.startsWith('/th/') ? loc.slice(3) : loc;
    return `  <url>\n    <loc>${SITE}${loc}</loc>\n${alt(enPath)}\n    <lastmod>${today}</lastmod>\n  </url>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
  writeFileSync(join(ROOT, 'sitemap.xml'), xml);
  console.log(`  sitemap.xml  (${urls.length} URLs)`);
}

console.log('Building Thai pages');
const paths = Object.entries(th.pages).map(([file, page]) => buildPage(file, page));
buildSitemap(paths);
