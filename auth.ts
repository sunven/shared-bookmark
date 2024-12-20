import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Google from 'next-auth/providers/google'
import prisma from './lib/prisma'
import { getUserById } from './lib/user'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [Google],
  callbacks: {
    // authorized 回调用于验证请求是否有权通过 Next.js Middleware 访问页面。
    // 它在请求完成之前调用，并接收具有 auth 和 request 属性的对象。
    // auth 属性包含用户会话，request 属性包含传入请求
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      // https://github.com/nextauthjs/next-auth/blob/faf4c9fbe5abb91bef077c60dda70d7d4250ff9b/packages/next-auth/src/lib/index.ts#L120C1-L120C26
      // 这里返回 NextResponse 会优先 middleware
      // 这里返回 boolean 值，如果 middleware 中 auth 传了参就执行 middleware中逻辑，即这里返回的boolean值无效
      return !!auth
    },
    async session({ token, session }) {
      // console.log('session', session, token)
      if (session.user) {
        if (token.sub) {
          session.user.id = token.sub
        }

        if (token.email) {
          session.user.email = token.email
        }

        if (token.role) {
          session.user.role = token.role
        }

        session.user.name = token.name
        session.user.image = token.picture
      }

      return session
    },

    async jwt({ token }) {
      // console.log('jwt', token)
      if (!token.sub) return token

      const dbUser = await getUserById(token.sub)

      if (!dbUser) return token

      token.name = dbUser.name
      token.email = dbUser.email
      token.picture = dbUser.image
      token.role = dbUser.role

      return token
    },
  },
})
