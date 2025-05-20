import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide assessment title"],
    },
    type: {
        type: String,
        enum: ['exam', 'quiz', 'assignment', 'project', 'mid-term', 'final'],
        required: [true, "Please specify assessment type"],
    },
    subject: {
        type: String,
        required: [true, "Please specify subject"],
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classes',
        required: [true, "Please specify class"],
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, "Please specify teacher"],
    },
    totalMarks: {
        type: Number,
        required: [true, "Please specify total marks"],
    },
    passingMarks: {
        type: Number,
        required: [true, "Please specify passing marks"],
    },
    date: {
        type: Date,
        required: [true, "Please specify assessment date"],
    },
    description: {
        type: String,
        required: [true, "Please provide assessment description"],
    },
    grades: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        marks: {
            type: Number,
            default: 0
        },
        remarks: String
    }],
    status: {
        type: String,
        enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
        default: 'scheduled',
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

// Middleware to update the updatedAt field on save
assessmentSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Virtual field for calculating class average
assessmentSchema.virtual('classAverage').get(function() {
    if (!this.grades || this.grades.length === 0) return 0;
    const total = this.grades.reduce((sum, grade) => sum + (grade.marks || 0), 0);
    return total / this.grades.length;
});

// Virtual field for calculating pass percentage
assessmentSchema.virtual('passPercentage').get(function() {
    if (!this.grades || this.grades.length === 0) return 0;
    const passed = this.grades.filter(grade => (grade.marks || 0) >= this.passingMarks).length;
    return (passed / this.grades.length) * 100;
});

const Assessment = mongoose.models.assessments || mongoose.model("assessments", assessmentSchema);

export default Assessment; 