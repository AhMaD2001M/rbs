import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Assessment from '@/models/assessmentModel';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; studentId: string } }
) {
  try {
    await connectDB();
    const body = await req.json();
    const { marks, remarks } = body;

    // Find the assessment
    const assessment = await Assessment.findById(params.id);
    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      );
    }

    // Find the grade index for this student
    const gradeIndex = assessment.grades.findIndex(
      g => g.student.toString() === params.studentId
    );

    if (gradeIndex === -1) {
      // Add new grade
      assessment.grades.push({
        student: params.studentId,
        marks,
        remarks
      });
    } else {
      // Update existing grade
      assessment.grades[gradeIndex] = {
        ...assessment.grades[gradeIndex],
        marks,
        remarks
      };
    }

    // Save the assessment
    await assessment.save();

    // Return the updated assessment with populated fields
    const updatedAssessment = await Assessment.findById(params.id)
      .populate('teacher', 'username email')
      .populate('class', 'name grade section')
      .populate('grades.student', 'username email profile');

    return NextResponse.json(updatedAssessment);
  } catch (error) {
    console.error('Error updating grade:', error);
    return NextResponse.json(
      { error: 'Error updating grade' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; studentId: string } }
) {
  try {
    await connectDB();

    // Find and update the assessment, removing the grade for this student
    const assessment = await Assessment.findByIdAndUpdate(
      params.id,
      {
        $pull: {
          grades: { student: params.studentId }
        }
      },
      { new: true }
    ).populate([
      { path: 'teacher', select: 'username email' },
      { path: 'class', select: 'name grade section' },
      { path: 'grades.student', select: 'username email profile' }
    ]);

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Error deleting grade:', error);
    return NextResponse.json(
      { error: 'Error deleting grade' },
      { status: 500 }
    );
  }
} 