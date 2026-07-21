// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   FaUser,
//   FaPhoneAlt,
//   FaEnvelope,
//   FaLock, // Re-using for OTP icon
//   FaArrowRight,
// } from "react-icons/fa";
// import { handleError, handleSuccess } from "./utils";
// import { ToastContainer } from "react-toastify";
// import axios from "axios";

// const Register = () => {
//   const backendURL = import.meta.env.VITE_BACKEND_URL;
//   const navigate = useNavigate();

//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false); // For button loading state
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     otp: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     // Phone Constraint: Only numbers, max 10
//     if (name === "phone" && (!/^\d*$/.test(value) || value.length > 10)) {
//       return;
//     }
//     // OTP Constraint: Only numbers, max 6
//     if (name === "otp" && (!/^\d*$/.test(value) || value.length > 6)) {
//       return;
//     }
//     setFormData({ ...formData, [name]: value });
//   };

//   // STEP 1 → Send OTP
//   const sendOTP = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     if (!formData.name || !formData.phone || !formData.email) {
//       setLoading(false);
//       return handleError("All fields are required");
//     }
//     if (formData.phone.length !== 10) {
//       setLoading(false);
//       return handleError("Phone number must be 10 digits");
//     }

//     try {
//       const res = await axios.post(backendURL + "/auth/send-otp", {
//         email: formData.email,
//         name: formData.name,
//         phone: formData.phone,
//       });
//       const data = res.data;
//       if (data.success) {
//         handleSuccess("OTP sent to your email!");
//         setStep(2);
//       } else {
//         handleError(data.message || "Failed to send OTP");
//       }
//     } catch (err) {
//       handleError("Server error. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // STEP 2 → Verify OTP
//   const verifyOTP = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     if (!formData.otp || formData.otp.length < 6) {
//       setLoading(false);
//       return handleError("Please enter a valid 6-digit OTP.");
//     }

//     try {
//       const res = await axios.post(backendURL + "/auth/verify-otp", {
//         email: formData.email,
//         otp: formData.otp,
//       });
//       const data = res.data;
//       if (data.success) {
//         localStorage.setItem("token", data.token);
//         localStorage.setItem("loggedInUser", data.user.name);

//         // Trigger navbar update
//         window.dispatchEvent(new Event("loggedInUserChanged"));

//         handleSuccess("Registration successful! Redirecting...");
//         setTimeout(() => navigate("/"), 1000); // Navigate to dashboard/home
//       } else {
//         handleError(data.message || "Invalid OTP or request failed");
//       }
//     } catch (err) {
//       handleError("Server error. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-emerald-700 px-4 py-10">
//       {/* --- BACKGROUND DECOR --- */}
//       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
//         <div className="absolute top-[-10%] right-[-20%] w-[500px] h-[500px] bg-emerald-100/60 rounded-full blur-[80px]"></div>
//         <div className="absolute bottom-[-5%] left-[-25%] w-[600px] h-[600px] bg-emerald-100/60 rounded-full blur-[100px]"></div>
//       </div>

//       {/* CARD */}
//       <div className="relative bg-white border border-gray-200 rounded-3xl shadow-xl z-10 p-8 lg:p-10 w-full max-w-lg">
//         <div className="mb-6 text-center">
//           <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
//             {step === 1 ? (
//               <>
//                 Join <span className="text-emerald-600">Now</span>
//               </>
//             ) : (
//               <>
//                 Verify <span className="text-emerald-600">Your Email</span>
//               </>
//             )}
//           </h2>
//           <p className="text-gray-500 text-sm mt-2 font-medium">
//             {step === 1
//               ? "Create an account to get started."
//               : `An OTP has been sent to ${formData.email}`}
//           </p>
//         </div>

//         <form onSubmit={step === 1 ? sendOTP : verifyOTP} className="space-y-4">
//           {step === 1 && (
//             <>
//               {/* NAME */}
//               <div>
//                 <label className="text-gray-500 text-xs font-bold ml-1 mb-1 block uppercase tracking-wide">
//                   FULL NAME
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                     <FaUser className="text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     placeholder="John Doe"
//                     required
//                     className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
//                   />
//                 </div>
//               </div>

//               {/* PHONE */}
//               <div>
//                 <label className="text-gray-500 text-xs font-bold ml-1 mb-1 block uppercase tracking-wide">
//                   PHONE NUMBER
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                     <FaPhoneAlt className="text-gray-400" />
//                   </div>
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     placeholder="9876543210"
//                     required
//                     className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
//                   />
//                 </div>
//               </div>

//               {/* EMAIL */}
//               <div>
//                 <label className="text-gray-500 text-xs font-bold ml-1 mb-1 block uppercase tracking-wide">
//                   EMAIL ADDRESS
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                     <FaEnvelope className="text-gray-400" />
//                   </div>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     placeholder="name@example.com"
//                     required
//                     className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
//                   />
//                 </div>
//               </div>
//             </>
//           )}

//           {step === 2 && (
//             <>
//               {/* OTP */}
//               <div>
//                 <label className="text-gray-500 text-xs font-bold ml-1 mb-1 block uppercase tracking-wide">
//                   ONE-TIME PASSWORD (OTP)
//                 </label>
//                 <div className="relative group">
//                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                     <FaLock className="text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     name="otp"
//                     value={formData.otp}
//                     onChange={handleChange}
//                     placeholder="Enter 6-digit OTP"
//                     required
//                     className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
//                   />
//                 </div>
//               </div>
//             </>
//           )}

//           {/* SUBMIT BUTTON */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full mt-4 bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transform transition-all hover:-translate-y-1 active:scale-[0.98] disabled:bg-emerald-400 disabled:cursor-not-allowed disabled:transform-none"
//           >
//             {loading
//               ? "Please wait..."
//               : step === 1
//                 ? "SEND OTP"
//                 : "VERIFY & REGISTER"}
//             {!loading && <FaArrowRight className="text-sm" />}
//           </button>
//         </form>

//         {/* FOOTER */}
//         <div className="mt-8 pt-6 border-t border-gray-100 text-center">
//           <p className="text-gray-500 text-sm font-medium">
//             {step === 1 ? "Already have an account?" : "Didn't receive code?"}
//             <Link
//               to={step === 1 ? "/login" : "#"}
//               onClick={(e) => {
//                 if (step === 2) {
//                   e.preventDefault();
//                   sendOTP(e); // Resend OTP
//                 }
//               }}
//               className="text-emerald-600 font-bold ml-1.5 hover:underline transition-colors"
//             >
//               {step === 1 ? "Log In" : "Resend"}
//             </Link>
//           </p>
//         </div>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// };

// export default Register;

import OTPAuth from "../components/OTPAuth";

const Register = () => <OTPAuth mode="register" />;

export default Register;