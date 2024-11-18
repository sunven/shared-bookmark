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
import to from 'await-to-js'
import { useRouter } from 'next/navigation'
import { toastError, toastOk } from '@/lib/utils'

export default function ClientForm() {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      urls: '',
    },
  })
  async function handleSubmit(values: z.infer<typeof formSchema>) {
    const [error] = await to(upsertTopic(values))
    if (error) {
      toastError(error.message)
    } else {
      toastOk('创建成功')
      router.push('/topic/list')
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 mx-[25%]">
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
          <Button type="submit">提交</Button>
        </div>
      </form>
    </Form>
  )
}
