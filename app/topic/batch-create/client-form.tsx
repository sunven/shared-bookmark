'use client'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Textarea } from '@/components/ui/textarea'
import { formSchema } from './schema'
import { Input } from '@/components/ui/input'
import { upsertTopic } from './actions'
import { useRouter } from 'next/navigation'
import { JsonBodyType, toastError, toastOk } from '@/lib/utils'
import { useActionState } from 'react'

export default function ClientForm() {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      urls: '',
    },
  })
  const [_, action, isPending] = useActionState<JsonBodyType<string> | undefined, FormData>(
    async (preState, formData) => {
      // return await new Promise(resolve => {
      //   setTimeout(() => {
      //     resolve(undefined)
      //   }, 1000)
      // })
      const result = await form.trigger()
      if (result) {
        return upsertTopic(preState, formData).then(data => {
          const { status, message } = data
          if (status === 0) {
            toastOk('创建成功')
            router.push('/topic/list')
          } else {
            toastError(message)
          }
          return data
        })
      }
    },
    undefined
  )

  return (
    <Form {...form}>
      <form action={action} className="space-y-8 mx-[25%]">
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-4">
                <FormLabel className="flex-shrink-0 w-20">标题</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="description"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-4">
                <FormLabel className="flex-shrink-0 w-20">描述</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="urls"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-4">
                <FormLabel className="flex-shrink-0 w-20">urls</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={10} placeholder="请输入url，每行一个" />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button disabled={isPending} type="submit">
            {isPending ? '提交中...' : '提交'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
