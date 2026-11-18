<template>
  <div>
    <h1>Everyday goods, made to last</h1>
    <p class="lead">A small fictional catalogue. Pick a category or open a product.</p>

    <nav aria-label="Product categories" class="filters">
      <NuxtLink to="/" class="chip" :aria-current="selected === null ? 'true' : undefined">All</NuxtLink>
      <NuxtLink
        v-for="c in categories"
        :key="c.id"
        :to="{ path: '/', query: { category: c.id } }"
        class="chip"
        :aria-current="selected === c.id ? 'true' : undefined"
      >
        {{ c.label }}
      </NuxtLink>
    </nav>

    <p class="count" aria-live="polite">{{ visible.length }} products</p>

    <div class="grid">
      <ProductCard v-for="(p, i) in visible" :key="p.slug" :product="p" :eager="i < 4" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { categories, products } from '~/data/products'
import { filterProducts, parseCategory } from '~/utils/filter'

const route = useRoute()

// The page is prerendered once, without a query string (a static host never sees `?category=`).
// So until the app has mounted we render the same "all products" list as the HTML, then apply the filter.
const mounted = ref(false)
const selected = computed(() => (mounted.value ? parseCategory(route.query.category) : null))
const visible = computed(() => filterProducts(products, selected.value))

onMounted(() => {
  mounted.value = true
})

useSeoMeta({
  title: 'Shop',
  description: 'Quietfield Goods — a fictional Nuxt 3 demo store with a fast, statically generated catalogue.',
  ogTitle: 'Quietfield Goods — demo store',
  ogDescription: 'A fictional Nuxt 3 storefront built as a personal portfolio project.',
})
</script>

<style scoped>
h1 { margin: 0 0 8px; font-size: 1.75rem; }
.lead { margin: 0 0 16px; color: var(--muted); }
.filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.chip { display: inline-flex; align-items: center; min-height: 44px; padding: 0 16px; border: 1px solid var(--border); border-radius: 999px; background: var(--surface); color: var(--text); text-decoration: none; }
.chip[aria-current='true'] { background: var(--accent); border-color: var(--accent); color: #fff; }
.count { margin: 0 0 12px; font-size: 0.875rem; color: var(--muted); }
.grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
@media (min-width: 720px) { .grid { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; } }
@media (min-width: 960px) { .grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
</style>
