import { File } from '@/domain/transfer/enterprise/entities/file'
import { File as PrismaFile, Prisma } from '../generated/client'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export class PrismaFileMapper {
  static toDomain(raw: PrismaFile): File {
    return File.create(
      {
        ownerId: new UniqueEntityId(raw.userId),
        name: raw.name,
        key: raw.key,
        contentType: raw.contentType,
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(raw: File): Prisma.FileUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      userId: raw.ownerId.toString(),
      name: raw.name,
      key: raw.key,
      contentType: raw.contentType,
      createdAt: raw.createdAt,
    }
  }
}
