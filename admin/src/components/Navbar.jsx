import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';

const Navbar = ({ setToken }) => {
  const [title, setTitle] = useState('Dashboard');
  const location = useLocation();

  // This effect updates the title based on the current page route
  useEffect(() => {
    const path = location.pathname.split('/')[1]; // e.g., "add", "list", "orders"
    switch (path) {
      case 'add':
        setTitle('Add New Venue');
        break;
      case 'list':
        setTitle('Venue List');
        break;
      case 'bookings':
        setTitle('Turf Bookings');
        break;
    }
  }, [location]);

  return (
    <nav 
      className="fixed top-0 left-0 md:left-64 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 z-40"
    >
      <div className="flex items-center justify-between h-full px-6">
        
        {/* Left Side: Context-Aware Page Title */}
        <h1 className="text-xl font-bold text-gray-800">
          {title}
        </h1>

        {/* Right Side: User Profile & Logout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-800 flex items-center justify-center text-white font-bold">
              A {/* Placeholder for Admin initial */}
            </div>
            <div className="hidden sm:block">
              <p className="font-semibold text-gray-700">Admin</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          
          <button
            onClick={() => {
              localStorage.removeItem("adminToken");
              setToken("");
            }}
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