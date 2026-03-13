import mongoose from 'mongoose';
import { config } from '../config/index.js';

export async function connectDb() {
  await mongoose.connect(config.mongodbUri);
  console.log('MongoDB connected');
}
