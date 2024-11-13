'use client'
import React, { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { ChevronLeft, ChevronRight, ExternalLink, Pencil, Trash2 } from 'lucide-react'
import Form from './components/form'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useCategorys, useSoftwares, useTags } from './hooks'
import './page.scss'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { http } from '@/lib/http'
// import { useHttp } from '@/hooks/use-http'

const pageSize = 6

export default function SoftwareManagement() {
  // const { toast } = useToast()
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<number>(0)
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
  const [isAlertOpen, setIsAlertOpen] = useState(false)
  const { data: tags = [] } = useTags()
  const { data: categories = [] } = useCategorys()
  const {
    data: { data = [], total = 0 } = {},
    mutate,
    // error,
    // isLoading,
  } = useSoftwares({ page: currentPage, pageSize })

  useEffect(() => {}, [])

  const totalPages = Math.ceil(total / pageSize)

  // return (
  //   <div className="container mx-auto p-4">
  //     <h1 className="text-2xl font-bold mb-4">软件管理</h1>
  //     <Suspense fallback={<div>加载分类...</div>}>
  //       <CategoryFilter categories={categories} />
  //     </Suspense>
  //     <Suspense fallback={<div>加载软件列表...</div>}>{/* <SoftwareList initialSoftware={software} /> */}</Suspense>
  //   </div>
  // )

  const handleDelete = (id: number) => {
    http.delete('/api/management', { id }).then(res => {
      mutate()
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">软件管理</h1>
      <RadioGroup
        value={selectedCategory.toString()}
        className="flex"
        onValueChange={value => setSelectedCategory(Number(value))}
      >
        {categories.map(item => {
          const id = 'category-' + item.id
          return (
            <div key={id} className="flex items-center space-x-2">
              <RadioGroupItem value={item.id.toString()} id={id} />
              <Label htmlFor={id}>{item.name}</Label>
            </div>
          )
        })}
      </RadioGroup>
      <div className="mb-4 flex items-center gap-2">
        <Label>分类</Label>
        <div className="flex flex-wrap gap-2">
          {/* <div key="全部" className="flex items-center">
            <Checkbox
              id="category-all"
              // checked={selectedCategories.length === categories.length}
              // onCheckedChange={() => handleCategoryChange('全部')}
            />
            <label htmlFor="category-all" className="ml-2">
              全部
            </label>
          </div> */}
          {tags.map(item => {
            const id = 'tag-' + item.id
            return (
              <div key={id} className="flex items-center">
                <Checkbox
                  id={id}
                  checked={selectedTagIds.includes(item.id)}
                  onCheckedChange={checked => {
                    setSelectedTagIds(
                      checked ? [...selectedTagIds, item.id] : selectedTagIds.filter(t => t !== item.id)
                    )
                  }}
                ></Checkbox>
                <label htmlFor={id} className="ml-2">
                  {item.name}
                </label>
              </div>
            )
          })}
        </div>
      </div>
      {/* <div className="mb-4 flex items-center gap-2">
        <Label htmlFor="search">搜索</Label>
        <Input
          className="flex-1"
          id="search"
          type="text"
          placeholder="搜索软件..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div> */}
      <Form onFinish={mutate} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.map(software => (
          <div key={software.id} className="card border p-4 rounded-lg relative">
            <div className="absolute top-2 right-2 hidden operation">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-500 hover:text-blue-700">
                <Pencil className="h-5 w-5" />
              </Button>
              <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(software.id)}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div className="flex items-center mb-2">
              {/* <Image src={software.icon} alt={software.name} width={64} height={64} className="mr-4" /> */}
              <h2 className="text-xl font-semibold">
                <a
                  href={software.website!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center"
                >
                  {software.name}
                  <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </h2>
            </div>
            <p className="text-gray-600">分类: {software.category.name}</p>
            <div className="mt-2">
              {software.tags.map(c => (
                <span
                  key={c.tag.id}
                  className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >
                  {c.tag.name}
                </span>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-500">{software.description}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // toast({
                //   title: 'You submitted the following values:',
                //   description: '保存成功',
                // })
              }}
            >
              编辑
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between items-center">
        <Button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          上一页
        </Button>
        <span>
          第 {currentPage} 页，共 {totalPages} 页
        </span>
        <Button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          下一页
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
