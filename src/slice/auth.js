import { createSlice } from "@reduxjs/toolkit";
import { setItem } from "../helpers/storege";

const initialState = {
  isLoading: false,
  loggedIn: false,
  user: null,
  error: null,
};
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    LogginUserStart: (state) => {
      state.isLoading = true;
    },
    LogginUserSuccess: (state, action) => {
      state.loggedIn = true;
      state.isLoading = false;
      state.user = action.payload;
     setItem("token", action.payload.token)
    },
    LogginUserFailure: (state, action) => {
      state.loggedIn = false;
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});
export const { LogginUserStart, LogginUserSuccess, LogginUserFailure } =
  authSlice.actions;
export default authSlice.reducer;
