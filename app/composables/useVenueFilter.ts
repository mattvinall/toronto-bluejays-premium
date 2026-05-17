import type { Ref } from 'vue'
import type { Venue, VenueType } from '~/types/venue'

interface UseVenueFilterOptions {
  syncUrl?: boolean
}

export function useVenueFilter(venues: Ref<Venue[]>, options: UseVenueFilterOptions = {}) {
  const syncUrl = options.syncUrl ?? true

  const type = ref<VenueType | null>(null)
  const capacityMin = ref<number | null>(null)
  const capacityMax = ref<number | null>(null)

  if (syncUrl) {
    const route = useRoute()
    const queryType = route.query.type
    if (typeof queryType === 'string') type.value = queryType as VenueType
    const queryMin = route.query.min
    if (typeof queryMin === 'string') capacityMin.value = Number(queryMin)
    const queryMax = route.query.max
    if (typeof queryMax === 'string') capacityMax.value = Number(queryMax)
  }

  const filtered = computed(() =>
    venues.value.filter(v => {
      if (type.value && v.type !== type.value) return false
      // Overlap semantics: include venues that can host a group anywhere in [min, max]
      if (capacityMin.value !== null && v.capacity.max < capacityMin.value) return false
      if (capacityMax.value !== null && v.capacity.min > capacityMax.value) return false
      return true
    })
  )

  const writeUrl = () => {
    if (!syncUrl) return
    const router = useRouter()
    const q: Record<string, string> = {}
    if (type.value) q.type = type.value
    if (capacityMin.value !== null) q.min = String(capacityMin.value)
    if (capacityMax.value !== null) q.max = String(capacityMax.value)
    router.replace({ query: q })
  }

  const setType = (t: VenueType | null) => { type.value = t; writeUrl() }
  const setCapacityRange = (min: number | null, max: number | null) => {
    capacityMin.value = min
    capacityMax.value = max
    writeUrl()
  }
  const clear = () => {
    type.value = null
    capacityMin.value = null
    capacityMax.value = null
    writeUrl()
  }

  return { filtered, type, capacityMin, capacityMax, setType, setCapacityRange, clear }
}
