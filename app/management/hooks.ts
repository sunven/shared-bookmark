import { PaginatedResponse, SoftwareWithRelations } from '@/lib/db'
import { http } from '@/lib/http'
import { Category, Tag } from '@prisma/client'
import useSWR from 'swr'

export function useTags() {
  return useSWR<Tag[]>('/api/tag', http.get)
}

export function useCategorys() {
  return useSWR<Category[]>('/api/category', http.get)
}

export function useSoftwares(data: Record<string, unknown>) {
  return useSWR<PaginatedResponse<SoftwareWithRelations>>(['/api/management', data], http.get)
}
