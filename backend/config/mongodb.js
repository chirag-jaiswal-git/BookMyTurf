import mongoose from "mongoose";
import bookingModel from "../models/bookingModel.js";

const connectDB = async () => {
  try {
    if (!process.env.DBURL) {
      throw new Error("DBURL is missing");
    }

    await mongoose.connect(process.env.DBURL, {
      dbName: "bookmyturf_db",
    });

    await bookingModel.syncIndexes();

    console.log("✅ MongoDB Connected");
    console.log("📦 Database:", mongoose.connection.name);
  } catch (error) {
    console.error("❌ MongoDB Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
