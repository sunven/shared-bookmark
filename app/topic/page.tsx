import { createTopic } from './actions'
import ClientForm from './components/client-form'

export default function TopicForm() {
  return <ClientForm onSubmit={createTopic}></ClientForm>
}
