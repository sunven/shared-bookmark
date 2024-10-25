'use client'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'

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

export default function ClientForm({ onSubmit }) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  })

  // 2. Define a submit handler.
  // function onSubmit(values: z.infer<typeof formSchema>) {
  //   // Do something with the form values.
  //   // ✅ This will be type-safe and validated.
  //   console.log(values)
  // }

  async function onSubmit1(values: z.infer<typeof formSchema>) {
    console.log('onSubmit1', values)
    const result = await onSubmit(values)
    toast({
      // title: 'You submitted the following values:',
      description: JSON.stringify(result),
    })
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit1)} className="space-y-8">
        <FormField
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>标题</FormLabel>
              <FormControl>
                <Input placeholder="输入标题" {...field} />
              </FormControl>
              <FormDescription>请输入主题标题。</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="urls"
          render={({ field }) => (
            <FormItem>
              <FormLabel>网址</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">提交</Button>
      </form>
    </Form>
  )
}
