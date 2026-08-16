import * as React from 'react'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toast'
import { NuqsAdapter } from 'nuqs/adapters/tanstack-router'

type RouterContext = {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <React.Fragment>
      <NuqsAdapter>
        <Outlet />
        <Toaster />
      </NuqsAdapter>
    </React.Fragment>
  )
}
