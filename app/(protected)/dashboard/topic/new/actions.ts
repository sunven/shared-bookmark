'use server'

import { z } from 'zod'
import { createTopic, getTopic, updateTopic } from '@/lib/db'
import { formSchema } from './schema'
import { errorJsonBody, JsonBodyType, okJsonBody } from '@/lib/utils'

export async function upsertTopic(
  values: z.infer<typeof formSchema>,
  data?: Awaited<ReturnType<typeof getTopic>>
): Promise<JsonBodyType<string>> {
  const validatedFields = formSchema.safeParse(values)
  if (!validatedFields.success) {
    return errorJsonBody(validatedFields.error.message)
  }
  if (data) {
    const originalIds = data.urls.map(c => c.id)
    const ids = values.urls.map(c => c.id)
    await updateTopic({
      id: data.id,
      name: values.name,
      description: values.description,
      createMany: values.urls.filter(c => !c.id),
      updateMany: values.urls.filter(c => c.id && ids.includes(c.id)),
      deleteMany: originalIds.filter(c => !ids.includes(c)),
    })
    return okJsonBody('')
  } else {
    const result = await createTopic(values)
    return okJsonBody(result.id)
  }
}
