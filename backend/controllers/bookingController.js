import bookingModel from "../models/bookingModel.js";
import mongoose from "mongoose";
import venueModel from "../models/venueModel.js";

import { getIO } from "../socket.js";

// ===============================
// CREATE BOOKING
// ===============================

export const createBooking = async (req, res) => {
  try {
    const { venueId, bookingDate, timeSlot } = req.body;

    if (!venueId || !bookingDate || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: "Venue, booking date and time slot are required",
      });
    }

    const venue = await venueModel.findById(venueId);

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });
    }

    const [from, to] = timeSlot.split("-");

    const startHour = Number(from.split(":")[0]);
    const endHour = Number(to.split(":")[0]);

    const duration = endHour - startHour;

    if (duration <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid time slot",
      });
    }

    const totalPrice = duration * Number(venue.price);

    const newBooking = await bookingModel.create({
      venueId,
      userId: req.user.user_id,
      name: req.user.name,
      email: req.user.email,
      bookingDate,
      timeSlot,
      totalPrice,
    });

    // ===============================
    // ADMIN SOCKET NOTIFICATION
    // ===============================

    try {
      const io = getIO();

      io.to("admins").emit("newBooking", {
        bookingId: newBooking._id,
        customerName: req.user.name,
        customerEmail: req.user.email,
        venueName: venue.name,
        bookingDate: newBooking.bookingDate,
        timeSlot: newBooking.timeSlot,
        totalPrice: newBooking.totalPrice,
        bookingStatus: newBooking.bookingStatus,
      });
    } catch (socketError) {
      console.error("Socket Notification Error:", socketError);
    }

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error("BOOKING ERROR:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This time slot is already booked",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ===============================
// GET MY BOOKINGS
// ===============================

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await bookingModel
      .find({
        userId: req.user.user_id,
      })
      .populate("venueId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Get My Bookings Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ===============================
// GET ALL BOOKINGS
// ADMIN
// ===============================

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingModel
      .find()
      .populate("venueId")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get All Bookings Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ===============================
// UPDATE BOOKING STATUS
// ADMIN
// ===============================

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { bookingStatus } = req.body;

    const validStatuses = ["Pending", "Confirmed", "Completed", "Cancelled"];

    if (!validStatuses.includes(bookingStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
    }

    const updatedBooking = await bookingModel.findByIdAndUpdate(
      id,
      { bookingStatus },
      { new: true },
    );

    if (!updatedBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking status updated",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Update Booking Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ===============================
// CANCEL BOOKING
// USER
// ===============================

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });
    }

    const booking = await bookingModel.findById(id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.userId.toString() !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (booking.bookingStatus === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "Booking already cancelled",
      });
    }

    booking.bookingStatus = "Cancelled";

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("Cancel Booking Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ===============================
// UPDATE REFUND STATUS
// ADMIN
// ===============================

export const updateRefundStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { refundStatus } = req.body;

    const validRefunds = ["Pending", "Processing", "Completed", "Failed"];

    if (!validRefunds.includes(refundStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid refund status",
      });
    }

    const updatedBooking = await bookingModel.findByIdAndUpdate(
      id,
      { refundStatus },
      { new: true },
    );

    if (!updatedBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Refund status updated",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("Update Refund Status Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
