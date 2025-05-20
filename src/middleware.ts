import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAuth } from '@/lib/auth'

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
    const isPublicPath = path === '/login' || path === '/register'

    try {
        // Verify authentication token
        const token = request.cookies.get('token')?.value
        const verifiedToken = token && (await verifyAuth(token))

        if (isPublicPath && verifiedToken) {
            // If user is authenticated and tries to access public path,
            // redirect to dashboard
            return NextResponse.redirect(new URL('/admin/dashboard', request.url))
        }

        if (!isPublicPath && !verifiedToken) {
            // If user is not authenticated and tries to access protected path,
            // redirect to login
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // For API routes, return 401 instead of redirecting
        if (path.startsWith('/api/') && !verifiedToken) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }

        return NextResponse.next()
    } catch (error) {
        // Handle verification errors
        if (path.startsWith('/api/')) {
            return NextResponse.json(
                { error: 'Authentication failed' },
                { status: 401 }
            )
        }
        return NextResponse.redirect(new URL('/login', request.url))
    }
}

// Configure which routes to run middleware on
export const config = {
    matcher: [
        '/admin/:path*',
        '/api/admin/:path*',
        '/login',
        '/register'
    ],
} 

