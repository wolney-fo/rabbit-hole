import { Either, right } from '@/core/either'
import { FilesRepository } from '../repositories/files-repository'
import { Storage } from '../storage/storage'
import { randomUUID } from 'node:crypto'
import { File } from '../../enterprise/entities/file'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'

interface GenerateUploadUrlUseCaseRequest {
  userId: string
  name: string
  contentType: string
}

type GenerateUploadUrlUseCaseResponse = Either<
  null,
  {
    fileId: string
    uploadUrl: string
  }
>

@Injectable()
export class GenerateUploadUrlUseCase {
  constructor(
    private filesRepository: FilesRepository,
    private storage: Storage,
  ) {}

  async execute({
    userId,
    name,
    contentType,
  }: GenerateUploadUrlUseCaseRequest): Promise<GenerateUploadUrlUseCaseResponse> {
    const fileKey = randomUUID().concat('-').concat(name)

    const { signedUrl } = await this.storage.getUploadSignedUrl({
      fileKey,
      contentType,
    })

    const file = File.create({
      name,
      key: fileKey,
      contentType,
      ownerId: new UniqueEntityId(userId),
    })

    await this.filesRepository.create(file)

    return right({
      fileId: file.id.toString(),
      uploadUrl: signedUrl,
    })
  }
}
