import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  IndianRupee,
  Star,
  PhoneCall,
  X,
  Copy,
  Sparkles, // <-- Imported Sparkles icon
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Contact Modal Component (remains unchanged)
const ContactModal = ({ isOpen, onClose, phoneNumber }) => {
  const [isCopied, setIsCopied] = useState(false);
  if (!isOpen) return null;

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(phoneNumber).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-2xl relative w-full max-w-sm text-center p-8"
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
          >
            <X size={24} />
          </button>
          <h3 className="text-lg font-medium text-gray-500">Owner's Contact</h3>
          <p className="text-4xl font-bold text-gray-800 my-4">
            <a
              href={`tel:${phoneNumber}`}
              className="hover:text-green-600 transition"
            >
              {phoneNumber}
            </a>
          </p>
          <button
            onClick={copyToClipboard}
            className="w-full bg-green-100 text-green-800 px-4 py-3 rounded-lg hover:bg-green-200 transition flex items-center justify-center gap-2 font-semibold"
          >
            <Copy size={18} />
            {isCopied ? "Copied!" : "Copy Number"}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Main TurfList Component
export default function TurfList({ venues, resetList }) {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState(null);

  useEffect(() => {
    setShowAll(false);
  }, [venues]);

  useEffect(() => {
    if (resetList) {
      setShowAll(false);
    }
  }, [resetList]);

  const displayedVenues = showAll ? venues : venues.slice(0, 3);

  const handleContactClick = (phoneNumber) => {
    setSelectedPhoneNumber(phoneNumber);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  // Navigate to details page
  const handleViewDetails = (venue) => {
    navigate(`/turfdetails/${venue._id}`, { state: { venue } });
  };

  return (
    <>
      <div className="space-y-9 mt-3">
        <AnimatePresence>
          {displayedVenues.map((venue, index) => (
            <motion.div
              key={venue.id || index}
              layout
           
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex flex-col md:flex-row bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden border border-gray-100"
            >
           
              <div className="md:w-1/4 relative aspect-video md:aspect-square">
                <img
                  src={venue.images}
                  alt={venue.name}
                  className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-r-none"
                />

                <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-3 py-1 rounded-full shadow z-10">
                  {venue.status}
                </span>
              </div>

              {/* Content Area */}
              <div className="md:w-3/4 p-4 flex flex-col justify-between">
                <div>
                  {/* ✅ New 2-column layout for details and amenities */}
                  <div className="flex flex-col md:flex-row gap-6 ">
                    {/* Left Column: Main Details */}
                    <div className="flex-grow md:w-2/3 mt-0.5">
                      <h2 className="text-2xl font-semibold text-gray-800 ">
                        {venue.name}
                      </h2>
                      <p className="text-gray-700 text-lg flex items-center gap-2 mt-6">
                        <MapPin size={20} className="text-green-600 shrink-0" />
                        {venue.location}
                      </p>
                      <p className="text-gray-600 mt-6 line-clamp-2 text-base ">
                        {venue.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 ">
                        <p className="text-gray-700 text-sm flex items-center gap-1.5 mt-7">
                          <span className="font-semibold">Sports:</span>
                          <span className="text-green-700 font-medium">
                            {venue.sports.join(", ")}
                          </span>
                        </p>
                      </div>
                      <p className="text-gray-700 flex items-center gap-2 mt-8">
                        <Star
                          size={20}
                          className="text-yellow-500 fill-yellow-500"
                        />
                        <span className="font-semibold text-lg text-gray-600">
                          {venue.rating}/5
                        </span>
                      </p>
                    </div>

                    {/* Right Column: Amenities */}
                    {venue.amenities && venue.amenities.length > 0 && (
                      <div className="md:w-1/3 md:pl-6 md:border-l border-gray-200">
                        <div className="flex items-center gap-2 mb-8">
                          <Sparkles
                            size={18}
                            className="text-green-600 shrink-0"
                          />
                          <h3 className="text-2xl font-semibold text-gray-700">
                            Amenities
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-4">
                          {venue.amenities.map((amenity, i) => (
                            <span
                              key={i}
                              className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price + Actions (at the bottom) */}
                <div className="mt-2 pt-2 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <p className="text-2xl font-bold text-green-700 flex items-center gap-1 sm:mb-0 mt-3">
                    <IndianRupee size={20} />
                    {venue.price}
                    <span className="text-lg font-normal text-gray-600">
                      / hr
                    </span>
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      onClick={() => handleViewDetails(venue)}
                      className="flex-1 sm:flex-none bg-emerald-600 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-700 transition font-semibold"
                    >
                      Explore
                    </button>

                    <button
                      onClick={() => handleContactClick(venue.contact_no)}
                      className="flex-1 sm:flex-none border border-gray-300 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-100 transition flex items-center justify-center gap-2"
                    >
                      <PhoneCall size={16} />
                      <span className="font-semibold">Contact</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {venues.length > 3 && (
          <div className="text-center">
            <button
              onClick={() => setShowAll((prev) => !prev)}
              className="mt-4 bg-white text-emerald-900 px-6 py-2 rounded-lg hover:bg-amber-100 transition font-semibold shadow border border-green-200"
            >
              {showAll ? "Show Less" : "Show More"}
            </button>
          </div>
        )}
      </div>

      <ContactModal
        isOpen={isModalOpen}
        onClose={closeModal}
        phoneNumber={selectedPhoneNumber}
      />
    </>
  );
}
