<script setup lang="ts">
interface Option { value: string; label: string }

const props = defineProps<{
  modelValue: string
  label: string
  name: string
  options: Option[]
  error?: string
  required?: boolean
}>()

defineEmits<{ (e: 'update:modelValue', v: string): void }>()

const selectId = `select-${props.name}`
const errorId = `error-${props.name}`
</script>

<template>
  <div class="flex flex-col gap-1">
    <label :for="selectId" class="text-sm font-medium text-slate-700">
      {{ label }} <span v-if="required" class="text-jays-red">*</span>
    </label>
    <select
      :id="selectId"
      :name="name"
      :value="modelValue"
      :aria-invalid="!!error"
      :aria-describedby="error ? errorId : undefined"
      class="h-11 px-3 rounded-md border bg-white focus:outline-none focus:ring-2 focus:ring-jays-navy transition-colors"
      :class="error ? 'border-jays-red' : 'border-slate-300'"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
    </select>
    <p v-if="error" :id="errorId" role="alert" class="text-sm text-jays-red">{{ error }}</p>
  </div>
</template>
