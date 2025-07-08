import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/userModel';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/auth';
import Enrollment from '@/models/enrollmentModel';

export async function POST(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session?.email || session.role !== 'admin') {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();
        const body = await req.json();
        const {
            username,
            email,
            password,
            role = 'student',
            profile,
            classId
        } = body;

        // Validate required fields
        if (!username || !email || !password) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

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
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role,
            isVerified: true,
            profile,
            classes: classId ? [classId] : []
        });

        await newUser.save();

        // If classId is provided, add student to the class and create enrollment
        if (classId && role === 'student') {
            const Class = (await import('@/models/classModel')).default;
            await Class.findByIdAndUpdate(
                classId,
                { $addToSet: { students: newUser._id } }
            );
            
            // Create enrollment document for student dashboard
            await Enrollment.findOneAndUpdate(
                { student: newUser._id, class: classId },
                { 
                    student: newUser._id, 
                    class: classId, 
                    enrolledBy: session.id, 
                    status: 'active' 
                },
                { upsert: true, new: true }
            );
        }

        // Remove password from response
        const user = newUser.toObject();
        delete user.password;

        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        console.error('Error registering user:', error);
        return NextResponse.json(
            { message: 'Error registering user' },
            { status: 500 }
        );
    }
} 