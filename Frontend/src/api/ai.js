import axiosInstance from "./axiosInstance";

const askTeacher = (data) => axiosInstance.post("/ai/teacher", data); // Example endpoint

export default {
  askTeacher,
};
