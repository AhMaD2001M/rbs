import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/userModel';
import { connectDB } from '@/lib/db';

// GET all students
export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const classId = searchParams.get('classId');
        
        let query = { role: 'student' };
        if (classId) {
            // If classId is provided, find students in that class
            const Class = (await import('@/models/classModel')).default;
            const classDoc = await Class.findById(classId);
            if (classDoc) {
                query = {
                    ...query,
                    _id: { $in: classDoc.students }
                };
            }
        }

        const students = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 });

        return NextResponse.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        return NextResponse.json(
            { error: 'Error fetching students' },
            { status: 500 }
        );
    }
}

// POST create new student
export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        
        // Set role as student
        body.role = 'student';
        
        // Create the student
        const newStudent = await User.create(body);
        
        // If classId is provided, add student to the class
        if (body.classId) {
            const Class = (await import('@/models/classModel')).default;
            await Class.findByIdAndUpdate(
                body.classId,
                { $addToSet: { students: newStudent._id } }
            );
        }
        
        // Remove password from response
        const student = newStudent.toObject();
        delete student.password;

        return NextResponse.json(student, { status: 201 });
    } catch (error) {
        console.error('Error creating student:', error);
        return NextResponse.json(
            { error: 'Error creating student' },
            { status: 500 }
        );
    }
}

// PUT update student
export async function PUT(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        const { id, classId, ...updateData } = body;

        // Prevent role change through this endpoint
        delete updateData.role;

        const updatedStudent = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).select('-password');

        if (!updatedStudent) {
            return NextResponse.json(
                { error: 'Student not found' },
                { status: 404 }
            );
        }

        // Handle class assignment if provided
        if (classId) {
            const Class = (await import('@/models/classModel')).default;
            // Remove from all classes first
            await Class.updateMany(
                { students: id },
                { $pull: { students: id } }
            );
            // Add to new class
            await Class.findByIdAndUpdate(
                classId,
                { $addToSet: { students: id } }
            );
        }

        return NextResponse.json(updatedStudent);
    } catch (error) {
        console.error('Error updating student:', error);
        return NextResponse.json(
            { error: 'Error updating student' },
            { status: 500 }
        );
    }
}

// DELETE student
export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { error: 'Student ID is required' },
                { status: 400 }
            );
        }

        // Remove student from all classes
        const Class = (await import('@/models/classModel')).default;
        await Class.updateMany(
            { students: id },
            { $pull: { students: id } }
        );

        // Delete the student
        const deletedStudent = await User.findOneAndDelete({
            _id: id,
            role: 'student'
        });

        if (!deletedStudent) {
            return NextResponse.json(
                { error: 'Student not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        return NextResponse.json(
            { error: 'Error deleting student' },
            { status: 500 }
        );
    }
} 