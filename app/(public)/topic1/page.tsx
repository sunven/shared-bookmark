import { getTopicList } from '@/lib/db'
import Image from 'next/image'

export default async function TopicPage() {
  const topics = await getTopicList()
  return (
    <div className="container max-w-6xl column-1 gap-5 space-y-5 md:columns-2 lg:columns-3 mt-10">
      {topics.map(item => (
        <div className="break-inside-avoid" key={item.name}>
          <div className="relative rounded-xl border bg-muted/25">
            <div className="flex flex-col px-4 py-5 sm:p-6">
              <div>
                <div className="relative mb-4 flex items-center gap-3">
                  <span className="relative inline-flex size-10 shrink-0 items-center justify-center rounded-full text-base">
                    <Image
                      width={100}
                      height={100}
                      className="size-full rounded-full border"
                      src={item.image}
                      alt={item.name}
                    />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.createdAt.toLocaleString()}</p>
                  </div>
                </div>
                <q className="text-muted-foreground">{item.description}</q>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
