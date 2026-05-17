<script setup lang="ts">
type Tone = 'neutral' | 'success' | 'warning' | 'jays'
withDefaults(defineProps<{ tone?: Tone }>(), { tone: 'neutral' })

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-slate-100 text-slate-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-800',
  jays: 'bg-jays-navy/10 text-jays-navy'
}
</script>

<template>
  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium" :class="toneClasses[$props.tone ?? 'neutral']">
    <slot />
  </span>
</template>
