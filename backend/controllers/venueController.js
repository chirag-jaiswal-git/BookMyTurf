import { v2 as cloudinary } from "cloudinary";
import venueModel from "../models/venueModel.js";
import fs from "fs";

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

    if (!name || !area || !city || !price) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // Upload images to Cloudinary
    const imagesUrl = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "venues",
          resource_type: "image",
        });

        // Remove file from local storage after upload
        fs.unlinkSync(file.path);

        return result.secure_url;
      })
    );

    const venue = new venueModel({
      name,
      description,
      price: Number(price),
      location: `${area}, ${city}`,
      sports: JSON.parse(sports),
      amenities: JSON.parse(amenities),
      rating: Number(rating),
      contact_no,
      status,
      images: imagesUrl,
      date: Date.now(),
    });

    await venue.save();

    res.status(200).json({
      success: true,
      message: "Venue added successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// function for list venues
const listVenues = async (req, res) => {
try {
    const venues = await venueModel.find();
    res.status(200).json({success:true,venues});
}catch (error) {
    res.status(500).json({success:false,message:"Error fetching venues",error:error.message});
}
}

//function for remove venue
const removeVenue = async (req, res) => {
try {
    await venueModel.findByIdAndDelete(req.body.id);
    res.status(200).json({success:true,message:"Venue removed successfully"});
}catch (error) {
    res.status(500).json({success:false,message:"Error removing venue",error:error.message});
}
}

//function for single venue info
const singleVenueInfo = async (req, res) => {
    try {
        const {venueId} = req.body;
        const venue = await venueModel.findById(venueId);
        res.status(200).json({success:true,venue});
    }catch (error) {
        res.status(500).json({success:false,message:"Error fetching venue info",error:error.message});
    }   
}

export { addVenue, listVenues, removeVenue, singleVenueInfo };