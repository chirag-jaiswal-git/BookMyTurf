import mongoose from "mongoose";
import bookingModel from "../models/bookingModel.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DBURL, {
      dbName: "bookmyturf_db",
    });

    await bookingModel.syncIndexes();

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
