import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number().min(1000).optional().default(3333),
  NODE_ENV: z.enum(['development', 'test', 'production']),
  DATABASE_URL: z
    .url()
    .startsWith('mysql://', { error: 'Database URL is not MySQL' }),
})

export type Env = z.infer<typeof envSchema>
