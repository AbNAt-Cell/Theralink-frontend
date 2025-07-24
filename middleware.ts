import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const user = request.cookies.get('user')?.value

  const isAdminPath = request.nextUrl.pathname.startsWith('/admin')
  const isClientPath = request.nextUrl.pathname.startsWith('/client')
  const isAuthPath = request.nextUrl.pathname === '/client/login' || request.nextUrl.pathname === '/admin/login'

  // ✅ Simulate login only in development
  if (process.env.NODE_ENV === 'development') {
    if (!token) {
      const response = NextResponse.next()
      response.cookies.set('token', 'dev-token') // fake token
      response.cookies.set(
        'user',
        JSON.stringify({
          id: 1,
          name: 'Dev Admin',
          role: 'ADMIN'
        })
      )
      return response
    }
  }

  // 🔒 Redirect if no token and trying to access protected paths
  if (!token && (isAdminPath || isClientPath) && !isAuthPath) {
    const redirectPath = isAdminPath ? '/admin/login' : '/client/login'
    return NextResponse.redirect(new URL(redirectPath, request.url))
  }

  // 🔒 Block logged-in users from accessing login pages
  if (token && isAuthPath) {
    try {
      const userData = JSON.parse(user || '{}')
      const redirectPath =
        userData.role === 'ADMIN' ? '/admin/dashboard' : '/client/dashboard'
      return NextResponse.redirect(new URL(redirectPath, request.url))
    } catch {
      const redirectPath = isAdminPath ? '/admin/login' : '/client/login'
      const response = NextResponse.redirect(new URL(redirectPath, request.url))
      response.cookies.delete('token')
      response.cookies.delete('user')
      return response
    }
  }

  // if (!token && (isAdminPath || isClientPath) && !isAuthPath) {
  //   const redirectPath = isAdminPath ? '/admin/login' : '/client/login';
  //   return NextResponse.redirect(new URL(redirectPath, request.url));
  // }

  // if (token && isAuthPath) {
  //   try {
  //     const userData = JSON.parse(user || '{}')
  //     const redirectPath = userData.role === 'ADMIN' ? '/admin/dashboard' : '/client/dashboard'
  //     return NextResponse.redirect(new URL(redirectPath, request.url))
  //   } catch {
  //     const redirectPath = isAdminPath ? '/admin/login' : '/client/login';
  //     const response = NextResponse.redirect(new URL(redirectPath, request.url))
  //     response.cookies.delete('token')
  //     response.cookies.delete('user')
  //     return response
  //   }
  // }

  // if (token && isAdminPath && !isAuthPath) {
  //   try {
  //     const userData = JSON.parse(user || '{}')
  //     if (userData.role !== 'ADMIN') {
  //       return NextResponse.redirect(new URL('/client/dashboard', request.url))
  //     }
  //   } catch {
  //     return NextResponse.redirect(new URL('/client/login', request.url))
  //   }
  // }

  // if (token && isClientPath && !isAuthPath) {
  //   try {
  //     const userData = JSON.parse(user || '{}')
  //     if (userData.role === 'ADMIN') {
  //       return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  //     }
  //   } catch {
  //     return NextResponse.redirect(new URL('/client/login', request.url))
  //   }
  // }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/client/:path*',
  ],
}
