import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import styles for toastify

// Component Imports
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./components/Login";

// Page Imports
import Add from "./pages/Add";
import List from "./pages/List";
import Bookings from "./pages/Bookings";

export const backendURL = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  // --- Token Management ---
const [token, setToken] = useState(localStorage.getItem("adminToken") || "");

 useEffect(() => {
  if (token) {
    localStorage.setItem("adminToken", token);
  } else {
    localStorage.removeItem("adminToken");
  }
}, [token]);

  // --- Render Logic ---

  if (!token) {
    // If no token, render the centered Login page
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <ToastContainer autoClose={800} theme="colored" />
        <Login setToken={setToken} />
      </div>
    );
  }

  // If token exists, render the full admin dashboard layout
  return (
    <div className="flex min-h-screen bg-gray-50">
      <ToastContainer autoClose={1000} theme="colored" />

      {/* Sidebar and Navbar are fixed and sit outside the main scrollable area */}
      <Sidebar />
      <Navbar setToken={setToken} />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 pt-16">
        {/* The Routes are wrapped in the main content area */}
        <Routes>
          {/* Default route redirects to a primary page */}
          <Route path="/" element={<Navigate to="/add" />} />
          <Route path="/add" element={<Add token={token} />} />
          <Route path="/list" element={<List token={token} />} />
          <Route path="/bookings" element={<Bookings token={token} />} />
          {/* A catch-all route for any other path */}
      
        </Routes>
      </main>
    </div>
  );
};

export default App;
