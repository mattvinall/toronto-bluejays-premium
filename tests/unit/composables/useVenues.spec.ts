import { describe, it, expect } from 'vitest'
import { useVenues } from '~/composables/useVenues'

describe('useVenues', () => {
  it('returns all venues from the fixture', () => {
    const { venues } = useVenues()
    expect(venues.value.length).toBe(5)
    expect(venues.value[0].slug).toBe('td-clubhouse')
  })

  it('getVenueBySlug finds a venue by slug', () => {
    const { getVenueBySlug } = useVenues()
    const v = getVenueBySlug('westjet-flight-deck')
    expect(v?.name).toBe('WestJet Flight Deck')
  })

  it('getVenueBySlug returns undefined for unknown slug', () => {
    const { getVenueBySlug } = useVenues()
    expect(getVenueBySlug('does-not-exist')).toBeUndefined()
  })
})
