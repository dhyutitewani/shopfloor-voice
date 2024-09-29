import * as dotenv from 'dotenv'
import mongoose from "mongoose";
import usersSeed from "./user.seed";
dotenv.config();

async function seed() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGO_URI must be defined');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.info('Connected to MongoDb');

    console.info('Seeding process initiated...');
    await usersSeed();
    console.info('Seeding process completed');
  } catch (err) {
    console.info('Error during seeding:', err);
  } finally {
    // Disconnect from MongoDB
    mongoose.disconnect();
  }
}

seed();