import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/preentrega_backend1';

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) return;

    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log('MongoDB conectado');
};
