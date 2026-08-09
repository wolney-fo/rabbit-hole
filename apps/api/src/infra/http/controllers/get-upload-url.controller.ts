import { GenerateUploadUrlUseCase } from '@/domain/transfer/application/use-cases/generate-upload-url'
import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { Session, type UserSession } from '@thallesp/nestjs-better-auth'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const getUploadUrlControllerSchema = z.object({
  fileName: z.string(),
  contentType: z.string().regex(/\w+\/[-+.\w]+/),
})

type GetUploadUrlControllerSchema = z.infer<typeof getUploadUrlControllerSchema>

@Controller('/uploads')
export class GetUploadUrlController {
  constructor(private generateUploadUrlUseCase: GenerateUploadUrlUseCase) {}

  @Post()
  async handle(
    @Body(new ZodValidationPipe(getUploadUrlControllerSchema))
    body: GetUploadUrlControllerSchema,
    @Session() session: UserSession,
  ) {
    const { fileName, contentType } = body
    const { user } = session

    const result = await this.generateUploadUrlUseCase.execute({
      userId: user.id,
      name: fileName,
      contentType,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      data: {
        url: result.value.uploadUrl,
      },
    }
  }
}
