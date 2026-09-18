import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  // Admin session state
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sidebar mobile state
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const closeSidebar = () => setIsOpen(false);

  // ===============================
  // CHECK ADMIN SESSION
  // ===============================

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await axios.get(`${backendURL}/auth/admin/me`, {
          withCredentials: true,
        });

        if (response.data.success) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    );
  }

  // ===============================
  // LOGIN
  // ===============================

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <ToastContainer autoClose={800} theme="colored" position="top-center" />

        <Login setIsAdmin={setIsAdmin} />
      </div>
    );
  }

  // ===============================
  // ADMIN DASHBOARD
  // ===============================

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        closeOnClick
        pauseOnHover
      />

      {/* SIDEBAR */}
      <Sidebar
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
        closeSidebar={closeSidebar}
      />

      {/* NAVBAR */}
      <Navbar setIsAdmin={setIsAdmin} toggleSidebar={toggleSidebar} />

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-64 pt-16">
        <Routes>
          <Route path="/" element={<Navigate to="/add" replace />} />

          <Route path="/add" element={<Add />} />

          <Route path="/list" element={<List />} />

          <Route path="/bookings" element={<Bookings />} />

          <Route path="*" element={<Navigate to="/add" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
