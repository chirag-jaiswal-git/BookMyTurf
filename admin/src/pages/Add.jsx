import React, { useState } from "react";
import axios from "axios";
import { backendURL } from "../App";
import { toast } from "react-toastify";
import { FaCloudUploadAlt, FaRupeeSign, FaPhone, FaStar, FaTrash } from "react-icons/fa";

// --- CONFIG ---
const CITIES_OPTIONS = ["Indore", "Pune", "Hyderabad", "Bangalore", "Delhi"];
const SPORTS_OPTIONS = [
  "Football",
  "Cricket",
  "Volleyball",
  "Hockey",
  "Kabaddi",
  "Tennis",
];
const AMENITIES_OPTIONS = [
  "Floodlights",
  "Changing Rooms",
  "Parking",
  "Cafe",
  "First Aid",
  "Wi-Fi",
  "Music System",
  "Scoreboard",
  "Drinking Water",
  "Showers",
];

const Add = ({ token }) => {
  // ---------- IMAGE STATES ----------
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [hoverRating, setHoverRating] = useState(0);

  // ---------- SINGLE SOURCE OF TRUTH ----------
  const [venueData, setVenueData] = useState({
    name: "",
    description: "",
    city: "Indore",
    area: "",
    price: "",
    contact_no: "",
    status: "Available",
    sports: [],
    amenities: [],
    rating: 0,
  });

  // ---------- INPUT HANDLER ----------
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setVenueData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ---------- CHECKBOX HANDLER ----------
  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;

    setVenueData((prev) => ({
      ...prev,
      [name]: checked
        ? [...prev[name], value]
        : prev[name].filter((item) => item !== value),
    }));
  };

  // ---------- SUBMIT ----------
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.entries(venueData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      if (image1) formData.append("images", image1);
      if (image2) formData.append("images", image2);
      if (image3) formData.append("images", image3);
      if (image4) formData.append("images", image4);

      const response = await axios.post(backendURL + "/venue/add", formData, {
        headers: { token },
      });

      if (response.data.success) {
        toast.success("Venue Added Successfully");

        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);

        setVenueData({
          name: "",
          description: "",
          city: "Indore",
          area: "",
          price: "",
          contact_no: "",
          status: "Available",
          sports: [],
          amenities: [],
          rating: 0,
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const imageSlots = [
    { state: image1, setter: setImage1 },
    { state: image2, setter: setImage2 },
    { state: image3, setter: setImage3 },
    { state: image4, setter: setImage4 },
  ];

  return (
   <div className="w-full p-4 sm:p-8 bg-gray-50">
      <form onSubmit={onSubmitHandler} className="flex flex-col gap-8 max-w-4xl mx-auto">
        
        {/* --- PROFESSIONAL IMAGE UPLOADER --- */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Venue Images (Required, max 4)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {imageSlots.map((slot, index) => (
              <div key={index}>
                {slot.state ? (
                  // --- IMAGE PREVIEW with REMOVE button ---
                  <div className="relative group">
                    <img src={URL.createObjectURL(slot.state)} alt="preview" className="w-full h-32 object-cover rounded-lg shadow-md" />
                    <button type="button" onClick={() => slot.setter(false)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      <FaTrash className="w-3 h-3"/>
                    </button>
                  </div>
                ) : (
                  // --- UPLOAD SLOT ---
                  <label htmlFor={`image-upload-${index}`} className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors">
                    <FaCloudUploadAlt className="w-8 h-8 mb-2 text-green-400" />
                    <p className="text-xs text-gray-500">Slot {index + 1}</p>
                    <input id={`image-upload-${index}`} type="file" accept="image/*" onChange={(e) => slot.setter(e.target.files[0])} className="hidden" />
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* --- NAME & DESCRIPTION (with labels for clarity) --- */}
        <div>
          <label htmlFor="name" className="text-lg font-semibold text-gray-700 mb-2 block">Venue Name</label>
          <input id="name" name="name" value={venueData.name} onChange={handleInputChange} placeholder="e.g., Indori Strikers Turf" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
        </div>
        <div>
          <label htmlFor="description" className="text-lg font-semibold text-gray-700 mb-2 block">Description</label>
          <textarea id="description" name="description" value={venueData.description} onChange={handleInputChange} rows="5" placeholder="Describe the venue's key features..." required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"></textarea>
        </div>
        
        {/* --- LOCATION (grouped logically with labels) --- */}
        <div className="grid md:grid-cols-2 gap-6">
            <div>
                <label htmlFor="area" className="font-semibold text-gray-700 mb-2 block">Area / Locality</label>
                <input id="area" name="area" value={venueData.area} onChange={handleInputChange} placeholder="e.g., Vijay Nagar" required className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
                <label htmlFor="city" className="font-semibold text-gray-700 mb-2 block">City</label>
                <select id="city" name="city" value={venueData.city} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500">
                    {CITIES_OPTIONS.map(c => <option key={c}>{c}</option>)}
                </select>
            </div>
        </div>

        {/* --- STYLED CHECKBOX SECTIONS --- */}
        <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Sports Offered</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2">
                {SPORTS_OPTIONS.map(sport => (
                    <label key={sport} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-200 transition-colors">
                        <input type="checkbox" name="sports" value={sport} checked={venueData.sports.includes(sport)} onChange={handleCheckboxChange} className="w-5 h-5 accent-green-600" />
                        <span className="text-gray-700 select-none">{sport}</span>
                    </label>
                ))}
            </div>
        </div>
        <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Available Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-2">
                {AMENITIES_OPTIONS.map(a => (
                    <label key={a} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-200 transition-colors">
                        <input type="checkbox" name="amenities" value={a} checked={venueData.amenities.includes(a)} onChange={handleCheckboxChange} className="w-5 h-5 accent-green-600" />
                        <span className="text-gray-700 select-none">{a}</span>
                    </label>
                ))}
            </div>
        </div>

        {/* --- GROUPED DETAILS (with labels and icons) --- */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          <div>
            <label htmlFor="price" className="font-semibold text-gray-700 mb-2 block">Price (per hour)</label>
            <div className="relative"><FaRupeeSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input id="price" type="number" name="price" value={venueData.price} onChange={handleInputChange} placeholder="1300" required className="w-full pl-9 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" /></div>
          </div>
          <div>
            <label htmlFor="contact_no" className="font-semibold text-gray-700 mb-2 block">Contact Number</label>
            <div className="relative"><FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input id="contact_no" type="tel" name="contact_no" value={venueData.contact_no} onChange={handleInputChange} placeholder="9826012345" required className="w-full pl-9 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" /></div>
          </div>
          <div>
            <label htmlFor="status" className="font-semibold text-gray-700 mb-2 block">Status</label>
            <select id="status" name="status" value={venueData.status} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"><option>Available</option><option>Popular</option><option>New</option><option>Under Maintenance</option></select>
          </div>
          <div>
            <label className="font-semibold text-gray-700 mb-2 block">Initial Rating</label>
            <div className="flex items-center gap-1 mt-3">
              {[...Array(5)].map((_, i) => { const val = i + 1; return (
                <button key={val} type="button" onClick={() => setVenueData(prev => ({ ...prev, rating: val }))} onMouseEnter={() => setHoverRating(val)} onMouseLeave={() => setHoverRating(0)} className="text-2xl transition-colors">
                  <FaStar className={ val <= (hoverRating || venueData.rating) ? "text-amber-400" : "text-gray-300" } />
                </button>
              );})}
            </div>
          </div>
        </div>
        
        <button type="submit" className="w-full bg-green-700 text-white font-bold py-3 rounded-lg text-lg hover:bg-green-800 transition-colors duration-300 shadow-lg mt-4">Add Venue</button>
      </form>
    </div>
  );
};

export default Add;
