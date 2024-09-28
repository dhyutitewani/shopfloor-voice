import "dotenv/config";
import app from "./app";
import mongoose from "mongoose";
import env from "./src/util/validateEnv";

const port = process.env.PORT;

mongoose.connect(process.env.MONGO_CONNECTION_STRING!)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(port, () => {
      console.log(`Server running on port: ${port}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));