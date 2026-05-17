import type { Ref } from 'vue'
import type { Venue, VenueType } from '~/types/venue'

export function useVenueFilter(venues: Ref<Venue[]>) {
  const type = ref<VenueType | null>(null)
  const capacityMin = ref<number | null>(null)
  const capacityMax = ref<number | null>(null)

  // Try to read initial state from the URL if running in a page context.
  // Tests will not be in a route context; this becomes a no-op there.
  try {
    const route = useRoute()
    type.value = (route.query.type as VenueType) ?? null
    capacityMin.value = route.query.min ? Number(route.query.min) : null
    capacityMax.value = route.query.max ? Number(route.query.max) : null
  } catch {
    // No-op in non-Nuxt test context
  }

  const filtered = computed(() => {
    return venues.value.filter(v => {
      if (type.value && v.type !== type.value) return false
      if (capacityMin.value !== null && v.capacity.max < capacityMin.value) return false
      if (capacityMax.value !== null && v.capacity.max > capacityMax.value) return false
      return true
    })
  })

  const syncToUrl = () => {
    try {
      const router = useRouter()
      const q: Record<string, string> = {}
      if (type.value) q.type = type.value
      if (capacityMin.value !== null) q.min = String(capacityMin.value)
      if (capacityMax.value !== null) q.max = String(capacityMax.value)
      router.replace({ query: q })
    } catch {
      // No-op in non-Nuxt test context
    }
  }

  const setType = (t: VenueType | null) => { type.value = t; syncToUrl() }
  const setCapacityRange = (min: number | null, max: number | null) => {
    capacityMin.value = min
    capacityMax.value = max
    syncToUrl()
  }
  const clear = () => {
    type.value = null
    capacityMin.value = null
    capacityMax.value = null
    syncToUrl()
  }

  return { filtered, type, capacityMin, capacityMax, setType, setCapacityRange, clear }
}
