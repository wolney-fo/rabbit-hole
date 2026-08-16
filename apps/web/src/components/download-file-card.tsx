import { useQuery } from '@tanstack/react-query'
import { DownloadIcon, FileIcon, FileXIcon } from 'lucide-react'

import { downloadUrlResponseSchema } from '@/http/schemas/files'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Skeleton } from './ui/skeleton'

export function DownloadFileCard({ fileId }: { fileId: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['download-url', fileId],
    queryFn: async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/uploads/${fileId}`,
        { method: 'GET' },
      )

      if (!response.ok) {
        throw new Error('File not found')
      }

      const { data } = downloadUrlResponseSchema.parse(await response.json())

      return data
    },
    retry: false,
  })

  if (isLoading) {
    return (
      <Card className="w-11/12 max-w-sm">
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (isError || !data) {
    return (
      <Card className="w-11/12 max-w-sm">
        <CardContent className="flex flex-col items-center gap-4 py-4 text-center">
          <FileXIcon className="size-12 text-muted-foreground" />
          <p className="text-lg">
            This file doesn't exist or is no longer available
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-11/12 max-w-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileIcon className="size-4 shrink-0" />
          <span className="truncate">{data.name}</span>
        </CardTitle>
        <CardDescription>{data.contentType}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          className="w-full"
          nativeButton={false}
          render={<a href={data.url} />}
        >
          <DownloadIcon data-icon="inline-start" />
          Download
        </Button>
      </CardContent>
    </Card>
  )
}
