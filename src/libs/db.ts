import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL!

if (!MONGODB_URL) {
    throw new Error("Please define the MONGO_URL environment variable inside .env");
}

let cached = global.mongoose
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null, Types: {} as any };
}

export const connectDB = async () => {
    if (cached.conn) {
        return cached.conn
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10
        }
        cached.promise = mongoose.connect(MONGODB_URL, opts).then(() => mongoose.connection);
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw error;
    }
}