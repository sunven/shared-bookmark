import prisma from '@/lib/prisma'
import { errorResponse, okResponse } from '@/lib/utils'

export async function GET(_: Request) {
  const topics = await prisma.topic
    .findMany({
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
    .catch(error => {
      console.error(error)
      return errorResponse('Failed to get topics')
    })
  return okResponse(topics)
}
