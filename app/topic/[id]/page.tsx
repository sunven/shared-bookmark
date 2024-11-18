import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getTopic } from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ViewTopic({ params }: { params: { id: string } }) {
  const data = await getTopic(params.id)

  return (
    <div className="w-[600px] mx-auto mt-[64px]">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">{data?.name}</h1>
      <div className="flex justify-between">
        <p className="text-sm text-muted-foreground">{data?.createdAt.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground">{data?.updatedAt.toLocaleString()}</p>
      </div>
      <Accordion type="multiple">
        {data?.urls.map(item => (
          <AccordionItem value={item.id.toString()} key={item.id}>
            <AccordionTrigger>
              <div className="flex items-center gap-1">
                <Avatar className="w-5 h-5">
                  <AvatarImage src={item.icon || ''} />
                  <AvatarFallback>i</AvatarFallback>
                </Avatar>
                <Link href={item.url} target="_blank">
                  <Button variant="link">{item.title}</Button>
                </Link>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
