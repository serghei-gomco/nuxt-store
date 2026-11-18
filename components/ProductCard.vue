<template>
  <article class="card" :data-category="product.category">
    <NuxtLink :to="`/products/${product.slug}`" class="card-link">
      <img
        :src="product.image"
        alt=""
        width="400"
        height="400"
        :loading="eager ? 'eager' : 'lazy'"
        :fetchpriority="eager ? 'high' : undefined"
      >
      <h2 class="name">{{ product.name }}</h2>
    </NuxtLink>
    <p class="summary">{{ product.summary }}</p>
    <p class="price">{{ formatPrice(product.priceCents) }}</p>
  </article>
</template>

<script setup lang="ts">
import type { Product } from '~/data/products'

defineProps<{ product: Product, eager?: boolean }>()
</script>

<style scoped>
.card { display: flex; flex-direction: column; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; }
.card-link { color: var(--text); text-decoration: none; }
.card-link img { width: 100%; aspect-ratio: 1 / 1; }
.card-link:hover .name { text-decoration: underline; }
.name { margin: 12px 12px 4px; font-size: 1rem; }
.summary { margin: 0 12px; font-size: 0.875rem; color: var(--muted); flex: 1; }
.price { margin: 8px 12px 12px; font-weight: 700; }
</style>
