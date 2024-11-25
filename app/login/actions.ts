'use server'
import { signIn } from '@/auth'
import { AuthError } from 'next-auth'
import type { BuiltInProviderType } from '@auth/core/providers'

export async function signInAction(provider: BuiltInProviderType) {
  try {
    await signIn(provider, { redirectTo: '/' })
  } catch (error) {
    if (error instanceof AuthError)
      // Handle auth errors
      console.log('error', error)
    throw error // Rethrow all other errors
  }
}
