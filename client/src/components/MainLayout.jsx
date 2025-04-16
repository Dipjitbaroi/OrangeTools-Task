import React, { useState } from "react";
import Navbar from "./Navbar"; // Import Navbar component
import Sidebar from "./Sidebar"; // Import Sidebar component

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle state

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev); // Toggle sidebar visibility
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Navbar */}
      <Navbar toggleSidebar={toggleSidebar} />

      {/* Layout container for Sidebar and Main Content */}
      <div className="relative flex flex-row w-full flex-grow">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} />

        {/* Main Content */}
        <main className="flex-grow overflow-y-auto p-6 bg-gray-100">
          {children} {/* Render dynamic content passed to MainLayout */}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
