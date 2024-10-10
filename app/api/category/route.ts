import { getAllCategories } from '@/lib/db'

export async function GET() {
  const data = await getAllCategories()
  return Response.json(data)
}
