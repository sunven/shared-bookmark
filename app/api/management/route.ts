import { createSoftware } from '@/lib/db'

export async function POST(request: Request) {
  const data = await request.json()
  const res = await createSoftware(data)
  console.log('res', res)
  return Response.json(res)
}
