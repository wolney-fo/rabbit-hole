/* eslint-disable @typescript-eslint/require-await */
import { Storage } from '@/domain/transfer/application/storage/storage'
import { randomUUID } from 'node:crypto'

export class FakeStorage implements Storage {
  async getUploadSignedUrl(): Promise<{ signedUrl: string }> {
    const signedUrl = randomUUID()

    return {
      signedUrl,
    }
  }

  async getDownloadSignedUrl(): Promise<{ signedUrl: string }> {
    const signedUrl = randomUUID()

    return {
      signedUrl,
    }
  }
}
