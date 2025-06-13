import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    role: {
        type: String,
        enum: ['admin', 'teacher', 'student'],
        default: 'student',
        required: [true, "Please specify a role"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    profile: {
        firstName: String,
        lastName: String,
        dateOfBirth: Date,
        gender: String,
        address: String,
        phoneNumber: String,
        emergencyContact: String,
        grade: String,
        section: String,
        subject: String, // For teachers
    },
    classes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classes'
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

// Update the updatedAt timestamp before saving
userSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

// Check if the model is already defined to prevent overwriting
const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User; 