import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./auth"; // Authentication utility

const PublicRoute = ({ children }) => {
  const [authStatus, setAuthStatus] = useState(null); // State to track authentication status

  // Check authentication status asynchronously
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await isAuthenticated(); // Wait for the Promise to resolve
      setAuthStatus(isAuth); // Update authStatus state
    };
    checkAuth();
  }, []); // Run on component mount

  // Render based on authentication status
  if (authStatus === null) {
    return <div>Loading...</div>; // Show a loading indicator while waiting for auth status
  }

  return authStatus ? <Navigate to="/dashboard" /> : children; // Navigate if authenticated, else render children
};

export default PublicRoute;
