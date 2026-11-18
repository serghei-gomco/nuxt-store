// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  modules: ['@pinia/nuxt'],
  devtools: { enabled: false },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#2f4a3a' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },

  experimental: {
    // No useAsyncData in this app, so a separate _payload.json per page is an extra request for nothing.
    // The tiny state is inlined into the HTML instead.
    payloadExtraction: false,
    defaults: {
      // Prefetch a page's JS on hover/focus/touch instead of whenever a link scrolls into view:
      // the grid has 12+ links, and on mobile data we don't want to download every page up front.
      nuxtLink: { prefetchOn: { visibility: false, interaction: true } },
    },
  },

  // Static site: `nuxt generate` crawls links from "/" and prerenders every product page.
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/cart'],
      // `/?category=…` links are the same HTML as "/" — a static host ignores query strings.
      ignore: [(route: string) => route.includes('?')],
      failOnError: true,
    },
  },
})
