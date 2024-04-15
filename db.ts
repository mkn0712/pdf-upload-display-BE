import mongoose from 'mongoose';

export default async function connectDB() {
  try {
    const options: mongoose.ConnectOptions = {};

    await mongoose.connect('mongodb://localhost:27017/pdfProject', options);

    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}