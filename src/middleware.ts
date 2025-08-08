import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  const isDashboard = request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith('/dashboard');

  // Redirige al login si no tiene el token..
  if (isDashboard && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Si está logueado y trata de entrar a /login, redirige a dashboard..
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard/general', request.url));
  }

  return NextResponse.next();
}