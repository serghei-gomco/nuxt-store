// Writes one small SVG illustration per product into public/images.
// Run once: `node scripts/generate-images.mjs`. The output is committed, so the build does not need it.
import { mkdirSync, writeFileSync } from 'node:fs'

// slug → [background from, background to, object colour, shape]
const items = {
  'stoneware-mug': ['#f3e3d3', '#e2c3a4', '#6b4f3a', 'mug'],
  'olive-wood-board': ['#eef0dc', '#d3d8ad', '#8a6a3b', 'board'],
  'pour-over-kettle': ['#e4ecef', '#c3d3da', '#41545c', 'kettle'],
  'linen-notebook': ['#efe9df', '#d9cdb9', '#4a5d4f', 'book'],
  'brass-desk-lamp': ['#f6efd9', '#e6d29a', '#8c6b1f', 'lamp'],
  'cork-desk-mat': ['#f1e6d6', '#dcc3a0', '#9b7348', 'mat'],
  'canvas-daypack': ['#e6eadf', '#c5ceb4', '#55613f', 'bag'],
  'enamel-camp-cup': ['#e3eaf2', '#bccbdc', '#2f4a6b', 'cup'],
  'wool-picnic-blanket': ['#f2e1df', '#ddb8b3', '#8a3d35', 'blanket'],
  'ceramic-vase': ['#ebe7f0', '#cfc6dc', '#5b4d70', 'vase'],
  'soy-candle': ['#f5ece1', '#e4d0b5', '#7a5b3a', 'candle'],
  'cotton-throw': ['#e5eeea', '#c1d6cc', '#3f6656', 'throw'],
}

const shapes = {
  mug: c => `<rect x="130" y="140" width="120" height="140" rx="18" fill="${c}"/><path d="M250 175h22a28 28 0 0 1 0 56h-22" fill="none" stroke="${c}" stroke-width="16"/>`,
  board: c => `<rect x="100" y="150" width="200" height="120" rx="30" fill="${c}"/><circle cx="300" cy="210" r="14" fill="${c}"/>`,
  kettle: c => `<path d="M130 290h140l-15-120h-110z" fill="${c}"/><path d="M270 200l50-40" stroke="${c}" stroke-width="12" stroke-linecap="round"/><path d="M150 165a50 40 0 0 1 100 0" fill="none" stroke="${c}" stroke-width="12"/>`,
  book: c => `<rect x="130" y="110" width="140" height="180" rx="8" fill="${c}"/><rect x="250" y="110" width="8" height="180" fill="#fff" opacity=".5"/>`,
  lamp: c => `<path d="M150 130h90l-25 60h-40z" fill="${c}"/><path d="M195 190v90M150 290h90" stroke="${c}" stroke-width="12" stroke-linecap="round"/>`,
  mat: c => `<rect x="80" y="170" width="240" height="90" rx="14" fill="${c}"/>`,
  bag: c => `<rect x="135" y="140" width="130" height="160" rx="30" fill="${c}"/><path d="M165 140a35 35 0 0 1 70 0" fill="none" stroke="${c}" stroke-width="12"/><rect x="160" y="210" width="80" height="40" rx="8" fill="#fff" opacity=".35"/>`,
  cup: c => `<path d="M140 160h110l-10 120h-90z" fill="${c}"/><path d="M250 180h16a22 22 0 0 1 0 44h-20" fill="none" stroke="${c}" stroke-width="12"/><rect x="135" y="152" width="120" height="12" rx="6" fill="#fff" opacity=".6"/>`,
  blanket: c => `<rect x="100" y="140" width="200" height="140" rx="12" fill="${c}"/><path d="M100 185h200M100 235h200M165 140v140M235 140v140" stroke="#fff" stroke-width="6" opacity=".45"/>`,
  vase: c => `<path d="M175 110h50v30c40 25 45 120 20 150h-90c-25-30-20-125 20-150z" fill="${c}"/>`,
  candle: c => `<rect x="145" y="170" width="110" height="120" rx="12" fill="${c}"/><path d="M200 170v-25" stroke="#3a2a1a" stroke-width="4"/><path d="M200 112c12 14 12 26 0 32c-12-6-12-18 0-32z" fill="#e8a33a"/>`,
  throw: c => `<path d="M110 150h180v120h-180z" fill="${c}"/><path d="M110 270v14M130 270v14M150 270v14M170 270v14M190 270v14M210 270v14M230 270v14M250 270v14M270 270v14M290 270v14" stroke="${c}" stroke-width="4"/>`,
}

mkdirSync('public/images', { recursive: true })
for (const [slug, [from, to, color, shape]] of Object.entries(items)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs><rect width="400" height="400" fill="url(#g)"/>${shapes[shape](color)}</svg>\n`
  writeFileSync(`public/images/${slug}.svg`, svg)
}
console.log(`Wrote ${Object.keys(items).length} SVGs to public/images`)
