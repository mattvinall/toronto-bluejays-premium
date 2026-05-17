<script setup lang="ts">
defineProps<{
  groupSize: number | null
  occasion: string
  errors: { groupSize?: string; occasion?: string }
}>()
const emit = defineEmits<{
  (e: 'update:groupSize', v: number | null): void
  (e: 'update:occasion', v: string): void
}>()

const occasionOptions = [
  { value: '', label: 'Choose…' },
  { value: 'corporate', label: 'Corporate / client hosting' },
  { value: 'birthday', label: 'Birthday / personal celebration' },
  { value: 'wedding', label: 'Wedding-adjacent / large milestone' },
  { value: 'other', label: 'Other' }
]
</script>

<template>
  <fieldset>
    <legend class="font-display font-bold text-3xl mb-2">Your group</legend>
    <p class="text-slate-600 mb-8">A few details so we can match you with the right host.</p>
    <div class="grid sm:grid-cols-2 gap-6 max-w-2xl">
      <BaseInput
        :model-value="groupSize ?? ''"
        type="number"
        label="Group size"
        name="groupSize"
        required
        :error="errors.groupSize"
        @update:model-value="emit('update:groupSize', $event ? Number($event) : null)"
      />
      <BaseSelect
        :model-value="occasion"
        label="Occasion"
        name="occasion"
        :options="occasionOptions"
        :error="errors.occasion"
        @update:model-value="emit('update:occasion', $event)"
      />
    </div>
  </fieldset>
</template>
