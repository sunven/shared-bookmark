'use client'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'

export default function ClientForm({ formSchema, onSubmit, children }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  })

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    const result = await onSubmit(values)
    toast({
      // title: 'You submitted the following values:',
      description: JSON.stringify(result),
    })
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {children}
        <Button type="submit">提交</Button>
      </form>
    </Form>
  )
}
