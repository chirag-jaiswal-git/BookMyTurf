import mongoose from "mongoose";
import bookingModel from "../models/bookingModel.js";

const connectDB = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");

    if (!process.env.DBURL) {
      throw new Error("DBURL environment variable is missing");
    }

    await mongoose.connect(process.env.DBURL);

    console.log("✅ MongoDB Connected");
   // console.log("📦 Database:", mongoose.connection.name);

    await bookingModel.syncIndexes();

   // console.log("✅ Booking indexes synced");
  } catch (error) {
    console.error("❌ MongoDB Error:");
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
