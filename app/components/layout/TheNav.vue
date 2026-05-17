<script setup lang="ts">
const links = [
  { to: '/', label: 'Home' },
  { to: '/venues', label: 'Venues' },
  { to: '/compare', label: 'Compare' },
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
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
