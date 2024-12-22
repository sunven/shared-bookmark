import { HeaderSection } from '@/components/shared/header-section'
import { Badge } from '@/components/ui/badge'
import { getTopic } from '@/lib/db'
import Image from 'next/image'

export default async function TopicView(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const data = await getTopic(params.id)

  return (
    <div className="">
      <HeaderSection label="" title={data?.name || ''} subtitle={data?.description || ''} />
      <div className="column-1 gap-5 space-y-5 md:columns-2 lg:columns-4 my-12">
        {data?.urls.map(item => (
          <div className="break-inside-avoid" key={item.id}>
            <div className="relative rounded-xl border bg-muted/25">
              <div className="flex flex-col px-4 py-5 sm:p-6">
                <div>
                  <div className="relative mb-4 flex items-center gap-3">
                    <span className="relative inline-flex size-10 shrink-0 items-center justify-center rounded-full text-base">
                      <Image width={100} height={100} className="" src={item.icon || ''} alt={item.title} />
                    </span>
                    <div className="overflow-hidden truncate">
                      <a className="[all:revert]" href={item.url || ''} target="_blank">
                        {item.title}
                      </a>
                      <p className="">
                        {item.tags?.map(tag => (
                          <Badge key={tag}>#{tag}</Badge>
                        ))}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
