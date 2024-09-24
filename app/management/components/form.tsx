'use client'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DialogHeader, Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { GetResult } from '@/lib/prisma'
import { Software } from '@prisma/client'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import React, { useEffect, useState } from 'react'

interface FormProps {
  categories: GetResult<'Category', 'findMany'>
  tags: GetResult<'Tag', 'findMany'>
}

export default function Form({ categories, tags }: FormProps) {
  const [software, setSoftware] = useState<Partial<Software>>({})

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // 确保在客户端渲染时初始化状态
    setIsOpen(false)
  }, [])

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => setIsOpen(false)
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">添加新软件</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加新软件</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                名称
              </Label>
              <Input
                id="name"
                value={software.name}
                onChange={e => setSoftware({ ...software, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                分类
              </Label>
              <Select
                value={software.categoryId + ''}
                onValueChange={value => setSoftware({ ...software, categoryId: +value })}
              >
                <SelectTrigger className="w-[180px]">
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
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">标签</Label>
              <div className="col-span-3 flex flex-wrap gap-2">
                {tags.map(tag => (
                  <div key={tag.id} className="flex items-center">
                    <Checkbox
                      id={`tag-${tag.id}`}
                      // checked={newSoftware.tags.includes(tag)}
                      // onCheckedChange={checked => {
                      //   setNewSoftware({
                      //     ...newSoftware,
                      //     tags: checked ? [...newSoftware.tags, tag] : newSoftware.tags.filter(t => t !== tag),
                      //   })
                      // }}
                    />
                    <label htmlFor={`tag-${tag.id}`} className="ml-2">
                      {tag.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                描述
              </Label>
              <Textarea
                id="description"
                value={software.description ?? ''}
                onChange={e => setSoftware({ ...software, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="website" className="text-right">
                官网
              </Label>
              <Input
                id="website"
                value={software.website ?? ''}
                onChange={e => setSoftware({ ...software, website: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="gri d grid-cols-4 items-center gap-4">
              <Label htmlFor="icon" className="text-right">
                图标 URL
              </Label>
              <Input
                id="icon"
                value={software.icon ?? ''}
                onChange={e => setSoftware({ ...software, icon: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <Button
            onClick={() => {
              handleClose()
            }}
          >
            添加软件
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
