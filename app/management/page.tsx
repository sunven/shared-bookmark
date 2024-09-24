// 'use client'
import React, { useState, useMemo, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Image from 'next/image'
import { getAllCategories, getAllSoftware } from '@/lib/db'
import Link from 'next/link'
import { CategoryFilter } from '../components/category-filter'

interface Software {
  id: number
  name: string
  category: string
  tags: string[]
  description: string
  website: string
  icon: string
}

const initialSoftwareData: Software[] = [
  {
    id: 1,
    name: 'Microsoft Word',
    category: '办公软件',
    tags: ['Windows', '付费'],
    description: 'Microsoft Word 是一款功能强大的文字处理软件，广泛用于创建和编辑各种文档。',
    website: 'https://www.microsoft.com/microsoft-365/word',
    icon: '/placeholder.svg?height=64&width=64',
  },
]

// const categories = ['办公软件', '媒体工具', '开发工具']
// const allTags = ['Windows', 'MacOS', 'Linux', '开源', '付费']

export default async function SoftwareManagement({ searchParams }) {
  const { category } = searchParams
  // const categoryId = searchParams.get('category')
  // const selectedCategory = categoryId ? parseInt(categoryId, 10) : null
  const categories = await getAllCategories()
  // let a = await getAllSoftware()
  let a = []
  if (a.length === 0) {
    a = initialSoftwareData
  }
  console.log('a', a)
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">软件管理</h1>
      <Suspense fallback={<div>加载分类...</div>}>
        <CategoryFilter categories={categories} />
      </Suspense>
      <Suspense fallback={<div>加载软件列表...</div>}>{/* <SoftwareList initialSoftware={software} /> */}</Suspense>
    </div>
  )

  // return (
  //   <div className="container mx-auto p-4">
  //     <h1 className="text-2xl font-bold mb-4">软件管理</h1>

  //     <div className="mb-4 flex items-center gap-2">
  //       <Label>分类</Label>
  //       <div className="flex flex-wrap gap-2">
  //         <div key="全部" className="flex items-center">
  //           <Checkbox
  //             id="category-all"
  //             // checked={selectedCategories.length === categories.length}
  //             // onCheckedChange={() => handleCategoryChange('全部')}
  //           />
  //           <label htmlFor="category-all" className="ml-2">
  //             全部
  //           </label>
  //         </div>
  //         {categories.map(item => (
  //           <Link
  //             key={item.id}
  //             href={{
  //               pathname: '/management',
  //               query: { ...searchParams, category: item.name },
  //             }}
  //           >
  //             <div className="flex items-center">
  //               <Checkbox id={'category-' + item.id} checked={item.name === category}>
  //                 sss
  //               </Checkbox>
  //               <label htmlFor={'category-' + item.id} className="ml-2">
  //                 {item.name}
  //               </label>
  //             </div>
  //           </Link>
  //         ))}
  //       </div>
  //     </div>

  //     {/* <div className="mb-4 flex items-center gap-2">
  //       <Label>标签</Label>
  //       <div className="flex flex-wrap gap-2">
  //         {allTags.map(tag => (
  //           <div key={tag} className="flex items-center">
  //             <Checkbox
  //               id={tag}
  //               checked={selectedTags.includes(tag)}
  //               onCheckedChange={checked => {
  //                 setSelectedTags(checked ? [...selectedTags, tag] : selectedTags.filter(t => t !== tag))
  //               }}
  //             />
  //             <label htmlFor={tag} className="ml-2">
  //               {tag}
  //             </label>
  //           </div>
  //         ))}
  //       </div>
  //     </div> */}

  //     {/* <div className="mb-4 flex items-center gap-2">
  //       <Label htmlFor="search">搜索</Label>
  //       <Input
  //         className="flex-1"
  //         id="search"
  //         type="text"
  //         placeholder="搜索软件..."
  //         value={searchTerm}
  //         onChange={e => setSearchTerm(e.target.value)}
  //       />
  //     </div> */}
  //     {/*
  //     <Dialog>
  //       <DialogTrigger asChild>
  //         <Button className="mb-4">添加新软件</Button>
  //       </DialogTrigger>
  //       <DialogContent>
  //         <DialogHeader>
  //           <DialogTitle>添加新软件</DialogTitle>
  //         </DialogHeader>
  //         <div className="grid gap-4 py-4">
  //           <div className="grid grid-cols-4 items-center gap-4">
  //             <Label htmlFor="name" className="text-right">
  //               名称
  //             </Label>
  //             <Input
  //               id="name"
  //               value={newSoftware.name}
  //               onChange={e => setNewSoftware({ ...newSoftware, name: e.target.value })}
  //               className="col-span-3"
  //             />
  //           </div>
  //           <div className="grid grid-cols-4 items-center gap-4">
  //             <Label htmlFor="category" className="text-right">
  //               分类
  //             </Label>
  //             <Select
  //               value={newSoftware.category}
  //               onValueChange={value => setNewSoftware({ ...newSoftware, category: value })}
  //             >
  //               <SelectTrigger className="w-[180px]">
  //                 <SelectValue placeholder="选择分类" />
  //               </SelectTrigger>
  //               <SelectContent>
  //                 {categories.map(category => (
  //                   <SelectItem key={category} value={category}>
  //                     {category}
  //                   </SelectItem>
  //                 ))}
  //               </SelectContent>
  //             </Select>
  //           </div>
  //           <div className="grid grid-cols-4 items-center gap-4">
  //             <Label className="text-right">标签</Label>
  //             <div className="col-span-3 flex flex-wrap gap-2">
  //               {allTags.map(tag => (
  //                 <div key={tag} className="flex items-center">
  //                   <Checkbox
  //                     id={`new-${tag}`}
  //                     checked={newSoftware.tags.includes(tag)}
  //                     onCheckedChange={checked => {
  //                       setNewSoftware({
  //                         ...newSoftware,
  //                         tags: checked ? [...newSoftware.tags, tag] : newSoftware.tags.filter(t => t !== tag),
  //                       })
  //                     }}
  //                   />
  //                   <label htmlFor={`new-${tag}`} className="ml-2">
  //                     {tag}
  //                   </label>
  //                 </div>
  //               ))}
  //             </div>
  //           </div>
  //           <div className="grid grid-cols-4 items-center gap-4">
  //             <Label htmlFor="description" className="text-right">
  //               描述
  //             </Label>
  //             <Textarea
  //               id="description"
  //               value={newSoftware.description}
  //               onChange={e => setNewSoftware({ ...newSoftware, description: e.target.value })}
  //               className="col-span-3"
  //             />
  //           </div>
  //           <div className="grid grid-cols-4 items-center gap-4">
  //             <Label htmlFor="website" className="text-right">
  //               官网
  //             </Label>
  //             <Input
  //               id="website"
  //               value={newSoftware.website}
  //               onChange={e => setNewSoftware({ ...newSoftware, website: e.target.value })}
  //               className="col-span-3"
  //             />
  //           </div>
  //           <div className="gri d grid-cols-4 items-center gap-4">
  //             <Label htmlFor="icon" className="text-right">
  //               图标 URL
  //             </Label>
  //             <Input
  //               id="icon"
  //               value={newSoftware.icon}
  //               onChange={e => setNewSoftware({ ...newSoftware, icon: e.target.value })}
  //               className="col-span-3"
  //             />
  //           </div>
  //         </div>
  //         <Button onClick={handleAddSoftware}>添加软件</Button>
  //       </DialogContent>
  //     </Dialog> */}

  //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  //       {a.map(software => (
  //         <div key={software.id} className="border p-4 rounded-lg relative">
  //           <div className="flex items-center mb-2">
  //             {/* <Image src={software.icon} alt={software.name} width={64} height={64} className="mr-4" /> */}
  //             <h2 className="text-xl font-semibold">
  //               <a
  //                 href={software.website}
  //                 target="_blank"
  //                 rel="noopener noreferrer"
  //                 className="hover:underline flex items-center"
  //               >
  //                 {software.name}
  //                 <ExternalLink className="h-4 w-4 ml-1" />
  //               </a>
  //             </h2>
  //           </div>
  //           <p className="text-gray-600">分类: {software.category}</p>
  //           <div className="mt-2">
  //             {software.tags.map(tag => (
  //               <span
  //                 key={tag}
  //                 className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
  //               >
  //                 {tag}
  //               </span>
  //             ))}
  //           </div>
  //           <p className="mt-2 text-sm text-gray-500">{software.description}</p>
  //           {/* <div className="absolute top-2 right-2 flex gap-2">
  //             <Dialog>
  //               <DialogTrigger asChild>
  //                 <Button variant="outline" size="sm">
  //                   编辑
  //                 </Button>
  //               </DialogTrigger>
  //               <DialogContent>
  //                 <DialogHeader>
  //                   <DialogTitle>编辑软件</DialogTitle>
  //                 </DialogHeader>
  //                 <div className="grid gap-4 py-4">
  //                   <div className="grid grid-cols-4 items-center gap-4">
  //                     <Label htmlFor="edit-name" className="text-right">
  //                       名称
  //                     </Label>
  //                     <Input
  //                       id="edit-name"
  //                       value={editingSoftware?.name || ''}
  //                       onChange={e => setEditingSoftware(prev => (prev ? { ...prev, name: e.target.value } : null))}
  //                       className="col-span-3"
  //                     />
  //                   </div>
  //                   <div className="grid grid-cols-4 items-center gap-4">
  //                     <Label htmlFor="edit-category" className="text-right">
  //                       分类
  //                     </Label>
  //                     <Select
  //                       value={editingSoftware?.category || ''}
  //                       onValueChange={value =>
  //                         setEditingSoftware(prev => (prev ? { ...prev, category: value } : null))
  //                       }
  //                     >
  //                       <SelectTrigger className="w-[180px]">
  //                         <SelectValue placeholder="选择分类" />
  //                       </SelectTrigger>
  //                       <SelectContent>
  //                         {categories.map(category => (
  //                           <SelectItem key={category} value={category}>
  //                             {category}
  //                           </SelectItem>
  //                         ))}
  //                       </SelectContent>
  //                     </Select>
  //                   </div>
  //                   <div className="grid grid-cols-4 items-center gap-4">
  //                     <Label className="text-right">标签</Label>
  //                     <div className="col-span-3 flex flex-wrap gap-2">
  //                       {allTags.map(tag => (
  //                         <div key={tag} className="flex items-center">
  //                           <Checkbox
  //                             id={`edit-${tag}`}
  //                             checked={editingSoftware?.tags.includes(tag)}
  //                             onCheckedChange={checked => {
  //                               setEditingSoftware(prev =>
  //                                 prev
  //                                   ? {
  //                                       ...prev,
  //                                       tags: checked ? [...prev.tags, tag] : prev.tags.filter(t => t !== tag),
  //                                     }
  //                                   : null
  //                               )
  //                             }}
  //                           />
  //                           <label htmlFor={`edit-${tag}`} className="ml-2">
  //                             {tag}
  //                           </label>
  //                         </div>
  //                       ))}
  //                     </div>
  //                   </div>
  //                   <div className="grid grid-cols-4 items-center gap-4">
  //                     <Label htmlFor="edit-description" className="text-right">
  //                       描述
  //                     </Label>
  //                     <Textarea
  //                       id="edit-description"
  //                       value={editingSoftware?.description || ''}
  //                       onChange={e =>
  //                         setEditingSoftware(prev => (prev ? { ...prev, description: e.target.value } : null))
  //                       }
  //                       className="col-span-3"
  //                     />
  //                   </div>
  //                   <div className="grid grid-cols-4 items-center gap-4">
  //                     <Label htmlFor="edit-website" className="text-right">
  //                       官网
  //                     </Label>
  //                     <Input
  //                       id="edit-website"
  //                       value={editingSoftware?.website || ''}
  //                       onChange={e => setEditingSoftware(prev => (prev ? { ...prev, website: e.target.value } : null))}
  //                       className="col-span-3"
  //                     />
  //                   </div>
  //                   <div className="grid grid-cols-4 items-center gap-4">
  //                     <Label htmlFor="edit-icon" className="text-right">
  //                       图标 URL
  //                     </Label>
  //                     <Input
  //                       id="edit-icon"
  //                       value={editingSoftware?.icon || ''}
  //                       onChange={e => setEditingSoftware(prev => (prev ? { ...prev, icon: e.target.value } : null))}
  //                       className="col-span-3"
  //                     />
  //                   </div>
  //                 </div>
  //                 <Button onClick={handleEditSoftware}>保存修改</Button>
  //               </DialogContent>
  //             </Dialog>
  //             <Button variant="destructive" size="sm" onClick={() => handleDeleteSoftware(software.id)}>
  //               <X className="h-4 w-4" />
  //             </Button>
  //           </div> */}
  //         </div>
  //       ))}
  //     </div>

  //     {/* <div className="mt-4 flex justify-between items-center">
  //       <Button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
  //         <ChevronLeft className="h-4 w-4 mr-2" />
  //         上一页
  //       </Button>
  //       <span>
  //         第 {currentPage} 页，共 {totalPages} 页
  //       </span>
  //       <Button
  //         onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
  //         disabled={currentPage === totalPages}
  //       >
  //         下一页
  //         <ChevronRight className="h-4 w-4 ml-2" />
  //       </Button>
  //     </div> */}
  //   </div>
  // )
}
