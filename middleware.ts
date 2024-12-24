import { auth } from '@/auth'
import { errorResponse } from './lib/utils'

const whiteList = ['/login', '/register', '/', /^\/pricing/, /^\/topic/]

function matchWhiteList(pathname: string) {
  return whiteList.some(item => {
    if (typeof item === 'string') {
      return item === pathname
    }
    return item.test(pathname)
  })
}

export default auth(req => {
  if (req.auth) {
    return
  }
  if (matchWhiteList(req.nextUrl.pathname)) {
    return
  }
  if (req.nextUrl.pathname.startsWith('/api')) {
    if (req.nextUrl.pathname.startsWith('/api/auth')) {
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
