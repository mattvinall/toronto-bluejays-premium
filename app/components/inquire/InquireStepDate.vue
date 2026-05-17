<script setup lang="ts">
defineProps<{ modelValue: string; error?: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

const { upcomingGames } = useSchedule()
const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' })
</script>

<template>
  <fieldset>
    <legend class="font-display font-bold text-3xl mb-2">Preferred date?</legend>
    <p class="text-slate-600 mb-8">Pick a game, or tell us you're flexible.</p>
    <div class="space-y-3">
      <label class="flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors" :class="modelValue === 'flexible' ? 'border-jays-navy bg-jays-navy/5' : 'border-slate-200 hover:border-jays-navy/50'">
        <input type="radio" value="flexible" :checked="modelValue === 'flexible'" class="accent-jays-navy" @change="emit('update:modelValue', 'flexible')" />
        <span>I'm flexible — recommend dates for me.</span>
      </label>
      <label v-for="g in upcomingGames" :key="g.id" class="flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors" :class="modelValue === g.date ? 'border-jays-navy bg-jays-navy/5' : 'border-slate-200 hover:border-jays-navy/50'">
        <input type="radio" :value="g.date" :checked="modelValue === g.date" class="accent-jays-navy" @change="emit('update:modelValue', g.date)" />
        <span class="font-medium">{{ formatDate(g.date) }}</span>
        <span class="text-slate-500 text-sm">vs. {{ g.opponent }} · {{ g.firstPitch }}</span>
        <span v-if="g.promotion" class="ml-auto text-xs text-jays-red font-medium">{{ g.promotion }}</span>
      </label>
    </div>
    <p v-if="error" role="alert" class="mt-3 text-sm text-jays-red">{{ error }}</p>
  </fieldset>
</template>
