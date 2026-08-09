import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { StorageModule } from '../storage/storage.module'
import { GetUploadUrlController } from './controllers/get-upload-url.controller'
import { GenerateUploadUrlUseCase } from '@/domain/transfer/application/use-cases/generate-upload-url'
import { GetDownloadUrlController } from './controllers/get-download-url.controller'
import { GenerateDownloadUrlUseCase } from '@/domain/transfer/application/use-cases/generate-download-url'

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [GetUploadUrlController, GetDownloadUrlController],
  providers: [GenerateUploadUrlUseCase, GenerateDownloadUrlUseCase],
})
export class HttpModule {}
