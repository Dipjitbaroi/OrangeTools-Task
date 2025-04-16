import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./auth"; // Import the async authentication utility

const PrivateRoute = ({ children }) => {
  const [authStatus, setAuthStatus] = useState(null); // State to track authentication status

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await isAuthenticated(); // Wait for the Promise to resolve
      setAuthStatus(isAuth); // Update authStatus state
    };
    checkAuth();
  }, []); // Run once on component mount

  if (authStatus === null) {
    return <div>Loading...</div>; // Show a loading indicator while waiting for auth status
  }

  return authStatus ? children : <Navigate to="/login" />; // Navigate if unauthenticated, else render children
};

export default PrivateRoute;
