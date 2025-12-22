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
    return config;
  },
);

export default api;
