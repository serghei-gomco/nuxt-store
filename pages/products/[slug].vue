<template>
  <article class="product">
    <img
      :src="product.image"
      :alt="product.name"
      width="400"
      height="400"
      fetchpriority="high"
      class="product-image"
    >
    <div>
      <p class="crumbs"><NuxtLink to="/">Shop</NuxtLink> / {{ categoryLabel }}</p>
      <h1>{{ product.name }}</h1>
      <p class="price">{{ formatPrice(product.priceCents) }}</p>
      <p>{{ product.description }}</p>

      <div class="buy">
        <button type="button" class="btn" @click="addToCart">Add to cart</button>
        <!-- Space is always reserved for this message, so showing it does not move anything. -->
        <p class="added" role="status">{{ added ? `Added. ${cart.count} in cart.` : '' }}</p>
      </div>
      <NuxtLink to="/cart" class="btn btn-ghost">Go to cart</NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import { categories, findProduct } from '~/data/products'
import { useCartStore } from '~/stores/cart'

const route = useRoute()
const found = findProduct(String(route.params.slug))
if (!found) {
  throw createError({ statusCode: 404, statusMessage: 'Product not found', fatal: true })
}
const product = found

const categoryLabel = categories.find(c => c.id === product.category)?.label
const cart = useCartStore()
const added = ref(false)

function addToCart() {
  cart.add(product.slug)
  added.value = true
}

const { siteUrl } = useRuntimeConfig().public

useSeoMeta({
  title: product.name,
  description: product.summary,
  ogTitle: `${product.name} — Quietfield Goods (demo)`,
  ogDescription: product.summary,
  ogImage: `${siteUrl}${product.image}`,
})
</script>

<style scoped>
.product { display: grid; gap: 24px; }
@media (min-width: 720px) { .product { grid-template-columns: 1fr 1fr; gap: 40px; } }
.product-image { width: 100%; max-width: 480px; aspect-ratio: 1 / 1; border-radius: var(--radius); }
.crumbs { margin: 0; font-size: 0.875rem; color: var(--muted); }
h1 { margin: 4px 0 8px; font-size: 1.75rem; }
.price { margin: 0 0 12px; font-size: 1.25rem; font-weight: 700; }
.buy { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; margin: 20px 0 12px; }
.added { margin: 0; min-height: 1.5em; min-width: 12ch; color: var(--muted); }
</style>
