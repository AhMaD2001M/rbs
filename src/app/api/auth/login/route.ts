import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/userModel';
import { connectDB } from '@/lib/db';
import { encrypt, login } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { email, password } = await req.json();

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return Response.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return Response.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Create token payload
        const tokenData = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            username: user.username
        };

        // Generate token
        const token = await encrypt(tokenData);

        // Create login response with cookie
        return await login({
            token,
            user: {
                ...tokenData,
                password: undefined
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return Response.json(
            { error: 'Login failed' },
            { status: 500 }
        );
    }
}