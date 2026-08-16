import { filesListSchema } from '@/http/schemas/files'
import { useQuery } from '@tanstack/react-query'
import { parseAsIndex, useQueryState } from 'nuqs'
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from './ui/attachment'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination'
import { FileIcon, LinkIcon } from 'lucide-react'
import { Skeleton } from './ui/skeleton'
import { dayjs } from '@/lib/dayjs'
import { toast } from './ui/toast'

// Must match the fixed page size used by the API (`take: 20` in
// PrismaFilesRepository.findManyByUserId).
const PAGE_SIZE = 20

export function UserUploadsList() {
  const [pageIndex, setPageIndex] = useQueryState(
    'pageIndex',
    parseAsIndex.withDefault(0),
  )
  const page = pageIndex + 1

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['uploads', page],
    queryFn: async () => {
      const url = new URL(`${import.meta.env.VITE_API_URL}/uploads`)

      url.searchParams.set('page', String(page))

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      })
      const data = await response.json()

      return filesListSchema.parse(data)
    },
  })

  const hasPreviousPage = pageIndex > 0
  const hasNextPage = (data?.files.length ?? 0) === PAGE_SIZE

  function handleCopyDownloadUrl(filePublicId: string) {
    navigator.clipboard.writeText(
      `${import.meta.env.VITE_APP_URL}/s/${filePublicId}`,
    )

    console.log('oi')

    toast.add({
      title: 'URL copied to clipboard',
      type: 'success',
      priority: 'high',
    })
  }

  if (isError) {
    return <p>Error: {error.message}</p>
  }

  if (isLoading) {
    return (
      <div className="flex flex-wrap items-start justify-start gap-2 w-11/12">
        <Skeleton className="w-64 h-16" />
        <Skeleton className="w-64 h-16" />
        <Skeleton className="w-64 h-16" />
        <Skeleton className="w-64 h-16" />
        <Skeleton className="w-64 h-16" />
        <Skeleton className="w-64 h-16" />
        <Skeleton className="w-64 h-16" />
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-wrap items-start justify-start gap-2 w-11/12">
        {data && data.files.length > 0 ? (
          data.files.map((file) => {
            return (
              <Attachment
                key={`files-${file.id}`}
                state="done"
                className="min-w-64"
              >
                <AttachmentMedia>
                  <FileIcon />
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>{file.name}</AttachmentTitle>
                  <AttachmentDescription>
                    {dayjs(file.createdAt).format('ll')}
                  </AttachmentDescription>
                </AttachmentContent>
                <AttachmentActions>
                  <AttachmentAction
                    aria-label="Copy link"
                    title="Copy link"
                    onClick={() => handleCopyDownloadUrl(file.publicId)}
                  >
                    <LinkIcon />
                  </AttachmentAction>
                </AttachmentActions>
              </Attachment>
            )
          })
        ) : (
          <p>No uploads yet</p>
        )}
      </div>

      {(hasPreviousPage || hasNextPage) && (
        <Pagination className="justify-start">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={!hasPreviousPage}
                className={
                  hasPreviousPage
                    ? undefined
                    : 'pointer-events-none opacity-50'
                }
                onClick={(event) => {
                  event.preventDefault()

                  if (hasPreviousPage) {
                    setPageIndex(pageIndex - 1)
                  }
                }}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                aria-disabled={!hasNextPage}
                className={
                  hasNextPage ? undefined : 'pointer-events-none opacity-50'
                }
                onClick={(event) => {
                  event.preventDefault()

                  if (hasNextPage) {
                    setPageIndex(pageIndex + 1)
                  }
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  )
}
