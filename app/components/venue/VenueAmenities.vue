<script setup lang="ts">
import type { Venue } from '~/types/venue'
defineProps<{ amenities: Venue['amenities'] }>()
</script>

<template>
  <section class="max-w-7xl mx-auto px-6 py-16">
    <h2 class="font-display font-bold text-3xl mb-8">What's included</h2>
    <ul class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <li v-for="a in amenities" :key="a.label" class="flex items-start gap-3">
        <span class="flex-shrink-0 w-10 h-10 rounded-full bg-jays-navy/10 text-jays-navy flex items-center justify-center text-lg">
          ✓
        </span>
        <span class="text-slate-700 mt-1">{{ a.label }}</span>
      </li>
    </ul>
  </section>
</template>
