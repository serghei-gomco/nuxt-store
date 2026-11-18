import { defineStore } from 'pinia'
import { findProduct } from '../data/products'

export interface CartLine {
  slug: string
  qty: number
}

export const MAX_QTY = 10
export const STORAGE_KEY = 'demo-cart-v1'

export const useCartStore = defineStore('cart', {
  state: () => ({
    lines: [] as CartLine[],
    /** false until the saved cart is read from localStorage (client only). */
    restored: false,
  }),

  getters: {
    count: state => state.lines.reduce((sum, line) => sum + line.qty, 0),
    totalCents: state => state.lines.reduce(
      (sum, line) => sum + (findProduct(line.slug)?.priceCents ?? 0) * line.qty, 0),
    /** Lines joined with product data, for rendering. */
    items: state => state.lines.flatMap((line) => {
      const product = findProduct(line.slug)
      return product ? [{ ...line, product }] : []
    }),
  },

  actions: {
    add(slug: string, qty = 1) {
      if (!findProduct(slug)) return
      const line = this.lines.find(l => l.slug === slug)
      if (line) line.qty = Math.min(MAX_QTY, line.qty + qty)
      else this.lines.push({ slug, qty: Math.min(MAX_QTY, qty) })
    },

    setQty(slug: string, qty: number) {
      if (!Number.isInteger(qty) || qty < 1) return this.remove(slug)
      const line = this.lines.find(l => l.slug === slug)
      if (line) line.qty = Math.min(MAX_QTY, qty)
    },

    remove(slug: string) {
      this.lines = this.lines.filter(l => l.slug !== slug)
    },

    clear() {
      this.lines = []
    },

    /** Loads a saved cart. Anything malformed or unknown is dropped, so old or edited data cannot break the page. */
    restore(raw: string | null) {
      this.restored = true
      if (!raw) return
      try {
        const data: unknown = JSON.parse(raw)
        if (!Array.isArray(data)) return
        this.lines = []
        for (const item of data) {
          if (item && typeof item.slug === 'string' && Number.isInteger(item.qty) && item.qty > 0)
            this.add(item.slug, item.qty)
        }
      }
      catch {
        // corrupted JSON: start with an empty cart
      }
    },
  },
})
