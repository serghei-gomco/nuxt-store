<template>
  <div class="cart">
    <h1>Your cart</h1>

    <!-- The saved cart lives in localStorage, which only the browser can read. Until it is read,
         show a placeholder of the same height as the empty state. -->
    <p v-if="!cart.restored" class="placeholder">Loading your cart…</p>

    <div v-else-if="cart.items.length === 0" class="empty">
      <p>Your cart is empty.</p>
      <NuxtLink to="/" class="btn">Browse products</NuxtLink>
    </div>

    <template v-else>
      <ul class="lines">
        <li v-for="item in cart.items" :key="item.slug" class="line">
          <img :src="item.product.image" alt="" width="80" height="80" class="thumb">
          <div class="info">
            <NuxtLink :to="`/products/${item.slug}`" class="line-name">{{ item.product.name }}</NuxtLink>
            <span class="unit">{{ formatPrice(item.product.priceCents) }} each</span>
          </div>
          <label class="qty">
            <span class="visually-hidden">Quantity of {{ item.product.name }}</span>
            <select :value="item.qty" @change="onQty(item.slug, $event)">
              <option v-for="n in MAX_QTY" :key="n" :value="n">{{ n }}</option>
            </select>
          </label>
          <span class="line-total">{{ formatPrice(item.product.priceCents * item.qty) }}</span>
          <button type="button" class="remove" :aria-label="`Remove ${item.product.name}`" @click="cart.remove(item.slug)">
            Remove
          </button>
        </li>
      </ul>

      <div class="summary">
        <p class="total">Total <strong>{{ formatPrice(cart.totalCents) }}</strong></p>
        <p class="note">This is a demo: there is no checkout and no real orders.</p>
        <button type="button" class="btn btn-ghost" @click="cart.clear()">Empty cart</button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { MAX_QTY, useCartStore } from '~/stores/cart'

const cart = useCartStore()

function onQty(slug: string, event: Event) {
  cart.setQty(slug, Number((event.target as HTMLSelectElement).value))
}

useSeoMeta({
  title: 'Cart',
  description: 'Your cart in the Quietfield Goods demo store.',
  robots: 'noindex',
})
</script>

<style scoped>
h1 { margin: 0 0 16px; font-size: 1.75rem; }
.placeholder, .empty { min-height: 120px; }
.placeholder { margin: 0; color: var(--muted); }
.empty p { margin: 0 0 16px; }
.lines { list-style: none; margin: 0 0 24px; padding: 0; border-top: 1px solid var(--border); }
.line { display: grid; grid-template-columns: 64px 1fr auto; grid-template-areas: 'img info total' 'img qty remove'; gap: 8px 12px; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--border); }
@media (min-width: 720px) {
  .line { grid-template-columns: 80px 1fr auto auto auto; grid-template-areas: 'img info qty total remove'; gap: 16px; }
}
.thumb { grid-area: img; width: 100%; aspect-ratio: 1 / 1; border-radius: 8px; }
.info { grid-area: info; display: flex; flex-direction: column; }
.line-name { font-weight: 600; color: var(--text); }
.unit { font-size: 0.875rem; color: var(--muted); }
.qty { grid-area: qty; }
.qty select { min-height: 44px; min-width: 64px; padding: 0 8px; font: inherit; border: 1px solid var(--border); border-radius: 8px; background: var(--surface); color: var(--text); }
.line-total { grid-area: total; font-weight: 700; text-align: right; }
.remove { grid-area: remove; justify-self: end; min-height: 44px; padding: 0 8px; border: 0; background: none; color: var(--accent); text-decoration: underline; cursor: pointer; }
.summary { display: flex; flex-direction: column; align-items: flex-start; gap: 8px; }
.total { margin: 0; font-size: 1.25rem; }
.note { margin: 0 0 8px; font-size: 0.875rem; color: var(--muted); }
</style>
