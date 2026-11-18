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
