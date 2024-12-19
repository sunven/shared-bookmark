import { auth } from '@/auth'
import { errorResponse } from './lib/utils'

export default auth(req => {
  if (req.auth) {
    return
  }
  if (['/login', '/register'].includes(req.nextUrl.pathname)) {
    return
  }
  if (req.nextUrl.pathname.startsWith('/api')) {
    if (req.nextUrl.pathname.startsWith('/api/auth/callback') || req.nextUrl.pathname.startsWith('/api/auth/error')) {
      return
    }
    return errorResponse('not authenticated', 401)
  }
  const newUrl = new URL('/login', req.nextUrl.origin)
  return Response.redirect(newUrl)
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
