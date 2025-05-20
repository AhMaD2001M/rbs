import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Class from '@/models/classModel';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const classData = await Class.findById(params.id)
      .populate('classTeacher', 'username email')
      .populate('students', 'username email profile')
      .populate('subjects.teacher', 'username email');

    if (!classData) {
      return NextResponse.json(
        { error: 'Class not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(classData);
  } catch (error) {
    console.error('Error fetching class:', error);
    return NextResponse.json(
      { error: 'Error fetching class' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();

    const updatedClass = await Class.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    ).populate([
      { path: 'classTeacher', select: 'username email' },
      { path: 'students', select: 'username email profile' },
      { path: 'subjects.teacher', select: 'username email' }
    ]);

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

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const deletedClass = await Class.findByIdAndDelete(params.id);

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