import React, { useState, useEffect } from "react";
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
  // --- STATE AND SETUP (LOGIC UNCHANGED) ---
  const backendURL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    otp: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone" && (!/^\d*$/.test(value) || value.length > 10)) return;
    if (name === "otp" && (!/^\d*$/.test(value) || value.length > 6)) return;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // --- API CALLS (LOGIC UNCHANGED) ---
  const sendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { name, email, phone } = formData;
    if (!email) {
      setLoading(false);
      return toast.error("Email is required");
    }
    if (mode === "register" && (!name || !phone || phone.length !== 10)) {
      setLoading(false);
      return toast.error("Please fill all fields correctly");
    }
    try {
      const res = await axios.post(`${backendURL}/auth/send-otp`, {
        email,
        ...(mode === "register" && { name, phone }),
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setStep(2);
        setTimer(60);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!formData.otp || formData.otp.length !== 6) {
      setLoading(false);
      return toast.error("Enter valid 6-digit OTP");
    }
    try {
      const res = await axios.post(`${backendURL}/auth/verify-otp`, {
        email: formData.email,
        otp: formData.otp,
      });
      const { success, token, user, message } = res.data;
      if (success) {
        localStorage.setItem("token", token);
        localStorage.setItem("loggedInUser", user.name);
        window.dispatchEvent(new Event("loggedInUserChanged"));
        toast.success(
          mode === "login"
            ? "Login successful 🎉"
            : "Registration successful 🎉",
        );
        setTimeout(() => navigate(mode === "login" ? "/bookings" : "/"), 800);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (timer > 0) return;
    try {
      await axios.post(`${backendURL}/auth/send-otp`, {
        email: formData.email,
      });
      toast.success("OTP resent");
      setTimer(60);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  // --- JSX / RENDER (UI UPDATED) ---
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-emerald-700 px-4 py-10">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-20%] w-[500px] h-[500px] bg-emerald-100/60 rounded-full blur-[80px]"></div>
      <div className="absolute bottom-[-5%] left-[-25%] w-[600px] h-[600px] bg-emerald-100/60 rounded-full blur-[100px]"></div>

      {/* Main Card */}
      <div className="relative bg-white border border-gray-200 rounded-3xl shadow-xl z-10 p-8 lg:p-10 w-full max-w-lg">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {step === 1 ? (
              mode === "login" ? (
                <>
                  Welcome <span className="text-emerald-600">Back</span>
                </>
              ) : (
                <>
                  Join <span className="text-emerald-600">Now</span>
                </>
              )
            ) : (
              <>
                Verify <span className="text-emerald-600">Your Email</span>
              </>
            )}
          </h2>
          <p className="text-gray-500 text-sm mt-2 font-medium">
            {step === 1
              ? mode === "login"
                ? "Login or create an account to continue."
                : "Create an account to get started."
              : `An OTP has been sent to ${formData.email}`}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={step === 1 ? sendOTP : verifyOTP} className="space-y-4">
          {step === 1 && mode === "register" && (
            <>
              <Input
                label="Full Name"
                icon={<FaUser />}
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
              <Input
                label="Phone Number"
                icon={<FaPhoneAlt />}
                name="phone"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
              />
            </>
          )}

          {step === 1 && (
            <Input
              label="Email Address"
              icon={<FaEnvelope />}
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          )}

          {step === 2 && (
            <Input
              label="One-Time Password (OTP)"
              icon={<FaLock />}
              name="otp"
              placeholder="Enter 6-digit OTP"
              value={formData.otp}
              onChange={handleChange}
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transform transition-all hover:-translate-y-1 active:scale-[0.98] disabled:bg-emerald-400 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading
              ? "Please wait..."
              : step === 1
                ? "SEND OTP"
                : "VERIFY & CONTINUE"}
            {!loading && <FaArrowRight />}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          {step === 2 ? (
            <p className="text-gray-500 text-sm font-medium">
              Didn't receive code?{" "}
              <button
                onClick={resendOTP}
                disabled={timer > 0}
                className="text-emerald-600 font-bold hover:underline disabled:text-gray-400 disabled:no-underline"
              >
                {timer > 0 ? `Resend in ${timer}s` : "Resend"}
              </button>
            </p>
          ) : (
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
          )}
        </div>
      </div>
      <ToastContainer autoClose={1000}  />
    </div>
  );
};

// Reusable Themed Input Component
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

export default OTPAuth;
