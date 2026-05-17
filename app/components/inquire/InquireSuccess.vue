<script setup lang="ts">
defineProps<{ id: string }>()
</script>

<template>
  <div class="text-center py-16">
    <h1 class="font-display font-bold text-5xl text-jays-navy mb-4">Thank you.</h1>
    <p class="text-lg text-slate-700 mb-2">Your inquiry has been received.</p>
    <p class="text-sm text-slate-500 mb-8">Reference ID: <code class="bg-slate-100 px-2 py-0.5 rounded">{{ id }}</code></p>
    <p class="text-slate-600 mb-10 max-w-xl mx-auto">
      A Blue Jays premium associate will reach out within one business day. In the meantime, feel free to browse other venues.
    </p>
    <BaseButton size="lg" as="NuxtLink" to="/venues">Back to venues</BaseButton>
  </div>
</template>
