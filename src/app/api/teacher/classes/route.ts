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

        // Get teacher's classes with student count
        const classes = await Class.aggregate([
            { $match: { teacher: teacher._id } },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: 'classes',
                    as: 'students'
                }
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    subject: 1,
                    grade: 1,
                    section: 1,
                    studentsCount: { $size: '$students' }
                }
            },
            { $sort: { grade: 1, section: 1 } }
        ]);

        return NextResponse.json(classes);
    } catch (error) {
        console.error('Error fetching teacher classes:', error);
        return NextResponse.json(
            { message: 'Error fetching classes' },
            { status: 500 }
        );
    }
} 