'use client'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { PlusCircle, Trash2 } from 'lucide-react'
import { formSchema } from '../schema'
import { createTopic } from '../actions'
import { http } from '@/lib/http'

export default function ClientForm() {
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
    const result = await createTopic(values)
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
          <div key={field.id} className="space-y-4 p-4 border rounded-md relative group">
            {fields.length > 1 && (
              <div className="absolute top-0 right-0 hidden group-hover:block">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-700"
                  onClick={() => {
                    remove(index)
                  }}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            )}
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
                      <div className="flex flex-1 gap-2">
                        <Input className="flex-1" placeholder="https://example.com" {...field} />{' '}
                        <Button
                          type="button"
                          onClick={async () => {
                            const result = await form.trigger(`urls.${index}.url`)
                            if (!result) {
                              return
                            }
                            const { title, icon, description } = await http.get<{
                              title: string
                              icon: string
                              description: string
                            }>('/api/resolveUrl', {
                              url: field.value,
                            })
                            form.setValue(`urls.${index}.title`, title)
                            form.setValue(`urls.${index}.icon`, icon)
                            form.setValue(`urls.${index}.description`, description)
                          }}
                        >
                          解析网址
                        </Button>
                      </div>
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
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => append({ title: '', url: '' })}>
          <PlusCircle className="h-4 w-4 mr-2" />
          添加网址
        </Button>
        <Button type="submit">提交</Button>
      </form>
    </Form>
  )
}
