import { toast } from '@/hooks/use-toast'
import { clsx, type ClassValue } from 'clsx'
import { NextResponse } from 'next/server'
import { twMerge } from 'tailwind-merge'
import * as cheerio from 'cheerio'

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
  return NextResponse.json({ data })
}

export function errorResponse(message: string, status: number = 500) {
  return NextResponse.json({ message }, { status })
}

export async function resolveUrl<T>(urlList: string[]) {
  return new Promise<T[]>(async resolve => {
    const values = await Promise.all(urlList.map(url => fetch(url)))
    const result: T[] = []
    for (let i = 0; i < values.length; i++) {
      const response = values[i]
      const html = await response.text()
      const $ = cheerio.load(html)
      const title = $('title').text() || ''
      const url = urlList[i]
      const icon = getUrl(getIconHref($), url)
      const description = $('meta[name="description"]').attr('content') || ''
      result.push({ title, url, icon, description } as T)
    }
    resolve(result)
  })
}

function getIconHref($: cheerio.CheerioAPI) {
  const arr = ['link[rel="icon"]', 'link[rel="shortcut icon"]']
  for (const selector of arr) {
    const url = $(selector).attr('href')
    if (url) {
      return url
    }
  }
}

function getUrl(url: string | undefined, websiteUrl: string) {
  if (!url) {
    return url
  }
  const parsedUrl = new URL(websiteUrl)
  if (url.startsWith('//')) {
    return parsedUrl.protocol + url
  } else if (url.startsWith('/')) {
    return parsedUrl.origin + url
  } else {
    return url
  }
}
