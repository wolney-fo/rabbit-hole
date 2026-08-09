import { Module } from '@nestjs/common'
import { EnvModule } from '@/infra/env/env.module'
import { PrismaService } from './prisma/prisma.service'
import { FilesRepository } from '@/domain/transfer/application/repositories/files-repository'
import { PrismaFilesRepository } from './prisma/repositories/prisma-files-repository'

@Module({
  imports: [EnvModule],
  providers: [
    PrismaService,
    {
      provide: FilesRepository,
      useClass: PrismaFilesRepository,
    },
  ],
  exports: [PrismaService, FilesRepository],
})
export class DatabaseModule {}
