import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface FileProps {
  ownerId: UniqueEntityId
  name: string
  key: string
  contentType: string
  createdAt: Date
}

export class File extends Entity<FileProps> {
  get ownerId() {
    return this.props.ownerId
  }

  get name() {
    return this.props.name
  }

  get key() {
    return this.props.key
  }

  get contentType() {
    return this.props.contentType
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(props: Optional<FileProps, 'createdAt'>, id?: UniqueEntityId) {
    const file = new File(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return file
  }
}
