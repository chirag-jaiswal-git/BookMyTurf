import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"; // ✅ 1. Import motion
import { Search, RotateCw } from "lucide-react"; // ✅ 2. Import icons

export default function SearchSection({ venues, onSearch, onReset }) {
  const [city, setCity] = useState("");
  const [sport, setSport] = useState("");

  const uniqueCities = [...new Set(venues.map((v) => v.location.split(",")[1]?.trim() || v.location))];
  const uniqueSports = [...new Set(venues.flatMap((v) => v.sports))];

  useEffect(() => {
    const filtered = venues.filter(
      (v) =>
        (city ? v.location.toLowerCase().includes(city.toLowerCase()) : true) &&
        (sport ? v.sports.some((s) => s.toLowerCase() === sport.toLowerCase()) : true)
    );
    onSearch(filtered);
  }, [city, sport, venues, onSearch]);


 
  return (
   
    <motion.div
      className="bg-white/90 shadow-lg border border-green-200 rounded-2xl p-6 mb-6 max-w-4xl mx-auto mt-6 transition backdrop-blur-sm"
    >
      <motion.h2
       
        className="text-2xl font-bold text-center text-green-700 mb-10 flex items-center justify-center gap-2"
      >
        <Search size={24} />
        Find Your Perfect Turf
      </motion.h2>

      {/* ✅ 5. Apply the staggering container and item variants */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {/* City Dropdown */}
        <motion.div >
          <label className="block text-sm font-medium text-gray-700 mb-1">Select City</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none bg-white text-gray-800"
          >
            <option value="">All Cities</option>
            {uniqueCities.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Sport Dropdown */}
        <motion.div >
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Sport</label>
          <select
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none bg-white text-gray-800"
          >
            <option value="">All Sports</option>
            {uniqueSports.map((s, i) => (
              <option key={i} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Reset Filters */}
        <motion.div  className="flex items-end">
          {/* ✅ 6. Add hover and tap animations to the button */}
          <motion.button
            onClick={() => {
              setCity("");
              setSport("");
              onSearch(venues);
              onReset?.();
            }}
            
            className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200 hover:bg-emerald-700 flex items-center justify-center gap-2"
          >
            <RotateCw size={18} />
            Reset
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}