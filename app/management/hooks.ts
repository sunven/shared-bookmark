import { PaginatedResponse, SoftwareWithRelations } from '@/lib/db'
import { fetcher } from '@/lib/utils'
import { Category, Tag } from '@prisma/client'
import useSWR from 'swr'

export function useTags() {
  return useSWR<Tag[]>('/api/tag', fetcher)
}

export function useCategorys() {
  return useSWR<Category[]>('/api/category', fetcher)
}

export function useSoftwares() {
  return useSWR<PaginatedResponse<SoftwareWithRelations>>('/api/management', fetcher)
}
