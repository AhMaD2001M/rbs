import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Assessment title is required"],
    },
    type: {
        type: String,
        enum: ['exam', 'quiz', 'assignment'],
        required: [true, "Assessment type is required"],
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classes',
        required: [true, "Class is required"],
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, "Teacher is required"],
    },
    totalMarks: {
        type: Number,
        required: [true, "Total marks is required"],
    },
    passingMarks: {
        type: Number,
        required: [true, "Passing marks is required"],
    },
    dueDate: {
        type: Date,
        required: [true, "Due date is required"],
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'completed'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

const Assessment = mongoose.models.assessments || mongoose.model("assessments", assessmentSchema);

export default Assessment; 