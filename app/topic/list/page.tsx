import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { getTopicList } from '@/lib/db'
import { Edit, Share2 } from 'lucide-react'
import Link from 'next/link'

import { DeleteTopicDialog } from './delete-topic-dialog'

export default async function CardWithForm() {
  const topics = await getTopicList()
  console.log(topics)
  return (
    <div>
      <Link href="/topic/create">
        <Button>创建话题</Button>
      </Link>
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
              <DeleteTopicDialog topicId={topic.id} />
            </div>
            <CardHeader>
              <CardTitle>{topic.name}</CardTitle>
              <CardDescription>
                {topic._count.urls} 个链接 | {topic.createdAt.toLocaleString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                {topic.urls.map((url, index) => (
                  <div key={index} className="grid grid-cols-[25px_1fr] items-start last:mb-0 last:pb-0">
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{url.title}</p>
                      <p className="text-sm text-muted-foreground">{url.icon}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
