import { errorResponse, okResponse, resolveUrl } from '@/lib/utils'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const urls = searchParams.get('urls')
  if (!urls) {
    return errorResponse('URL is required')
  }
  const urlArr = urls
    .split('\n')
    .map(c => c.trim())
    .filter(Boolean)
  try {
    const result = await resolveUrl(urlArr)
    return okResponse(result)
  } catch (error) {
    console.error('Error fetching URL data:', error)
    return errorResponse('Error fetching URL data')
  }
}
