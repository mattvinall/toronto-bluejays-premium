export type Occasion = 'corporate' | 'birthday' | 'wedding' | 'other'

export interface InquiryContact {
  firstName: string
  lastName: string
  email: string
  phone: string
  company?: string
}

export interface Inquiry {
  venueSlug: string
  preferredDate: string
  groupSize: number
  occasion?: Occasion
  contact: InquiryContact
  notes?: string
  consent: boolean
  submittedAt: string
}
