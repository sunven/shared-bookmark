import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { getTopicList } from '@/lib/db'
import { CalendarDays, Edit, Share2 } from 'lucide-react'
import Link from 'next/link'

import { DeleteTopicDialog } from './delete-topic-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'

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
                  <div key={index} className="">
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Button variant="link">{url.title}</Button>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-80">
                        <div className="flex justify-between space-x-4">
                          <Avatar>
                            <AvatarImage src={url.icon || ''} />
                            <AvatarFallback>icon</AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <p className="text-sm">{url.description}</p>
                            <div className="flex items-center pt-2">
                              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />{' '}
                              <span className="text-xs text-muted-foreground">Joined December 2021</span>
                            </div>
                          </div>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
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
