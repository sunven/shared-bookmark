import { Prisma, PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma

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
