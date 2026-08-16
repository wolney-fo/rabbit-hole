import { SignInForm } from '@/components/sign-in-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sign-in')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <SignInForm />
    </div>
  )
}
