import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { getSession } from '@/lib/auth';
import Enrollment from '@/models/enrollmentModel';
import { IClass } from '@/models/classModel';

interface PopulatedClass extends Omit<IClass, 'classTeacher'> {
    classTeacher: {
        firstName: string;
        lastName: string;
    };
}

interface PopulatedEnrollment {
    class: PopulatedClass;
}

export async function GET() {
    try {
        await connectDB();

        // Get the current user's session
        const session = await getSession();
        if (!session || session.role !== 'student') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Find all active enrollments for the student
        const enrollments = await Enrollment.find({
            student: session.id,
            status: 'active'
        }).populate({
            path: 'class',
            select: 'name grade section classTeacher',
            populate: {
                path: 'classTeacher',
                select: 'firstName lastName'
            }
        }) as unknown as PopulatedEnrollment[];

        // Transform the data to match the expected format
        const classes = enrollments.map(enrollment => ({
            _id: enrollment.class._id,
            className: enrollment.class.name,
            section: enrollment.class.section,
            teacher: enrollment.class.classTeacher
        }));

        return NextResponse.json(classes);
    } catch (error) {
        console.error('Error fetching student classes:', error);
        return NextResponse.json(
            { error: 'Failed to fetch classes' },
            { status: 500 }
        );
    }
} 