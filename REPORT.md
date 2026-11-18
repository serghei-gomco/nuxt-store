# Performance report

Local lab measurements, **18 Nov 2026**. Not field data (no real users, no CDN).

- Build: `npm run generate` (Nuxt 3.21.11) on each branch, the two `.output/public` folders served side by side with
  `npx -y serve@14 <folder> -l <port>` (gzip on).
- Tool: Lighthouse 13.6.0, default **mobile** emulation (simulated slow 4G, 4× CPU slowdown), headless Chrome 157,
  on a MacBook. Command per page:

  ```bash
  npx -y lighthouse@13.6.0 http://localhost:4173/ --quiet --chrome-flags="--headless=new" --output=json
  ```

- **3 runs per page per branch, alternating before/after, median reported.** Fresh browser profile each run.
- "Requests" and "JS transferred" are Lighthouse's resource summary for the page load (it waits for the network to go
  quiet, so prefetches triggered during load are counted).

## Before / after

`before` is the [`before` branch](https://github.com/serghei-gomco/nuxt-store/tree/before): this same store with the
fixes below removed. There was no saved "slow" version — it was reconstructed by taking the finished store and
undoing exactly these changes: the inline category script, `payloadExtraction: false`, interaction-only prefetch,
and two high-priority grid images instead of four. `after` is `main`.

| Page | Build | Performance | LCP | CLS | TBT | JS transferred | Requests | Total transferred |
|---|---|---|---|---|---|---|---|---|
| `/?category=desk` (direct visit) | before | 82 | 1.95 s | **0.352** | 19 ms | 80.6 KiB | 34 | 99.2 KiB |
| | after | **100** | 1.80 s | **0** | 2 ms | 77.4 KiB | 13 | 86.3 KiB |
| `/` (catalogue) | before | 99 | 1.95 s | 0 | 1 ms | 80.6 KiB | 35 | 99.5 KiB |
| | after | 100 | 1.81 s | 0 | 0 ms | 77.4 KiB | 18 | 91.5 KiB |
| `/products/stoneware-mug` | before | 100 | 0.60 s | 0 | 0 ms | 80.6 KiB | 17 | 89.1 KiB |
| | after | 100 | 0.60 s | 0 | 41 ms | 76.9 KiB | 7 | 81.8 KiB |

Individual runs (Performance / LCP / TBT):

- `/?category=desk` before: 82 / 1.95 s / 35 ms, 82 / 1.96 s / 4 ms, 82 / 1.95 s / 19 ms — CLS 0.352 every run.
  After: 100 / 1.80 s / 2 ms, 100 / 1.88 s / 2 ms, 100 / 1.80 s / 9 ms — CLS 0 every run.
- `/` before: 100 / 1.88 s, 99 / 1.95 s, 99 / 1.95 s. After: 100 / 1.81 s, 100 / 1.88 s, 100 / 1.81 s.
- Product before: 100 / 0.60 s / 0 ms ×3. After: 100 / 0.60 s with TBT 41, 43 and 0 ms.

### What each fix did, by the numbers

- **Inline category script — the one that matters.** On a direct visit to `/?category=desk` it removes a layout
  shift of 0.352 (Google's "poor" threshold is 0.25) and takes the score from 82 to 100. Same result in all 3 runs.
- **No `_payload.json` + prefetch on interaction.** Before, the home page made 35 requests: 11 of them were
  `_payload.json` files for product pages prefetched because their links were visible, plus extra JS/CSS chunks.
  After: 18 requests on `/`, 7 on a product page instead of 17, and about 3 KiB less JS. The scores barely move
  (99 → 100 on `/`), and LCP improves by ~0.1 s, which is close to run-to-run spread. On a real shop with hundreds of
  links per page the request saving matters more than it does here.
- **Two high-priority images instead of four** was changed together with the above and was not measured on its own;
  I can't claim a separate effect for it.
- **TBT** is 0–45 ms on every page in both builds. The 41 ms median on the product page "after" is noise (one of the
  three runs was 0 ms); there is no TBT problem to fix on either branch.

`/cart` was not part of this comparison (none of the fixes touch it); an earlier single run of the final build,
empty cart, scored Performance 100 with CLS 0.

Other Lighthouse categories on `main`: Accessibility 100, Best Practices 100; SEO 100 on `/` and product pages, 60 on
`/cart` because the cart is deliberately `noindex`.

Lab scores vary between runs: LCP on `/` moved by up to 0.07 s between runs of the same build, TBT by tens of ms.
Small differences in this table should be read with that in mind; the CLS difference is not one of them.

### Live check on Vercel (18.11.2026)

Same Lighthouse 13.6.0 mobile preset, one run per page, against https://nuxt-store-kappa.vercel.app:

| Page | Performance | Accessibility | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|
| `/` | **100** | 100 | 100 | 1.2 s | **0** | 10 ms |
| `/?category=desk` | **100** | 100 | 100 | 0.8 s | **0** | 10 ms |
| `/products/brass-desk-lamp` | **100** | 100 | 100 | 0.8 s | **0** | 0 ms |

## What was done for speed, and why

**Layout shift (CLS)**
- **Every image has `width`/`height` and `aspect-ratio`.** The browser reserves the box before the image loads, so
  nothing below it jumps.
- **The cart badge has a fixed size from the first paint.** The count comes from `localStorage`, which only exists in
  the browser. The badge box is rendered empty on the server and filled in after mount — same size, no jump.
- **The cart page keeps a placeholder of the same height** until the saved cart is read.
- **The "Added to cart" message has reserved space** (`min-height`), so showing it does not push the buttons.
- **Filtered URL on a static host.** The HTML for `/` is generated once, without a query string. On a direct visit to
  `/?category=desk` the full grid would paint first and then collapse to 3 cards. A one-line inline script marks
  `<html data-category="desk">` before the first paint and CSS hides the other cards; Vue then takes over.
  **CLS 0.352 and score 82 without this script, CLS 0 and score 100 with it** (table above).
- **No web fonts** (system font stack), so there is no font-swap reflow.

**Largest Contentful Paint (LCP)**
- **Everything is prerendered** (`nuxt generate`): the HTML already contains the content; nothing waits for JS or an API.
- **CSS is inlined** into the HTML (Nuxt does this for component styles); there is no render-blocking stylesheet.
- **Only the first two grid images are `eager` + `fetchpriority="high"`**, the rest are `loading="lazy"`. At first four
  images were high priority and competed with each other. The product page image is high priority too.
- **Small local SVG images** (0.7–0.8 KiB each) and no third-party origins, so no extra DNS/TLS connections.

**Blocking time (TBT) and JS size**
- **No `_payload.json` per page** (`experimental.payloadExtraction: false`): the app fetches no data, so the payload
  file was an extra request on every page.
- **Links prefetch on interaction, not on visibility.** By default Nuxt downloads the JS of every page whose link is
  visible; the grid has 12+ links. Now a page's code is fetched on hover/focus/touch.
- **Minimal dependencies:** Nuxt and Pinia, nothing else on the client. No UI kit, icon font or analytics.
- Total JS is ~77 KiB gzip, almost all of it the Vue + router + Nuxt runtime; the app's own code is a few KiB.

## What was not done (and why)

- **No image CDN / `@nuxt/image`.** The images are tiny SVGs; with real product photos I would add `@nuxt/image` with
  AVIF/WebP and `srcset`.
- **Home LCP is ~1.8 s, not 0.6 s.** The LCP element is the first product image. It arrives early but is painted one
  frame after the text, and Lighthouse's simulation then counts the 77 KiB JS download before it. A
  `<link rel="preload">` for the image did not change the number (tried, reverted). Inlining the image as a data URI
  or dropping JS might, but neither is worth it for a value already in the "good" range (< 2.5 s) with a score of 100.
- **No field data** (Chrome UX Report / real-user monitoring): the demo has no real traffic.
- **No service worker / offline mode** and **no cross-tab cart sync** (`storage` event): out of scope for a demo.
- **The cart page with items was not measured** separately; it renders after mount from `localStorage`.
