import { z } from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from './ui/field'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { authClient } from '@/lib/auth-client'
import { Link } from '@tanstack/react-router'

export function SignInForm() {
  const signInFormSchema = z.object({
    email: z.email(),
    password: z
      .string()
      .min(8, { error: 'Password has at least 8 chacarters' }),
  })

  type SignInFormSchema = z.infer<typeof signInFormSchema>

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<SignInFormSchema>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit({ email, password }: SignInFormSchema) {
    const { error } = await authClient.signIn.email({
      email,
      password,
      rememberMe: true,
      callbackURL: `${import.meta.env.VITE_APP_URL}/dashboard`,
    })

    if (error) {
      setError('root', {
        message: error.message,
      })
    }
  }

  return (
    <Card className="w-11/12 max-w-sm">
      <CardHeader>
        <CardTitle>Welcome back!</CardTitle>
        <CardDescription>Sign in your account to share files</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
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
              <Input id="password" type="password" {...register('password')} />
              <FieldError>{errors.password?.message}</FieldError>
            </Field>
            <Field>
              <Button type="submit" disabled={isSubmitting || isSubmitted}>
                Sign in
              </Button>
              <FieldDescription className="text-center">
                Don&apos;t have an account? <Link to="/sign-up">Sign up</Link>
              </FieldDescription>
            </Field>

            <FieldError className="text-center">
              {errors.root?.message}
            </FieldError>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
