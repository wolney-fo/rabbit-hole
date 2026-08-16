import { createFileRoute, redirect } from '@tanstack/react-router'

import { AppSidebar } from '@/components/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { authClient } from '@/lib/auth-client'
import { UserUploadsList } from '@/components/user-uploads-list'
import { UploadFileDialog } from '@/components/upload-file-dialog'
import { createStandardSchemaV1, parseAsIndex, parseAsString } from 'nuqs'

const searchParams = {
  searchQuery: parseAsString.withDefault('1'),
  pageIndex: parseAsIndex.withDefault(0),
}

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession()

    if (!session) {
      throw redirect({ to: '/sign-in' })
    }
  },
  component: RouteComponent,
  validateSearch: createStandardSchemaV1(searchParams, {
    partialOutput: true,
  }),
})

function RouteComponent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-8">
          <div className="flex flex-wrap items-center justify-between gap-2 w-full">
            <h1 className="font-bold text-xl">My Uploads</h1>

            <UploadFileDialog />
          </div>

          <UserUploadsList />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
