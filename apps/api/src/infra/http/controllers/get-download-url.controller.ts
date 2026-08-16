import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { GenerateDownloadUrlUseCase } from '@/domain/transfer/application/use-cases/generate-download-url'
import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { AllowAnonymous } from '@thallesp/nestjs-better-auth'

@Controller('/uploads/:fileId')
export class GetDownloadUrlController {
  constructor(private generateDownloadUrlUseCase: GenerateDownloadUrlUseCase) {}

  @Get()
  @AllowAnonymous()
  async handle(@Param('fileId') fileId: string) {
    const result = await this.generateDownloadUrlUseCase.execute({
      id: fileId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException()
      }
    }

    return {
      data: {
        url: result.value.url,
        name: result.value.name,
        contentType: result.value.contentType,
      },
    }
  }
}
