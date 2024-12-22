import prisma from '@/lib/prisma'
import { errorResponse, okResponse } from '@/lib/utils'
import to from 'await-to-js'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const pageIndex = searchParams.get('pageIndex')
  const pageSize = searchParams.get('pageSize')
  const countPromise = prisma.topic.count({})
  const topicPromise = prisma.topic.findMany({
    skip: Number(pageIndex) * Number(pageSize),
    take: Number(pageSize),
    orderBy: {
      updatedAt: 'desc',
    },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          urls: true,
        },
      },
    },
  })

  const [error, result] = await to<[number, Awaited<typeof topicPromise>]>(Promise.all([countPromise, topicPromise]))
  if (error || !result) return errorResponse('Failed to get topics')
  const [count, rows] = result
  return okResponse({ count, rows })
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const ids = searchParams.get('ids')
  if (!ids) return errorResponse('ids is required')

  const { count } = await prisma.topic.deleteMany({
    where: {
      id: {
        in: ids.split(','),
      },
    },
  })

  return okResponse({ count })
}
