import { Module } from '@nestjs/common'
import { EnvModule } from '../env/env.module'
import { Storage } from '@/domain/transfer/application/storage/storage'
import { S3Storage } from './s3-storage'

@Module({
  imports: [EnvModule],
  providers: [
    {
      provide: Storage,
      useClass: S3Storage,
    },
  ],
  exports: [Storage],
})
export class StorageModule {}
