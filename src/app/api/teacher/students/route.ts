import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/userModel';
import Class from '@/models/classModel';

export async function GET() {
    try {
        const session = await getSession();
        if (!session?.email) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        // Get teacher's ID
        const teacher = await User.findOne({ 
            email: session.email,
            role: 'teacher'
        });

        if (!teacher) {
            return NextResponse.json(
                { message: 'Teacher not found' },
                { status: 404 }
            );
        }

        // Get teacher's classes
        const classes = await Class.find({ teacher: teacher._id });
        const classIds = classes.map(cls => cls._id);

        // Get students in teacher's classes
        const students = await User.find({
            role: 'student',
            'classes': { $in: classIds }
        }).select('username email profile lastLogin');

        return NextResponse.json(students);
    } catch (error) {
        console.error('Error fetching teacher students:', error);
        return NextResponse.json(
            { message: 'Error fetching students' },
            { status: 500 }
        );
    }
} 