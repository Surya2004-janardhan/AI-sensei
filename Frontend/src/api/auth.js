import axiosInstance from "./axiosInstance";

export const register = (data) => axiosInstance.post("/auth/register", data);
export const login = (data) => axiosInstance.post("/auth/login", data);
export const getProfile = () => axiosInstance.get("/user/profile");
export const updateProfile = (data) => axiosInstance.put("/user/profile", data);
