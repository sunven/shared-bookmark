'use client'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DialogHeader, Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { GetResult } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/hooks/use-toast'

interface FormProps {
  categories: GetResult<'Category', 'findMany'>
  tags: GetResult<'Tag', 'findMany'>
}

type SoftwareDto = Omit<Prisma.SoftwareUncheckedCreateInput, 'tags'> & {
  tags: string[]
}

const FormSchema = z.object({
  name: z.string(),
  categoryId: z.number(),
  tags: z.array(z.string()).nonempty(),
  description: z.string().optional(),
  website: z.string().url().optional(),
  icon: z.string().optional(),
})

type MultipleCheckbox = {
  tags: FormProps['tags']
  value: string[]
  onChange: (value: string[]) => void
}

function MultipleCheckbox(props: MultipleCheckbox) {
  const { tags, value, onChange } = props
  return (
    <div className="flex  gap-4">
      {tags.map(tag => (
        <div key={tag.id} className="flex items-end gap-2">
          <Checkbox
            id={'tag-' + tag.id}
            checked={value?.includes(tag.name!)}
            onCheckedChange={checked => {
              return checked
                ? onChange([...(value || []), tag.name!])
                : onChange(value?.filter(value => value !== tag.name))
            }}
          />
          <Label htmlFor={'tag-' + tag.id}>{tag.name}</Label>
        </div>
      ))}
    </div>
  )
}

export default function Form1({ categories, tags }: FormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // 确保在客户端渲染时初始化状态
    setIsOpen(false)
  }, [])

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      // name: '',
      // categoryId: 0,
      // tags: [],
      // description: '',
      // website: '',
      // icon: '',
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log('data', data)
    await fetch('/api/management', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    router.refresh()
    handleClose()
    toast({
      // title: 'You submitted the following values:',
      description: '保存成功',
    })
  }
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">添加新软件</Button>
        </DialogTrigger>
        <DialogContent onPointerDownOutside={e => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>添加新软件</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="">名称</FormLabel>
                    <FormControl className="space-y-0">
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>分类</FormLabel>
                    <FormControl>
                      <Select onValueChange={v => field.onChange(+v)} value={field.value + ''}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="选择分类" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id + ''}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>标签</FormLabel>
                    <FormControl>
                      <MultipleCheckbox tags={tags} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>官网</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>图标 URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>描述</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
