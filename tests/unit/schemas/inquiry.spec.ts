import { describe, it, expect } from 'vitest'
import { inquirySchema } from '~/schemas/inquiry'

const valid = {
  venueSlug: 'td-clubhouse',
  preferredDate: '2026-07-04',
  groupSize: 50,
  occasion: 'corporate' as const,
  contact: {
    firstName: 'Matt', lastName: 'Vinall',
    email: 'matt@example.com', phone: '+14165550100', company: 'Acme'
  },
  notes: 'Looking forward to it.',
  consent: true as const
}

describe('inquirySchema', () => {
  it('accepts a valid inquiry', () => {
    expect(() => inquirySchema.parse(valid)).not.toThrow()
  })

  it('rejects bad email', () => {
    expect(() => inquirySchema.parse({ ...valid, contact: { ...valid.contact, email: 'nope' } })).toThrow()
  })

  it('rejects group size 1', () => {
    expect(() => inquirySchema.parse({ ...valid, groupSize: 1 })).toThrow()
  })

  it('rejects missing consent', () => {
    expect(() => inquirySchema.parse({ ...valid, consent: false })).toThrow()
  })
})
