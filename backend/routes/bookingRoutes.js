import express from "express";
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
  updateRefundStatus,
} from "../controllers/bookingController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/userAuth.js";


const bookingRouter = express.Router();

bookingRouter.post("/create", authUser, createBooking);
bookingRouter.get("/my", authUser, getMyBookings);
bookingRouter.put("/cancel/:id", authUser, cancelBooking);
bookingRouter.get("/all", adminAuth, getAllBookings);
bookingRouter.put("/status/:id", adminAuth, updateBookingStatus);
bookingRouter.put("/refund/:id", adminAuth, updateRefundStatus);

export default bookingRouter;
