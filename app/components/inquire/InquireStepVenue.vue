<script setup lang="ts">
defineProps<{ modelValue: string; error?: string }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

const { venues } = useVenues()
</script>

<template>
  <fieldset>
    <legend class="font-display font-bold text-3xl mb-2">Which venue?</legend>
    <p class="text-slate-600 mb-8">Pick the space that fits your group.</p>
    <div class="grid sm:grid-cols-2 gap-4">
      <label
        v-for="v in venues"
        :key="v.slug"
        class="cursor-pointer border rounded-lg p-4 transition-all"
        :class="modelValue === v.slug ? 'border-jays-navy ring-2 ring-jays-navy bg-jays-navy/5' : 'border-slate-200 hover:border-jays-navy/50'"
      >
        <input type="radio" :value="v.slug" :checked="modelValue === v.slug" class="sr-only" @change="emit('update:modelValue', v.slug)" />
        <BaseBadge tone="jays" class="mb-2">{{ v.type }}</BaseBadge>
        <p class="font-display font-bold text-lg">{{ v.name }}</p>
        <p class="text-sm text-slate-600">{{ v.capacity.min }}–{{ v.capacity.max }} guests</p>
      </label>
    </div>
    <p v-if="error" role="alert" class="mt-3 text-sm text-jays-red">{{ error }}</p>
  </fieldset>
</template>
