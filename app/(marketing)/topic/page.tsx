import prisma from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'

function getTopicList() {
  return prisma.topic.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      name: true,
      description: true,
      updatedAt: true,
      // 添加 urls 查询
      urls: {
        take: 1, // 只取第一条
        // orderBy: {
        //   createdAt: 'desc', // 按创建时间倒序
        // },
        select: {
          icon: true,
        },
      },
    },
  })
}

function getIcon(icon: string | undefined | null) {
  if (icon && icon.startsWith('http')) {
    return icon
  }
  return ''
}

export default async function TopicPage() {
  const topics = await getTopicList()
  return (
    <div className="container max-w-6xl column-1 gap-5 space-y-5 md:columns-2 lg:columns-3 my-12">
      {topics.map(item => (
        <div className="break-inside-avoid" key={item.id}>
          <div className="relative rounded-xl border bg-muted/25">
            <div className="flex flex-col px-4 py-5 sm:p-6">
              <div>
                <div className="relative mb-4 flex items-center gap-3">
                  <span className="relative inline-flex size-10 shrink-0 items-center justify-center rounded-full text-base">
                    <Image width={100} height={100} src={getIcon(item.urls[0]?.icon)} alt={item.name} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      <Link href={`/topic/${item.id}`} target="_blank">
                        {item.name}
                      </Link>
                    </p>
                    <p className="text-sm text-muted-foreground">{item.updatedAt.toLocaleString()}</p>
                  </div>
                </div>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
