<script setup lang="ts">
import type { Venue } from '~/types/venue'

defineProps<{ venue: Venue }>()
</script>

<template>
  <section class="relative h-[60vh] min-h-[420px] bg-jays-blue overflow-hidden">
    <NuxtImg
      :src="venue.images.hero.src"
      :alt="venue.images.hero.alt"
      class="absolute inset-0 w-full h-full object-cover opacity-60"
      loading="eager"
      fetchpriority="high"
      sizes="100vw"
    />
    <div class="relative max-w-7xl mx-auto px-6 h-full flex flex-col justify-end pb-12 text-white">
      <p class="text-jays-red font-medium tracking-widest uppercase text-sm mb-2">{{ venue.type.replace('-', ' ') }}</p>
      <h1 class="font-display font-bold text-5xl md:text-7xl">{{ venue.name }}</h1>
      <p class="mt-4 text-xl text-white/85 max-w-2xl">{{ venue.tagline }}</p>
    </div>
  </section>
</template>
