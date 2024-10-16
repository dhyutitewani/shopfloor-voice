import "dotenv/config";
import app from "./app";
import mongoose from "mongoose";

const port = process.env.PORT;

mongoose.connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(port, () => {
      console.log(`Server running on port: ${port}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));