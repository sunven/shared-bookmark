'use server'

import { z } from 'zod'
import { createTopic, getTopic, updateTopic } from '../../../lib/db'
import { formSchema } from './schema'

export async function upsertTopic(values: z.infer<typeof formSchema>, data?: Awaited<ReturnType<typeof getTopic>>) {
  try {
    // const validatedData = formSchema.parse(values)
    if (data) {
      const originalIds = data.urls.map(c => c.id!)
      const ids = values.urls.map(c => c.id)
      return await updateTopic({
        id: data.id!,
        name: values.name,
        createMany: values.urls.filter(c => !c.id),
        updateMany: values.urls.filter(c => c.id),
        deleteMany: originalIds.filter(c => !ids.includes(c)),
      })
    } else {
      return await createTopic(values)
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      // 返回验证错误
      return { success: false, errors: error.errors }
    }
    // 返回其他错误
    return { success: false, message: '发生未知错误' }
  }
}
