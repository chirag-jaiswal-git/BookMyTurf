import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
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
  name: { type: String, required: true },
  email: { type: String, required: true },
  bookingDate: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  bookingStatus: { type: String, default: "Confirmed" }, // e.g., Pending, Confirmed, Completed, Cancelled
  refundStatus: {
  type: String,
  enum: ["Not Initiated", "Processing", "Completed"],
  default: "Not Initiated",
},
  createdAt: { type: Date, default: Date.now },
});

bookingSchema.index({ venueId: 1, bookingDate: 1, timeSlot: 1 }, { unique: true });

const bookingModel =
  mongoose.models.booking || mongoose.model("booking", bookingSchema);
export default bookingModel;
