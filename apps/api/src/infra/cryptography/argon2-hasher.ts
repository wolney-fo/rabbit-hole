import { Injectable } from '@nestjs/common'
import { hash, type Options, verify } from '@node-rs/argon2'

const opts: Options = {
  memoryCost: 65536, // 64 MiB
  timeCost: 3, // 3 iterations
  parallelism: 4, // 4 lanes
  outputLen: 32, // 32 bytes
  algorithm: 2, // Argon2id
}

@Injectable()
export class Argon2Hasher {
  hash(password: string) {
    return hash(password, opts)
  }

  verify(data: { password: string; hash: string }) {
    const { password, hash: hashedPassword } = data
    return verify(hashedPassword, password, opts)
  }
}
