'use client'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Textarea } from '@/components/ui/textarea'

const formSchema = z.object({
  urls: z.string().min(1, {
    message: '不能为空。',
  }),
})

export default function ClientForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      urls: '',
    },
  })
  const handleSubmit = () => {}
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
                  <Textarea {...field} />
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
