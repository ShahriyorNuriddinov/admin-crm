import axios from "axios";
import { getItem } from "../helpers/storege";

const api = axios.create({
  baseURL: "https://admin-crm.onrender.com",
});

api.interceptors.request.use(
  (config) => {
    const token = getItem("token");
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }

    try {
      if (
        typeof window !== "undefined" &&
        localStorage?.getItem("DEBUG_API") === "1"
      ) {
        console.log(
          "[API REQ]",
          config.method?.toUpperCase(),
          config.url,
          config
        );
      }
    } catch (e) {
      // ignore logging errors
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response logger (activated via localStorage.DEBUG_API = '1')
api.interceptors.response.use(
  (response) => {
    try {
      if (
        typeof window !== "undefined" &&
        localStorage?.getItem("DEBUG_API") === "1"
      ) {
        console.log(
          "[API RESP]",
          response.status,
          response.config.url,
          response.data
        );
      }
    } catch (e) {
      // ignore
    }
    return response;
  },
  (error) => {
    try {
      if (
        typeof window !== "undefined" &&
        localStorage?.getItem("DEBUG_API") === "1"
      ) {
        console.error(
          "[API ERROR]",
          error.response?.status,
          error.config?.url,
          error.response?.data || error.message
        );
      }
    } catch (e) {}
    return Promise.reject(error);
  }
);

export default api;
