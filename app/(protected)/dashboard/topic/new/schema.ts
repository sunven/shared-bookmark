import { z } from 'zod'

const urlSchema = z.object({
  id: z.number().optional(),
  icon: z.string().optional(),
  title: z.string().min(1, { message: '不能为空。' }),
  url: z.string().url({ message: '请输入有效的URL。' }),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

export const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, {
    message: '不能为空。',
  }),
  description: z.string().optional(),
  urls: z.array(urlSchema).min(1, { message: '至少需要一个URL。' }),
})
