import { NextResponse } from 'next/server';
import User from '@/models/userModel';
import Class from '@/models/classModel';
import Assessment from '@/models/assessmentModel';

export async function GET() {
  try {
    // Get total teachers
    const totalTeachers = await User.countDocuments({ role: 'teacher' });

    // Get total students
    const totalStudents = await User.countDocuments({ role: 'student' });

    // Get total classes
    const totalClasses = await Class.countDocuments();

    // Get total assessments
    const totalAssessments = await Assessment.countDocuments();

    return NextResponse.json({
      totalTeachers,
      totalStudents,
      totalClasses,
      totalAssessments,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Error fetching dashboard statistics' },
      { status: 500 }
    );
  }
} 