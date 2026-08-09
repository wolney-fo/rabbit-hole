import { FilesRepository } from '@/domain/transfer/application/repositories/files-repository'
import { File } from '@/domain/transfer/enterprise/entities/file'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaFileMapper } from '../mappers/prisma-file-mapper'

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
}
