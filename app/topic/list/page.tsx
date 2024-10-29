import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getTopicList } from '@/lib/db'
import { Edit, Share2 } from 'lucide-react'

export default async function CardWithForm() {
  const topics = await getTopicList()
  console.log(topics)
  return (
    <div className="flex flex-wrap gap-4">
      {topics.map(topic => (
        <Card key={topic.id} className="w-[350px]  group relative">
          <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          <CardHeader>
            <CardTitle>{topic.name}</CardTitle>
            <CardDescription>
              {topic._count.urls} 个链接 | {topic.createdAt.toLocaleString()}
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}
