import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendURL } from "../App";
import { toast } from "react-toastify";
import {
  FaSpinner,
  FaCalendarAlt,
  FaClock,
  FaRupeeSign,
  FaUser,
  FaBuilding,
} from "react-icons/fa";
import socket from "../socket";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Status color pill helper
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Cancelled":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  // Safe data mapper for Socket payload vs DB payload
  const formatBookingData = (data) => {
    return {
      _id: data._id || data.bookingId || Date.now().toString(),
      name: data.name || data.customerName || "Guest Customer",
      email: data.email || data.customerEmail || "N/A",
      venueId:
        typeof data.venueId === "object"
          ? data.venueId
          : { name: data.venueName || "Turf Venue" },
      bookingDate: data.bookingDate || new Date().toISOString(),
      timeSlot: data.timeSlot || "N/A",
      totalPrice: data.totalPrice || 0,
      bookingStatus: data.bookingStatus || "Pending",
    };
  };

  // =========================
  // FETCH ALL BOOKINGS
  // =========================
  const fetchAllBookings = async (showLoader = true) => {
    if (showLoader) setIsLoading(true);

    try {
      const response = await axios.get(`${backendURL}/booking/all`, {
        withCredentials: true,
      });

      if (response.data.success) {
        const formatted = (response.data.bookings || []).map(formatBookingData);
        setBookings(formatted);
      } else {
        toast.error(response.data.message || "Failed to fetch bookings");
      }
    } catch (error) {
      console.error("Fetch Bookings Error:", error);
      if (error.response?.status === 401) {
        toast.error("Admin session expired");
        return;
      }
      toast.error(error.response?.data?.message || "Error fetching bookings");
    } finally {
      if (showLoader) setIsLoading(false);
    }
  };

  // =========================
  // UPDATE BOOKING STATUS
  // =========================
  const updateStatus = async (id, value) => {
    // Optimistic UI update
    const previousBookings = [...bookings];
    setBookings((prev) =>
      prev.map((b) => (b._id === id ? { ...b, bookingStatus: value } : b)),
    );

    try {
      const response = await axios.put(
        `${backendURL}/booking/status/${id}`,
        { bookingStatus: value },
        { withCredentials: true },
      );

      if (response.data.success) {
        toast.success(`Booking status changed to ${value}`);
      } else {
        setBookings(previousBookings);
        toast.error(response.data.message || "Failed to update status");
      }
    } catch (error) {
      setBookings(previousBookings);
      console.error("Update Booking Status Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update booking status",
      );
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  // =========================
  // SOCKET.IO REALTIME LISTENER
  // =========================
  useEffect(() => {
    const handleNewBooking = (newBooking) => {
      const formatted = formatBookingData(newBooking);
      setBookings((prevBookings) => [formatted, ...prevBookings]);
    };

    const handleConnect = () => {
      socket.emit("join-admin");
    };

    socket.on("connect", handleConnect);
    socket.on("newBooking", handleNewBooking);

    if (socket.connected) {
      socket.emit("join-admin");
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("newBooking", handleNewBooking);
    };
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6">
      {isLoading ? (
        <div className="flex flex-col justify-center items-center h-64 gap-3 text-slate-500">
          <FaSpinner className="animate-spin text-3xl text-emerald-600" />
          <p className="text-sm font-medium">Fetching active bookings...</p>
        </div>
      ) : (
        <div className="w-full space-y-6">
          {/* HEADER METRICS */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                Booking Requests
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Manage live turf reservations and real-time updates
              </p>
            </div>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-200/60">
              Total: {bookings.length}
            </span>
          </div>

          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block overflow-hidden bg-white rounded-xl border border-slate-200 shadow-sm">
            <table className="w-full border-collapse text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Venue</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {/* CUSTOMER */}
                    <td className="p-4">
                      <div className="font-medium text-slate-900">
                        {booking.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {booking.email}
                      </div>
                    </td>

                    {/* VENUE */}
                    <td className="p-4 font-medium text-slate-800">
                      {booking.venueId?.name || "Unknown Venue"}
                    </td>

                    {/* DATE & TIME */}
                    <td className="p-4">
                      <div className="text-slate-900 font-medium">
                        {booking.bookingDate
                          ? new Date(booking.bookingDate).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "N/A"}
                      </div>
                      <div className="text-xs text-slate-500">
                        {booking.timeSlot}
                      </div>
                    </td>

                    {/* PRICE */}
                    <td className="p-4 font-semibold text-slate-900">
                      ₹{booking.totalPrice}
                    </td>

                    {/* STATUS SELECT */}
                    <td className="p-4">
                      <select
                        value={booking.bookingStatus}
                        onChange={(e) =>
                          updateStatus(booking._id, e.target.value)
                        }
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border outline-none cursor-pointer transition-all ${getStatusBadgeClass(
                          booking.bookingStatus,
                        )}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS VIEW */}
          <div className="md:hidden space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                      <FaUser className="text-slate-400 text-xs" />{" "}
                      {booking.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {booking.email}
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-900">
                    ₹{booking.totalPrice}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <FaBuilding className="text-slate-400" />
                    <span className="truncate">
                      {booking.venueId?.name || "Turf"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FaCalendarAlt className="text-slate-400" />
                    <span>
                      {booking.bookingDate
                        ? new Date(booking.bookingDate).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                            },
                          )
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <FaClock className="text-slate-400" />
                    <span>{booking.timeSlot}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    Status
                  </span>
                  <select
                    value={booking.bookingStatus}
                    onChange={(e) => updateStatus(booking._id, e.target.value)}
                    className={`text-xs font-semibold px-3 py-1 rounded-lg border outline-none ${getStatusBadgeClass(
                      booking.bookingStatus,
                    )}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* EMPTY STATE */}
          {bookings.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-500">
              <p className="text-base font-medium">
                No bookings registered yet
              </p>
              <p className="text-xs text-slate-400 mt-1">
                New incoming real-time bookings will show up here immediately
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Bookings;
