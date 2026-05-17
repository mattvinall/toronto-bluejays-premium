<script setup lang="ts">
import type { Venue } from '~/types/venue'

const props = defineProps<{ venue: Venue }>()
const compare = useCompareStore()
const isSaved = computed(() => compare.has(props.venue.slug))
</script>

<template>
  <section class="bg-jays-navy text-white py-16">
    <div class="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <div>
        <h2 class="font-display font-bold text-3xl">Ready to plan {{ venue.name }}?</h2>
        <p class="mt-2 text-white/80">Tell us about your group and a Blue Jays premium associate will follow up within one business day.</p>
      </div>
      <div class="flex gap-3 flex-shrink-0">
        <BaseButton variant="on-dark" size="lg" @click="compare.toggle(venue.slug)">
          {{ isSaved ? 'Saved to compare' : 'Add to compare' }}
        </BaseButton>
        <BaseButton variant="accent" size="lg" as="NuxtLink" :to="`/inquire?venue=${venue.slug}`">
          Plan Your Visit
        </BaseButton>
      </div>
    </div>
  </section>
</template>
