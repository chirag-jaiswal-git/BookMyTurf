import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { X, Clock, Calendar, CheckCircle, Info } from "lucide-react";
import axios from "axios";

export default function BookingModal({ venue, onClose }) {
  const backendURL = import.meta.env.VITE_BACKEND_URL;
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [error, setError] = useState("");
  const [bookingDone, setBookingDone] = useState(false);
  const navigate = useNavigate();

  if (!venue) return null;


  const getDuration = () => {
    if (!from || !to) return null;
    const [fh, fm] = from.split(":").map(Number);
    const [th, tm] = to.split(":").map(Number);
    const start = fh * 60 + fm;
    const end = th * 60 + tm;
    const diff = end - start;
    if (diff <= 0) return null;
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    return { hours, minutes, diffHours: diff / 60 };
  };

  const calculateTotal = () => {
    const duration = getDuration();
    if (!duration) return null;
    // Simple logic: Price * Hours
    const total = venue.price * duration.diffHours;
    return Math.round(total);
  };

  const handleConfirm = async () => {
    const duration = getDuration();
    const total = calculateTotal();

    if (!date || !from || !to || !duration) {
      setError("Please fill all details correctly.");
      toast.error("Missing booking details!");
      return;
    }

    try {
      setLoading(true);

      // ⚠️ You should get user info from auth context or localStorage
      let saved = [];

      try {
        const savedData = localStorage.getItem("bookings");
        saved = savedData ? JSON.parse(savedData) : [];
      } catch (error) {
        console.error("Invalid bookings data in localStorage");
        saved = [];
      }


      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("You must be logged in to book a slot!");
        return;
      }

      const bookingData = {
        venueId: venue._id, // IMPORTANT: must be MongoDB _id
        bookingDate: date,
        timeSlot: `${from}-${to}`,
        totalPrice: total,
      };

      const response = await axios.post(
        backendURL + "/booking/create",
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setBookingDone(true);
      console.log("RESPONSE DATA:", response.data);
      toast.success(response.data.message || "Booking confirmed!");

      setTimeout(() => {
        navigate("/my-bookings");
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Booking Error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ THIS MUST BE OUTSIDE handleConfirm
  const duration = getDuration();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-50 p-4">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">
        {/* Decorative Top Bar */}
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition"
        >
          <X size={24} />
        </button>

        {!bookingDone ? (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">
                Book Slot
              </h2>
              <p className="text-emerald-600 font-medium">{venue.name}</p>
            </div>

            {/* Date */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Date
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            {/* Time */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Start Time
                </label>
                <div className="relative">
                  <Clock
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <input
                    type="time"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  End Time
                </label>
                <div className="relative">
                  <Clock
                    className="absolute left-3 top-3 text-gray-400"
                    size={18}
                  />
                  <input
                    type="time"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-2 rounded-lg text-sm mb-4">
                <Info size={16} /> {error}
              </div>
            )}

            {/* Summary Box */}
            <div className="bg-slate-50 rounded-xl p-4 border border-gray-100">
              <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                <span>Rate per hour</span>
                <span>₹{venue.price}</span>
              </div>
              {duration && (
                <div className="flex justify-between items-center text-sm text-gray-600 mb-2 border-b border-gray-200 pb-2">
                  <span>Duration</span>
                  <span>
                    {duration.hours}h{" "}
                    {duration.minutes > 0 && `${duration.minutes}m`}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-1">
                <span className="font-bold text-slate-800">Total</span>
                <span className="text-2xl font-bold text-emerald-600">
                  ₹{calculateTotal() || 0}
                </span>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={loading}
              className="mt-6 w-full bg-emerald-600 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? "Processing..." : "CONFIRM & PAY"}
            </button>
          </>
        ) : (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Success!</h2>
            <p className="text-gray-500 mt-2">Redirecting to My Bookings...</p>
          </div>
        )}
      </div>
    </div>
  );
}
