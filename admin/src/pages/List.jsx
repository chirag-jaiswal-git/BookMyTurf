import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendURL } from "../App";
import { toast } from "react-toastify";
import { FaTrash, FaPlus, FaSadTear } from "react-icons/fa";
import { Link } from "react-router-dom";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH VENUES
  const fetchList = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(`${backendURL}/venue/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setList(response.data.venues);
      } else {
        toast.error(response.data.message || "Could not fetch venues");
      }
    } catch (error) {
      console.error("Error fetching venues:", error);

      toast.error(error.response?.data?.message || "Error fetching venues");
    } finally {
      setLoading(false);
    }
  };

  // REMOVE VENUE
  const removeVenue = async (venueId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this venue? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await axios.post(
        `${backendURL}/venue/remove`,
        {
          id: venueId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        toast.success("Venue removed successfully!");
        fetchList();
      } else {
        toast.error(response.data.message || "Failed to remove the venue");
      }
    } catch (error) {
      console.error("Error removing venue:", error);

      toast.error(error.response?.data?.message || "Error removing venue");
    }
  };

  useEffect(() => {
    fetchList();
  }, [token]);

  // LOADING
  if (loading) {
    return (
      <div className="w-full p-8 flex justify-center items-center">
        <p className="text-lg text-gray-500">Loading venues...</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4 sm:p-8 bg-gray-50">
      <div className="bg-white p-6 rounded-xl shadow-lg">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">All Venues</h1>

            <p className="text-sm text-gray-500">{list.length} venues found</p>
          </div>

          <Link
            to="/add"
            className="flex items-center gap-2 bg-green-700 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
          >
            <FaPlus />
            <span>Add Venue</span>
          </Link>
        </div>

        {/* EMPTY STATE */}
        {list.length === 0 ? (
          <div className="text-center py-16">
            <FaSadTear className="mx-auto text-5xl text-gray-300 mb-4" />

            <h2 className="text-xl font-semibold text-gray-600">
              No Venues Found
            </h2>

            <p className="text-gray-400 mt-2">
              Get started by adding your first venue.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-200">
              {/* TABLE HEADER */}
              <div className="grid grid-cols-[0.5fr_2fr_1.5fr_1fr_1fr_1fr] items-center gap-4 py-3 px-4 bg-gray-100 rounded-t-lg">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Image
                </p>

                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Venue
                </p>

                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Sports
                </p>

                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Price
                </p>

                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Status
                </p>

                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider text-center">
                  Action
                </p>
              </div>

              {/* VENUE ROWS */}
              {list.map((item) => (
                <div
                  key={item._id}
                  className="grid grid-cols-[0.5fr_2fr_1.5fr_1fr_1fr_1fr] items-center gap-4 py-3 px-4 border-b"
                >
                  {/* IMAGE */}
                  <img
                    src={item.images?.[0]}
                    alt={item.name}
                    className="w-16 h-12 object-cover rounded-md"
                  />

                  {/* VENUE */}
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>

                    <p className="text-xs text-gray-500">{item.location}</p>
                  </div>

                  {/* SPORTS */}
                  <div className="flex flex-wrap gap-1">
                    {item.sports?.slice(0, 3).map((sport) => (
                      <span
                        key={sport}
                        className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full"
                      >
                        {sport}
                      </span>
                    ))}
                  </div>

                  {/* PRICE */}
                  <p className="text-gray-700">
                    ₹{item.price?.toLocaleString("en-IN")}
                  </p>

                  {/* STATUS */}
                  <div>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        item.status === "Popular"
                          ? "bg-amber-100 text-amber-800"
                          : item.status === "Available"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* DELETE */}
                  <div className="text-center">
                    <button
                      onClick={() => removeVenue(item._id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default List;
