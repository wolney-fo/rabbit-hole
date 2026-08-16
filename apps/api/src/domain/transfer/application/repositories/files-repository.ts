import { PaginationParams } from '@/core/repositories/pagination-params'
import { File } from '../../enterprise/entities/file'

export abstract class FilesRepository {
  abstract create(file: File): Promise<void>
  abstract findByPublicId(publicId: string): Promise<File | null>
  abstract findManyByUserId(
    userId: string,
    params: PaginationParams,
  ): Promise<File[]>
}
