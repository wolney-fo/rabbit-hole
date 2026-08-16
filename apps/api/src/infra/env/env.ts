import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number().min(1000).optional().default(3333),
  NODE_ENV: z.enum(['development', 'test', 'production']),
  APP_URL: z.url(),
  WEB_URL: z.url(),
  DATABASE_URL: z
    .url()
    .startsWith('mysql://', { error: 'Database URL is not MySQL' }),
  BETTER_AUTH_SECRET: z.string().min(1),
  AWS_S3_REGION: z.string().min(1),
  AWS_S3_BUCKET: z.string().min(1),
  AWS_S3_ENDPOINT: z.string().min(1),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
})

export type Env = z.infer<typeof envSchema>
