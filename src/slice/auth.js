import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isLoading: false,
  loggedIn: !!localStorage.getItem("token"),
  user: JSON.parse(localStorage.getItem("user")) || null,
  error: null,
};
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    LogginUserStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    LogginUserSuccess: (state, action) => {
      state.loggedIn = true;
      state.isLoading = false;
      state.user = action.payload;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    LogginUserFailure: (state, action) => {
      state.isLoading = false;
      state.loggedIn = false;
      state.error = action.payload;
    },
    Logout: (state) => {
      state.loggedIn = false;
      state.error = null;
      localStorage.removeItem("token");
    },
    UpdateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
});

export const { LogginUserStart, LogginUserSuccess, LogginUserFailure, Logout, UpdateUser } = authSlice.actions;
export default authSlice.reducer;
