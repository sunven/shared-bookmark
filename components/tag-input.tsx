'use client'

import React, { useState, KeyboardEvent, ChangeEvent } from 'react'
import { X } from 'lucide-react'

interface TagInputProps {
  initialTags?: string[]
}

export default function TagInput({ initialTags = [] }: TagInputProps) {
  const [tags, setTags] = useState<string[]>(initialTags)
  const [input, setInput] = useState('')

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input) {
      e.preventDefault()
      if (!tags.includes(input.trim())) {
        setTags([...tags, input.trim()])
        setInput('')
      }
    } else if (e.key === 'Backspace' && !input && tags.length > 0) {
      const newTags = [...tags]
      newTags.pop()
      setTags(newTags)
    }
  }

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  return (
    <div className="w-full max-w-md">
      <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-white">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
          >
            {tag}
            <button onClick={() => removeTag(index)} className="text-blue-600 hover:text-blue-800 focus:outline-none">
              <X size={14} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          className="flex-grow min-w-[120px] outline-none"
          placeholder="Type and press Enter to add tags"
        />
      </div>
    </div>
  )
}
