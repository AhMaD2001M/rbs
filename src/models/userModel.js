import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    role: {
        type: String,
        enum: ['admin', 'teacher', 'student'],
        required: [true, "Role is required"],
    },
    studentId: {
        type: String,
        unique: true,
        sparse: true, // Allows null values for non-student users
    },
    isVerified: {
        type: Boolean,
        default: true,
    },
    profile: {
        firstName: String,
        lastName: String,
        phoneNumber: String,
        emergencyContact: String,
        address: String,
        dateOfBirth: Date,
        gender: String,
        grade: String,
        section: String,
    },
    forgetPasswordToken: String,
    forgetPasswordTokenExpiry: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;