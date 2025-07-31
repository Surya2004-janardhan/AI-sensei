import axiosInstance from "./axiosInstance";

const getQuiz = (level) => axiosInstance.get(`/quiz/${level}`);
const submitQuiz = (data) => axiosInstance.post(`/quiz/submit`, data);

export default {
  getQuiz,
  submitQuiz,
};
