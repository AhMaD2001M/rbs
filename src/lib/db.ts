import mongoose from 'mongoose';

// Add debug logging
console.log('Available environment variables:', {
    MONGODB_URI: process.env.MONGODB_URI,
    MONGO_URI: process.env.MONGO_URI,
    NODE_ENV: process.env.NODE_ENV
});

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI; // Try both variables

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env\n' +
        'Example: MONGODB_URI=mongodb://127.0.0.1:27017/rbs\n' +
        'or: MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/rbs'
    );
}

interface GlobalWithMongoose extends Global {
    mongoose: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
}

declare const global: GlobalWithMongoose;

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
    try {
        // If we have a connection, return it
        if (cached.conn) {
            console.log('Using existing MongoDB connection');
            return cached.conn;
        }

        // If we don't have a promise to connect, create one
        if (!cached.promise) {
            const opts = {
                bufferCommands: false,
                maxPoolSize: 10,
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
                family: 4
            };

            console.log('Connecting to MongoDB...');
            cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
                console.log('MongoDB connected successfully');
                return mongoose;
            });
        }

        try {
            cached.conn = await cached.promise;
        } catch (e) {
            cached.promise = null;
            console.error('MongoDB connection error:', e);
            throw e;
        }

        // Add connection event listeners
        mongoose.connection.on('connected', () => {
            console.log('MongoDB connection established');
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB connection disconnected');
        });

        // Handle process termination
        process.on('SIGINT', async () => {
            try {
                await mongoose.connection.close();
                console.log('MongoDB connection closed through app termination');
                process.exit(0);
            } catch (err) {
                console.error('Error closing MongoDB connection:', err);
                process.exit(1);
            }
        });

        return cached.conn;
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error;
    }
}