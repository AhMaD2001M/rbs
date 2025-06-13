import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

interface UserPayload {
    id: string;
    email: string;
    role: 'admin' | 'teacher' | 'student';
    username: string;
}

const secret = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-secret-key'
);

export async function encrypt(payload: UserPayload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(secret);
}

export async function verifyAuth(token: string) {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch (error) {
        return null;
    }
}

export async function getSession() {
    const token = cookies().get('token')?.value;
    if (!token) return null;
    
    try {
        const payload = await verifyAuth(token);
        return payload as UserPayload;
    } catch (error) {
        return null;
    }
}

export async function login(data: { token: string; user: UserPayload }) {
    // Create a response to update the cookies
    const response = NextResponse.json({
        message: 'Login successful',
        user: data.user,
    });

    // Set the token cookie
    response.cookies.set({
        name: 'token',
        value: data.token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
}

export async function logout() {
    const response = NextResponse.json({
        message: 'Logout successful'
    });

    // Clear the token cookie
    response.cookies.set({
        name: 'token',
        value: '',
        httpOnly: true,
        path: '/',
        expires: new Date(0),
    });

    return response;
} 