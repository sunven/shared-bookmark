import { toast } from '@/hooks/use-toast'
import { clsx, type ClassValue } from 'clsx'
import { NextResponse } from 'next/server'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const fetcher = (key: string | ({ url: string } & Record<string, unknown>)) => {
  if (typeof key === 'string') {
    return fetch(key).then(res => res.json())
  }
  const { url, ...rest } = key
  return fetch(url, rest).then(res => res.json())
}

export function toastError(msg: string) {
  toast({
    variant: 'destructive',
    title: 'error',
    description: msg,
  })
}

export function okResponse(data?: unknown) {
  return NextResponse.json({ status: 0, data })
}

export function errorResponse(message: string) {
  return NextResponse.json({ status: -1, message })
}
