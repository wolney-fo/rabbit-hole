/* eslint-disable @typescript-eslint/require-await */
import { PaginationParams } from '@/core/repositories/pagination-params'
import { FilesRepository } from '@/domain/transfer/application/repositories/files-repository'
import { File } from '@/domain/transfer/enterprise/entities/file'

export class InMemoryFilesRepository implements FilesRepository {
  public items: File[] = []

  async create(file: File): Promise<void> {
    this.items.push(file)
  }

  async findByPublicId(publicId: string): Promise<File | null> {
    const item = this.items.find((item) => item.id.toString() === publicId)

    if (!item) {
      return null
    }

    return item
  }

  async findManyByUserId(
    userId: string,
    { page }: PaginationParams,
  ): Promise<File[]> {
    const items = this.items
      .filter((item) => item.ownerId.toString() === userId)
      .slice((page - 1) * 20, page * 20)

    return items
  }
}
