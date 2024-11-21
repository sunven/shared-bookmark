import prisma from '@/lib/prisma'
import { errorResponse, okResponse } from '@/lib/utils'

export async function DELETE(_: Request, segmentData: { params: Promise<{ id: string }> }) {
  const params = await segmentData.params
  if (!params.id) {
    return errorResponse('id is required')
  }
  try {
    await prisma.topic.delete({
      where: { id: params.id },
    })
    return okResponse()
  } catch (error) {
    console.error(error)
    return errorResponse('Failed to delete topic')
  }
}
