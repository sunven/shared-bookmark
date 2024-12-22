import { getTopic } from '@/lib/db'
import ClientForm from '../../new/client-form'

export default async function EditTopic(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const data = params.id ? await getTopic(params.id) : undefined
  return <ClientForm data={data}></ClientForm>
}
