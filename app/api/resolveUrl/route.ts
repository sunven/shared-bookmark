import * as cheerio from 'cheerio'
import { errorResponse, okResponse } from '@/lib/utils'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  if (!url) {
    return errorResponse('URL is required')
  }

  try {
    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html)
    const title = $('title').text() || ''
    const icon = getUrl(getIconHref($), url)
    const description = $('meta[name="description"]').attr('content') || ''
    return okResponse({ title, icon, description })
  } catch (error) {
    console.error('Error fetching URL data:', error)
    return errorResponse('Error fetching URL data')
  }
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
