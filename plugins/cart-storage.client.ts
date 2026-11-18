import { STORAGE_KEY, useCartStore } from '~/stores/cart'

// Client-only. The saved cart is read after the app has mounted (hydration is finished),
// so the server HTML and the first client render are identical — no hydration mismatch.
export default defineNuxtPlugin((nuxtApp) => {
  const cart = useCartStore()

  nuxtApp.hook('app:mounted', () => {
    let saved: string | null = null
    try {
      saved = localStorage.getItem(STORAGE_KEY)
    }
    catch {
      // storage blocked (private mode, settings): the cart just won't persist
    }
    cart.restore(saved)

    cart.$subscribe((_mutation, state) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines))
      }
      catch {
        // quota or blocked storage: ignore
      }
    })
  })
})
