import { describe, it, expect } from 'vitest'
import { useVenueFilter } from '~/composables/useVenueFilter'
import type { Venue, VenueType } from '~/types/venue'

const makeVenue = (slug: string, type: VenueType, min: number, max: number): Venue => ({
  slug, name: slug, type, tagline: '', description: '',
  capacity: { min, max, recommended: max },
  amenities: [], images: { hero: { src: '', alt: '', width: 0, height: 0 }, gallery: [] },
  pricing: { perGameFrom: 0, perGameTo: 0 },
  location: { level: '100', section: '', coords: { x: 0, y: 0 } },
  bestFor: []
})

describe('useVenueFilter', () => {
  const venues = [
    makeVenue('a', 'suite', 2, 20),
    makeVenue('b', 'club', 10, 80),
    makeVenue('c', 'group-space', 50, 300),
    makeVenue('d', 'patio', 20, 150)
  ]

  it('returns all venues when no filter is set', () => {
    const { filtered } = useVenueFilter(ref(venues), { syncUrl: false })
    expect(filtered.value).toHaveLength(4)
  })

  it('filters by type', () => {
    const f = useVenueFilter(ref(venues), { syncUrl: false })
    f.setType('club')
    expect(f.filtered.value.map(v => v.slug)).toEqual(['b'])
  })

  it('includes venues whose capacity overlaps the requested range', () => {
    const f = useVenueFilter(ref(venues), { syncUrl: false })
    f.setCapacityRange(50, 200)
    // a (2-20) excluded — entirely below
    // b (10-80) included — overlaps
    // c (50-300) included — overlaps
    // d (20-150) included — overlaps
    expect(f.filtered.value.map(v => v.slug)).toEqual(['b', 'c', 'd'])
  })

  it('excludes venues entirely outside the requested range', () => {
    const f = useVenueFilter(ref(venues), { syncUrl: false })
    f.setCapacityRange(2, 15)
    // a (2-20) overlaps. b (10-80) overlaps at 10-15. c (50-300) starts above 15 — exclude. d (20-150) starts above 15 — exclude.
    expect(f.filtered.value.map(v => v.slug)).toEqual(['a', 'b'])
  })

  it('clears filters', () => {
    const f = useVenueFilter(ref(venues), { syncUrl: false })
    f.setType('club')
    f.clear()
    expect(f.filtered.value).toHaveLength(4)
  })
})
