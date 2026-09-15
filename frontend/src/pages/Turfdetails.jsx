// pages/Turfdetails.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookingModal from "../components/BookingModal";
import {
  MapPin,
  Star,
  Phone,
  IndianRupee,
  ChevronLeft,
  Trophy,
  Users,
  ShieldCheck,
  CalendarCheck,
} from "lucide-react";

const TurfDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const venue = location.state?.venue;
  const [showBookingModal, setShowBookingModal] = useState(false);

  // ===============================
  // VENUE NOT FOUND
  // ===============================
  if (!venue) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-emerald-50 px-4 text-center">
        <div className="absolute right-0 top-0 h-[500px] w-[500px] translate-x-1/3 -translate-y-1/4 rounded-full bg-emerald-200 opacity-50 blur-[120px]" />

        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] -translate-x-1/3 translate-y-1/4 rounded-full bg-yellow-200 opacity-40 blur-[100px]" />

        <div className="relative z-10">
          <h2 className="mb-4 text-2xl font-bold text-slate-800">
            Venue Not Found
          </h2>

          <p className="mb-6 text-gray-500">
            The venue details are unavailable or the page was opened directly.
          </p>

          <button
            onClick={() => navigate("/bookings")}
            className="font-bold text-emerald-600 transition hover:underline"
          >
            Browse Available Turfs
          </button>
        </div>
      </div>
    );
  }

  const sports = venue.sports || [];
  const amenities = venue.amenities || [];
  const venueStatus = venue.status || "Available";

  const isAvailable = venueStatus.toLowerCase() !== "under maintenance";
  return (
    <div className="min-h-screen pb-20 font-sans">
      {/* ===============================
          HERO HEADER
      =============================== */}
      <div className="relative h-[50vh] min-h-[400px] bg-slate-900">
        <img
          src={
            venue.images?.[0] ||
            "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e"
          }
          alt={venue.name || "Turf image"}
          className="h-full w-full object-cover opacity-90"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />

        {/* Back Button */}
        <div className="absolute left-0 top-0 z-10 w-full p-4 sm:p-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-slate-800 shadow-sm backdrop-blur-md transition hover:bg-white"
          >
            <ChevronLeft size={18} />
            BACK
          </button>
        </div>

        {/* Hero Title */}
        <div className="absolute bottom-0 w-full p-5 text-white sm:p-6 md:p-10">
          <div className="mx-auto max-w-7xl">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span
                className={`rounded px-2 py-1 text-xs font-bold uppercase tracking-wider ${
                  isAvailable
                    ? "bg-emerald-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {venueStatus}
              </span>

              <span className="flex items-center gap-1 rounded border border-white/30 bg-white/20 px-2 py-1 text-xs font-bold text-white backdrop-blur-md">
                <Star
                  size={12}
                  fill="currentColor"
                  className="text-yellow-400"
                />
                {venue.rating ?? "N/A"}/5
              </span>
            </div>

            <h1 className="mb-2 text-3xl font-extrabold tracking-tight shadow-sm md:text-5xl">
              {venue.name || "Unnamed Turf"}
            </h1>

            <p className="flex items-center text-base font-medium text-slate-200 sm:text-lg">
              <MapPin size={20} className="mr-1 shrink-0 text-emerald-400" />

              {venue.location || "Location not available"}
            </p>
          </div>
        </div>
      </div>

      {/* ===============================
          CONTENT GRID
      =============================== */}
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* ===============================
              LEFT - INFORMATION
          =============================== */}
          <div className="space-y-8 lg:col-span-2">
            {/* QUICK STATS */}
            <div className="grid grid-cols-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4">
              <div className="border-r border-gray-100 px-2 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 sm:text-xs">
                  Sport
                </p>

                <p className="mt-1 truncate text-sm font-bold text-slate-800 sm:text-lg">
                  {sports[0] || "N/A"}
                </p>
              </div>

              <div className="border-r border-gray-100 px-2 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 sm:text-xs">
                  Type
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800 sm:text-lg">
                  5v5 / 7v7
                </p>
              </div>

              <div className="px-2 text-center">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 sm:text-xs">
                  Timings
                </p>

                <p className="mt-1 text-sm font-bold text-slate-800 sm:text-lg">
                  6AM - 12AM
                </p>
              </div>
            </div>

            {/* ABOUT VENUE */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
                <Users className="text-emerald-600" size={20} />
                About Venue
              </h3>

              <p className="leading-relaxed text-slate-600">
                {venue.description ||
                  "Enjoy a premium sporting experience at this venue. Check the available sports and amenities before booking your slot."}
              </p>
            </div>

            {/* AVAILABLE SPORTS */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
                <Trophy className="text-emerald-600" size={20} />
                Available Sports
              </h3>

              {sports.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {sports.map((sport, index) => (
                    <span
                      key={`${sport}-${index}`}
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2 font-bold text-slate-700 shadow-sm"
                    >
                      {sport}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  Sports information not available.
                </p>
              )}
            </div>

            {/* AMENITIES */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-800">
                <ShieldCheck className="text-emerald-600" size={20} />
                Amenities
              </h3>

              {amenities.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {amenities.map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
                    >
                      <div className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />

                      <span className="text-sm font-medium text-slate-600">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No amenities listed for this venue.
                </p>
              )}
            </div>
          </div>

          {/* ===============================
              RIGHT - BOOKING CARD
          =============================== */}
          <div className="relative">
            <div className="sticky top-24">
              <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                {/* CARD HEADER */}
                <div className="bg-slate-900 p-6 text-center text-white">
                  <p className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-400">
                    Hourly Rate
                  </p>

                  <div className="flex items-center justify-center text-4xl font-extrabold">
                    <IndianRupee size={28} />
                    {venue.price ?? 0}
                  </div>

                  <p className="mt-1 text-sm text-slate-400">per hour</p>
                </div>

                {/* CARD BODY */}
                <div className="p-6">
                  {/* STATUS */}
                  <div className="mb-6 flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm text-gray-500">
                    <span>Status</span>

                    <span
                      className={`flex items-center gap-1 font-bold ${
                        isAvailable ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      <span
                        className={`h-2 w-2 animate-pulse rounded-full ${
                          isAvailable ? "bg-green-600" : "bg-red-600"
                        }`}
                      />

                      {isAvailable ? "Open" : "Unavailable"}
                    </span>
                  </div>

                  {/* BOOK BUTTON */}
                  <button
                    onClick={() => setShowBookingModal(true)}
                    disabled={!isAvailable}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-4 text-lg font-bold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none"
                  >
                    <CalendarCheck size={20} />

                    {isAvailable ? "BOOK SLOT" : "UNAVAILABLE"}
                  </button>

                  {/* CONTACT */}
                  <div className="mt-6 border-t border-gray-100 pt-4 text-center">
                    <p className="mb-2 text-xs font-bold uppercase text-gray-400">
                      Venue Contact
                    </p>

                    <div className="flex items-center justify-center gap-2 font-bold text-slate-700">
                      <Phone size={16} />

                      {venue.contact_no || "Not available"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===============================
          BOOKING MODAL
      =============================== */}
      {showBookingModal && (
        <BookingModal
          venue={venue}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
};

export default TurfDetails;
