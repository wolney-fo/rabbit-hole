import { FilesRepository } from '@/domain/transfer/application/repositories/files-repository'
import { File } from '@/domain/transfer/enterprise/entities/file'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaFileMapper } from '../mappers/prisma-file-mapper'
import { PaginationParams } from '@/core/repositories/pagination-params'

@Injectable()
export class PrismaFilesRepository implements FilesRepository {
  constructor(private prisma: PrismaService) {}

  async create(file: File): Promise<void> {
    const data = PrismaFileMapper.toPrisma(file)

    await this.prisma.file.create({
      data,
    })
  }

  async findByPublicId(publicId: string): Promise<File | null> {
    const file = await this.prisma.file.findUnique({
      where: {
        id: publicId,
      },
    })

    if (!file) {
      return null
    }

    return PrismaFileMapper.toDomain(file)
  }

  async findManyByUserId(
    userId: string,
    { page }: PaginationParams,
  ): Promise<File[]> {
    const files = await this.prisma.file.findMany({
      where: {
        userId,
      },
      orderBy: {
        id: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return files.map((file) => {
      return PrismaFileMapper.toDomain(file)
    })
  }
}
