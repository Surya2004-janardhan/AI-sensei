import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://ai-sensei-lej2.onrender.com", // your backend base URL
  // "http://localhost:3000/api"
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or React context/state if implemented
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
});

export default axiosInstance;
