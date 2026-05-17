<script setup lang="ts">
defineProps<{ current: number; total: number; labels: string[] }>()
</script>

<template>
  <ol class="flex items-center gap-2 mb-12" aria-label="Inquiry progress">
    <li v-for="(label, i) in labels" :key="label" class="flex-1 flex items-center gap-2">
      <span
        class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
        :class="i < current ? 'bg-jays-navy text-white' : i === current ? 'bg-jays-red text-white' : 'bg-slate-200 text-slate-500'"
      >
        {{ i + 1 }}
      </span>
      <span class="text-xs uppercase tracking-wider hidden sm:inline" :class="i === current ? 'text-jays-navy font-medium' : 'text-slate-500'">
        {{ label }}
      </span>
      <span v-if="i < labels.length - 1" class="flex-1 h-px bg-slate-200"></span>
    </li>
  </ol>
</template>
