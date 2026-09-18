import axios from "axios";
import React from "react";
import { backendURL } from "../App";
import { toast } from "react-toastify";

const Login = ({ setIsAdmin }) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${backendURL}/auth/admin`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setIsAdmin(true);
        toast.success("Login Successful");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.log("Admin Login Error:", error);

      toast.error(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="bg-white shadow-md rounded-lg px-8 py-6 max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Admin Panel
        </h1>

        <form onSubmit={onSubmitHandler}>
          {/* EMAIL */}
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Email Address
            </p>

            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              placeholder="your@gmail.com"
              autoComplete="email"
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Password
            </p>

            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          {/* LOGIN BUTTON */}
          <button
            className="mt-2 w-full py-2 px-4 rounded-md text-white bg-black"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

