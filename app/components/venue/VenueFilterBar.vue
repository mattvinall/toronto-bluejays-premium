<script setup lang="ts">
import type { VenueType } from '~/types/venue'

const props = defineProps<{
  type: VenueType | null
  capacityMin: number | null
  capacityMax: number | null
}>()

const emit = defineEmits<{
  (e: 'setType', t: VenueType | null): void
  (e: 'setCapacity', min: number | null, max: number | null): void
  (e: 'clear'): void
}>()

const types: { value: VenueType; label: string }[] = [
  { value: 'suite', label: 'Suites' },
  { value: 'club', label: 'Clubs' },
  { value: 'group-space', label: 'Group Spaces' },
  { value: 'patio', label: 'Patios' }
]

const capacityBuckets = [
  { label: 'Small (2–25)', min: 2, max: 25 },
  { label: 'Medium (25–100)', min: 25, max: 100 },
  { label: 'Large (100+)', min: 100, max: null as number | null }
]

const isActiveType = (t: VenueType) => props.type === t
const isActiveCap = (min: number | null, max: number | null) =>
  props.capacityMin === min && props.capacityMax === max
const hasFilters = computed(() => props.type !== null || props.capacityMin !== null)
</script>

<template>
  <div class="flex flex-wrap gap-3 items-center">
    <span class="text-xs uppercase tracking-wider text-slate-500 mr-2">Type:</span>
    <button
      v-for="t in types" :key="t.value"
      class="px-3 py-1 rounded-full text-sm border transition-colors"
      :class="isActiveType(t.value) ? 'bg-jays-navy text-white border-jays-navy' : 'bg-white text-slate-700 border-slate-300 hover:border-jays-navy'"
      @click="emit('setType', isActiveType(t.value) ? null : t.value)"
    >
      {{ t.label }}
    </button>

    <span class="text-xs uppercase tracking-wider text-slate-500 mx-2">Capacity:</span>
    <button
      v-for="b in capacityBuckets" :key="b.label"
      class="px-3 py-1 rounded-full text-sm border transition-colors"
      :class="isActiveCap(b.min, b.max) ? 'bg-jays-navy text-white border-jays-navy' : 'bg-white text-slate-700 border-slate-300 hover:border-jays-navy'"
      @click="emit('setCapacity', isActiveCap(b.min, b.max) ? null : b.min, isActiveCap(b.min, b.max) ? null : b.max)"
    >
      {{ b.label }}
    </button>

    <BaseButton v-if="hasFilters" variant="link" size="sm" @click="emit('clear')">
      Clear filters
    </BaseButton>
  </div>
</template>
