import { z } from 'zod'

const urlSchema = z.object({
  icon: z.string().optional(),
  title: z.string(),
  url: z.string().url({ message: '请输入有效的URL。' }),
  description: z.string().optional(),
})

export const formSchema = z.object({
  name: z.string().min(2, {
    message: '标题至少需要2个字符。',
  }),
  urls: z.array(urlSchema).min(1, { message: '至少需要一个URL。' }),
})
