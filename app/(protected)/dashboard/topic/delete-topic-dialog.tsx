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
import { http } from '@/lib/http'
import { Trash2 } from 'lucide-react'

interface DeleteTopicDialogProps {
  topicId: string
  onSuccess: () => void
}

export function DeleteTopicDialog({ topicId, onSuccess }: DeleteTopicDialogProps) {
  async function handleDelete() {
    await http.delete(`/api/topic/${topicId}`)
    onSuccess?.()
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
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
