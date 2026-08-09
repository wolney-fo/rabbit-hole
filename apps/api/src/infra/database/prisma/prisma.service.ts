import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { EnvService } from '@/infra/env/env.service'
import { PrismaClient } from './generated/client'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(envService: EnvService) {
    super({
      adapter: new PrismaMariaDb(envService.get('DATABASE_URL')),
      log: ['warn', 'error'],
    })
  }

  onModuleInit() {
    return this.$connect()
  }

  onModuleDestroy() {
    return this.$disconnect()
  }
}
