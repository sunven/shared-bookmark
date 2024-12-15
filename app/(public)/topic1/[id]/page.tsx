import { HeaderSection } from '@/components/shared/header-section'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { getTopic } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ViewTopic(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const data = await getTopic(params.id)

  return (
    <div className="container max-w-6xl my-[64px]">
      <HeaderSection label="" title={data?.name || ''} subtitle={data?.description || ''} />
      <Accordion type="multiple">
        {data?.urls.map(item => (
          <AccordionItem value={item.id.toString()} key={item.id}>
            <AccordionTrigger>
              <div className="flex items-center gap-1">
                <img className="w-5 h-5" src={item.icon || ''} />
                <Link href={item.url || ''} target="_blank">
                  {item.title}
                </Link>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground sm:text-[15px]">
              {item.description}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
