import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { createTopic } from './actions'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import ClientForm from './components/client-form'
// import ClientForm from './components/client-form'

const formSchema = z.object({
  title: z.string().min(2, {
    message: '标题至少需要2个字符。',
  }),
  urls: z.string(),
  // urls: z.array(
  //   z.object({
  //     value: z.string().url({ message: '请输入有效的URL。' }),
  //   })
  // ),
})

export default function TopicForm() {
  return <ClientForm onSubmit={createTopic}></ClientForm>
}
