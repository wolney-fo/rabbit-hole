import { InMemoryFilesRepository } from '../../../../../test/repositories/in-memory-files-repository'
import { GenerateUploadUrlUseCase } from './generate-upload-url'
import { FakeStorage } from '../../../../../test/storage/fake-storage'

let inMemoryFilesRepository: InMemoryFilesRepository
let fakeStorage: FakeStorage
let sut: GenerateUploadUrlUseCase

describe('Generate upload URL use case', () => {
  beforeEach(() => {
    inMemoryFilesRepository = new InMemoryFilesRepository()
    fakeStorage = new FakeStorage()

    sut = new GenerateUploadUrlUseCase(inMemoryFilesRepository, fakeStorage)
  })

  it('should be able to generate a signed URL for a file', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      name: 'Test video',
      contentType: 'vide/mp4',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.fileId).toBeTruthy()
    expect(result.value?.uploadUrl).toBeTruthy()
  })
})
