import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, "Student is required"],
    },
    assessment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'assessments',
        required: [true, "Assessment is required"],
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classes',
        required: [true, "Class is required"],
    },
    obtainedMarks: {
        type: Number,
        required: [true, "Obtained marks is required"],
    },
    grade: {
        type: String,
        enum: ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'],
        required: [true, "Grade is required"],
    },
    remarks: String,
    status: {
        type: String,
        enum: ['pass', 'fail'],
        required: [true, "Status is required"],
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

const Result = mongoose.models.results || mongoose.model("results", resultSchema);

export default Result; 