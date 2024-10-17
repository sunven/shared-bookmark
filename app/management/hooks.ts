import { PaginatedResponse, SoftwareWithRelations } from '@/lib/db'
import { get } from '@/lib/http'
import { Category, Tag } from '@prisma/client'
import useSWR from 'swr'

export function useTags() {
  return useSWR<Tag[]>('/api/tag', get)
}

export function useCategorys() {
  return useSWR<Category[]>('/api/category', get)
}

export function useSoftwares(data: Record<string, unknown>) {
  return useSWR<PaginatedResponse<SoftwareWithRelations>>(['/api/management', data], get)
}
