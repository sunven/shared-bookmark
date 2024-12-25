import { toast } from '@/hooks/use-toast'
import { clsx, type ClassValue } from 'clsx'
import { NextResponse } from 'next/server'
import { twMerge } from 'tailwind-merge'
import * as cheerio from 'cheerio'
import to from 'await-to-js'
import { siteConfig } from '@/config/site'
import { Metadata } from 'next'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
  const parsedUrl = new URL(websiteUrl)
  if (!url) {
    return parsedUrl.origin + '/favicon.ico'
  }
  if (url.startsWith('http')) {
    return url
  }

  if (url.startsWith('//')) {
    return parsedUrl.protocol + url
  } else if (url.startsWith('/')) {
    return parsedUrl.origin + url
  } else {
    return parsedUrl.origin + '/' + url
  }
}

export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  icons = '/favicon.ico',
  noIndex = false,
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title,
    description,
    keywords: ['Next.js', 'React', 'Prisma', 'Neon', 'Auth.js', 'shadcn ui', 'Resend', 'React Email', 'Stripe'],
    authors: [
      {
        name: 'mickasmt',
      },
    ],
    creator: 'mickasmt',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteConfig.url,
      title,
      description,
      siteName: title,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@miickasmt',
    },
    icons,
    metadataBase: new URL(siteConfig.url),
    manifest: `${siteConfig.url}/site.webmanifest`,
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  }
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_APP_URL}${path}`
}

// Utils from precedent.dev
export const timeAgo = (timestamp: Date, timeOnly?: boolean): string => {
  if (!timestamp) return 'never'
  return `${ms(Date.now() - new Date(timestamp).getTime())}${timeOnly ? '' : ' ago'}`
}

export async function fetcher<JSON = any>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
  const res = await fetch(input, init)

  if (!res.ok) {
    const json = await res.json()
    if (json.error) {
      const error = new Error(json.error) as Error & {
        status: number
      }
      error.status = res.status
      throw error
    } else {
      throw new Error('An unexpected error occurred')
    }
  }

  return res.json()
}

export function nFormatter(num: number, digits?: number) {
  if (!num) return '0'
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ]
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value
    })
  return item ? (num / item.value).toFixed(digits || 1).replace(rx, '$1') + item.symbol : '0'
}

export function capitalize(str: string) {
  if (!str || typeof str !== 'string') return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const truncate = (str: string, length: number) => {
  if (!str || str.length <= length) return str
  return `${str.slice(0, length)}...`
}

export const getBlurDataURL = async (url: string | null) => {
  if (!url) {
    return 'data:image/webp;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
  }

  if (url.startsWith('/_static/')) {
    url = `${siteConfig.url}${url}`
  }

  try {
    const response = await fetch(`https://wsrv.nl/?url=${url}&w=50&h=50&blur=5`)
    const buffer = await response.arrayBuffer()
    const base64 = Buffer.from(buffer).toString('base64')

    return `data:image/png;base64,${base64}`
  } catch (error) {
    return 'data:image/webp;base64,AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA='
  }
}

export const placeholderBlurhash =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAoJJREFUWEfFl4lu4zAMRO3cx/9/au6reMaOdkxTTl0grQFCRoqaT+SQotq2bV9N8rRt28xms87m83l553eZ/9vr9Wpkz+ezkT0ej+6dv1X81AFw7M4FBACPVn2c1Z3zLgDeJwHgeLFYdAARYioAEAKJEG2WAjl3gCwNYymQQ9b7/V4spmIAwO6Wy2VnAMikBWlDURBELf8CuN1uHQSrPwMAHK5WqwFELQ01AIXdAa7XawfAb3p6AOwK5+v1ugAoEq4FRSFLgavfQ49jAGQpAE5wjgGCeRrGdBArwHOPcwFcLpcGU1X0IsBuN5tNgYhaiFFwHTiAwq8I+O5xfj6fOz38K+X/fYAdb7fbAgFAjIJ6Aav3AYlQ6nfnDoDz0+lUxNiLALvf7XaDNGQ6GANQBKR85V27B4D3QQRw7hGIYlQKWGM79hSweyCUe1blXhEAogfABwHAXAcqSYkxCtHLUK3XBajSc4Dj8dilAeiSAgD2+30BAEKV4GKcAuDqB4TdYwBgPQByCgApUBoE4EJUGvxUjF3Q69/zLw3g/HA45ABKgdIQu+JPIyDnisCfAxAFNFM0EFNQ64gfS0EUoQP8ighrZSjn3oziZEQpauyKbfjbZchHUL/3AS/Dd30gAkxuRACgfO+EWQW8qwI1o+wseNuKcQiESjALvwNoMI0TcRzD4lFcPYwIM+JTF5x6HOs8yI7jeB5oKhpMRFH9UwaSCDB2Jmg4rc6E2TT0biIaG0rQhNqyhpHBcayTTSXH6vcDL7/sdqRK8LkwTsU499E8vRcAojHcZ4AxABdilgrp4lsXk8oVqgwh7+6H3phqd8J0Kk4vbx/+sZqCD/vNLya/5dT9fAH8g1WdNGgwbQAAAABJRU5ErkJggg=='

export function getValidUrl(url: string, placeholder = '') {
  try {
    new URL(url)
    return url
  } catch (_) {
    return placeholder
  }
}
