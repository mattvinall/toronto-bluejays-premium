<script setup lang="ts">
import gsap from 'gsap'

const headlineEl = ref<HTMLElement | null>(null)
const reduced = useReducedMotion()

onMounted(() => {
  if (reduced.value || !headlineEl.value) return
  gsap.from(headlineEl.value.querySelectorAll('[data-anim]'), {
    y: 28,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    stagger: 0.12
  })
})
</script>

<template>
  <section class="relative min-h-[80vh] flex items-center bg-jays-blue text-white overflow-hidden">
    <NuxtImg
      src="/images/hero/rogers-centre.jpg"
      alt="Rogers Centre interior, renovated for the 2025 season"
      class="absolute inset-0 w-full h-full object-cover opacity-40"
      loading="eager"
      fetchpriority="high"
      sizes="100vw"
    />
    <div ref="headlineEl" class="relative max-w-7xl mx-auto px-6 py-24">
      <p data-anim class="text-jays-red font-medium tracking-widest uppercase text-sm mb-4">The Renovated Rogers Centre</p>
      <h1 data-anim class="font-display font-bold text-5xl md:text-7xl leading-[1.05] max-w-3xl">
        Premium experiences,<br>reimagined.
      </h1>
      <p data-anim class="mt-6 text-xl text-white/80 max-w-xl">
        Five new ways to experience Blue Jays baseball — from the field-level TD Clubhouse to the WestJet Flight Deck.
      </p>
      <div data-anim class="mt-10 flex flex-wrap gap-4">
        <BaseButton size="lg" as="NuxtLink" to="/venues">Explore Venues</BaseButton>
        <BaseButton variant="ghost" size="lg" as="NuxtLink" to="/inquire">Plan Your Visit</BaseButton>
      </div>
    </div>
  </section>
</template>
