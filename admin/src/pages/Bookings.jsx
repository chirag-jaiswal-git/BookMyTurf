import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendURL } from "../App";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import { io } from "socket.io-client";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ===============================
  // FETCH ALL BOOKINGS
  // ===============================

  const fetchAllBookings = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `${backendURL}/booking/all`,
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        setBookings(
          response.data.bookings || [],
        );
      } else {
        toast.error(
          response.data.message ||
            "Failed to fetch bookings",
        );
      }
    } catch (error) {
      console.error(
        "Fetch Bookings Error:",
        error,
      );

      if (error.response?.status === 401) {
        toast.error("Admin session expired");
        return;
      }

      toast.error(
        error.response?.data?.message ||
          "Error fetching bookings",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ===============================
  // UPDATE BOOKING STATUS
  // ===============================

  const updateStatus = async (id, value) => {
    try {
      const response = await axios.put(
        `${backendURL}/booking/status/${id}`,
        {
          bookingStatus: value,
        },
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        toast.success(
          "Booking status updated",
        );

        fetchAllBookings();
      } else {
        toast.error(
          response.data.message ||
            "Failed to update status",
        );
      }
    } catch (error) {
      console.error(
        "Update Booking Status Error:",
        error,
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update booking status",
      );
    }
  };

  // ===============================
  // INITIAL FETCH
  // ===============================

  useEffect(() => {
    fetchAllBookings();
  }, []);

  // ===============================
  // SOCKET CONNECTION
  // ===============================

  useEffect(() => {
    const socket = io(backendURL, {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log(
        "Connected to Socket Server",
      );
    });

    socket.on("newBooking", (data) => {
      console.log(
        "New Booking:",
        data,
      );

      toast(
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">
              ⚽
            </span>

            <h3 className="font-bold text-lg text-green-700">
              New Booking Received
            </h3>
          </div>

          <div className="space-y-1 text-sm">
            <p>
              👤 {data.customerName}
            </p>

            <p>
              🏟️ {data.venueName}
            </p>

            <p>
              🕒 {data.timeSlot}
            </p>

            <p className="font-bold text-green-600">
              💰 ₹{data.totalPrice}
            </p>
          </div>
        </div>,
        {
          type: "success",
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        },
      );

      fetchAllBookings();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // ===============================
  // BOOKING STATUS STYLES
  // ===============================

  const bookingStatusStyles = {
    Pending:
      "bg-yellow-100 text-yellow-800 border-yellow-300",

    Confirmed:
      "bg-blue-100 text-blue-800 border-blue-300",

    Completed:
      "bg-green-100 text-green-800 border-green-300",

    Cancelled:
      "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-slate-800">
          Manage Bookings
        </h2>

        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Customer
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Venue & Date
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Price
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Booking Status
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-10"
                  >
                    <div className="flex justify-center items-center gap-2 text-slate-500">
                      <FaSpinner className="animate-spin h-5 w-5" />

                      <span>
                        Loading bookings...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="hover:bg-slate-50"
                  >
                    {/* CUSTOMER */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        {booking.name}
                      </div>

                      <div className="text-sm text-slate-500">
                        {booking.email}
                      </div>
                    </td>

                    {/* VENUE & DATE */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {booking.venueId?.name}
                      </div>

                      <div className="text-sm text-slate-500">
                        {new Date(
                          booking.bookingDate,
                        ).toLocaleDateString()}{" "}
                        at{" "}
                        {booking.timeSlot}
                      </div>
                    </td>

                    {/* PRICE */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      ₹{booking.totalPrice}
                    </td>

                    {/* BOOKING STATUS */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={
                          booking.bookingStatus
                        }
                        onChange={(e) =>
                          updateStatus(
                            booking._id,
                            e.target.value,
                          )
                        }
                        className={`text-xs font-semibold rounded-full py-1 px-3 border appearance-none focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          bookingStatusStyles[
                            booking.bookingStatus
                          ]
                        }`}
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
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-10"
                  >
                    <p className="text-slate-500">
                      No bookings found.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
