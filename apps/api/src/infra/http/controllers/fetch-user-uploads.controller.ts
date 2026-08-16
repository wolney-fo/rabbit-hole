import { FetchUserUploadsUseCase } from '@/domain/transfer/application/use-cases/fetch-user-uploads'
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { Session, type UserSession } from '@thallesp/nestjs-better-auth'
import { z } from 'zod'
import { FilePresenter } from '../presenters/file-presenter'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

@Controller('/uploads')
export class FetchUserUploadsController {
  constructor(private fetchUserUploadsUseCase: FetchUserUploadsUseCase) {}

  @Get()
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Session() session: UserSession,
  ) {
    const { user } = session

    const result = await this.fetchUserUploadsUseCase.execute({
      userId: user.id,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { files } = result.value

    return {
      files: files.map((file) => {
        return FilePresenter.toHTTP(file)
      }),
    }
  }
}
