'use server'

import { toast } from '@/hooks/use-toast'
import { z } from 'zod'
import { createTopic as createTopic1 } from '../../lib/db'

const formSchema = z.object({
  title: z.string().min(2, {
    message: '标题至少需要2个字符。',
  }),
  urls: z.string(),
  // urls: z.array(
  //   z.object({
  //     value: z.string().url({ message: '请输入有效的URL。' }),
  //   })
  // ),
})

export async function createTopic(values: z.infer<typeof formSchema>) {
  console.log('values', values)
  try {
    const validatedData = formSchema.parse(values)
    return await createTopic1({ name: 'a', urls: [{ title: 'a', url: 'a' }] })
  } catch (error) {
    if (error instanceof z.ZodError) {
      // 返回验证错误
      return { success: false, errors: error.errors }
    }
    // 返回其他错误
    return { success: false, message: '发生未知错误' }
  }
}
