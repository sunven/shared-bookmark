'use client'

import React, { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

interface Category {
  id: number
  name: string
}

interface CategoryFilterProps {
  categories: Category[]
  onCategoryChange: (selectedCategories: number[]) => void
}

export function CategoryFilter({ categories, onCategoryChange }: CategoryFilterProps) {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])

  const handleCategoryChange = (id: number) => {
    setSelectedCategories(prev => {
      let newSelected
      if (id === 0) {
        newSelected = prev.length === categories.length ? [] : categories.map(c => c.id)
      } else {
        newSelected = prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
      }
      onCategoryChange(newSelected)
      return newSelected
    })
  }

  const isCategorySelected = (id: number) => {
    if (id === 0) {
      return selectedCategories.length === categories.length
    }
    return selectedCategories.includes(id)
  }

  return (
    <div className="flex flex-wrap gap-2">
      <div key="全部" className="flex items-center">
        <Checkbox
          id="category-all"
          checked={selectedCategories.length === categories.length}
          onCheckedChange={() => handleCategoryChange(0)}
        />
        <Label htmlFor="category-all" className="ml-2">
          全部
        </Label>
      </div>
      {categories.map(category => (
        <div key={category.id} className="flex items-center">
          <Checkbox
            id={`category-${category.id}`}
            checked={isCategorySelected(category.id)}
            onCheckedChange={() => handleCategoryChange(category.id)}
          />
          <Label htmlFor={`category-${category.id}`} className="ml-2">
            {category.name}
          </Label>
        </div>
      ))}
    </div>
  )
}
