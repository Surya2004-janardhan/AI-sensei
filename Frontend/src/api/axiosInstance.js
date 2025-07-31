import axios from "axios";
// import dotenv from "dotenv"
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || "http://localhost:5000/api", // your backend base URL
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or React context/state if implemented
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
});

export default axiosInstance;
