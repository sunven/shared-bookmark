import { createSoftware, getSoftwares } from '@/lib/db'

export async function POST(request: Request) {
  const data = await request.json()
  const res = await createSoftware(data)
  console.log('res', res)
  return Response.json(res)
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = +(searchParams.get('page') ?? '1')
  const pageSize = +(searchParams.get('pageSize') ?? '10')
  const category = +(searchParams.get('category') ?? '0')
  const softwares = await getSoftwares(page, pageSize, category)
  console.log('softwares', softwares)
  return Response.json(softwares)
}
