import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const linkStyle = (path) =>
    `p-3 rounded-lg transition-all duration-200 ${
      location.pathname.includes(path)
        ? "bg-indigo-600 text-white shadow-md"
        : "hover:bg-gray-700 text-gray-300"
    }`;

  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 flex flex-col h-screen shadow-xl border-r border-gray-700">

      {/* Logo / Title */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold tracking-wide">
          🤖 AI Bot
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Dashboard Panel
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col gap-2">

        <Link to="/dashboard/create-bot" className={linkStyle("create-bot")}>
          🚀 Create Bot
        </Link>

        <Link to="/dashboard/test-bot" className={linkStyle("test-bot")}>
          💬 Test Bot
        </Link>

        <Link to="/dashboard/get-script" className={linkStyle("get-script")}>
          📜 Get Script
        </Link>

      </nav>

      {/* Spacer */}
      <div className="flex-grow"></div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-auto bg-red-600 hover:bg-red-700 transition duration-200 p-3 rounded-lg font-semibold shadow-md"
      >
        🔒 Logout
      </button>
    </div>
  );
};

export default Sidebar;
