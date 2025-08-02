import axiosInstance from "./axiosInstance";

const askTeacher = (data) => axiosInstance.post("/ai/teacher", data); // Example endpoint
const grammarTeacher =  (data) => axiosInstance.post("/ai/grammar", data); // Example endpoint 
export default {
  askTeacher,
  grammarTeacher
};
