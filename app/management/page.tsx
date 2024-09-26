// 'use client'
import React from 'react'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { ExternalLink } from 'lucide-react'
import { getAllCategories, getAllTags, getSoftwares } from '@/lib/db'
import Link from 'next/link'
import Form from './components/form'
import { Button } from '@/components/ui/button'

// const categories = ['办公软件', '媒体工具', '开发工具']
// const allTags = ['Windows', 'MacOS', 'Linux', '开源', '付费']

export default async function SoftwareManagement({ searchParams }) {
  const { page = 1, pageSize = 10, category } = searchParams
  const categories = await getAllCategories()
  const tags = await getAllTags()
  const softwares = await getSoftwares(page, pageSize, category)

  console.log('a', softwares.data)
  // const [softwareData, setSoftwareData] = useState<Software[]>(initialSoftwareData)
  // const [selectedTags, setSelectedTags] = useState<string[]>([])
  // const [searchTerm, setSearchTerm] = useState('')
  // const [editingSoftware, setEditingSoftware] = useState<Software | null>(null)
  // const [newSoftware, setNewSoftware] = useState<Omit<Software, 'id'>>({
  //   name: '',
  //   category: '',
  //   tags: [],
  //   description: '',
  //   website: '',
  //   icon: '/placeholder.svg?height=64&width=64',
  // })
  // const [currentPage, setCurrentPage] = useState(1)
  // const itemsPerPage = 6

  // const filteredSoftware = useMemo(() => {
  //   return softwareData.filter(software => {
  //     const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(software.category)
  //     const tagMatch = selectedTags.length === 0 || selectedTags.every(tag => software.tags.includes(tag))
  //     const searchMatch = software.name.toLowerCase().includes(searchTerm.toLowerCase())
  //     return categoryMatch && tagMatch && searchMatch
  //   })
  // }, [softwareData, selectedCategories, selectedTags, searchTerm])

  // const totalPages = Math.ceil(filteredSoftware.length / itemsPerPage)
  // const paginatedSoftware = filteredSoftware.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // const handleAddSoftware = () => {
  //   if (newSoftware.name && newSoftware.category) {
  //     setSoftwareData([...softwareData, { ...newSoftware, id: Date.now() }])
  //     setNewSoftware({
  //       name: '',
  //       category: '',
  //       tags: [],
  //       description: '',
  //       website: '',
  //       icon: '/placeholder.svg?height=64&width=64',
  //     })
  //   }
  // }

  // const handleEditSoftware = () => {
  //   if (editingSoftware) {
  //     setSoftwareData(softwareData.map(s => (s.id === editingSoftware.id ? editingSoftware : s)))
  //     setEditingSoftware(null)
  //   }
  // }

  // const handleDeleteSoftware = (id: number) => {
  //   setSoftwareData(softwareData.filter(s => s.id !== id))
  // }

  // return (
  //   <div className="container mx-auto p-4">
  //     <h1 className="text-2xl font-bold mb-4">软件管理</h1>
  //     <Suspense fallback={<div>加载分类...</div>}>
  //       <CategoryFilter categories={categories} />
  //     </Suspense>
  //     <Suspense fallback={<div>加载软件列表...</div>}>{/* <SoftwareList initialSoftware={software} /> */}</Suspense>
  //   </div>
  // )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">软件管理</h1>

      <div className="mb-4 flex items-center gap-2">
        <Label>分类</Label>
        <div className="flex flex-wrap gap-2">
          <div key="全部" className="flex items-center">
            <Checkbox
              id="category-all"
              // checked={selectedCategories.length === categories.length}
              // onCheckedChange={() => handleCategoryChange('全部')}
            />
            <label htmlFor="category-all" className="ml-2">
              全部
            </label>
          </div>
          {categories.map(item => (
            <Link
              key={item.id}
              href={{
                pathname: '/management',
                query: { ...searchParams, category: item.name },
              }}
            >
              <div className="flex items-center">
                <Checkbox id={'category-' + item.id} checked={item.name === category}>
                  sss
                </Checkbox>
                <label htmlFor={'category-' + item.id} className="ml-2">
                  {item.name}
                </label>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* <div className="mb-4 flex items-center gap-2">
        <Label>标签</Label>
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <div key={tag} className="flex items-center">
              <Checkbox
                id={tag}
                checked={selectedTags.includes(tag)}
                onCheckedChange={checked => {
                  setSelectedTags(checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag))
                }}
              />
              <label htmlFor={tag} className="ml-2">
                {tag}
              </label>
            </div>
          ))}
        </div>
      </div> */}

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
      <Form categories={categories} tags={tags} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {softwares.data.map(software => (
          <div key={software.id} className="border p-4 rounded-lg relative">
            <div className="flex items-center mb-2">
              {/* <Image src={software.icon} alt={software.name} width={64} height={64} className="mr-4" /> */}
              <h2 className="text-xl font-semibold">
                <a
                  href={software.website}
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
              {software.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="mt-2 text-sm text-gray-500">{software.description}</p>
            <Button variant="outline" size="sm">
              编辑
            </Button>
            {/* <div className="absolute top-2 right-2 flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    编辑
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>编辑软件</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-name" className="text-right">
                        名称
                      </Label>
                      <Input
                        id="edit-name"
                        value={editingSoftware?.name || ''}
                        onChange={e => setEditingSoftware(prev => (prev ? { ...prev, name: e.target.value } : null))}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-category" className="text-right">
                        分类
                      </Label>
                      <Select
                        value={editingSoftware?.category || ''}
                        onValueChange={value =>
                          setEditingSoftware(prev => (prev ? { ...prev, category: value } : null))
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="选择分类" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">标签</Label>
                      <div className="col-span-3 flex flex-wrap gap-2">
                        {allTags.map(tag => (
                          <div key={tag} className="flex items-center">
                            <Checkbox
                              id={`edit-${tag}`}
                              checked={editingSoftware?.tags.includes(tag)}
                              onCheckedChange={checked => {
                                setEditingSoftware(prev =>
                                  prev
                                    ? {
                                        ...prev,
                                        tags: checked ? [...prev.tags, tag] : prev.tags.filter(t => t !== tag),
                                      }
                                    : null
                                )
                              }}
                            />
                            <label htmlFor={`edit-${tag}`} className="ml-2">
                              {tag}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-description" className="text-right">
                        描述
                      </Label>
                      <Textarea
                        id="edit-description"
                        value={editingSoftware?.description || ''}
                        onChange={e =>
                          setEditingSoftware(prev => (prev ? { ...prev, description: e.target.value } : null))
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-website" className="text-right">
                        官网
                      </Label>
                      <Input
                        id="edit-website"
                        value={editingSoftware?.website || ''}
                        onChange={e => setEditingSoftware(prev => (prev ? { ...prev, website: e.target.value } : null))}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="edit-icon" className="text-right">
                        图标 URL
                      </Label>
                      <Input
                        id="edit-icon"
                        value={editingSoftware?.icon || ''}
                        onChange={e => setEditingSoftware(prev => (prev ? { ...prev, icon: e.target.value } : null))}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <Button onClick={handleEditSoftware}>保存修改</Button>
                </DialogContent>
              </Dialog>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteSoftware(software.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div> */}
          </div>
        ))}
      </div>

      {/* <div className="mt-4 flex justify-between items-center">
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
      </div> */}
    </div>
  )
}
