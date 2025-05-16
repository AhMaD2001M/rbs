import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/lib/dbConfig';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, email, password, role } = reqBody;

        // Only allow student registration
        if (role !== 'student') {
            return NextResponse.json(
                { message: "Only student registration is allowed" },
                { status: 403 }
            );
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: 'student'
        });

        // Save user
        const savedUser = await newUser.save();

        return NextResponse.json({
            message: "User created successfully",
            success: true,
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
                role: savedUser.role
            }
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
} 