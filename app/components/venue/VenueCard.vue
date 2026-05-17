<script setup lang="ts">
import type { Venue } from '~/types/venue'

defineProps<{ venue: Venue }>()

const typeLabel: Record<Venue['type'], string> = {
  suite: 'Private Suite',
  club: 'Premium Club',
  'group-space': 'Group Space',
  patio: 'Patio'
}
</script>

<template>
  <NuxtLink
    :to="`/venues/${venue.slug}`"
    class="group block rounded-lg overflow-hidden bg-white border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
  >
    <div class="aspect-[4/3] overflow-hidden bg-slate-100">
      <NuxtImg
        :src="venue.images.hero.src"
        :alt="venue.images.hero.alt"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
        sizes="(min-width: 1024px) 400px, 50vw"
      />
    </div>
    <div class="p-5">
      <div class="flex items-center justify-between mb-2">
        <BaseBadge tone="jays">{{ typeLabel[venue.type] }}</BaseBadge>
        <span class="text-xs text-slate-500">{{ venue.capacity.min }}–{{ venue.capacity.max }} guests</span>
      </div>
      <h3 class="font-display font-bold text-xl text-jays-navy">{{ venue.name }}</h3>
      <p class="mt-1 text-sm text-slate-600">{{ venue.tagline }}</p>
    </div>
  </NuxtLink>
</template>
