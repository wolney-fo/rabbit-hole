import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  })

  const envService = app.get(EnvService)

  app.enableCors({
    origin: envService.get('WEB_URL'),
    methods: ['GET', 'POST'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })

  const port = envService.get('PORT')

  await app.listen(port)
}
bootstrap()
