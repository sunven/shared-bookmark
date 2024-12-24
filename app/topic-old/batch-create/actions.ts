'use server'

import { createTopic } from '../../../lib/db'
import { formSchema } from './schema'
import { errorJsonBody, JsonBodyType, okJsonBody, resolveUrl } from '@/lib/utils'
import { Prisma } from '@prisma/client'

export async function upsertTopic(state: unknown, formData: FormData): Promise<JsonBodyType<string>> {
  const validatedFields = formSchema.safeParse(Object.fromEntries(formData.entries()))
  if (!validatedFields.success) {
    return errorJsonBody(validatedFields.error.message)
  }

  // return new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve(okJsonBody('setTimeout'))
  //   }, 1000)
  // })

  const urlList = validatedFields.data.urls
    .split('\n')
    .map(c => c.trim())
    .filter(c => c)
  const result = await resolveUrl<Prisma.UrlCreateWithoutTopicInput>(urlList)
  const { id } = await createTopic({
    name: validatedFields.data.name,
    description: validatedFields.data.description,
    urls: result,
  })
  return okJsonBody(id)
}
