import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
 
 const path = request.nextUrl.pathname
 const isPublicPath = path === '/auth/login' || path === '/auth/signup'|| path === '/auth/verifyemail'

 const token = request.cookies.get('token')?.value||''
    if (isPublicPath && token){

       // return NextResponse.redirect(new URL('/home', request.url))
    }
 
    if (isPublicPath && token){

        return NextResponse.redirect(new URL('/outh/login', request.url))
    }

    return NextResponse.redirect(new URL('/home', request.url))
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher:  [
    
    '/auth/login',
    '/auth/signup',
    '/auth/verifyemail'
  ],
} 
