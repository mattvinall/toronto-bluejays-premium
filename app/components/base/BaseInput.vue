<script setup lang="ts">
const props = defineProps<{
  modelValue: string | number
  label: string
  name: string
  type?: string
  error?: string
  placeholder?: string
  required?: boolean
  autocomplete?: string
}>()

defineEmits<{ (e: 'update:modelValue', v: string): void }>()

const inputId = `input-${props.name}`
const errorId = `error-${props.name}`
</script>

<template>
  <div class="flex flex-col gap-1">
    <label :for="inputId" class="text-sm font-medium text-slate-700">
      {{ label }} <span v-if="required" class="text-jays-red">*</span>
    </label>
    <input
      :id="inputId"
      :name="name"
      :type="type ?? 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :aria-invalid="!!error"
      :aria-describedby="error ? errorId : undefined"
      class="h-11 px-3 rounded-md border bg-white focus:outline-none focus:ring-2 focus:ring-jays-navy focus:border-jays-navy transition-colors"
      :class="error ? 'border-jays-red' : 'border-slate-300'"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" :id="errorId" role="alert" class="text-sm text-jays-red">{{ error }}</p>
  </div>
</template>
