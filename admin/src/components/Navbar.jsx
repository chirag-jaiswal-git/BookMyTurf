import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FiLogOut, FiBell, FiX, FiMenu } from "react-icons/fi";
import axios from "axios";
import { backendURL } from "../App";
import socket from "../socket";
import { toast } from "react-toastify";

const Navbar = ({ setIsAdmin, toggleSidebar }) => {
  const [title, setTitle] = useState("Dashboard");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const location = useLocation();

  // ===============================
  // PAGE TITLE
  // ===============================
  useEffect(() => {
    const path = location.pathname.split("/")[1];

    switch (path) {
      case "add":
        setTitle("Add New Venue");
        break;

      case "list":
        setTitle("Venue List");
        break;

      case "bookings":
        setTitle("Turf Bookings");
        break;

      default:
        setTitle("Dashboard");
    }
  }, [location]);

  // ===============================
  // SOCKET.IO
  // ===============================
  useEffect(() => {
    const handleConnect = () => {
      socket.emit("join-admin");
    };

    const handleNewBooking = (booking) => {
      console.log("🔔 New booking received:", booking);

      setNotifications((prev) => [booking, ...prev]);

      toast(
        <div className="flex items-center gap-3">
          <div className="text-2xl bg-emerald-100 p-2 rounded-full border border-emerald-200">
            ⚽
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-xs text-slate-800 uppercase tracking-wider">
                bookMyturf • now
              </h4>
            </div>

            <p className="text-xs text-slate-900 font-bold mt-0.5">
              {booking.customerName} booked{" "}
              {booking.venueName || "a turf"}
            </p>

            <p className="text-[11px] text-slate-500 font-medium">
              ⏰ {booking.timeSlot || "N/A"} | 💰 ₹
              {booking.totalPrice || "0"}
            </p>
          </div>
        </div>,
        {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          icon: false,
          className:
            "!bg-white/90 !backdrop-blur-md !rounded-2xl !shadow-xl !border !border-slate-200/80 !p-3 !mx-auto !max-w-[340px]",
        },
      );
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

  // ===============================
  // CLEAR NOTIFICATIONS
  // ===============================
  const clearNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  // ===============================
  // ADMIN LOGOUT
  // ===============================
  const handleLogout = async () => {
    try {
      await axios.post(
        `${backendURL}/auth/admin/logout`,
        {},
        {
          withCredentials: true,
        },
      );

      setIsAdmin(false);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Admin Logout Error:", error);

      toast.error(
        error.response?.data?.message || "Logout failed",
      );
    }
  };

  return (
    <nav className="fixed top-0 left-0 md:left-64 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 z-40">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-none"
            aria-label="Open menu"
          >
            <FiMenu className="h-6 w-6" />
          </button>

          <h1 className="text-lg sm:text-xl font-bold text-gray-800">
            {title}
          </h1>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* NOTIFICATION BELL */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setShowNotifications((prev) => !prev)
              }
              className="relative flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700 transition-all duration-300"
              title="Notifications"
            >
              <FiBell className="h-5 w-5" />

              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                  {notifications.length > 99
                    ? "99+"
                    : notifications.length}
                </span>
              )}
            </button>

            {/* NOTIFICATION DROPDOWN */}
            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">

                {/* HEADER */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                  <div>
                    <h3 className="font-bold text-gray-800">
                      Notifications
                    </h3>

                    <p className="text-xs text-gray-500">
                      {notifications.length === 0
                        ? "No new notifications"
                        : `${notifications.length} new booking${
                            notifications.length > 1
                              ? "s"
                              : ""
                          }`}
                    </p>
                  </div>

                  {notifications.length > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* NOTIFICATIONS LIST */}
                {notifications.length === 0 ? (
                  <div className="px-4 py-10 text-center">
                    <FiBell className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">
                      No new bookings
                    </p>
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification, index) => (
                      <div
                        key={
                          notification.bookingId || index
                        }
                        className="px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition"
                      >
                        <div className="flex items-start gap-3">
                          <div className="shrink-0 h-9 w-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                            <FiBell className="h-4 w-4" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-semibold text-gray-800">
                                New Booking
                              </p>

                              <button
                                onClick={() => {
                                  setNotifications((prev) =>
                                    prev.filter(
                                      (_, i) => i !== index,
                                    ),
                                  );
                                }}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <FiX className="h-4 w-4" />
                              </button>
                            </div>

                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-medium text-gray-800">
                                {notification.customerName}
                              </span>{" "}
                              booked{" "}
                              <span className="font-medium text-green-700">
                                {notification.venueName}
                              </span>
                            </p>

                            <div className="mt-2 text-xs text-gray-500 space-y-1">
                              <p>
                                📅 {notification.bookingDate}
                              </p>

                              <p>
                                🕐 {notification.timeSlot}
                              </p>

                              <p className="font-semibold text-green-600">
                                ₹{notification.totalPrice}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ADMIN PROFILE */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-800 flex items-center justify-center text-white font-bold">
              A
            </div>

            <div className="hidden sm:block">
              <p className="font-semibold text-gray-700">
                Admin
              </p>

              <p className="text-xs text-gray-500">
                Administrator
              </p>
            </div>
          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex items-center justify-center h-10 w-10 bg-gray-200 text-gray-600 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300"
          >
            <FiLogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
