import mongoose from "mongoose";

const dbUrl = process.env.MONGODB_URI!;

async function dbConnect() {
  try {
    await mongoose.connect(dbUrl);
    console.log("DB connected successfully");
  } catch (error) {
    console.log("Data Base connection failed", error);
  }
}

export default dbConnect;
