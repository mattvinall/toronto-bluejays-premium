<script setup lang="ts">
const { upcomingGames } = useSchedule()
const next6 = computed(() => upcomingGames.value.slice(0, 6))

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-CA', {
  month: 'short', day: 'numeric', weekday: 'short'
})
</script>

<template>
  <section class="bg-jays-cream py-16">
    <div class="max-w-7xl mx-auto px-6">
      <p class="text-jays-red font-medium tracking-widest uppercase text-sm mb-2">Upcoming Home Games</p>
      <h2 class="font-display font-bold text-3xl mb-8">Book a premium experience for any game.</h2>
      <ul class="flex gap-4 overflow-x-auto pb-4">
        <li v-for="g in next6" :key="g.id" v-reveal class="flex-shrink-0 w-64 bg-white rounded-lg p-5 border border-slate-200">
          <p class="text-xs uppercase tracking-wider text-slate-500">{{ formatDate(g.date) }}</p>
          <p class="mt-2 font-display font-bold text-lg">vs. {{ g.opponent }}</p>
          <p v-if="g.promotion" class="mt-1 text-xs text-jays-red font-medium">{{ g.promotion }}</p>
          <p class="mt-3 text-sm text-slate-600">First pitch {{ g.firstPitch }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>
