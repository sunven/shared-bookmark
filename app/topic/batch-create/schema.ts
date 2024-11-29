import { z } from 'zod'

export const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: '不能为空。',
    })
    .trim(),
  description: z.string().trim(),
  urls: z
    .string()
    .min(1, {
      message: '不能为空。',
    })
    .trim(),
})
