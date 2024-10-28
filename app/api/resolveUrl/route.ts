// app/api/fetch-url/route.ts
import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  if (!url) {
    return NextResponse.json({ message: 'URL is required' }, { status: 400 })
  }

  try {
    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html)
    const title = $('title').text() || ''
    const icon = getUrl($('link[rel="icon"]').attr('href'), url)
    const description = $('meta[name="description"]').attr('content') || ''
    return NextResponse.json({ title, icon, description })
  } catch (error) {
    console.error('Error fetching URL data:', error)
    return NextResponse.json({ message: 'Error fetching URL data' }, { status: 500 })
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
