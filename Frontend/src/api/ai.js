import axiosInstance from "./axiosInstance";

const askTeacher = (data) => axiosInstance.post("/ai/teacher", data);
const grammarTeacher = (data) => axiosInstance.post("/ai/grammar", data);
const kanjiTeacher = (data) => axiosInstance.post("/ai/kanjiTeacher", data);

export default {
  askTeacher,
  grammarTeacher,
  kanjiTeacher,
};
