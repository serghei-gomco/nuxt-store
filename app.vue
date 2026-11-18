<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <AppHeader />
  <p class="demo-note">
    Personal demo project by Serghei Gomco — fictional products, no real orders.
  </p>
  <main id="main" class="container">
    <NuxtPage />
  </main>
  <footer class="site-footer">
    <div class="container">
      Quietfield Goods is a fictional store built with Nuxt 3 as a portfolio demo. Nothing here is for sale.
    </div>
  </footer>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: title => (title ? `${title} · Quietfield Goods` : 'Quietfield Goods — demo store'),
})
</script>

<style>
/* Global styles. Kept in app.vue so Nuxt inlines them into the HTML (no render-blocking CSS request). */
:root {
  --bg: #faf7f2;
  --surface: #ffffff;
  --text: #1f2421;
  --muted: #545b56; /* 7:1 on --bg */
  --accent: #2f4a3a; /* 9:1 with white text */
  --accent-soft: #e3ebe5;
  --border: #ddd6cb;
  --radius: 12px;
  --font: system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body { margin: 0; font-family: var(--font); line-height: 1.5; color: var(--text); background: var(--bg); }
img { display: block; max-width: 100%; height: auto; }
a { color: var(--accent); }
h1, h2, h3 { line-height: 1.2; }
button { font: inherit; }
:focus-visible { outline: 3px solid #1d6fd6; outline-offset: 2px; }

.container { width: 100%; max-width: 1080px; margin: 0 auto; padding: 0 16px; }
main.container { min-height: 70vh; padding-top: 24px; padding-bottom: 48px; }

.skip-link { position: absolute; left: 8px; top: -48px; padding: 8px 12px; background: var(--surface); border-radius: 8px; z-index: 10; }
.skip-link:focus { top: 8px; }

.demo-note { margin: 0; padding: 8px 16px; text-align: center; font-size: 0.875rem; background: var(--accent-soft); color: var(--text); }

.btn { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 0 20px; border: 0; border-radius: 999px; background: var(--accent); color: #fff; font-weight: 600; text-decoration: none; cursor: pointer; }
.btn:hover { background: #22372b; }
.btn-ghost { background: transparent; color: var(--accent); border: 1px solid var(--accent); }
.btn-ghost:hover { background: var(--accent-soft); }

.site-footer { padding: 24px 0; border-top: 1px solid var(--border); font-size: 0.875rem; color: var(--muted); }
.visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
</style>
