<template>
  <header class="header">
    <div class="container header-row">
      <NuxtLink to="/" class="logo">Quietfield Goods</NuxtLink>
      <NuxtLink to="/cart" class="cart-link" :aria-label="cartLabel">
        Cart
        <!-- Fixed-size badge: its box exists before the saved cart is read, so the header never shifts. -->
        <span class="badge" aria-hidden="true">{{ cart.restored ? cart.count : '' }}</span>
      </NuxtLink>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cart = useCartStore()
const cartLabel = computed(() =>
  cart.restored ? `Cart, ${cart.count} ${cart.count === 1 ? 'item' : 'items'}` : 'Cart')
</script>

<style scoped>
.header { background: var(--surface); border-bottom: 1px solid var(--border); }
.header-row { display: flex; align-items: center; justify-content: space-between; height: 60px; }
.logo { font-weight: 700; font-size: 1.125rem; color: var(--text); text-decoration: none; }
.cart-link { display: inline-flex; align-items: center; gap: 8px; min-height: 44px; padding: 0 4px; font-weight: 600; text-decoration: none; }
.badge { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 24px; border-radius: 999px; background: var(--accent); color: #fff; font-size: 0.8125rem; font-variant-numeric: tabular-nums; }
</style>
