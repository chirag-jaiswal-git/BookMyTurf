// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   FaEnvelope,
//   FaArrowRight,
// } from "react-icons/fa";
// import { handleError, handleSuccess } from "./utils";
// import { ToastContainer } from "react-toastify";
// import axios from "axios";

// const Login = () => {
//   const backendURL = import.meta.env.VITE_BACKEND_URL;
//   const navigate = useNavigate();

//   const [step, setStep] = useState(1);
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");

//   // STEP 1 → SEND OTP
//   const sendOTP = async (e) => {
//     e.preventDefault();

//     if (!email) return handleError("Email is required");

//     try {
//       const response = await axios.post(
//         backendURL + "/auth/send-otp",
//         { email }
//       );

//       if (response.data.success) {
//         handleSuccess("OTP sent to your email");
//         setStep(2);
//       } else {
//         handleError(response.data.message);
//       }
//     } catch (err) {
//       handleError("Server error");
//     }
//   };

//   // STEP 2 → VERIFY OTP
//   const verifyOTP = async (e) => {
//     e.preventDefault();

//     if (!otp) return handleError("Enter OTP");

//     try {
//       const response = await axios.post(
//         backendURL + "/auth/verify-otp",
//         { email, otp }
//       );

//       const { success, token, user, message } = response.data;

//       if (success) {
//         localStorage.setItem("token", token);
//         localStorage.setItem("loggedInUser", user.name);
//         window.dispatchEvent(new Event("loggedInUserChanged"));

//         handleSuccess("Login successful 🎉");
//         setTimeout(() => navigate("/bookings"), 800);
//       } else {
//         handleError(message);
//       }
//     } catch (err) {
//       handleError("Invalid or expired OTP");
//     }
//   };

//   return (
//     <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-emerald-700 px-4">

//       {/* Background Blobs */}
//       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
//         <div className="absolute top-[-10%] right-[-20%] w-[500px] h-[500px] bg-emerald-100/60 rounded-full blur-[80px]"></div>
//         <div className="absolute bottom-[-5%] left-[-25%] w-[600px] h-[600px] bg-emerald-100/60 rounded-full blur-[100px]"></div>
//       </div>

//       {/* Card */}
//       <div className="relative bg-white border border-gray-200 rounded-3xl shadow-xl z-10 p-10 w-full max-w-md">

//         <div className="text-center mb-8">
//           <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
//             {step === 1 ? (
//               <>Login with <span className="text-emerald-600">Email</span></>
//             ) : (
//               <>Verify <span className="text-emerald-600">OTP</span></>
//             )}
//           </h2>
//           <p className="text-gray-500 text-sm mt-2 font-medium">
//             {step === 1
//               ? "We'll send you a secure login code."
//               : `Enter the OTP sent to ${email}`}
//           </p>
//         </div>

//         {step === 1 && (
//           <form onSubmit={sendOTP} className="space-y-6">
//             <div>
//               <label className="text-gray-500 text-xs font-bold ml-1 mb-1.5 block uppercase tracking-wide">
//                 EMAIL ADDRESS
//               </label>
//               <div className="relative group">
//                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
//                   <FaEnvelope className="text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
//                 </div>
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="name@example.com"
//                   autoComplete="email"
//                   className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:border-transparent transition-all placeholder-gray-400 font-medium"
//                 />
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transform transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 mt-2"
//             >
//               SEND OTP <FaArrowRight className="text-sm" />
//             </button>
//           </form>
//         )}

//         {step === 2 && (
//           <form onSubmit={verifyOTP} className="space-y-6">
//             <div>
//               <label className="text-gray-500 text-xs font-bold ml-1 mb-1.5 block uppercase tracking-wide">
//                 ENTER OTP
//               </label>
//               <input
//                 type="text"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 placeholder="6-digit code"
//                 className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl py-3.5 px-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:border-transparent transition-all placeholder-gray-400 font-medium text-center tracking-widest"
//               />
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 transform transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2 mt-2"
//             >
//               VERIFY & LOGIN
//             </button>

//             <button
//               type="button"
//               onClick={() => setStep(1)}
//               className="w-full text-emerald-600 text-sm font-semibold hover:underline"
//             >
//               Change Email
//             </button>
//           </form>
//         )}

//         <div className="mt-8 pt-6 border-t border-gray-100 text-center">
//           <p className="text-gray-500 text-sm font-medium">
//             New to bookMyturf?
//             <Link
//               to="/register"
//               className="text-emerald-600 hover:text-emerald-700 font-bold ml-1.5 hover:underline transition-colors"
//             >
//               Create Account
//             </Link>
//           </p>
//         </div>
//       </div>

//       <ToastContainer />
//     </div>
//   );
// };

// export default Login;

import OTPAuth from "../components/OTPAuth";

function Login() {
  return <OTPAuth mode="login" />;
}

export default Login;
