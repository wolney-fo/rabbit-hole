import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin, openAPI } from 'better-auth/plugins'
import { v7 as uuidv7 } from 'uuid'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { EnvService } from '@/infra/env/env.service'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaClient } from '@/infra/database/prisma/generated/client'
import { Argon2Hasher } from '@/infra/cryptography/argon2-hasher'

type BuildAuthOptions = {
  appUrl: string
  webUrl: string
  secret: string
  prisma: PrismaClient
  hasher: Pick<Argon2Hasher, 'hash' | 'verify'>
}

function buildAuth({
  appUrl,
  webUrl,
  secret,
  prisma,
  hasher,
}: BuildAuthOptions) {
  return betterAuth({
    appName: 'Rabbit Hole',
    baseURL: appUrl,
    basePath: '/auth',
    trustedOrigins: [webUrl],
    secret,
    database: prismaAdapter(prisma, {
      provider: 'mysql',
      usePlural: true,
    }),
    advanced: {
      database: {
        generateId: () => uuidv7(),
      },
      cookiePrefix: 'rabbithole',
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      revokeSessionsOnPasswordReset: true,
      password: {
        hash: (password) => hasher.hash(password),
        verify: (data) => hasher.verify(data),
      },
      customSyntheticUser: ({ coreFields, additionalFields, id }) => ({
        ...coreFields,
        role: 'user',
        banned: false,
        banReason: null,
        banExpires: null,
        ...additionalFields,
        id,
      }),
    },
    plugins: [openAPI(), admin()],
  })
}

export function createAuth(
  envService: EnvService,
  prisma: PrismaService,
  argon2Hasher: Argon2Hasher,
) {
  return buildAuth({
    appUrl: envService.get('APP_URL'),
    webUrl: envService.get('WEB_URL'),
    secret: envService.get('BETTER_AUTH_SECRET'),
    prisma,
    hasher: argon2Hasher,
  })
}

export const auth = buildAuth({
  appUrl: process.env.APP_URL!,
  webUrl: process.env.WEB_URL!,
  secret: process.env.BETTER_AUTH_SECRET!,
  prisma: new PrismaClient({
    adapter: new PrismaMariaDb(process.env.DATABASE_URL!),
  }),
  hasher: new Argon2Hasher(),
})

export type Auth = ReturnType<typeof createAuth>
