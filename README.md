# Mergepdftool

Homepage design for Mergepdftool, a set of simple PDF tools built by RankPath Labs.

- One HTML file (`index.html`), no build step. Open it in a browser or deploy the folder to Netlify.
- English by default, Thai with the EN/TH switch. You can also link straight to Thai with `?lang=th`.
- Mobile first. Tested at 320, 375, 1280 and 1440 px wide.

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

## Page sections

1. Header: logo, main links, EN/TH switch, Merge PDFs button (menu on mobile)
2. Hero: headline, 2 buttons, 3 trust points, Merge PDF preview (illustration only)
3. All tools: 24 tools with category filters
4. How it works: 3 steps
5. Work your way: computer, phone, team ("Coming soon")
6. Call to action
7. Footer: tool links, company links, "Built by RankPath Labs"

## Check before launch

- Claims: "Free to start", "Nothing to install", "Works on phone and desktop". Keep them only if the live product does this.
- Tool links (`/merge-pdf`, `/split-pdf`, ...) point to pages that are not built yet.
- Footer link to `https://rank-path.com` has not been checked.
- The Mergepdftool logo is a first draft made in SVG. It is not an approved brand asset yet.
