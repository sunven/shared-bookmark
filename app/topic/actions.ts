'use server'

import { z } from 'zod'
import { createTopic as createTopic1 } from '../../lib/db'
import { formSchema } from './schema'

export async function createTopic(values: z.infer<typeof formSchema>) {
  try {
    const validatedData = formSchema.parse(values)
    return await createTopic1(validatedData)
  } catch (error) {
    if (error instanceof z.ZodError) {
      // 返回验证错误
      return { success: false, errors: error.errors }
    }
    // 返回其他错误
    return { success: false, message: '发生未知错误' }
  }
}
