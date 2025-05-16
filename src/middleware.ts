import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

interface DecodedToken {
    id: string
    role: 'admin' | 'teacher' | 'student'
    username: string
    email: string
}

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // Define public paths that don't require authentication
    const isPublicPath = path === '/auth/login' || path === '/auth/signup'

    // Get the token from cookies
    const token = request.cookies.get('token')?.value || ''

    if (isPublicPath && token) {
        // If user is already logged in and tries to access login/signup pages,
        // redirect them based on their role
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken
            const role = decodedToken.role
            
            switch (role) {
                case 'admin':
                    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
                case 'teacher':
                    return NextResponse.redirect(new URL('/teacher/dashboard', request.url))
                case 'student':
                    return NextResponse.redirect(new URL('/student/dashboard', request.url))
                default:
                    return NextResponse.redirect(new URL('/', request.url))
            }
        } catch {
            // If token is invalid, clear it and continue to login page
            const response = NextResponse.next()
            response.cookies.delete('token')
            return response
        }
    }

    if (!isPublicPath && !token) {
        // If user is not logged in and tries to access protected routes,
        // redirect to login page
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    if (path.startsWith('/admin')) {
        // Protect admin routes
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken
            if (decodedToken.role !== 'admin') {
                return NextResponse.redirect(new URL('/', request.url))
            }
        } catch {
            return NextResponse.redirect(new URL('/auth/login', request.url))
        }
    }

    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
       // '/admin/:path*',
       // '/teacher/:path*',
      //  '/student/:path*',
      //  '/auth/login',
      //  '/auth/signup'
    ],
} 

