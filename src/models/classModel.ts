import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a class name"],
        unique: true,
    },
    grade: {
        type: String,
        required: [true, "Please provide a grade level"],
    },
    section: {
        type: String,
        required: [true, "Please provide a section"],
    },
    academicYear: {
        type: String,
        required: [true, "Please provide academic year"],
    },
    classTeacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, "Please assign a class teacher"],
    },
    subjects: [{
        name: String,
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        }
    }],
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }],
    schedule: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        },
        periods: [{
            subject: String,
            teacher: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'users'
            },
            startTime: String,
            endTime: String
        }]
    }],
    capacity: {
        type: Number,
        required: [true, "Please specify class capacity"],
    },
    active: {
        type: Boolean,
        default: true,
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
classSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Class = mongoose.models.classes || mongoose.model("classes", classSchema);

export default Class; 