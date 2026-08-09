import { InMemoryFilesRepository } from '../../../../../test/repositories/in-memory-files-repository'
import { FakeStorage } from '../../../../../test/storage/fake-storage'
import { GenerateDownloadUrlUseCase } from './generate-download-url'
import { makeFile } from '../../../../../test/factories/make-file'

let inMemoryFilesRepository: InMemoryFilesRepository
let fakeStorage: FakeStorage
let sut: GenerateDownloadUrlUseCase

describe('Generate download URL use case', () => {
  beforeEach(() => {
    inMemoryFilesRepository = new InMemoryFilesRepository()
    fakeStorage = new FakeStorage()
    sut = new GenerateDownloadUrlUseCase(inMemoryFilesRepository, fakeStorage)
  })

  it('should be able to generate a download signed URL for a file', async () => {
    const file = makeFile()

    await inMemoryFilesRepository.create(file)

    const result = await sut.execute({
      id: file.id.toString(),
    })

    expect(result.isRight()).toBe(true)
  })
})
