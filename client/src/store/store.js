import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { configApi } from "../services/api.config"; // Import the API service
import authReducer from "./authReducer"; // Import the authentication reducer

const store = configureStore({
  reducer: {
    [configApi.reducerPath]: configApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(configApi.middleware),
});

setupListeners(store.dispatch);

export default store;
