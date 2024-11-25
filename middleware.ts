import { auth } from '@/auth'
import { errorResponse } from './lib/utils'

export default auth(req => {
  if (!req.auth && req.nextUrl.pathname !== '/login') {
    if (req.nextUrl.pathname.startsWith('/api')) {
      if (!req.nextUrl.pathname.startsWith('/api/auth/callback')) {
        return errorResponse('Not authenticated', 401)
      }
    } else {
      const newUrl = new URL('/login', req.nextUrl.origin)
      return Response.redirect(newUrl)
    }
  }
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
