import { describe, expect, it } from 'vitest'
import { products } from '../data/products'
import { filterProducts, formatPrice, parseCategory } from '../utils/filter'

describe('parseCategory', () => {
  it('accepts known categories', () => {
    expect(parseCategory('kitchen')).toBe('kitchen')
  })

  it('treats unknown, empty, missing and repeated values as "all"', () => {
    expect(parseCategory('shoes')).toBeNull()
    expect(parseCategory('')).toBeNull()
    expect(parseCategory(undefined)).toBeNull()
    expect(parseCategory(['kitchen', 'desk'])).toBeNull()
  })
})

describe('filterProducts', () => {
  it('returns every product when no category is selected', () => {
    expect(filterProducts(products, null)).toHaveLength(products.length)
  })

  it('returns only products of the selected category', () => {
    const desk = filterProducts(products, 'desk')
    expect(desk.length).toBeGreaterThan(0)
    expect(desk.every(p => p.category === 'desk')).toBe(true)
  })
})

describe('formatPrice', () => {
  it('formats cents as US dollars', () => {
    expect(formatPrice(1800)).toBe('$18.00')
    expect(formatPrice(12345)).toBe('$123.45')
  })
})
