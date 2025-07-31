import axiosInstance from "./axiosInstance";

const getHistory = () => axiosInstance.get("/history");

export default {
  getHistory,
};
