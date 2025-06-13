import { NextRequest, NextResponse } from 'next/server';
import Class from '@/models/classModel';
import { connectDB } from '@/lib/db';
import { getSession } from '@/lib/auth';

// GET all classes
export async function GET(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session?.email || session.role !== 'admin') {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();
        const classes = await Class.find()
            .populate('classTeacher', 'username email')
            .populate('students', 'username email')
            .sort({ createdAt: -1 });

        return NextResponse.json(classes);
    } catch (error) {
        console.error('Error fetching classes:', error);
        return NextResponse.json(
            { error: 'Error fetching classes' },
            { status: 500 }
        );
    }
}

// POST create new class
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

        const newClass = await Class.create(body);
        await newClass.populate('classTeacher', 'username email');

        return NextResponse.json(newClass, { status: 201 });
    } catch (error) {
        console.error('Error creating class:', error);
        return NextResponse.json(
            { error: 'Error creating class' },
            { status: 500 }
        );
    }
}

// PUT update class
export async function PUT(req: NextRequest) {
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
        const { id, ...updateData } = body;

        const updatedClass = await Class.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).populate('classTeacher', 'username email');

        if (!updatedClass) {
            return NextResponse.json(
                { error: 'Class not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedClass);
    } catch (error) {
        console.error('Error updating class:', error);
        return NextResponse.json(
            { error: 'Error updating class' },
            { status: 500 }
        );
    }
}

// DELETE class
export async function DELETE(req: NextRequest) {
    try {
        const session = await getSession();
        if (!session?.email || session.role !== 'admin') {
            return NextResponse.json(
                { message: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Class ID is required' },
                { status: 400 }
            );
        }

        const deletedClass = await Class.findByIdAndDelete(id);

        if (!deletedClass) {
            return NextResponse.json(
                { error: 'Class not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Class deleted successfully' });
    } catch (error) {
        console.error('Error deleting class:', error);
        return NextResponse.json(
            { error: 'Error deleting class' },
            { status: 500 }
        );
    }
} 