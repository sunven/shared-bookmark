import { Prisma, PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export type OPERATIONS<T extends Prisma.ModelName> = Prisma.TypeMap['model'][T]['operations']

export type GetArgs<T extends Prisma.ModelName, F extends keyof OPERATIONS<T>> = OPERATIONS<T>[F] extends {
  args: unknown
}
  ? OPERATIONS<T>[F]['args']
  : never

export type GetResult<T extends Prisma.ModelName, F extends keyof OPERATIONS<T>> = OPERATIONS<T>[F] extends {
  result: unknown
}
  ? OPERATIONS<T>[F]['result']
  : never
