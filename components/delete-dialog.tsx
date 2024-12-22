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
import { cn } from '@/lib/utils'
import { Trash2 } from 'lucide-react'

interface DeleteDialogProps {
  title?: string
  description?: string
  children?: React.ReactNode
  onDelete: () => void
  disabled?: boolean
  className?: string
}

export function DeleteDialog({
  title = '确定要删除这条数据吗？',
  description = '此操作无法撤销。数据将会被永久删除。',
  onDelete,
  children,
  disabled = false,
  className,
}: DeleteDialogProps) {
  return (
    <AlertDialog>
      {disabled ? (
        children || <Trash2 className={cn('cursor-not-allowed text-gray-300', className)} />
      ) : (
        <AlertDialogTrigger asChild>
          {children || <Trash2 className={cn('cursor-pointer text-red-500 hover:text-red-700', className)} />}
        </AlertDialogTrigger>
      )}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>删除</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
