import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/userModel';
import { connectDB } from '@/lib/db';
import bcrypt from 'bcryptjs';

// GET all teachers
export async function GET() {
    try {
        await connectDB();
        const teachers = await User.find({ role: 'teacher' })
            .select('-password')
            .sort({ createdAt: -1 });

        return NextResponse.json(teachers);
    } catch (error) {
        console.error('Error fetching teachers:', error);
        return NextResponse.json(
            { error: 'Error fetching teachers' },
            { status: 500 }
        );
    }
}

// POST create new teacher
export async function POST(req: Request) {
    try {
        const {
            username,
            email,
            password,
            firstName,
            lastName,
            subject,
            phone
        } = await req.json();

        await connectDB();

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return NextResponse.json(
                { message: 'User with this email or username already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newTeacher = new User({
            username,
            email,
            password: hashedPassword,
            role: 'teacher',
            isVerified: true,
            profile: {
                firstName,
                lastName,
                subject,
                phone
            }
        });

        await newTeacher.save();

        return NextResponse.json(
            { message: 'Teacher created successfully' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating teacher:', error);
        return NextResponse.json(
            { message: 'Error creating teacher' },
            { status: 500 }
        );
    }
}

// PUT update teacher
export async function PUT(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { id, ...updateData } = body;

        // Prevent role change through this endpoint
        delete updateData.role;

        const updatedTeacher = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).select('-password');

        if (!updatedTeacher) {
            return NextResponse.json(
                { error: 'Teacher not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedTeacher);
    } catch (error) {
        console.error('Error updating teacher:', error);
        return NextResponse.json(
            { error: 'Error updating teacher' },
            { status: 500 }
        );
    }
}

// DELETE teacher
export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Teacher ID is required' },
                { status: 400 }
            );
        }

        const deletedTeacher = await User.findOneAndDelete({
            _id: id,
            role: 'teacher'
        });

        if (!deletedTeacher) {
            return NextResponse.json(
                { error: 'Teacher not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Teacher deleted successfully' });
    } catch (error) {
        console.error('Error deleting teacher:', error);
        return NextResponse.json(
            { error: 'Error deleting teacher' },
            { status: 500 }
        );
    }
} 