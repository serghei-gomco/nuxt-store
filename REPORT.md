# Performance report

Local lab measurements, **18 Nov 2026**. Not field data (no real users, no CDN).

- Build: `npm run generate` (Nuxt 3.21.11), served with `npx -y serve@14 .output/public -l 4173` (gzip on).
- Tool: Lighthouse 13.6.0, default **mobile** emulation (simulated slow 4G, 4× CPU slowdown), headless Chrome 157,
  on a MacBook. Command (see `scripts/lighthouse.sh`):

  ```bash
  npx -y lighthouse@13.6.0 http://localhost:4173/ --only-categories=performance \
    --chrome-flags="--headless=new" --output=json --output-path=.lighthouse/raw/home.json
  ```

- One run per page; the cart was measured empty (fresh browser profile).

## Results (final build)

| Page | Performance | FCP | LCP | CLS | TBT | JS transferred | Total transferred |
|---|---|---|---|---|---|---|---|
| `/` (catalogue) | **100** | 0.6 s | 1.9 s | **0** | 0 ms | 77.4 KiB | 91.5 KiB |
| `/products/stoneware-mug` | **100** | 0.6 s | 0.6 s | **0** | 0 ms | 76.9 KiB | 81.7 KiB |
| `/cart` | **100** | 0.6 s | 0.6 s | **0** | 0 ms | 77.2 KiB | 81.3 KiB |
| `/?category=desk` (direct visit) | 100 | 0.6 s | 1.7 s | **0** | 40 ms | 77.4 KiB | — |

Other Lighthouse categories on the same build: Accessibility 100, Best Practices 100 on all three pages; SEO 100 on
`/` and the product page, 60 on `/cart` because the cart is deliberately `noindex`.

First build, before the tuning in step 2: `/` 99 (LCP 2.2 s, TBT 30 ms, JS 80.7 KiB), product 100, cart 100;
CLS was already 0 on all three.

Lab scores vary a little between runs: for `/` the LCP was 1.8–2.0 s across runs of the same build.

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
  Measured on the same build: **CLS 0.352 and score 82 without this script, CLS 0 and score 100 with it.**
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
- **Home LCP is 1.9 s, not 0.6 s.** The LCP element is the first product image. It arrives early but is painted one
  frame after the text, and Lighthouse's simulation then counts the 77 KiB JS download before it. A
  `<link rel="preload">` for the image did not change the number (tried, reverted). Inlining the image as a data URI
  or dropping JS might, but neither is worth it for a value already in the "good" range (< 2.5 s) with a score of 100.
- **No field data** (Chrome UX Report / real-user monitoring): the site is not deployed.
- **No service worker / offline mode** and **no cross-tab cart sync** (`storage` event): out of scope for a demo.
- **The cart page with items was not measured** separately; it renders after mount from `localStorage`.
