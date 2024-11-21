import ClientForm from '../../create/components/client-form'
import { getTopic } from '@/lib/db'

export default async function EditTopic(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const data = params.id ? await getTopic(params.id) : undefined

  return <ClientForm data={data}></ClientForm>
}
