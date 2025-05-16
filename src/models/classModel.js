import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    className: {
        type: String,
        required: [true, "Class name is required"],
    },
    section: {
        type: String,
        required: [true, "Section is required"],
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, "Teacher is required"],
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    }],
    academicYear: {
        type: String,
        required: [true, "Academic year is required"],
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
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

const Class = mongoose.models.classes || mongoose.model("classes", classSchema);

export default Class; 