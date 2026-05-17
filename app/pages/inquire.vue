<script setup lang="ts">
import { inquirySchema, type InquiryInput } from '~/schemas/inquiry'

useHead({ title: 'Plan Your Visit — Blue Jays Premium' })

const route = useRoute()

const form = reactive<InquiryInput>({
  venueSlug: String(route.query.venue ?? ''),
  preferredDate: String(route.query.date ?? ''),
  groupSize: 0,
  occasion: undefined,
  contact: { firstName: '', lastName: '', email: '', phone: '', company: '' },
  notes: '',
  consent: false
})

const currentStep = ref(0)
const labels = ['Venue', 'Date', 'Group', 'Contact']
const errors = ref<Record<string, string>>({})
const submissionId = ref<string | null>(null)
const submitting = ref(false)

const stepValid = (step: number): boolean => {
  errors.value = {}
  if (step === 0) {
    if (!form.venueSlug) { errors.value.venueSlug = 'Please pick a venue'; return false }
  }
  if (step === 1) {
    if (!form.preferredDate) { errors.value.preferredDate = 'Choose a date or "flexible"'; return false }
  }
  if (step === 2) {
    if (form.groupSize < 2) { errors.value.groupSize = 'Minimum 2 guests'; return false }
    if (form.groupSize > 300) { errors.value.groupSize = 'Max 300 guests'; return false }
  }
  if (step === 3) {
    const parsed = inquirySchema.safeParse(form)
    if (!parsed.success) {
      const flat = parsed.error.flatten()
      for (const [k, msgs] of Object.entries(flat.fieldErrors)) {
        if (msgs?.[0]) errors.value[k] = msgs[0]
      }
      for (const issue of parsed.error.issues) {
        const path = issue.path.join('.')
        errors.value[path] = issue.message
      }
      return false
    }
  }
  return true
}

const next = () => { if (stepValid(currentStep.value)) currentStep.value++ }
const back = () => { currentStep.value = Math.max(0, currentStep.value - 1) }

const submit = async () => {
  if (!stepValid(3)) return
  submitting.value = true
  try {
    const res = await $fetch<{ ok: true; id: string }>('/api/inquire', {
      method: 'POST',
      body: form
    })
    submissionId.value = res.id
  } catch {
    errors.value.submit = 'Something went wrong. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-6 py-16">
    <template v-if="!submissionId">
      <InquireProgress :current="currentStep" :total="4" :labels="labels" />

      <InquireStepVenue
        v-if="currentStep === 0"
        v-model="form.venueSlug"
        :error="errors.venueSlug"
      />

      <InquireStepDate
        v-else-if="currentStep === 1"
        v-model="form.preferredDate"
        :error="errors.preferredDate"
      />

      <InquireStepGroup
        v-else-if="currentStep === 2"
        :group-size="form.groupSize"
        :occasion="form.occasion ?? ''"
        :errors="{ groupSize: errors.groupSize, occasion: errors.occasion }"
        @update:group-size="form.groupSize = $event ?? 0"
        @update:occasion="form.occasion = $event === '' ? undefined : ($event as InquiryInput['occasion'])"
      />

      <InquireStepContact
        v-else-if="currentStep === 3"
        :contact="form.contact"
        :notes="form.notes ?? ''"
        :consent="form.consent"
        :errors="errors"
        @update:contact="form.contact = $event"
        @update:notes="form.notes = $event"
        @update:consent="form.consent = $event"
      />

      <div class="mt-12 flex justify-between">
        <BaseButton v-if="currentStep > 0" variant="ghost" @click="back">← Back</BaseButton>
        <span v-else />
        <BaseButton v-if="currentStep < 3" @click="next">Continue →</BaseButton>
        <BaseButton v-else :disabled="submitting" @click="submit">
          {{ submitting ? 'Submitting…' : 'Submit Inquiry' }}
        </BaseButton>
      </div>

      <p v-if="errors.submit" role="alert" class="mt-6 text-sm text-jays-red text-center">{{ errors.submit }}</p>
    </template>

    <InquireSuccess v-else :id="submissionId" />
  </div>
</template>
