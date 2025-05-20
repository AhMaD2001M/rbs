import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import User from '@/models/userModel';
import Class from '@/models/classModel';
import Assessment from '@/models/assessmentModel';

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

        // Get total students in teacher's classes
        const totalStudents = await User.countDocuments({
            role: 'student',
            'classes': { $in: classIds }
        });

        // Get total assessments for teacher's classes
        const totalAssessments = await Assessment.countDocuments({
            class: { $in: classIds }
        });

        return NextResponse.json({
            totalStudents,
            totalClasses: classes.length,
            totalAssessments
        });
    } catch (error) {
        console.error('Error fetching teacher stats:', error);
        return NextResponse.json(
            { message: 'Error fetching stats' },
            { status: 500 }
        );
    }
} 