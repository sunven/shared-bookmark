import ClientForm from './components/client-form'

export default function TopicForm({ params }: { params: { id: string } }) {
  console.log(params)
  return <ClientForm></ClientForm>
}
