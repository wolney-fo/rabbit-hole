import { File } from '@/domain/transfer/enterprise/entities/file'

export class FilePresenter {
  static toHTTP(file: File) {
    return {
      id: file.id.toString(),
      name: file.name,
      publicId: file.id.toString(), // TODO: replace this with real public Id
      contentType: file.contentType,
      createdAt: file.createdAt,
    }
  }
}
