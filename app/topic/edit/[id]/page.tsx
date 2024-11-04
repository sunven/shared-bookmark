import prisma from '@/lib/prisma'
import ClientForm, { ClientFormProps } from '../../create/components/client-form'

export default async function EditTopic({ params }: { params: { id: string } }) {
  const data = params.id
    ? await prisma.topic.findFirst({
        where: {
          id: params.id,
        },
        select: {
          name: true,
          urls: {
            select: {
              title: true,
              url: true,
              icon: true,
              description: true,
            },
          },
        },
      })
    : undefined
  return <ClientForm data={data as ClientFormProps['data']}></ClientForm>
}
