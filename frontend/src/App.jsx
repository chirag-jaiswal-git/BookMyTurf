// App.jsx

import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Bookings from "./pages/Bookings";
import Contact from "./pages/Contact";
import MyBookings from "./pages/MyBookings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import TurfDetails from "./pages/Turfdetails";
import About from "./pages/About us";

export default function App() {
  const location = useLocation();

  // Routes where Navbar should not be displayed
  const hideNavbarRoutes = ["/login", "/register"];

  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="relative flex min-h-screen flex-col bg-gray-50">
      {/* Navbar */}
      {showNavbar && <Navbar />}

      {/* Main content */}
      <main className="flex-grow">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route path="/contact" element={<Contact />} />

          <Route path="/about-us" element={<About />} />

          {/* Protected turf details route */}
          <Route
            path="/turfdetails/:venueId"
            element={
              <ProtectedRoute>
                <TurfDetails />
              </ProtectedRoute>
            }
          />

          {/* Protected booking routes */}
          <Route
            path="/bookings"
            element={
             // <ProtectedRoute>
                <Bookings />
             // </ProtectedRoute>
            }
          />

          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          {/* Fallback route for invalid URLs */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
