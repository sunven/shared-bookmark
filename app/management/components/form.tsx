'use client'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DialogHeader, Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tag } from '@prisma/client'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import React, { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/hooks/use-toast'
import { useCategorys, useTags } from '../hooks'

interface FormProps {
  onFinish: () => void
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
  tags: Tag[]
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

export default function Form1({ onFinish }: FormProps) {
  const { data: categories = [] } = useCategorys()
  const { data: tags = [] } = useTags()
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const handleClose = () => setIsOpen(false)
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    await fetch('/api/management', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    toast({
      // title: 'You submitted the following values:',
      description: '保存成功',
    })
    onFinish()
    handleClose()
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
