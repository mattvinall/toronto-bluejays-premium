<script setup lang="ts">
withDefaults(defineProps<{
  padding?: 'none' | 'sm' | 'md' | 'lg'
  interactive?: boolean
}>(), { padding: 'md', interactive: false })
</script>

<template>
  <div
    :class="[
      'bg-white rounded-lg border border-slate-200',
      padding === 'none' && '',
      padding === 'sm' && 'p-3',
      padding === 'md' && 'p-5',
      padding === 'lg' && 'p-7',
      interactive && 'transition-shadow hover:shadow-lg hover:-translate-y-0.5 duration-300'
    ]"
  >
    <slot />
  </div>
</template>
