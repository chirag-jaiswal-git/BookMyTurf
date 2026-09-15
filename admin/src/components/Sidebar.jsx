// src/components/Sidebar.jsx

import React from "react";
import { NavLink } from "react-router-dom";
import { FaPlus, FaListUl, FaBox, FaTimes, FaBars } from "react-icons/fa";

// We receive `isOpen`, `toggleSidebar`, and `closeSidebar` as props from the Layout component
const Sidebar = ({ isOpen, toggleSidebar, closeSidebar }) => {
  const navLinkClasses =
    "flex items-center gap-4 px-6 py-3 text-gray-300 transition-colors duration-200 hover:text-white hover:bg-green-800 rounded-md";
  const activeLinkClasses = "bg-green-700 text-white font-semibold";

  return (
    <>
      {/* Mobile / Small Screen Hamburger Toggle Button */}
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-3 left-4 z-50 md:hidden p-2.5 rounded-lg bg-green-900 text-white shadow-lg hover:bg-green-800 transition-all focus:outline-none"
          aria-label="Open Sidebar"
        >
          <FaBars size={20} />
        </button>
      )}

      {/* The Sidebar itself */}
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
            className="md:hidden text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-2 p-4">
          <NavLink
            to="/add"
            className={({ isActive }) =>
              `${navLinkClasses} ${isActive ? activeLinkClasses : ""}`
            }
            onClick={closeSidebar}
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

      {/* Overlay - shown only on mobile/small screen when the sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={closeSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
