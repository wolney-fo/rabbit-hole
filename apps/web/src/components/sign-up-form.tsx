import { authClient } from '@/lib/auth-client'
import { zodResolver } from '@hookform/resolvers/zod'
import { MailboxIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from './ui/field'
import { Input } from './ui/input'

export function SignUpForm() {
  const signUpFormSchema = z.object({
    name: z.string().nonempty({ error: 'Name must have at lest 2 characters' }),
    email: z.email(),
    password: z
      .string()
      .min(8, { error: 'Password must have at least 8 chacarters' }),
  })

  type SignUpFormSchema = z.infer<typeof signUpFormSchema>

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitted, isSubmitting },
  } = useForm<SignUpFormSchema>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  async function onSubmit({ name, email, password }: SignUpFormSchema) {
    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
      callbackURL: `${import.meta.env.VITE_APP_URL}/sign-in`,
    })

    if (error) {
      setError('root', {
        message: error.message,
      })
    }
  }

  return (
    <Card className="w-11/12 max-w-sm">
      {isSubmitted ? (
        <>
          <CardContent className="flex flex-col items-center gap-4">
            <MailboxIcon className="size-12 text-primary" />
            <p className="text-lg">
              We're almost there! Check your inbox to confirm your e-mail
            </p>
          </CardContent>
        </>
      ) : (
        <>
          <CardHeader>
            <CardTitle>Welcome to Rabbit Hole!</CardTitle>
            <CardDescription>
              Create your account to share files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    autoComplete="off"
                    placeholder="John Doe"
                    {...register('name')}
                  />
                  <FieldError>{errors.name?.message}</FieldError>
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="off"
                    {...register('email')}
                  />
                  <FieldError>{errors.email?.message}</FieldError>
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    {...register('password')}
                  />
                  <FieldError>{errors.password?.message}</FieldError>
                </Field>
                <Field>
                  <Button type="submit" disabled={isSubmitting}>
                    Sign up
                  </Button>
                  <FieldDescription className="text-center">
                    Already have an account? <a href="/sign-in">Sign in</a>
                  </FieldDescription>
                </Field>

                <FieldError className="text-center">
                  {errors.root?.message}
                </FieldError>
              </FieldGroup>
            </form>
          </CardContent>
        </>
      )}
    </Card>
  )
}
