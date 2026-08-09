export interface UploadParams {
  fileKey: string
  contentType: string
}

export interface DownloadParams {
  fileKey: string
}

export abstract class Storage {
  abstract getUploadSignedUrl(
    params: UploadParams,
  ): Promise<{ signedUrl: string }>
  abstract getDownloadSignedUrl(
    params: DownloadParams,
  ): Promise<{ signedUrl: string }>
}
