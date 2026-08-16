import { z } from 'zod'

export const filesListItemSchema = z.object({
  id: z.uuidv7(),
  name: z.string(),
  publicId: z.string(),
  contentType: z.string(),
  createdAt: z.coerce.date(),
})

export const filesListSchema = z.object({
  files: z.array(filesListItemSchema),
})

export const uploadUrlResponseSchema = z.object({
  data: z.object({
    url: z.url(),
  }),
})

export const downloadUrlResponseSchema = z.object({
  data: z.object({
    url: z.url(),
    name: z.string(),
    contentType: z.string(),
  }),
})
