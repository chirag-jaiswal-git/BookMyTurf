import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BookingModal from "../components/BookingModal";
import { useParams } from "react-router-dom";
import {
  MapPin,
  Clock,
  Star,
  Share2,
  Heart,
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
  const { venueId } = useParams();


  // Fallback
  if (!venue) {
    return (
      <div className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-200 rounded-full blur-[120px] opacity-50 translate-x-1/3 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-yellow-200 rounded-full blur-[100px] opacity-40 -translate-x-1/3 translate-y-1/4"></div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Venue Not Found</h2>
        <button
          onClick={() => navigate("/")}
          className="text-emerald-600 font-bold hover:underline"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans pb-20">
      
      {/* --- HERO HEADER --- */}
      <div className="relative h-[50vh] bg-slate-900">
        <img
          src={venue.images?.[0] || "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e"}
          alt={venue.name}
          className="w-full h-full object-cover opacity-90"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
        
        {/* Navbar Overlay */}
        <div className="absolute top-0 w-full p-6 flex justify-between z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-slate-800 font-bold text-sm shadow-sm hover:bg-white transition"
          >
            <ChevronLeft size={18} /> BACK
          </button>
          {/* <div className="flex gap-3">
             <button className="p-2.5 bg-white/90 backdrop-blur-md rounded-full text-slate-800 hover:text-red-500 transition">
              <Heart size={20} />
            </button>
            <button className="p-2.5 bg-white/90 backdrop-blur-md rounded-full text-slate-800 hover:text-blue-500 transition">
              <Share2 size={20} />
            </button>
          </div> */}
        </div>

        {/* Title Section (Bottom of Hero) */}
        <div className="absolute bottom-0 w-full p-6 md:p-10 text-white">
          <div className="max-w-7xl mx-auto">
             <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                  {venue.status || "Available"}
                </span>
                <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded border border-white/30">
                  <Star size={12} fill="currentColor" className="text-yellow-400" />
                  {venue.rating}
                </span>
             </div>
             <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight shadow-sm mb-2">
                {venue.name}
             </h1>
             <p className="flex items-center text-slate-200 font-medium text-lg">
                <MapPin size={20} className="mr-1 text-emerald-400" />
                {venue.location}
             </p>
          </div>
        </div>
      </div>

      {/* --- CONTENT GRID --- */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Info & Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Stats Bar */}
            <div className="grid grid-cols-3 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
               <div className="text-center border-r border-gray-100">
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Sport</p>
                  <p className="text-slate-800 font-bold text-lg">{venue.sports[0]}</p>
               </div>
               <div className="text-center border-r border-gray-100">
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Type</p>
                  <p className="text-slate-800 font-bold text-lg">5v5 / 7v7</p>
               </div>
               <div className="text-center">
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Timings</p>
                  <p className="text-slate-800 font-bold text-lg">6AM - 12AM</p>
               </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Users className="text-emerald-600" size={20}/> About Venue
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {venue.description || "Enjoy a premium sporting experience. This venue features FIFA-standard artificial turf, LED floodlights for night games, and clean changing rooms."}
              </p>
            </div>

            {/* Sports Tags */}
            <div>
               <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Trophy className="text-emerald-600" size={20}/> Available Sports
               </h3>
               <div className="flex flex-wrap gap-3">
                  {venue.sports?.map((sport, i) => (
                    <span key={i} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-slate-700 font-bold shadow-sm">
                      {sport}
                    </span>
                  ))}
               </div>
            </div>

            {/* Amenities */}
            <div>
               <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <ShieldCheck className="text-emerald-600" size={20}/> Amenities
               </h3>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {venue.amenities?.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span className="text-sm font-medium text-slate-600">{item}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* RIGHT: Booking Card */}
          <div className="relative">
             <div className="sticky top-24">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                   {/* Card Header */}
                   <div className="bg-slate-900 p-6 text-white text-center">
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Hourly Rate</p>
                      <div className="flex items-center justify-center text-4xl font-extrabold">
                        <IndianRupee size={28} /> {venue.price}
                      </div>
                   </div>
                   
                   {/* Card Body */}
                   <div className="p-6">
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100">
                         <span>Status</span>
                         <span className="text-green-600 font-bold flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span> Open
                         </span>
                      </div>

                      <button
                        onClick={() => setShowBookingModal(true)}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                      >
                         <CalendarCheck size={20}/> BOOK SLOT
                      </button>

                      <div className="mt-6 text-center border-t border-gray-100 pt-4">
                         <p className="text-xs text-gray-400 font-bold uppercase mb-2">Venue Contact</p>
                         <div className="flex items-center justify-center gap-2 text-slate-700 font-bold">
                            <Phone size={16} /> {venue.contact_no}
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>

      {/* Render Modal */}
      {showBookingModal && (
        <BookingModal venue={venue} onClose={() => setShowBookingModal(false)} />
      )}

    </div>
  );
};

export default TurfDetails;