import { toast } from '@/hooks/use-toast'
import { clsx, type ClassValue } from 'clsx'
import { NextResponse } from 'next/server'
import { twMerge } from 'tailwind-merge'
import * as cheerio from 'cheerio'
import to from 'await-to-js'

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

export function toastOk(msg: string) {
  toast({
    variant: 'default',
    title: 'success',
    description: msg,
  })
}

export function toastError(msg?: string) {
  toast({
    variant: 'destructive',
    title: 'error',
    description: msg,
  })
}

export type JsonBodyType<T = unknown> = {
  status: 0 | 1
  data?: T
  message?: string
}

export function okJsonBody<T>(data?: T): JsonBodyType<T> {
  return { status: 0, data }
}

export function errorJsonBody<T>(message?: string): JsonBodyType<T> {
  return { status: 1, message }
}

export function okResponse<T>(data?: T) {
  return NextResponse.json(okJsonBody<T>(data))
}

export function errorResponse(message: string, status: number = 500) {
  return NextResponse.json(errorJsonBody(message), { status })
}

export async function resolveUrl<T>(urlList: string[]) {
  return new Promise<T[]>((resolve, reject) => {
    Promise.all(urlList.map(url => fetch(url)))
      .then(async values => {
        const result: T[] = []
        for (let i = 0; i < values.length; i++) {
          const response = values[i]
          const url = urlList[i]
          const [err, html] = await to(response.text())
          if (err) {
            result.push({ title: url, url } as T)
            console.error(url, err)
            break
          }
          const $ = cheerio.load(html)
          const icon = getUrl(getIconHref($), url)
          const description = $('meta[name="description"]').attr('content') || ''
          result.push({ title: getTitle($, url), url, icon, description } as T)
        }
        resolve(result)
      })
      .catch(reject)
  })
}

function getTitle($: cheerio.CheerioAPI, href: string) {
  const url = new URL(href)
  let title = ''
  if (url.hostname === 'github.com') {
    // e.g.
    // https://github.com/bytedance/IconPark
    // https://github.com/bytedance/IconPark/blob/master/CHANGELOG.zh-CN.md
    title = url.pathname.split('/').slice(1, 3).join('/')
  } else {
    title = $('title').text() || ''
  }
  return title.substring(0, 128)
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
