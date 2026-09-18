import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaLock,
  FaArrowRight,
} from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OTPAuth = ({ mode = "login" }) => {
  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" && (!/^\d*$/.test(value) || value.length > 10)) {
      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // LOGIN / SIGNUP
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      // =========================
      // SIGNUP
      // =========================

      if (mode === "register") {
        const name = formData.name.trim();
        const email = formData.email.trim().toLowerCase();
        const phone = formData.phone.trim();
        const password = formData.password;
        const confirmPassword = formData.confirmPassword;

        if (!name || !email || !phone || !password || !confirmPassword) {
          toast.error("Please fill all fields");
          setLoading(false);
          return;
        }

        if (phone.length !== 10) {
          toast.error("Phone number must be exactly 10 digits");
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          toast.error("Password must be at least 6 characters");
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          setLoading(false);
          return;
        }

        const res = await axios.post(
          `${backendURL}/auth/signup`,
          {
            name,
            email,
            phone,
            password,
            confirmPassword,
          },
          {
            withCredentials: true,
          },
        );

        if (res.data.success) {
          toast.success("Registration successful 🎉");

          setTimeout(() => {
            navigate("/login");
          }, 800);
        }

        return;
      }

      // =========================
      // LOGIN
      // =========================

      const email = formData.email.trim().toLowerCase();
      const password = formData.password;

      if (!email || !password) {
        toast.error("Email and password are required");
        setLoading(false);
        return;
      }

      const res = await axios.post(
        `${backendURL}/auth/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        },
      );

      if (res.data.success) {
        localStorage.setItem("loggedInUser", res.data.user.name);

        window.dispatchEvent(new Event("loggedInUserChanged"));

        toast.success("Login successful 🎉");

        setTimeout(() => {
          navigate("/bookings");
        }, 800);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-emerald-700 px-4 py-10">
      {/* Background */}
      <div className="absolute top-[-10%] right-[-20%] w-[500px] h-[500px] bg-emerald-100/60 rounded-full blur-[80px]"></div>

      <div className="absolute bottom-[-5%] left-[-25%] w-[600px] h-[600px] bg-emerald-100/60 rounded-full blur-[100px]"></div>

      {/* Card */}
      <div className="relative bg-white border border-gray-200 rounded-3xl shadow-xl z-10 p-8 lg:p-10 w-full max-w-lg">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {mode === "login" ? (
              <>
                Welcome <span className="text-emerald-600">Back</span>
              </>
            ) : (
              <>
                Join <span className="text-emerald-600">Now</span>
              </>
            )}
          </h2>

          <p className="text-gray-500 text-sm mt-2 font-medium">
            {mode === "login"
              ? "Login to continue booking your turf."
              : "Create an account to get started."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAME */}
          {mode === "register" && (
            <Input
              label="Full Name"
              icon={<FaUser />}
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
            />
          )}

          {/* PHONE */}
          {mode === "register" && (
            <Input
              label="Phone Number"
              icon={<FaPhoneAlt />}
              name="phone"
              placeholder="9876543210"
              value={formData.phone}
              onChange={handleChange}
            />
          )}

          {/* EMAIL */}
          <Input
            label="Email Address"
            icon={<FaEnvelope />}
            name="email"
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
          />

          {/* PASSWORD */}
          <Input
            label="Password"
            icon={<FaLock />}
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />

          {/* CONFIRM PASSWORD */}
          {mode === "register" && (
            <Input
              label="Confirm Password"
              icon={<FaLock />}
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transform transition-all hover:-translate-y-1 active:scale-[0.98] disabled:bg-emerald-400 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "LOGIN"
                : "CREATE ACCOUNT"}

            {!loading && <FaArrowRight />}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-500 text-sm font-medium">
            {mode === "login"
              ? "New to our platform?"
              : "Already have an account?"}

            <Link
              to={mode === "login" ? "/register" : "/login"}
              className="text-emerald-600 font-bold ml-1.5 hover:underline"
            >
              {mode === "login" ? "Create Account" : "Log In"}
            </Link>
          </p>
        </div>
      </div>

      <ToastContainer autoClose={1000} />
    </div>
  );
};

// =========================
// REUSABLE INPUT
// =========================

const Input = ({ label, icon, ...props }) => (
  <div>
    <label className="text-gray-500 text-xs font-bold ml-1 mb-1 block uppercase tracking-wide">
      {label}
    </label>

    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
        {icon}
      </div>

      <input
        {...props}
        required
        className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
      />
    </div>
  </div>
);

export default Auth;
