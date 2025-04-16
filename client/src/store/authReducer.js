import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // By default, no user is logged in
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload; // Save user data to the state
    },
    logout(state) {
      state.user = null; // Clear user data
    },
  },
});

export const { login, logout } = authSlice.actions; // Export actions
export default authSlice.reducer; // Export reducer
