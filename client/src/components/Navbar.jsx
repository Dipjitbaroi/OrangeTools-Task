import React, { useState } from "react";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Typography,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { logout } from "../utils/auth"; // Import the logout function
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Import useSelector to access Redux state

const Navbar = ({ toggleSidebar }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  // Get user information from Redux state
  const user = useSelector((state) => state.auth.user);

  // Handle menu open
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle logout
  const handleLogout = () => {
    handleMenuClose();
    logout(); // Call the logout function
    navigate("/login"); // Navigate to the login page
  };

  return (
    <nav className="bg-[#182F59] text-white px-6 py-4 flex justify-between items-center w-full h-fit">
      {/* Hamburger Menu for Small Screens */}
      <div className="flex items-center">
        <div className="flex">
          <div className="md:hidden">
            <IconButton onClick={toggleSidebar}>
              <MenuIcon style={{ color: "white" }} />
            </IconButton>
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">CRM Dashboard</h1>
        </div>
      </div>

      {/* Profile Section */}
      <div>
        <IconButton onClick={handleMenuOpen}>
          <Avatar
            alt={user?.name || "Guest User"}
            src={user?.profilePicture || "/assets/default-profile-pic.png"}
          />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            style: { width: 300 },
          }}
        >
          {/* User Info */}
          <MenuItem disabled>
            <div className="flex flex-col">
              <Typography variant="subtitle1" fontWeight="bold">
                {user?.name || "Guest User"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {user?.email || "No email available"}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ color: "black!important", fontWeight: "bold!important" }}
              >
                Admin user: {user?.isAdmin ? "true" : "false"}
              </Typography>
            </div>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </div>
    </nav>
  );
};

export default Navbar;
