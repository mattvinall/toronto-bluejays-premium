<script setup lang="ts">
import type { VenueImage } from '~/types/venue'
defineProps<{ images: VenueImage[] }>()
</script>

<template>
  <section v-if="images.length" class="max-w-7xl mx-auto px-6 py-16">
    <h2 class="font-display font-bold text-3xl mb-8">Gallery</h2>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <figure v-for="img in images" :key="img.src">
        <NuxtImg :src="img.src" :alt="img.alt" class="w-full h-72 object-cover rounded-md" loading="lazy" sizes="(min-width: 1024px) 33vw, 50vw" />
        <figcaption v-if="img.caption" class="mt-2 text-sm text-slate-600">{{ img.caption }}</figcaption>
      </figure>
    </div>
  </section>
</template>
