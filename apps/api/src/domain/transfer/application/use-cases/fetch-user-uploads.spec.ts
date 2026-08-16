import { InMemoryFilesRepository } from '../../../../../test/repositories/in-memory-files-repository'
import { FetchUserUploadsUseCase } from './fetch-user-uploads'
import { makeFile } from '../../../../../test/factories/make-file'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryFilesRepoistory: InMemoryFilesRepository
let sut: FetchUserUploadsUseCase

describe('Fetch user uploads use case', () => {
  beforeEach(() => {
    inMemoryFilesRepoistory = new InMemoryFilesRepository()
    sut = new FetchUserUploadsUseCase(inMemoryFilesRepoistory)
  })

  it('should be able to fetch files from a user', async () => {
    inMemoryFilesRepoistory.items.push(
      makeFile({ ownerId: new UniqueEntityId('user-1') }),
      makeFile({ ownerId: new UniqueEntityId('user-1') }),
      makeFile({ ownerId: new UniqueEntityId('user-1') }),
      makeFile({ ownerId: new UniqueEntityId('user-2') }),
      makeFile({ ownerId: new UniqueEntityId('user-2') }),
    )

    const result = await sut.execute({
      userId: 'user-1',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.files).toHaveLength(3)
  })

  it('should be able to fetch paginated files from a user', async () => {
    for (let i = 1; i <= 22; i++) {
      inMemoryFilesRepoistory.items.push(
        makeFile({ ownerId: new UniqueEntityId('user-1') }),
      )
    }

    const result = await sut.execute({
      userId: 'user-1',
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.files).toHaveLength(2)
  })
})
