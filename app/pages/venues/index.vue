<script setup lang="ts">
useHead({ title: 'Venues — Blue Jays Premium' })

const { venues } = useVenues()
const { filtered, type, capacityMin, capacityMax, setType, setCapacityRange, clear } = useVenueFilter(venues)
</script>

<template>
  <div class="max-w-7xl mx-auto px-6 py-16">
    <h1 class="font-display font-bold text-5xl mb-2">Premium Venues</h1>
    <p class="text-lg text-slate-600 mb-10">Find the space that fits your group, your occasion, and your budget.</p>

    <VenueFilterBar
      :type="type"
      :capacity-min="capacityMin"
      :capacity-max="capacityMax"
      @set-type="setType"
      @set-capacity="setCapacityRange"
      @clear="clear"
    />

    <p class="mt-6 text-sm text-slate-500">
      Showing {{ filtered.length }} of {{ venues.length }} venues.
    </p>

    <div class="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <VenueCard v-for="v in filtered" :key="v.slug" :venue="v" />
    </div>

    <div v-if="filtered.length === 0" class="mt-12 text-center text-slate-500">
      No venues match these filters.
    </div>
  </div>
</template>
