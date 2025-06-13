import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/userModel';
import Class from '@/models/classModel';
import Announcement from '@/models/announcementModel';

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
        const { classId, title, content, priority } = body;

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

        // Create announcement
        const announcement = await Announcement.create({
            class: classId,
            teacher: teacher._id,
            title,
            content,
            priority: priority || 'normal'
        });

        return NextResponse.json(announcement, { status: 201 });
    } catch (error) {
        console.error('Error creating announcement:', error);
        return NextResponse.json(
            { message: 'Error creating announcement' },
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

        // Get announcements for the specified class
        const query = classId 
            ? { class: classId, teacher: teacher._id }
            : { teacher: teacher._id };

        const announcements = await Announcement.find(query)
            .populate('class', 'name grade section')
            .populate('teacher', 'username email')
            .sort({ createdAt: -1 });

        return NextResponse.json(announcements);
    } catch (error) {
        console.error('Error fetching announcements:', error);
        return NextResponse.json(
            { message: 'Error fetching announcements' },
            { status: 500 }
        );
    }
} 