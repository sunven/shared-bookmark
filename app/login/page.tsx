'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useTransition } from 'react'
import { signInAction } from './actions'
import { BuiltInProviderType } from '@auth/core/providers'
import Image from 'next/image'

export default function Login() {
  const [isPending, startTransition] = useTransition()

  const submitLogin = async (provider: BuiltInProviderType) => {
    startTransition(() => {
      signInAction(provider)
    })
  }
  return (
    <div className="flex w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline">
                  Forgot your password?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button
              variant="outline"
              className="w-full"
              disabled={isPending}
              onClick={() => {
                submitLogin('google')
              }}
            >
              <Image
                alt="google"
                src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
                width={24}
                height={24}
              />
              Login with Google
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?
            <Link href="#" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
