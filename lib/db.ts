import { Category, Prisma, Software, Tag } from '@prisma/client'
import prisma from './prisma'

export interface SoftwareInput {
  name: string
  description?: string
  website?: string
  icon?: string
  categoryId: number
  tags: string[]
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
}

// 创建新软件
export async function createSoftware(data: SoftwareInput) {
  const { tags, ...softwareData } = data
  return prisma.software.create({
    data: {
      ...softwareData,
      tags: {
        create: tags.map(tag => ({
          tag: {
            connectOrCreate: {
              where: { name: tag },
              create: { name: tag },
            },
          },
        })),
      },
    },
    select: { id: true },
  })
}

export type SoftwareWithRelations = Software & {
  category: Category
  tags: {
    tag: Tag
  }[]
}
// 获取所有软件
export async function getSoftwares(page: number, pageSize: number, categoryId?: number | null, tagIds?: number[]) {
  const skip = (page - 1) * pageSize

  const where: Prisma.SoftwareWhereInput = {}
  if (categoryId) {
    where.category = {
      id: categoryId,
    }
  }
  if (tagIds && tagIds.length > 0) {
    where.tags = {
      some: {
        tag: {
          id: {
            in: tagIds,
          },
        },
      },
    }
  }

  const [softwares, total] = await Promise.all([
    prisma.software.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    }),
    prisma.software.count({ where }),
  ])

  return {
    data: softwares,
    total,
  } as PaginatedResponse<SoftwareWithRelations>
}

// 获取单个软件
export async function getSoftware(id: number) {
  const software = await prisma.software.findUnique({
    where: { id },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  })

  if (!software) return null

  return {
    ...software,
    tags: software.tags.map(t => t.tag.name),
  }
}

// 更新软件
export async function updateSoftware(id: number, data: SoftwareInput) {
  const { tags, ...softwareData } = data
  const software = await prisma.software.update({
    where: { id },
    data: {
      ...softwareData,
      tags: {
        deleteMany: {},
        create: tags.map(tag => ({
          tag: {
            connectOrCreate: {
              where: { name: tag },
              create: { name: tag },
            },
          },
        })),
      },
    },
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  })

  return {
    ...software,
    tags: software.tags.map(t => t.tag.name),
  }
}

// 删除软件
export async function deleteSoftware(id: number) {
  return prisma.software.delete({
    where: { id },
  })
}

// 获取所有分类
export async function getAllCategories() {
  return prisma.category.findMany()
}

// 获取所有标签
export async function getAllTags() {
  return prisma.tag.findMany()
}

export async function createTopic(data: Prisma.TopicCreateInput) {
  return prisma.topic.create({
    data: {
      name: data.name,
      urls: {
        create: data.urls,
      },
    },
    select: { id: true },
  })
}
