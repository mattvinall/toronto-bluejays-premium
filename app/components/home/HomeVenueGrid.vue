<script setup lang="ts">
const { venues } = useVenues()
</script>

<template>
  <section class="max-w-7xl mx-auto px-6 py-24">
    <div class="flex items-end justify-between mb-12">
      <div>
        <p class="text-jays-red font-medium tracking-widest uppercase text-sm mb-2">Premium Venues</p>
        <h2 class="font-display font-bold text-4xl">Five spaces. One ballpark.</h2>
      </div>
      <NuxtLink to="/venues" class="hidden md:inline text-sm font-medium text-jays-navy hover:underline">
        See all venues →
      </NuxtLink>
    </div>
    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <VenueCard v-for="v in venues" :key="v.slug" :venue="v" />
    </div>
  </section>
</template>
