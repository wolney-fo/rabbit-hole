import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Either } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { FilesRepository } from '../repositories/files-repository'
import { left, right } from '@/core/either'
import { Storage } from '../storage/storage'

interface GenerateDownloadUrlUseCaseRequest {
  id: string
}

type GenerateDownloadUrlUseCaseResponse = Either<
  ResourceNotFoundError,
  { url: string }
>

@Injectable()
export class GenerateDownloadUrlUseCase {
  constructor(
    private filesRepository: FilesRepository,
    private storage: Storage,
  ) {}

  async execute({
    id,
  }: GenerateDownloadUrlUseCaseRequest): Promise<GenerateDownloadUrlUseCaseResponse> {
    const file = await this.filesRepository.findByPublicId(id)

    if (!file) {
      return left(new ResourceNotFoundError())
    }

    const { signedUrl } = await this.storage.getDownloadSignedUrl({
      fileKey: file.key,
    })

    return right({
      url: signedUrl,
    })
  }
}
