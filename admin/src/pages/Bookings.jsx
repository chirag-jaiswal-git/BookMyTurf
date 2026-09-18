import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendURL } from "../App";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import socket from "../socket";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // =========================
  // FETCH ALL BOOKINGS
  // =========================
  const fetchAllBookings = async (showLoader = true) => {
    if (showLoader) {
      setIsLoading(true);
    }

    try {
      const response = await axios.get(
        `${backendURL}/booking/all`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setBookings(response.data.bookings || []);
      } else {
        toast.error(
          response.data.message ||
            "Failed to fetch bookings"
        );
      }
    } catch (error) {
      console.error("Fetch Bookings Error:", error);

      if (error.response?.status === 401) {
        toast.error("Admin session expired");
        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Error fetching bookings"
      );
    } finally {
      if (showLoader) {
        setIsLoading(false);
      }
    }
  };

  // =========================
  // UPDATE BOOKING STATUS
  // =========================
  const updateStatus = async (id, value) => {
    try {
      const response = await axios.put(
        `${backendURL}/booking/status/${id}`,
        {
          bookingStatus: value,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Booking status updated");

        await fetchAllBookings(false);
      } else {
        toast.error(
          response.data.message ||
            "Failed to update status"
        );
      }
    } catch (error) {
      console.error(
        "Update Booking Status Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update booking status"
      );
    }
  };

  // =========================
  // INITIAL FETCH
  // =========================
  useEffect(() => {
    fetchAllBookings();
  }, []);


// =========================
// SOCKET.IO
// =========================
useEffect(() => {
  const handleNewBooking = (newBooking) => {
    console.log("New Booking Received:", newBooking);

    // Add new booking immediately to the table
    setBookings((prevBookings) => [
      newBooking,
      ...prevBookings,
    ]);

    toast.success("New booking received");
  };

  const handleConnect = () => {
    console.log(
      "Admin connected to Socket.IO:",
      socket.id
    );

    // Join admin room
    socket.emit("join-admin");

    console.log("Admin joined socket room");
  };

  socket.on("connect", handleConnect);

  socket.on(
    "newBooking",
    handleNewBooking
  );

  socket.on("connect_error", (error) => {
    console.error(
      "Socket connection error:",
      error
    );
  });

  // If socket is already connected
  if (socket.connected) {
    socket.emit("join-admin");
  }

  return () => {
    socket.off("connect", handleConnect);
    socket.off(
      "newBooking",
      handleNewBooking
    );
    socket.off("connect_error");
  };
}, []);


  return (
    <div className="w-full">
      {/* =========================
          LOADING
      ========================= */}
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <FaSpinner className="animate-spin text-2xl" />
        </div>
      ) : (
        <div className="w-full">
          {/* =========================
              DESKTOP TABLE
          ========================= */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="text-left p-4">
                    Customer
                  </th>

                  <th className="text-left p-4">
                    Venue
                  </th>

                  <th className="text-left p-4">
                    Date & Time
                  </th>

                  <th className="text-left p-4">
                    Price
                  </th>

                  <th className="text-left p-4">
                    Booking Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="border-b hover:bg-gray-50"
                  >
                    {/* CUSTOMER */}
                    <td className="p-4">
                      <div>
                        <p className="font-medium">
                          {booking.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {booking.email}
                        </p>
                      </div>
                    </td>

                    {/* VENUE */}
                    <td className="p-4">
                      <p className="font-medium">
                        {booking.venueId?.name ||
                          "Unknown Venue"}
                      </p>
                    </td>

                    {/* DATE & TIME */}
                    <td className="p-4">
                      <p>
                        {booking.bookingDate
                          ? new Date(
                              booking.bookingDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>

                      <p className="text-sm text-gray-500">
                        {booking.timeSlot || "N/A"}
                      </p>
                    </td>

                    {/* PRICE */}
                    <td className="p-4">
                      ₹{booking.totalPrice}
                    </td>

                    {/* STATUS */}
                    <td className="p-4">
                      <select
                        value={
                          booking.bookingStatus ||
                          "Pending"
                        }
                        onChange={(e) =>
                          updateStatus(
                            booking._id,
                            e.target.value
                          )
                        }
                        className="border rounded-md px-3 py-2 outline-none"
                      >
                        <option value="Pending">
                          Pending
                        </option>

                        <option value="Confirmed">
                          Confirmed
                        </option>

                        <option value="Completed">
                          Completed
                        </option>

                        <option value="Cancelled">
                          Cancelled
                        </option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* =========================
              MOBILE VIEW
          ========================= */}
          <div className="md:hidden space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="border rounded-lg p-4 bg-white shadow-sm"
              >
                {/* CUSTOMER */}
                <div className="mb-3">
                  <p className="font-medium">
                    {booking.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    {booking.email}
                  </p>
                </div>

                {/* VENUE */}
                <div className="mb-3">
                  <p className="text-sm text-gray-500">
                    Venue
                  </p>

                  <p className="font-medium">
                    {booking.venueId?.name ||
                      "Unknown Venue"}
                  </p>
                </div>

                {/* DATE */}
                <div className="mb-3">
                  <p className="text-sm text-gray-500">
                    Date
                  </p>

                  <p>
                    {booking.bookingDate
                      ? new Date(
                          booking.bookingDate
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                {/* TIME */}
                <div className="mb-3">
                  <p className="text-sm text-gray-500">
                    Time
                  </p>

                  <p>
                    {booking.timeSlot || "N/A"}
                  </p>
                </div>

                {/* PRICE */}
                <div className="mb-3">
                  <p className="text-sm text-gray-500">
                    Price
                  </p>

                  <p>
                    ₹{booking.totalPrice}
                  </p>
                </div>

                {/* STATUS */}
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Booking Status
                  </p>

                  <select
                    value={
                      booking.bookingStatus ||
                      "Pending"
                    }
                    onChange={(e) =>
                      updateStatus(
                        booking._id,
                        e.target.value
                      )
                    }
                    className="border rounded-md px-3 py-2 w-full outline-none"
                  >
                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Confirmed">
                      Confirmed
                    </option>

                    <option value="Completed">
                      Completed
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* =========================
              NO BOOKINGS
          ========================= */}
          {bookings.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No bookings found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Bookings;