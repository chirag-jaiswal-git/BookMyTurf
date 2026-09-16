import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "venue",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    bookingDate: {
      type: Date,
      required: true,
    },

    timeSlot: {
      type: String,
      required: true,
      trim: true,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    bookingStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Confirmed",
    },
  },
  {
    timestamps: true,
  },
);

// Prevent double booking.
// Cancelled bookings do not block the slot.

bookingSchema.index(
  {
    venueId: 1,
    bookingDate: 1,
    timeSlot: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      bookingStatus: {
        $in: ["Pending", "Confirmed", "Completed"],
      },
    },
  },
);

const bookingModel =
  mongoose.models.booking || mongoose.model("booking", bookingSchema);

export default bookingModel;
