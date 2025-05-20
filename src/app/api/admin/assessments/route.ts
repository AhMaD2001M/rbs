import { NextRequest, NextResponse } from 'next/server';
import Assessment from '@/models/assessmentModel';
import { connectDB } from '@/lib/db';

// GET all assessments
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const classId = searchParams.get('classId');
        const query = classId ? { class: classId } : {};

        const assessments = await Assessment.find(query)
            .populate('teacher', 'username email')
            .populate('class', 'name grade section')
            .populate('grades.student', 'username email')
            .sort({ date: -1 });

        return NextResponse.json(assessments);
    } catch (error) {
        console.error('Error fetching assessments:', error);
        return NextResponse.json(
            { error: 'Error fetching assessments' },
            { status: 500 }
        );
    }
}

// POST create new assessment
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        // Initialize empty grades array
        const newAssessment = await Assessment.create({
            ...body,
            grades: []
        });
        
        await newAssessment.populate([
            { path: 'teacher', select: 'username email' },
            { path: 'class', select: 'name grade section' }
        ]);

        return NextResponse.json(newAssessment, { status: 201 });
    } catch (error) {
        console.error('Error creating assessment:', error);
        return NextResponse.json(
            { error: 'Error creating assessment' },
            { status: 500 }
        );
    }
}

// PUT update assessment
export async function PUT(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { id, ...updateData } = body;

        const updatedAssessment = await Assessment.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).populate([
            { path: 'teacher', select: 'username email' },
            { path: 'class', select: 'name grade section' },
            { path: 'grades.student', select: 'username email' }
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

// DELETE assessment
export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Assessment ID is required' },
                { status: 400 }
            );
        }

        const deletedAssessment = await Assessment.findByIdAndDelete(id);

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