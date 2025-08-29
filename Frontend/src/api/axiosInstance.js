import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api", // your backend base URL
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or React context/state if implemented
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
});

export default axiosInstance;
