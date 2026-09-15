import mongoose from "mongoose";

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    sports: [
      {
        type: String,
        trim: true,
      },
    ],

    amenities: [
      {
        type: String,
        trim: true,
      },
    ],

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    contact_no: {
      type: String,
      required: true,
      match: /^\d{10}$/,
    },

    status: {
      type: String,
      enum: ["Available", "Popular", "New", "Under Maintenance"],
      default: "Available",
    },

    images: [
      {
        type: String,
        required: true,
      },
    ],

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const venueModel =
  mongoose.models.venue || mongoose.model("venue", venueSchema);

export default venueModel;
