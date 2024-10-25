'use server'

import { z } from 'zod'

const formSchema = z.object({
  title: z.string().min(2, {
    message: '标题至少需要2个字符。',
  }),
  urls: z.array(
    z.object({
      value: z.string().url({ message: '请输入有效的URL。' }),
    })
  ),
})

export async function createTopic(values: z.infer<typeof formSchema>) {
  console.log('values', values)
  try {
    const validatedData = formSchema.parse(values)
    // 这里处理验证后的数据，例如保存到数据库
    console.log(validatedData)
    // 返回成功消息或重定向
    return { success: true, message: '主题创建成功' }
  } catch (error) {
    if (error instanceof z.ZodError) {
      // 返回验证错误
      return { success: false, errors: error.errors }
    }
    // 返回其他错误
    return { success: false, message: '发生未知错误' }
  }
}
