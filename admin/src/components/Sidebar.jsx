// src/components/Sidebar.jsx

import React from "react";
import { NavLink } from "react-router-dom";
import { FaPlus, FaListUl, FaBox, FaTimes } from "react-icons/fa";

// We receive `isOpen` and `closeSidebar` as props from the Layout component
const Sidebar = ({ isOpen, closeSidebar }) => {
  const navLinkClasses =
    "flex items-center gap-4 px-6 py-3 text-gray-300 transition-colors duration-200 hover:text-white hover:bg-green-800 rounded-md";
  const activeLinkClasses = "bg-green-700 text-white font-semibold";

  return (
    <>
      {/* The Sidebar itself */}
      {/* 
        - translate-x-full: Hides the sidebar off-screen to the left by default.
        - isOpen ? 'translate-x-0' : '-translate-x-full': Slides it in on mobile when `isOpen` is true.
        - md:translate-x-0: On medium screens and up, it's always visible (overriding the mobile transform).
      */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-green-900 flex flex-col z-50 
                   transition-transform duration-300 ease-in-out 
                   ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo and Close Button (for mobile) */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <img
            src="/assets/AP logo.png"
            alt="Admin Logo"
            className="h-20 w-auto object-contain"
          />
          <button
            onClick={closeSidebar}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Navigation Links - added padding for better spacing */}
        <nav className="flex flex-col gap-2 p-4">
          <NavLink
            to="/add"
            className={({ isActive }) =>
              `${navLinkClasses} ${isActive ? activeLinkClasses : ""}`
            }
            onClick={closeSidebar} // Close sidebar on link click on mobile
          >
            <FaPlus className="w-5 h-5 shrink-0" />
            <span>Add Venue</span>
          </NavLink>

          <NavLink
            to="/list"
            className={({ isActive }) =>
              `${navLinkClasses} ${isActive ? activeLinkClasses : ""}`
            }
            onClick={closeSidebar}
          >
            <FaListUl className="w-5 h-5 shrink-0" />
            <span>Venue List</span>
          </NavLink>

          <NavLink
            to="/bookings"
            className={({ isActive }) =>
              `${navLinkClasses} ${isActive ? activeLinkClasses : ""}`
            }
            onClick={closeSidebar}
          >
            <FaBox className="w-5 h-5 shrink-0" />
            <span>Bookings</span>
          </NavLink>
        </nav>
      </div>

      {/* Overlay - shown only on mobile when the sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={closeSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
