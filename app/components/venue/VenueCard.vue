<script setup lang="ts">
import type { Venue } from '~/types/venue'

const props = defineProps<{ venue: Venue }>()

const compare = useCompareStore()
const isSaved = computed(() => compare.has(props.venue.slug))

const typeLabel: Record<Venue['type'], string> = {
  suite: 'Private Suite',
  club: 'Premium Club',
  'group-space': 'Group Space',
  patio: 'Patio'
}

const onToggle = (e: MouseEvent) => {
  e.preventDefault()
  compare.toggle(props.venue.slug)
}
</script>

<template>
  <NuxtLink
    :to="`/venues/${venue.slug}`"
    class="group relative block rounded-lg overflow-hidden bg-white border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
  >
    <button
      type="button"
      :aria-label="isSaved ? `Remove ${venue.name} from compare list` : `Add ${venue.name} to compare list`"
      :aria-pressed="isSaved"
      class="absolute top-3 right-3 z-10 inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-sm font-semibold backdrop-blur shadow-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jays-red"
      :class="isSaved ? 'bg-jays-red text-white hover:bg-jays-red/90' : 'bg-white/95 text-jays-navy hover:bg-white'"
      @click="onToggle"
    >
      <span aria-hidden="true" class="text-base leading-none">{{ isSaved ? '✓' : '+' }}</span>
      {{ isSaved ? 'Comparing' : 'Compare' }}
    </button>
    <div class="aspect-[4/3] overflow-hidden bg-slate-100">
      <NuxtImg
        :src="venue.images.hero.src"
        :alt="venue.images.hero.alt"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
        sizes="sm:50vw md:50vw lg:400px"
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
