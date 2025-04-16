import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles"; // Import ThemeProvider
import theme from "./theme"; // Import the custom theme
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import JobsPage from "./components/JobsPage";
import PrivateRoute from "./utils/PrivateRoute";
import PublicRoute from "./utils/PublicRoute";
import { isAuthenticated } from "./utils/auth";
import MainLayout from "./components/MainLayout"; // Import MainLayout
import Docs from "./components/Docs";

const App = () => {
  return (
    <ThemeProvider theme={theme}> {/* Wrap with ThemeProvider */}
      <Router>
        <Routes>
          {/* Redirect to appropriate page based on authentication */}
          <Route
            path="/"
            element={isAuthenticated() ? <Navigate to="/home" /> : <Navigate to="/login" />}
          />

          {/* Public routes for Login and Register */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected routes using MainLayout */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Home />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <PrivateRoute>
                <MainLayout>
                  <JobsPage />
                </MainLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <PrivateRoute>
                <MainLayout>
                  <Docs/>
                </MainLayout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
