import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Assessment from '@/models/assessmentModel';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const assessment = await Assessment.findById(params.id)
      .populate('teacher', 'username email')
      .populate('class', 'name grade section')
      .populate('grades.student', 'username email profile');

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Error fetching assessment:', error);
    return NextResponse.json(
      { error: 'Error fetching assessment' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();

    const updatedAssessment = await Assessment.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    ).populate([
      { path: 'teacher', select: 'username email' },
      { path: 'class', select: 'name grade section' },
      { path: 'grades.student', select: 'username email profile' }
    ]);

    if (!updatedAssessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedAssessment);
  } catch (error) {
    console.error('Error updating assessment:', error);
    return NextResponse.json(
      { error: 'Error updating assessment' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const deletedAssessment = await Assessment.findByIdAndDelete(params.id);

    if (!deletedAssessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assessment:', error);
    return NextResponse.json(
      { error: 'Error deleting assessment' },
      { status: 500 }
    );
  }
} 