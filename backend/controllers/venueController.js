import { v2 as cloudinary } from "cloudinary";
import venueModel from "../models/venueModel.js";
import bookingModel from "../models/bookingModel.js";
import mongoose from "mongoose";
import fs from "fs";

// ===============================
// ADD VENUE
// ===============================
const addVenue = async (req, res) => {
  try {
    const {
      name,
      area,
      city,
      description,
      price,
      sports,
      amenities,
      rating,
      contact_no,
      status,
    } = req.body;

    // Required fields
    if (!name || !area || !city || !description || !price || !contact_no) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // Upload images
    const imagesUrl = [];

    for (const file of req.files || []) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "bookmyturf/venues",
      });

      imagesUrl.push(result.secure_url);

      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }

    // Create venue
    const venue = new venueModel({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      location: `${area.trim()}, ${city.trim()}`,
      sports: sports ? JSON.parse(sports) : [],
      amenities: amenities ? JSON.parse(amenities) : [],
      rating: Number(rating) || 0,
      contact_no: contact_no.trim(),
      status: status || "Available",
      images: imagesUrl,
      date: new Date(),
    });

    await venue.save();

    res.status(201).json({
      success: true,
      message: "Venue added successfully",
      venue,
    });
  } catch (error) {
    console.error("Add Venue Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// LIST VENUES
// ===============================
const listVenues = async (req, res) => {
  try {
    const venues = await venueModel.find();

    res.status(200).json({
      success: true,
      venues,
    });
  } catch (error) {
    console.error("List Venues Error:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching venues",
    });
  }
};

// ===============================
// REMOVE VENUE
// ===============================
const removeVenue = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid venue ID",
      });
    }

    const venue = await venueModel.findById(id);

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });
    }

    const activeBookings = await bookingModel.countDocuments({
      venueId: id,
      bookingStatus: {
        $in: ["Pending", "Confirmed"],
      },
    });

    if (activeBookings > 0) {
      return res.status(409).json({
        success: false,
        message: "Cannot remove venue because it has active bookings",
      });
    }

    await venueModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Venue removed successfully",
    });
  } catch (error) {
    console.error("Remove Venue Error:", error);

    res.status(500).json({
      success: false,
      message: "Error removing venue",
    });
  }
};

// ===============================
// SINGLE VENUE
// ===============================
const singleVenueInfo = async (req, res) => {
  try {
    const { venueId } = req.body;

    if (!venueId || !mongoose.Types.ObjectId.isValid(venueId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid venue ID",
      });
    }

    const venue = await venueModel.findById(venueId);

    if (!venue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });
    }

    res.status(200).json({
      success: true,
      venue,
    });
  } catch (error) {
    console.error("Single Venue Error:", error);

    res.status(500).json({
      success: false,
      message: "Error fetching venue info",
    });
  }
};

export {
  addVenue,
  listVenues,
  removeVenue,
  singleVenueInfo,
};
