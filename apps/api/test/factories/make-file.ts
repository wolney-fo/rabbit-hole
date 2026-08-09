import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { File, FileProps } from '@/domain/transfer/enterprise/entities/file'
import { faker } from '@faker-js/faker'

export function makeFile(
  override: Partial<FileProps> = {},
  id?: UniqueEntityId,
): File {
  const file = File.create(
    {
      ownerId: new UniqueEntityId(),
      name: faker.system.fileName(),
      key: faker.system.commonFileName(),
      contentType: faker.system.mimeType(),
      ...override,
    },
    id,
  )

  return file
}
