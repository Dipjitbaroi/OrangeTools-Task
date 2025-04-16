import React from "react";
import { useNavigate } from "react-router-dom";
import { Description, Dashboard, Groups } from "@mui/icons-material";
import { useSelector } from "react-redux";

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  return (
    <div
      className={`bg-white text-[#182F59] shadow-xl w-64 min-h-full md:w-20 z-40 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } 
      md:translate-x-0 ${isOpen ? "fixed top-22 left-0" : ""}`} // Absolute on mobile, relative on larger screens
    >
      {/* Sidebar Links */}
      <div className="flex flex-col items-center h-full">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 hover:text-blue-400 flex flex-col items-center py-4"
        >
          <Dashboard fontSize="large" />
          <span className="text-sm">Dashboard</span>
        </button>

        <button
          onClick={() => navigate("/customers")}
          className="mb-6 hover:text-blue-400 flex flex-col items-center py-4"
        >
          <Groups fontSize="large" />
          <span className="text-sm">Customers</span>
        </button>

        {/* Show Upload button only if user is an Admin */}
        {user?.isAdmin && (
          <button
            onClick={() => navigate("/upload")}
            className="mb-6 hover:text-blue-400 flex flex-col items-center py-4"
          >
            <Description fontSize="large" />
            <span className="text-sm">Upload</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
