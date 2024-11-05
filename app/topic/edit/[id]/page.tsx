import ClientForm from '../../create/components/client-form'
import { getTopic } from '@/lib/db'
import { omitBy, isNull } from 'lodash-es'

export default async function EditTopic({ params }: { params: { id: string } }) {
  const data = params.id ? await getTopic(params.id) : undefined

  return <ClientForm data={data}></ClientForm>
}
