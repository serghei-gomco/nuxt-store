// Fictional catalogue for the demo. Prices are in cents to avoid float rounding.

export type Category = 'kitchen' | 'desk' | 'outdoor' | 'home'

export interface Product {
  slug: string
  name: string
  category: Category
  priceCents: number
  summary: string
  description: string
  /** Path to a local SVG in /public/images (all 400×400). */
  image: string
}

export const categories: { id: Category, label: string }[] = [
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'desk', label: 'Desk' },
  { id: 'outdoor', label: 'Outdoor' },
  { id: 'home', label: 'Home' },
]

export const products: Product[] = [
  {
    slug: 'stoneware-mug',
    name: 'Stoneware Mug',
    category: 'kitchen',
    priceCents: 1800,
    summary: 'A heavy 350 ml mug that keeps coffee warm.',
    description: 'Glazed stoneware with a wide handle. Dishwasher and microwave safe. Each glaze comes out slightly different.',
    image: '/images/stoneware-mug.svg',
  },
  {
    slug: 'olive-wood-board',
    name: 'Olive Wood Board',
    category: 'kitchen',
    priceCents: 3400,
    summary: 'A cutting and serving board in one.',
    description: 'Cut from a single piece of olive wood, finished with food-safe oil. Hand wash only.',
    image: '/images/olive-wood-board.svg',
  },
  {
    slug: 'pour-over-kettle',
    name: 'Pour-Over Kettle',
    category: 'kitchen',
    priceCents: 5900,
    summary: 'A gooseneck kettle for slow, even pouring.',
    description: 'One-litre stainless steel kettle with a thin spout and a built-in thermometer. Works on gas and induction.',
    image: '/images/pour-over-kettle.svg',
  },
  {
    slug: 'linen-notebook',
    name: 'Linen Notebook',
    category: 'desk',
    priceCents: 1400,
    summary: 'A5 dotted notebook with a linen cover.',
    description: '192 pages of 100 g/m² paper that lies flat. Two ribbon markers and a pocket at the back.',
    image: '/images/linen-notebook.svg',
  },
  {
    slug: 'brass-desk-lamp',
    name: 'Brass Desk Lamp',
    category: 'desk',
    priceCents: 8900,
    summary: 'A small adjustable lamp with warm light.',
    description: 'Brushed brass arm, fabric cable and a dimmable 2700 K LED. Fits a narrow desk.',
    image: '/images/brass-desk-lamp.svg',
  },
  {
    slug: 'cork-desk-mat',
    name: 'Cork Desk Mat',
    category: 'desk',
    priceCents: 2600,
    summary: 'A soft, quiet surface for keyboard and mouse.',
    description: 'Natural cork on a non-slip base, 80 × 30 cm. Easy to wipe clean.',
    image: '/images/cork-desk-mat.svg',
  },
  {
    slug: 'canvas-daypack',
    name: 'Canvas Daypack',
    category: 'outdoor',
    priceCents: 7200,
    summary: 'A 20-litre backpack for city and trail.',
    description: 'Waxed canvas body, padded laptop sleeve and a water bottle pocket on each side.',
    image: '/images/canvas-daypack.svg',
  },
  {
    slug: 'enamel-camp-cup',
    name: 'Enamel Camp Cup',
    category: 'outdoor',
    priceCents: 1200,
    summary: 'A light cup that survives the campfire.',
    description: 'Enamelled steel, 300 ml, with a rolled rim. Stack three in the space of one.',
    image: '/images/enamel-camp-cup.svg',
  },
  {
    slug: 'wool-picnic-blanket',
    name: 'Wool Picnic Blanket',
    category: 'outdoor',
    priceCents: 6400,
    summary: 'A warm blanket with a water-resistant back.',
    description: 'Recycled wool on one side, coated polyester on the other. Rolls up with a leather strap.',
    image: '/images/wool-picnic-blanket.svg',
  },
  {
    slug: 'ceramic-vase',
    name: 'Ceramic Vase',
    category: 'home',
    priceCents: 3900,
    summary: 'A simple matte vase for dried flowers.',
    description: 'Hand-thrown ceramic, 22 cm tall, sealed inside so it also holds water.',
    image: '/images/ceramic-vase.svg',
  },
  {
    slug: 'soy-candle',
    name: 'Soy Candle',
    category: 'home',
    priceCents: 2200,
    summary: 'A 40-hour candle with a light cedar scent.',
    description: 'Soy wax in a reusable glass jar with a cotton wick. Poured in small batches.',
    image: '/images/soy-candle.svg',
  },
  {
    slug: 'cotton-throw',
    name: 'Cotton Throw',
    category: 'home',
    priceCents: 4800,
    summary: 'A soft woven throw for the sofa.',
    description: 'Heavy cotton weave with short fringes, 130 × 170 cm. Machine washable.',
    image: '/images/cotton-throw.svg',
  },
]

export function findProduct(slug: string): Product | undefined {
  return products.find(p => p.slug === slug)
}
