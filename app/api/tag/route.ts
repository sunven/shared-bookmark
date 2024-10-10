import { getAllTags } from '@/lib/db'

export async function GET() {
  const data = await getAllTags()
  return Response.json(data)
}
