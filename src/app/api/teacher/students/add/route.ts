import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/userModel';
import Class from '@/models/classModel';

export async function POST(req: Request) {
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

        const body = await req.json();
        const { classId, studentEmails } = body;

        // Verify teacher has access to this class
        const classDoc = await Class.findOne({
            _id: classId,
            $or: [
                { classTeacher: teacher._id },
                { 'subjects.teacher': teacher._id }
            ]
        });

        if (!classDoc) {
            return NextResponse.json(
                { message: 'Class not found or unauthorized' },
                { status: 404 }
            );
        }

        // Find students by email
        const students = await User.find({
            email: { $in: studentEmails },
            role: 'student'
        });

        if (students.length === 0) {
            return NextResponse.json(
                { message: 'No students found with the provided emails' },
                { status: 404 }
            );
        }

        // Add students to class
        const studentIds = students.map(student => student._id);
        await Class.findByIdAndUpdate(classId, {
            $addToSet: { students: { $each: studentIds } }
        });

        // Add class to students' classes array
        await User.updateMany(
            { _id: { $in: studentIds } },
            { $addToSet: { classes: classId } }
        );

        return NextResponse.json({
            message: 'Students enrolled successfully',
            enrolledCount: students.length
        });
    } catch (error) {
        console.error('Error enrolling students:', error);
        return NextResponse.json(
            { message: 'Error enrolling students' },
            { status: 500 }
        );
    }
} 