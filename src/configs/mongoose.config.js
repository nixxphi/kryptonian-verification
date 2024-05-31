import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  let retries = 5;
  while (retries) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {});
      console.log('MongoDB connected');
      break; // Break out of the loop if connection is successful
    } catch (error) {
      console.error('MongoDB connection error:', error);
      retries--;
      if (retries === 0) {
        console.error('Failed to connect to MongoDB after multiple retries. Exiting...');
        process.exit(1);
      }
      console.log(`Retrying MongoDB connection in 3 seconds (${retries} retries left)`);
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for 3 seconds before retrying
    }
  }
};

export default connectDB;
