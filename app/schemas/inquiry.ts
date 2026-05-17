import { z } from 'zod'

export const inquirySchema = z.object({
  venueSlug: z.string().min(1, 'Please pick a venue'),
  preferredDate: z.string().min(1, 'Choose a date or "flexible"'),
  groupSize: z.number().int().min(2, 'Minimum 2 guests').max(300, 'Max 300 guests'),
  occasion: z.enum(['corporate', 'birthday', 'wedding', 'other']).optional(),
  contact: z.object({
    firstName: z.string().min(1, 'Required'),
    lastName: z.string().min(1, 'Required'),
    email: z.string().email('Enter a valid email'),
    phone: z.string().regex(/^[+\d\s()-]{10,}$/, 'Enter a valid phone'),
    company: z.string().optional()
  }),
  notes: z.string().max(1000).optional(),
  consent: z.literal(true, { errorMap: () => ({ message: 'Required to submit' }) })
})

export type InquiryInput = z.infer<typeof inquirySchema>
