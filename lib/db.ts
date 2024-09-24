import prisma from './prisma'

export interface SoftwareInput {
  name: string
  description?: string
  website?: string
  icon?: string
  categoryId: number
  tags: string[]
}

// 创建新软件
export async function createSoftware(data: SoftwareInput) {
  const { tags, ...softwareData } = data
  const software = await prisma.software.create({
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

// 获取所有软件
export async function getAllSoftware() {
  const softwares = await prisma.software.findMany({
    include: {
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  })

  return softwares.map(software => ({
    ...software,
    tags: software.tags.map(t => t.tag.name),
  }))
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
  await prisma.software.delete({
    where: { id },
  })
}

// 获取所有分类
export async function getAllCategories() {
  console.log('getAllCategories')
  return prisma.category.findMany()
}

// 获取所有标签
export async function getAllTags() {
  return prisma.tag.findMany()
}
