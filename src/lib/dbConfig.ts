import mongoose from 'mongoose';

export async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    throw new Error("Database connection failed");
  }
}