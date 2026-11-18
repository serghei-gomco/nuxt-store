import { categories, type Category, type Product } from '../data/products'

/** Reads `?category=` from the URL. Unknown or repeated values mean "all". */
export function parseCategory(value: unknown): Category | null {
  if (typeof value !== 'string') return null
  return categories.some(c => c.id === value) ? (value as Category) : null
}

/** Returns the products of one category, or all products when category is null. */
export function filterProducts(list: Product[], category: Category | null): Product[] {
  return category ? list.filter(p => p.category === category) : list
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
}
