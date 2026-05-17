<script setup lang="ts">
import type { InquiryContact } from '~/types/inquiry'

const props = defineProps<{
  contact: InquiryContact
  notes: string
  consent: boolean
  errors: Record<string, string>
}>()

const emit = defineEmits<{
  (e: 'update:contact', v: InquiryContact): void
  (e: 'update:notes', v: string): void
  (e: 'update:consent', v: boolean): void
}>()

const update = <K extends keyof InquiryContact>(key: K, val: InquiryContact[K]) => {
  emit('update:contact', { ...props.contact, [key]: val })
}
</script>

<template>
  <fieldset class="space-y-6 max-w-2xl">
    <legend class="font-display font-bold text-3xl mb-2">Contact details</legend>
    <p class="text-slate-600 mb-8">A Blue Jays premium associate will follow up within one business day.</p>
    <div class="grid sm:grid-cols-2 gap-6">
      <BaseInput :model-value="contact.firstName" label="First name" name="firstName" required :error="errors['contact.firstName']" @update:model-value="update('firstName', $event)" />
      <BaseInput :model-value="contact.lastName" label="Last name" name="lastName" required :error="errors['contact.lastName']" @update:model-value="update('lastName', $event)" />
      <BaseInput :model-value="contact.email" type="email" label="Email" name="email" required autocomplete="email" :error="errors['contact.email']" @update:model-value="update('email', $event)" />
      <BaseInput :model-value="contact.phone" type="tel" label="Phone" name="phone" required autocomplete="tel" :error="errors['contact.phone']" @update:model-value="update('phone', $event)" />
      <BaseInput :model-value="contact.company ?? ''" label="Company (optional)" name="company" autocomplete="organization" class="sm:col-span-2" @update:model-value="update('company', $event)" />
    </div>
    <div>
      <label for="notes" class="text-sm font-medium text-slate-700">Anything else we should know?</label>
      <textarea id="notes" :value="notes" rows="4" class="mt-1 w-full p-3 rounded-md border border-slate-300 focus:ring-2 focus:ring-jays-navy focus:border-jays-navy" @input="emit('update:notes', ($event.target as HTMLTextAreaElement).value)"></textarea>
    </div>
    <label class="flex items-start gap-3 text-sm">
      <input type="checkbox" :checked="consent" class="accent-jays-navy mt-1" @change="emit('update:consent', ($event.target as HTMLInputElement).checked)" />
      <span>I consent to being contacted about my inquiry and related premium experiences. <span class="text-jays-red">*</span></span>
    </label>
    <p v-if="errors.consent" role="alert" class="text-sm text-jays-red">{{ errors.consent }}</p>
  </fieldset>
</template>
