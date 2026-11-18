import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { MAX_QTY, useCartStore } from '../stores/cart'

describe('cart store', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('adds a product and merges repeated adds into one line', () => {
    const cart = useCartStore()
    cart.add('stoneware-mug')
    cart.add('stoneware-mug', 2)
    expect(cart.lines).toEqual([{ slug: 'stoneware-mug', qty: 3 }])
    expect(cart.count).toBe(3)
  })

  it('ignores unknown products', () => {
    const cart = useCartStore()
    cart.add('does-not-exist')
    expect(cart.lines).toEqual([])
  })

  it('caps quantity at MAX_QTY', () => {
    const cart = useCartStore()
    cart.add('soy-candle', 8)
    cart.add('soy-candle', 5)
    expect(cart.lines[0]!.qty).toBe(MAX_QTY)
    cart.setQty('soy-candle', 50)
    expect(cart.lines[0]!.qty).toBe(MAX_QTY)
  })

  it('sets quantity, and removes the line when quantity drops below 1', () => {
    const cart = useCartStore()
    cart.add('linen-notebook')
    cart.setQty('linen-notebook', 4)
    expect(cart.count).toBe(4)
    cart.setQty('linen-notebook', 0)
    expect(cart.lines).toEqual([])
  })

  it('removes one line and keeps the others', () => {
    const cart = useCartStore()
    cart.add('stoneware-mug')
    cart.add('ceramic-vase')
    cart.remove('stoneware-mug')
    expect(cart.lines.map(l => l.slug)).toEqual(['ceramic-vase'])
  })

  it('computes the total in cents', () => {
    const cart = useCartStore()
    cart.add('stoneware-mug', 2) // 2 × 1800
    cart.add('brass-desk-lamp') // 8900
    expect(cart.totalCents).toBe(12500)
    cart.clear()
    expect(cart.totalCents).toBe(0)
  })

  it('restores a saved cart and drops malformed or unknown entries', () => {
    const cart = useCartStore()
    cart.restore(JSON.stringify([
      { slug: 'cotton-throw', qty: 2 },
      { slug: 'gone-product', qty: 1 },
      { slug: 'soy-candle', qty: -3 },
      { slug: 'ceramic-vase', qty: 1.5 },
      null,
    ]))
    expect(cart.restored).toBe(true)
    expect(cart.lines).toEqual([{ slug: 'cotton-throw', qty: 2 }])
  })

  it('survives corrupted storage', () => {
    const cart = useCartStore()
    cart.restore('{not json')
    expect(cart.restored).toBe(true)
    expect(cart.lines).toEqual([])
  })
})
