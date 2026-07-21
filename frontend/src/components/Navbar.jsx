import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { handleSuccess } from "../pages/utils";
import { ToastContainer } from "react-toastify";

export default function Navbar() {
const [loggedInUser, setLoggedInUser] = useState('');
const [isOpen, setIsOpen] = useState(false);
const navigate = useNavigate();

useEffect(() => {
const updateUser = () => {
const storedUser = localStorage.getItem('loggedInUser');
if (storedUser && storedUser !== "undefined") {
setLoggedInUser(storedUser);
} else {
setLoggedInUser(null);
}
};

// Run on first mount
updateUser();

// Listen to updates
window.addEventListener("loggedInUserChanged", updateUser);

return () => window.removeEventListener("loggedInUserChanged", updateUser);
}, []);

const handleLogout = () => {
localStorage.removeItem("token");
localStorage.removeItem("loggedInUser");
setLoggedInUser(null);

handleSuccess("User Logged out");

setTimeout(() => {
  navigate("/");
}, 800);
};

return (
<nav className="bg-white hover:text-green-500 px-1 py-1 shadow-md sticky top-0 z-50 w-full">
<div className="max-w-10xl mx-auto flex flex-wrap justify-between items-center">
      {/* Logo */}
    <Link to="/" className="flex items-center space-x-2">
      <img
        src="/images/logo1.png"
        alt="BookMyTurf Logo"
        className="h-15 w-auto object-contain"
      />
    </Link>

    {/* Desktop Menu */}
    <div className="hidden md:flex space-x-4 text-green-800 font-semibold text-lg">
      <Link to="/" className="hover:bg-green-500 p-1 hover:text-amber-50 transition rounded">Home</Link>
      <Link to="/bookings" className="hover:bg-green-500 p-1 hover:text-amber-50 transition rounded">Book Turf</Link>
      <Link to="/my-bookings" className="hover:bg-green-500 p-1 hover:text-amber-50 transition rounded">My Bookings</Link>
       <Link to="/about-us" className="hover:bg-green-500 p-1 hover:text-amber-50 transition rounded">About Us</Link>
      <Link to="/contact" className="hover:bg-green-500 p-1 hover:text-amber-50 transition rounded">Contact Us</Link>
    </div>

    {/* Auth Buttons */}
    <div className="hidden md:flex space-x-4 text-green-800 font-semibold text-lg">
      {loggedInUser ? (
        <>
          <span className="text-green-800 mt-1 font-semibold">
            Hi, {loggedInUser}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className="text-green-900 hover:text-amber-50 px-3 py-1 rounded hover:bg-green-500 transition">Login</Link>
          <Link to="/register" className="text-green-800 hover:text-amber-50 px-3 py-1 rounded hover:bg-green-500 transition">SignUp</Link>
        </>
      )}
    </div>

    {/* Mobile Menu Button */}
    <button className="md:hidden hover:text-green-900" onClick={() => setIsOpen(!isOpen)}>
      {isOpen ? <X size={28} /> : <Menu size={28} />}
    </button>
  </div>

  {/* Mobile Menu */}
  {isOpen && (
    <div className="md:hidden mt-2 space-y-2 p-3 rounded-lg font-semibold text-lg shadow-lg">
      <Link to="/" className="block hover:bg-green-500 text-green-800 transition rounded p-2">Home</Link>
      <Link to="/bookings" className="block hover:bg-green-500 text-green-800 transition rounded p-2">Book Turf</Link>
      <Link to="/my-bookings" className="block hover:bg-green-500 text-green-800 transition rounded p-2">My Bookings</Link>
       <Link to="/about-us" className="hover:bg-green-500 p-1 hover:text-amber-50 transition rounded">About Us</Link>
      <Link to="/contact" className="block hover:bg-green-500 text-green-800 transition rounded p-2">Contact Us</Link>
      
      {loggedInUser ? (
        <>
          <span className="block text-green-800 p-2">Hi, {loggedInUser}</span>
          <button
            onClick={handleLogout}
            className="block w-full bg-red-600 text-white rounded p-2"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/login" className="block hover:bg-green-500 text-green-800 rounded p-2">Login</Link>
          <Link to="/register" className="block hover:bg-green-500 text-green-800 rounded p-2">SignUp</Link>
        </>
      )}
    </div>
  )}
  <ToastContainer />
</nav>
);
}
