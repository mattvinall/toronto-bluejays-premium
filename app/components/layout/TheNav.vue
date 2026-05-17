<script setup lang="ts">
const compare = useCompareStore()

const links = [
  { to: '/', label: 'Home' },
  { to: '/venues', label: 'Venues' },
  { to: '/compare', label: 'Compare', showCount: true },
  { to: '/inquire', label: 'Inquire' }
]
</script>

<template>
  <nav aria-label="Primary">
    <ul class="flex items-center gap-6">
      <li v-for="link in links" :key="link.to">
        <NuxtLink
          :to="link.to"
          class="text-sm font-medium text-slate-700 hover:text-jays-navy transition-colors"
          active-class="text-jays-navy"
        >
          {{ link.label }}
          <span
            v-if="link.showCount && compare.count > 0"
            class="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs rounded-full bg-jays-red text-white"
            :aria-label="`${compare.count} venues saved`"
          >
            {{ compare.count }}
          </span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
