import express from "express";

import {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
  updateRefundStatus,
} from "../controllers/bookingController.js";

import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";

const bookingRouter = express.Router();

// ===============================
// USER ROUTES
// ===============================

bookingRouter.post("/create", userAuth, createBooking);

bookingRouter.get("/my", userAuth, getMyBookings);

bookingRouter.put("/cancel/:id", userAuth, cancelBooking);

// ===============================
// ADMIN ROUTES
// ===============================

bookingRouter.get("/all", adminAuth, getAllBookings);

bookingRouter.put("/status/:id", adminAuth, updateBookingStatus);

bookingRouter.put("/refund/:id", adminAuth, updateRefundStatus);

export default bookingRouter;
