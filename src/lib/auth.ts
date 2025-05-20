import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

interface UserPayload {
    id: string;
    email: string;
    role: 'admin' | 'teacher' | 'student';
    username: string;
}

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
    throw new Error('JWT_SECRET is not defined');
}

const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: UserPayload): Promise<string> {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key);
}

export async function decrypt(token: string): Promise<UserPayload> {
    const { payload } = await jwtVerify(token, key);
    return payload as UserPayload;
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
    // Create a response to clear the cookies
    const response = NextResponse.json({
        message: 'Logout successful',
    });

    // Clear the token cookie
    response.cookies.delete('token');

    return response;
}

export async function getSession(): Promise<UserPayload | null> {
    const token = cookies().get('token')?.value;
    if (!token) return null;
    try {
        return await decrypt(token);
    } catch {
        return null;
    }
}

export async function verifyAuth(token: string): Promise<UserPayload | null> {
    try {
        const verified = await decrypt(token);
        return verified;
    } catch {
        return null;
    }
} 