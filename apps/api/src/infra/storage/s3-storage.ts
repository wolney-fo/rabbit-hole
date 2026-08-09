import {
  DownloadParams,
  Storage,
  UploadParams,
} from '@/domain/transfer/application/storage/storage'
import { Injectable } from '@nestjs/common'
import { EnvService } from '../env/env.service'
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

@Injectable()
export class S3Storage implements Storage {
  private client: S3Client

  constructor(private envService: EnvService) {
    this.client = new S3Client({
      endpoint: envService.get('AWS_S3_ENDPOINT'),
      region: envService.get('AWS_S3_REGION'),
      credentials: {
        accessKeyId: envService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: envService.get('AWS_SECRET_ACCESS_KEY'),
      },
    })
  }

  async getUploadSignedUrl({
    fileKey,
    contentType,
  }: UploadParams): Promise<{ signedUrl: string }> {
    const signedUrl = await getSignedUrl(
      this.client,
      new PutObjectCommand({
        Bucket: this.envService.get('AWS_S3_BUCKET'),
        Key: fileKey,
        ContentType: contentType,
      }),
      {
        expiresIn: 60 * 10, // 10 minutes in secconds
      },
    )

    return {
      signedUrl,
    }
  }

  async getDownloadSignedUrl({
    fileKey,
  }: DownloadParams): Promise<{ signedUrl: string }> {
    const signedUrl = await getSignedUrl(
      this.client,
      new GetObjectCommand({
        Bucket: this.envService.get('AWS_S3_BUCKET'),
        Key: fileKey,
      }),
      {
        expiresIn: 60 * 10, // 10 minutes in secconds
      },
    )

    return {
      signedUrl,
    }
  }
}
