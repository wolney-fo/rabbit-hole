import { Module } from '@nestjs/common'
import { Argon2Hasher } from './argon2-hasher'

@Module({
  providers: [Argon2Hasher],
  exports: [Argon2Hasher],
})
export class CryptographyModule {}
