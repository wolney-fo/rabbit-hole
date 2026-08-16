import { createFileRoute } from '@tanstack/react-router'

import { DownloadFileCard } from '@/components/download-file-card'

export const Route = createFileRoute('/s/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()

  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <DownloadFileCard fileId={id} />
    </div>
  )
}
