import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { updateSession } from './utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user, role } = await updateSession(request)

  const isAdminPath = request.nextUrl.pathname.startsWith('/admin')
  const isClientPath = request.nextUrl.pathname.startsWith('/client')
  const isAuthPath = request.nextUrl.pathname === '/client/login' || request.nextUrl.pathname === '/admin/login'

  // If not logged in and trying to access protected route
  if (!user && (isAdminPath || isClientPath) && !isAuthPath) {
    const redirectPath = isAdminPath ? '/admin/login' : '/client/login';
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // If logged in and trying to access auth path
  if (user && isAuthPath) {
    const redirectPath = (role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'STAFF')
      ? '/admin/dashboard'
      : '/client/dashboard'
    return NextResponse.redirect(new URL(redirectPath, request.url))
  }

  // Admin section RBAC
  if (user && isAdminPath && !isAuthPath) {
    if (role === 'CLIENT') {
      return NextResponse.redirect(new URL('/client/dashboard', request.url))
    }
  }

  // Client section RBAC
  if (user && isClientPath && !isAuthPath) {
    if (role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'STAFF') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/client/:path*',
  ],
}

