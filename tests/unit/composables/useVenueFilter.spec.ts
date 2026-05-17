import { describe, it, expect } from 'vitest'
import { useVenueFilter } from '~/composables/useVenueFilter'
import type { Venue, VenueType } from '~/types/venue'

const makeVenue = (slug: string, type: VenueType, max: number): Venue => ({
  slug, name: slug, type, tagline: '', description: '',
  capacity: { min: 1, max, recommended: max },
  amenities: [], images: { hero: { src: '', alt: '', width: 0, height: 0 }, gallery: [] },
  pricing: { perGameFrom: 0, perGameTo: 0 },
  location: { level: '100', section: '', coords: { x: 0, y: 0 } },
  bestFor: []
})

describe('useVenueFilter', () => {
  const venues = [
    makeVenue('a', 'suite', 20),
    makeVenue('b', 'club', 80),
    makeVenue('c', 'group-space', 300),
    makeVenue('d', 'patio', 150)
  ]

  it('returns all venues when no filter is set', () => {
    const { filtered } = useVenueFilter(ref(venues))
    expect(filtered.value).toHaveLength(4)
  })

  it('filters by type', () => {
    const f = useVenueFilter(ref(venues))
    f.setType('club')
    expect(f.filtered.value.map(v => v.slug)).toEqual(['b'])
  })

  it('filters by capacity range', () => {
    const f = useVenueFilter(ref(venues))
    f.setCapacityRange(50, 200)
    expect(f.filtered.value.map(v => v.slug)).toEqual(['b', 'd'])
  })

  it('clears filters', () => {
    const f = useVenueFilter(ref(venues))
    f.setType('club')
    f.clear()
    expect(f.filtered.value).toHaveLength(4)
  })
})
