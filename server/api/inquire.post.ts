import { inquirySchema } from '~/schemas/inquiry'
import { randomUUID } from 'node:crypto'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = inquirySchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid inquiry',
      data: parsed.error.flatten()
    })
  }

  const id = randomUUID()
  const submittedAt = new Date().toISOString()
  console.log('[inquire]', { id, submittedAt, ...parsed.data })

  return { ok: true, id, submittedAt }
})
