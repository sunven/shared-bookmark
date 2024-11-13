'use server'

import { z } from 'zod'
import { createTopic } from '../../../lib/db'
import { formSchema } from './schema'
import { resolveUrl } from '@/lib/utils'
import { Prisma } from '@prisma/client'

export async function upsertTopic(values: z.infer<typeof formSchema>) {
  try {
    const validatedData = formSchema.parse(values)
    const urlList = validatedData.urls
      .split('\n')
      .map(c => c.trim())
      .filter(c => c)
    const result = await resolveUrl<Prisma.UrlCreateWithoutTopicInput>(urlList)
    const id = await createTopic({
      name: validatedData.name,
      urls: result,
    })
    return id
  } catch (error) {
    return error
  }
}
