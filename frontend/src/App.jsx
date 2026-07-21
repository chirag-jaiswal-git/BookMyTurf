import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
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

  // 1. Define the paths where you want to HIDE the Navbar
  const hideNavbarRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset_password/:id/:token",
  ];

  // 2. Check if the current path is inside that list
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 relative">
      {/* 3. Only render Navbar if showNavbar is true */}
      {showNavbar && <Navbar />}

      <main className="flex-grow">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/turfdetails/:venueId"
            element={
              <ProtectedRoute>
                <TurfDetails />
              </ProtectedRoute>
            }
          />
          <Route path="/about-us" element={<About />} />
          {/* Protected routes */}
          <Route path="/bookings" element={<Bookings />} />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {/* Footer visible only on /bookings and /contact (Your existing logic) */}
      {/* {(location.pathname === "/bookings" || location.pathname === "/contact") && ( */}
      <Footer />
      {/* )} */}
    </div>
  );
}
