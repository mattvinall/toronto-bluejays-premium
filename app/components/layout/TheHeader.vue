<script setup lang="ts">
</script>

<template>
  <header class="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <NuxtLink to="/" class="font-display font-bold text-xl text-jays-navy">
        Blue Jays Premium
      </NuxtLink>
      <TheNav class="hidden md:block" />
      <BaseButton variant="primary" size="sm" as="NuxtLink" to="/inquire">
        Plan Your Visit
      </BaseButton>
    </div>
  </header>
</template>
