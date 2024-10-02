import mongoose from "mongoose";
import * as dotenv from "dotenv";
import usersSeed from "./user.seed";

dotenv.config();

async function seed() {
  try {
    if (!process.env.MONGO_CONNECTION_STRING) {
      throw new Error('MONGO_URI must be defined');
    }

    await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
    console.info('Connected to MongoDb');

    console.info('Seeding process initiated...');
    await usersSeed();
    console.info('Seeding process completed');
  } catch (err) {
    console.info('Error during seeding:', err);
  } finally {
    mongoose.disconnect();
  }
}

seed();