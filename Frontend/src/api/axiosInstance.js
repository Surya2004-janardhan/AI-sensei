import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  // baseURL: "https://ai-sensei-lej2.onrender.com/api", // your backend base URL
  // baseURL: "https://ai-sensei-lej2.onrender.com/api",
  // baseURL: "https://ai-sensei-lej2.onrender.com",

  // https://ai-sensei-lej2.onrender.com/
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or React context/state if implemented
  if (token) {
    config.headers["x-auth-token"] = token;
  }
  return config;
});

export default axiosInstance;
