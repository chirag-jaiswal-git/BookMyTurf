import mongoose from "mongoose";

const venueSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true }, // e.g., "Vijay Nagar, Indore"
    sports: [{ type: String }],
    amenities: [{ type: String }],
    price: { type: Number, required: true },
    contact_no: { type: String, required: true },
    status: { type: String, default: "Available" },
    images: [{ type: String, required: true }],
    rating: { type: Number, default: 0 }, // You can calculate this later
    date: { type: Date, default: Date.now },
});

const venueModel = mongoose.models.venue || mongoose.model("venue", venueSchema);
export default venueModel;