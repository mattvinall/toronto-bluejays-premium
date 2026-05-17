<script setup lang="ts">
import { useVenues } from '~/composables/useVenues'
import VenueDetailHero from '~/components/venue/VenueDetailHero.vue'
import VenueAmenities from '~/components/venue/VenueAmenities.vue'
import VenueCapacity from '~/components/venue/VenueCapacity.vue'
import VenueGallery from '~/components/venue/VenueGallery.vue'
import VenueInquireCta from '~/components/venue/VenueInquireCta.vue'

const route = useRoute()
const { getVenueBySlug } = useVenues()
const venue = computed(() => getVenueBySlug(route.params.slug as string))

if (!venue.value) {
  throw createError({ statusCode: 404, statusMessage: 'Venue not found', fatal: true })
}

useHead({ title: () => `${venue.value!.name} — Blue Jays Premium` })
</script>

<template>
  <div v-if="venue">
    <VenueDetailHero :venue="venue" />
    <section class="max-w-3xl mx-auto px-6 py-16">
      <p class="text-lg text-slate-700 leading-relaxed">{{ venue.description }}</p>
    </section>
    <VenueCapacity :venue="venue" />
    <VenueAmenities :amenities="venue.amenities" />
    <VenueGallery :images="venue.images.gallery" />
    <VenueInquireCta :venue="venue" />
  </div>
</template>
