<script setup lang="ts">
const compare = useCompareStore()
const { getVenueBySlug } = useVenues()

const items = computed(() =>
  compare.slugs
    .map(slug => getVenueBySlug(slug))
    .filter((v): v is NonNullable<typeof v> => !!v)
)
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-y-full opacity-0"
    enter-to-class="translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="translate-y-0 opacity-100"
    leave-to-class="translate-y-full opacity-0"
  >
    <div
      v-if="items.length > 0"
      class="fixed bottom-0 inset-x-0 z-40 bg-jays-navy text-white shadow-[0_-8px_24px_rgba(0,0,0,0.25)]"
      role="region"
      aria-label="Venue compare tray"
    >
      <div class="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div class="flex-1 flex items-center gap-4 min-w-0">
          <p class="text-sm font-semibold whitespace-nowrap">
            {{ items.length }} of {{ compare.MAX }} selected
          </p>
          <ul class="flex items-center gap-2 overflow-x-auto">
            <li v-for="v in items" :key="v.slug" class="relative flex-shrink-0">
              <NuxtImg
                :src="v.images.hero.src"
                :alt="v.images.hero.alt"
                class="w-14 h-14 rounded-md object-cover border border-white/20"
                loading="lazy"
                sizes="56px"
              />
              <button
                type="button"
                :aria-label="`Remove ${v.name} from compare`"
                class="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white text-jays-navy text-xs font-bold flex items-center justify-center shadow hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jays-red"
                @click="compare.remove(v.slug)"
              >
                ×
              </button>
            </li>
          </ul>
        </div>
        <div class="flex items-center gap-2 flex-shrink-0">
          <BaseButton variant="on-dark" size="sm" @click="compare.clear()">
            Clear
          </BaseButton>
          <BaseButton variant="accent" size="md" as="NuxtLink" to="/compare">
            Compare ({{ items.length }})
          </BaseButton>
        </div>
      </div>
    </div>
  </Transition>
</template>
