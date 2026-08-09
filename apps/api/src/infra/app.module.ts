import { Module } from '@nestjs/common'
import { EnvModule } from './env/env.module'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env/env'
import { EnvService } from './env/env.service'
import { DatabaseModule } from './database/database.module'
import { PrismaService } from './database/prisma/prisma.service'
import { CryptographyModule } from './cryptography/cryptography.module'
import { Argon2Hasher } from './cryptography/argon2-hasher'
import { AuthModule } from '@thallesp/nestjs-better-auth'
import { createAuth } from '@/infra/auth/better-auth'
import { HttpModule } from './http/http.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule.forRootAsync({
      imports: [EnvModule, DatabaseModule, CryptographyModule],
      inject: [EnvService, PrismaService, Argon2Hasher],
      useFactory: (
        envService: EnvService,
        prisma: PrismaService,
        argon2Hasher: Argon2Hasher,
      ) => ({
        auth: createAuth(envService, prisma, argon2Hasher),
      }),
    }),
    EnvModule,
    DatabaseModule,
    HttpModule,
  ],
})
export class AppModule {}
