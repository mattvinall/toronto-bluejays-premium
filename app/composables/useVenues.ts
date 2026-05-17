import venuesData from '~/data/venues.json'
import type { Venue } from '~/types/venue'

export function useVenues() {
  const venues = ref<Venue[]>(venuesData as Venue[])

  const getVenueBySlug = (slug: string): Venue | undefined =>
    venues.value.find(v => v.slug === slug)

  return { venues, getVenueBySlug }
}
