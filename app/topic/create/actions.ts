'use server'

import { z } from 'zod'
import { createTopic, updateTopic } from '../../../lib/db'
import { formSchema } from './schema'

export async function upsertTopic(values: z.infer<typeof formSchema>) {
  console.log('values', values)
  try {
    const validatedData = formSchema.parse(values)
    console.log('validatedData', validatedData)
    if (values.id) {
      return await updateTopic(values)
    } else {
      return await createTopic(values)
    }
    // return await createTopic(validatedData)
  } catch (error) {
    if (error instanceof z.ZodError) {
      // 返回验证错误
      return { success: false, errors: error.errors }
    }
    // 返回其他错误
    return { success: false, message: '发生未知错误' }
  }
}
