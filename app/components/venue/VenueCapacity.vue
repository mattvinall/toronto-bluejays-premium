<script setup lang="ts">
import type { Venue } from '~/types/venue'
defineProps<{ venue: Venue }>()
</script>

<template>
  <section class="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">
    <div>
      <p class="text-xs uppercase tracking-wider text-slate-500 mb-1">Capacity</p>
      <p class="font-display text-3xl font-bold">{{ venue.capacity.min }}–{{ venue.capacity.max }}</p>
      <p class="text-sm text-slate-600">guests · ~{{ venue.capacity.recommended }} ideal</p>
    </div>
    <div>
      <p class="text-xs uppercase tracking-wider text-slate-500 mb-1">Per game</p>
      <p class="font-display text-3xl font-bold">${{ venue.pricing.perGameFrom.toLocaleString() }}–${{ venue.pricing.perGameTo.toLocaleString() }}</p>
      <p v-if="venue.pricing.note" class="text-sm text-slate-600">{{ venue.pricing.note }}</p>
    </div>
    <div>
      <p class="text-xs uppercase tracking-wider text-slate-500 mb-1">Location</p>
      <p class="font-display text-3xl font-bold">Level {{ venue.location.level }}</p>
      <p class="text-sm text-slate-600">{{ venue.location.section }}</p>
    </div>
  </section>
</template>
