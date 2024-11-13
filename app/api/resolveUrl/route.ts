import { errorResponse, okResponse, resolveUrl } from '@/lib/utils'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  if (!url) {
    return errorResponse('URL is required')
  }

  try {
    const result = await resolveUrl([url])
    return okResponse(result[0])
  } catch (error) {
    console.error('Error fetching URL data:', error)
    return errorResponse('Error fetching URL data')
  }
}
