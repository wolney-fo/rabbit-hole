import { Either } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { File } from '../../enterprise/entities/file'
import { FilesRepository } from '../repositories/files-repository'
import { right } from '@/core/either'

interface FetchUserUploadsUseCaseRequest {
  userId: string
  page: number
}

type FetchUserUploadsUseCaseResponse = Either<
  null,
  {
    files: File[]
  }
>

@Injectable()
export class FetchUserUploadsUseCase {
  constructor(private filesRepositories: FilesRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserUploadsUseCaseRequest): Promise<FetchUserUploadsUseCaseResponse> {
    const files = await this.filesRepositories.findManyByUserId(userId, {
      page,
    })

    return right({
      files,
    })
  }
}
