import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { createTopic } from './actions'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import ClientForm from './components/client-form'
// import ClientForm from './components/client-form'

export default function TopicForm() {
  return <ClientForm onSubmit={createTopic}></ClientForm>
}
