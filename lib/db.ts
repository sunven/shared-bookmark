import type { Category, Prisma, Software, Tag, Topic, Url } from '@prisma/client'
import prisma from './prisma'

// type NullToUndefined<T> = {
//   [K in keyof T]: null extends T[K] ? undefined | Exclude<T[K], null> : T[K]
// }

type BaseEntity = {
  id: number
  createdAt: Date
  updatedAt: Date
}

type NullToUndefined<T> = {
  [K in keyof T as null extends T[K] ? K : never]?: undefined | Exclude<T[K], null>
} & {
  [K in keyof T as null extends T[K] ? never : K]: T[K]
}

type TopicDto = Omit<NullToUndefined<Topic>, keyof BaseEntity>
type UrlDto = Omit<NullToUndefined<Url>, keyof BaseEntity>

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

export async function getTopicList() {
  return prisma.topic.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      urls: {
        select: {
          icon: true,
          title: true,
          description: true,
          url: true,
        },
      },
      _count: {
        select: {
          urls: true,
        },
      },
    },
  })
}

export function getTopic(id: string) {
  return prisma.topic.findFirst({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      urls: {
        select: {
          id: true,
          title: true,
          url: true,
          icon: true,
          description: true,
        },
      },
    },
  })
}

export async function createTopic(data: { name: string; urls: Prisma.UrlCreateWithoutTopicInput[] }) {
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

export function updateTopic(data: {
  id: string
  name: string
  createMany: Prisma.UrlCreateWithoutTopicInput[]
  updateMany: Prisma.UrlUncheckedUpdateWithoutTopicInput[]
  deleteMany: number[]
}) {
  return prisma.topic.update({
    where: { id: data.id },
    data: {
      name: data.name,
      urls: {
        createMany: { data: data.createMany },
        updateMany: data.updateMany.map(({ id, ...rest }) => ({
          where: { id: id as number },
          data: rest,
        })),
        deleteMany: {
          id: {
            in: data.deleteMany,
          },
        },
      },
    },
  })
}
