// pages/MyBookings.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  IndianRupee,
  Trash2,
  Ticket,
} from "lucide-react";
import { Link } from "react-router-dom";
import ConfirmationModal from "../components/ConfirmationModal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const backendURL = import.meta.env.VITE_BACKEND_URL;

  const navigate = useNavigate();

  const formatTimeSlot = (slot) => {
    if (!slot) return "";

    const [start, end] = slot.split("-");

    const formatTime = (time) => {
      const [hour, minute] = time.split(":");
      const date = new Date();
      date.setHours(hour, minute);

      return date.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    };

    return `${formatTime(start)} - ${formatTime(end)}`;
  };


  // Navigate to details page
  const handleViewDetails = (venue) => {
    navigate(`/turfdetails/${venue._id}`, { state: { venue } });
  };


  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/booking/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setBookings(res.data.bookings);
      } catch (error) {
        console.error("Fetch bookings error:", error);
      }
    };

    fetchBookings();
  }, []);

  const promptCancel = (bookingId) => {
    setSelectedBookingId(bookingId);
    setIsModalOpen(true);
  };

  const handleCancel = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        `${backendURL}/booking/cancel/${selectedBookingId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.error(
        res.data.message,
      );

      // Update UI without refresh
      setBookings((prev) =>
        prev.map((b) =>
          b._id === selectedBookingId
            ? { ...b, bookingStatus: "Cancelled" }
            : b,
        ),
      );

      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to cancel booking");
      console.error(error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, x: -100, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-emerald-700 text-gray-900">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8 border-b border-gray-200 pb-6">
          <div className="p-4 bg-emerald-100 rounded-full shadow-sm">
            <Ticket className="text-emerald-600 w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase italic">
              My <span className="">Fixtures</span>
            </h1>
            <p className="text-gray-100 text-sm font-medium">
              Manage your upcoming matches and turf schedules.
            </p>
          </div>
        </div>

        {bookings.length === 0 ? (
          // --- EMPTY STATE (Light) ---
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center bg-white p-12 rounded-3xl border border-gray-200 text-center shadow-xl"
          >
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
              <Calendar className="text-gray-400 w-10 h-10" />
            </div>
            <h3 className="text-xl font-extrabold text-gray-800 mb-2">
              No Matches Scheduled
            </h3>
            <p className="text-gray-500 max-w-md mb-6 font-medium">
              The pitch is empty. Gather your squad and book a slot under the
              lights!
            </p>
            <Link
              to="/bookings"
              className="px-8 py-3 bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-1 transition-all duration-200 uppercase tracking-wide"
            >
              Book a Turf Now
            </Link>
          </motion.div>
        ) : (
          // --- BOOKING LIST (Light Tickets) ---
          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {bookings.map((b, index) => (
                <motion.div
                  key={index}
                  layout
                  variants={itemVariants}
                  exit="exit"
                  className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-emerald-300 transition-all duration-300 shadow-md hover:shadow-xl"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* LEFT: Date Box (Solid Emerald) */}
                    <div className="bg-emerald-600 p-6 flex flex-col items-center justify-center text-white min-w-[150px] relative overflow-hidden">
                      {/* Pattern Overlay */}
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle, #fff 1px, transparent 1px)",
                          backgroundSize: "10px 10px",
                        }}
                      ></div>

                      <Calendar className="w-6 h-6 mb-2" />
                      <span className="text-xs font-bold uppercase tracking-widest opacity-90">
                        Date
                      </span>
                      <span className="text-xl font-black text-center">
                        {new Date(b.bookingDate).toLocaleDateString()}
                      </span>
                    </div>

                    {/* CENTER: Details */}
                    <div className="flex-grow p-6 flex flex-col justify-center">
                      <div className="flex justify-between items-start mb-3">
                        <h2 onClick={() => handleViewDetails(b.venueId)} className="text-xl font-black text-gray-800 group-hover:text-emerald-600 transition-colors uppercase cursor-pointer">
                          {b.venueId?.name}
                        </h2>
                        {/* Booking Status Badge */}
                        <span
                          className={`text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-2 border ${
                            b.bookingStatus === "Cancelled"
                              ? "bg-red-100 text-red-600 border-red-200"
                              : "bg-green-100 text-green-600 border-green-200"
                          }`}
                        >
                          {b.bookingStatus}
                        </span>

                        {/* Refund Status Badge (Only if Cancelled) */}
                        {b.bookingStatus === "Cancelled" && (
                          <span
                            className={`text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-2 border ${
                              b.refundStatus === "Processing"
                                ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                : b.refundStatus === "Completed"
                                  ? "bg-green-100 text-green-600 border-green-200"
                                  : "bg-gray-100 text-gray-600 border-gray-200"
                            }`}
                          >
                            Refund: {b.refundStatus}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center text-gray-500 text-sm mb-5 font-medium">
                        <MapPin size={16} className="mr-1 text-emerald-500" />
                        {b.venueId?.location}
                      </div>

                      <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 font-semibold">
                          <Clock size={18} className="text-emerald-600" />
                          <span className="text-sm">
                            {formatTimeSlot(b.timeSlot)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 font-semibold">
                          <IndianRupee size={18} className="text-emerald-600" />
                          <span className="text-sm">{b.totalPrice}</span>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT: Actions */}
                    <div className="p-6 flex items-center justify-center border-t md:border-t-0 md:border-l border-gray-100 bg-gray-50/50">
                      {b.bookingStatus !== "Cancelled" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setSelectedBookingId(b._id);
                            setIsModalOpen(true);
                          }}
                          className="w-full md:w-auto px-5 py-2.5 bg-white border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 hover:border-red-300 transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                          <Trash2 size={18} />
                          <span>Cancel</span>
                        </motion.button>
                      )}
                    </div>
                  </div>

                  {/* Decorative "Ticket" Circles (Matched to Page Background) */}
                  <div className="absolute -left-3 top-1/2 w-6 h-6 bg-gray-50 rounded-full border-r border-gray-200"></div>
                  <div className="absolute -right-3 top-1/2 w-6 h-6 bg-gray-50 rounded-full border-l border-gray-200"></div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cancel Booking?"
        message="Are you sure you want to cancel this booking? Refund will be processed in 3–5 working days."
        onConfirm={handleCancel}
      />
    </div>
  );
}
