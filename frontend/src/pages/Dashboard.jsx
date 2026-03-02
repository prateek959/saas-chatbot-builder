import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import CreateBot from "./CreateBot";
import TestBot from "./TestBot";
import GetScript from "./GetScript";

const Dashboard = () => {
  const token = localStorage.getItem("token");

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-100 to-gray-200">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-6 gap-4 overflow-hidden">

        {/* Top Header */}
        <div className="bg-white/70 backdrop-blur-lg shadow-md rounded-xl p-4 flex justify-between items-center border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">
            Dashboard
          </h1>

          <div className="text-sm text-gray-600">
            Welcome back 👋
          </div>
        </div>

        {/* Page Content Container */}
        <div className="flex-1 bg-white/80 backdrop-blur-lg shadow-xl rounded-xl p-6 border border-gray-200 overflow-auto">

          <Routes>
            <Route path="create-bot" element={<CreateBot />} />
            <Route path="test-bot" element={<TestBot />} />
            <Route path="get-script" element={<GetScript />} />
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="create-bot" replace />} />
          </Routes>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;
