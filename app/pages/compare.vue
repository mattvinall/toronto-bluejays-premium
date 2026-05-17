<script setup lang="ts">
useHead({ title: 'Compare Venues — Blue Jays Premium' })

const { getVenueBySlug } = useVenues()
const compare = useCompareStore()

const compared = computed(() =>
  compare.slugs.map(slug => getVenueBySlug(slug)).filter((v): v is NonNullable<typeof v> => !!v)
)
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-16">
    <h1 class="font-display font-bold text-5xl mb-2">Compare Venues</h1>
    <p class="text-lg text-slate-600 mb-10">Side-by-side detail for the venues you've saved.</p>
    <CompareTable v-if="compared.length > 0" :venues="compared" />
    <CompareEmptyState v-else />
  </div>
</template>
