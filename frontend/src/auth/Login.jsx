import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const API_LOC = "http://localhost:5004";
  const API_DEV = "https://saas-chatbot-builder-production.up.railway.app";
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  // ✅ Redirect if user is already logged in
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post(`${API_DEV}/user/login`, formData);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.log(err.response);
      setError(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* Left Branding Section */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 text-white items-center justify-center p-10">
        <div className="max-w-md text-center">
          <h1 className="text-4xl font-bold mb-4">AI Bot Platform</h1>
          <p className="text-lg opacity-90">
            Build, test, and deploy intelligent chatbots effortlessly.
            Your AI dashboard starts here.
          </p>
        </div>
      </div>

      {/* Right Login Section */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-100 p-6">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md backdrop-blur-lg bg-white/80 shadow-2xl rounded-2xl p-8 border border-gray-200"
        >
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Welcome Back
          </h2>

          {error && (
            <p className="text-red-600 bg-red-100 p-2 rounded mb-4 text-sm">
              {error}
            </p>
          )}

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 shadow-md"
          >
            Login
          </button>

          {/* Signup Link */}
          <p className="mt-5 text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 font-semibold hover:underline"
            >
              Signup
            </Link>
          </p>
        </form>
      </div>

    </div>
  );
};

export default Login;
