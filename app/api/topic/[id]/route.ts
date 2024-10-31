import prisma from '@/lib/prisma'
import { errorResponse, okResponse } from '@/lib/utils'

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
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
