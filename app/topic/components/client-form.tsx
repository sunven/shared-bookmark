'use client'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { PlusCircle, X } from 'lucide-react'
import { formSchema } from '../schema'

export default function ClientForm({ onSubmit }) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { urls: [{ icon: '', title: '', url: '' }] },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'urls',
  })

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    console.log('onSubmit1', values)
    const result = await onSubmit(values)
    toast({
      // title: 'You submitted the following values:',
      description: JSON.stringify(result),
    })
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 mx-[25%]">
        <FormField
          name="title"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-4">
                <FormLabel className="flex-shrink-0 w-20">标题</FormLabel>
                <FormControl>
                  <Input placeholder="输入标题" {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4 p-4 border rounded-md">
            <FormField
              name={`urls.${index}.title`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-4">
                    <FormLabel className="flex-shrink-0 w-20">网址标题</FormLabel>
                    <FormControl>
                      <Input placeholder="网址标题" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={`urls.${index}.url`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-4">
                    <FormLabel className="flex-shrink-0 w-20">网址</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com" {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={`urls.${index}.icon`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center space-x-4">
                    <FormLabel className="flex-shrink-0 w-20">图标URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={`urls.${index}.description`}
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
            {index > 0 && (
              <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                <X className="h-4 w-4 mr-2" />
                删除此网址
              </Button>
            )}
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => append({})}>
          <PlusCircle className="h-4 w-4 mr-2" />
          添加网址
        </Button>
        <Button type="submit">提交</Button>
      </form>
    </Form>
  )
}
