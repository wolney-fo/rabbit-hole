import { SignUpForm } from '@/components/sign-up-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sign-up')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <SignUpForm />
    </div>
  )
}
