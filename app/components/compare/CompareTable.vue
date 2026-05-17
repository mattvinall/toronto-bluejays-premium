<script setup lang="ts">
import type { Venue } from '~/types/venue'

defineProps<{ venues: Venue[] }>()
const compare = useCompareStore()

const typeLabel: Record<Venue['type'], string> = {
  suite: 'Private Suite', club: 'Premium Club',
  'group-space': 'Group Space', patio: 'Patio'
}
</script>

<template>
  <div class="overflow-x-auto">
    <table class="w-full border-collapse">
      <thead>
        <tr>
          <th class="text-left p-4 w-40 text-xs uppercase tracking-wider text-slate-500"></th>
          <th v-for="v in venues" :key="v.slug" class="text-left p-4 align-top">
            <NuxtImg :src="v.images.hero.src" :alt="v.images.hero.alt" class="w-full h-32 object-cover rounded-md mb-3" />
            <p class="font-display font-bold text-lg">{{ v.name }}</p>
            <p class="text-xs text-slate-500">{{ typeLabel[v.type] }}</p>
          </th>
        </tr>
      </thead>
      <tbody class="text-sm">
        <tr class="border-t">
          <td class="p-4 font-medium text-slate-500">Capacity</td>
          <td v-for="v in venues" :key="v.slug" class="p-4">{{ v.capacity.min }}–{{ v.capacity.max }}</td>
        </tr>
        <tr class="border-t">
          <td class="p-4 font-medium text-slate-500">Per game</td>
          <td v-for="v in venues" :key="v.slug" class="p-4">${{ v.pricing.perGameFrom.toLocaleString() }}–${{ v.pricing.perGameTo.toLocaleString() }}</td>
        </tr>
        <tr class="border-t">
          <td class="p-4 font-medium text-slate-500">Level</td>
          <td v-for="v in venues" :key="v.slug" class="p-4">{{ v.location.level }}</td>
        </tr>
        <tr class="border-t">
          <td class="p-4 font-medium text-slate-500">Best for</td>
          <td v-for="v in venues" :key="v.slug" class="p-4">{{ v.bestFor.join(', ') }}</td>
        </tr>
        <tr class="border-t">
          <td class="p-4"></td>
          <td v-for="v in venues" :key="v.slug" class="p-4">
            <div class="flex flex-col gap-2">
              <BaseButton size="sm" as="NuxtLink" :to="`/inquire?venue=${v.slug}`">Plan visit</BaseButton>
              <BaseButton variant="link" size="sm" @click="compare.remove(v.slug)">Remove</BaseButton>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
