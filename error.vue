<template>
  <div class="container error-page">
    <h1>{{ error?.statusCode === 404 ? 'Page not found' : 'Something went wrong' }}</h1>
    <p>{{ error?.statusCode === 404 ? 'This product does not exist in the demo catalogue.' : 'Please try again.' }}</p>
    <button type="button" class="btn" @click="clearError({ redirect: '/' })">Back to the shop</button>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()
useSeoMeta({ title: 'Not found', robots: 'noindex' })
</script>

<style scoped>
.error-page { padding: 48px 16px; font-family: system-ui, sans-serif; }
</style>
