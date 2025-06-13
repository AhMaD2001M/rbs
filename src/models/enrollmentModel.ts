import mongoose, { Document, Model } from 'mongoose';

export interface IEnrollment extends Document {
    student: mongoose.Types.ObjectId;
    class: mongoose.Types.ObjectId;
    enrolledBy: mongoose.Types.ObjectId;
    status: 'active' | 'completed' | 'dropped';
    enrolledAt: Date;
    updatedAt: Date;
}

const enrollmentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classes',
        required: true
    },
    enrolledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'dropped'],
        default: 'active'
    },
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Add compound index for student and class
enrollmentSchema.index({ student: 1, class: 1 }, { unique: true });

const Enrollment: Model<IEnrollment> = mongoose.models.enrollments || mongoose.model<IEnrollment>("enrollments", enrollmentSchema);

export default Enrollment; 