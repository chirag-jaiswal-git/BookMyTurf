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
import { Link, useNavigate } from "react-router-dom";
import ConfirmationModal from "../components/ConfirmationModal";
import { toast } from "react-toastify";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const navigate = useNavigate();

  // FORMAT TIME SLOT
  const formatTimeSlot = (slot) => {
    if (!slot) return "";

    const [start, end] = slot.split("-");

    const formatTime = (time) => {
      if (!time) return "";

      const [hour, minute] = time.split(":");

      const date = new Date();
      date.setHours(Number(hour), Number(minute));

      return date.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    };

    return `${formatTime(start)} - ${formatTime(end)}`;
  };

  // VIEW TURF DETAILS
  const handleViewDetails = (venue) => {
    if (!venue?._id) return;

    navigate(`/turfdetails/${venue._id}`, {
      state: { venue },
    });
  };

  // FETCH MY BOOKINGS
  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(`${backendURL}/booking/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBookings(res.data.bookings || []);
      } catch (error) {
        console.error("Fetch bookings error:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("loggedInUser");

          window.dispatchEvent(new Event("loggedInUserChanged"));

          navigate("/login");
          return;
        }

        toast.error(
          error.response?.data?.message || "Failed to load your bookings",
        );
      }
    };

    fetchBookings();
  }, [backendURL, navigate]);

  // CANCEL BOOKING
  const handleCancel = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.put(
        `${backendURL}/booking/cancel/${selectedBookingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(res.data.message || "Booking cancelled successfully");

      setBookings((prev) =>
        prev.map((booking) =>
          booking._id === selectedBookingId
            ? {
                ...booking,
                bookingStatus: "Cancelled",
              }
            : booking,
        ),
      );

      setIsModalOpen(false);
      setSelectedBookingId(null);
    } catch (error) {
      console.error("Cancel booking error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("loggedInUser");

        window.dispatchEvent(new Event("loggedInUserChanged"));

        navigate("/login");
        return;
      }

      toast.error(
        error.response?.data?.message || "Failed to cancel booking",
      );
    }
  };

  // ANIMATION VARIANTS
  const containerVariants = {
    hidden: {
      opacity: 0,
    },

    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },

    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },

    exit: {
      opacity: 0,
      x: -100,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-emerald-700 text-gray-900">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8 border-b border-gray-200 pb-6">
          <div className="p-4 bg-emerald-100 rounded-full shadow-sm">
            <Ticket className="text-emerald-600 w-7 h-7" />
          </div>

          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight uppercase italic">
              My <span>Fixtures</span>
            </h1>

            <p className="text-gray-100 text-sm font-medium">
              Manage your upcoming matches and turf schedules.
            </p>
          </div>
        </div>

        {/* EMPTY STATE */}
        {bookings.length === 0 ? (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
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
          /* BOOKING LIST */
          <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {bookings.map((b) => (
                <motion.div
                  key={b._id}
                  layout
                  variants={itemVariants}
                  exit="exit"
                  className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-emerald-300 transition-all duration-300 shadow-md hover:shadow-xl"
                >
                  <div className="flex flex-col md:flex-row">

                    {/* DATE */}
                    <div className="bg-emerald-600 p-6 flex flex-col items-center justify-center text-white min-w-[150px] relative overflow-hidden">
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle, #fff 1px, transparent 1px)",
                          backgroundSize: "10px 10px",
                        }}
                      />

                      <Calendar className="w-6 h-6 mb-2" />

                      <span className="text-xs font-bold uppercase tracking-widest opacity-90">
                        Date
                      </span>

                      <span className="text-xl font-black text-center">
                        {new Date(b.bookingDate).toLocaleDateString("en-IN")}
                      </span>
                    </div>

                    {/* DETAILS */}
                    <div className="flex-grow p-6 flex flex-col justify-center">

                      {/* Venue + Status */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-3">
                        <h2
                          onClick={() => handleViewDetails(b.venueId)}
                          className="text-xl font-black text-gray-800 group-hover:text-emerald-600 transition-colors uppercase cursor-pointer"
                        >
                          {b.venueId?.name || "Turf"}
                        </h2>

                        <span
                          className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                            b.bookingStatus === "Cancelled"
                              ? "bg-red-100 text-red-600 border-red-200"
                              : b.bookingStatus === "Completed"
                                ? "bg-blue-100 text-blue-600 border-blue-200"
                                : "bg-green-100 text-green-600 border-green-200"
                          }`}
                        >
                          {b.bookingStatus}
                        </span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center text-gray-500 text-sm mb-5 font-medium">
                        <MapPin
                          size={16}
                          className="mr-1 text-emerald-500"
                        />

                        {b.venueId?.location || "Location not available"}
                      </div>

                      {/* Time + Price */}
                      <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">

                        {/* Time */}
                        <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 font-semibold">
                          <Clock
                            size={18}
                            className="text-emerald-600"
                          />

                          <span className="text-sm">
                            {formatTimeSlot(b.timeSlot)}
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2 text-gray-700 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 font-semibold">
                          <IndianRupee
                            size={18}
                            className="text-emerald-600"
                          />

                          <span className="text-sm">
                            ₹{b.totalPrice}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="p-6 flex items-center justify-center border-t md:border-t-0 md:border-l border-gray-100 bg-gray-50/50">
                      {["Pending", "Confirmed"].includes(
                        b.bookingStatus,
                      ) && (
                        <motion.button
                          whileHover={{
                            scale: 1.05,
                          }}
                          whileTap={{
                            scale: 0.95,
                          }}
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

                  {/* Decorative Ticket Circles */}
                  <div className="absolute -left-3 top-1/2 w-6 h-6 bg-gray-50 rounded-full border-r border-gray-200" />

                  <div className="absolute -right-3 top-1/2 w-6 h-6 bg-gray-50 rounded-full border-l border-gray-200" />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* CONFIRMATION MODAL */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBookingId(null);
        }}
        title="Cancel Booking?"
        message="Are you sure you want to cancel this booking?"
        onConfirm={handleCancel}
      />
    </div>
  );
}