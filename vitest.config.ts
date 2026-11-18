import { defineConfig } from 'vitest/config'

// Unit tests for plain TypeScript (store logic, helpers). No Nuxt runtime needed.
export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
})
