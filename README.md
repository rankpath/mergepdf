# Mergepdftool

Simple PDF tools built by RankPath Labs. Static site, no build step: deploy the folder to Netlify.

- English at `/`, Thai at `/th/`. Each language has its own URL, canonical and hreflang tags, so Google can index both.
- Mobile first. Tested at 320, 375, 1280 and 1440 px wide.

## Files

| Path | What it is |
|---|---|
| `index.html` | Homepage with all 24 tools and category filters |
| `merge-pdf/index.html` | **Merge PDF** tool (working) |
| `assets/site.css` | Shared styles: brand tokens, header, footer, buttons |
| `assets/tool.css` | Shared styles for tool pages: drop zone, file cards, merge bar, result |
| `assets/site.js` | Shared script: mobile menu, page language (`MPT.lang`) |
| `assets/vendor/` | PDF libraries, hosted with the site (no third-party CDN) |
| `th/` | Thai pages. **Made by the script below, do not edit by hand** |
| `i18n/th.json` | All Thai text, by page |
| `scripts/build-th.mjs` | Builds `th/` and `sitemap.xml` from the English pages and `i18n/th.json` |

## Thai pages

The English pages are the source. Text that needs Thai has `data-i18n="key"` (or `data-i18n-aria="key"` for an aria-label), and the Thai text for each key is in `i18n/th.json`.

After you change an English page or the Thai text, run:

```
node scripts/build-th.mjs
```

It writes `th/...` and `sitemap.xml`, and stops without writing if any key has no Thai text. No npm install is needed. Commit the generated files: Netlify serves them as they are.

To add a new page: build the English page, add its Thai text under `pages` in `i18n/th.json`, then run the script.

To preview locally, run a small web server from the repo folder (pages load files from `/assets/`), for example `python3 -m http.server`, then open `http://localhost:8000/`.

## Merge PDF

Everything runs in the browser. Files are never uploaded.

- Add files by drag and drop (anywhere on the page) or the Select button. Non-PDF files are skipped with a message.
- Each file shows a first-page preview, page count and size. Password-protected and damaged files are flagged and skipped.
- Change the order by dragging the cards (touch: press and hold) or with the arrow buttons. Sort A–Z, remove one, or clear all.
- Name the new file, merge, then download. The PDF's Producer and Creator fields say Mergepdftool.
- Bookmarks from the original files are not kept (pdf-lib limitation). Password-protected files are not supported yet.

Libraries (loaded only when the user adds files):

| Library | Version | License | Used for |
|---|---|---|---|
| pdf-lib | 1.17.1 | MIT | Reading page counts and merging |
| pdf.js (pdfjs-dist) | 3.11.174 | Apache-2.0 | First-page previews (`isEvalSupported: false`) |
| SortableJS | 1.15.2 | MIT | Drag to reorder, mouse and touch |

License files sit next to each library in `assets/vendor/`.

## Domain

Main address: **https://mergepdftool.rank-path.com**
`www.mergepdftool.rank-path.com` redirects to it with a 301 (set in `netlify.toml`). The page canonical, `robots.txt` and `sitemap.xml` all use the main address.

Setup (one time):

1. Netlify: create a site from `rankpath/mergepdf`. Leave the build command empty. The publish folder comes from `netlify.toml`.
2. Netlify → Domain management: add `mergepdftool.rank-path.com`, then add `www.mergepdftool.rank-path.com` as a domain alias.
3. Wherever the DNS for `rank-path.com` is managed (Namecheap Advanced DNS or cPanel Zone Editor), add:

   | Type | Host | Value |
   |---|---|---|
   | CNAME | `mergepdftool` | `<your-site>.netlify.app` |
   | CNAME | `www.mergepdftool` | `<your-site>.netlify.app` |

4. Wait for DNS to update. Netlify then adds the HTTPS certificate on its own.

## Brand (RankPath Labs guideline)

| Token | Value | Use |
|---|---|---|
| Navy | `#061638` | Text, headings, wordmark, dark sections |
| Royal Blue | `#0057E8` | Buttons, links, icons |
| Cyan | `#00A6F5` | Accent, AI tools, logo detail |
| Ice | `#EFF6FF` | Soft panels and cards |
| White | `#FFFFFF` | Page background |

Fonts: Manrope (English) and Noto Sans Thai (Thai). Thai text has no letter-spacing or uppercase, and body line height is 1.7.

## Homepage sections

1. Header: logo, main links, EN/TH switch, Merge PDFs button (menu on mobile)
2. Hero: headline, 2 buttons, 3 trust points, Merge PDF preview (illustration only)
3. All tools: 24 tools with category filters
4. How it works: 3 steps
5. Work your way: computer, phone, team ("Coming soon")
6. Call to action
7. Footer: tool links, company links, "Built by RankPath Labs"

## Check before launch

- Claims: "Free to start", "Nothing to install", "Works on phone and desktop". Keep them only if the live product does this.
- Only Merge PDF is built. The other tool links (`/split-pdf/`, `/compress-pdf/`, ...) do not have pages yet.
- Merge PDF was tested in Chromium (desktop and mobile size). Test once on a real iPhone (Safari) and Android phone before launch.
- Footer link to `https://rank-path.com` has not been checked.
- The Mergepdftool logo is a first draft made in SVG. It is not an approved brand asset yet.
