import store from "../store/store"; // Import the Redux store
import {
  login as loginAction,
  logout as logoutAction,
} from "../store/authReducer"; // Import actions from authReducer
import { configApi } from "../services/api.config";

// Check if a user is authenticated
export const isAuthenticated = async () => {
  const state = store.getState(); // Get the current state from Redux
  const user = state.auth.user; // Get the user from Redux state
  const token = localStorage.getItem("token"); // Check if a token exists in localStorage

  if (user && token) {
    return true; // User is authenticated
  } else if (!user && token) {
    try {
      // Use the query from configApi to fetch user profile
      const response = await store.dispatch(
        configApi.endpoints.getProfile.initiate()
      );

      if (response && response.data) {
        // If user data is successfully fetched
        store.dispatch(loginAction(response.data)); // Dispatch the login action
        return true;
      } else {
        // If the token is invalid, clear localStorage and Redux state
        logout(); // Call the defined logout function
        return false;
      }
    } catch (error) {
      console.error(
        "Error fetching user profile. Token might be invalid. Error details:",
        error
      );
      logout(); // Clear authentication state in case of failure
      return false;
    }
  } else {
    return false; // User is not authenticated
  }
};

// Log in the user and save the token in localStorage
export const login = (token, user) => {
  localStorage.setItem("token", token); // Save token
  store.dispatch(loginAction(user)); // Dispatch login action to store user in Redux
};

// Log out the user and clear the token
export const logout = () => {
  localStorage.removeItem("token"); // Remove token from localStorage
  sessionStorage.removeItem("token"); // Remove token from sessionStorage
  store.dispatch(logoutAction()); // Clear Redux state
  configApi.util.resetApiState(); // Reset RTK Query cache
};
