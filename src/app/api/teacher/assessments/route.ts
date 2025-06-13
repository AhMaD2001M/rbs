import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/userModel';
import Class from '@/models/classModel';
import Assessment from '@/models/assessmentModel';

export async function POST(req: NextRequest) {
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
        const { classId, title, description, maxMarks, dueDate, marks } = body;

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

        // Create assessment
        const assessment = await Assessment.create({
            class: classId,
            teacher: teacher._id,
            title,
            description,
            maxMarks,
            dueDate,
            marks: marks.map((mark: any) => ({
                student: mark.studentId,
                score: mark.score,
                remarks: mark.remarks
            }))
        });

        return NextResponse.json(assessment, { status: 201 });
    } catch (error) {
        console.error('Error creating assessment:', error);
        return NextResponse.json(
            { message: 'Error creating assessment' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session?.email) {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const { searchParams } = new URL(req.url);
        const classId = searchParams.get('classId');

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

        // Get assessments for the specified class
        const query = classId 
            ? { class: classId, teacher: teacher._id }
            : { teacher: teacher._id };

        const assessments = await Assessment.find(query)
            .populate('class', 'name grade section')
            .populate('marks.student', 'username email profile')
            .sort({ createdAt: -1 });

        return NextResponse.json(assessments);
    } catch (error) {
        console.error('Error fetching assessments:', error);
        return NextResponse.json(
            { message: 'Error fetching assessments' },
            { status: 500 }
        );
    }
} 