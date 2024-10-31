'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { http } from '@/lib/http'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface DeleteTopicDialogProps {
  topicId: string
}

export function DeleteTopicDialog({ topicId }: DeleteTopicDialogProps) {
  const router = useRouter()

  async function handleDelete() {
    await http.delete(`/api/topic/${topicId}`)
    router.refresh() // 刷新页面数据
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700">
          <Trash2 className="h-5 w-5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确定要删除这个话题吗？</AlertDialogTitle>
          <AlertDialogDescription>此操作无法撤销。话题将会被永久删除。</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>删除</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
