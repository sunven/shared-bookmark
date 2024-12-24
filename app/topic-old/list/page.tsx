import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getTopicList } from '@/lib/db'
import { Edit, Share2 } from 'lucide-react'
import Link from 'next/link'
import { DeleteTopicDialog } from './delete-topic-dialog'
import './style.scss'

export const dynamic = 'force-dynamic'

export default async function TopicList() {
  const topics = await getTopicList()
  return (
    <div className="p-4">
      <div className="flex gap-4">
        <Link href="/topic/create">
          <Button>创建话题</Button>
        </Link>
        <Link href="/topic/batch-create">
          <Button>批量创建话题</Button>
        </Link>
      </div>
      <div className="grid grid-cols-5 gap-4 mt-4">
        {topics.map(topic => (
          <Card key={topic.id} className="h-[200px] overflow-hidden group relative">
            <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
              <Link href={'/topic/edit/' + topic.id}>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Share2 className="h-4 w-4" />
              </Button>
              <DeleteTopicDialog topicId={topic.id} />
            </div>
            <CardHeader>
              <CardTitle>
                <Link href={'/topic/' + topic.id}>{topic.name}</Link>
              </CardTitle>
              <CardDescription>{topic.createdAt.toLocaleString()}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-1">
              <div className="text-muted-foreground description">{topic.description}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
