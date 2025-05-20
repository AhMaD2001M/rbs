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
        const classes = await Class.find({ teacher: teacher._id })
            .sort({ createdAt: -1 })
            .limit(3);

        // Get recent assessments
        const assessments = await Assessment.find({ 
            class: { $in: classes.map(c => c._id) }
        })
            .sort({ createdAt: -1 })
            .limit(3);

        // Get recent student enrollments
        const recentStudents = await User.find({
            role: 'student',
            classes: { $in: classes.map(c => c._id) }
        })
            .sort({ createdAt: -1 })
            .limit(3);

        // Combine and format activities
        const activities = [
            ...classes.map(cls => ({
                type: 'class',
                description: `New class created: ${cls.name} (${cls.grade}-${cls.section})`,
                timestamp: cls.createdAt
            })),
            ...assessments.map(assessment => ({
                type: 'assessment',
                description: `New assessment scheduled: ${assessment.title}`,
                timestamp: assessment.createdAt
            })),
            ...recentStudents.map(student => ({
                type: 'student',
                description: `New student enrolled: ${student.profile.firstName} ${student.profile.lastName}`,
                timestamp: student.createdAt
            }))
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        return NextResponse.json(activities);
    } catch (error) {
        console.error('Error fetching activities:', error);
        return NextResponse.json(
            { message: 'Error fetching activities' },
            { status: 500 }
        );
    }
} 