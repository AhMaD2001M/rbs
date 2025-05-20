import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import User from '@/models/userModel';
import Class from '@/models/classModel';

export async function GET() {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        // Get teacher's ID
        const teacher = await User.findOne({ 
            email: session.user.email,
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
        const students = await User.aggregate([
            {
                $match: {
                    role: 'student',
                    classes: { $in: classIds }
                }
            },
            {
                $lookup: {
                    from: 'sessions',
                    localField: '_id',
                    foreignField: 'userId',
                    as: 'sessions'
                }
            },
            {
                $project: {
                    _id: 1,
                    username: 1,
                    email: 1,
                    profile: 1,
                    lastLogin: { $max: '$sessions.expires' }
                }
            },
            { $sort: { 'profile.firstName': 1, 'profile.lastName': 1 } }
        ]);

        return NextResponse.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        return NextResponse.json(
            { message: 'Error fetching students' },
            { status: 500 }
        );
    }
} 