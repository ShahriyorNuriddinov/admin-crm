import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/auth";
import loadingReducer from "../slice/loading"
export default configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
  },
});
