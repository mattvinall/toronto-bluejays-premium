export type VenueType = 'suite' | 'club' | 'group-space' | 'patio'

export interface VenueCapacity {
  min: number
  max: number
  recommended: number
}

export interface VenueAmenity {
  icon: string
  label: string
}

export interface VenueImage {
  src: string
  alt: string
  width: number
  height: number
  caption?: string
}

export interface VenueLocation {
  level: '100' | '200' | '300' | '400' | '500' | 'Field'
  section: string
  coords: { x: number; y: number }
}

export interface VenuePricing {
  perGameFrom: number
  perGameTo: number
  note?: string
}

export interface Venue {
  slug: string
  name: string
  type: VenueType
  tagline: string
  description: string
  capacity: VenueCapacity
  amenities: VenueAmenity[]
  images: {
    hero: VenueImage
    gallery: VenueImage[]
  }
  pricing: VenuePricing
  location: VenueLocation
  bestFor: string[]
}
